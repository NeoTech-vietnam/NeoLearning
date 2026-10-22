import { createElement as h, useEffect, useRef, useState } from 'react';






function useThunderSound() {
  const audio = useRef(null), enabledRef = useRef(false);
  const [enabled, setEnabled] = useState(false), [error, setError] = useState(null);
  useEffect(() => () => { audio.current?.close().catch(() => {}); }, []);
  async function toggle() {
    try {
      if (enabledRef.current) { enabledRef.current = false; setEnabled(false); await audio.current?.suspend(); }
      else {
        audio.current ||= createThunderAudio(window.AudioContext || window.webkitAudioContext);
        await audio.current.resume(); enabledRef.current = true; setEnabled(true);
      }
      setError(null);
    } catch (e) { setError(String(e?.message || e)); }
  }
  return { enabled, error, toggle, play: power => enabledRef.current && audio.current?.play(power), stop: () => audio.current?.stop() };
}

const weatherPollBusy = { realtime: false, forecast: false };
function WeatherSettings({ storage }) {
  const [location, setLocation] = useState(() => { try { return weatherSettings(storage.getGlobal(WEATHER_SETTINGS_KEY)); } catch { return DEFAULT_WEATHER_SETTINGS; } });
  const [key, setKey] = useState(''), [configured, setConfigured] = useState(false);
  const [message, setMessage] = useState(''), [saving, setSaving] = useState(false);
  useEffect(() => {
    let disposed = false;
    storage.getSecret(WEATHER_SECRET_KEY).then(value => { if (!disposed) setConfigured(Boolean(value)); })
      .catch(() => { if (!disposed) setMessage('Chưa truy cập được kho API key.'); });
    return () => { disposed = true; };
  }, [storage]);
  async function save(e) {
    e.preventDefault(); setSaving(true); setMessage('');
    try {
      const normalized = weatherSettings({ ...location, latitude: Number(location.latitude), longitude: Number(location.longitude) });
      if (key.trim()) {
        await storage.setSecret(WEATHER_SECRET_KEY, key.trim()); setConfigured(true); setKey('');
        const deadline = Number(storage.getGlobal(WEATHER_ATTEMPT_KEY)) || 0;
        // Replacing a rejected key may end its long backoff, but keeps a full 5-minute guard.
        if (deadline > Date.now() + weatherInterval('tomorrow')) await storage.setGlobal(WEATHER_ATTEMPT_KEY, Date.now() + weatherInterval('tomorrow'));
      }
      await storage.setGlobal(WEATHER_SETTINGS_KEY, normalized);
      setLocation(normalized); setMessage('Đã lưu. Thời tiết sẽ cập nhật khi hết thời gian chờ của API.');
      window.dispatchEvent(new Event('agent-office-weather-settings'));
    } catch { setMessage('Chưa lưu được. Kiểm tra tọa độ và kho API key.'); }
    finally { setSaving(false); }
  }
  async function removeKey() {
    setSaving(true);
    try {
      await storage.deleteSecret(WEATHER_SECRET_KEY); setConfigured(false); setKey(''); setMessage('Đã xóa key. Dùng Open-Meteo cho khu vực đã chọn.');
      window.dispatchEvent(new Event('agent-office-weather-settings'));
    } catch { setMessage('Chưa xóa được API key.'); }
    finally { setSaving(false); }
  }
  return h('form', { className: 'ao-weather-settings', onSubmit: save, 'aria-label': 'Cài đặt thời tiết' },
    h('strong', null, 'Thời tiết khu vực của bạn'),
    h('p', null, 'Thời tiết hiện tại: mỗi 5 phút. Dự báo Tomorrow.io: mỗi 20 phút. Chưa nhập key: dùng Open-Meteo cho hiện tại.'),
    h('label', null, 'Tên khu vực', h('input', { value: location.label, required: true, maxLength: 80, onChange: e => setLocation(previous => ({ ...previous, label: e.target.value })) })),
    h('div', { className: 'ao-weather-coordinates' },
      h('label', null, 'Vĩ độ', h('input', { type: 'number', step: 'any', min: -90, max: 90, required: true, value: location.latitude, onChange: e => setLocation(previous => ({ ...previous, latitude: e.target.value })) })),
      h('label', null, 'Kinh độ', h('input', { type: 'number', step: 'any', min: -180, max: 180, required: true, value: location.longitude, onChange: e => setLocation(previous => ({ ...previous, longitude: e.target.value })) }))),
    h('small', null, 'Mặc định là một tọa độ đại diện trong Quận 7. Có thể chỉnh gần khu vực bạn muốn theo dõi.'),
    h('label', null, 'API key Tomorrow.io', h('input', { type: 'password', value: key, autoComplete: 'off', spellCheck: false, maxLength: 512, placeholder: configured ? 'Đã có key · để trống để giữ nguyên' : 'Nhập key gói Free tại đây', onChange: e => setKey(e.target.value) })),
    h('small', null, 'Key được lưu bằng kho secret của Nimbalyst. Thời gian dữ liệu có thể trễ so với thời tiết ngoài trời.'),
    h('div', { className: 'ao-weather-settings-actions' }, h('button', { type: 'submit', className: 'ao-button', disabled: saving }, saving ? 'Đang lưu…' : 'Lưu thời tiết'),
      configured && h('button', { type: 'button', className: 'ao-button', disabled: saving, onClick: removeKey }, 'Xóa API key'),
      h('a', { href: 'https://app.tomorrow.io/', target: '_blank', rel: 'noopener noreferrer' }, 'Lấy API key')),
    message && h('p', { role: 'status' }, message));
}
const weatherBackgrounds = new Map();
let liveWater = null;
function weatherBackgroundFor(host, forecast = false) {
  const feed = forecast ? 'forecast' : 'realtime';
  if (weatherBackgrounds.has(feed)) return weatherBackgrounds.get(feed);
  const attemptKey = forecast ? FORECAST_ATTEMPT_KEY : WEATHER_ATTEMPT_KEY;
  const cacheKey = forecast ? FORECAST_CACHE_KEY : WEATHER_CACHE_KEY;
  const restore = forecast ? restoreForecast : restoreWeather;
  const request = forecast ? fetchForecast : fetchWeather;
  const hostRef = { current: host };
  const dataRef = { current: null };
  let snapshot = { data: null, location: DEFAULT_WEATHER_SETTINGS, provider: null, loading: false, error: null, checkedAt: Date.now(), nextAttempt: 0 };
  const listeners = new Set();
  const setSnapshot = next => {
    if (!forecast) liveWater?.tick();
    snapshot = typeof next === 'function' ? next(snapshot) : next;
    if (!forecast) liveWater?.tick();
    for (const listener of listeners) listener(snapshot);
  };
    let disposed = false, busy = false, controller, settings, apiKey, generation = 0;
    const storage = hostRef.current.storage;
    async function poll() {
      const now = Date.now();
      if (busy || disposed || !settings) return;
      if (forecast && !apiKey) return;
      const provider = apiKey ? 'tomorrow' : 'open-meteo';
      const interval = forecast ? FORECAST_INTERVAL : weatherInterval(provider);
      const cached = restore(storage.getGlobal(cacheKey), now, settings, provider);
      if (cached && (!dataRef.current || cached.fetchedAt > dataRef.current.fetchedAt)) dataRef.current = cached;
      const nextAttempt = Number(storage.getGlobal(attemptKey)) || 0;
      if (weatherPollBusy[feed] || now < nextAttempt || (dataRef.current && now - dataRef.current.fetchedAt < interval)) {
        setSnapshot(previous => ({ ...previous, data: dataRef.current, checkedAt: now, nextAttempt })); return;
      }
      const requestGeneration = generation;
      busy = true; weatherPollBusy[feed] = true;
      controller = new AbortController();
      let timeout;
      setSnapshot(previous => ({ ...previous, loading: true }));
      try {
        const deadline = now + interval;
        // Persist before the request: remounts, reloads and manual refresh respect quota.
        await storage.setGlobal(attemptKey, deadline);
        if (disposed || generation !== requestGeneration) return;
        setSnapshot(previous => ({ ...previous, nextAttempt: deadline }));
        timeout = setTimeout(() => controller.abort(), 8000);
        const result = await request(controller.signal, globalThis.fetch, settings, apiKey);
        if (disposed || generation !== requestGeneration) return;
        dataRef.current = result.data;
        setSnapshot(previous => ({ ...previous, data: result.data, loading: false, error: null, checkedAt: Date.now() }));
        await hostRef.current.storage.setGlobal(cacheKey, result.cache).catch(() => {});
      } catch (error) {
        if (error?.retryAfter) {
          const deadline = Date.now() + error.retryAfter;
          await Promise.all([WEATHER_ATTEMPT_KEY, FORECAST_ATTEMPT_KEY].map(key => storage.setGlobal(key, Math.max(Number(storage.getGlobal(key)) || 0, deadline)).catch(() => {})));
        }
        if (!disposed && generation === requestGeneration) setSnapshot(previous => ({ ...previous, loading: false, checkedAt: Date.now(),
          nextAttempt: Number(storage.getGlobal(attemptKey)) || 0, error: safeWeatherError(error) }));
      } finally { clearTimeout(timeout); busy = false; weatherPollBusy[feed] = false; }
    }
    async function load() {
      const loadingGeneration = ++generation;
      controller?.abort();
      settings = undefined;
      try {
        const loadedSettings = weatherSettings(storage.getGlobal(WEATHER_SETTINGS_KEY));
        const loadedKey = await storage.getSecret(WEATHER_SECRET_KEY);
        if (disposed || loadingGeneration !== generation) return;
        settings = loadedSettings; apiKey = loadedKey;
        const provider = apiKey ? 'tomorrow' : 'open-meteo';
        dataRef.current = forecast && !apiKey ? null : restore(storage.getGlobal(cacheKey), Date.now(), settings, provider);
        setSnapshot({ data: dataRef.current, location: settings, provider, loading: false, error: forecast && !apiKey ? 'Nhập API key Tomorrow.io để xem dự báo.' : null, checkedAt: Date.now(), nextAttempt: Number(storage.getGlobal(attemptKey)) || 0 });
        poll();
      } catch { if (!disposed && loadingGeneration === generation) setSnapshot(previous => ({ ...previous, loading: false, error: 'Chưa đọc được cài đặt hoặc kho API key.' })); }
    }
    const changed = () => load();
    window.addEventListener('agent-office-weather-settings', changed);
    const timer = setInterval(() => poll(), 15000);
    const runtime = { get snapshot() { return snapshot; }, listeners, refresh: load,
      stop: () => { disposed = true; clearInterval(timer); controller?.abort(); window?.removeEventListener?.('agent-office-weather-settings', changed); } };
    weatherBackgrounds.set(feed, runtime);
    if (!forecast) startBackgroundWater(host.storage);
    load();
    return runtime;
}
function useOfficeWeather(host, forecast = false) {
  const runtime = weatherBackgroundFor(host, forecast);
  const [snapshot, setSnapshot] = useState(() => runtime.snapshot);
  useEffect(() => {
    runtime.listeners.add(setSnapshot); setSnapshot(runtime.snapshot);
    return () => runtime.listeners.delete(setSnapshot);
  }, [runtime]);
  const data = forecast ? selectNextForecast(snapshot.data, snapshot.checkedAt) : snapshot.data;
  return { ...snapshot, data, storage: host.storage, stale: forecast ? !!data?.stale : weatherIsStale(data, snapshot.checkedAt), refresh: runtime.refresh };
}
const RAIN_BACKFILL_AT = 1791796018473;
function startBackgroundWater(storage) {
  if (liveWater) return;
  const scene = createWeatherSceneState();
  try {
    const saved = storage.getGlobal('office-water-v1');
    if (saved && Number.isFinite(saved.waterLevel) && typeof saved.identity === 'string')
      Object.assign(scene, { identity: saved.identity, waterLevel: Math.max(0, Math.min(1, saved.waterLevel)), rainSeconds: Number.isFinite(saved.rainSeconds) ? Math.max(0, saved.rainSeconds) : 0, rainBackfill: saved.rainBackfill });
  } catch {}
  let savedLevel = scene.waterLevel, savedAt = Date.now();
  let writes = Promise.resolve();
  const persist = () => {
    const value = { identity: scene.identity, waterLevel: scene.waterLevel, rainSeconds: scene.rainSeconds, rainBackfill: scene.rainBackfill };
    writes = writes.catch(() => {}).then(() => storage.setGlobal('office-water-v1', value));
    writes.catch(() => {});
  };
  const tick = () => {
    const data = weatherBackgrounds.get('realtime')?.snapshot.data;
    if (!data) { scene.lastTime = null; return; }
    const now = Date.now();
    advanceWeatherScene(scene, data, now, { background: true, stale: weatherIsStale(data, now) });
    // User-requested correction: total one hour, deduct rain already counted.
    if (scene.rainBackfill?.id !== '2026-10-12-hour' && now >= RAIN_BACKFILL_AT && now - RAIN_BACKFILL_AT < 30 * 60000 && !weatherIsStale(data, now) && rainIntensityPerHour(data) > 0) {
      const seconds = Math.max(0, 3600 - scene.rainSeconds);
      const before = scene.waterLevel, rate = rainIntensityPerHour(data);
      scene.waterLevel = Math.min(1, before + .0001 * rate * seconds);
      scene.rainSeconds += seconds;
      scene.rainBackfill = { id: '2026-10-12-hour', identity: scene.identity, at: now, seconds, rate, added: scene.waterLevel - before };
      savedAt = now; savedLevel = scene.waterLevel; persist();
    }
    if (now - savedAt >= 60000 && scene.waterLevel !== savedLevel) {
      savedAt = now; savedLevel = scene.waterLevel;
      persist();
    }
  };
  liveWater = { scene, tick, timer: setInterval(tick, 10000) };
}
export function deactivate() {
  for (const runtime of weatherBackgrounds.values()) runtime.stop();
  weatherBackgrounds.clear();
  if (liveWater) clearInterval(liveWater.timer);
  liveWater = null;
}

function WeatherBar({ weather, preview, onPreview, thunder }) {
  const { data, loading, error, stale } = weather;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = weather.location.label;
  const tomorrow = weather.provider === 'tomorrow';
  const waiting = weather.checkedAt < weather.nextAttempt;
  const time = value => new Date(value).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' });
  return h('section', { className: 'ao-weather', 'aria-label': `Thời tiết ${location}`, 'data-weather-status': error ? 'error' : data ? stale ? 'stale' : 'ready' : 'loading', 'data-weather-provider': weather.provider || '', 'data-weather-code': data?.code ?? '', 'data-weather-observed': data?.observedAt || '', 'data-weather-fetched': data?.fetchedAt || '' },
    h('span', { className: 'ao-weather-icon', 'aria-hidden': true }, data ? !data.isDay && ['clear', 'partly'].includes(data.kind) ? '☾' : data.icon : '◌'),
    h('div', { className: 'ao-weather-info' }, h('strong', null, data ? `${location} · ${data.label} · ${data.temperature.toFixed(1)}°C` : `${location} · Đang chờ thời tiết`),
      h('small', null, data ? `${data.isDay ? 'Ban ngày' : 'Ban đêm'} · Gió ${data.wind.toFixed(1)} km/h · Mưa ${data.precipitation.toFixed(1)} ${data.precipitationUnit}` : 'Cảnh trung tính khi chưa có dữ liệu'),
      h('small', { className: error || stale ? 'ao-weather-warning' : '' }, error ? `${error}${data ? ' Đang dùng bản gần nhất.' : ''}` : data ? `${stale ? 'Dữ liệu cũ · ' : ''}Dữ liệu lúc ${time(data.observedAt)} · Lấy về ${time(data.fetchedAt)} · Mỗi 5 phút` : loading ? 'Đang lấy dữ liệu…' : waiting ? `Lần kiểm tra tiếp theo: ${time(weather.nextAttempt)}` : 'Chưa có dữ liệu'),
      h('small', null, tomorrow ? h('a', { href: 'https://www.tomorrow.io/', target: '_blank', rel: 'noopener noreferrer' }, 'Powered by Tomorrow.io') : h('span', null,
        h('a', { href: 'https://open-meteo.com/', target: '_blank', rel: 'noopener noreferrer' }, 'Weather data by Open-Meteo'), ' · ', h('a', { href: 'https://creativecommons.org/licenses/by/4.0/', target: '_blank', rel: 'noopener noreferrer' }, 'CC BY 4.0')),
        tomorrow ? ' · Cảnh minh họa · Ngập mô phỏng' : ' · Dữ liệu mô hình · Ngập mô phỏng'),
      liveWater?.scene.rainBackfill?.id === '2026-10-12-hour' && liveWater.scene.rainBackfill.identity === liveWater.scene.identity && h('small', null, `Đã bù ${Math.round(liveWater.scene.rainBackfill.seconds / 60)} phút mưa · +${(liveWater.scene.rainBackfill.added * 100).toFixed(1)}% mức ngập · Ước tính ${liveWater.scene.rainBackfill.rate.toFixed(1)} mm/h`),
      !liveWater?.scene.rainBackfill && Date.now() - RAIN_BACKFILL_AT < 30 * 60000 && h('small', null, 'B? m?a 60 ph?t: ?ang ch? s? li?u c??ng ?? m?a h?p l??')),
    onPreview && h('label', { className: 'ao-weather-preview' }, 'Thử cảnh · chỉ Demo', h('select', { 'data-weather-preview': true, value: preview, onChange: e => onPreview(e.target.value) },
      ...[['auto', 'Theo thời tiết thật'], ['clear', 'Nắng'], ['cloudy', 'Nhiều mây'], ['rain', 'Mưa · 2 mm/h'], ['storm', 'Mưa dông · 8 mm/h'], ['fog', 'Sương mù'], ['snow', 'Tuyết'], ['night', 'Đêm']].map(([value, label]) => h('option', { key: value, value }, label)))),
    h('button', { type: 'button', className: 'ao-button', 'data-action': 'toggle-thunder', onClick: thunder.toggle, 'aria-pressed': thunder.enabled, title: thunder.error || 'Tiếng sấm sau tia chớp · dừng khi pause hoặc giảm chuyển động' }, thunder.enabled ? '🔊 Sấm: Bật' : '🔇 Sấm: Tắt'),
    h('button', { type: 'button', className: 'ao-button', 'data-action': 'refresh-weather', onClick: weather.refresh, disabled: loading || waiting, title: waiting ? `Có thể kiểm tra lại lúc ${time(weather.nextAttempt)}` : 'Kiểm tra dữ liệu mới' }, loading ? 'Đang cập nhật…' : '↻ Thời tiết'),
    h('button', { type: 'button', className: 'ao-button', 'data-action': 'weather-settings', 'aria-expanded': settingsOpen, onClick: () => setSettingsOpen(value => !value) }, '⚙ Thời tiết'),
    weather.forecast && h('div', { className: 'ao-forecast-status', role: 'status', 'data-forecast-status': weather.forecast.error ? 'error' : weather.forecast.data ? weather.forecast.stale ? 'stale' : 'ready' : 'loading' },
      weather.forecast.error ? `Tiên tri: ${weather.forecast.error}${weather.forecast.data ? ' Đang dùng dự báo gần nhất.' : ''}` : weather.forecast.data ?
        `Tiên tri · ${time(weather.forecast.data.at)}: ${weather.forecast.data.label} · Lấy về ${time(weather.forecast.data.fetchedAt)} · Mỗi 20 phút${weather.forecast.stale ? ' · Dự báo cũ' : ''}` : 'Tiên tri đang chờ dự báo · Mỗi 20 phút'),
    settingsOpen && h(WeatherSettings, { storage: weather.storage }));
}

function forecastForScene(forecast, preview = 'auto') {
  if (preview === 'auto') return forecast;
  return { data: { ...previewWeather(preview), preview: true, temperature: 28,
    probability: ['rain', 'storm'].includes(preview) ? 80 : 0,
    at: new Date((Math.floor(Date.now() / 3600000) + 1) * 3600000).toISOString() } };
}

