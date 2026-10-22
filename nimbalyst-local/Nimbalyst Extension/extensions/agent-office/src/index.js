import { createElement as h, useEffect, useRef, useState } from 'react';
import { readWorkspaceSessions, sessionsInScene, mapSessionStatus, sessionTitle, providerLabel, openRealSession, readSessionActivity, attachActivities, sessionRelations } from './sessions.js';
import { readOfficeEvents, normalizeOfficeEvents, mergeOfficeEvents, communicationRelations } from './events.js';
import { LIFE_STAGES, LABORS, contextPercentText, decorateCharacter, arrangeCharacters, characterHit, characterPixels, characterDestination, paintLandscape, stormMoment, createWeatherSceneState, advanceWeatherScene, rainIntensityPerHour } from './characters.js';
import { WEATHER_CACHE_KEY, WEATHER_SETTINGS_KEY, WEATHER_SECRET_KEY, WEATHER_ATTEMPT_KEY, FORECAST_CACHE_KEY, FORECAST_ATTEMPT_KEY, FORECAST_INTERVAL, DEFAULT_WEATHER_SETTINGS, weatherSettings, weatherInterval, restoreWeather, restoreForecast, selectNextForecast, weatherIsStale, fetchWeather, fetchForecast, safeWeatherError, previewWeather, createThunderAudio } from './weather.js';
import { SCENE_WIDTH, SCENE_HEIGHT, resizeSceneCanvas, scenePoint } from './rendering.js';

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
