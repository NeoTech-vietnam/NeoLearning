import * as __external0 from "react";
import * as __external1 from "@nimbalyst/runtime";
const __external = Object.freeze({"react": __external0, "@nimbalyst/runtime": __external1});
const __factories = {"src/index.js": function(__exports, __require, __external) {
const { createElement, useEffect, useRef, useState } = __external["react"];
const { useEditorLifecycle } = __external["@nimbalyst/runtime"];
const { mountCalendarApp, todayInHoChiMinh } = __require("src/calendar-app.js");
const { emptyCalendar, parseCalendar, serializeCalendar } = __require("src/model.js");
const { getTrackerSnapshot, refreshWorkspaceTrackers, subscribeTrackerSnapshot } = __require("src/tracker-adapter.js");
const { ensureWorkspaceCalendarFile, rememberWorkspaceForCalendarFile, resolveEditorWorkspacePath } = __require("src/workspace-storage.js");
const { createLifecycleSaveBridge } = __require("src/save-bridge.js");
const { calendarAITools, registerCalendarEditor } = __require("src/calendar-ai.js");
let workspaceFilesystem = null;

async function activate(context) {
  workspaceFilesystem = context?.services?.filesystem || null;
}

function CalendarLauncher({ host }) {
  const launched = useRef(false);
  const openCalendarRef = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (launched.current) return undefined;
    launched.current = true;
    let active = true;
    const openCalendar = async () => {
      try {
        setError('');
        const filePath = await ensureWorkspaceCalendarFile(workspaceFilesystem, host.workspacePath);
        if (!active) return;
        rememberWorkspaceForCalendarFile(filePath, host.workspacePath);
        void refreshWorkspaceTrackers(host);
        host.openFile(filePath);
        host.close();
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : String(cause));
      }
    };
    openCalendarRef.current = openCalendar;
    void openCalendar();
    return () => {
      active = false;
      openCalendarRef.current = null;
    };
  }, [host]);

  if (error) {
    return createElement('div', { className: 'pc-launch-error', role: 'alert' },
      createElement('p', null, 'Không mở được lịch: ' + error),
      createElement('button', { type: 'button', onClick: () => {
        void openCalendarRef.current?.();
      } }, 'Thử lại'));
  }
  return createElement('div', { className: 'pc-launch-status', role: 'status' }, 'Đang mở lịch workspace…');
}

function CalendarEditor({ host }) {
  const rootRef = useRef(null);
  const appRef = useRef(null);
  const documentRef = useRef(emptyCalendar());
  const markDirtyRef = useRef(null);
  const isDirtyRef = useRef(false);
  const saveBridgeRef = useRef(null);
  if (!saveBridgeRef.current || saveBridgeRef.current.originalHost !== host) {
    saveBridgeRef.current = createLifecycleSaveBridge(host, {
      beforeSave: () => appRef.current?.prepareSave() !== false,
    });
  }
  const saveBridge = saveBridgeRef.current;
  const [, setLifecycleNotice] = useState(0);
  const { isLoading, error, theme, markDirty, isDirty } = useEditorLifecycle(saveBridge.host, {
    applyContent: (content) => {
      documentRef.current = content;
      appRef.current?.replaceDocument(content);
    },
    getCurrentContent: () => documentRef.current,
    parse: parseCalendar,
    serialize: serializeCalendar,
    onExternalChange: () => {
      appRef.current?.notifyExternalChange();
      setLifecycleNotice((value) => value + 1);
    },
  });
  markDirtyRef.current = markDirty;
  isDirtyRef.current = isDirty;

  useEffect(() => {
    if (isLoading || error || !rootRef.current) return undefined;
    const workspacePath = resolveEditorWorkspacePath(host, host.filePath);
    const app = mountCalendarApp(rootRef.current, {
      today: todayInHoChiMinh(),
      workspacePath,
      getDocument: () => documentRef.current,
      onDocumentChange: (next) => {
        documentRef.current = next;
        markDirtyRef.current?.();
      },
      getTrackerSnapshot,
      subscribeTrackerSnapshot,
      onSave: saveBridge.requestSave,
      getSaveState: saveBridge.getState,
      subscribeSaveState: saveBridge.subscribe,
    });
    appRef.current = app;
    const unregisterEditor = registerCalendarEditor(host.filePath, () => isDirtyRef.current || app.hasPendingEdits());
    return () => {
      unregisterEditor();
      app.destroy();
      appRef.current = null;
    };
  }, [isLoading, error, saveBridge]);

  if (error) {
    return createElement('div', { className: 'pc-editor-error', role: 'alert' },
      createElement('h1', null, 'Không mở được file lịch'),
      createElement('p', null, error.message),
      createElement('p', null, 'Nội dung file chưa được ghi đè. Sửa JSON hoặc khôi phục bản sao rồi mở lại.'));
  }
  if (isLoading) return createElement('div', { className: 'pc-editor-loading', role: 'status' }, 'Đang tải lịch…');
  return createElement('div', { className: 'pc-editor-host', 'data-theme': theme || '' }, createElement('div', { ref: rootRef }));
}

const components = { CalendarEditor };
const panels = { calendar: { component: CalendarLauncher } };
const aiTools = calendarAITools;

Object.assign(__exports, {activate, components, panels, aiTools});
},
"src/model.js": function(__exports, __require, __external) {
const SCHEMA_VERSION = 1;
const CALENDAR_TIMEZONE = 'Asia/Ho_Chi_Minh';
const EVENT_TYPES = Object.freeze(['note', 'milestone', 'task']);

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function parseDateParts(value) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return null;
  const length = month === 2 && isLeapYear(year) ? 29 : MONTH_LENGTHS[month - 1];
  if (day < 1 || day > length) return null;
  return { year, month, day };
}

function isDate(value) {
  return parseDateParts(value) !== null;
}

function daysFromCivil(partsOrDate) {
  const parts = typeof partsOrDate === 'string' ? parseDateParts(partsOrDate) : partsOrDate;
  if (!parts) throw new Error('Ngày phải có định dạng YYYY-MM-DD hợp lệ.');
  let year = parts.year;
  const month = parts.month;
  year -= month <= 2 ? 1 : 0;
  const era = Math.floor(year / 400);
  const yearOfEra = year - era * 400;
  const shiftedMonth = month + (month > 2 ? -3 : 9);
  const dayOfYear = Math.floor((153 * shiftedMonth + 2) / 5) + parts.day - 1;
  const dayOfEra = yearOfEra * 365
    + Math.floor(yearOfEra / 4)
    - Math.floor(yearOfEra / 100)
    + dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

function civilFromDays(serial) {
  const dayCount = serial + 719468;
  const era = Math.floor(dayCount / 146097);
  const dayOfEra = dayCount - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra - Math.floor(dayOfEra / 1460) + Math.floor(dayOfEra / 36524) - Math.floor(dayOfEra / 146096)) / 365,
  );
  let year = yearOfEra + era * 400;
  const dayOfYear = dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthPart = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * monthPart + 2) / 5) + 1;
  const month = monthPart + (monthPart < 10 ? 3 : -9);
  year += month <= 2 ? 1 : 0;
  return String(year).padStart(4, '0') + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}

function addDays(date, amount) {
  if (!Number.isInteger(amount)) throw new Error('Số ngày phải là số nguyên.');
  return civilFromDays(daysFromCivil(date) + amount);
}

