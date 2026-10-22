export const TRACKER_QUERY = [
  'SELECT id, issue_key, local_key, type, title, status,',
  "  CASE WHEN json_valid(data) THEN json_extract(data, '$.startDate') ELSE NULL END AS start_date",
  '  FROM tracker_items',
  '  WHERE workspace = $1 AND COALESCE(archived, 0) = 0 AND deleted_at IS NULL',
  '  ORDER BY title COLLATE NOCASE',
  '  LIMIT 250',
].join('\n');

export const CONSOLE_ITEM_URL = 'https://console.nimbalyst.com/app/item/';

const snapshotsByWorkspace = new Map();
const listenersByWorkspace = new Map();

function missingWorkspaceSnapshot() {
  return {
    status: 'error',
    workspacePath: null,
    items: [],
    message: 'Không xác định được workspace của editor; danh sách tracker bị ẩn để tránh lộ dữ liệu workspace khác. Link thủ công vẫn dùng được.',
  };
}

function idleSnapshot(workspacePath) {
  return {
    status: 'idle',
    workspacePath,
    items: [],
    message: 'Mở Calendar từ launcher để tải danh sách tracker trong workspace này.',
  };
}

function publish(workspacePath, snapshot) {
  const scoped = { ...snapshot, workspacePath };
  snapshotsByWorkspace.set(workspacePath, scoped);
  for (const listener of listenersByWorkspace.get(workspacePath) || []) {
    try { listener(scoped); } catch { /* One renderer listener must not break the read-only adapter. */ }
  }
  return scoped;
}

function validDate(value) {
  if (typeof value !== 'string') return null;
  const date = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > lengths[month - 1]) return null;
  return date;
}

function rowAliases(row) {
  return [row.id, row.issue_key, row.local_key]
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => 'nimbalyst://' + encodeURIComponent(value.trim()));
}

export function mapTrackerRow(row) {
  if (!row || typeof row.id !== 'string' || !row.id.trim()) return null;
  const title = typeof row.title === 'string' && row.title.trim() ? row.title.trim() : 'Tracker chưa có tiêu đề';
  const aliases = rowAliases(row);
  return {
    id: row.id,
    title,
    type: typeof row.type === 'string' ? row.type : '',
    status: typeof row.status === 'string' ? row.status : '',
    label: row.issue_key || row.local_key || row.id,
    trackerUri: 'nimbalyst://' + encodeURIComponent(row.id),
    aliases,
    startDate: validDate(row.start_date),
  };
}

export function getTrackerSnapshot(workspacePath) {
  if (typeof workspacePath !== 'string' || !workspacePath.trim()) return missingWorkspaceSnapshot();
  return snapshotsByWorkspace.get(workspacePath) || idleSnapshot(workspacePath);
}

export function subscribeTrackerSnapshot(listener, workspacePath) {
  if (typeof listener !== 'function' || typeof workspacePath !== 'string' || !workspacePath.trim()) return () => {};
  let listeners = listenersByWorkspace.get(workspacePath);
  if (!listeners) {
    listeners = new Set();
    listenersByWorkspace.set(workspacePath, listeners);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) listenersByWorkspace.delete(workspacePath);
  };
}

function parseShortTrackerReference(uri) {
  if (typeof uri !== 'string') throw new Error('URI tracker phải có dạng nimbalyst://ID.');
  const match = /^nimbalyst:\/\/([A-Za-z0-9_.:%-]+)$/i.exec(uri.trim());
  if (!match) throw new Error('URI tracker phải có dạng nimbalyst://ID.');
  let reference;
  try {
    reference = decodeURIComponent(match[1]);
  } catch {
    throw new Error('URI tracker có mã hóa không hợp lệ.');
  }
  if (!reference.trim() || reference.length > 1024 || /[\u0000-\u001f\u007f]/.test(reference)) {
    throw new Error('URI tracker không chứa reference hợp lệ.');
  }
  return reference;
}

export function trackerUriToConsoleUrl(uri) {
  const reference = parseShortTrackerReference(uri);
  return CONSOLE_ITEM_URL + encodeURIComponent(reference);
}

export async function openTrackerUri(uri, options = {}) {
  let url;
  try {
    url = trackerUriToConsoleUrl(uri);
  } catch (error) {
    return { ok: false, uri: typeof uri === 'string' ? uri : '', message: error.message };
  }

  const bridge = globalThis.window?.electronAPI;
  const invoke = options.invoke || (typeof bridge?.invoke === 'function' ? bridge.invoke.bind(bridge) : null);
  if (typeof invoke !== 'function') {
    return {
      ok: false,
      uri,
      url,
      message: 'Không có Nimbalyst open-external broker; hãy chép URI tracker để mở thủ công.',
    };
  }

  try {
    const response = await invoke('open-external', url);
    if (response === false) {
      return { ok: false, uri, url, message: 'Nimbalyst broker không nhận yêu cầu mở tracker; hãy chép URI để mở thủ công.' };
    }
    return { ok: true, uri, url, message: 'Đã gửi yêu cầu mở tracker cho Nimbalyst.' };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { ok: false, uri, url, message: 'Không gọi được Nimbalyst open-external broker: ' + reason + '. Hãy chép URI để mở thủ công.' };
  }
}

export async function refreshWorkspaceTrackers(host, timeoutMs = 1800) {
  const workspacePath = typeof host?.workspacePath === 'string' ? host.workspacePath.trim() : '';
  if (!workspacePath) return missingWorkspaceSnapshot();
  publish(workspacePath, { status: 'loading', items: [], message: 'Đang đọc danh sách tracker…' });
  if (typeof host.data?.query !== 'function') {
    return publish(workspacePath, {
      status: 'error',
      items: [],
      message: 'Host này không có PanelHost.data.query; tracker tự động không khả dụng nhưng lịch và link thủ công vẫn dùng được.',
    });
  }

  let timeoutId;
  const timedOut = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve({ timeout: true }), timeoutMs);
  });
  try {
    const result = await Promise.race([
      Promise.resolve().then(() => host.data.query(TRACKER_QUERY, [workspacePath])).then((rows) => ({ rows })),
      timedOut,
    ]);
    if (result.timeout) {
      return publish(workspacePath, { status: 'error', items: [], message: 'Đọc tracker quá thời gian chờ; lịch và link thủ công vẫn dùng được.' });
    }
    if (!Array.isArray(result.rows)) throw new Error('Dữ liệu tracker không phải danh sách.');
    const items = result.rows.map(mapTrackerRow).filter(Boolean);
    return publish(workspacePath, {
      status: 'ready',
      items,
      message: items.length ? items.length + ' mục tracker đã tải (chỉ đọc).' : 'Không có mục tracker trong workspace này.',
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return publish(workspacePath, { status: 'error', items: [], message: 'Không đọc được tracker: ' + reason + '. Lịch và link thủ công vẫn dùng được.' });
  } finally {
    clearTimeout(timeoutId);
  }
}