const STATUS = {
  working: ['Đang làm việc', '#80d6be', 'WORK'],
  research: ['Đang tìm hiểu', '#9cbff5', 'READ'],
  review: ['Đang review', '#c3a7eb', 'CHECK'],
  waiting: ['Chờ giao việc', '#e8bc7c', '…'],
  meeting: ['Đang trao đổi', '#e8bc7c', 'TALK'],
  done: ['Đã hoàn tất', '#80d6be', 'DONE'],
  'live-running': ['Đang chạy', '#80d6be', 'RUN'],
  'live-waiting': ['Chờ bạn', '#e8bc7c', 'WAIT'],
  'live-idle': ['Rảnh', '#9cbff5', 'IDLE'],
  'live-done': ['Hoàn tất', '#80d6be', 'DONE'],
  'live-error': ['Có lỗi', '#ef9a9a', 'ERROR'],
  'live-paused': ['Tạm dừng', '#c3a7eb', 'PAUSE'],
  'live-unknown': ['Chưa rõ', '#8c9eaf', '?'],
};
const PEOPLE = [
  { id: 'linh', name: 'Linh', role: 'Engineer', color: '#80d6be', hair: '#302c38', desk: [211, 219], status: 'working', task: 'Dựng giao diện văn phòng' },
  { id: 'minh', name: 'Minh', role: 'Researcher', color: '#9cbff5', hair: '#b5794e', desk: [739, 219], status: 'research', task: 'Khảo sát API extension' },
  { id: 'an', name: 'An', role: 'Reviewer', color: '#c3a7eb', hair: '#333a51', desk: [211, 421], status: 'review', task: 'Kiểm tra trải nghiệm giao việc' },
  { id: 'khoa', name: 'Khoa', role: 'Planner', color: '#e8bc7c', hair: '#614c40', desk: [739, 421], status: 'waiting', task: 'Sẵn sàng nhận việc mới' },
];
function avatar(person, size = 32) {
  const sprite = characterPixels(person);
  return h('svg', { width: size, height: size, viewBox: '0 0 48 64', 'aria-hidden': true, shapeRendering: 'crispEdges', 'data-portrait-age': sprite.stage, 'data-portrait-resolution': `${sprite.width}x${sprite.height}` },
    ...sprite.pixels.map((pixel, index) => h('rect', { key: index, x: pixel.x + 8, y: pixel.y + 60 - sprite.height, width: 1, height: 1, fill: pixel.color })));
}
function CharacterDetails({ person, onContextChange }) {
  const life = person.life;
  return h('section', { className: 'ao-character-details', 'data-character-age': life.key, 'data-context-percent': life.percent == null ? '' : life.percent.toFixed(1) },
    h('div', { className: 'ao-character-heading' }, h('strong', null, life.label), h('span', null, life.percent == null ? 'Context chưa có dữ liệu' : `${life.percent.toFixed(1)}% context${life.simulated ? ' · mô phỏng' : ''}`)),
    h('div', { className: 'ao-context-meter', role: 'progressbar', 'aria-label': 'Mức sử dụng context', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': life.percent == null ? undefined : Math.round(life.percent), 'aria-valuetext': life.percent == null ? 'Chưa có dữ liệu' : `${life.percent.toFixed(1)}%` },
      h('span', { style: { width: `${life.percent || 0}%` } })),
    h('div', { className: 'ao-age-ladder' }, ...LIFE_STAGES.map(stage => h('span', { key: stage.key, className: life.key === stage.key ? 'active' : '', title: `${stage.min}–${stage.min + 25}% context` }, stage.label))),
    life.tokens != null && h('p', null, `${life.tokens.toLocaleString('vi-VN')} / ${life.capacity.toLocaleString('vi-VN')} token trong context hiện tại`),
    h('p', { className: 'ao-labor-label' }, `${person.labor.icon} ${person.labor.label} · việc minh họa`),
    onContextChange && h('label', null, 'Thử độ tuổi theo context', h('input', { type: 'range', min: 0, max: 100, step: 1, value: life.percent, 'data-demo-context': true, onChange: e => onContextChange(Number(e.target.value)) })));
}
const event = (text, person = 'office') => ({ id: crypto.randomUUID(), time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), text, person });
function initialState() {
  return { tick: 0, agents: PEOPLE.map((person, index) => ({ ...person, demoContextPercent: [12, 38, 62, 88][index], laborId: LABORS[index].id })), tasks: [], events: [event('Cánh đồng mở cửa. Bốn nhân vật đã sẵn sàng.'), event('Bấm một nhân vật để xem và giao việc mô phỏng.')] };
}
function advance(previous) {
  const tick = previous.tick + 1;
  const index = (tick - 1) % PEOPLE.length;
  const sequence = ['meeting', 'working', 'waiting', 'research', 'review'];
  const agents = previous.agents.map((person, i) => ({ ...person, demoContextPercent: Math.min(100, (person.demoContextPercent ?? [12, 38, 62, 88][i]) + (i === index ? 8 : 2)), ...(i === index ? { status: sequence[Math.floor((tick - 1) / 4) % sequence.length] } : {}) }));
  let text = `${agents[index].name}: ${STATUS[agents[index].status][0].toLowerCase()}.`;
  const tasks = previous.tasks.map(task => {
    if (task.state === 'running' && tick - task.started >= 3) {
      const person = agents.find(agent => agent.id === task.agent);
      person.status = 'done';
      text = `${person.name} hoàn tất việc mô phỏng: ${task.title}`;
      return { ...task, state: 'done' };
    }
    return task;
  });
  return { tick, agents, tasks, events: [event(text, agents[index].id), ...previous.events].slice(0, 24) };
}

function OfficeCanvas({ state, selected, onSelect, paused, thunder }) {
  const canvas = useRef(null);
  const positions = useRef({});
  const hovered = useRef(null);
  const environment = useRef(createWeatherSceneState());
  const current = useRef({ state, selected, paused, thunder });
  current.current = { state, selected, paused, thunder };
  useEffect(() => { if (!state.live && state.tick === 0) { positions.current = {}; environment.current = createWeatherSceneState(); } }, [state.live, state.tick === 0]);
  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    let density = 0;
    function resize() {
      const width = canvas.current.getBoundingClientRect().width;
      if (width <= 0) return;
      density = window.devicePixelRatio || 1;
      const resolution = resizeSceneCanvas(canvas.current, width, density);
      canvas.current.dataset.sceneResolution = `${resolution.width}x${resolution.height}`;
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.current);
    window.addEventListener('resize', resize);
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame, last = 0, lastThunder = null, lastStormMs = 0;
    const visibilityChanged = () => {
      if (document.hidden) {
        environment.current.lastTime = null;
        environment.current.frozen = true;
        current.current.thunder.stop();
      }
    };
    document.addEventListener('visibilitychange', visibilityChanged);
    function draw(now) {
      if (now - last > 32) {
        if (density !== (window.devicePixelRatio || 1)) resize();
        const snapshot = current.current;
        const effects = advanceWeatherScene(environment.current, snapshot.state.weather, now, {
          paused: snapshot.paused, reducedMotion: motionPreference.matches, hidden: document.hidden,
          stale: !snapshot.state.weather?.preview && weatherIsStale(snapshot.state.weather),
        });
        if (snapshot.state.live && liveWater) {
          liveWater.tick(); effects.waterLevel = liveWater.scene.waterLevel; effects.rainSeconds = liveWater.scene.rainSeconds;
        }
        paintLandscape(ctx, { ...snapshot.state, hovered: hovered.current, weatherEffects: effects }, positions.current, snapshot.selected, now, snapshot.paused, motionPreference.matches);
        const storm = snapshot.state.weather?.kind === 'storm';
        if (effects.stormMs < lastStormMs) lastThunder = null;
        lastStormMs = effects.stormMs;
        const moment = stormMoment(effects.stormMs, effects.frozen, motionPreference.matches);
        canvas.current.dataset.lightningActive = String(storm && moment.lightning);
        canvas.current.dataset.waterLevel = effects.waterLevel.toFixed(3);
        canvas.current.dataset.rainSeconds = effects.rainSeconds.toFixed(1);
        if (!storm) lastThunder = null;
        if (!storm || effects.frozen || !snapshot.thunder.enabled) snapshot.thunder.stop();
        else if (moment.thunder && lastThunder !== moment.strikeId) {
          lastThunder = moment.strikeId;
          if (snapshot.thunder.play(moment.power)) canvas.current.dataset.lastThunder = String(moment.strikeId);
        }
        last = now;
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibilityChanged); current.current.thunder.stop(); };
  }, []);
  function hitPerson(event) {
    const bounds = canvas.current.getBoundingClientRect();
    const point = scenePoint(event.clientX, event.clientY, bounds);
    if (!point) return null;
    const { x, y } = point;
    const closest = state.agents.map((person, index) => {
      const [px, py] = positions.current[person.id] || characterDestination(person, index);
      return { person, ...characterHit(person, [px, py], x, y, person.id === (hovered.current || selected)) };
    }).filter(candidate => candidate.hit).sort((a, b) => a.distance - b.distance)[0];
    return closest?.person.id || null;
  }
  function select(event) { const id = hitPerson(event); if (id) onSelect(id); }
  function hover(event) { hovered.current = hitPerson(event); }
  const visibleIds = new Set(state.agents.map(person => person.id));
  const messages = (state.relations || []).filter(relation => relation.type === 'communication' && visibleIds.has(relation.source) && visibleIds.has(relation.target));
  return h('canvas', { ref: canvas, width: SCENE_WIDTH, height: SCENE_HEIGHT, style: { aspectRatio: `${SCENE_WIDTH} / ${SCENE_HEIGHT}` }, className: 'ao-canvas', 'data-scene': 'outdoors', 'data-character-count': state.agents.length, 'data-forecast-kind': state.forecast?.data?.kind || 'unknown', 'data-forecast-at': state.forecast?.data?.at || '', 'data-weather-kind': state.weather?.kind || 'unknown', 'data-weather-day': state.weather ? String(state.weather.isDay) : 'unknown', 'data-weather-source': state.weather?.preview ? 'preview' : state.weather ? 'live' : 'none', 'data-visible-communications': messages.map(relation => `${relation.source}>${relation.target}`).join(','), onClick: select, onMouseMove: hover, onMouseLeave: () => { hovered.current = null; }, role: 'img', 'aria-label': state.live ? 'Cánh đồng session và nhà tiên tri dự báo giờ tới. Rê chuột để xem hoạt động; bấm nhân vật để mở session. Chọn trong danh sách để xem chi tiết.' : 'Cánh đồng mô phỏng và nhà tiên tri dự báo giờ tới. Rê chuột hoặc chọn nhân vật để xem hoạt động và giao việc mô phỏng.' });
}

// Keep transient controls and tick timing across host-driven panel remounts.
// Disk storage remains the source on extension reload / application restart.
const officeRuntimes = new Map();
function runtimeFor(host) {
  const key = host.workspacePath || 'default';
  if (!officeRuntimes.has(key)) {
    const saved = host.storage.get('demo-state-v2');
    const stored = saved?.state || host.storage.get('demo-state-v1');
    const state = stored?.agents?.length === 4 && Array.isArray(stored.tasks) && Array.isArray(stored.events) ? stored : initialState();
    const snapshot = { state, selected: PEOPLE.some(person => person.id === saved?.selected) ? saved.selected : 'linh', paused: saved?.paused === true, lastTickAt: saved?.lastTickAt || Date.now() };
    officeRuntimes.set(key, { ...snapshot, lastSaved: JSON.stringify(snapshot) });
  }
  return officeRuntimes.get(key);
}
function AgentOffice({ host, weather, preview, onPreview, thunder }) {
  const runtime = runtimeFor(host);
  const [state, updateState] = useState(() => runtime.state);
  const [selected, updateSelected] = useState(() => runtime.selected);
  const [paused, updatePaused] = useState(() => runtime.paused);
  function setState(value) {
    updateState(previous => {
      const next = typeof value === 'function' ? value(previous) : value;
      runtime.state = next;
      return next;
    });
  }
  function setSelected(value) { runtime.selected = value; updateSelected(value); }
  function setPaused(value) {
    const next = typeof value === 'function' ? value(runtime.paused) : value;
    runtime.paused = next;
    runtime.lastTickAt = Date.now();
    updatePaused(next);
  }
  const [draft, setDraft] = useState('');
  const [storageError, setStorageError] = useState(false);
  const sceneLayout = useRef({});
  const visualAgents = arrangeCharacters(state.agents.map((agent, index) => decorateCharacter({ ...agent, demoContextPercent: agent.demoContextPercent ?? [12, 38, 62, 88][index], laborId: agent.laborId || LABORS[index].id })), sceneLayout.current);
  const person = visualAgents.find(agent => agent.id === selected);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      if (Date.now() - runtime.lastTickAt < 7000) return;
      runtime.lastTickAt = Date.now();
      setState(advance);
    }, 250);
    return () => clearInterval(timer);
  }, [paused, runtime]);
  useEffect(() => {
    const snapshot = { state, selected, paused, lastTickAt: runtime.lastTickAt };
    const signature = JSON.stringify(snapshot);
    // Storage updates can reload extension modules in this host. Never write
    // unchanged state on mount: that would create a save/reload loop.
    if (signature === runtime.lastSaved) return;
    const timer = setTimeout(() => {
      runtime.lastSaved = signature;
      host.storage.set('demo-state-v2', snapshot).catch(() => setStorageError(true));
    }, 250);
    return () => clearTimeout(timer);
  }, [state, selected, paused, runtime, host]);
  function assign(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setState(previous => ({ ...previous,
      agents: previous.agents.map(agent => agent.id === selected ? { ...agent, status: 'working', task: title } : agent),
      tasks: [{ id: crypto.randomUUID(), title, agent: selected, started: previous.tick, state: 'running' }, ...previous.tasks].slice(0, 12),
      events: [event(`Giao việc mô phỏng cho ${person.name}: ${title}`, selected), ...previous.events].slice(0, 24),
    }));
    setDraft('');
  }
  const running = state.agents.filter(agent => !['waiting', 'done'].includes(agent.status)).length;
  return h('div', { className: 'ao-root', 'data-agent-office': 'demo', 'data-tick': state.tick },
    h('header', { className: 'ao-header' },
      h('div', { className: 'ao-brand' }, h('span', { className: 'ao-brand-icon', 'aria-hidden': true }, '▦'), h('div', null, h('div', { className: 'ao-eyebrow' }, 'WORKSPACE / FIELD CREW'), h('h1', null, 'Agent Office'))),
      h('div', { className: 'ao-controls' }, h('span', { className: 'ao-demo-badge' }, 'DEMO · MÔ PHỎNG'),
        h('button', { type: 'button', className: 'ao-button', 'data-action': 'pause', onClick: () => setPaused(value => !value), 'aria-pressed': paused }, paused ? '▶ Chạy tiếp' : 'Ⅱ Tạm dừng'),
        h('button', { type: 'button', className: 'ao-button', 'data-action': 'step', title: 'Chạy một nhịp mô phỏng ngay, kể cả khi tạm dừng', onClick: () => { runtime.lastTickAt = Date.now(); setState(advance); } }, '→ Bước tiếp'),
        h('button', { type: 'button', className: 'ao-button ao-reset', 'data-action': 'reset', onClick: () => { setState(initialState()); setDraft(''); setSelected('linh'); setPaused(false); } }, '↺ Đặt lại'))),
    h('div', { className: 'ao-intro' }, h('p', null, 'Session làm việc, nhân vật lớn lên cùng context.'), h('span', null, 'Bản thử giao diện · chưa kết nối session AI thật')),
    h(WeatherBar, { weather, preview, onPreview, thunder }),
    h('main', { className: 'ao-layout' },
      h('section', { className: 'ao-workspace', 'aria-label': 'Cánh đồng' },
        h('div', { className: 'ao-scene-heading' }, h('span', null, h('i', { className: paused ? 'ao-dot ao-paused' : 'ao-dot' }), paused ? 'ĐÃ TẠM DỪNG' : 'ĐANG LÀM VIỆC'), h('span', null, '01 / CÁNH ĐỒNG')),
        h(OfficeCanvas, { state: { ...state, regions: true, agents: visualAgents, weather: previewWeather(preview, weather.data), forecast: forecastForScene(weather.forecast, preview) }, selected, onSelect: setSelected, paused, thunder }),
        h('div', { className: 'ao-scene-footer' }, h('span', null, 'Bấm nhân vật hoặc chọn từ danh sách →'), h('span', null, `${running}/4 đang hoạt động`)),
        h('section', { className: 'ao-taskboard', 'aria-label': 'Bảng công việc' },
          h('div', { className: 'ao-section-heading' }, h('h2', null, 'Bảng công việc'), h('span', null, `${state.tasks.length} việc mô phỏng`)),
          state.tasks.length ? h('div', { className: 'ao-task-list' }, ...state.tasks.map(task => h('article', { key: task.id, className: 'ao-task', 'data-task-id': task.id },
            h('span', { className: `ao-task-state ${task.state}` }, task.state === 'done' ? '✓ Xong' : '◌ Đang làm'), h('strong', null, task.title), h('span', { className: 'ao-task-person' }, PEOPLE.find(agent => agent.id === task.agent)?.name))))
            : h('div', { className: 'ao-empty' }, h('span', { 'aria-hidden': true }, '＋'), h('div', null, h('strong', null, 'Một việc nhỏ để bắt đầu'), h('p', null, 'Chọn nhân vật và giao việc ở bên phải. Demo sẽ mô phỏng hoàn tất sau khoảng 21 giây.'))))),
      h('aside', { className: 'ao-sidebar' },
        h('section', { className: 'ao-team' }, h('div', { className: 'ao-section-heading' }, h('h2', null, 'Đội của bạn'), h('span', null, '4 AGENTS')),
          ...visualAgents.map(agent => h('button', { key: agent.id, type: 'button', className: `ao-agent ${selected === agent.id ? 'selected' : ''}`, 'data-agent': agent.id, 'data-age-stage': agent.life.key, 'data-labor': agent.labor.id, 'aria-pressed': selected === agent.id, onClick: () => setSelected(agent.id) },
            h('span', { className: 'ao-avatar', style: { background: agent.color + '18' } }, avatar(agent)),
            h('span', { className: 'ao-agent-info' }, h('strong', null, agent.name), h('small', null, `${agent.role} ? ${agent.labor.label}`)), h('span', { className: 'ao-agent-status', style: { color: STATUS[agent.status][1] } }, STATUS[agent.status][0])))),
        h('section', { className: 'ao-inspector' }, h('div', { className: 'ao-selected-heading' }, h('span', { style: { color: person.color } }, avatar(person, 40)), h('div', null, h('h2', null, person.name), h('span', null, person.role))),
          h(CharacterDetails, { person, onContextChange: percent => setState(previous => ({ ...previous, agents: previous.agents.map(agent => agent.id === person.id ? { ...agent, demoContextPercent: percent } : agent) })) }),
          h('p', { className: 'ao-current-task', 'data-selected-task': true }, person.task),
          h('form', { onSubmit: assign }, h('label', { htmlFor: 'ao-task-input' }, 'Giao việc mô phỏng'),
            h('input', { id: 'ao-task-input', value: draft, onChange: e => setDraft(e.target.value), placeholder: 'Ví dụ: thiết kế màn hình dashboard', maxLength: 160, autoComplete: 'off' }),
            h('button', { type: 'submit', className: 'ao-assign', disabled: !draft.trim() }, `Giao cho ${person.name} ↗`))),
        h('section', { className: 'ao-activity', 'aria-label': 'Nhật ký hoạt động' }, h('div', { className: 'ao-section-heading' }, h('h2', null, 'Nhịp làm việc'), h('span', null, 'DEMO FEED')),
          h('ol', null, ...state.events.slice(0, 7).map(entry => h('li', { key: entry.id }, h('time', null, entry.time), h('p', null, entry.text))))))),
    h('footer', { className: 'ao-footer' }, h('span', null, 'Không gọi model AI · Không sửa file dự án'), h('span', null, storageError ? 'Chưa lưu được demo trên máy.' : 'Giao việc và nhật ký được lưu trên máy.')));
}

