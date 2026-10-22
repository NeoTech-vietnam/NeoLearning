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