function weekdayMondayZero(date) {
  return ((daysFromCivil(date) + 3) % 7 + 7) % 7;
}

function startOfWeek(date) {
  return addDays(date, -weekdayMondayZero(date));
}

function weekDates(weekStart) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

function monthDates(monthDate) {
  const parts = parseDateParts(monthDate);
  if (!parts) throw new Error('Tháng cần xem không hợp lệ.');
  const first = String(parts.year).padStart(4, '0') + '-' + String(parts.month).padStart(2, '0') + '-01';
  const gridStart = addDays(first, -weekdayMondayZero(first));
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function eventEndDate(event) {
  return event.endDate || event.startDate;
}

function eventOverlapsDate(event, date) {
  const day = daysFromCivil(date);
  return day >= daysFromCivil(event.startDate) && day <= daysFromCivil(eventEndDate(event));
}

function timelineRange(event, weekStart) {
  const weekStartDay = daysFromCivil(weekStart);
  const eventStart = daysFromCivil(event.startDate);
  const eventEnd = daysFromCivil(eventEndDate(event));
  const weekEndDay = weekStartDay + 6;
  if (eventEnd < weekStartDay || eventStart > weekEndDay) return null;
  const clippedStart = Math.max(eventStart, weekStartDay);
  const clippedEnd = Math.min(eventEnd, weekEndDay);
  return {
    startColumn: clippedStart - weekStartDay,
    span: clippedEnd - clippedStart + 1,
    startsBeforeWeek: eventStart < weekStartDay,
    endsAfterWeek: eventEnd > weekEndDay,
  };
}

function emptyCalendar() {
  return { schemaVersion: SCHEMA_VERSION, timezone: CALENDAR_TIMEZONE, events: [] };
}

function createEventId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'event-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function validateTrackerUri(uri) {
  if (!uri) return;
  if (typeof uri !== 'string' || !/^nimbalyst:\/\/[A-Za-z0-9_.:%-]+$/i.test(uri)) {
    throw new Error('Link tracker cần có dạng nimbalyst://ID.');
  }
}

function normalizeEvent(value, index = 0) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Mục lịch thứ ' + (index + 1) + ' không hợp lệ.');
  }
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  const startDate = value.startDate;
  const endDate = value.endDate || null;
  const type = value.type;
  const notes = typeof value.notes === 'string' ? value.notes : '';
  const trackerUri = typeof value.trackerUri === 'string' ? value.trackerUri.trim() : '';
  if (!id) throw new Error('Mục lịch thứ ' + (index + 1) + ' thiếu ID.');
  if (!title) throw new Error('Mục lịch thứ ' + (index + 1) + ' thiếu tiêu đề.');
  if (!isDate(startDate)) throw new Error('Ngày bắt đầu của “' + title + '” không hợp lệ.');
  if (endDate && !isDate(endDate)) throw new Error('Ngày kết thúc của “' + title + '” không hợp lệ.');
  if (endDate && daysFromCivil(startDate) > daysFromCivil(endDate)) {
    throw new Error('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc của “' + title + '”.');
  }
  if (!EVENT_TYPES.includes(type)) throw new Error('Loại mục lịch của “' + title + '” không hợp lệ.');
  validateTrackerUri(trackerUri);
  return { id, title, notes, startDate, endDate, type, trackerUri };
}

function normalizeCalendar(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Lịch cần là một đối tượng JSON.');
  }
  if (value.schemaVersion !== SCHEMA_VERSION) {
    throw new Error('Phiên bản lịch không được hỗ trợ: ' + String(value.schemaVersion) + '.');
  }
  if (value.timezone !== CALENDAR_TIMEZONE) {
    throw new Error('Múi giờ lịch phải là ' + CALENDAR_TIMEZONE + '.');
  }
  if (!Array.isArray(value.events)) throw new Error('Lịch cần có danh sách events.');
  const events = value.events.map((event, index) => normalizeEvent(event, index));
  const ids = new Set();
  for (const event of events) {
    if (ids.has(event.id)) throw new Error('ID mục lịch bị lặp: ' + event.id + '.');
    ids.add(event.id);
  }
  return { schemaVersion: SCHEMA_VERSION, timezone: CALENDAR_TIMEZONE, events };
}

function parseCalendar(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return emptyCalendar();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error('Không đọc được lịch JSON: ' + error.message);
  }
  return normalizeCalendar(parsed);
}

function serializeCalendar(calendar) {
  return JSON.stringify(normalizeCalendar(calendar), null, 2) + '\n';
}

function mergeCalendars(current, incoming) {
  const base = normalizeCalendar(current);
  const imported = normalizeCalendar(incoming);
  const merged = new Map(base.events.map((event) => [event.id, event]));
  for (const event of imported.events) merged.set(event.id, event);
  return normalizeCalendar({ schemaVersion: SCHEMA_VERSION, timezone: CALENDAR_TIMEZONE, events: [...merged.values()] });
}

function upsertEvent(calendar, value) {
  const base = normalizeCalendar(calendar);
  const event = normalizeEvent(value);
  const index = base.events.findIndex((item) => item.id === event.id);
  const events = index < 0
    ? [...base.events, event]
    : base.events.map((item, currentIndex) => currentIndex === index ? event : item);
  return normalizeCalendar({ ...base, events });
}

function importCalendar(current, raw, mode) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error('File nhập trống; lịch hiện tại được giữ nguyên.');
  }
  const incoming = parseCalendar(raw);
  if (mode === 'replace') return incoming;
  if (mode === 'merge') return mergeCalendars(current, incoming);
  throw new Error('Chọn cách nhập là merge hoặc replace.');
}

