import { createEventId, emptyCalendar, normalizeEvent, parseCalendar, serializeCalendar, upsertEvent } from './model.js';
import { defaultCalendarPath } from './paths.js';
import { withCalendarFileLock } from './workspace-storage.js';

const openEditors = new Map();

function fileKey(filePath) {
  const path = filePath.replace(/\\/g, '/');
  return /^[A-Za-z]:\//.test(path) ? path.toLowerCase() : path;
}

export function registerCalendarEditor(filePath, hasPendingEdits) {
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

export async function addCalendarEvent(args = {}, context = {}) {
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

export const calendarAITools = [{
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
