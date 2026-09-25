import type { ContentNode } from "../shared";
import {
  clipOutlineToCell,
  countryMaskGeometry,
  countryOutlineFromMask,
  territoryLayoutInCountry,
  type MapPoint
} from "./territory-layout";

export interface ReviewRegionPosition {
  path: string;
  parentPath: string;
  depth: 1 | 2 | 3;
  polygon: MapPoint[];
  anchor: MapPoint;
}

export interface CountryReviewLayout {
  mask: { d: string; transform: string };
  regions: ReviewRegionPosition[];
}

export function reviewPolygonPath(points: MapPoint[]): string {
  return "M " + points.map((point) => point.x + "," + point.y).join(" L ") + " Z";
}

function insidePolygon(polygon: MapPoint[], point: MapPoint): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index];
    const b = polygon[previous];
    if ((a.y > point.y) !== (b.y > point.y) &&
        point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** Place markers on the visible coast-clipped portion, not the hidden power cell. */
function visibleAnchor(preferred: MapPoint, cell: MapPoint[], coast: MapPoint[]): MapPoint {
  if (insidePolygon(cell, preferred) && insidePolygon(coast, preferred)) return preferred;
  const visible = clipOutlineToCell(coast, cell);
  if (visible.length < 3) return preferred;
  const minX = Math.min(...visible.map((point) => point.x));
  const maxX = Math.max(...visible.map((point) => point.x));
  const minY = Math.min(...visible.map((point) => point.y));
  const maxY = Math.max(...visible.map((point) => point.y));
  let nearest: MapPoint | undefined;
  let distance = Infinity;
  for (let x = 0; x < 28; x += 1) {
    for (let y = 0; y < 28; y += 1) {
      const point = { x: minX + (x + .5) * (maxX - minX) / 28, y: minY + (y + .5) * (maxY - minY) / 28 };
      if (!insidePolygon(cell, point) || !insidePolygon(coast, point)) continue;
      const nextDistance = (point.x - preferred.x) ** 2 + (point.y - preferred.y) ** 2;
      if (nextDistance < distance) { nearest = point; distance = nextDistance; }
    }
  }
  return nearest ?? preferred;
}

/** Preserve the same authored coast and seeded subdivisions used by the zoomed Atlas. */
export function countryReviewLayout(country: ContentNode, countryIndex: number, maskSource: string): CountryReviewLayout {
  const countryId = "country-0" + (countryIndex + 1);
  const mask = countryMaskGeometry(maskSource, countryId);
  const outline = countryOutlineFromMask(maskSource, countryId);
  const minX = Math.min(...mask.worldPoints.map((point) => point.x));
  const maxX = Math.max(...mask.worldPoints.map((point) => point.x));
  const minY = Math.min(...mask.worldPoints.map((point) => point.y));
  const maxY = Math.max(...mask.worldPoints.map((point) => point.y));
  const scale = Math.min(76 * 16 / 9 / (maxX - minX), 84 / (maxY - minY));
  const toWorld = (point: MapPoint): MapPoint => ({
    x: (minX + maxX) / 2 + (point.x - 50) / (scale * 9 / 16),
    y: (minY + maxY) / 2 + (point.y - 52) / scale
  });
  const childFolders = country.children.filter((node) => node.kind !== "lesson");
  const firstLevel = childFolders.length ? childFolders : [country];
  const firstLayout = childFolders.length
    ? territoryLayoutInCountry(firstLevel, country.relativePath ?? country.id, outline)
    : { territories: [{ polygon: outline, x: 50, y: 52 }] };
  const regions: ReviewRegionPosition[] = [];
  firstLevel.forEach((first, firstIndex) => {
    const position = firstLayout.territories[firstIndex];
    const visibleFirst = childFolders.length ? clipOutlineToCell(outline, position.polygon) : outline;
    if (visibleFirst.length < 3 || !first.relativePath) return;
    regions.push({
      path: first.relativePath,
      parentPath: country.relativePath ?? "",
      depth: 1,
      // Keep the convex partition cell; the SVG country mask supplies the coastline.
      polygon: position.polygon.map(toWorld),
      anchor: toWorld({ x: position.x, y: position.y })
    });
    const secondLevel = first.children.filter((node) => node.kind !== "lesson");
    if (secondLevel.length === 0) return;
    const secondLayout = territoryLayoutInCountry(secondLevel, first.relativePath, visibleFirst);
    secondLevel.forEach((second, secondIndex) => {
      const childPosition = secondLayout.territories[secondIndex];
      const secondPolygon = clipOutlineToCell(position.polygon, childPosition.polygon);
      if (secondPolygon.length < 3 || !second.relativePath) return;
      regions.push({
        path: second.relativePath,
        parentPath: first.relativePath!,
        depth: 2,
        polygon: secondPolygon.map(toWorld),
        anchor: toWorld({ x: childPosition.x, y: childPosition.y })
      });
      const thirdLevel = second.children.filter((node) => node.kind !== "lesson");
      if (thirdLevel.length === 0) return;
      // Normalize narrow parent cells before sampling: the shared partitioner samples
      // a fixed 1.4-unit grid, which can miss a thin world-scale region entirely.
      const visibleSecond = clipOutlineToCell(outline, secondPolygon);
      if (visibleSecond.length < 3) return;
      const left = Math.min(...visibleSecond.map((point) => point.x));
      const right = Math.max(...visibleSecond.map((point) => point.x));
      const top = Math.min(...visibleSecond.map((point) => point.y));
      const bottom = Math.max(...visibleSecond.map((point) => point.y));
      if (right - left < 1e-6 || bottom - top < 1e-6) return;
      const normalize = (point: MapPoint): MapPoint => ({
        x: 10 + 80 * (point.x - left) / (right - left),
        y: 10 + 80 * (point.y - top) / (bottom - top)
      });
      const fromNormalized = (point: MapPoint): MapPoint => ({
        x: left + (point.x - 10) * (right - left) / 80,
        y: top + (point.y - 10) * (bottom - top) / 80
      });
      const thirdLayout = territoryLayoutInCountry(thirdLevel, second.relativePath, visibleSecond.map(normalize));
      thirdLevel.forEach((third, thirdIndex) => {
        const child = thirdLayout.territories[thirdIndex];
        const thirdPolygon = clipOutlineToCell(secondPolygon, child.polygon.map(fromNormalized));
        if (thirdPolygon.length < 3 || !third.relativePath) return;
        regions.push({
          path: third.relativePath,
          parentPath: second.relativePath!,
          depth: 3,
          polygon: thirdPolygon.map(toWorld),
          anchor: toWorld(visibleAnchor(fromNormalized({ x: child.x, y: child.y }), thirdPolygon, outline))
        });
      });
    });
  });
  return { mask: { d: mask.d, transform: mask.transform }, regions };
}