const PHASE_LABELS = { backlog: 'Backlog', planning: 'Lên kế hoạch', implementing: 'Thực hiện', validating: 'Kiểm tra', complete: 'Hoàn tất' };
function displayTime(value) {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Chưa rõ' : date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
const MESSAGE_KINDS = { report: 'báo cáo', instruction: 'giao việc', status: 'trạng thái', question: 'câu hỏi', error: 'lỗi' };
function officeEventText(entry, rows) {
  const source = sessionTitle(rows.find(row => row.id === entry.sessionId) || { title: 'Session' });
  const target = entry.targetId && sessionTitle(rows.find(row => row.id === entry.targetId) || { title: 'Session' });
  return `${source}${target ? ' → ' + target : ''}: ${entry.label}${entry.messageKind ? ' · ' + (MESSAGE_KINDS[entry.messageKind] || entry.messageKind) : ''}${entry.tool ? ' · ' + entry.tool : ''}`;
}
function OfficeTimeline({ events, rows, focus }) {
  const [category, setCategory] = useState('all');
  const [session, setSession] = useState('all');
  const shown = events.filter(entry => (category === 'all' || entry.category === category)
    && (session === 'all' || entry.sessionId === session || entry.targetId === session)
    && (!focus || (focus.includes(entry.sessionId) && (!entry.targetId || focus.includes(entry.targetId))))).slice().reverse();
  return h('section', { className: 'ao-timeline', 'aria-label': 'Timeline sự kiện', 'data-timeline-count': shown.length },
    h('div', { className: 'ao-section-heading' }, h('h2', null, 'Timeline'), h('span', null, `${shown.length} SỰ KIỆN${focus ? ' · CẶP SESSION' : ''}`)),
    h('div', { className: 'ao-timeline-filters' },
      h('label', null, 'Loại sự kiện', h('select', { value: category, 'data-timeline-category': true, onChange: e => setCategory(e.target.value) },
        ...[['all', 'Tất cả'], ['handoff', 'Giao việc / báo cáo'], ['tool', 'Tool'], ['thinking', 'Suy nghĩ'], ['session', 'Session / trả lời']].map(([value, label]) => h('option', { key: value, value }, label)))),
      h('label', null, 'Session', h('select', { value: session, 'data-timeline-session': true, onChange: e => setSession(e.target.value) },
        h('option', { value: 'all' }, 'Tất cả session'), ...rows.map(row => h('option', { key: row.id, value: row.id }, sessionTitle(row)))))),
    h('p', { className: 'ao-feed-note ao-timeline-note' }, 'Lịch sử gần đây từ session · mới nhất ở trên. Nhãn “suy nghĩ” chỉ cho biết hoạt động.'),
    shown.length ? h('ol', null, ...shown.map(entry => h('li', { key: entry.id, className: `ao-event ao-event-${entry.category}`, 'data-office-event': entry.id, 'data-event-kind': entry.kind, 'data-event-source': entry.sessionId, 'data-event-target': entry.targetId || '' },
      h('time', { dateTime: entry.at, title: entry.at }, displayTime(entry.at)), h('span', null, officeEventText(entry, rows)),
      entry.durationMs != null && h('small', { title: 'Thời gian tool từ dấu mốc bắt đầu/kết thúc' }, `${(entry.durationMs / 1000).toFixed(1)}s`))))
      : h('p', { className: 'ao-feed-note' }, 'Chưa có sự kiện phù hợp bộ lọc.'));
}
function LiveOffice({ host, weather, thunder }) {
  const root = useRef(null);
  const hostRef = useRef(host);
  hostRef.current = host;
  const [snapshot, setSnapshot] = useState({ rows: [], events: [], loaded: false, error: null, activityError: null, eventError: null, lastSync: null });
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [focus, setFocus] = useState(null);
  const eventStream = useRef({ workspace: null, cursors: {}, events: [] });
  const sceneLayout = useRef({ workspace: host.workspacePath });
  if (sceneLayout.current.workspace !== host.workspacePath) sceneLayout.current = { workspace: host.workspacePath };
  useEffect(() => {
    let disposed = false, busy = false;
    if (eventStream.current.workspace !== host.workspacePath) eventStream.current = { workspace: host.workspacePath, cursors: {}, events: [] };
    const stream = eventStream.current;
    async function poll() {
      if (busy) return;
      busy = true;
      try {
        const sessions = await readWorkspaceSessions(hostRef.current);
        let records = [], activityError = null;
        try { records = await readSessionActivity(hostRef.current, sessions); }
        catch (error) { activityError = String(error?.message || error); }
        const rows = attachActivities(sessions, records);
        let eventError = null;
        let incoming = [];
        try { incoming = await readOfficeEvents(hostRef.current, sessions, stream.cursors); }
        catch (error) { eventError = String(error?.message || error); }
        if (disposed) return;
        const ids = new Set(rows.map(row => row.id));
        if (!eventError) {
          for (const record of incoming) stream.cursors[record.session_id] = Math.max(stream.cursors[record.session_id] || 0, record.id);
          for (const id of Object.keys(stream.cursors)) if (!ids.has(id)) delete stream.cursors[id];
          stream.events = mergeOfficeEvents(stream.events.filter(entry => ids.has(entry.sessionId) && (!entry.targetId || ids.has(entry.targetId))), normalizeOfficeEvents(incoming, rows));
        }
        setSnapshot({ rows, events: stream.events, loaded: true, error: null, activityError, eventError, lastSync: new Date().toISOString() });
      } catch (error) {
        if (!disposed) setSnapshot(current => ({ ...current, loaded: true, error: String(error?.message || error) }));
      } finally { busy = false; }
    }
    poll();
    const timer = setInterval(poll, 3000);
    return () => { disposed = true; clearInterval(timer); };
  }, [host.workspacePath, refresh]);
  const focused = focus && focus.every(id => snapshot.rows.some(row => row.id === id)) ? focus : null;
  const allAgents = arrangeCharacters(sessionsInScene(snapshot.rows).map(decorateCharacter), sceneLayout.current);
  const agents = focused ? allAgents.filter(agent => focused.includes(agent.id)) : allAgents;
  const relations = sessionRelations(snapshot.rows);
  const communications = communicationRelations(snapshot.events, snapshot.rows);
  const person = agents.find(agent => agent.id === selected) || agents[0];
  const running = snapshot.rows.filter(row => mapSessionStatus(row) === 'live-running').length;
  const waiting = snapshot.rows.filter(row => mapSessionStatus(row) === 'live-waiting').length;
  const open = id => openRealSession(hostRef.current, id);
  const inspectRelation = relation => { setFocus([relation.source, relation.target]); setSelected(relation.target); root.current?.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  return h('div', { ref: root, className: 'ao-root ao-live', 'data-agent-office': 'live', 'data-workspace': host.workspacePath, 'data-session-count': snapshot.rows.length, 'data-last-sync': snapshot.lastSync || '', 'data-focus-source': focused?.[0] || '', 'data-focus-target': focused?.[1] || '', 'data-connection': snapshot.error ? 'error' : snapshot.loaded ? 'connected' : 'loading' },
    h('header', { className: 'ao-header' },
      h('div', { className: 'ao-brand' }, h('span', { className: 'ao-brand-icon', 'aria-hidden': true }, '▦'), h('div', null, h('div', { className: 'ao-eyebrow' }, 'WORKSPACE / FIELD CREW'), h('h1', null, 'Agent Office'))),
      h('div', { className: 'ao-controls' }, h('span', { className: `ao-demo-badge ao-live-badge ${snapshot.error ? 'stale' : ''}` }, snapshot.error ? 'KẾT NỐI GIÁN ĐOẠN' : snapshot.loaded ? 'LIVE · SESSION THẬT' : 'ĐANG KẾT NỐI'),
        h('button', { type: 'button', className: 'ao-button', 'data-action': 'refresh-live', onClick: () => setRefresh(value => value + 1) }, '↻ Làm mới'))),
    h('div', { className: 'ao-intro' }, h('p', null, `${snapshot.rows.length} session · ${running} đang chạy · ${waiting} chờ bạn`), h('span', { title: host.workspacePath }, 'Tuổi theo % context · Nghỉ 10 phút thì ngủ')),
    h(WeatherBar, { weather, thunder }),
    snapshot.error && h('div', { className: 'ao-connection-error', role: 'alert' }, h('strong', null, 'Chưa đọc được session. '), snapshot.error, snapshot.lastSync && h('p', null, `Dữ liệu đang hiển thị là bản cũ lúc ${displayTime(snapshot.lastSync)}.`)),
    snapshot.activityError && h('div', { className: 'ao-connection-error', role: 'alert', 'data-activity-error': true }, 'Trạng thái session vẫn cập nhật; chưa đọc được hoạt động chi tiết. ', snapshot.activityError),
    snapshot.eventError && h('div', { className: 'ao-connection-error', role: 'alert', 'data-event-error': true }, 'Timeline chưa cập nhật; đang giữ lịch sử đã đọc. ', snapshot.eventError),
    h('main', { className: 'ao-layout' },
      h('section', { className: 'ao-workspace', 'aria-label': 'Cánh đồng session thật' },
        h('div', { className: 'ao-scene-heading' }, h('span', null, h('i', { className: snapshot.error ? 'ao-dot ao-paused' : 'ao-dot' }), 'SESSION → NHÂN VẬT'), h('span', null, focused ? 'CẶP SESSION' : `${agents.length} NHÂN VẬT`)),
        h(OfficeCanvas, { state: { agents, regions: true, live: true, weather: weather.data, forecast: weather.forecast, relations: [...relations, ...communications] }, selected: person?.id, onSelect: open, paused: false, thunder }),
        h('div', { className: 'ao-scene-footer' }, h('span', null, 'Vàng nét đứt: cha/con · Xanh: thông điệp đã nhận'), focused
          ? h('button', { type: 'button', className: 'ao-button', 'data-action': 'clear-relation-focus', onClick: () => setFocus(null) }, '← Tất cả session')
          : h('span', null, 'Rê chuột xem hoạt động · Bấm nhân vật mở session')),
        h('section', { className: 'ao-taskboard' }, h('div', { className: 'ao-section-heading' }, h('h2', null, 'Session trong workspace'), h('span', null, 'CHƯA LƯU TRỮ')),
          snapshot.loaded && !snapshot.rows.length && !snapshot.error ? h('div', { className: 'ao-empty' }, 'Workspace này chưa có session để hiển thị.')
          : h('div', { className: 'ao-task-list' }, ...snapshot.rows.map(row => h('button', { key: row.id, type: 'button', className: 'ao-task ao-session-row', 'data-session-row': row.id, onClick: () => { setFocus(null); setSelected(row.id); }, title: sessionTitle(row) },
            h('span', { className: 'ao-task-state', style: { color: STATUS[mapSessionStatus(row)][1] } }, row.activity.label), h('strong', null, sessionTitle(row)), h('span', { className: 'ao-task-person' }, providerLabel(row.provider)))))),
        h('section', { className: 'ao-relations' }, h('div', { className: 'ao-section-heading' }, h('h2', null, 'Liên kết session'), h('span', null, `${relations.length} LIÊN KẾT`)),
          relations.length ? relations.map(relation => h('button', { key: `${relation.source}:${relation.target}`, type: 'button', className: 'ao-relation', 'data-relation-source': relation.source, 'data-relation-target': relation.target, onClick: () => inspectRelation(relation) },
            h('span', null, sessionTitle(snapshot.rows.find(row => row.id === relation.source))), h('small', null, `${relation.label} →`), h('span', null, sessionTitle(snapshot.rows.find(row => row.id === relation.target)))))
            : h('p', { className: 'ao-feed-note' }, 'Chưa có quan hệ session cha/con được ghi nhận trong danh sách này.')),
        h('section', { className: 'ao-relations ao-communications' }, h('div', { className: 'ao-section-heading' }, h('h2', null, 'Tương tác đã ghi nhận'), h('span', null, `${communications.length} CẶP SESSION`)),
          communications.length ? communications.map(relation => h('button', { key: `${relation.source}:${relation.target}`, type: 'button', className: 'ao-relation ao-communication', 'data-communication-source': relation.source, 'data-communication-target': relation.target, onClick: () => inspectRelation(relation), title: `Đã nhận · ${relation.count} thông điệp · ${displayTime(relation.at)}. Bấm để xem hai session cùng phòng.` },
            h('span', null, sessionTitle(snapshot.rows.find(row => row.id === relation.source))), h('small', null, `${relation.label} ✓ →`), h('span', null, sessionTitle(snapshot.rows.find(row => row.id === relation.target))), h('b', null, relation.count)))
            : h('p', { className: 'ao-feed-note' }, 'Chưa ghi nhận thông điệp giữa các session.')),
        h(OfficeTimeline, { key: focused?.join(':') || 'all', events: snapshot.events, rows: snapshot.rows, focus: focused })),
      h('aside', { className: 'ao-sidebar' },
        h('section', { className: 'ao-team' }, h('div', { className: 'ao-section-heading' }, h('h2', null, 'Session trên sân'), h('span', null, `${agents.length} NHÂN VẬT`)),
          ...agents.map(agent => h('button', { key: agent.id, type: 'button', className: `ao-agent ${person?.id === agent.id ? 'selected' : ''}`, 'data-session-agent': agent.id, 'data-age-stage': agent.life.key, 'data-context-percent': agent.life.percent == null ? '' : agent.life.percent.toFixed(1), 'data-labor': agent.labor.id, 'data-session-status': agent.rawStatus, 'data-mapped-status': agent.status, 'data-activity-kind': agent.activity.kind, 'data-activity-label': agent.activity.label, title: `${agent.name} · ${agent.activity.label}${agent.activity.tool ? ' · ' + agent.activity.tool : ''}`, 'aria-pressed': person?.id === agent.id, onClick: () => setSelected(agent.id) },
            h('span', { className: 'ao-avatar', style: { background: agent.color + '18' } }, avatar(agent)), h('span', { className: 'ao-agent-info' }, h('strong', null, agent.name), h('small', null, `${agent.role} ? ${agent.labor.label}`), h('span', { className: 'ao-agent-activity' }, agent.activity.label, agent.activity.tool ? (agent.activity.kind === 'recent-tool' ? ' · vừa chạy ' : ' · ') + agent.activity.tool : '')), h('span', { className: 'ao-agent-status', style: { color: STATUS[agent.status][1] } }, STATUS[agent.status][0])))),
        person && h('section', { className: 'ao-inspector', 'data-selected-session': person.id },
          h('div', { className: 'ao-selected-heading' }, avatar(person, 40), h('div', null, h('h2', null, person.name), h('span', null, person.role))),
          h(CharacterDetails, { person }),
          h('div', { className: 'ao-current-activity', 'data-current-activity': person.activity.kind }, h('span', { className: 'ao-dot' }), h('div', null, h('strong', null, person.activity.label), person.activity.tool && h('code', null, person.activity.kind === 'recent-tool' ? `Tool gần nhất: ${person.activity.tool}` : person.activity.tool), h('small', null, person.activity.observedAt ? `Dấu mốc: ${displayTime(person.activity.observedAt)}` : 'Theo trạng thái session'))),
          h('dl', { className: 'ao-session-details' },
            h('dt', null, 'Trạng thái'), h('dd', null, STATUS[person.status][0], h('small', null, person.rawStatus)),
            h('dt', null, 'Giai đoạn'), h('dd', null, PHASE_LABELS[person.phase] || person.phase || 'Chưa đặt'),
            h('dt', null, 'Model'), h('dd', null, person.model || 'Mặc định'),
            h('dt', null, 'Hoạt động cuối'), h('dd', null, displayTime(person.rest?.observedAt || person.last_activity || person.updated_at))),
          h('button', { type: 'button', className: 'ao-assign', 'data-action': 'open-session', onClick: () => open(person.id) }, 'Mở session ↗')),
        h('section', { className: 'ao-activity' }, h('div', { className: 'ao-section-heading' }, h('h2', null, 'Nhịp làm việc'), h('span', null, 'LIVE FEED')),
          snapshot.events.length ? h('ol', null, ...snapshot.events.slice(-7).reverse().map(entry => h('li', { key: entry.id }, h('time', null, displayTime(entry.at)), h('p', null, officeEventText(entry, snapshot.rows)))))
            : h('p', { className: 'ao-feed-note' }, 'Timeline được khôi phục từ dấu mốc hoạt động. Rảnh nghĩa là agent hiện không chạy.')))),
    h('footer', { className: 'ao-footer' }, h('span', null, 'Đọc trạng thái thật · Không tự gửi prompt'), h('span', null, `Tối đa 80 session · Đồng bộ: ${snapshot.lastSync ? displayTime(snapshot.lastSync) : 'đang chờ'}`)));
}

function AgentOfficePanel({ host }) {
  const currentWeather = useOfficeWeather(host);
  const forecast = useOfficeWeather(host, true);
  const weather = { ...currentWeather, forecast };
  const thunder = useThunderSound();
  const [preview, setPreview] = useState('auto');
  const [mode, setMode] = useState(() => host.storage.get('office-mode-v1') === 'demo' ? 'demo' : 'live');
  function chooseMode(value) {
    setMode(value);
    host.storage.set('office-mode-v1', value).catch(() => {});
  }
  return h('div', { className: 'ao-shell' },
    h('nav', { className: 'ao-modebar', 'aria-label': 'Nguồn dữ liệu văn phòng' },
      h('button', { type: 'button', 'data-office-mode': 'live', 'aria-pressed': mode === 'live', onClick: () => chooseMode('live') }, '● Session thật'),
      h('button', { type: 'button', 'data-office-mode': 'demo', 'aria-pressed': mode === 'demo', onClick: () => chooseMode('demo') }, '▦ Demo')),
    mode === 'live' ? h(LiveOffice, { host, weather, thunder }) : h(AgentOffice, { host, weather, thunder, preview, onPreview: setPreview }));
}
export const panels = { office: { component: AgentOfficePanel } };
export const settingsPanel = { OfficeWeatherSettings: WeatherSettings };

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

export const LIFE_STAGES = [
  { key: 'child', label: 'Trẻ em', min: 0 },
  { key: 'adult', label: 'Trưởng thành', min: 25 },
  { key: 'middle', label: 'Trung niên', min: 50 },
  { key: 'elder', label: 'Già có râu', min: 75 },
];
export const LABORS = [
  { id: 'dig', label: 'Đào đất', icon: '⛏' },
  { id: 'farm', label: 'Tưới cây', icon: '🌱' },
  { id: 'wood', label: 'Chẻ củi', icon: '🪵' },
  { id: 'stone', label: 'Đập đá', icon: '🪨' },
];
export function stormMoment(now, paused = false, reducedMotion = false) {
  const cycle = Math.floor(now / 8000), phase = now % 8000;
  const strike = phase >= 4000 ? 1 : 0;
  const local = phase - strike * 4000;
  const active = !paused && !reducedMotion;
  return { cycle, strikeId: cycle * 2 + strike,
    lightning: active && local >= 1100 && local < 1380,
    thunder: active && local >= 1800 && local < 2300,
    power: .65 + ((cycle * 13 + strike * 7) % 10) / 30,
    x: 135 + (cycle * 211 + strike * 347) % 690 };
}
export function paintStormLightning(ctx, now, paused, reducedMotion) {
  const moment = stormMoment(now, paused, reducedMotion);
  if (!moment.lightning) return moment;
  const rect = (x, y, w, height, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, height); };
  // Branching bolts and a restrained glow; labels are painted afterward.
  rect(0, 0, 960, 576, '#d8e7fa30');
  rect(0, 0, 960, 123, '#d8e7fa38');
  const paths = [
    [[0, 4], [-19, 35], [6, 35], [-25, 78], [-4, 69], [-42, 131], [-24, 119], [-70, 190]],
    [[-25, 78], [19, 100], [7, 112], [43, 144]],
    [[-42, 131], [-80, 141], [-70, 157], [-105, 182]],
  ];
  for (const points of paths) for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1], [bx, by] = points[i];
    const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
    for (let step = 0; step <= steps; step += 2) {
      const x = moment.x + Math.round(ax + (bx - ax) * step / steps);
      const y = Math.round(ay + (by - ay) * step / steps);
      rect(x - 3, y - 2, 8, 5, '#b0d0ee60'); rect(x, y, 3, 3, '#e7ecca');
    }
  }
  return moment;
}

export function createWeatherSceneState() {
  return { lastTime: null, identity: null, kind: null, waterLevel: 0, rainSeconds: 0, motionMs: 0, stormMs: 0, frozen: false };
}

export function rainIntensityPerHour(weather) {
  const rate = Number.isFinite(weather?.precipitation) ? Math.max(0, weather.precipitation) : 0;
  return Math.min(100, rate * (weather?.precipitationUnit === 'mm / 15 phút' ? 4 : 1));
}

export function advanceWeatherScene(scene, weather, now, options = {}) {
  const identity = weather ? weather.preview ? 'demo' : `${weather.provider || ''}:${weather.locationKey || weather.city || ''}` : null;
  if (identity && scene.identity && identity !== scene.identity) Object.assign(scene, createWeatherSceneState());
  if (identity) scene.identity = identity;
  const seconds = scene.lastTime === null ? 0 : Math.max(0, Math.min(options.background ? 60 : 1, (now - scene.lastTime) / 1000));
  scene.lastTime = now;
  if (scene.kind !== weather?.kind) scene.stormMs = 0;
  scene.kind = weather?.kind || null;
  scene.frozen = !!(options.paused || options.reducedMotion || options.hidden || options.stale);
  if (scene.frozen) return scene;
  scene.motionMs += seconds * 1000;
  if (scene.kind === 'storm') scene.stormMs += seconds * 1000;
  if (['rain', 'storm'].includes(scene.kind)) {
    // Visual saturation, not hydrology. Background integrates fresh observations only.
    // Same pace in demo/live; zero measured rain adds no water, including storms.
    const rise = .0001 * rainIntensityPerHour(weather);
    scene.waterLevel = Math.min(1, scene.waterLevel + rise * seconds);
    scene.rainSeconds += seconds;
  } else if (weather && !['unknown', 'snow'].includes(scene.kind)) {
    scene.waterLevel = Math.max(0, scene.waterLevel - .0003 * seconds);
    scene.rainSeconds = 0;
  }
  return scene;
}

export function paintSceneWater(ctx, level, now, night = false, foreground = false) {
  const depth = Math.max(0, Math.min(1, level || 0));
  if (!depth) return;
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const surface = 576 - Math.max(0, depth - .12) * 430;
  if (foreground) {
    if (depth > .12) {
      rect(0, surface, 960, 576 - surface, night ? '#355e7640' : '#6ba4b84b');
      for (let i = 0; i < 34; i++) {
        const y = surface + 5 + (i * 43) % Math.max(1, 570 - surface);
        const x = (i * 137 + Math.sin(now / 1100 + i) * 14 + 960) % 960;
        rect(x, y, 13 + i % 5 * 8, 2, '#c5e4dd55');
      }
    }
    return;
  }
  for (const [x, y] of [[70, 316], [329, 329], [475, 389], [862, 303], [466, 550], [93, 478], [785, 520]]) {
    const width = 28 + depth * 210, height = 4 + depth * 45;
    rect(x - width / 2, y - height / 2, width, height, night ? '#416878a0' : '#739ea8b0');
    rect(x - width * .35, y - height * .8, width * .7, height * 1.5, night ? '#41687890' : '#739ea890');
    const ripple = 4 + ((now / 90 + x) % 20);
    rect(x - ripple, y - 2, ripple * 2, 2, '#c5e4dd80');
  }
  if (depth > .12) rect(0, surface, 960, 576 - surface, night ? '#3a657799' : '#6296a899');
}

export function paintSceneFog(ctx, now, night = false) {
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  // Full-height haze, plus broad drifting banks in front of workers and terrain.
  rect(0, 0, 960, 576, night ? '#a9becb33' : '#d9e3da4d');
  for (let i = 0; i < 16; i++) {
    const y = i * 39 - 25 + Math.sin(now / 3400 + i * 1.7) * 13;
    const x = (i * 193 + now / (70 + i * 5)) % 1320 - 420;
    rect(-30, y, 1020, 56 + i % 3 * 14, night ? '#b6c9d112' : '#e4ece316');
    rect(x, y - 15, 420 + i % 3 * 80, 88, night ? '#c0d0d516' : '#edf1e81c');
  }
}

