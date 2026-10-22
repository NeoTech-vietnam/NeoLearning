// Host database schema and navigation are pinned to this Nimbalyst build.
// Query only session metadata and projected event markers, never message bodies.
export const SESSION_SQL = `SELECT id, title, provider, model, status, last_activity, updated_at, created_at,
  created_by_session_id, parent_session_id, branched_from_session_id,
  CASE WHEN json_valid(metadata) THEN json_extract(metadata, '$.phase') ELSE NULL END AS phase
  , CASE WHEN json_valid(metadata) THEN json_extract(metadata, '$.tokenUsage.currentContext.tokens') ELSE NULL END AS context_tokens
  , CASE WHEN json_valid(metadata) THEN COALESCE(json_extract(metadata, '$.tokenUsage.currentContext.contextWindow'), json_extract(metadata, '$.tokenUsage.contextWindow')) ELSE NULL END AS context_window
  FROM ai_sessions
  WHERE workspace_id = $1 AND COALESCE(is_archived, 0) = 0
  ORDER BY CASE status WHEN 'waiting_for_input' THEN 0 WHEN 'error' THEN 1 WHEN 'running' THEN 2 ELSE 3 END,
    COALESCE(last_activity, updated_at) DESC, id
  LIMIT 80`;

export function mapSessionStatus(row) {
  if (['running', 'processing', 'streaming'].includes(row.status)) return 'live-running';
  if (['waiting_for_input', 'waiting_for_approval'].includes(row.status)) return 'live-waiting';
  if (['error', 'failed'].includes(row.status)) return 'live-error';
  if (['paused', 'cancelled', 'interrupted'].includes(row.status)) return 'live-paused';
  if (['completed', 'complete'].includes(row.status) || (row.status === 'idle' && row.phase === 'complete')) return 'live-done';
  if (row.status === 'idle') return 'live-idle';
  return 'live-unknown';
}

export function sessionTitle(row) {
  return String(row.title || 'Session chưa đặt tên').replace(/\s+/g, ' ').trim();
}

export function providerLabel(provider) {
  return ({ 'openai-codex': 'Codex', 'claude-code': 'Claude Code', claude: 'Claude', openai: 'OpenAI', opencode: 'OpenCode', gemini: 'Gemini', 'github-copilot': 'Copilot' })[provider] || provider || 'AI';
}

export async function readWorkspaceSessions(host) {
  if (!host.workspacePath) throw Error('Chưa xác định được workspace.');
  if (!host.data?.query) throw Error('Bản Nimbalyst này chưa cung cấp quyền đọc dữ liệu session.');
  const rows = await host.data.query(SESSION_SQL, [host.workspacePath]);
  if (!Array.isArray(rows)) throw Error('Dữ liệu session không hợp lệ.');
  return rows.filter(row => typeof row.id === 'string');
}

export function sessionAppearance(id) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const colors = ['#80d6be', '#9cbff5', '#c3a7eb', '#e8bc7c'];
  const hairs = ['#302c38', '#b5794e', '#333a51', '#614c40'];
  return { color: colors[hash % 4], hair: hairs[(hash >>> 2) % 4] };
}

export function sessionsInScene(rows) {
  return rows.map(row => ({ ...row, ...sessionAppearance(row.id), name: sessionTitle(row), role: providerLabel(row.provider),
    status: mapSessionStatus(row), rawStatus: row.status || 'unknown' }));
}

