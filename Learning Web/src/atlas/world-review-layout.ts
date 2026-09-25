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
  depth: 1 | 2;
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
    });
  });
  return { mask: { d: mask.d, transform: mask.transform }, regions };
}