export function paintWeatherProphet(ctx, forecast, now, paused = false, reducedMotion = false, layer = 'body') {
  const rect = (x, y, w, height, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, height); };
  const time = paused || reducedMotion ? 0 : now;
  const bob = Math.sin(time / 1000) * .8, x = 894, y = 355 + bob;
  if (layer === 'body') {
    rect(x-24,355,48,7,'#253e42'); rect(x-22,361,44,3,'#b7a381');
    // Original purple-robed seer: pointed hat, white beard, staff and crystal.
    rect(x-12,y-37,24,31,'#7773a6'); rect(x-16,y-18,32,13,'#66628f');
    rect(x-8,y-35,5,28,'#9b93bf'); rect(x+9,y-32,3,25,'#514f78');
    rect(x-11,y-4,9,5,'#3e4054'); rect(x+3,y-4,9,5,'#3e4054');
    rect(x-10,y-56,20,19,'#e9b997'); rect(x-7,y-54,14,9,'#f1c7a4');
    rect(x-6,y-50,3,2,'#283947'); rect(x+4,y-50,3,2,'#283947');
    rect(x-11,y-43,22,9,'#d2d2bd'); rect(x-8,y-34,16,9,'#f2edda'); rect(x-4,y-25,8,5,'#fff8e6');
    rect(x-14,y-60,28,6,'#7773a6'); rect(x-10,y-67,20,9,'#7773a6'); rect(x-5,y-76,11,12,'#8b82b3');
    rect(x-1,y-70,3,4,'#f1d99a');
    const gesture = Math.sin(time / 1800) * 2;
    rect(x-23,y-34,11,6,'#7773a6'); rect(x-24,y-30,7,5,'#e9b997');
    rect(x-26,y-54,3,49,'#a88c61'); rect(x-29,y-61,9,9,'#95dbd6'); rect(x-27,y-60,3,3,'#e4fff0');
    rect(x+11,y-29+gesture,12,6,'#7773a6'); rect(x+20,y-28+gesture,7,4,'#e9b997');
    rect(x+23,y-40+gesture,13,12,'#85c8ca'); rect(x+26,y-43+gesture,7,17,'#a8e3d9'); rect(x+25,y-39+gesture,4,3,'#e3fff2');
    // Mystic rune stones and floating mana sparkles around Prophet
    const runePulse = Math.sin(time / 800) * .5 + .5;
    rect(836, 350, 8, 12, '#33484c'); rect(838, 352, 4, 8, '#466266');
    rect(839, 354, 2, 4, runePulse > .4 ? '#78f0d8' : '#3d887a');
    rect(946, 348, 9, 14, '#33484c'); rect(948, 350, 5, 10, '#466266');
    rect(950, 353, 2, 5, runePulse > .6 ? '#78f0d8' : '#3d887a');
    if (!paused && !reducedMotion) {
      for (let i = 0; i < 3; i++) {
        const sparkY = 320 - ((time / 30 + i * 16) % 36);
        const sparkX = 848 + i * 40 + Math.sin(time / 400 + i) * 6;
        if (sparkX >= 832 && sparkX <= 956) rect(sparkX, sparkY, 2, 2, i % 2 === 0 ? '#95dbd6' : '#f1d99a');
      }
    }
    return;
  }
  const data = forecast?.data;
  // Rounded cloud silhouette sampled as pixel rows to match the original art.
  const oval = (cx, cy, rx, ry, color) => {
    for (let dy = -ry; dy < ry; dy += 2) {
      const half = Math.sqrt(Math.max(0, 1 - ((dy + 1) / ry) ** 2)) * rx;
      rect(cx - half, cy + dy, half * 2, 2, color);
    }
  };
  const edge = forecast?.stale || data?.stale ? '#b99c64' : '#607b80';
  for (const [cx,cy,rx,ry] of [[892,196,61,45],[855,182,26,27],[876,164,28,26],[906,165,27,25],[930,184,25,27]]) oval(cx,cy,rx,ry,edge);
  for (const [cx,cy,rx,ry] of [[892,196,59,43],[855,182,24,25],[876,164,26,24],[906,165,25,23],[930,184,23,25]]) oval(cx,cy,rx,ry,'#e2e9db');
  oval(879,250,5,5,'#e2e9db'); oval(888,264,3,3,'#e2e9db');
  const text = (value, cy, font = '10px sans-serif', color = '#314c50') => { ctx.fillStyle=color;ctx.font=font;ctx.textAlign='center';ctx.fillText(value,892,cy); };
  if (data) {
    const hour = new Date(data.at).toLocaleTimeString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit'});
    text(hour,155,'bold 12px sans-serif');
    const kind=data.kind, night=data.isDay===false;
    if (['clear','partly'].includes(kind)) {
      rect(879,166,24,24,night?'#8193ae':'#e4b760');
      if(night)rect(887,161,20,24,'#e2e9db');
      else for(const [dx,dy]of[[-7,9],[29,9],[10,-7],[10,29]])rect(879+dx,166+dy,4,4,'#e4b760');
    }
    if (['partly','cloudy','rain','storm','snow'].includes(kind)) {
      const drift=Math.sin(time/1600)*2;
      rect(874+drift,175,35,13,kind==='storm'?'#586f83':'#8a9ea6'); rect(881+drift,168,21,22,kind==='storm'?'#586f83':'#8a9ea6');
      if(['rain','storm'].includes(kind))for(let i=0;i<4;i++)rect(877+i*9,192+(time/100+i*5)%10,2,5,'#4b9fbd');
      if(kind==='storm')for(const[dx,dy]of[[0,0],[-3,4],[0,6],[-4,10]])rect(891+dx,187+dy,4,5,'#deb86b');
      if(kind==='snow')for(let i=0;i<4;i++)rect(877+i*9,192+(time/250+i*5)%10,3,3,'#ffffff');
    }
    if(kind==='fog')for(let i=0;i<4;i++)rect(870+Math.sin(time/1800+i)*3,170+i*8,43,3,'#99ada8');
    if(kind==='unknown')text('?',192,'bold 25px sans-serif');
    text(data.label,218,'bold 11px sans-serif');
  } else {
    text('◌',188,'24px sans-serif'); text('Chưa có dự báo',217,'bold 10px sans-serif');
  }
  text('Nhà tiên tri',385,'bold 10px sans-serif','#dce8d0');ctx.textAlign='left';
}
export function contextPercentText(value) {
  return (Math.floor(value * 10) / 10).toFixed(1);
}
export function characterLife(row) {
  const demo = typeof row.demoContextPercent === 'number' && Number.isFinite(row.demoContextPercent);
  const measured = typeof row.context_tokens === 'number' && Number.isFinite(row.context_tokens) && row.context_tokens >= 0
    && typeof row.context_window === 'number' && Number.isFinite(row.context_window) && row.context_window > 0;
  if (!demo && !measured) return { key: 'unknown', label: 'Chưa rõ tuổi', percent: null, tokens: null, capacity: null, simulated: false };
  const percent = Math.min(100, Math.max(0, demo ? row.demoContextPercent : row.context_tokens / row.context_window * 100));
  const stage = LIFE_STAGES[Math.min(3, Math.floor(percent / 25))];
  return { ...stage, percent, tokens: demo ? null : row.context_tokens, capacity: demo ? null : row.context_window, simulated: demo };
}
export function laborForSession(id) {
  let hash = 2166136261;
  for (const char of String(id)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return LABORS[hash % LABORS.length];
}
export function decorateCharacter(person) {
  return { ...person, life: characterLife(person), labor: LABORS.find(job => job.id === person.laborId) || laborForSession(person.id) };
}
const RESTING_STATES = new Set(['live-idle', 'live-done', 'live-paused', 'live-waiting', 'live-error', 'live-unknown', 'waiting', 'done']);
export const WORK_REGIONS = [
  { id: 'dig', center: [230, 218], width: 320, height: 100 },
  { id: 'farm', center: [690, 218], width: 240, height: 100 },
  { id: 'wood', center: [230, 393], width: 320, height: 100 },
  { id: 'stone', center: [690, 393], width: 240, height: 100 },
];
function sceneRandom(id) {
  let seed = 2166136261;
  for (const char of String(id)) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}
export function arrangeCharacters(people, memory = {}) {
  memory.rest ||= Object.create(null);
  const ordered = [...people].sort((a, b) => a.id.localeCompare(b.id));
  const ids = new Set(ordered.map(person => person.id));
  for (const id of Object.keys(memory.rest)) if (!ids.has(id)) delete memory.rest[id];
  const restScale = Math.min(1, .75 * Math.sqrt(900 * 60 / (Math.max(1, people.length) * 70 * 64)));
  const occupied = [];
  for (const person of ordered) {
    const previous = memory.rest[person.id];
    if (!previous) continue;
    if (occupied.some(other => Math.abs(previous[0] - other[0]) < 70 * restScale && Math.abs(previous[1] - other[1]) < 64 * restScale)) delete memory.rest[person.id];
    else occupied.push(previous);
  }
  for (const person of ordered) {
    if (memory.rest[person.id]) continue;
    const random = sceneRandom(person.id), gapX = 70 * restScale, gapY = 64 * restScale;
    let point, best, bestClearance = -1;
    for (let attempt = 0; attempt < 2048; attempt++) {
      point = [30 + random() * 900, 490 + random() * 60];
      const clearance = occupied.length ? Math.min(...occupied.map(other => Math.max(Math.abs(point[0] - other[0]) / gapX, Math.abs(point[1] - other[1]) / gapY))) : Infinity;
      if (clearance > bestClearance) { best = point; bestClearance = clearance; }
      if (clearance >= 1) break;
      point = best;
    }
    memory.rest[person.id] = point; occupied.push(point);
  }
  const work = new Map();
  for (const region of WORK_REGIONS) {
    const group = ordered.filter(person => person.labor.id === region.id);
    const cols = Math.max(1, Math.min(group.length, Math.ceil(Math.sqrt(group.length * region.width / region.height))));
    const rows = Math.max(1, Math.ceil(group.length / cols));
    const cellW = region.width / cols, cellH = region.height / rows;
    group.forEach((person, index) => {
      const random = sceneRandom('work:' + person.id);
      work.set(person.id, { point: [region.center[0] - region.width / 2 + (index % cols + .5) * cellW + (random() - .5) * cellW * .08,
        region.center[1] - region.height / 2 + (Math.floor(index / cols) + .5) * cellH + (random() - .5) * cellH * .08],
        scale: Math.min(1, cellW / 70, cellH / 85) });
    });
  }
  return people.map(person => {
    const assignment = work.get(person.id);
    return { ...person, restSpot: [...memory.rest[person.id]], workSpot: assignment.point,
      sceneScale: RESTING_STATES.has(person.status) ? restScale : assignment.scale };
  });
}

export function characterHit(person, position, x, y, detail = false) {
  const scale = person.sceneScale || 1, height = characterPixels(person).worldHeight * scale;
  const [px, py] = position;
  const atRest = !person.isWalking && (!person.restSpot || Math.hypot(px - person.restSpot[0], py - person.restSpot[1]) <= 6);
  const isSleeping = Boolean(person.rest?.sleeping && RESTING_STATES.has(person.status) && atRest);
  const bodyHeight = isSleeping ? 32 * scale : height;
  const body = Math.abs(x - px) < Math.max(12, 40 * scale) && y > py - bodyHeight - 5 && y < py + 5;
  const label = detail && Math.abs(x - Math.max(82, Math.min(878, px))) < 82 && y > py - height - 60 && y < py - height - 5;
  return { hit: body || label, distance: Math.hypot(px - x, py - bodyHeight / 2 - y) };
}

export function wateringWorkMotion(phase) {
  const ease = t => t * t * (3 - 2 * t);
  if (phase < .18) return { stage: 'hold', angle: 0, pouring: false };
  if (phase < .34) return { stage: 'tilt', angle: .55 * ease((phase - .18) / .16), pouring: false };
  if (phase < .72) return { stage: 'pour', angle: .55, pouring: true };
  if (phase < .90) return { stage: 'return', angle: .55 * (1 - ease((phase - .72) / .18)), pouring: false };
  return { stage: 'hold', angle: 0, pouring: false };
}
// Original articulated animation, referencing the anticipation/contact/recovery
// rhythm of LPC hand tools. No external sprite pixels are incorporated.
export function characterPose(person, now, { moving = false, paused = false, reducedMotion = false } = {}) {
  const frozen = paused || reducedMotion;
  const resting = RESTING_STATES.has(person.status);
  const sleeping = resting && person.rest?.sleeping;
  const mode = moving ? 'walk' : sleeping ? 'sleep' : resting ? 'rest' : 'work';
  let seed = 0;
  for (const char of String(person.id)) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  const elder = person.life?.key === 'elder';
  const gardener = person.labor?.id === 'farm';
  const period = mode === 'sleep' ? 3600 : mode === 'walk' ? 640 : gardener ? elder ? 3200 : 2600 : elder ? 1850 : 1350;
  const phase = frozen ? 0 : ((now + seed % 1300) % period) / period;
  const wave = frozen ? 0 : Math.sin(phase * Math.PI * 2);
  const stride = mode === 'walk' ? (frozen ? 0 : wave * .55) : 0;
  // Impact jobs use anticipation/contact/recovery; watering has a slower loop.
  const strike = phase < .35 ? phase / .35 : phase < .53 ? 1 - (phase - .35) / .18 : 0;
  const watering = mode === 'work' && gardener ? wateringWorkMotion(phase) : null;
  const hit = !frozen && mode === 'work' && !gardener && phase >= .50 && phase < .64;
  const overhead = person.labor?.id === 'wood' || person.labor?.id === 'stone';
  return {
    mode, phase, hit, watering,
    bob: frozen ? 0 : mode === 'sleep' ? wave * .4 : mode === 'walk' ? Math.abs(wave) * 2 : mode === 'rest' ? Math.sin((now + seed % 1700) / 700) * .7 : gardener ? 0 : strike * 2,
    lean: frozen ? 0 : gardener ? 0 : mode === 'work' ? strike * (overhead ? .16 : .23) : mode === 'walk' ? .04 : elder ? .07 : 0,
    head: frozen ? 0 : mode === 'rest' ? Math.sin((now + seed % 1100) / 2100) * .08 : -strike * .06,
    rightArm: frozen ? .2 : mode === 'walk' ? -stride : mode === 'rest' ? .12 : overhead ? -.4 - strike * 2 : -.45 - strike * .9,
    leftArm: frozen ? -.2 : mode === 'walk' ? stride : mode === 'rest' ? -.12 : overhead ? -.1 - strike * 1.6 : -.2 - strike * 1.1,
    leftLeg: stride, rightLeg: -stride,
    blink: mode === 'sleep' || (!frozen && (now + seed % 4000) % 4300 < 130),
    breath: !frozen && (mode === 'rest' || mode === 'sleep'),
  };
}

export const MAX_FARM_ATLAS_ENTRIES = 16;
export const farmAtlasCache = new Map();

export function getFarmAtlas(key, width, height, renderer) {
  if (typeof document === 'undefined') return null;
  if (farmAtlasCache.has(key)) {
    const canvas = farmAtlasCache.get(key);
    farmAtlasCache.delete(key);
    farmAtlasCache.set(key, canvas);
    return canvas;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      renderer(ctx);
      if (farmAtlasCache.size >= MAX_FARM_ATLAS_ENTRIES) {
        const oldestKey = farmAtlasCache.keys().next().value;
        farmAtlasCache.delete(oldestKey);
      }
      farmAtlasCache.set(key, canvas);
      return canvas;
    }
  } catch {
    // Graceful fallback for non-browser or cold-load errors
  }
  return null;
}

export function clearFarmAtlas() {
  farmAtlasCache.clear();
}

export function renderStaticFarmPlot(ctx, cx, cy, halfWidth, wet) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  const soilBase = wet ? '#302619' : '#4d3d28';
  const soilDark = wet ? '#221a11' : '#392c1c';
  const soilLight = wet ? '#403423' : '#614d33';
  rect(cx - halfWidth + 5, cy - 71, halfWidth * 2 - 10, 105, soilBase);
  for (let s = 0; s < 18; s++) {
    const sx = cx - halfWidth + 12 + (s * 47) % (halfWidth * 2 - 24);
    const sy = cy - 68 + (s * 29) % 96;
    rect(sx, sy, 2, 2, s % 2 === 0 ? soilDark : soilLight);
  }
  rect(cx - halfWidth + 2, cy - 74, halfWidth * 2 - 4, 3, '#6b5137');
  rect(cx - halfWidth + 2, cy + 36, halfWidth * 2 - 4, 3, '#3d2e1f');
  rect(cx - halfWidth + 2, cy - 74, 3, 113, '#543f2b');
  rect(cx + halfWidth - 5, cy - 74, 3, 113, '#3d2e1f');
  for (let g = 0; g < 14; g++) {
    const gx = cx - halfWidth + 8 + g * ((halfWidth * 2 - 16) / 14);
    rect(gx, cy - 75, 3, 3, g % 2 === 0 ? '#5a784d' : '#3f5934');
    rect(gx + 2, cy + 37, 3, 2, g % 2 === 0 ? '#4b693e' : '#354d2c');
  }

  for (let row = 0; row < 4; row++) {
    const fy = cy - 59 + row * 23;
    rect(cx - 85, fy, 166, 12, '#403e2a');
    rect(cx - 85, fy + 2, 166, 3, '#322c1d');
    rect(cx - 85, fy, 166, 2, wet ? '#3a3020' : '#574830');
    rect(cx - 85, fy + 10, 166, 2, wet ? '#211a11' : '#2d2417');
    if (wet) {
      for (let w = 0; w < 6; w++) rect(cx - 70 + w * 28 + (row * 7) % 15, fy + 10, 8, 1, '#53717a60');
    }

    for (let col = 0; col < 8; col++) {
      const px = cx - 72 + col * 20, py = fy + 3;
      if (row === 0) {
        rect(px, py, 3, 9, '#8daf67');
        rect(px - 5, py + 2, 13, 3, '#6e9656');
        rect(px - 3, py - 2, 9, 3, '#7ea859');
        rect(px - 1, py + 1, 5, 2, '#a4d474');
        if ((col % 3) === 0) rect(px + 1, py + 3, 2, 2, '#c1ec91');
      } else if (row === 1) {
        rect(px, py, 3, 9, '#8daf67');
        rect(px - 5, py + 2, 13, 3, '#6e9656');
        rect(px - 2, py - 1, 7, 3, '#5c8547');
        if ((col % 2) === 0) {
          rect(px - 3, py, 4, 4, '#de6356');
          rect(px - 2, py + 1, 2, 2, '#f28579');
          rect(px - 3, py - 1, 4, 1, '#5c8547');
        } else {
          rect(px + 2, py + 1, 3, 3, '#ecc865');
          rect(px + 3, py, 2, 2, '#fffde8');
        }
      } else if (row === 2) {
        rect(px, py - 3, 2, 12, '#6b5437');
        rect(px, py, 3, 9, '#8daf67');
        rect(px - 5, py + 2, 13, 3, '#6e9656');
        rect(px - 2, py - 2, 8, 4, '#769e54');
        if ((col % 2) === 0) {
          rect(px - 3, py, 4, 4, '#de6356');
          rect(px - 2, py + 1, 2, 2, '#f28579');
        } else {
          rect(px + 2, py + 1, 3, 3, '#ecc865');
        }
      } else {
        rect(px, py, 3, 9, '#8daf67');
        rect(px - 5, py + 2, 13, 3, '#6e9656');
        rect(px - 4, py - 3, 3, 5, '#7ba652');
        rect(px + 4, py - 3, 3, 5, '#7ba652');
        rect(px - 1, py + 6, 4, 2, '#df7428');
      }
    }
  }

  // Wooden Water Barrel Prop at [cx - 80, cy + 16]
  rect(cx - 80, cy + 16, 16, 18, '#6f5238');
  rect(cx - 80, cy + 16, 2, 18, '#59412a');
  rect(cx - 66, cy + 16, 2, 18, '#826346');
  rect(cx - 81, cy + 20, 18, 2, '#4a5759');
  rect(cx - 81, cy + 29, 18, 2, '#4a5759');
  rect(cx - 73, cy + 20, 2, 2, '#6d7f82');
  rect(cx - 73, cy + 29, 2, 2, '#6d7f82');
  rect(cx - 78, cy + 16, 12, 3, '#5da6b8');
  rect(cx - 76, cy + 17, 8, 1, '#7ec7d8');
  rect(cx - 74, cy + 24, 4, 3, '#cfa344');
  rect(cx - 72, cy + 27, 2, 2, '#ecc96a');
  rect(cx - 79, cy + 33, 14, 2, '#4f5c54');

  // Harvest Crate Prop at garden corner
  const crateX = cx + halfWidth - 36, crateY = cy + 16;
  rect(crateX, crateY, 18, 14, '#7a5e3e');
  rect(crateX + 1, crateY + 1, 16, 12, '#94744f');
  rect(crateX + 2, crateY + 4, 14, 1, '#59432a');
  rect(crateX + 2, crateY + 8, 14, 1, '#59432a');
  rect(crateX + 3, crateY - 2, 5, 4, '#de6356');
  rect(crateX + 9, crateY - 3, 6, 4, '#df7428');
  rect(crateX + 12, crateY - 5, 3, 3, '#7ea859');
}

export function paintFarmRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, baseline = false) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  if (baseline) {
    for (let row = 0; row < 4; row++) {
      rect(x - 85, y - 59 + row * 23, 166, 12, '#403e2a');
      rect(x - 85, y - 57 + row * 23, 166, 3, '#322c1d');
      for (let col = 0; col < 8; col++) {
        const cx = x - 72 + col * 20, cy = y - 56 + row * 23;
        rect(cx, cy, 3, 9, '#8daf67');
        rect(cx - 5, cy + 2, 13, 3, '#6e9656');
        if ((row + col) % 3 === 0) rect(cx - 3, cy, 4, 4, '#de6356');
        else if ((row + col) % 3 === 1) rect(cx + 2, cy + 1, 3, 3, '#ecc865');
      }
    }
    const size = person?.life.key === 'child' ? .72 : person?.life.key === 'middle' ? 1.06 : person?.life.key === 'elder' ? 1.08 : 1;
    const plantX = x + 60 * size;
    rect(plantX, y - 10, 3, 13, '#8daf67');
    rect(plantX - 6, y - 7, 8, 3, '#6e9656'); rect(plantX + 2, y - 12, 7, 3, '#8daf67');
    rect(x - 80, y + 16, 16, 18, '#6f5238');
    rect(x - 81, y + 20, 18, 2, '#4a5759');
    rect(x - 81, y + 29, 18, 2, '#4a5759');
    rect(x - 78, y + 16, 12, 3, '#5da6b8');
    return;
  }

  // --- Upgraded Phase 1 Farm Graphics with Cached Atlas ---
  const size = person?.life.key === 'child' ? .72 : person?.life.key === 'middle' ? 1.06 : person?.life.key === 'elder' ? 1.08 : 1;
  const plantX = x + 60 * size;

  const key = `farm_plot:${halfWidth}:${wet ? 'wet' : 'dry'}`;
  const plotW = halfWidth * 2;
  const plotH = 115;
  const atlas = ctx.drawImage ? getFarmAtlas(key, plotW, plotH, offCtx => {
    renderStaticFarmPlot(offCtx, halfWidth, 76, halfWidth, wet);
  }) : null;

  if (atlas && ctx.drawImage) {
    ctx.drawImage(atlas, Math.round(x - halfWidth), Math.round(y - 76));
  } else {
    renderStaticFarmPlot(ctx, x, y, halfWidth, wet);
  }

  // Target watering plant (receiving the farmer's water stream)
  rect(plantX, y - 10, 3, 13, '#8daf67');
  rect(plantX - 6, y - 7, 8, 3, '#6e9656');
  rect(plantX + 2, y - 12, 7, 3, '#8daf67');
  rect(plantX - 4, y - 11, 4, 3, '#a1cc72');
  rect(plantX + 1, y - 5, 5, 2, '#6e9656');
}

