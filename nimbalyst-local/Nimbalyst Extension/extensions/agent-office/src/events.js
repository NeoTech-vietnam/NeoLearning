// Read-only event adapter for this Nimbalyst build. Project identifiers and
// lifecycle markers in SQL; message bodies and reasoning never leave the DB.
export const OFFICE_EVENT_LIMIT = 600;

export function officeEventQuery(ids, cursors = {}) {
  if (!ids.length) return null;
  const params = [...ids];
  const parts = ids.flatMap((id, index) => {
    const binding = `$${index + 1}`;
    if (Number.isSafeInteger(cursors[id]) && cursors[id] > 0) {
      params.push(cursors[id]);
      return [`SELECT id FROM (SELECT id FROM ai_agent_messages WHERE session_id = ${binding} AND id > $${params.length} ORDER BY id LIMIT 200)`];
    }
    return [
      `SELECT id FROM (SELECT id FROM ai_agent_messages WHERE session_id = ${binding} ORDER BY id DESC LIMIT 160)`,
      // Preserve recent delivered handoffs even after many subsequent tools.
      `SELECT id FROM (SELECT id FROM ai_agent_messages WHERE session_id = ${binding} AND direction = 'input' AND json_valid(metadata) AND json_extract(metadata, '$.promptProvenance.originSessionId') IS NOT NULL ORDER BY id DESC LIMIT 40)`,
    ];
  });
  const content = "CASE WHEN json_valid(content) THEN content ELSE '{}' END";
  const metadata = "CASE WHEN json_valid(metadata) THEN metadata ELSE '{}' END";
  const result = `(SELECT json_extract(value, '$.text') FROM json_each(${content}, '$.params.item.result.content') WHERE json_valid(value) AND json_extract(value, '$.type') = 'text' AND json_valid(json_extract(value, '$.text')) LIMIT 1)`;
  const sql = `SELECT id, session_id, created_at, direction, message_kind,
    json_extract(${content}, '$.method') AS method,
    json_extract(${content}, '$.type') AS event_type,
    json_extract(${content}, '$.params.item.type') AS item_type,
    COALESCE(json_extract(${content}, '$.params.item.id'), json_extract(${content}, '$.params.itemId'), json_extract(${content}, '$.id')) AS item_id,
    COALESCE(json_extract(${content}, '$.params.item.tool'), json_extract(${content}, '$.params.item.name'), json_extract(${content}, '$.name')) AS tool_name,
    json_extract(${content}, '$.params.item.status') AS item_status,
    CASE WHEN json_type(${content}, '$.params.item.durationMs') IN ('integer','real') THEN json_extract(${content}, '$.params.item.durationMs') END AS duration_ms,
    CASE WHEN json_type(${content}, '$.params.item.error') NOT IN ('null') OR json_extract(${content}, '$.params.item.result.isError') = 1 THEN 1 ELSE 0 END AS tool_failed,
    json_extract(${content}, '$.params.item.arguments.sessionId') AS target_session_id,
    json_extract(${content}, '$.params.item.arguments.messageKind') AS send_kind,
    json_extract(${result}, '$.sessionId') AS result_session_id,
    json_extract(${result}, '$.queuedPromptId') AS queued_prompt_id,
    json_extract(${metadata}, '$.promptProvenance.originSessionId') AS origin_session_id,
    json_extract(${metadata}, '$.promptProvenance.queuedPromptId') AS received_prompt_id,
    json_extract(${metadata}, '$.promptProvenance.messageKind') AS received_kind,
    json_extract(${metadata}, '$.promptProvenance.origin') AS received_origin,
    (SELECT json_group_array(json_object('type', json_extract(value, '$.type'), 'id', json_extract(value, '$.id'), 'name', json_extract(value, '$.name'), 'tool_use_id', json_extract(value, '$.tool_use_id')))
      FROM json_each(${content}, '$.message.content') WHERE json_valid(value) AND json_type(value) = 'object') AS blocks
    FROM ai_agent_messages WHERE id IN (${parts.join(' UNION ')}) ORDER BY id`;
  return { sql, params };
}

