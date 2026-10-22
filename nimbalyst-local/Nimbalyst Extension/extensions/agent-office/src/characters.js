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