export function activityQuery(ids) {
  if (!ids.length) return null;
  const recent = ids.map((_, index) => `SELECT id FROM (SELECT id FROM ai_agent_messages WHERE session_id = $${index + 1} ORDER BY id DESC LIMIT 40)`).join(' UNION ALL ');
  const content = "CASE WHEN json_valid(content) THEN content ELSE '{}' END";
  return `SELECT id, session_id, created_at, direction, message_kind,
    json_extract(${content}, '$.method') AS method,
    json_extract(${content}, '$.type') AS event_type,
    json_extract(${content}, '$.params.item.type') AS item_type,
    COALESCE(json_extract(${content}, '$.params.item.id'), json_extract(${content}, '$.params.itemId'), json_extract(${content}, '$.id')) AS item_id,
    COALESCE(json_extract(${content}, '$.params.item.tool'), json_extract(${content}, '$.params.item.name'), json_extract(${content}, '$.name')) AS tool_name,
    json_extract(${content}, '$.params.item.status') AS item_status,
    COALESCE(json_extract(${content}, '$.tool_use_id'), json_extract(${content}, '$.custom_tool_use_id'), json_extract(${content}, '$.params.tool_use_id')) AS tool_use_id,
    (SELECT json_group_array(json_object('type', json_extract(value, '$.type'), 'id', json_extract(value, '$.id'), 'name', json_extract(value, '$.name'), 'tool_use_id', json_extract(value, '$.tool_use_id')))
       FROM json_each(${content}, '$.message.content') WHERE json_valid(value) AND json_type(value) = 'object') AS blocks
    FROM ai_agent_messages WHERE id IN (${recent}) ORDER BY id`;
}

export function shortToolName(value) {
  return String(value || 'tool').split('__').at(-1).replace(/[\r\n\t]/g, ' ').slice(0, 56);
}

export function summarizeActivity(session, records = [], now = Date.now()) {
  const state = mapSessionStatus(session);
  const base = {
    'live-idle': ['idle', 'Rảnh'], 'live-waiting': ['waiting', 'Chờ bạn trả lời'],
    'live-error': ['error', 'Session có lỗi'], 'live-paused': ['paused', 'Đã tạm dừng'],
    'live-done': ['done', 'Đã hoàn tất'], 'live-unknown': ['unknown', 'Chưa rõ hoạt động'],
  };
  if (base[state]) return { kind: base[state][0], label: base[state][1], tool: null, observedAt: null };
  const active = new Map();
  let latest = null;
  const mark = (kind, record, tool = null) => { latest = { kind, tool, observedAt: record.created_at, id: record.id }; };
  for (const record of [...records].sort((a, b) => a.id - b.id)) {
    let blocks;
    try { blocks = typeof record.blocks === 'string' ? JSON.parse(record.blocks) : record.blocks || []; } catch { blocks = []; }
    if (!Array.isArray(blocks)) blocks = [];
    const method = record.method || '';
    const type = record.event_type || '';
    if ((record.direction === 'input' && record.message_kind === 'user' && !blocks.some(block => block.type === 'tool_result')) || method === 'turn/started') {
      active.clear(); mark('processing', record);
    }
    if (method === 'turn/completed') { active.clear(); mark('processing', record); }
    const toolItem = ['mcpToolCall', 'commandExecution', 'fileChange', 'webSearch', 'dynamicToolCall', 'functionCall', 'collabAgentToolCall'].includes(record.item_type);
    const tool = record.tool_name || ({ commandExecution: 'Chạy lệnh', fileChange: 'Sửa file', webSearch: 'Tìm trên web', collabAgentToolCall: 'Điều phối agent' })[record.item_type] || 'tool';
    if ((method === 'item/started' && toolItem) || ['tool_use', 'agent.tool_use', 'agent.mcp_tool_use', 'agent.custom_tool_use'].includes(type)) {
      active.set(record.item_id || `tool:${shortToolName(tool)}`, { kind: 'tool', tool: shortToolName(tool), observedAt: record.created_at, id: record.id });
      mark('tool', record, shortToolName(tool));
    }
    if (method === 'item/completed' && toolItem) { active.delete(record.item_id || `tool:${shortToolName(tool)}`); mark('recent-tool', record, shortToolName(tool)); }
    if (['tool_result', 'user.tool_result', 'user.custom_tool_result', 'agent.tool_result', 'agent.mcp_tool_result'].includes(type)) { active.delete(record.tool_use_id); mark('processing', record); }
    if ((method === 'item/started' && record.item_type === 'reasoning') || /reasoning.*Delta/.test(method) || type === 'agent.thinking') mark('thinking', record);
    if (method === 'item/completed' && record.item_type === 'reasoning') mark('recent-thinking', record);
    if ((record.item_type === 'agentMessage' && method === 'item/started') || /agentMessage.*Delta/.test(method) || type === 'agent.message') mark('answering', record);
    if (record.item_type === 'agentMessage' && method === 'item/completed') mark('recent-answer', record);
    for (const block of blocks) {
      if (block.type === 'tool_use') {
        const activity = { kind: 'tool', tool: shortToolName(block.name), observedAt: record.created_at, id: record.id };
        active.set(block.id || record.id, activity); latest = activity;
      } else if (block.type === 'tool_result') { active.delete(block.tool_use_id); mark('processing', record); }
      else if (block.type === 'thinking') mark('recent-thinking', record);
      else if (block.type === 'text') mark('recent-answer', record);
    }
  }
  const fresh = activity => activity && Number.isFinite(Date.parse(activity.observedAt)) && now - Date.parse(activity.observedAt) >= 0 && now - Date.parse(activity.observedAt) < 90000;
  const ongoing = [...active.values()].filter(fresh).at(-1);
  const current = ongoing || (fresh(latest) ? latest : null);
  const labels = { tool: 'Đang chạy tool', thinking: 'Đang suy nghĩ', answering: 'Đang trả lời', 'recent-thinking': 'Vừa suy nghĩ', 'recent-tool': 'Đang xử lý', 'recent-answer': 'Vừa trả lời', processing: 'Đang xử lý' };
  return current ? { ...current, label: labels[current.kind] || 'Đang xử lý' }
    : { kind: 'processing', label: 'Đang xử lý', tool: null, observedAt: null };
}