export async function readOfficeEvents(host, rows, cursors = {}) {
  const query = officeEventQuery(rows.map(row => row.id), cursors);
  if (!query) return [];
  const records = await host.data.query(query.sql, query.params);
  if (!Array.isArray(records)) throw Error('Dữ liệu timeline không hợp lệ.');
  return records;
}

const officeToolName = value => String(value || 'tool').split('__').at(-1).replace(/[\r\n\t]/g, ' ').slice(0, 56);
const officeToolTypes = new Set(['mcpToolCall', 'commandExecution', 'fileChange', 'webSearch', 'dynamicToolCall', 'functionCall', 'collabAgentToolCall']);
const toolTypeLabels = { commandExecution: 'Chạy lệnh', fileChange: 'Sửa file', webSearch: 'Tìm trên web', collabAgentToolCall: 'Điều phối agent' };

export function normalizeOfficeEvents(records, rows) {
  const ids = new Set(rows.map(row => row.id));
  const events = [];
  for (const row of rows) {
    const parent = row.created_by_session_id || (!row.branched_from_session_id && row.parent_session_id);
    if (parent && ids.has(parent) && parent !== row.id && row.created_at) events.push({
      id: `created:${row.id}`, kind: 'agent-created', category: 'session', sessionId: parent,
      targetId: row.id, at: row.created_at, label: 'Tạo session',
    });
  }
  for (const record of records) {
    if (!ids.has(record.session_id)) continue;
    const base = { sessionId: record.session_id, at: record.created_at, recordId: record.id, callId: record.item_id || null };
    const add = (kind, category, label, extra = {}, suffix = '') => events.push({ ...base, id: `message:${record.id}:${kind}:${suffix}`, kind, category, label, ...extra });
    const method = record.method || '';
    const started = method === 'item/started';
    const completed = method === 'item/completed';
    const tool = officeToolName(record.tool_name || toolTypeLabels[record.item_type]);
    if (officeToolTypes.has(record.item_type) && (started || completed)) {
      const failed = Boolean(record.tool_failed) || ['failed', 'error'].includes(record.item_status);
      add(started ? 'tool-start' : failed ? 'tool-failed' : 'tool-end', 'tool', started ? 'Bắt đầu tool' : failed ? 'Tool lỗi' : 'Tool kết thúc', { tool, durationMs: completed && Number.isFinite(record.duration_ms) ? record.duration_ms : null });
      const target = record.result_session_id || record.target_session_id;
      if (tool === 'send_prompt' && target && ids.has(target) && target !== record.session_id) {
        const messageKind = ['instruction', 'report', 'status', 'question', 'error'].includes(record.send_kind) ? record.send_kind : 'instruction';
        const queued = completed && !failed && Boolean(record.queued_prompt_id);
        add(started ? 'message-sending' : failed ? 'message-failed' : queued ? 'message-queued' : 'message-unconfirmed', 'handoff',
          started ? 'Đang gửi' : failed ? 'Gửi lỗi' : queued ? 'Đã vào hàng đợi' : 'Gửi chưa xác minh',
          { targetId: target, messageKind, queueId: record.queued_prompt_id || null });
      }
    }
    if (record.direction === 'input') {
      if (record.origin_session_id && ids.has(record.origin_session_id) && record.origin_session_id !== record.session_id) {
        add('message-received', 'handoff', record.received_origin === 'child-session-update' ? 'Nhận kết quả session' : 'Đã nhận', {
          sessionId: record.origin_session_id, targetId: record.session_id,
          messageKind: record.received_kind || 'instruction', queueId: record.received_prompt_id || null,
        });
      } else if (!record.origin_session_id && record.message_kind === 'user') add('prompt-received', 'session', 'Nhận prompt');
    }
    if (record.item_type === 'reasoning' && (started || completed)) add(started ? 'thinking-start' : 'thinking-end', 'thinking', started ? 'Đang suy nghĩ' : 'Suy nghĩ xong');
    if (record.item_type === 'agentMessage' && (started || completed)) add(started ? 'answer-start' : 'answer-end', 'session', started ? 'Đang trả lời' : 'Trả lời xong');
    if (method === 'turn/started') add('turn-start', 'session', 'Bắt đầu lượt');
    if (method === 'turn/completed') add('turn-end', 'session', 'Kết thúc lượt');
    let blocks;
    try { blocks = typeof record.blocks === 'string' ? JSON.parse(record.blocks) : record.blocks; } catch { blocks = []; }
    if (Array.isArray(blocks)) blocks.forEach((block, index) => {
      if (block.type === 'tool_use') add('tool-start', 'tool', 'Bắt đầu tool', { tool: officeToolName(block.name), callId: block.id }, String(index));
      else if (block.type === 'tool_result') add('tool-end', 'tool', 'Tool kết thúc', { tool: null, callId: block.tool_use_id }, String(index));
      else if (block.type === 'thinking') add('thinking-end', 'thinking', 'Suy nghĩ xong', {}, String(index));
      else if (block.type === 'text') add('answer-end', 'session', 'Trả lời xong', {}, String(index));
    });
  }
  return events;
}