Object.assign(__exports, {SCHEMA_VERSION, CALENDAR_TIMEZONE, EVENT_TYPES, isLeapYear, parseDateParts, isDate, daysFromCivil, civilFromDays, addDays, weekdayMondayZero, startOfWeek, weekDates, monthDates, eventEndDate, eventOverlapsDate, timelineRange, emptyCalendar, createEventId, normalizeEvent, normalizeCalendar, parseCalendar, serializeCalendar, mergeCalendars, upsertEvent, importCalendar});
},
"src/paths.js": function(__exports, __require, __external) {
function defaultCalendarPath(workspacePath) {
  if (typeof workspacePath !== 'string' || !workspacePath.trim()) {
    throw new Error('Nimbalyst chưa cung cấp đường dẫn workspace.');
  }
  const separator = workspacePath.includes('\\') ? '\\' : '/';
  const base = workspacePath.replace(/[\\/]+$/, '');
  return base + separator + ['nimbalyst-local', 'calendar', 'project.project-calendar.json'].join(separator);
}

Object.assign(__exports, {defaultCalendarPath});
},
"src/tracker-adapter.js": function(__exports, __require, __external) {
const TRACKER_QUERY = [
  'SELECT id, issue_key, local_key, type, title, status,',
  "  CASE WHEN json_valid(data) THEN json_extract(data, '$.startDate') ELSE NULL END AS start_date",
  '  FROM tracker_items',
  '  WHERE workspace = $1 AND COALESCE(archived, 0) = 0 AND deleted_at IS NULL',
  '  ORDER BY title COLLATE NOCASE',
  '  LIMIT 250',
].join('\n');

const CONSOLE_ITEM_URL = 'https://console.nimbalyst.com/app/item/';

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

function mapTrackerRow(row) {
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

function getTrackerSnapshot(workspacePath) {
  if (typeof workspacePath !== 'string' || !workspacePath.trim()) return missingWorkspaceSnapshot();
  return snapshotsByWorkspace.get(workspacePath) || idleSnapshot(workspacePath);
}

function subscribeTrackerSnapshot(listener, workspacePath) {
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

function trackerUriToConsoleUrl(uri) {
  const reference = parseShortTrackerReference(uri);
  return CONSOLE_ITEM_URL + encodeURIComponent(reference);
}

async function openTrackerUri(uri, options = {}) {
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

async function refreshWorkspaceTrackers(host, timeoutMs = 1800) {
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

Object.assign(__exports, {TRACKER_QUERY, CONSOLE_ITEM_URL, mapTrackerRow, getTrackerSnapshot, subscribeTrackerSnapshot, trackerUriToConsoleUrl, openTrackerUri, refreshWorkspaceTrackers});
},
"src/workspace-storage.js": function(__exports, __require, __external) {
const { emptyCalendar, serializeCalendar } = __require("src/model.js");
const { defaultCalendarPath } = __require("src/paths.js");
const pendingCreates = new Map();
const workspaceByCalendarFile = new Map();
const fileOperations = new Map();

function calendarFileKey(filePath) {
  if (typeof filePath !== 'string') return '';
  const normalized = filePath.replace(/\\/g, '/').replace(/\/+$/, '');
  return /^[A-Za-z]:\//.test(normalized) ? normalized.toLowerCase() : normalized;
}

function withCalendarFileLock(filePath, operation) {
  const key = calendarFileKey(filePath);
  const previous = fileOperations.get(key) || Promise.resolve();
  const current = previous.catch(() => {}).then(operation);
  fileOperations.set(key, current);
  return current.finally(() => {
    if (fileOperations.get(key) === current) fileOperations.delete(key);
  });
}

function rememberWorkspaceForCalendarFile(filePath, workspacePath) {
  if (typeof filePath !== 'string' || !filePath.trim() || typeof workspacePath !== 'string' || !workspacePath.trim()) return;
  workspaceByCalendarFile.set(calendarFileKey(filePath), workspacePath);
}

function workspaceForCalendarFile(filePath) {
  return workspaceByCalendarFile.get(calendarFileKey(filePath)) || null;
}

function resolveEditorWorkspacePath(host, filePath) {
  // Host v0.80.4 sets EditorHost.workspaceId to the workspace path.
  if (typeof host?.workspaceId === 'string' && host.workspaceId.trim()) return host.workspaceId.trim();
  return workspaceForCalendarFile(filePath);
}

async function ensureWorkspaceCalendarFile(filesystem, workspacePath) {
  if (typeof filesystem?.fileExists !== 'function' || typeof filesystem?.writeFile !== 'function') {
    throw new Error('Host không cấp filesystem service cho extension.');
  }
  const filePath = defaultCalendarPath(workspacePath);
  const pending = pendingCreates.get(filePath);
  if (pending) return pending;

  const creating = withCalendarFileLock(filePath, async () => {
    if (await filesystem.fileExists(filePath)) return filePath;
    await filesystem.writeFile(filePath, serializeCalendar(emptyCalendar()));
    return filePath;
  });
  pendingCreates.set(filePath, creating);
  try {
    return await creating;
  } finally {
    if (pendingCreates.get(filePath) === creating) pendingCreates.delete(filePath);
  }
}

Object.assign(__exports, {withCalendarFileLock, rememberWorkspaceForCalendarFile, workspaceForCalendarFile, resolveEditorWorkspacePath, ensureWorkspaceCalendarFile});
},
"src/save-bridge.js": function(__exports, __require, __external) {
// Both the Calendar button and native Save run the SDK's registered callback.
// Observing saveContent also surfaces failures swallowed by the v0.80.4 hook.
function createLifecycleSaveBridge(originalHost, options = {}) {
  let handler = null;
  let pending = null;
  let attempt = null;
  let state = { status: 'idle', message: 'Chưa có thay đổi' };
  const listeners = new Set();
  const boundMethods = new Map();
  function publish(next) {
    state = next;
    for (const listener of listeners) listener(next);
  }
  function requestSave() {
    if (pending) return pending;
    pending = Promise.resolve().then(async () => {
      if (!handler) throw new Error('Lịch chưa sẵn sàng để lưu.');
      if (options.beforeSave?.() === false) return false;
      attempt = { written: false, error: null };
      publish({ status: 'saving', message: 'Đang lưu…' });
      await handler();
      if (attempt.error) throw attempt.error;
      if (!attempt.written) throw new Error('Host chưa xác nhận ghi file lịch.');
      publish({ status: 'saved', message: 'Đã lưu lịch' });
      return true;
    }).catch((error) => {
      publish({ status: 'error', message: 'Chưa lưu được: ' + (error instanceof Error ? error.message : String(error)) });
      throw error;
    }).finally(() => { pending = null; attempt = null; });
    return pending;
  }
  const host = new Proxy(originalHost, {
    get(target, key) {
      if (key === 'onSaveRequested') return (callback) => {
        handler = callback;
        const unsubscribe = target.onSaveRequested(() => requestSave().catch(() => {}));
        return () => {
          if (handler === callback) handler = null;
          unsubscribe?.();
        };
      };
      if (key === 'saveContent') return async (content) => {
        try {
          await target.saveContent(content);
          if (attempt) attempt.written = true;
        } catch (error) {
          if (attempt) attempt.error = error;
          throw error;
        }
      };
      const value = Reflect.get(target, key, target);
      if (typeof value !== 'function') return value;
      if (!boundMethods.has(key)) boundMethods.set(key, value.bind(target));
      return boundMethods.get(key);
    },
  });
  return {
    originalHost, host, requestSave,
    getState: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
}

Object.assign(__exports, {createLifecycleSaveBridge});
},
"src/calendar-app.js": function(__exports, __require, __external) {
const { addDays, createEventId, daysFromCivil, emptyCalendar, eventEndDate, eventOverlapsDate, importCalendar, isDate, monthDates, normalizeCalendar, parseDateParts, startOfWeek, timelineRange, upsertEvent, weekDates } = __require("src/model.js");
const { getTrackerSnapshot, openTrackerUri, subscribeTrackerSnapshot, trackerUriToConsoleUrl } = __require("src/tracker-adapter.js");
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
const TYPE_LABELS = { note: 'Ghi chú', milestone: 'Mốc', task: 'Công việc' };

function todayInHoChiMinh(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return values.year + '-' + values.month + '-' + values.day;
}

function monthStart(date) {
  return date.slice(0, 7) + '-01';
}

function shiftMonth(date, amount) {
  const parts = parseDateParts(date);
  const index = parts.year * 12 + parts.month - 1 + amount;
  const year = Math.floor(index / 12);
  const month = index - year * 12 + 1;
  return String(year).padStart(4, '0') + '-' + String(month).padStart(2, '0') + '-01';
}

function formatDate(date, options = {}) {
  const parts = parseDateParts(date);
  if (!parts) return date;
  if (options.short) return String(parts.day).padStart(2, '0') + '/' + String(parts.month).padStart(2, '0');
  return String(parts.day).padStart(2, '0') + ' ' + MONTHS[parts.month - 1] + ' ' + parts.year;
}

function formatRange(item) {
  const end = item.endDate || item.startDate;
  return end === item.startDate ? formatDate(item.startDate) : formatDate(item.startDate) + ' – ' + formatDate(end);
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function button(label, className, action, title) {
  const node = element('button', className, label);
  node.type = 'button';
  if (title) node.title = title;
  node.addEventListener('click', action);
  return node;
}

function append(parent, ...children) {
  for (const child of children) if (child) parent.append(child);
  return parent;
}

function dateIsInMonth(date, monthAnchor) {
  return date.slice(0, 7) === monthAnchor.slice(0, 7);
}

function trackerMatchesEvent(tracker, event) {
  if (!event.trackerUri) return false;
  const uri = event.trackerUri.trim().toLowerCase();
  return tracker.aliases.some((alias) => alias.toLowerCase() === uri);
}

function activeTrackers(snapshot, events, workspacePath) {
  if (!workspacePath || snapshot.workspacePath !== workspacePath || snapshot.status !== 'ready') return [];
  return snapshot.items.filter((tracker) => !events.some((event) => trackerMatchesEvent(tracker, event)));
}

function bindTrackerLink(link, uri, app) {
  try {
    link.href = trackerUriToConsoleUrl(uri);
  } catch {
    link.href = '#';
  }
  link.addEventListener('click', (event) => {
    event.preventDefault();
    void app.openTracker(uri);
  });
  return link;
}

function displayItem(item, app, tracker = false) {
  if (tracker) {
    const link = bindTrackerLink(element('a', 'pc-item pc-item-tracker'), item.trackerUri, app);
    link.title = 'Mở tracker ' + item.label;
    const title = element('span', 'pc-item-title', item.title);
    const meta = element('span', 'pc-item-meta', item.label + (item.status ? ' · ' + item.status : ''));
    append(link, title, meta);
    return link;
  }
  const node = button(item.title, 'pc-item pc-item-event pc-type-' + item.type, () => app.editEvent(item.id));
  node.title = TYPE_LABELS[item.type] + ' · ' + formatRange(item);
  const meta = element('span', 'pc-item-meta', TYPE_LABELS[item.type]);
  node.append(meta);
  return node;
}

function renderTrackerStatus(container, app, snapshot, trackers) {
  const panel = element('section', 'pc-tracker-panel');
  const heading = element('div', 'pc-tracker-heading');
  append(heading, element('h2', '', 'Tracker'), element('span', 'pc-tracker-count', String(snapshot.items?.length || 0)));
  panel.append(heading);
  panel.append(element('p', 'pc-tracker-status pc-tracker-' + snapshot.status, snapshot.message || 'Tracker chưa được đọc.'));
  if (snapshot.status === 'ready') {
    const withDate = trackers.filter((item) => item.startDate);
    const withoutDate = trackers.filter((item) => !item.startDate);
    if (withoutDate.length) {
      panel.append(element('h3', 'pc-section-label', 'Chưa lên lịch'));
      const list = element('div', 'pc-unplanned-list');
      for (const item of withoutDate.slice(0, 12)) list.append(displayItem(item, app, true));
      panel.append(list);
      if (withoutDate.length > 12) panel.append(element('p', 'pc-muted', 'Còn ' + (withoutDate.length - 12) + ' mục khác.'));
    }
    if (withDate.length) {
      panel.append(element('h3', 'pc-section-label', 'Có ngày bắt đầu'));
      const list = element('div', 'pc-unplanned-list');
      for (const item of withDate.slice(0, 8)) {
        const row = element('div', 'pc-tracker-row');
        row.append(element('span', 'pc-tracker-date', item.startDate.slice(8, 10) + '/' + item.startDate.slice(5, 7)));
        row.append(displayItem(item, app, true));
        list.append(row);
      }
      panel.append(list);
    }
    if (!trackers.length) panel.append(element('p', 'pc-muted', 'Các tracker đã được gắn vào mục lịch hoặc danh sách hiện trống.'));
    if (trackers.length > 20) panel.append(element('p', 'pc-muted', 'Danh sách hiển thị tối đa 20 mục.'));
  }
  container.append(panel);
}

function renderMonth(container, app, documentData, state, snapshot, trackers) {
  const grid = element('div', 'pc-month-grid');
  for (const [index, weekday] of WEEKDAYS.entries()) {
    grid.append(element('div', 'pc-weekday' + (index >= 5 ? ' pc-weekend' : ''), weekday));
  }
  const today = app.today;
  for (const [index, date] of monthDates(state.monthAnchor).entries()) {
    const cell = element('section', 'pc-month-day' + (index % 7 >= 5 ? ' pc-weekend' : ''));
    if (!dateIsInMonth(date, state.monthAnchor)) cell.classList.add('pc-outside-month');
    if (date === today) cell.classList.add('pc-today');
    cell.dataset.date = date;
    const dateButton = button(String(Number(date.slice(8, 10))), 'pc-day-number', () => app.createEvent(date));
    dateButton.title = 'Thêm mục vào ' + formatDate(date);
    cell.append(dateButton);
    const dayItems = [];
    for (const event of documentData.events) {
      if (eventOverlapsDate(event, date)) dayItems.push({ item: event, tracker: false });
    }
    for (const tracker of trackers) {
      if (tracker.startDate === date) dayItems.push({ item: tracker, tracker: true });
    }
    dayItems.sort((left, right) => left.item.title.localeCompare(right.item.title, 'vi'));
    for (const entry of dayItems.slice(0, 4)) cell.append(displayItem(entry.item, app, entry.tracker));
    if (dayItems.length > 4) cell.append(element('span', 'pc-more-items', '+' + (dayItems.length - 4) + ' mục'));
    grid.append(cell);
  }
  container.append(grid);
  if (!documentData.events.length && snapshot.status !== 'ready') {
    container.append(element('p', 'pc-empty-hint', 'Chưa có mục lịch. Chọn “Thêm mục” để tạo ghi chú, mốc hoặc công việc.'));
  }
}

function renderAgenda(container, app, documentData, today, trackers) {
  const trackerEntries = trackers.filter((item) => item.startDate && !documentData.events.some((event) => trackerMatchesEvent(item, event)));
  const eventEntries = documentData.events
    .filter((event) => daysFromCivil(eventEndDate(event)) >= daysFromCivil(today))
    .map((item) => ({ item, tracker: false }));
  const trackerAgenda = trackerEntries
    .filter((item) => daysFromCivil(item.startDate) >= daysFromCivil(today))
    .map((item) => ({ item, tracker: true }));
  const entries = [...eventEntries, ...trackerAgenda].sort((left, right) =>
    left.item.startDate.localeCompare(right.item.startDate) || left.item.title.localeCompare(right.item.title, 'vi'));
  if (!entries.length) {
    container.append(element('div', 'pc-empty-state', 'Không có mục sắp tới. Bạn có thể thêm ghi chú, mốc hoặc công việc.'));
    return;
  }
  let previousDate = '';
  for (const entry of entries) {
    if (entry.item.startDate !== previousDate) {
      const heading = element('h2', 'pc-agenda-date', formatDate(entry.item.startDate));
      if (entry.item.startDate === today) heading.append(element('span', 'pc-today-label', 'Hôm nay'));
      container.append(heading);
      previousDate = entry.item.startDate;
    }
    const row = element('article', 'pc-agenda-row');
    append(row, element('span', 'pc-agenda-range', entry.tracker ? 'Tracker' : formatRange(entry.item)), displayItem(entry.item, app, entry.tracker));
    if (entry.item.notes) row.append(element('p', 'pc-agenda-notes', entry.item.notes));
    container.append(row);
  }
}

function renderTimeline(container, app, documentData, state, trackers) {
  const days = weekDates(state.weekStart);
  const header = element('div', 'pc-timeline-grid pc-timeline-header');
  header.append(element('div', 'pc-timeline-name-head', 'Mục'));
  for (let index = 0; index < days.length; index += 1) {
    const day = days[index];
    const dateHead = element('div', 'pc-timeline-day-head' + (index >= 5 ? ' pc-weekend' : ''));
    dateHead.append(element('span', 'pc-timeline-weekday', WEEKDAYS[index]));
    dateHead.append(element('span', 'pc-timeline-date', day.slice(8, 10) + '/' + day.slice(5, 7)));
    if (day === app.today) dateHead.classList.add('pc-today');
    header.append(dateHead);
  }
  container.append(header);
  const trackerEntries = trackers
    .filter((item) => item.startDate && !documentData.events.some((event) => trackerMatchesEvent(item, event)))
    .map((item) => ({ ...item, readOnlyTracker: true }));
  const entries = [...documentData.events, ...trackerEntries]
    .map((item) => ({ item, range: timelineRange(item, state.weekStart) }))
    .filter((entry) => entry.range)
    .sort((left, right) => left.item.startDate.localeCompare(right.item.startDate) || left.item.title.localeCompare(right.item.title, 'vi'));
  if (!entries.length) {
    container.append(element('div', 'pc-empty-state', 'Tuần này chưa có mục nào. Chọn “Thêm mục” để lên lịch.'));
    return;
  }
  for (const entry of entries) {
    const row = element('div', 'pc-timeline-grid pc-timeline-row');
    const label = element('div', 'pc-timeline-name', entry.item.title);
    label.title = entry.item.title;
    row.append(label);
    const bar = entry.item.readOnlyTracker
      ? bindTrackerLink(element('a', 'pc-timeline-bar pc-timeline-tracker'), entry.item.trackerUri, app)
      : button(entry.item.title, 'pc-timeline-bar pc-type-' + entry.item.type, () => app.editEvent(entry.item.id));
    if (entry.item.readOnlyTracker) {
      bar.title = 'Mở tracker ' + entry.item.label;
    } else {
      bar.title = TYPE_LABELS[entry.item.type] + ' · ' + formatRange(entry.item);
    }
    bar.style.gridColumn = (entry.range.startColumn + 2) + ' / span ' + entry.range.span;
    if (entry.range.startsBeforeWeek) bar.classList.add('pc-range-continues-before');
    if (entry.range.endsAfterWeek) bar.classList.add('pc-range-continues-after');
    row.append(bar);
    for (const column of [7, 8]) {
      const weekendCell = element('div', 'pc-timeline-weekend-cell');
      weekendCell.style.gridColumn = String(column);
      weekendCell.setAttribute('aria-hidden', 'true');
      row.append(weekendCell);
    }
    container.append(row);
  }
}

function renderTrackerFeedback(container, app, feedback) {
  if (!feedback) return;
  const message = element('div', 'pc-tracker-feedback ' + (feedback.ok ? 'pc-feedback-ok' : 'pc-feedback-error'));
  message.setAttribute('role', feedback.ok ? 'status' : 'alert');
  message.append(element('span', '', feedback.message));
  if (!feedback.ok && feedback.uri) {
    message.append(element('code', 'pc-tracker-uri', feedback.uri));
    message.append(button('Chép URI', 'pc-secondary-button', () => { void app.copyTrackerUri(feedback.uri); }));
  }
  container.append(message);
}

function renderEditor(container, app, state) {
  if (!state.editing) return;
  const event = state.editing;
  const panel = element('section', 'pc-edit-panel');
  const header = element('div', 'pc-edit-heading');
  append(header, element('h2', '', event.id ? 'Sửa mục lịch' : 'Mục lịch mới'),
    button('×', 'pc-close-edit', () => app.closeEditor(), 'Đóng'));
  panel.append(header);
  const form = element('form', 'pc-event-form');
  const titleLabel = element('label', 'pc-field');
  titleLabel.append(element('span', '', 'Tiêu đề'));
  const titleInput = element('input', 'pc-input');
  titleInput.name = 'title';
  titleInput.required = true;
  titleInput.maxLength = 160;
  titleInput.value = event.title || '';
  titleLabel.append(titleInput);
  form.append(titleLabel);

  const typeLabel = element('label', 'pc-field');
  typeLabel.append(element('span', '', 'Loại'));
  const typeSelect = element('select', 'pc-input');
  typeSelect.name = 'type';
  for (const type of ['note', 'milestone', 'task']) {
    const option = element('option', '', TYPE_LABELS[type]);
    option.value = type;
    option.selected = (event.type || 'task') === type;
    typeSelect.append(option);
  }
  typeLabel.append(typeSelect);
  form.append(typeLabel);

  const startLabel = element('label', 'pc-field');
  startLabel.append(element('span', '', 'Ngày bắt đầu'));
  const startInput = element('input', 'pc-input');
  startInput.type = 'date';
  startInput.name = 'startDate';
  startInput.required = true;
  startInput.value = event.startDate || app.today;
  startLabel.append(startInput);
  form.append(startLabel);

  const endLabel = element('label', 'pc-field');
  endLabel.append(element('span', '', 'Ngày kết thúc (tùy chọn)'));
  const endInput = element('input', 'pc-input');
  endInput.type = 'date';
  endInput.name = 'endDate';
  endInput.value = event.endDate || '';
  endLabel.append(endInput);
  form.append(endLabel);

  const notesLabel = element('label', 'pc-field');
  notesLabel.append(element('span', '', 'Ghi chú'));
  const notesInput = element('textarea', 'pc-input pc-notes-input');
  notesInput.name = 'notes';
  notesInput.rows = 4;
  notesInput.maxLength = 4000;
  notesInput.value = event.notes || '';
  notesLabel.append(notesInput);
  form.append(notesLabel);

  const trackerLabel = element('label', 'pc-field');
  trackerLabel.append(element('span', '', 'Link tracker (không bắt buộc)'));
  const trackerInput = element('input', 'pc-input');
  trackerInput.name = 'trackerUri';
  trackerInput.type = 'url';
  trackerInput.placeholder = 'nimbalyst://ID';
  trackerInput.value = event.trackerUri || '';
  trackerLabel.append(trackerInput);
  const trackerOpenLink = element('a', 'pc-tracker-open-link', 'Mở tracker');
  trackerOpenLink.addEventListener('click', (nativeEvent) => {
    nativeEvent.preventDefault();
    void app.openTracker(trackerInput.value.trim());
  });
  const updateTrackerOpenLink = () => {
    const uri = trackerInput.value.trim();
    if (!uri) {
      trackerOpenLink.href = '#';
      trackerOpenLink.hidden = true;
      return;
    }
    try { trackerOpenLink.href = trackerUriToConsoleUrl(uri); }
    catch { trackerOpenLink.href = '#'; }
    trackerOpenLink.hidden = false;
  };
  trackerInput.addEventListener('input', updateTrackerOpenLink);
  updateTrackerOpenLink();
  trackerLabel.append(trackerOpenLink);
  trackerLabel.append(element('small', 'pc-field-help', 'Dán URI tracker để mở đúng mục. Link thủ công vẫn dùng được nếu bộ đọc tracker lỗi.'));
  form.append(trackerLabel);

  const formError = element('p', 'pc-form-error');
  formError.hidden = true;
  form.append(formError);
  const actions = element('div', 'pc-form-actions');
  const save = element('button', 'pc-primary-button', event.id ? 'Cập nhật mục' : 'Thêm vào lịch');
  save.type = 'submit';
  actions.append(save);
  if (event.id && state.deleteConfirmId === event.id) {
    const confirmation = element('div', 'pc-delete-confirm');
    confirmation.append(element('p', '', 'Xóa “' + event.title + '” khỏi lịch?'));
    confirmation.append(button('Xác nhận xóa', 'pc-danger-button', () => app.confirmDeleteEvent(event.id)));
    confirmation.append(button('Giữ lại', 'pc-secondary-button', () => app.cancelDeleteEvent()));
    form.append(confirmation);
  } else if (event.id) {
    actions.append(button('Xóa', 'pc-danger-button', () => app.deleteEvent(event.id)));
  }
  actions.append(button('Hủy', 'pc-secondary-button', () => app.closeEditor()));
  form.append(actions);
  form.addEventListener('submit', (nativeEvent) => {
    nativeEvent.preventDefault();
    const values = new FormData(form);
    try {
      app.saveEvent({
        ...event,
        id: event.id || createEventId(),
        title: String(values.get('title') || ''),
        type: String(values.get('type') || 'task'),
        startDate: String(values.get('startDate') || ''),
        endDate: String(values.get('endDate') || '') || null,
        notes: String(values.get('notes') || ''),
        trackerUri: String(values.get('trackerUri') || '').trim(),
      });
    } catch (error) {
      formError.textContent = error instanceof Error ? error.message : String(error);
      formError.hidden = false;
    }
  });
  panel.append(form);
  container.append(panel);
}

function mountCalendarApp(root, options = {}) {
  if (!root) throw new Error('Thiếu phần tử gốc để mở lịch.');
  const today = options.today || todayInHoChiMinh();
  if (!isDate(today)) throw new Error('Ngày hiện tại của fixture không hợp lệ.');
  const workspacePath = typeof options.workspacePath === 'string' && options.workspacePath.trim() ? options.workspacePath : null;
  const readSnapshot = options.getTrackerSnapshot || getTrackerSnapshot;
  const state = {
    document: normalizeCalendar(options.getDocument?.() || emptyCalendar()),
    view: 'month',
    monthAnchor: monthStart(today),
    weekStart: startOfWeek(today),
    editing: null,
    deleteConfirmId: '',
    notice: '',
    trackerFeedback: null,
    importMode: 'merge',
    saveState: options.getSaveState?.() || { status: 'idle', message: 'Chưa có thay đổi' },
  };
  let snapshot = readSnapshot(workspacePath);
  if (!snapshot || snapshot.workspacePath !== workspacePath) snapshot = getTrackerSnapshot(workspacePath);
  let destroyed = false;
  const app = {
    today,
    async saveCalendar() {
      if (typeof options.onSave !== 'function') return;
      try { await options.onSave(); } catch { /* The bridge displays the error without losing edits. */ }
    },
    openTracker(uri) {
      state.trackerFeedback = { ok: false, uri, message: 'Đang gửi yêu cầu mở tracker cho Nimbalyst…' };
      render();
      const opener = options.openTracker || ((reference) => openTrackerUri(reference, { invoke: options.invokeBroker }));
      return Promise.resolve().then(() => opener(uri)).then((result) => {
        if (!result || typeof result.ok !== 'boolean') throw new Error('Tracker opener trả về kết quả không hợp lệ.');
        state.trackerFeedback = {
          ok: result.ok,
          uri,
          message: result.message || (result.ok ? 'Đã gửi yêu cầu mở tracker cho Nimbalyst.' : 'Không mở được tracker.'),
        };
        render();
        return result;
      }).catch((error) => {
        state.trackerFeedback = {
          ok: false,
          uri,
          message: 'Không mở được tracker: ' + (error instanceof Error ? error.message : String(error)) + '. Hãy chép URI bên dưới.',
        };
        render();
        return { ok: false, uri, message: state.trackerFeedback.message };
      });
    },
    async copyTrackerUri(uri) {
      try {
        const clipboard = globalThis.navigator?.clipboard;
        if (typeof clipboard?.writeText !== 'function') throw new Error('Clipboard API unavailable');
        await clipboard.writeText(uri);
        state.trackerFeedback = { ok: true, uri, message: 'Đã chép URI tracker.' };
      } catch {
        state.trackerFeedback = { ok: false, uri, message: 'Không dùng được clipboard; hãy chọn và chép URI bên dưới.' };
      }
      render();
    },
    createEvent(date = today) {
      state.editing = { id: '', title: '', type: 'task', startDate: date, endDate: null, notes: '', trackerUri: '' };
      state.deleteConfirmId = '';
      render();
      focusEditor();
    },
    editEvent(id) {
      const event = state.document.events.find((item) => item.id === id);
      if (!event) return;
      state.editing = { ...event };
      state.deleteConfirmId = '';
      render();
      focusEditor();
    },
    closeEditor() {
      state.editing = null;
      state.deleteConfirmId = '';
      render();
    },
    saveEvent(event) {
      const candidate = upsertEvent(state.document, event);
      commit(candidate);
      state.editing = null;
      state.deleteConfirmId = '';
      state.notice = 'Đã cập nhật mục. Bấm Lưu lịch để ghi vào file.';
      render();
    },
    deleteEvent(id) {
      state.deleteConfirmId = id;
      render();
    },
    confirmDeleteEvent(id) {
      commit(normalizeCalendar({
        ...state.document,
        events: state.document.events.filter((event) => event.id !== id),
      }));
      state.editing = null;
      state.deleteConfirmId = '';
      state.notice = 'Đã xóa mục. Bấm Lưu lịch để ghi vào file.';
      render();
    },
    cancelDeleteEvent() {
      state.deleteConfirmId = '';
      render();
    },
  };

  function commit(next) {
    state.document = normalizeCalendar(next);
    state.saveState = { status: 'dirty', message: 'Có thay đổi chưa lưu' };
    options.onDocumentChange?.(state.document);
  }

  function focusEditor() {
    // Only scroll our owned containers; focus must not move the host's clipped frame.
    root.querySelector('.pc-sidebar')?.scrollTo({ top: 0 });
    root.querySelector('.pc-content')?.scrollTo({ top: 0 });
    const title = root.querySelector('[name="title"]');
    title?.focus({ preventScroll: true });
    if (!title) return;
    // A very short editor may need to scroll past the form heading to show its input.
    for (const selector of ['.pc-sidebar', '.pc-content']) {
      const scroller = root.querySelector(selector);
      if (getComputedStyle(scroller).overflowY !== 'auto') continue;
      const bounds = scroller.getBoundingClientRect();
      const input = title.getBoundingClientRect();
      if (input.bottom > bounds.bottom) scroller.scrollTop += input.bottom - bounds.bottom + 8;
      else if (input.top < bounds.top) scroller.scrollTop -= bounds.top - input.top;
    }
  }

  function changeView(view) {
    state.view = view;
    render();
  }

  function renderImportBar(toolbar) {
    const modeSelect = element('select', 'pc-import-mode');
    modeSelect.setAttribute('aria-label', 'Cách nhập lịch');
    for (const [value, label] of [['merge', 'Gộp khi nhập'], ['replace', 'Thay lịch khi nhập']]) {
      const option = element('option', '', label);
      option.value = value;
      option.selected = state.importMode === value;
      modeSelect.append(option);
    }
    modeSelect.addEventListener('change', () => {
      state.importMode = modeSelect.value;
    });
    const fileInput = element('input', 'pc-hidden-input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.setAttribute('aria-label', 'Chọn file lịch JSON để nhập');
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      try {
        const raw = await file.text();
        if (state.importMode === 'replace' && state.document.events.length
          && !globalThis.confirm('Thay thế toàn bộ lịch hiện tại bằng file nhập?')) return;
        const next = importCalendar(state.document, raw, state.importMode);
        commit(next);
        state.notice = state.importMode === 'merge' ? 'Đã gộp lịch; mục trùng ID được cập nhật, không nhân đôi.' : 'Đã thay lịch bằng file nhập.';
        render();
      } catch (error) {
        state.notice = 'Không nhập được lịch: ' + (error instanceof Error ? error.message : String(error));
        render();
      } finally {
        fileInput.value = '';
      }
    });
    toolbar.append(modeSelect);
    toolbar.append(button('Nhập JSON', 'pc-secondary-button', () => fileInput.click()));
    toolbar.append(fileInput);
  }

  function exportCalendar() {
    try {
      const content = JSON.stringify(normalizeCalendar(state.document), null, 2) + '\n';
      const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = element('a');
      link.href = url;
      link.download = 'project-calendar.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      state.notice = 'Đã xuất file project-calendar.json.';
      render();
    } catch (error) {
      state.notice = 'Không xuất được lịch: ' + (error instanceof Error ? error.message : String(error));
      render();
    }
  }

  function navigate(amount) {
    if (state.view === 'week') state.weekStart = addDays(state.weekStart, amount * 7);
    else state.monthAnchor = shiftMonth(state.monthAnchor, amount);
    render();
  }

  function renderMainToolbar(toolbar) {
    const viewGroup = element('div', 'pc-view-switch');
    for (const [view, label] of [['month', 'Tháng'], ['agenda', 'Agenda'], ['week', 'Timeline tuần']]) {
      const item = button(label, 'pc-view-button' + (state.view === view ? ' pc-selected' : ''), () => changeView(view));
      item.setAttribute('aria-pressed', state.view === view ? 'true' : 'false');
      viewGroup.append(item);
    }
    toolbar.append(viewGroup);
    const navigation = element('div', 'pc-navigation');
    navigation.append(button('‹', 'pc-icon-button', () => navigate(-1), 'Lùi một ' + (state.view === 'week' ? 'tuần' : 'tháng')));
    navigation.append(button('Hôm nay', 'pc-secondary-button', () => {
      state.monthAnchor = monthStart(today);
      state.weekStart = startOfWeek(today);
      render();
    }));
    navigation.append(button('›', 'pc-icon-button', () => navigate(1), 'Tiến một ' + (state.view === 'week' ? 'tuần' : 'tháng')));
    toolbar.append(navigation);
    const heading = state.view === 'week'
      ? formatDate(state.weekStart) + ' – ' + formatDate(addDays(state.weekStart, 6))
      : formatDate(state.monthAnchor).replace('01 ', '');
    toolbar.append(element('h2', 'pc-range-heading', heading));
    toolbar.append(button('Thêm mục', 'pc-primary-button', () => app.createEvent(state.view === 'week' ? state.weekStart : today)));
    toolbar.append(button('Xuất JSON', 'pc-secondary-button', exportCalendar));
    renderImportBar(toolbar);
  }

  function render() {
    if (destroyed) return;
    const scrollPositions = ['.pc-content', '.pc-calendar-main', '.pc-sidebar'].map((selector) => {
      const node = root.querySelector(selector);
      return { selector, top: node?.scrollTop || 0, left: node?.scrollLeft || 0 };
    });
    root.replaceChildren();
    root.classList.add('pc-root');
    const shell = element('div', 'pc-shell');
    const header = element('header', 'pc-header');
    const heading = element('div', 'pc-brand');
    heading.append(element('div', 'pc-brand-icon', '▦'));
    const titles = element('div', 'pc-brand-titles');
    append(titles, element('h1', '', 'Project Calendar'), element('p', '', 'Ngày lịch · Asia/Ho_Chi_Minh'));
    heading.append(titles);
    header.append(heading);
    const saveControls = element('div', 'pc-save-controls');
    const saveStatus = element('span', 'pc-save-status pc-save-' + state.saveState.status, state.saveState.message);
    saveStatus.setAttribute('role', 'status');
    const saveButton = button(state.saveState.status === 'saving' ? 'Đang lưu…' : 'Lưu lịch', 'pc-primary-button pc-save-button', () => { void app.saveCalendar(); });
    saveButton.disabled = state.saveState.status === 'saving' || typeof options.onSave !== 'function';
    append(saveControls, saveStatus, saveButton);
    header.append(saveControls);
    shell.append(header);

    const toolbar = element('div', 'pc-toolbar');
    renderMainToolbar(toolbar);
    shell.append(toolbar);

    if (state.notice) {
      const notice = element('div', 'pc-notice', state.notice);
      notice.setAttribute('role', 'status');
      notice.append(button('×', 'pc-notice-close', () => { state.notice = ''; render(); }, 'Đóng thông báo'));
      shell.append(notice);
    }
    renderTrackerFeedback(shell, app, state.trackerFeedback);

    const content = element('div', 'pc-content' + (state.editing ? ' pc-is-editing' : ''));
    const main = element('main', 'pc-calendar-main');
    const visibleTrackers = activeTrackers(snapshot, state.document.events, workspacePath);
    if (state.view === 'month') renderMonth(main, app, state.document, state, snapshot, visibleTrackers);
    else if (state.view === 'agenda') renderAgenda(main, app, state.document, today, visibleTrackers);
    else renderTimeline(main, app, state.document, state, visibleTrackers);
    content.append(main);
    const side = element('aside', 'pc-sidebar');
    renderEditor(side, app, state);
    renderTrackerStatus(side, app, snapshot, visibleTrackers);
    if (!state.editing) side.append(element('p', 'pc-side-help', 'Gắn tracker bằng URI trong biểu mẫu. Các mục tracker chỉ đọc; sửa ngày ở tracker gốc.'));
    content.append(side);
    shell.append(content);
    root.append(shell);
    for (const position of scrollPositions) {
      const node = root.querySelector(position.selector);
      node.scrollTop = position.top;
      node.scrollLeft = position.left;
    }
    root.inert = state.saveState.status === 'saving';
  }

  const subscribe = options.subscribeTrackerSnapshot || subscribeTrackerSnapshot;
  const unsubscribe = subscribe((next) => {
    snapshot = next?.workspacePath === workspacePath ? next : getTrackerSnapshot(workspacePath);
    render();
  }, workspacePath);
  const unsubscribeSave = options.subscribeSaveState?.((next) => {
    state.saveState = next;
    render();
  });
  render();
  return {
    hasPendingEdits() {
      return state.editing !== null || ['dirty', 'saving', 'error'].includes(state.saveState.status);
    },
    prepareSave() {
      if (!state.editing) return true;
      root.querySelector('.pc-event-form')?.requestSubmit();
      return !state.editing;
    },
    replaceDocument(documentData) {
      state.document = normalizeCalendar(documentData);
      state.editing = null;
      state.deleteConfirmId = '';
      state.saveState = { status: 'idle', message: 'Đã tải lịch' };
      state.notice = 'Lịch được cập nhật từ thay đổi bên ngoài.';
      render();
    },
    notifyExternalChange() {
      state.notice = 'Có thay đổi bên ngoài; nội dung mới đã được tải theo lifecycle editor.';
      render();
    },
    destroy() {
      destroyed = true;
      unsubscribe?.();
      unsubscribeSave?.();
      root.inert = false;
      root.replaceChildren();
      root.classList.remove('pc-root');
    },
  };
}

Object.assign(__exports, {todayInHoChiMinh, mountCalendarApp});
},
"src/calendar-ai.js": function(__exports, __require, __external) {
const { createEventId, emptyCalendar, normalizeEvent, parseCalendar, serializeCalendar, upsertEvent } = __require("src/model.js");
const { defaultCalendarPath } = __require("src/paths.js");
const { withCalendarFileLock } = __require("src/workspace-storage.js");
const openEditors = new Map();

function fileKey(filePath) {
  const path = filePath.replace(/\\/g, '/');
  return /^[A-Za-z]:\//.test(path) ? path.toLowerCase() : path;
}

function registerCalendarEditor(filePath, hasPendingEdits) {
  const key = fileKey(filePath);
  const editors = openEditors.get(key) || new Set();
  editors.add(hasPendingEdits);
  openEditors.set(key, editors);
  return () => {
    editors.delete(hasPendingEdits);
    if (!editors.size) openEditors.delete(key);
  };
}

function assertEditorClean(filePath) {
  for (const check of openEditors.get(fileKey(filePath)) || []) {
    if (check()) throw new Error('Lịch đang có thay đổi chưa lưu hoặc form đang mở. Hãy lưu/đóng form rồi gọi lại.');
  }
}

function sameEvent(left, right) {
  return ['title', 'type', 'startDate', 'endDate', 'notes', 'trackerUri'].every((key) => left[key] === right[key]);
}

function candidateEvent(args) {
  if (typeof args.title !== 'string' || args.title.trim().length > 160) throw new Error('Tiêu đề phải là chuỗi, tối đa 160 ký tự.');
  if (args.notes !== undefined && (typeof args.notes !== 'string' || args.notes.length > 4000)) throw new Error('Ghi chú phải là chuỗi, tối đa 4000 ký tự.');
  if (args.eventId !== undefined && (typeof args.eventId !== 'string' || !args.eventId.trim() || args.eventId.length > 120)) throw new Error('eventId phải là chuỗi không rỗng, tối đa 120 ký tự.');
  if (args.trackerUri !== undefined && typeof args.trackerUri !== 'string') throw new Error('trackerUri phải là chuỗi.');
  if (args.endDate !== undefined && typeof args.endDate !== 'string') throw new Error('endDate phải là ngày YYYY-MM-DD.');
  return normalizeEvent({
    id: args.eventId || createEventId(), title: args.title,
    type: args.type === undefined ? 'task' : args.type,
    startDate: args.startDate, endDate: args.endDate || null,
    notes: args.notes || '', trackerUri: args.trackerUri || '',
  });
}

async function addCalendarEvent(args = {}, context = {}) {
  try {
    // Only the host-supplied workspace selects the destination, never an AI path argument.
    const filePath = defaultCalendarPath(context.workspacePath);
    const event = candidateEvent(args);
    const filesystem = context.extensionContext?.services?.filesystem;
    if (typeof filesystem?.fileExists !== 'function' || typeof filesystem?.readFile !== 'function' || typeof filesystem?.writeFile !== 'function') {
      throw new Error('Host không cấp filesystem service cho Calendar.');
    }
    return await withCalendarFileLock(filePath, async () => {
      assertEditorClean(filePath);
      const exists = await filesystem.fileExists(filePath);
      const raw = exists ? await filesystem.readFile(filePath) : null;
      const calendar = exists ? parseCalendar(raw) : emptyCalendar();
      const byId = calendar.events.find((item) => item.id === event.id);
      if (byId && !sameEvent(byId, event)) throw new Error('eventId đã được dùng cho một sự kiện khác; không ghi đè.');
      const duplicate = byId || calendar.events.find((item) => sameEvent(item, event));
      if (duplicate) return { success: true, message: 'Sự kiện đã có trong lịch.', data: { filePath, created: false, event: duplicate } };
      const next = upsertEvent(calendar, event);
      assertEditorClean(filePath);
      const stillExists = await filesystem.fileExists(filePath);
      if (stillExists !== exists || (exists && await filesystem.readFile(filePath) !== raw)) {
        throw new Error('File lịch vừa thay đổi bên ngoài. Gọi lại để đọc dữ liệu mới nhất.');
      }
      // Guard again after awaited reads, before starting the write.
      assertEditorClean(filePath);
      await filesystem.writeFile(filePath, serializeCalendar(next));
      const persisted = parseCalendar(await filesystem.readFile(filePath));
      if (!persisted.events.some((item) => item.id === event.id && sameEvent(item, event))) {
        throw new Error('Chưa xác nhận được sự kiện trên disk; file có thể vừa thay đổi.');
      }
      return { success: true, message: 'Đã thêm và lưu sự kiện vào lịch workspace.', data: { filePath, created: true, event } };
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

const calendarAITools = [{
  name: 'calendar_add_event',
  description: 'Add and persist an all-day event to the current workspace Project Calendar. No calendar tab needs to be open. Requires title and startDate (YYYY-MM-DD); endDate is inclusive. Defaults type to task. Identical events are deduplicated; reuse eventId for retries. Returns the saved event, destination and created flag. Refuses invalid JSON, conflicting IDs or locally mounted calendars with pending edits. Do not write the calendar JSON directly.',
  scope: 'global',
  access: { kind: 'filesystem' },
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Event title, at most 160 characters.' },
      startDate: { type: 'string', description: 'First date, YYYY-MM-DD in Asia/Ho_Chi_Minh.' },
      endDate: { type: 'string', description: 'Optional inclusive last date, YYYY-MM-DD; omit for one day.' },
      type: { type: 'string', enum: ['note', 'milestone', 'task'], description: 'Defaults to task.' },
      notes: { type: 'string', description: 'Optional notes, at most 4000 characters.' },
      trackerUri: { type: 'string', description: 'Optional nimbalyst://ID tracker reference.' },
      eventId: { type: 'string', description: 'Optional stable ID, at most 120 characters; reuse for retries.' },
    },
    required: ['title', 'startDate'],
  },
  handler: addCalendarEvent,
}];

Object.assign(__exports, {registerCalendarEditor, addCalendarEvent, calendarAITools});
}};
const __cache = Object.create(null);
function __require(id) {
  if (__cache[id]) return __cache[id];
  const factory = __factories[id];
  if (typeof factory !== "function") throw new Error("Unknown bundled module: " + id);
  const exports = {};
  __cache[id] = exports;
  factory(exports, __require, __external);
  return exports;
}
const __entry = __require("src/index.js");
export const activate = __entry.activate;
export const components = { ...__entry.components, CalendarEditor: __entry.components.CalendarEditor };
export const panels = __entry.panels;
export const aiTools = __entry.aiTools;