export function renderStaticDigPit(ctx, cx, cy, halfWidth, wet) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  const soilBase = wet ? '#2e261a' : '#4d3d28';
  const soilDark = wet ? '#1d170f' : '#332719';
  const soilLight = wet ? '#3d3222' : '#614d33';

  // Pit Boundary & Foundation
  rect(cx - halfWidth + 5, cy - 71, halfWidth * 2 - 10, 105, soilBase);
  for (let s = 0; s < 22; s++) {
    const sx = cx - halfWidth + 10 + (s * 43) % (halfWidth * 2 - 20);
    const sy = cy - 68 + (s * 31) % 96;
    rect(sx, sy, 2, 2, s % 2 === 0 ? soilDark : soilLight);
  }
  rect(cx - halfWidth + 2, cy - 74, halfWidth * 2 - 4, 3, '#6b5137');
  rect(cx - halfWidth + 2, cy + 36, halfWidth * 2 - 4, 3, '#3d2e1f');
  rect(cx - halfWidth + 2, cy - 74, 3, 113, '#543f2b');
  rect(cx + halfWidth - 5, cy - 74, 3, 113, '#3d2e1f');
  for (let g = 0; g < 16; g++) {
    const gx = cx - halfWidth + 8 + g * ((halfWidth * 2 - 16) / 16);
    rect(gx, cy - 75, 3, 3, g % 2 === 0 ? '#5a784d' : '#3f5934');
    rect(gx + 2, cy + 37, 3, 2, g % 2 === 0 ? '#4b693e' : '#354d2c');
  }

  // Main Excavation Trench Pit (Left center)
  const pitX = cx - 80, pitY = cy - 54;
  rect(pitX, pitY, 78, 50, '#262218');
  rect(pitX + 2, pitY + 2, 74, 46, '#1a1710');
  rect(pitX + 2, pitY + 6, 74, 6, wet ? '#362f22' : '#4a4030');
  rect(pitX + 2, pitY + 18, 74, 7, wet ? '#2b241a' : '#3b3224');
  rect(pitX + 2, pitY + 32, 74, 8, wet ? '#201b13' : '#2e261b');
  for (let p = 0; p < 6; p++) {
    rect(pitX + 8 + p * 12, pitY + 9, 3, 2, '#746445');
    rect(pitX + 14 + p * 11, pitY + 22, 2, 2, '#918260');
  }
  if (wet) {
    rect(pitX + 12, pitY + 41, 52, 5, '#3a5057');
    rect(pitX + 18, pitY + 42, 40, 2, '#53717a');
  }

  // Shoring Pit Timber Frame & Cross-Braces
  rect(pitX - 2, pitY - 2, 6, 54, '#6b5137');
  rect(pitX + 74, pitY - 2, 6, 54, '#4d3925');
  rect(pitX - 2, pitY - 2, 82, 5, '#826444');
  rect(pitX + 2, pitY + 24, 74, 4, '#5e452e');
  rect(pitX - 3, pitY - 3, 4, 4, '#3b4347');
  rect(pitX + 77, pitY - 3, 4, 4, '#3b4347');

  // Access Ladder
  const ladX = cx - 58;
  rect(ladX, cy - 58, 3, 48, '#8b6e43');
  rect(ladX + 14, cy - 58, 3, 48, '#8b6e43');
  rect(ladX, cy - 58, 1, 48, '#a68758');
  for (let r = 0; r < 6; r++) {
    rect(ladX, cy - 52 + r * 8, 17, 2, '#b39462');
    rect(ladX + 1, cy - 51 + r * 8, 15, 1, '#d4b785');
  }

  // Excavated Earth Mounds (Right side)
  for (let m = 0; m < 5; m++) {
    const mx = cx + 24 + m * 14, my = cy - 28 - (m % 3) * 10;
    rect(mx, my, 22, 24, '#735e39');
    rect(mx + 2, my + 2, 18, 6, '#8c7447');
    rect(mx + 4, my + 1, 14, 3, '#a88d59');
    rect(mx + 1, my + 16, 20, 8, '#594729');
    rect(mx + 6, my + 6, 3, 3, '#4a3b21');
    rect(mx + 13, my + 10, 4, 3, '#948057');
  }

  // Mining Cart / Tool Cart Prop
  const cartX = cx + 18, cartY = cy + 12;
  rect(cartX, cartY, 26, 14, '#6b4f32');
  rect(cartX + 1, cartY + 1, 24, 12, '#82613e');
  rect(cartX + 2, cartY + 3, 22, 2, '#4a3621');
  rect(cartX, cartY + 7, 26, 2, '#3b4347');
  rect(cartX + 2, cartY, 2, 14, '#3b4347');
  rect(cartX + 22, cartY, 2, 14, '#3b4347');
  rect(cartX + 3, cartY - 3, 20, 4, '#8c7447');
  rect(cartX + 6, cartY - 5, 14, 3, '#a88d59');
  rect(cartX + 6, cartY + 14, 12, 12, '#2b2923');
  rect(cartX + 8, cartY + 16, 8, 8, '#4a463c');
  rect(cartX + 10, cartY + 18, 4, 4, '#1a1915');
  rect(cartX + 26, cartY + 4, 8, 3, '#594027');
  rect(cartX + 32, cartY + 5, 2, 6, '#594027');

  // Tool Rack with Leaning Shovels
  const rackX = cx - halfWidth + 14, rackY = cy + 10;
  rect(rackX, rackY, 18, 3, '#755435');
  rect(rackX + 2, rackY + 3, 3, 16, '#5e432a');
  rect(rackX + 13, rackY + 3, 3, 16, '#5e432a');
  rect(rackX + 5, rackY - 14, 2, 28, '#b5925e');
  rect(rackX + 10, rackY - 12, 2, 26, '#b5925e');
  rect(rackX + 3, rackY - 18, 6, 5, '#7a8b8c');
  rect(rackX + 9, rackY - 16, 7, 4, '#6b7a7b');
}

export function paintDigRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, baseline = false) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  if (baseline) {
    rect(x - 75, y - 52, 69, 43, '#3f3929');
    rect(x - 75, y - 48, 69, 6, '#4d4632');
    rect(x - 75, y - 38, 69, 6, '#353023');
    rect(x - 69, y - 45, 58, 30, '#302f24');
    rect(x - 62, y - 54, 3, 36, '#8b6e43');
    rect(x - 52, y - 54, 3, 36, '#8b6e43');
    for (let r = 0; r < 5; r++) rect(x - 62, y - 50 + r * 7, 13, 2, '#b39462');
    for (let i = 0; i < 5; i++) {
      rect(x + 35 + i * 8, y - 25 - i % 3 * 9, 15, 19, '#a18859');
      rect(x + 36 + i * 8, y - 24 - i % 3 * 9, 13, 4, '#bfa879');
      rect(x + 39 + i * 8, y - 18 - i % 3 * 9, 3, 3, '#746445');
    }
    rect(x + 22, y + 15, 18, 9, '#7a5b3a');
    rect(x + 20, y + 21, 6, 6, '#3a3832');
    rect(x + 38, y + 18, 9, 2, '#8d6f4c');
    return;
  }

  const key = `dig_pit:${halfWidth}:${wet ? 'wet' : 'dry'}`;
  const plotW = halfWidth * 2;
  const plotH = 115;
  const atlas = ctx.drawImage ? getFarmAtlas(key, plotW, plotH, offCtx => {
    renderStaticDigPit(offCtx, halfWidth, 76, halfWidth, wet);
  }) : null;

  if (atlas && ctx.drawImage) {
    ctx.drawImage(atlas, Math.round(x - halfWidth), Math.round(y - 76));
  } else {
    renderStaticDigPit(ctx, x, y, halfWidth, wet);
  }
}

export function renderStaticWoodYard(ctx, cx, cy, halfWidth, wet) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  const groundBase = wet ? '#282318' : '#453826';
  const groundDark = wet ? '#1a160f' : '#2e2518';
  const groundLight = wet ? '#362d1e' : '#574630';

  // Yard Perimeter & Foundation
  rect(cx - halfWidth + 5, cy - 71, halfWidth * 2 - 10, 105, groundBase);
  for (let s = 0; s < 22; s++) {
    const sx = cx - halfWidth + 10 + (s * 41) % (halfWidth * 2 - 20);
    const sy = cy - 68 + (s * 27) % 96;
    rect(sx, sy, 2, 2, s % 2 === 0 ? groundDark : groundLight);
  }
  rect(cx - halfWidth + 2, cy - 74, halfWidth * 2 - 4, 3, '#5c432d');
  rect(cx - halfWidth + 2, cy + 36, halfWidth * 2 - 4, 3, '#362719');
  rect(cx - halfWidth + 2, cy - 74, 3, 113, '#4a3523');
  rect(cx + halfWidth - 5, cy - 74, 3, 113, '#362719');
  for (let g = 0; g < 16; g++) {
    const gx = cx - halfWidth + 8 + g * ((halfWidth * 2 - 16) / 16);
    rect(gx, cy - 75, 3, 3, g % 2 === 0 ? '#4e693f' : '#384d2d');
    rect(gx + 2, cy + 37, 3, 2, g % 2 === 0 ? '#425a35' : '#2e3e25');
  }

  // Large Chopping Block with Bark & Rings (Left center)
  const blockX = cx - 68, blockY = cy - 42;
  rect(blockX, blockY, 36, 44, '#5e3f26');
  rect(blockX + 2, blockY + 2, 32, 40, '#755132');
  rect(blockX + 4, blockY + 4, 6, 36, '#47301c');
  rect(blockX + 16, blockY + 4, 4, 36, '#47301c');
  rect(blockX + 28, blockY + 4, 4, 36, '#47301c');
  rect(blockX - 3, blockY - 9, 42, 14, '#a88554');
  rect(blockX - 1, blockY - 8, 38, 12, '#c6a271');
  rect(blockX + 5, blockY - 6, 26, 8, '#a68251');
  rect(blockX + 10, blockY - 5, 16, 6, '#d9b682');
  rect(blockX + 15, blockY - 4, 6, 4, '#8a6438');
  rect(blockX + 12, blockY - 3, 8, 2, '#422814');

  // Scattered Fresh Woodchips & Sawdust
  for (let c = 0; c < 14; c++) {
    const chipX = cx - 82 + (c * 17) % 85;
    const chipY = cy - 10 + (c * 11) % 40;
    rect(chipX, chipY, 3, 2, c % 2 === 0 ? '#d4b882' : '#ebd19d');
    if (c % 3 === 0) rect(chipX + 1, chipY + 1, 4, 1, '#bfa06b');
  }

  // Stacks of Firewood Cordwood (Right side)
  const stackX = cx + 24, stackY = cy - 40;
  for (let tier = 0; tier < 3; tier++) {
    const logsInTier = 4 - tier;
    const tierY = stackY + tier * 15;
    const tierOffset = tier * 7;
    for (let l = 0; l < logsInTier; l++) {
      const lx = stackX + tierOffset + l * 20;
      rect(lx, tierY, 24, 14, '#543b25');
      rect(lx + 2, tierY + 2, 20, 10, '#6e4f32');
      rect(lx + 1, tierY + 1, 9, 12, '#baa06d');
      rect(lx + 2, tierY + 2, 7, 10, '#c6a271');
      rect(lx + 4, tierY + 4, 3, 6, '#825e36');
      rect(lx + 5, tierY + 5, 1, 4, '#543b25');
    }
  }

  // Sawbuck / Sawhorse with Timber Log
  const sawX = cx + 8, sawY = cy + 12;
  rect(sawX, sawY, 4, 20, '#5c4129');
  rect(sawX + 8, sawY, 4, 20, '#5c4129');
  rect(sawX + 22, sawY, 4, 20, '#5c4129');
  rect(sawX + 30, sawY, 4, 20, '#5c4129');
  rect(sawX - 2, sawY + 6, 38, 4, '#735234');
  rect(sawX - 6, sawY - 4, 46, 10, '#614328');
  rect(sawX - 7, sawY - 3, 8, 8, '#b89c68');
  rect(sawX + 37, sawY - 3, 4, 8, '#47311d');

  // Wedge & Mallet Tool Crate
  const crateX = cx - halfWidth + 12, crateY = cy + 16;
  rect(crateX, crateY, 18, 14, '#6b4f35');
  rect(crateX + 1, crateY + 1, 16, 12, '#826042');
  rect(crateX + 2, crateY + 4, 14, 1, '#4a3522');
  rect(crateX + 2, crateY + 8, 14, 1, '#4a3522');
  rect(crateX + 4, crateY - 3, 4, 5, '#85929e');
  rect(crateX + 10, crateY - 4, 4, 6, '#707b82');
}

export function paintWoodRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, baseline = false) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  if (baseline) {
    rect(x - 62, y - 42, 29, 38, '#755438');
    rect(x - 65, y - 47, 35, 12, '#c6a271');
    rect(x - 56, y - 44, 17, 5, '#94754d');
    rect(x - 52, y - 43, 9, 3, '#baa06d');
    for (let s = 0; s < 6; s++) rect(x - 70 + s * 7, y - 6 + (s * 3) % 8, 3, 2, '#d4b882');
    for (let i = 0; i < 4; i++) {
      rect(x + 30 + i % 2 * 20, y - 32 + Math.floor(i / 2) * 14, 35, 12, '#765a3e');
      rect(x + 32 + i % 2 * 20, y - 30 + Math.floor(i / 2) * 14, 7, 8, '#c6a271');
      rect(x + 34 + i % 2 * 20, y - 28 + Math.floor(i / 2) * 14, 3, 4, '#8a6845');
    }
    rect(x + 12, y + 12, 4, 18, '#6b4f35'); rect(x + 20, y + 12, 4, 18, '#6b4f35');
    rect(x + 8, y + 16, 20, 4, '#8a6845');
    return;
  }

  const key = `wood_yard:${halfWidth}:${wet ? 'wet' : 'dry'}`;
  const plotW = halfWidth * 2;
  const plotH = 115;
  const atlas = ctx.drawImage ? getFarmAtlas(key, plotW, plotH, offCtx => {
    renderStaticWoodYard(offCtx, halfWidth, 76, halfWidth, wet);
  }) : null;

  if (atlas && ctx.drawImage) {
    ctx.drawImage(atlas, Math.round(x - halfWidth), Math.round(y - 76));
  } else {
    renderStaticWoodYard(ctx, x, y, halfWidth, wet);
  }
}

export function renderStaticStoneQuarry(ctx, cx, cy, halfWidth, wet) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  const groundBase = wet ? '#262d29' : '#3d4742';
  const groundDark = wet ? '#171c19' : '#28302c';
  const groundLight = wet ? '#343d38' : '#4f5c56';

  // Quarry Yard & Foundation
  rect(cx - halfWidth + 5, cy - 71, halfWidth * 2 - 10, 105, groundBase);
  for (let s = 0; s < 24; s++) {
    const sx = cx - halfWidth + 8 + (s * 37) % (halfWidth * 2 - 16);
    const sy = cy - 68 + (s * 23) % 96;
    rect(sx, sy, 2, 2, s % 2 === 0 ? groundDark : groundLight);
  }
  rect(cx - halfWidth + 2, cy - 74, halfWidth * 2 - 4, 3, '#5c6962');
  rect(cx - halfWidth + 2, cy + 36, halfWidth * 2 - 4, 3, '#2a332e');
  rect(cx - halfWidth + 2, cy - 74, 3, 113, '#46524c');
  rect(cx + halfWidth - 5, cy - 74, 3, 113, '#2a332e');
  for (let g = 0; g < 14; g++) {
    const gx = cx - halfWidth + 8 + g * ((halfWidth * 2 - 16) / 14);
    rect(gx, cy - 75, 3, 3, g % 2 === 0 ? '#4d6356' : '#36473d');
    rect(gx + 2, cy + 37, 3, 2, g % 2 === 0 ? '#3f5247' : '#2b3830');
  }

  // Quarry Rockface Outcrop with Faceted Planes
  for (const [dx, dy, w, h] of [[-74, -54, 52, 34], [-46, -34, 44, 32], [28, -42, 42, 34]]) {
    rect(cx + dx, cy + dy, w, h, '#545f57');
    rect(cx + dx + 2, cy + dy + 2, w - 4, h - 4, '#6b776e');
    rect(cx + dx, cy + dy, w, 3, '#8e9c91');
    rect(cx + dx, cy + dy, 3, h, '#8e9c91');
    rect(cx + dx, cy + dy + h - 3, w, 3, '#333b35');
    rect(cx + dx + w - 3, cy + dy, 3, h, '#333b35');
    rect(cx + dx + 10, cy + dy + 8, w - 20, 2, '#424c45');
    rect(cx + dx + 18, cy + dy + 10, 2, h - 18, '#424c45');
    // Sparkling Crystal Veins
    rect(cx + dx + 14, cy + dy + 5, 8, 2, '#50c9b0');
    rect(cx + dx + 16, cy + dy + 7, 5, 3, '#7ce8d2');
    rect(cx + dx + 18, cy + dy + 8, 2, 2, '#d4fff7');
  }

  // Carved Ashlar Masonry Stone Blocks
  const ashX = cx - 18, ashY = cy - 24;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const bx = ashX + col * 20 - row * 6;
      const by = ashY + row * 16;
      rect(bx, by, 18, 14, '#5e6b62');
      rect(bx + 1, by + 1, 16, 12, '#859489');
      rect(bx + 1, by + 1, 16, 2, '#a7b8ab');
      rect(bx + 1, by + 1, 2, 12, '#a7b8ab');
      rect(bx + 1, by + 12, 16, 2, '#3f4742');
      rect(bx + 16, by + 1, 2, 12, '#3f4742');
      rect(bx + 7, by + 6, 4, 2, '#556158');
    }
  }

  // Loose Rubble, Pebbles & Chips
  for (let r = 0; r < 8; r++) {
    const rx = cx - 55 + (r * 19) % 110;
    const ry = cy + 12 + (r * 7) % 22;
    rect(rx, ry, 5, 4, r % 2 === 0 ? '#637067' : '#7b8a7f');
    rect(rx + 1, ry + 1, 3, 2, '#9aa89e');
    rect(rx + 1, ry + 3, 3, 1, '#3b423d');
  }

  // Heavy Stonemason Tool Rack
  const rackX = cx + halfWidth - 34, rackY = cy + 10;
  rect(rackX, rackY, 24, 16, '#4d3d2c');
  rect(rackX + 2, rackY + 2, 20, 12, '#66523d');
  rect(rackX + 4, rackY + 4, 16, 2, '#362a1e');
  rect(rackX + 4, rackY - 6, 5, 8, '#59656b');
  rect(rackX + 12, rackY - 8, 6, 10, '#6d7b82');
  rect(rackX + 14, rackY - 12, 2, 6, '#b59465');
}

export function paintStoneRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, baseline = false) {
  const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(rx), Math.round(ry), rw, rh); };
  if (baseline) {
    for (const [dx, dy, w] of [[-60, -49, 45], [-38, -29, 35], [42, -35, 30]]) {
      rect(x + dx, y + dy, w, 26, '#727d75');
      rect(x + dx + 6, y + dy - 5, w - 12, 14, '#9aa59a');
      rect(x + dx + 10, y + dy - 3, 4, 8, '#59635b');
      rect(x + dx + 16, y + dy + 2, 6, 2, '#70d6c2');
      rect(x + dx + 18, y + dy + 4, 3, 3, '#a7f0e2');
    }
    for (let r = 0; r < 4; r++) rect(x - 20 + r * 14, y + 12 + (r * 5) % 9, 6, 4, '#889489');
    return;
  }

  const key = `stone_quarry:${halfWidth}:${wet ? 'wet' : 'dry'}`;
  const plotW = halfWidth * 2;
  const plotH = 115;
  const atlas = ctx.drawImage ? getFarmAtlas(key, plotW, plotH, offCtx => {
    renderStaticStoneQuarry(offCtx, halfWidth, 76, halfWidth, wet);
  }) : null;

  if (atlas && ctx.drawImage) {
    ctx.drawImage(atlas, Math.round(x - halfWidth), Math.round(y - 76));
  } else {
    renderStaticStoneQuarry(ctx, x, y, halfWidth, wet);
  }
}

