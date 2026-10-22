import {
  addDays,
  createEventId,
  daysFromCivil,
  emptyCalendar,
  eventEndDate,
  eventOverlapsDate,
  importCalendar,
  isDate,
  monthDates,
  normalizeCalendar,
  parseDateParts,
  startOfWeek,
  timelineRange,
  upsertEvent,
  weekDates,
} from './model.js';
import { getTrackerSnapshot, openTrackerUri, subscribeTrackerSnapshot, trackerUriToConsoleUrl } from './tracker-adapter.js';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
const TYPE_LABELS = { note: 'Ghi chú', milestone: 'Mốc', task: 'Công việc' };

export function todayInHoChiMinh(now = new Date()) {
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

export function mountCalendarApp(root, options = {}) {
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