export function mergeOfficeEvents(previous, incoming, limit = OFFICE_EVENT_LIMIT) {
  if (limit <= 0) return [];
  const byId = new Map(previous.map(entry => [entry.id, { ...entry }]));
  for (const entry of incoming) byId.set(entry.id, { ...entry });
  const all = [...byId.values()].sort((a, b) => (Date.parse(a.at) || 0) - (Date.parse(b.at) || 0) || (a.recordId || 0) - (b.recordId || 0) || a.id.localeCompare(b.id));
  const starts = new Map();
  for (const entry of all) {
    const key = `${entry.sessionId}:${entry.callId}`;
    if (entry.kind === 'tool-start' && entry.callId) starts.set(key, entry);
    if (['tool-end', 'tool-failed'].includes(entry.kind) && entry.callId && starts.has(key)) {
      const start = starts.get(key);
      entry.tool ||= start.tool;
      const duration = Date.parse(entry.at) - Date.parse(start.at);
      if (entry.durationMs == null && duration >= 0) entry.durationMs = duration;
      starts.delete(key);
    }
  }
  // Retain a bounded handoff history even while a busy session runs many tools.
  const handoffs = all.filter(entry => entry.kind === 'message-received').slice(-Math.min(200, Math.floor(limit / 3)));
  const retained = new Set(handoffs.map(entry => entry.id));
  for (const entry of all.filter(entry => !retained.has(entry.id)).slice(-(limit - handoffs.length))) retained.add(entry.id);
  return all.filter(entry => retained.has(entry.id));
}

export function communicationRelations(events, rows) {
  const ids = new Set(rows.map(row => row.id));
  const received = new Map();
  for (const entry of events) {
    if (entry.kind !== 'message-received' || !ids.has(entry.sessionId) || !ids.has(entry.targetId) || entry.sessionId === entry.targetId) continue;
    // A recorded receipt proves delivery. A successful send only proves queuing.
    received.set(entry.queueId || entry.id, entry);
  }
  const links = new Map();
  for (const entry of received.values()) {
    const key = `${entry.sessionId}:${entry.targetId}`;
    const previous = links.get(key);
    const isReport = entry.messageKind === 'report';
    links.set(key, { source: entry.sessionId, target: entry.targetId, type: 'communication',
      label: isReport ? 'Báo cáo' : 'Trao đổi', count: (previous?.count || 0) + 1,
      at: entry.at, eventId: entry.id, messageKind: entry.messageKind });
  }
  return [...links.values()].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}