export function paintWaterer(ctx, person, pose, px, py, sprite, baseline = false) {
  const child = person.life.key === 'child', elder = person.life.key === 'elder';
  const size = child ? .72 : person.life.key === 'middle' ? 1.06 : elder ? 1.08 : 1;
  const legs = child ? 6 : 12, head = elder ? 27 : 18;
  const torso = sprite.worldHeight - legs - head;
  const shoulderY = -legs - torso + 3;
  const skin = '#e9b997', shirt = person.color || '#80d6be';
  const fill = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const segment = (x1, y1, x2, y2, color, width) => {
    ctx.save(); ctx.translate(x1, y1); ctx.rotate(Math.atan2(y2-y1, x2-x1) - Math.PI/2);
    fill(-width/2, 0, width, Math.hypot(x2-x1, y2-y1), color); ctx.restore();
  };
  ctx.save(); ctx.translate(px, py - pose.bob);
  // Side-facing, planted stance. Only travel swings the legs and carrying arm.
  for (const [x, angle, far] of [[-6*size, pose.leftLeg, true], [5*size, pose.rightLeg, false]]) {
    ctx.save(); ctx.translate(x, -legs); ctx.rotate(angle);
    fill(-3*size, 0, 6*size, legs-2, far ? '#53626a' : '#3b4b55');
    fill(-3*size, legs-3-(far ? 1 : 0), 10*size, 4, '#243132'); ctx.restore();
  }
  const armSwing = pose.mode === 'walk' ? Math.sin(pose.phase*Math.PI*2)*3*size : 0;
  segment(-5*size, shoulderY, -8*size, shoulderY+8*size, skin, 5*size);
  segment(-8*size, shoulderY+8*size, -5*size, -legs-2, skin, 5*size);
  fill(-8*size, -legs-torso, 16*size, torso, shirt);
  fill(-8*size, -legs-torso+2, 3*size, torso-2, '#253f3540');
  fill(4*size, shoulderY+4, 4*size, 3, '#ffffff25');
  fill(-5*size, shoulderY+2, 2*size, Math.max(2,torso-6), characterShade(shirt,255,.20));
  fill(2*size, shoulderY+5, 4*size, 4, characterShade(shirt,0,.22));
  fill(3*size, shoulderY+5, 2*size, 1, characterShade(shirt,255,.28));
  if (!baseline) {
    // Overalls suspender brace & brass clasp
    fill(-2*size, shoulderY, 3*size, torso-2, '#4d3b2c');
    fill(-2*size, -legs-4, 3*size, 2, '#d9c396');
  }
  fill(-7*size, -legs-3, 15*size, 3, '#465b53');
  // Original side portrait retains age, session hair/color, and the elder beard.
  const top = -sprite.worldHeight;
  fill(-7*size, top+3, 18*size, 12, skin);
  fill(-7*size, top, 15*size, 5, elder ? '#c9d0c6' : person.hair || '#403628');
  fill(-7*size, top+4, 3*size, 7, elder ? '#c9d0c6' : person.hair || '#403628');
  fill(10*size, top+9, 3*size, 4, skin);
  fill(6*size, top+8, 3, pose.blink ? 1 : 3, '#26343a');
  fill(5*size, top+12, 3, 2, '#d58e80');
  fill(-4*size, top+6, 3*size, 4, '#f1c7a4');
  fill(8*size, top+7, 2*size, 1, '#b17c64');
  fill(5*size, top+8, 4*size, pose.blink ? 1 : 3, '#fff1d4');
  fill(7*size, top+9, 1*size, pose.blink ? .5 : 2, '#26343a');
  fill(10*size, top+12, 2*size, 1, '#c98f76');
  fill(5*size, top+14, 4*size, 1, '#b57463');
  fill(-4*size, top+1, 6*size, 1, characterShade(elder ? '#c9d0c6' : person.hair || '#403628',255,.25));
  fill(-2*size, top+15, 6*size, 3, skin);
  if (person.life.key === 'middle') fill(-7*size, top+5, 3*size, 4, '#b2b3a3');
  if (elder) {
    fill(-3*size, top+13, 15*size, 4, '#f2edda');
    fill(-4*size, top+17, 14*size, 4, '#f2edda');
    fill(-2*size, top+21, 10*size, 3, '#f2edda');
    fill(0, top+24, 6*size, 3, '#f2edda');
    fill(0, top+17, 2*size, 7, '#fff8e6');
    fill(7*size, top+17, 2*size, 4, '#b9bdac');
  }
  if (!baseline) {
    // Farmer straw sun hat with session ribbon
    fill(-13*size, top-1, 28*size, 3, '#caa96a');
    fill(-11*size, top-2, 24*size, 2, '#dec285');
    fill(-6*size, top-7, 14*size, 6, '#caa96a');
    fill(-4*size, top-8, 10*size, 2, '#ebd8a4');
    fill(-6*size, top-2, 14*size, 2, shirt);
  }

  const handX = 25*size + armSwing, handY = -legs - 7*size;
  const angle = pose.watering?.angle || 0;
  // Can, handle and spout are one rigid object pivoting at the hand's grip.
  ctx.save(); ctx.translate(handX, handY); ctx.rotate(angle);
  fill(-8*size, 3*size, 16*size, 10*size, '#679f87');
  fill(-8*size, 3*size, 3*size, 10*size, '#467760');
  fill(-3*size, 5*size, 8*size, 1*size, '#a2c9b1');
  fill(5*size, 7*size, 2*size, 5*size, '#508a70');
  fill(-4*size, -2*size, 10*size, 2*size, '#355b52');
  fill(-4*size, -2*size, 2*size, 6*size, '#355b52');
  fill(4*size, -2*size, 2*size, 6*size, '#355b52');
  if (!baseline) {
    fill(-10*size, 5*size, 3*size, 6*size, '#355b52');
  }
  segment(6*size, 8*size, 22*size, -2*size, '#679f87', 5*size);
  fill(20*size, -4*size, 5*size, 5*size, '#c9e1cb');
  ctx.restore();
  segment(5*size, shoulderY, 15*size+armSwing/2, handY, shirt, 6*size);
  segment(15*size+armSwing/2, handY, handX, handY, skin, 5*size);
  fill(handX-3*size, handY-3*size, 6*size, 5*size, '#f1c7a4');
  if (pose.watering?.pouring) {
    // Use the rendered nozzle transform, not a hard-coded particle origin.
    const nx = handX + size*(23*Math.cos(angle)+Math.sin(angle));
    const ny = handY + size*(23*Math.sin(angle)-Math.cos(angle));
    const targetX = 60*size, targetY = 2;
    for (let stream = 0; stream < 3; stream++) for (let i = 0; i < 7; i++) {
      const t = (i/7 + pose.phase*5) % 1;
      fill(nx+(targetX-nx)*t+(stream-1)*size*t, ny+(targetY-ny)*t*t, 2, 2, '#79c5e6');
    }
  }
  ctx.restore();
}

function paintSleeper(ctx, person, pose, px, py, sprite) {
  const fill = (x, y, w, height, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, height); };
  const left = px - sprite.worldHeight / 2;
  fill(left - 9, py - 4, sprite.worldHeight + 18, 8, '#728059');
  fill(left - 8, py - 3, sprite.worldHeight + 16, 6, '#8c9971');
  fill(left - 10, py - 20, sprite.headHeight + 3, 17, '#bdc9b0');
  fill(left - 8, py - 18, sprite.headHeight - 1, 12, '#e0e5cf');
  ctx.save(); ctx.translate(left, py - 16 - pose.bob); ctx.rotate(-Math.PI / 2);
  // Same age/color sprite laid horizontally, with closed eyes and hands at rest.
  paintCharacterPart(ctx, sprite, 'head', true);
  paintCharacterPart(ctx, sprite, 'body');
  const legsY = sprite.headHeight + sprite.bodyHeight;
  for (const x of [-7, 3]) {
    fill(x, legsY, 6, sprite.legHeight - 2, '#3b4b55');
    fill(x - 1, legsY + sprite.legHeight - 3, 8, 3, '#243132');
  }
  fill(-7, sprite.headHeight + 4, 4, sprite.bodyHeight - 5, person.color || '#80d6be');
  fill(-5, sprite.headHeight + sprite.bodyHeight - 7, 10, 3, '#e9b997');
  ctx.restore();
  ctx.fillStyle = '#dce8d0'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('Zzz', left + 5, py - 32 - pose.phase * 5); ctx.textAlign = 'left';
}

function paintWorker(ctx, person, pose, px, py, sprite, baseline = false, dark = false) {
  if (pose.mode === 'sleep') return paintSleeper(ctx, person, pose, px, py, sprite);
  if (person.labor.id === 'farm') return paintWaterer(ctx, person, pose, px, py, sprite, baseline);
  const fill = (x, y, w, height, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, height); };
  const elder = person.life.key === 'elder', child = person.life.key === 'child';
  const shirt = person.color || '#80d6be';
  const skin = '#e9b997';
  const shoulderY = sprite.headHeight + 3;
  const legHeight = sprite.legHeight;
  ctx.save(); ctx.translate(px, py - pose.bob);
  // Boots and trousers swing independently during travel to/from a resting spot.
  for (const [x, angle] of [[-6, pose.leftLeg], [6, pose.rightLeg]]) {
    ctx.save(); ctx.translate(x, -legHeight); ctx.rotate(angle);
    fill(-3, 0, 6, legHeight - 3, '#3b4b55'); fill(-3, legHeight - 3, 9, 4, '#243132'); fill(-3, 0, 2, legHeight - 3, '#53626a');
    if (!baseline && person.labor.id === 'dig') {
      // Digger steel-toe reinforced work boot rim
      fill(-3, legHeight - 2, 9, 1, '#60727a');
    }
    ctx.restore();
  }
  ctx.translate(0, -legHeight); ctx.rotate(pose.lean); ctx.translate(0, -(sprite.headHeight + sprite.bodyHeight));
  // The torso retains session color and age silhouette; arms are separate joints.
  paintCharacterPart(ctx, sprite, 'body');
  fill(-7, sprite.headHeight + sprite.bodyHeight - 4, 17, 3, '#465b53'); fill(-1, sprite.headHeight + sprite.bodyHeight - 4, 3, 3, '#d9c396');
  fill(3, shoulderY + 5, 5, 5, '#ffffff25');

  if (!baseline) {
    if (person.labor.id === 'dig') {
      // Digger heavy mining utility harness & brass buckles
      fill(-5, shoulderY + 1, 2, sprite.bodyHeight - 5, '#3e3124');
      fill(5, shoulderY + 1, 2, sprite.bodyHeight - 5, '#3e3124');
      fill(-6, shoulderY + 5, 4, 2, '#cfa344');
      fill(4, shoulderY + 5, 4, 2, '#cfa344');
    } else if (person.labor.id === 'wood') {
      // Lumberjack leather suspenders & brass clasps
      fill(-4, shoulderY, 3, sprite.bodyHeight - 4, '#4d3525');
      fill(3, shoulderY, 3, sprite.bodyHeight - 4, '#4d3525');
      fill(-4, sprite.headHeight + sprite.bodyHeight - 6, 3, 2, '#d9c396');
      fill(3, sprite.headHeight + sprite.bodyHeight - 6, 3, 2, '#d9c396');
    } else if (person.labor.id === 'stone') {
      // Stonemason heavy split-leather bib apron & strap
      fill(-4, shoulderY + 2, 10, sprite.bodyHeight - 4, '#5e4835');
      fill(-3, shoulderY + 3, 8, sprite.bodyHeight - 6, '#735843');
      fill(-5, shoulderY + 2, 12, 2, '#3e2f22');
      fill(-1, shoulderY + 2, 4, 2, '#b0bec5');
    }
  }

  // Opposing arms bend at the elbow and grip the job's tool with the near hand.
  const arm = (x, angle, near) => {
    const length = child ? 7 : 11;
    ctx.save(); ctx.translate(x, shoulderY); ctx.rotate(angle);
    fill(-3, -2, 6, length, shirt); fill(-3, 0, 2, length, '#253f3540');
    ctx.translate(0, length - 1); ctx.rotate(near && pose.mode === 'work' ? -.38 : .25);
    fill(-2, 0, 5, length - 1, skin); fill(-3, length - 4, 7, 5, '#f1c7a4');
    fill(-2, 0, 1, length-3, '#c98f76'); fill(2, 1, 1, Math.max(1,length-5), '#f5d3b3');
    if (!baseline && near) {
      fill(-3, length - 5, 7, 2, person.labor.id === 'stone' ? '#4a3b2c' : person.labor.id === 'wood' ? '#422b1c' : '#3d3124');
    }
    if (near) {
      ctx.translate(0, length - 2); ctx.rotate(person.labor.id === 'dig' ? -.55 : -.2);
      // Remaining impact tools attach beyond the shaft, away from the grip.
      fill(-1, -13, 3, 36, '#b99b66'); fill(-1, -13, 1, 36, '#e0c88a');
      fill(1, -8, 1, 10, '#8d724c');
      if (person.labor.id === 'dig') { fill(-6, 20, 13, 10, '#899c99'); fill(-4, 21, 3, 7, '#cfddd0'); fill(-3, 30, 7, 3, '#899c99'); }
      // Negative local X is the downward-facing side during the forward chop.
      else if (person.labor.id === 'wood') { fill(-14, 18, 13, 12, '#91a3a1'); fill(-14, 18, 6, 12, '#dce4d6'); }
      else { fill(-12, 19, 25, 10, '#8d9991'); fill(-10, 19, 21, 3, '#c7d3c6'); }
      // Fingers overlap the wooden handle instead of appearing to hold metal.
      fill(-3, -2, 7, 4, '#f1c7a4');
    }
    ctx.restore();
  };
  arm(-11, pose.leftArm, false);
  ctx.save(); ctx.translate(0, shoulderY - 3); ctx.rotate(pose.head); ctx.translate(0, -shoulderY + 3);
  paintCharacterPart(ctx, sprite, 'head', pose.blink);

  if (!baseline) {
    if (person.labor.id === 'dig') {
      // Miner's protective hardhat with brass headlamp
      fill(-8, -1, 17, 4, '#c49339');
      fill(-6, -5, 13, 5, '#dbab48');
      fill(-4, -6, 9, 2, '#fae17d');
      fill(-2, -3, 5, 4, '#2d373c');
      fill(-1, -2, 3, 3, '#ffeb99');
      fill(0, -1, 1, 1, '#ffffff');
      if (dark && pose.mode !== 'sleep') {
        fill(2, -3, 8, 5, '#fae17d25');
        fill(10, -5, 12, 9, '#fae17d15');
        fill(22, -7, 14, 13, '#fae17d0c');
      }
    } else if (person.labor.id === 'wood') {
      // Lumberjack red knit toque / beanie with folded cuff
      fill(-8, -1, 17, 3, '#ba4545');
      fill(-7, -2, 15, 2, '#d15c5c');
      fill(-6, -6, 13, 5, '#9e3535');
      fill(-4, -7, 9, 2, '#b84242');
      fill(-1, -8, 3, 2, '#7d2323');
    } else if (person.labor.id === 'stone') {
      // Stonemason protective slate-blue bandana / headscarf
      fill(-8, 3, 17, 3, '#455866');
      fill(-7, 2, 15, 2, '#5c7080');
      fill(-9, 4, 3, 4, '#364754');
      fill(-10, 6, 2, 4, '#2c3a45');
    }
  }

  ctx.restore();
  arm(12, pose.rightArm, true);
  ctx.restore();
  if (pose.hit) {
    const progress = (pose.phase - .50) / .14;
    const impactX=px+22, impactY=py-3;
    for (let i = 0; i < 5; i++) {
      const spread = (i - 2) * (3 + progress * 8);
      const rise = Math.sin(progress * Math.PI) * (12 + i % 3 * 5);
      fill(impactX + spread, impactY - rise, 3 + i % 2, 3, person.labor.id === 'stone' ? '#b5c9bb' : '#d0af76');
    }
  }
}
export function characterDestination(person, index) {
  if (RESTING_STATES.has(person.status)) {
    if (person.restSpot) return person.restSpot;
    const random = sceneRandom(person.id);
    return [30 + random() * 900, 490 + random() * 60];
  }
  return person.workSpot || person.desk || WORK_REGIONS.find(region => region.id === person.labor?.id)?.center || [230, 218];
}

export const ROAD_CENTER_X = 479;
export const ROAD_CENTER_Y = 320;
export const REST_AREA_Y_MIN = 460;
export const agentTravelMap = new WeakMap();

export function clearAgentTravel(positions) {
  if (positions && typeof positions === 'object') {
    const travelState = agentTravelMap.get(positions);
    if (travelState) travelState.clear();
  }
}

export function computeRoadPath(start, destination) {
  if (!start || !destination) return [];
  const [x1, y1] = start;
  const [x2, y2] = destination;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  if (dist <= 0.001) {
    return [];
  }
  if (dist <= 35) {
    return [[x2, y2]];
  }

  const isRestA = y1 >= REST_AREA_Y_MIN;
  const isRestB = y2 >= REST_AREA_Y_MIN;
  const rawPoints = [];

  if (isRestA && isRestB) {
    // Both in rest area: direct traversal along rest row
    rawPoints.push([x2, y2]);
  } else if (!isRestA && isRestB) {
    // Work area -> Rest area
    if (Math.abs(y1 - ROAD_CENTER_Y) > 20) {
      rawPoints.push([x1, ROAD_CENTER_Y]);
    }
    if (Math.abs(x1 - ROAD_CENTER_X) > 20) {
      rawPoints.push([ROAD_CENTER_X, ROAD_CENTER_Y]);
    }
    if (Math.abs(y2 - ROAD_CENTER_Y) > 20) {
      rawPoints.push([ROAD_CENTER_X, y2]);
    }
    rawPoints.push([x2, y2]);
  } else if (isRestA && !isRestB) {
    // Rest area -> Work area
    if (Math.abs(x1 - ROAD_CENTER_X) > 20) {
      rawPoints.push([ROAD_CENTER_X, y1]);
    }
    rawPoints.push([ROAD_CENTER_X, ROAD_CENTER_Y]);
    if (Math.abs(x2 - ROAD_CENTER_X) > 20) {
      rawPoints.push([x2, ROAD_CENTER_Y]);
    }
    rawPoints.push([x2, y2]);
  } else {
    // Work quadrant -> Work quadrant
    const quadA = (x1 < ROAD_CENTER_X ? 'W' : 'E') + (y1 < ROAD_CENTER_Y ? 'N' : 'S');
    const quadB = (x2 < ROAD_CENTER_X ? 'W' : 'E') + (y2 < ROAD_CENTER_Y ? 'N' : 'S');
    if (quadA === quadB) {
      rawPoints.push([x2, y2]);
    } else {
      if (Math.abs(y1 - ROAD_CENTER_Y) > 20) {
        rawPoints.push([x1, ROAD_CENTER_Y]);
      }
      if (quadA[0] !== quadB[0] && (Math.abs(x1 - ROAD_CENTER_X) > 20 || Math.abs(x2 - ROAD_CENTER_X) > 20)) {
        rawPoints.push([ROAD_CENTER_X, ROAD_CENTER_Y]);
      }
      if (Math.abs(x2 - ROAD_CENTER_X) > 20) {
        rawPoints.push([x2, ROAD_CENTER_Y]);
      }
      rawPoints.push([x2, y2]);
    }
  }

  const waypoints = [];
  let lastX = x1, lastY = y1;
  for (let i = 0; i < rawPoints.length; i++) {
    const isLast = (i === rawPoints.length - 1);
    const pt = isLast ? [x2, y2] : [Math.round(rawPoints[i][0]), Math.round(rawPoints[i][1])];
    const segDist = Math.hypot(pt[0] - lastX, pt[1] - lastY);
    if (segDist >= 6 || isLast) {
      waypoints.push(pt);
      lastX = pt[0];
      lastY = pt[1];
    }
  }
  if (waypoints.length === 0 || Math.hypot(waypoints[waypoints.length - 1][0] - x2, waypoints[waypoints.length - 1][1] - y2) >= 1) {
    waypoints.push([x2, y2]);
  } else {
    waypoints[waypoints.length - 1] = [x2, y2];
  }
  return waypoints;
}

