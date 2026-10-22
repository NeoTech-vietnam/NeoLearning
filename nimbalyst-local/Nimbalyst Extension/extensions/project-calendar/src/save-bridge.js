// Both the Calendar button and native Save run the SDK's registered callback.
// Observing saveContent also surfaces failures swallowed by the v0.80.4 hook.
export function createLifecycleSaveBridge(originalHost, options = {}) {
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
