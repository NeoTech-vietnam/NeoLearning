import type { ContentNode } from "../shared";

export interface MapPoint {
  x: number;
  y: number;
}

export interface TerritoryPosition extends MapPoint {
  path?: string;
  polygon: MapPoint[];
  areaSamples?: number;
  compactLabel?: boolean;
}

export interface TerritoryLayout {
  outline: MapPoint[];
  territories: TerritoryPosition[];
  rows: number;
}

function seededRandom(seed: string): () => number {
  let state = 2166136261;
  for (const character of seed) state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function convexHull(points: MapPoint[]): MapPoint[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (a: MapPoint, b: MapPoint, c: MapPoint) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const lower: MapPoint[] = [];
  for (const point of sorted) {
    while (lower.length > 1 && cross(lower.at(-2)!, lower.at(-1)!, point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper: MapPoint[] = [];
  for (const point of sorted.reverse()) {
    while (upper.length > 1 && cross(upper.at(-2)!, upper.at(-1)!, point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function clipToNearest(polygon: MapPoint[], site: MapPoint, other: MapPoint, siteWeight = 0, otherWeight = 0): MapPoint[] {
  const dx = other.x - site.x;
  const dy = other.y - site.y;
  const midpoint = { x: (site.x + other.x) / 2, y: (site.y + other.y) / 2 };
  const distance = (point: MapPoint) => (point.x - midpoint.x) * dx + (point.y - midpoint.y) * dy - (siteWeight - otherWeight) / 2;
  const clipped: MapPoint[] = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    const startDistance = distance(start);
    const endDistance = distance(end);
    if (startDistance <= 0) clipped.push(start);
    if ((startDistance < 0 && endDistance > 0) || (startDistance > 0 && endDistance < 0)) {
      const ratio = startDistance / (startDistance - endDistance);
      clipped.push({ x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio });
    }
  }
  return clipped;
}

function polygonCenter(polygon: MapPoint[]): MapPoint {
  let area = 0;
  let x = 0;
  let y = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    const cross = start.x * end.y - end.x * start.y;
    area += cross;
    x += (start.x + end.x) * cross;
    y += (start.y + end.y) * cross;
  }
  return { x: x / (3 * area), y: y / (3 * area) };
}

// The same seeded outline is clipped into every cell, so neighboring territories share borders.
export function territoryLayout(children: ContentNode[], seed: string): TerritoryLayout {
  if (children.length === 0) return { outline: [], territories: [], rows: 0 };
  const random = seededRandom(seed);
  const coast = [
    [6, 32], [13, 20], [30, 16], [48, 14], [69, 16], [86, 19], [96, 32],
    [95, 55], [91, 73], [77, 86], [58, 91], [38, 89], [20, 91], [8, 77], [4, 55]
  ];
  const outline = convexHull(coast.map(([x, y]) => ({ x: x + (random() - 0.5) * 4, y: y + (random() - 0.5) * 4 })));
  const columns = Math.min(4, Math.ceil(Math.sqrt(children.length * 0.9)));
  const rows = Math.ceil(children.length / columns);
  const sites = children.map((_, index) => ({
    x: 10 + (index % columns + 0.5) * 80 / columns + (random() - 0.5) * 8,
    y: 22 + (Math.floor(index / columns) + 0.5) * 63 / rows + (random() - 0.5) * 7
  }));
  const territories = children.map((child, index) => {
    const polygon = sites.reduce<MapPoint[]>((cell, other, otherIndex) =>
      otherIndex === index ? cell : clipToNearest(cell, sites[index], other), outline);
    return { path: child.relativePath, ...polygonCenter(polygon), polygon };
  });
  return { outline, territories, rows };
}
function pointInPolygon(polygon: MapPoint[], point: MapPoint): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index];
    const b = polygon[previous];
    if ((a.y > point.y) !== (b.y > point.y) &&
        point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

const lessonCounts = new WeakMap<ContentNode, number>();
function lessonCount(node: ContentNode): number {
  const cached = lessonCounts.get(node);
  if (cached !== undefined) return cached;
  const count = (node.kind === "lesson" ? 1 : 0) +
    node.children.reduce((sum, child) => sum + lessonCount(child), 0);
  lessonCounts.set(node, count);
  return count;
}

// Parse the authored mask once for both local and world-coordinate layouts.
export interface CountryMaskGeometry {
  d: string;
  transform: string;
  offsetX: number;
  offsetY: number;
  scale: number;
  worldPoints: MapPoint[];
}

export function countryMaskGeometry(source: string, countryId: string): CountryMaskGeometry {
  const tag = source.match(new RegExp('<path\\b[^>]*\\bid="' + countryId + '"[^>]*\\/>'))?.[0];
  const d = tag?.match(/\sd="([^"]+)"/)?.[1];
  const transform = tag?.match(/transform="(translate\((-?[\d.]+) (-?[\d.]+)\) scale\(([\d.]+)\))"/);
  if (!d || !transform) throw new Error("Country mask is missing or uses an unsupported transform: " + countryId);
  const offsetX = Number(transform[2]);
  const offsetY = Number(transform[3]);
  const scale = Number(transform[4]);
  const worldPoints = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)]
    .map((match) => ({ x: Number(match[1]) * scale + offsetX, y: Number(match[2]) * scale + offsetY }));
  if (worldPoints.length < 3) throw new Error("Country mask has no polygon: " + countryId);
  return { d, transform: transform[1], offsetX, offsetY, scale, worldPoints };
}

// The browser and tests read the same authored country mask; no traced duplicate of its coast.
export function countryOutlineFromMask(source: string, countryId: string): MapPoint[] {
  const worldPoints = countryMaskGeometry(source, countryId).worldPoints;
  const minX = Math.min(...worldPoints.map((point) => point.x));
  const maxX = Math.max(...worldPoints.map((point) => point.x));
  const minY = Math.min(...worldPoints.map((point) => point.y));
  const maxY = Math.max(...worldPoints.map((point) => point.y));
  // The map viewport is 16:9; one world unit must have the same on-screen scale on both axes.
  const scaleToViewport = Math.min(76 * 16 / 9 / (maxX - minX), 84 / (maxY - minY));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  return worldPoints.map((point) => ({
    x: 50 + (point.x - centerX) * scaleToViewport * 9 / 16,
    y: 52 + (point.y - centerY) * scaleToViewport
  }));
}

// Power cells are clipped visually to the exact (possibly concave) mask by SVG.
export function territoryLayoutInCountry(children: ContentNode[], seed: string, outline: MapPoint[]): TerritoryLayout {
  if (children.length === 0) return { outline, territories: [], rows: 0 };
  const random = seededRandom(seed);
  const columns = Math.min(4, Math.ceil(Math.sqrt(children.length * 0.9)));
  const rows = Math.ceil(children.length / columns);
  const samples: MapPoint[] = [];
  for (let x = 12.5; x <= 88; x += 1.4) {
    for (let y = 10.5; y <= 94; y += 1.4) {
      const point = { x, y };
      if (pointInPolygon(outline, point)) samples.push(point);
    }
  }
  const minX = Math.min(...outline.map((point) => point.x));
  const maxX = Math.max(...outline.map((point) => point.x));
  const minY = Math.min(...outline.map((point) => point.y));
  const maxY = Math.max(...outline.map((point) => point.y));
  const width = maxX - minX;
  const height = maxY - minY;
  const sites: MapPoint[] = [];
  const minimumSpacing = Math.min(width / columns, height / rows) * .35;
  for (let index = 0; index < children.length; index += 1) {
    const target = {
      x: minX + (index % columns + 0.5) * width / columns + (random() - 0.5) * Math.min(4, width / columns * .3),
      y: minY + (Math.floor(index / columns) + 0.5) * height / rows + (random() - 0.5) * Math.min(4, height / rows * .3)
    };
    const chooseNearest = (spacing: number) => samples.reduce<MapPoint | undefined>((nearest, sample) => {
      if (sites.some((site) => (site.x - sample.x) ** 2 + (site.y - sample.y) ** 2 < spacing ** 2)) return nearest;
      return !nearest || (sample.x - target.x) ** 2 + (sample.y - target.y) ** 2 <
        (nearest.x - target.x) ** 2 + (nearest.y - target.y) ** 2 ? sample : nearest;
    }, undefined);
    sites.push(chooseNearest(minimumSpacing) ?? chooseNearest(.01) ?? samples[0]);
  }
  const counts = children.map(lessonCount);
  // A floor keeps tiny topics visible; sqrt prevents one large folder owning the map.
  const sizes = counts.map((count) => Math.sqrt(Math.max(1, count)));
  const sizeTotal = sizes.reduce((sum, size) => sum + size, 0);
  const targets = sizes.map((size) =>
    samples.length * (0.35 / children.length + 0.65 * size / sizeTotal));
  const weights = children.map(() => 0);
  const bounds = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
  // Site distances never change during balancing; only the power weights do.
  const distances = samples.map((point) => sites.map((site) =>
    (point.x - site.x) ** 2 + (point.y - site.y) ** 2));
  const assignCounts = () => {
    const buckets = children.map(() => 0);
    for (const row of distances) {
      let winner = 0;
      let best = Infinity;
      for (let index = 0; index < sites.length; index += 1) {
        const score = row[index] - weights[index];
        if (score < best) { best = score; winner = index; }
      }
      buckets[winner] += 1;
    }
    return buckets;
  };
  let assignedCounts = assignCounts();
  for (let iteration = 0; iteration < 80; iteration += 1) {
    if (targets.every((target, index) => Math.abs(target - assignedCounts[index]) < 3)) break;
    for (let index = 0; index < weights.length; index += 1) {
      weights[index] += 0.45 * (targets[index] - assignedCounts[index]);
    }
    assignedCounts = assignCounts();
  }
  const assigned = children.map(() => [] as MapPoint[]);
  distances.forEach((row, sampleIndex) => {
    let winner = 0;
    let best = Infinity;
    for (let index = 0; index < sites.length; index += 1) {
      const score = row[index] - weights[index];
      if (score < best) { best = score; winner = index; }
    }
    assigned[winner].push(samples[sampleIndex]);
  });
  const territories = children.map((child, index) => {
    const polygon = sites.reduce<MapPoint[]>((cell, other, otherIndex) =>
      otherIndex === index ? cell : clipToNearest(cell, sites[index], other, weights[index], weights[otherIndex]), bounds);
    const points = assigned[index];
    const center = points.length ? {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length
    } : sites[index];
    const anchor = points.reduce((nearest, point) =>
      (point.x - center.x) ** 2 + (point.y - center.y) ** 2 <
      (nearest.x - center.x) ** 2 + (nearest.y - center.y) ** 2 ? point : nearest, points[0] ?? sites[index]);
    const spanX = points.length ? Math.max(...points.map((point) => point.x)) - Math.min(...points.map((point) => point.x)) : 0;
    const spanY = points.length ? Math.max(...points.map((point) => point.y)) - Math.min(...points.map((point) => point.y)) : 0;
    return { path: child.relativePath, ...anchor, polygon, areaSamples: points.length,
      compactLabel: children.length > 1 && (spanX < 17 || spanY < 9 || points.length < 48) };
  });
  return { outline, territories, rows };
}
export function clipOutlineToCell(outline: MapPoint[], cell: MapPoint[]): MapPoint[] {
  if (outline.length < 3 || cell.length < 3) return [];
  const signedArea = cell.reduce((area, point, index) => {
    const next = cell[(index + 1) % cell.length];
    return area + point.x * next.y - next.x * point.y;
  }, 0);
  const direction = Math.sign(signedArea);
  if (direction === 0) return [];
  let clipped = outline;
  for (let index = 0; index < cell.length && clipped.length > 0; index += 1) {
    const a = cell[index];
    const b = cell[(index + 1) % cell.length];
    const side = (point: MapPoint) =>
      direction * ((b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x));
    const next: MapPoint[] = [];
    for (let vertex = 0; vertex < clipped.length; vertex += 1) {
      const start = clipped[vertex];
      const end = clipped[(vertex + 1) % clipped.length];
      const startSide = side(start);
      const endSide = side(end);
      if (startSide >= -1e-7) next.push(start);
      if ((startSide < 0 && endSide > 0) || (startSide > 0 && endSide < 0)) {
        const ratio = startSide / (startSide - endSide);
        next.push({ x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio });
      }
    }
    clipped = next;
  }
  return clipped.filter((point, index) => {
    const previous = clipped[(index + clipped.length - 1) % clipped.length];
    return Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y) > 1e-7;
  });
}

function zoomOutline(outline: MapPoint[]): MapPoint[] {
  const minX = Math.min(...outline.map((point) => point.x));
  const maxX = Math.max(...outline.map((point) => point.x));
  const minY = Math.min(...outline.map((point) => point.y));
  const maxY = Math.max(...outline.map((point) => point.y));
  const scale = Math.min(76 / Math.max(maxX - minX, 1e-6), 84 / Math.max(maxY - minY, 1e-6));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  return outline.map((point) => ({
    x: 50 + (point.x - centerX) * scale,
    y: 52 + (point.y - centerY) * scale
  }));
}

// Each outline identity owns its own hierarchy cache; a refreshed content tree has new node identities.
const focusedLayouts = new WeakMap<MapPoint[], WeakMap<ContentNode, TerritoryLayout>>();
export function territoryLayoutAtFocus(country: ContentNode, focus: ContentNode, countryOutline: MapPoint[]): TerritoryLayout {
  let layouts = focusedLayouts.get(countryOutline);
  if (!layouts) {
    layouts = new WeakMap<ContentNode, TerritoryLayout>();
    focusedLayouts.set(countryOutline, layouts);
  }
  const cachedFocus = layouts.get(focus);
  if (cachedFocus) return cachedFocus;
  const trailTo = (node: ContentNode): ContentNode[] | undefined => {
    if (node.id === focus.id) return [node];
    for (const child of node.children) {
      const tail = trailTo(child);
      if (tail) return [node, ...tail];
    }
    return undefined;
  };
  const trail = trailTo(country);
  if (!trail) throw new Error("Atlas focus is outside the selected country: " + focus.id);
  let outline = countryOutline;
  for (let index = 0; index < trail.length - 1; index += 1) {
    const current = trail[index];
    const childIndex = current.children.findIndex((child) => child.id === trail[index + 1].id);
    const layout = layouts.get(current) ?? territoryLayoutInCountry(current.children, current.relativePath ?? current.id, outline);
    layouts.set(current, layout);
    const inherited = clipOutlineToCell(outline, layout.territories[childIndex].polygon);
    if (inherited.length < 3) throw new Error("Atlas territory has no visible land: " + trail[index + 1].id);
    outline = zoomOutline(inherited);
  }
  const layout = territoryLayoutInCountry(focus.children, focus.relativePath ?? focus.id, outline);
  layouts.set(focus, layout);
  return layout;
}