// Original 32-column artwork. Detail coordinates are independent of world size.
const characterSpriteCache = new Map();
function characterShade(color, target, amount) {
  const hex = /^#[a-f0-9]{6}$/i.test(color) ? color.slice(1) : '80d6be';
  return '#' + [0,2,4].map(i => Math.round(parseInt(hex.slice(i,i+2),16)*(1-amount)+target*amount).toString(16).padStart(2,'0')).join('');
}
export function characterPixelRect(sprite, pixel) {
  const bodyRows = sprite.bodyEnd - sprite.headRows;
  const head = pixel.y < sprite.headRows;
  const legs = pixel.y >= sprite.bodyEnd;
  const scaleY = head ? sprite.headHeight / sprite.headRows : legs ? sprite.legHeight / (sprite.height-sprite.bodyEnd) : sprite.bodyHeight / bodyRows;
  const y = head ? pixel.y*scaleY : legs ? sprite.headHeight+sprite.bodyHeight+(pixel.y-sprite.bodyEnd)*scaleY : sprite.headHeight+(pixel.y-sprite.headRows)*scaleY;
  return { x: -sprite.worldWidth/2 + pixel.x*sprite.worldWidth/sprite.width, y, width: sprite.worldWidth/sprite.width, height: scaleY };
}
export function paintCharacterPart(ctx, sprite, part, blink = false) {
  const body = part === 'body';
  if (ctx.drawImage && typeof document !== 'undefined') {
    const key = blink ? 'closedBitmap' : 'bitmap';
    if (!sprite[key]) {
      const bitmap = document.createElement('canvas'); bitmap.width = sprite.width; bitmap.height = sprite.height;
      const paint = bitmap.getContext('2d');
      for (const pixel of sprite.pixels) { paint.fillStyle = pixel.color; paint.fillRect(pixel.x,pixel.y,1,1); }
      if(blink) {
        paint.fillStyle='#e9b997'; paint.fillRect(10,9,3,2); paint.fillRect(19,9,3,2);
        paint.fillStyle='#26343a'; paint.fillRect(10,10,3,1); paint.fillRect(19,10,3,1);
      }
      sprite[key]=bitmap;
    }
    // Nearest-neighbour sprite sampling preserves hard pixel edges at any DPI.
    const x=body ? sprite.torsoLeft : 0, y=body ? sprite.headRows : 0;
    const width=body ? sprite.torsoWidth : sprite.width, height=body ? sprite.bodyEnd-sprite.headRows : sprite.headRows;
    ctx.drawImage(sprite[key],x,y,width,height,-sprite.worldWidth/2+x*sprite.worldWidth/sprite.width,body ? sprite.headHeight : 0,width*sprite.worldWidth/sprite.width,body ? sprite.bodyHeight : sprite.headHeight);
    return;
  }
  for(const pixel of sprite.pixels) {
    if(body ? pixel.y<sprite.headRows || pixel.y>=sprite.bodyEnd || pixel.x<sprite.torsoLeft || pixel.x>=sprite.torsoLeft+sprite.torsoWidth : pixel.y>=sprite.headRows) continue;
    const detail=characterPixelRect(sprite,pixel); ctx.fillStyle=pixel.color;
    ctx.fillRect(detail.x,detail.y,detail.width,blink && pixel.color==='#26343a' ? .5 : detail.height);
  }
}
export function characterPixels(person) {
  const stage = person.life?.key || characterLife(person).key;
  const child = stage === 'child', middle = stage === 'middle', elder = stage === 'elder';
  const shirt = person.color || '#80d6be', hair = elder ? '#c9d0c6' : person.hair || '#403628';
  const key = `${stage}:${shirt}:${hair}`;
  if (characterSpriteCache.has(key)) return characterSpriteCache.get(key);
  const width = 32, headRows = elder ? 27 : 18, bodyRows = child ? 12 : middle ? 21 : 18, legRows = child ? 6 : 12;
  const height = headRows+bodyRows+legRows, grid = Array.from({length:height},()=>Array(width).fill(null));
  const block = (x,y,w,h,color) => {
    for(let yy=y;yy<y+h;yy++) for(let xx=x;xx<x+w;xx++) if(xx>=0 && xx<width && yy>=0 && yy<height) grid[yy][xx]=color;
  };
  const skin='#e9b997', skinLight='#f1c7a4', skinShade='#c98f76';
  const shirtShade=characterShade(shirt,0,.28), shirtLight=characterShade(shirt,255,.24);
  // Face outline, cheeks, individual eyes, eyebrows, nose and mouth.
  block(6,3,20,12,skinShade); block(7,4,18,11,skin); block(8,6,15,5,skinLight);
  block(5,9,3,4,skin); block(24,9,3,4,skin); block(6,10,1,2,skinShade); block(25,10,1,2,skinShade);
  block(7,1,18,4,hair); block(5,4,22,3,hair); block(5,6,3,4,hair); block(24,6,3,4,hair);
  block(8,1,4,1,characterShade(hair,255,.18)); block(8,3,7,1,characterShade(hair,255,.12));
  block(9,8,4,1,characterShade(hair,0,.1)); block(19,8,4,1,characterShade(hair,0,.1));
  block(10,9,3,2,'#fff1d4'); block(19,9,3,2,'#fff1d4'); block(11,9,2,2,'#26343a'); block(19,9,2,2,'#26343a');
  block(15,11,2,2,skinShade); block(8,12,3,1,'#d58e80'); block(21,12,3,1,'#d58e80');
  block(12,14,8,1,'#b57463'); block(14,15,4,1,skinLight); block(12,16,8,2,skin);
  if(middle || elder) { block(5,6,3,4,'#b2b3a3'); block(24,6,3,4,'#b2b3a3'); block(8,7,4,1,'#c98f76'); block(20,7,4,1,'#c98f76'); }
  if(elder) {
    block(6,14,20,5,'#d2d2bd'); block(8,18,16,4,'#f2edda'); block(10,22,12,3,'#f2edda'); block(13,25,6,2,'#f2edda');
    block(9,15,14,2,'#f2edda'); block(14,16,4,1,'#b57463'); block(11,18,2,5,'#fff8e6'); block(20,18,2,3,'#b9bdac');
  }
  const bodyEnd=headRows+bodyRows, torsoWidth=child ? 18 : middle ? 28 : elder ? 26 : 22;
  const left=(width-torsoWidth)/2;
  block(left,headRows,torsoWidth,bodyRows,shirtShade); block(left+2,headRows+1,torsoWidth-4,bodyRows-2,shirt);
  block(left+3,headRows+2,3,bodyRows-5,shirtLight); block(left+torsoWidth-4,headRows+4,2,bodyRows-6,shirtShade);
  block(12,headRows,8,2,skin); block(10,headRows+1,4,2,shirtLight); block(18,headRows+1,4,2,shirtLight);
  block(15,headRows+3,2,bodyRows-5,shirtShade);
  for(let y=headRows+4;y<bodyEnd-3;y+=4) block(16,y,1,1,'#e8e6bf');
  block(20,headRows+6,5,4,shirtShade); block(21,headRows+6,3,1,shirtLight);
  block(left-2,headRows+2,2,child ? 7 : 10,skinShade); block(left+torsoWidth,headRows+2,2,child ? 7 : 10,skin);
  block(left-2,headRows+6,2,2,skinLight); block(left+torsoWidth,headRows+6,2,2,skinLight);
  block(left,bodyEnd-2,torsoWidth,2,'#465b53'); block(14,bodyEnd-2,4,2,'#d9c396'); block(15,bodyEnd-2,2,1,'#fff1b5');
  for(const x of [9,19]) {
    block(x,bodyEnd,6,legRows-2,'#3b4b55'); block(x,bodyEnd,2,legRows-2,'#53626a'); block(x+4,bodyEnd+2,1,Math.max(1,legRows-5),'#293a44');
    block(x-1,height-3,8,3,'#243132'); block(x,height-3,6,1,'#53626a'); block(x-1,height-1,8,1,'#16262d');
  }
  const pixels=grid.flatMap((row,y)=>row.flatMap((color,x)=>color ? [{x,y,color}] : []));
  const headHeight=elder ? 27 : 18, bodyHeight=child ? 9 : middle ? 18 : 15, legHeight=child ? 6 : 12;
  const sprite={pixels,width,height,headRows,bodyEnd,torsoLeft:left,torsoWidth,headHeight,bodyHeight,legHeight,worldWidth:30,worldHeight:headHeight+bodyHeight+legHeight,stage,beard:elder};
  if(characterSpriteCache.size>=256) characterSpriteCache.delete(characterSpriteCache.keys().next().value);
  characterSpriteCache.set(key,sprite); return sprite;
}