export async function readSessionActivity(host, rows) {
  const sql = activityQuery(rows.map(row => row.id));
  if (!sql) return [];
  const records = await host.data.query(sql, rows.map(row => row.id));
  if (!Array.isArray(records)) throw Error('Dữ liệu hoạt động không hợp lệ.');
  return records;
}

export function attachActivities(rows, records, now = Date.now()) {
  const bySession = new Map();
  for (const record of records) {
    if (!bySession.has(record.session_id)) bySession.set(record.session_id, []);
    bySession.get(record.session_id).push(record);
  }
  return rows.map(row => {
    const events = bySession.get(row.id) || [];
    const rest = sessionRestState(row, events, now);
    const activity = rest.sleeping
      ? { kind: 'sleeping', label: 'Đang ngủ', tool: null, observedAt: rest.observedAt }
      : summarizeActivity(row, events, now);
    return { ...row, rest, activity };
  });
}

export const SESSION_SLEEP_AFTER = 10 * 60 * 1000;
const SLEEP_ELIGIBLE_STATES = new Set(['live-idle', 'live-waiting', 'live-paused', 'live-done', 'live-error']);
export function sessionRestState(row, records = [], now = Date.now()) {
  const timestamp = value => value == null || value === '' ? NaN : typeof value === 'number' ? value : Date.parse(value);
  // Prefer actual activity/events: metadata-only updates should not wake a sleeper.
  const valid = value => Number.isFinite(value) && Math.abs(value) <= 8640000000000000;
  let times = [row.last_activity, ...records.map(record => record.created_at)].map(timestamp).filter(valid);
  if (!times.length) times = [row.updated_at, row.created_at].map(timestamp).filter(valid);
  const last = times.length ? Math.max(...times) : null;
  const elapsed = last == null ? null : now - last;
  return { sleeping: SLEEP_ELIGIBLE_STATES.has(mapSessionStatus(row)) && elapsed != null && elapsed >= SESSION_SLEEP_AFTER,
    observedAt: last == null ? null : new Date(last).toISOString(), idleMs: elapsed == null || elapsed < 0 ? null : elapsed };
}

export function sessionRelations(rows) {
  const ids = new Set(rows.map(row => row.id));
  return rows.flatMap(row => {
    const parent = row.created_by_session_id || (!row.branched_from_session_id && row.parent_session_id);
    return parent && parent !== row.id && ids.has(parent) ? [{ source: parent, target: row.id, label: row.created_by_session_id ? 'Tạo session' : 'Session con' }] : [];
  });
}

export function openRealSession(host, sessionId, dispatch = detail => window.dispatchEvent(new CustomEvent('open-ai-session', { detail })), schedule = callback => requestAnimationFrame(callback)) {
  if (!sessionId) return;
  // Match the built-in Project Graph's session navigation route.
  host.close();
  schedule(() => dispatch({ sessionId, workspacePath: host.workspacePath }));
}
