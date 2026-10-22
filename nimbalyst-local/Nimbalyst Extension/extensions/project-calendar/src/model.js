export const SCHEMA_VERSION = 1;
export const CALENDAR_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const EVENT_TYPES = Object.freeze(['note', 'milestone', 'task']);

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function parseDateParts(value) {
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

export function isDate(value) {
  return parseDateParts(value) !== null;
}

export function daysFromCivil(partsOrDate) {
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

export function civilFromDays(serial) {
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

export function addDays(date, amount) {
  if (!Number.isInteger(amount)) throw new Error('Số ngày phải là số nguyên.');
  return civilFromDays(daysFromCivil(date) + amount);
}

export function weekdayMondayZero(date) {
  return ((daysFromCivil(date) + 3) % 7 + 7) % 7;
}

export function startOfWeek(date) {
  return addDays(date, -weekdayMondayZero(date));
}

export function weekDates(weekStart) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function monthDates(monthDate) {
  const parts = parseDateParts(monthDate);
  if (!parts) throw new Error('Tháng cần xem không hợp lệ.');
  const first = String(parts.year).padStart(4, '0') + '-' + String(parts.month).padStart(2, '0') + '-01';
  const gridStart = addDays(first, -weekdayMondayZero(first));
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

export function eventEndDate(event) {
  return event.endDate || event.startDate;
}

export function eventOverlapsDate(event, date) {
  const day = daysFromCivil(date);
  return day >= daysFromCivil(event.startDate) && day <= daysFromCivil(eventEndDate(event));
}

export function timelineRange(event, weekStart) {
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

export function emptyCalendar() {
  return { schemaVersion: SCHEMA_VERSION, timezone: CALENDAR_TIMEZONE, events: [] };
}

export function createEventId() {
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

export function normalizeEvent(value, index = 0) {
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

export function normalizeCalendar(value) {
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

export function parseCalendar(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return emptyCalendar();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error('Không đọc được lịch JSON: ' + error.message);
  }
  return normalizeCalendar(parsed);
}

export function serializeCalendar(calendar) {
  return JSON.stringify(normalizeCalendar(calendar), null, 2) + '\n';
}

export function mergeCalendars(current, incoming) {
  const base = normalizeCalendar(current);
  const imported = normalizeCalendar(incoming);
  const merged = new Map(base.events.map((event) => [event.id, event]));
  for (const event of imported.events) merged.set(event.id, event);
  return normalizeCalendar({ schemaVersion: SCHEMA_VERSION, timezone: CALENDAR_TIMEZONE, events: [...merged.values()] });
}

export function upsertEvent(calendar, value) {
  const base = normalizeCalendar(calendar);
  const event = normalizeEvent(value);
  const index = base.events.findIndex((item) => item.id === event.id);
  const events = index < 0
    ? [...base.events, event]
    : base.events.map((item, currentIndex) => currentIndex === index ? event : item);
  return normalizeCalendar({ ...base, events });
}

export function importCalendar(current, raw, mode) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error('File nhập trống; lịch hiện tại được giữ nguyên.');
  }
  const incoming = parseCalendar(raw);
  if (mode === 'replace') return incoming;
  if (mode === 'merge') return mergeCalendars(current, incoming);
  throw new Error('Chọn cách nhập là merge hoặc replace.');
}