export function paintLandscape(ctx, state, positions, selected, now, paused, reducedMotion) {
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const text = (value, x, y, color = '#dce8d0', font = '12px sans-serif') => { ctx.fillStyle = color; ctx.font = font; ctx.fillText(value, x, y); };
  ctx.clearRect(0, 0, 960, 576);
  rect(0, 0, 960, 576, '#273e32');
  const weather = state.weather, kind = weather?.kind || 'unknown';
  const night = weather?.isDay === false;
  const wet = kind === 'rain' || kind === 'storm';
  const overcast = wet || ['cloudy', 'fog', 'snow', 'unknown'].includes(kind);
  const animationTime = state.weatherEffects?.motionMs ?? (paused || reducedMotion ? 0 : now);
  const sky = night ? '#202e49' : kind === 'storm' ? '#566773' : overcast ? '#899ea5' : '#91bcc0';
  rect(0, 0, 960, 92, sky); rect(0, 69, 960, 25, night ? '#4c6171' : wet ? '#829389' : '#bccbaf');
  // Weather is independent of agent activity. Unknown weather has no fake sun.
  if (night) {
    if (!overcast) {
      for (let i = 0; i < 28; i++) {
        rect((i * 131 + 25) % 960, (i * 37 + 10) % 67, 2, 2, '#c0d2d1');
        if (i % 4 === 0) rect((i * 131 + 26) % 960, (i * 37 + 9) % 67, 1, 4, '#eef5f4'); // sparkle cross
      }
    }
    if (!wet && kind !== 'fog') {
      rect(792, 17, 27, 27, '#d1ddc8');
      rect(795, 22, 4, 4, '#b8c6b0'); rect(805, 30, 5, 3, '#b8c6b0'); // craters
      rect(802, 12, 22, 26, sky);
    }
  } else if (['clear', 'partly'].includes(kind)) {
    rect(784, 9, 48, 48, '#f7e5b4'); // soft sun outer glow
    rect(792, 17, 32, 32, '#f1d99a'); rect(786, 25, 44, 17, '#f1d99a');
  }
  for (const [cx, y] of overcast ? [[20, 15], [175, 28], [350, 12], [560, 24], [770, 10], [885, 33]] : kind === 'clear' ? [[95, 20]] : [[95, 20], [321, 12], [605, 34]]) {
    const x = (cx + animationTime / 220 * (1 + Math.min(weather?.wind || 0, 25) / 15)) % 1080 - 50;
    const cloud = night ? '#4b5b70' : wet ? '#647c89' : '#d5e4d7';
    const cloudBottom = night ? '#3e4d60' : wet ? '#506674' : '#bed0c2';
    rect(x, y + 8, overcast ? 140 : 76, 13, cloud);
    rect(x + 13, y, overcast ? 94 : 42, 26, cloud);
    rect(x + 4, y + 18, overcast ? 130 : 68, 3, cloudBottom); // cloud bottom shading
  }
  for (let i = 0; i < 12; i++) {
    rect(i * 89 - 10, 77 - i % 3 * 8, 108, 30, '#789776');
    rect(i * 89 - 5, 73 - i % 3 * 8, 50, 4, '#648466');
    rect(i * 89 + 20, 89, 96, 20, '#527659');
  }
  for (let x = 26; x < 960; x += 60) {
    rect(x + 5, 96, 4, 27, '#1e3328'); // fence post shadow
    rect(x, 94, 5, 29, '#9d8b64');
    rect(x + 1, 98, 1, 23, '#82714c'); // wood grain
    rect(x, 97, 5, 3, '#c7b28a');
  }
  rect(0, 101, 960, 4, '#aa9870'); rect(0, 104, 960, 1, '#786949');
  rect(0, 114, 960, 4, '#aa9870'); rect(0, 117, 960, 1, '#786949');
  for (let y = 131; y < 576; y += 23) for (let x = 10; x < 960; x += 35) {
    const seed = (x * 7 + y * 11) % 13;
    rect(x, y + seed % 5, 3, 3, seed < 4 ? '#668257' : '#35543d');
    if (seed === 1) { rect(x + 4, y + 2, 2, 2, '#e28b7a'); } // wildflower
    else if (seed === 5) { rect(x - 2, y + 1, 2, 2, '#ebd275'); }
    else if (seed === 9) { rect(x + 3, y - 1, 2, 2, '#a89be4'); }
  }
  rect(438, 123, 83, 453, '#8b7854'); rect(445, 123, 68, 453, '#a28d63');
  rect(0, 291, 960, 58, '#8b7854'); rect(0, 299, 960, 43, '#a28d63');
  // Cobblestone accents along paths
  for (let y = 135; y < 565; y += 38) {
    rect(452 + (y * 5) % 36, y, 9, 6, '#b39e74');
    rect(453 + (y * 5) % 36, y + 6, 9, 2, '#7d6a49');
    rect(468 - (y * 3) % 24, y + 18, 8, 5, '#947f57');
  }
  for (let x = 15; x < 945; x += 45) {
    rect(x, 308 + (x * 7) % 22, 10, 6, '#b39e74');
    rect(x, 314 + (x * 7) % 22, 10, 2, '#7d6a49');
  }
  // Shade tree and camp supplies at the crossroads.
  rect(466, 280, 26, 14, '#5e432f'); // Root flare
  rect(472, 235, 15, 59, '#76573e');
  rect(474, 240, 3, 45, '#5e432f'); // Bark groove
  rect(440, 182, 82, 60, '#365938'); // Back canopy
  rect(450, 193, 62, 48, '#416a43');
  rect(439, 209, 83, 37, '#52794b');
  rect(450, 199, 38, 19, '#73945a');
  rect(460, 186, 42, 16, '#86a86c'); // Top highlights
  // Red berries / apples in the shade tree
  for (const [bx, by] of [[455, 205], [480, 196], [498, 218], [470, 222], [505, 203]]) {
    rect(bx, by, 4, 4, '#d45d52'); rect(bx + 1, by + 1, 2, 2, '#f28c82');
  }
  // Crate and bench
  rect(389, 315, 34, 19, '#b49a59'); rect(390, 309, 30, 7, '#d1b970');
  rect(391, 317, 30, 2, '#8f763d'); rect(404, 311, 3, 21, '#8f763d');
  rect(535, 315, 41, 8, '#94704a'); rect(535, 321, 41, 2, '#624b35');
  rect(541, 323, 5, 15, '#624b35'); rect(565, 323, 5, 15, '#624b35');
  // Lantern post at the crossroads
  rect(524, 252, 5, 40, '#5e432f'); rect(522, 252, 9, 3, '#76573e');
  rect(521, 243, 11, 10, '#36494c'); // Lantern housing
  const lanternLit = night || wet;
  rect(523, 245, 7, 7, lanternLit ? '#f5d576' : '#88a89f');
  if (lanternLit) {
    if (state.sampleBaseline) {
      rect(516, 238, 21, 21, '#f5d57628'); // warm glow halo
      rect(525, 247, 3, 3, '#fff4cc');
    } else {
      rect(525, 247, 3, 3, '#fff4cc');
      rect(519, 241, 15, 15, '#f5d57635');
      rect(512, 234, 29, 29, '#f5d57622');
      rect(496, 218, 61, 61, '#f5d57612');
      rect(476, 198, 101, 101, '#f5d57608');
      if (ctx.createRadialGradient) {
        const rad = ctx.createRadialGradient(526, 248, 2, 526, 248, 70);
        rad.addColorStop(0, '#fff4cc60');
        rad.addColorStop(0.2, '#f5d57630');
        rad.addColorStop(0.5, '#f5d57614');
        rad.addColorStop(0.8, '#f5d57606');
        rad.addColorStop(1, '#f5d57600');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(526, 248, 70, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  // 4 Corner trees
  for (const [x, y] of [[35, 142], [872, 157], [48, 380], [877, 387]]) {
    rect(x + 14, y + 27, 10, 35, '#795e41');
    rect(x - 4, y + 4, 46, 38, '#3d5c38'); // outer lush layer
    rect(x, y + 7, 38, 32, '#4e7246');
    rect(x + 7, y, 30, 24, '#66884e');
    rect(x + 12, y + 3, 18, 12, '#82a566'); // top canopy highlight
    rect(x + 10, y + 18, 3, 3, '#d45d52'); // red berries
    rect(x + 24, y + 22, 3, 3, '#d45d52');
  }
  const sites = state.regions ? WORK_REGIONS.map(region => region.center) : [[211, 219], [739, 219], [211, 421], [739, 421]];
  sites.forEach(([x, y], index) => {
    const labor = state.regions ? LABORS[index] : state.agents[index]?.labor || LABORS[index];
    const person = state.regions ? state.agents.find(agent => agent.labor.id === labor.id) : state.agents[index];
    const halfWidth = state.regions ? WORK_REGIONS[index].width / 2 + 20 : 99;
    rect(x - halfWidth, y - 76, halfWidth * 2, 115, '#4b6041');
    rect(x - halfWidth, y - 76, halfWidth * 2, 3, '#5e7652'); // 3D highlight top edge
    rect(x - halfWidth + 5, y - 71, halfWidth * 2 - 10, 105, '#665c3d');
    rect(x - halfWidth + 5, y - 71, halfWidth * 2 - 10, 4, '#4e462d'); // inner shadow
    if (labor.id === 'farm') {
      paintFarmRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, state.sampleBaseline);
    } else if (labor.id === 'dig') {
      paintDigRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, state.sampleBaseline);
    } else if (labor.id === 'wood') {
      paintWoodRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, state.sampleBaseline);
    } else {
      paintStoneRegion(ctx, x, y, halfWidth, person, wet, night, now, animationTime, state.sampleBaseline);
    }
    const count = state.regions ? state.agents.filter(agent => agent.labor.id === labor.id && !RESTING_STATES.has(agent.status)).length : null;
    rect(x - halfWidth + 4, y - 97, 100, 14, '#1b2c21'); // Badge header behind title
    rect(x - halfWidth + 4, y - 97, 100, 1, '#425d4c');
    text(state.regions ? `${labor.label.toUpperCase()} · ${count}` : person ? labor.label.toUpperCase() : 'KHU TRỐNG', x - halfWidth + 8, y - 86, '#c4dcbc', '10px monospace');
  });
  if (night || wet) {
    rect(0, 123, 960, 453, night ? '#15243865' : '#20384a30');
    if (!state.sampleBaseline) {
      rect(500, 265, 52, 25, '#f5d57614');
      rect(510, 270, 32, 15, '#f5d5761e');
    }
  }
  paintSceneWater(ctx, state.weatherEffects?.waterLevel || 0, animationTime, night);
  if (wet) {
    // Puddles and rain sit behind names/activity bubbles for readable sessions.
    for (const [x, y] of [[70, 316], [329, 329], [475, 389], [862, 303], [466, 550]]) {
      rect(x, y, 35, 5, '#71979b'); rect(x + 8, y - 2, 17, 9, '#71979b'); rect(x + 9, y, 13, 2, '#a2bab3');
    }
    const rainRate = rainIntensityPerHour(weather);
    const drops = Math.round(60 + Math.min(240, rainRate * 12));
    const fallSpeed = .2 + Math.min(30, rainRate) * .015;
    const dropLength = 5 + Math.min(12, Math.sqrt(rainRate) * 3);
    for (let i = 0; i < drops; i++) {
      const y = (i * 73 + animationTime * fallSpeed) % 620 - 25;
      const x = (i * 137 + y * .22 + animationTime * .035) % 990 - 15;
      rect(x, y, 2, dropLength, night ? '#9bb9ce70' : '#c7dfed95'); rect(x - 2, y + 5, 2, 5, '#a8cddd70');
      const splashPhase = (animationTime / 350 + i * .37) % 1;
      if (i < 45 && splashPhase < .4) {
        const groundX = (i * 193 + 42) % 960, groundY = 135 + i * 83 % 435;
        const spread = 2 + splashPhase * 12;
        rect(groundX - spread, groundY - splashPhase * 6, 3, 2, '#c7dfed85');
        rect(groundX + spread, groundY - splashPhase * 6, 3, 2, '#c7dfed85');
      }
    }
  }
  if (kind === 'snow') for (let i = 0; i < 60; i++) rect((i * 151 + animationTime * .03) % 960, (i * 79 + animationTime * .05) % 576, 3, 3, '#e3ece1');
  const moving = {};
  const currentAgentIds = new Set(state.agents.map(person => person.id));

  // Prune departed agents from positions
  if (positions && typeof positions === 'object') {
    for (const id of Object.keys(positions)) {
      if (!currentAgentIds.has(id)) delete positions[id];
    }
  }

  // Per-instance travel map
  let travelState = null;
  if (positions && typeof positions === 'object') {
    travelState = agentTravelMap.get(positions);
    if (!travelState) {
      travelState = new Map();
      agentTravelMap.set(positions, travelState);
    }
    for (const id of travelState.keys()) {
      if (!currentAgentIds.has(id)) travelState.delete(id);
    }
  }

  state.agents.forEach((person, index) => {
    const destination = characterDestination(person, index);
    const position = positions[person.id] ||= [...destination];

    if (state.sampleBaseline) {
      const distance = Math.hypot(destination[0] - position[0], destination[1] - position[1]);
      moving[person.id] = distance > 4;
      if (!paused) {
        const step = reducedMotion ? 1 : Math.min(1, 3 / Math.max(1, distance));
        position[0] += (destination[0] - position[0]) * step;
        position[1] += (destination[1] - position[1]) * step;
      }
      return;
    }

    let route = travelState ? travelState.get(person.id) : null;
    const destChanged = !route || Math.hypot(route.target[0] - destination[0], route.target[1] - destination[1]) > 0.001;

    if (destChanged) {
      const waypoints = computeRoadPath(position, destination);
      route = { target: [...destination], waypoints };
      if (travelState) travelState.set(person.id, route);
    }

    if (paused) {
      const totalDist = Math.hypot(destination[0] - position[0], destination[1] - position[1]);
      moving[person.id] = (route && route.waypoints.length > 0) && totalDist > 0.001;
      return;
    }

    if (reducedMotion) {
      position[0] = destination[0];
      position[1] = destination[1];
      if (travelState) travelState.delete(person.id);
      moving[person.id] = false;
      return;
    }

    let currentTarget = destination;
    while (route && route.waypoints.length > 0) {
      const wp = route.waypoints[0];
      const distToWp = Math.hypot(wp[0] - position[0], wp[1] - position[1]);
      if (distToWp <= 3) {
        position[0] = wp[0];
        position[1] = wp[1];
        route.waypoints.shift();
      } else {
        currentTarget = wp;
        break;
      }
    }

    const distToTarget = Math.hypot(currentTarget[0] - position[0], currentTarget[1] - position[1]);
    const totalDistToFinal = Math.hypot(destination[0] - position[0], destination[1] - position[1]);
    const isEnRoute = (route && route.waypoints.length > 0) || totalDistToFinal > 0.001;
    moving[person.id] = isEnRoute;

    if (isEnRoute) {
      const step = Math.min(1, 3 / Math.max(1, distToTarget));
      position[0] += (currentTarget[0] - position[0]) * step;
      position[1] += (currentTarget[1] - position[1]) * step;
      if (Math.hypot(currentTarget[0] - position[0], currentTarget[1] - position[1]) <= 2) {
        position[0] = currentTarget[0];
        position[1] = currentTarget[1];
        if (route && route.waypoints.length > 0) {
          route.waypoints.shift();
        }
      }
      if (Math.hypot(destination[0] - position[0], destination[1] - position[1]) <= 3 && (!route || route.waypoints.length === 0)) {
        position[0] = destination[0];
        position[1] = destination[1];
        moving[person.id] = false;
      }
    }
  });
  const relLabelBoxes = [];
  const activeAgent = state.hovered || selected;
  (state.relations || []).forEach((relation, relIndex) => {
    if (!positions[relation.source] || !positions[relation.target] || !state.agents.some(p => p.id === relation.source) || !state.agents.some(p => p.id === relation.target)) return;
    const [x1, y1] = positions[relation.source], [x2, y2] = positions[relation.target];
    const angle = Math.atan2(y2 - y1, x2 - x1), endX = x2 - Math.cos(angle) * 28, endY = y2 - Math.sin(angle) * 28;
    const message = relation.type === 'communication';
    const isRelated = !activeAgent || relation.source === activeAgent || relation.target === activeAgent;
    const color = message ? (isRelated ? '#aff3ca' : '#aff3ca60') : (isRelated ? '#f1d99a' : '#f1d99a60');
    // Stagger curve height so concurrent links between lower resting workers arc differently
    const stagger = ((relIndex % 5) - 2) * 14;
    const baseOffset = message ? 25 : 0;
    const mx = (x1 + x2) / 2 - Math.sin(angle) * (baseOffset + stagger);
    let my = (y1 + y2) / 2 + Math.cos(angle) * (baseOffset + stagger);
    ctx.strokeStyle = color; ctx.lineWidth = isRelated ? 2 : 1.5; ctx.setLineDash(message ? [] : [5, 7]);
    ctx.beginPath(); ctx.moveTo(x1 + Math.cos(angle) * 28, y1 + Math.sin(angle) * 28); ctx.quadraticCurveTo(mx, my, endX, endY); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(endX, endY); ctx.lineTo(endX - Math.cos(angle - .5) * 10, endY - Math.sin(angle - .5) * 10); ctx.moveTo(endX, endY); ctx.lineTo(endX - Math.cos(angle + .5) * 10, endY - Math.sin(angle + .5) * 10); ctx.stroke();
    // Deconflict relation label pill positions
    let labelY = my;
    while (relLabelBoxes.some(box => Math.abs(box[0] - mx) < 80 && Math.abs(box[1] - labelY) < 18)) {
      labelY += 18;
    }
    relLabelBoxes.push([mx, labelY]);
    rect(mx - 44, labelY - 13, 88, 21, '#15241b'); // Pill border
    rect(mx - 43, labelY - 12, 86, 19, '#273e32');
    text(relation.label, mx - 36, labelY, color, '10px sans-serif');
    const age = Date.now() - Date.parse(relation.at);
    if (message && !paused && !reducedMotion && age >= 0 && age < 8000) {
      const progress = (now % 2200) / 2200;
      const dx = (1 - progress) ** 2 * x1 + 2 * (1 - progress) * progress * mx + progress ** 2 * x2;
      const dy = (1 - progress) ** 2 * y1 + 2 * (1 - progress) * progress * my + progress ** 2 * y2;
      rect(dx - 3, dy - 3, 6, 6, color);
    }
  });
  [...state.agents].sort((a, b) => positions[a.id][1] - positions[b.id][1]).forEach(person => {
    const [px, py] = positions[person.id].map(Math.round);
    const pose = characterPose(person, now, { moving: moving[person.id], paused, reducedMotion });
    const sprite = characterPixels(person);
    const scale = person.sceneScale || 1;
    rect(px - 20 * scale, py - 4 * scale, 41 * scale, 8 * scale, '#20362d');
    if (person.id === selected || person.id === state.hovered) { rect(px - 22 * scale, py + 5, 44 * scale, 3, '#aff3ca'); }
    ctx.save(); ctx.translate(px, py);
    if (scale !== 1) ctx.scale(scale, scale);
    paintWorker(ctx, person, pose, 0, 0, sprite, Boolean(state.sampleBaseline), Boolean(!state.sampleBaseline && (night || wet))); ctx.restore();
  });
  // Foreground water and fog cover workers, while session labels stay crisp.
  paintWeatherProphet(ctx, state.forecast, now, paused, reducedMotion);
  paintSceneWater(ctx, state.weatherEffects?.waterLevel || 0, animationTime, night, true);
  if (kind === 'fog') paintSceneFog(ctx, animationTime, night);
  if (kind === 'storm') paintStormLightning(ctx, state.weatherEffects?.stormMs ?? now, paused || state.weatherEffects?.frozen, reducedMotion);
  const labelBoxes = [];
  const activeLabel = state.hovered || selected;
  [...state.agents].sort((a, b) => Number(b.id === activeLabel) - Number(a.id === activeLabel)).forEach(person => {
    const [px, py] = positions[person.id].map(Math.round);
    const scale = person.sceneScale || 1;
    const top = py - characterPixels(person).worldHeight * scale;
    const expanded = person.id === activeLabel || state.agents.length <= 4;
    const name = person.name.length > 20 ? person.name.slice(0, 19) + '…' : person.name;
    const overlaps = box => labelBoxes.some(other => box[0] < other[2] && box[2] > other[0] && box[1] < other[3] && box[3] > other[1]);
    if (!expanded) {
      if (state.agents.length > 12) return;
      const width = Math.min(100, name.length * 6 + 10), labelY = Math.min(566, py + 18);
      const labelX = Math.max(width / 2, Math.min(960 - width / 2, px));
      const box = [labelX - width / 2, labelY - 11, labelX + width / 2, labelY + 3];
      if (overlaps(box)) return;
      labelBoxes.push(box); ctx.textAlign = 'center'; text(name, labelX, labelY, '#e4ecd4', '10px sans-serif'); ctx.textAlign = 'left'; return;
    }
    const activity = state.live ? person.activity?.label || 'Chưa rõ hoạt động' : person.status === 'done' ? 'Đã hoàn tất' : person.status === 'waiting' ? 'Chờ giao việc' : person.status === 'meeting' ? 'Đang trao đổi' : 'Đang làm việc';
    const tool = state.live && person.activity?.tool;
    const bubbleY = Math.max(125, top - (tool ? 57 : 40)), labelX = Math.max(82, Math.min(878, px));
    const box = [labelX - 82, bubbleY, labelX + 82, Math.min(573, py + 38)];
    if (person.id !== activeLabel && overlaps(box)) return;
    labelBoxes.push(box);
    // Bubble drop shadow and border
    rect(labelX - 80, bubbleY + 2, 164, tool ? 44 : 28, '#13221a90');
    rect(labelX - 83, bubbleY - 1, 166, tool ? 46 : 30, '#15241b');
    rect(labelX - 82, bubbleY, 164, tool ? 44 : 28, '#263d32');
    rect(labelX - 82, bubbleY, 164, 2, '#8daf67');
    ctx.textAlign = 'center'; text(activity, labelX, bubbleY + 18, '#dce8d0', 'bold 11px sans-serif');
    if (tool) text((person.activity.kind === 'recent-tool' ? 'Vừa: ' : '') + (tool.length > 20 ? tool.slice(0, 19) + '…' : tool), labelX, bubbleY + 33, '#afc4ac', '10px monospace');
    // Nameplate shadow and border
    const nameY = Math.min(558, py + 22);
    rect(labelX - 48, nameY - 12, 96, 17, '#15241b');
    rect(labelX - 47, nameY - 11, 94, 15, '#22382c');
    text(name, labelX, nameY, '#e4ecd4', 'bold 11px sans-serif');
    const age = `${person.life.label} · ${person.life.percent == null ? '? context' : Math.floor(person.life.percent) + '%'}`;
    text(age, labelX, Math.min(573, py + 38), '#b4cbaa', '10px sans-serif'); ctx.textAlign = 'left';
  });
  paintWeatherProphet(ctx, state.forecast, now, paused, reducedMotion, 'bubble');
}

export const WEATHER_INTERVAL = 5 * 60 * 1000;
export const FORECAST_INTERVAL = 20 * 60 * 1000;
export const FORECAST_CACHE_KEY = 'weather-forecast-v1';
export const FORECAST_ATTEMPT_KEY = 'weather-forecast-attempt-v1';
export const WEATHER_CACHE_KEY = 'weather-location-v2';
export const WEATHER_SETTINGS_KEY = 'weather-settings-v2';
export const WEATHER_SECRET_KEY = 'tomorrow-weather-api-key';
export const WEATHER_ATTEMPT_KEY = 'weather-last-attempt-v2';
export const DEFAULT_WEATHER_SETTINGS = { label: 'Quận 7 · TP.HCM', latitude: 10.7375, longitude: 106.7297 };
export function weatherSettings(value = {}) {
  value ||= {};
  const latitude = value.latitude ?? DEFAULT_WEATHER_SETTINGS.latitude;
  const longitude = value.longitude ?? DEFAULT_WEATHER_SETTINGS.longitude;
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) throw Error('Tọa độ không hợp lệ.');
  return { latitude, longitude, label: String(value.label || DEFAULT_WEATHER_SETTINGS.label).trim().slice(0, 80) };
}
export function openMeteoUrl(settings = DEFAULT_WEATHER_SETTINGS) {
  const location = weatherSettings(settings);
  return `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,is_day,precipitation,wind_speed_10m&timeformat=unixtime&timezone=Asia%2FHo_Chi_Minh&forecast_days=1`;
}
export const WEATHER_URL = openMeteoUrl();
export function weatherInterval(provider) { return WEATHER_INTERVAL; }
export function weatherIdentity(settings, provider) {
  return `${provider}:${settings.latitude}:${settings.longitude}`;
}
export function weatherCondition(code) {
  if (code === 0) return { kind: 'clear', label: 'Trời quang', icon: '☀' };
  if (code === 1 || code === 2) return { kind: 'partly', label: 'Ít mây', icon: '🌤' };
  if (code === 3) return { kind: 'cloudy', label: 'Nhiều mây', icon: '☁' };
  if ([45, 48].includes(code)) return { kind: 'fog', label: 'Sương mù', icon: '🌫' };
  if ([51, 53, 55, 56, 57].includes(code)) return { kind: 'rain', label: 'Mưa phùn', icon: '🌧' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { kind: 'rain', label: 'Mưa', icon: '🌧' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { kind: 'snow', label: 'Tuyết', icon: '❄' };
  if ([95, 96, 97, 99].includes(code)) return { kind: 'storm', label: 'Mưa dông', icon: '⛈' };
  return { kind: 'unknown', label: 'Chưa rõ thời tiết', icon: '◌' };
}
export function normalizeWeather(payload, fetchedAt = Date.now(), settings = DEFAULT_WEATHER_SETTINGS) {
  const current = payload?.current;
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  if (!current || !finite(current.time) || !finite(current.temperature_2m)
    || !Number.isInteger(current.weather_code) || ![0, 1].includes(current.is_day)
    || !finite(current.precipitation) || current.precipitation < 0
    || !finite(current.wind_speed_10m) || current.wind_speed_10m < 0
    || !finite(fetchedAt)) throw Error('Dữ liệu thời tiết không hợp lệ.');
  const observed = current.time * 1000;
  if (observed <= 0 || observed > fetchedAt + 5 * 60 * 1000) throw Error('Thời điểm thời tiết không hợp lệ.');
  const condition = weatherCondition(current.weather_code);
  return { ...condition, city: settings.label, locationKey: `${settings.latitude},${settings.longitude}`, provider: 'open-meteo', precipitationUnit: 'mm / 15 phút', code: current.weather_code, isDay: current.is_day === 1,
    temperature: current.temperature_2m, precipitation: current.precipitation,
    wind: current.wind_speed_10m, observedAt: new Date(observed).toISOString(), fetchedAt };
}
export function restoreWeather(cache, now = Date.now(), settings = DEFAULT_WEATHER_SETTINGS, provider = 'open-meteo') {
  try {
    if (!cache || cache.fetchedAt > now || now - cache.fetchedAt > 24 * 60 * 60 * 1000) return null;
    if (cache.identity !== weatherIdentity(settings, provider)) return null;
    return provider === 'tomorrow' ? normalizeTomorrow(cache.payload, cache.fetchedAt, settings) : normalizeWeather(cache.payload, cache.fetchedAt, settings);
  } catch { return null; }
}
export function weatherIsStale(data, now = Date.now()) {
  return !data || now - data.fetchedAt > 30 * 60 * 1000 || now - Date.parse(data.observedAt) > 30 * 60 * 1000;
}
export class WeatherRequestError extends Error {
  constructor(message, retryAfter = 0) { super(message); this.name = 'WeatherRequestError'; this.retryAfter = retryAfter; }
}
export function safeWeatherError(error) {
  return error instanceof WeatherRequestError ? error.message : error?.name === 'AbortError' ? 'Hết thời gian kết nối thời tiết.' : 'Chưa kết nối được thời tiết.';
}
export async function fetchWeather(signal, fetcher = globalThis.fetch, settings = DEFAULT_WEATHER_SETTINGS, apiKey = '', forecast = false) {
  const location = weatherSettings(settings), provider = apiKey ? 'tomorrow' : 'open-meteo';
  if (forecast && !apiKey) throw new WeatherRequestError('Nhập API key Tomorrow.io để xem dự báo.');
  const url = apiKey ? new URL(`https://api.tomorrow.io/v4/weather/${forecast ? 'forecast' : 'realtime'}`) : new URL(openMeteoUrl(location));
  if (apiKey) { url.searchParams.set('location', `${location.latitude},${location.longitude}`); url.searchParams.set('units', 'metric'); url.searchParams.set('apikey', apiKey); }
  if (forecast) url.searchParams.set('timesteps', '1h');
  const response = await fetcher(url.toString(), { signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
  if (!response.ok) {
    if ([401, 403].includes(response.status)) throw new WeatherRequestError('API key bị từ chối. Kiểm tra key và quyền truy cập Tomorrow.io.', 60 * 60 * 1000);
    if (response.status === 429) {
      const retry = response.headers?.get('retry-after');
      const seconds = Number(retry);
      const wait = retry && Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retry) - Date.now();
      throw new WeatherRequestError('Đã chạm giới hạn API. Tự thử lại sau thời gian chờ.', Math.max(60 * 60 * 1000, Number.isFinite(wait) ? wait : 0));
    }
    throw new WeatherRequestError(`Chưa lấy được thời tiết (HTTP ${response.status}).`);
  }
  const payload = await response.json();
  const fetchedAt = Date.now();
  return { data: forecast ? normalizeForecast(payload, fetchedAt, location) : provider === 'tomorrow' ? normalizeTomorrow(payload, fetchedAt, location) : normalizeWeather(payload, fetchedAt, location), cache: { payload, fetchedAt, identity: weatherIdentity(location, provider) } };
}
export function fetchForecast(signal, fetcher = globalThis.fetch, settings = DEFAULT_WEATHER_SETTINGS, apiKey = '') {
  return fetchWeather(signal, fetcher, settings, apiKey, true);
}
export function normalizeForecast(payload, fetchedAt = Date.now(), settings = DEFAULT_WEATHER_SETTINGS) {
  const hourly = payload?.timelines?.hourly;
  if (!Array.isArray(hourly) || !hourly.length || !Number.isFinite(fetchedAt)) throw Error('Dữ liệu dự báo không hợp lệ.');
  const slots = new Map();
  for (const entry of hourly.slice(0, 168)) {
    const at = Date.parse(entry?.time), values = entry?.values;
    if (!Number.isFinite(at) || !Number.isInteger(values?.weatherCode) || !Number.isFinite(values?.temperature)) throw Error('Dữ liệu dự báo không hợp lệ.');
    if (at < fetchedAt - 3600000 || at > fetchedAt + 130 * 3600000) continue;
    const probability = values.precipitationProbability;
    slots.set(at, { ...tomorrowCondition(values.weatherCode), code: values.weatherCode,
      at: new Date(at).toISOString(), temperature: values.temperature,
      isDay: weatherIsDay(at, settings.latitude, settings.longitude),
      probability: typeof probability === 'number' && Number.isFinite(probability) && probability >= 0 && probability <= 100 ? probability : null });
  }
  const hours = [...slots.values()].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  if (!hours.some(slot => Date.parse(slot.at) > fetchedAt)) throw Error('Chưa có dự báo giờ tới.');
  return { hours, fetchedAt, provider: 'tomorrow', locationKey: `${settings.latitude},${settings.longitude}` };
}
export function selectNextForecast(data, now = Date.now()) {
  const next = data?.hours?.find(slot => Date.parse(slot.at) > now && Date.parse(slot.at) <= now + 2 * 3600000);
  return next ? { ...next, fetchedAt: data.fetchedAt, stale: now - data.fetchedAt > FORECAST_INTERVAL + 15 * 60000 } : null;
}
export function restoreForecast(cache, now = Date.now(), settings = DEFAULT_WEATHER_SETTINGS, provider = 'tomorrow') {
  try {
    if (provider !== 'tomorrow' || !cache || cache.fetchedAt > now || now - cache.fetchedAt > 24 * 3600000 || cache.identity !== weatherIdentity(settings, provider)) return null;
    const data = normalizeForecast(cache.payload, cache.fetchedAt, settings);
    return selectNextForecast(data, now) ? data : null;
  } catch { return null; }
}
export function tomorrowCondition(code) {
  if (code === 1000) return weatherCondition(0);
  if ([1100, 1101].includes(code)) return weatherCondition(2);
  if ([1001, 1102].includes(code)) return weatherCondition(3);
  if ([2000, 2100].includes(code)) return weatherCondition(45);
  if ([4000, 6000].includes(code)) return weatherCondition(51);
  if ([4001, 4200, 4201, 6001, 6200, 6201].includes(code)) return weatherCondition(63);
  if ([5000, 5001, 5100, 5101, 7000, 7101, 7102].includes(code)) return weatherCondition(71);
  if (code === 8000) return weatherCondition(95);
  return weatherCondition(-1);
}
// Solar elevation for the requested place/time; realtime does not include is_day.
export function weatherIsDay(time, latitude, longitude) {
  const radians = Math.PI / 180, days = (time - Date.UTC(2000, 0, 1, 12)) / 86400000;
  const anomaly = (357.529 + .98560028 * days) * radians;
  const solarLongitude = (280.459 + .98564736 * days + 1.915 * Math.sin(anomaly) + .020 * Math.sin(2 * anomaly)) * radians;
  const obliquity = (23.439 - .00000036 * days) * radians;
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(solarLongitude));
  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(solarLongitude), Math.cos(solarLongitude));
  const hourAngle = (280.16 + 360.9856235 * days + longitude) * radians - rightAscension;
  const elevation = Math.asin(Math.sin(latitude * radians) * Math.sin(declination) + Math.cos(latitude * radians) * Math.cos(declination) * Math.cos(hourAngle));
  return elevation > -.833 * radians;
}
export function normalizeTomorrow(payload, fetchedAt = Date.now(), settings = DEFAULT_WEATHER_SETTINGS) {
  const values = payload?.data?.values, observed = Date.parse(payload?.data?.time);
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  if (!values || !finite(values.temperature) || !Number.isInteger(values.weatherCode)
    || !finite(values.windSpeed) || values.windSpeed < 0 || !finite(values.rainIntensity) || values.rainIntensity < 0
    || !finite(fetchedAt) || !Number.isFinite(observed) || observed <= 0 || observed > fetchedAt + 300000) throw Error('Dữ liệu thời tiết không hợp lệ.');
  return { ...tomorrowCondition(values.weatherCode), city: settings.label, locationKey: `${settings.latitude},${settings.longitude}`, provider: 'tomorrow', code: values.weatherCode,
    isDay: weatherIsDay(observed, settings.latitude, settings.longitude), temperature: values.temperature,
    precipitation: values.rainIntensity, precipitationUnit: 'mm/h', wind: values.windSpeed * 3.6,
    observedAt: new Date(observed).toISOString(), fetchedAt };
}
export function previewWeather(kind, actual) {
  if (kind === 'auto') return actual;
  const night = kind === 'night';
  return { ...weatherCondition({ clear: 0, cloudy: 3, rain: 63, storm: 95, fog: 45, snow: 71, night: 0 }[kind]),
    isDay: !night, wind: kind === 'storm' ? 22 : 8, precipitation: kind === 'rain' ? 2 : kind === 'storm' ? 8 : 0, precipitationUnit: 'mm/h', preview: true };
}

// Synthesized locally: no audio file downloads or autoplay. Construct/resume
// only from the user's sound toggle, and stop sources when a scene is paused.
export function createThunderAudio(AudioContextClass) {
  if (!AudioContextClass) throw Error('Thiết bị chưa hỗ trợ âm thanh.');
  const context = new AudioContextClass();
  const sources = new Set();
  return {
    resume: () => context.resume(),
    stop() { for (const source of sources) { source.stop(); } sources.clear(); },
    async suspend() { this.stop(); await context.suspend(); },
    async close() { this.stop(); await context.close(); },
    play(power = 1) {
      if (context.state !== 'running') return false;
      const strength = Number.isFinite(power) ? Math.max(.4, Math.min(1, power)) : 1;
      const duration = 3.7, buffer = context.createBuffer(1, Math.floor(context.sampleRate * duration), context.sampleRate);
      const samples = buffer.getChannelData(0);
      let brown = 0;
      for (let i = 0; i < samples.length; i++) {
        const noise = Math.random() * 2 - 1, time = i / context.sampleRate;
        brown = (brown + noise * .08) / 1.08;
        // Sharp crack followed by a low, rolling rumble, kept below clipping.
        samples[i] = Math.max(-1, Math.min(1, brown * 2.4 + noise * .6 * Math.max(0, 1 - time / .16)));
      }
      const source = context.createBufferSource(); source.buffer = buffer;
      const filter = context.createBiquadFilter(); filter.type = 'lowpass';
      const gain = context.createGain(), at = context.currentTime;
      filter.frequency.setValueAtTime(1800, at); filter.frequency.exponentialRampToValueAtTime(180, at + .5);
      gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(.38 * strength, at + .018);
      gain.gain.linearRampToValueAtTime(.14 * strength, at + .18);
      gain.gain.linearRampToValueAtTime(.29 * strength, at + .5);
      gain.gain.linearRampToValueAtTime(.12 * strength, at + 1.1);
      gain.gain.linearRampToValueAtTime(.2 * strength, at + 1.55);
      gain.gain.exponentialRampToValueAtTime(.001, at + duration);
      source.connect(filter); filter.connect(gain); gain.connect(context.destination);
      sources.add(source);
      source.onended = () => { sources.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
      source.start(); source.stop(at + duration);
      return true;
    },
  };
}

export const SCENE_WIDTH = 960;
export const SCENE_HEIGHT = 576;
export const MAX_SCENE_PIXELS = 4000000;
export function sceneResolution(displayWidth, pixelRatio = 1) {
  const width = Number.isFinite(displayWidth) && displayWidth > 0 ? displayWidth : SCENE_WIDTH;
  const density = Number.isFinite(pixelRatio) && pixelRatio > 0 ? Math.min(pixelRatio, 2) : 1;
  const scale = Math.min(width * density / SCENE_WIDTH, Math.sqrt(MAX_SCENE_PIXELS / (SCENE_WIDTH * SCENE_HEIGHT)));
  const bitmapWidth = Math.max(1, Math.floor(SCENE_WIDTH * scale));
  const bitmapHeight = Math.max(1, Math.floor(SCENE_HEIGHT * scale));
  return { width: bitmapWidth, height: bitmapHeight, scaleX: bitmapWidth / SCENE_WIDTH, scaleY: bitmapHeight / SCENE_HEIGHT };
}
export function resizeSceneCanvas(canvas, displayWidth, pixelRatio) {
  const resolution = sceneResolution(displayWidth, pixelRatio);
  if (canvas.width !== resolution.width) canvas.width = resolution.width;
  if (canvas.height !== resolution.height) canvas.height = resolution.height;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(resolution.scaleX, 0, 0, resolution.scaleY, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return resolution;
}
export function scenePoint(clientX, clientY, bounds) {
  if (!(bounds.width > 0 && bounds.height > 0)) return null;
  return { x: (clientX - bounds.left) * SCENE_WIDTH / bounds.width, y: (clientY - bounds.top) * SCENE_HEIGHT / bounds.height };
}
