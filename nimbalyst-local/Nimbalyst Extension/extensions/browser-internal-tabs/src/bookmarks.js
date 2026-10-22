export const BOOKMARKS_KEY = 'browser-bookmarks-v1';
export const BOOKMARKS_EVENT = 'nimbalyst-browser-bookmarks-changed';
export const BOOKMARKS_LIMIT = 100;
let bookmarkWriteQueue = Promise.resolve();

export function bookmarkUrl(value) {
  try {
    if (typeof value !== 'string' || value.length > 4096) return null;
    const url = new URL(value.trim());
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function readBookmarks(storage) {
  if (!storage?.getGlobal || !storage?.setGlobal) throw Error('Chưa truy cập được nơi lưu dấu trang.');
  const saved = storage.getGlobal(BOOKMARKS_KEY);
  if (saved == null) return [];
  if (!Array.isArray(saved)) throw Error('Dữ liệu dấu trang chưa đọc được.');
  const seen = new Set();
  return saved.flatMap(item => {
    const url = bookmarkUrl(item?.url);
    if (!url || seen.has(url)) return [];
    seen.add(url);
    const title = String(item.title || new URL(url).hostname).replace(/[\r\n\t]/g, ' ').trim().slice(0, 80);
    return [{ url, title: title || new URL(url).hostname }];
  }).slice(0, BOOKMARKS_LIMIT);
}
export function changeBookmark(storage, action, notify = () => {}) {
  const write = bookmarkWriteQueue.then(async () => {
    const items = readBookmarks(storage), url = bookmarkUrl(action.url);
    if (!url) throw Error('Chỉ lưu dấu trang cho địa chỉ HTTP hoặc HTTPS hợp lệ.');
    let next;
    if (action.kind === 'remove') next = items.filter(item => item.url !== url);
    else if (action.kind === 'add') {
      if (items.some(item => item.url === url)) return items;
      if (items.length >= BOOKMARKS_LIMIT) throw Error('Đã có 100 dấu trang; hãy xóa một mục trước khi thêm.');
      const title = String(action.title || new URL(url).hostname).replace(/[\r\n\t]/g, ' ').trim().slice(0, 80);
      next = [...items, { url, title: title || new URL(url).hostname }];
    } else throw Error('Thao tác dấu trang không hợp lệ.');
    await storage.setGlobal(BOOKMARKS_KEY, next);
    notify();
    return next;
  });
  bookmarkWriteQueue = write.catch(() => {});
  return write;
}

// Reuse host React and the original toolbar without adding a runtime dependency.
export function createBookmarkComponents(react, Toolbar) {
  const { jsx, jsxs, useState, useEffect } = react;
  function BookmarkBar({ storage, state, onNavigate }) {
    const [items, setItems] = useState([]), [error, setError] = useState(''), [busy, setBusy] = useState(false);
    useEffect(() => {
      const reload = () => { try { setItems(readBookmarks(storage)); setError(''); } catch (failure) { setError(failure.message); } };
      reload(); window.addEventListener(BOOKMARKS_EVENT, reload);
      return () => window.removeEventListener(BOOKMARKS_EVENT, reload);
    }, [storage]);
    const current = bookmarkUrl(state?.url), saved = items.some(item => item.url === current);
    async function update(action) {
      setBusy(true); setError('');
      try {
        setItems(await changeBookmark(storage, action, () => window.dispatchEvent(new Event(BOOKMARKS_EVENT))));
      } catch (failure) { setError(failure.message || 'Chưa lưu được dấu trang.'); }
      finally { setBusy(false); }
    }
    return jsxs('nav', { className: 'nim-browser-bookmarks', 'aria-label': 'Thanh dấu trang', children: [
      jsx('button', { type: 'button', className: 'nim-browser-bookmark-add', disabled: busy || !current || saved,
        title: saved ? 'Trang này đã có trong dấu trang' : 'Lưu trang hiện tại', 'aria-label': saved ? 'Trang đã lưu' : 'Lưu trang hiện tại',
        onClick: () => update({ kind: 'add', url: current, title: state?.title }), children: saved ? '★ Đã lưu' : '☆ Lưu trang' }),
      jsx('div', { className: 'nim-browser-bookmark-list', children: items.length ? items.map(item => jsxs('span', { className: 'nim-browser-bookmark', children: [
        jsx('button', { type: 'button', className: 'nim-browser-bookmark-open', title: `${item.title}\n${item.url}`, onClick: () => onNavigate(item.url), children: item.title }),
        jsx('button', { type: 'button', className: 'nim-browser-bookmark-remove', disabled: busy, title: `Xóa ${item.title}`, 'aria-label': `Xóa dấu trang ${item.title}`, onClick: () => update({ kind: 'remove', url: item.url }), children: '×' }),
      ] }, item.url)) : jsx('span', { className: 'nim-browser-bookmarks-empty', children: 'Lưu những trang bạn thường mở ở đây' }) }),
      error && jsx('span', { className: 'nim-browser-bookmarks-error', role: 'alert', children: error }),
    ] });
  }
  function BookmarkToolbar({ host, ...props }) {
    return jsxs('div', { className: 'nim-browser-navigation', children: [jsx(Toolbar, props), jsx(BookmarkBar, { storage: host.storage, state: props.state, onNavigate: props.onNavigate })] });
  }
  return { BookmarkBar, BookmarkToolbar };
}
