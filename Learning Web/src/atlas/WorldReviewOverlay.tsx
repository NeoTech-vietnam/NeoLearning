import { useMemo, useRef } from "react";
import type { ContentNode } from "../shared";
import maskSource from "../../assets/maps/embedded-world-country-mask.svg?raw";
import { countryReviewLayout, reviewPolygonPath, type ReviewRegionPosition } from "./world-review-layout";
import type { ReviewParent, ReviewRegion, WorldReview } from "./world-review";

export interface ReviewInspection {
  path: string;
  touchPreview: boolean;
}

interface MarkerGroup {
  x: number;
  y: number;
  parents: ReviewParent[];
}

function parentGroups(parents: ReviewParent[], positions: Map<string, ReviewRegionPosition>): MarkerGroup[] {
  const groups = new Map<string, MarkerGroup>();
  for (const parent of parents) {
    const path = parent.node.relativePath;
    if (!path) continue;
    let candidate = path;
    let position: ReviewRegionPosition | undefined;
    while (candidate && !position) {
      position = positions.get(candidate);
      const lastSlash = candidate.lastIndexOf("/");
      candidate = lastSlash < 0 ? "" : candidate.slice(0, lastSlash);
    }
    if (!position) {
      const descendants = [...positions.values()].filter((region) =>
        region.depth === 1 && region.path.startsWith(path + "/"));
      if (descendants.length === 0) continue;
      const center = {
        x: descendants.reduce((sum, region) => sum + region.anchor.x, 0) / descendants.length,
        y: descendants.reduce((sum, region) => sum + region.anchor.y, 0) / descendants.length
      };
      position = descendants.reduce((nearest, region) =>
        (region.anchor.x - center.x) ** 2 + (region.anchor.y - center.y) ** 2 <
        (nearest.anchor.x - center.x) ** 2 + (nearest.anchor.y - center.y) ** 2 ? region : nearest);
    }
    const { x, y } = position.anchor;
    const key = parent.countryPath + ":" + Math.round(x / 120) + ":" + Math.round(y / 120);
    const group = groups.get(key);
    if (group) group.parents.push(parent);
    else groups.set(key, { x, y, parents: [parent] });
  }
  return [...groups.values()];
}

function fillOpacity(region?: ReviewRegion): number {
  if (!region || region.state === "unvisited") return .2;
  if (region.state === "completed") return .9;
  return .25 + .6 * region.counts.visited / Math.max(1, region.counts.total);
}

export function WorldReviewOverlay({ review, countries, onSelect, inspection, onInspect }: {
  review: WorldReview;
  countries: ContentNode[];
  onSelect: (node: ContentNode) => void;
  inspection?: ReviewInspection;
  onInspect: (inspection?: ReviewInspection) => void;
}) {
  const activePath = inspection?.path;
  const pointerType = useRef<string>();
  const layouts = useMemo(() => countries.map((country, index) =>
    countryReviewLayout(country, index, maskSource)), [countries]);
  const regions = new Map(review.regions.map((region) => [region.node.relativePath, region]));
  const positions = new Map(layouts.flatMap((layout) =>
    layout.regions.map((region) => [region.path, region] as const)));
  const markers = parentGroups(review.parents, positions);
  const activePosition = activePath ? positions.get(activePath) : undefined;
  const regionPath = (position: ReviewRegionPosition, boundary = false, interactive = true) => {
    const region = regions.get(position.path);
    const highlighted = activePath === position.path || boundary && activePosition?.parentPath === position.path;
    return <path
      className={"world-map__review-region world-map__review-region--level" + position.depth + (boundary ? " world-map__review-boundary" : "")}
      d={reviewPolygonPath(position.polygon)}
      data-review-path={boundary ? undefined : position.path}
      data-review-state={boundary ? undefined : region?.state}
      data-review-level={boundary ? undefined : position.depth}
      data-review-active={highlighted || undefined}
      data-review-interactive={!boundary && interactive || undefined}
      key={position.path + (boundary ? "-boundary" : "")}
      role={!boundary && interactive ? "button" : undefined}
      tabIndex={!boundary && interactive ? 0 : undefined}
      aria-label={!boundary && interactive && region ? `${region.node.title}, ${region.counts.visited} of ${region.counts.total} terminal folders visited or completed, ${region.counts.completed} completed. Open region.` : undefined}
      aria-hidden={boundary || !interactive ? true : undefined}
      onPointerEnter={!boundary && interactive ? (event) => {
        if (event.pointerType !== "touch") {
          onInspect({ path: position.path, touchPreview: false });
        }
      } : undefined}
      onPointerLeave={!boundary && interactive ? (event) => {
        if (event.pointerType !== "touch" && document.activeElement !== event.currentTarget && activePath === position.path) {
          onInspect();
        }
      } : undefined}
      onPointerDown={!boundary && interactive ? (event) => { pointerType.current = event.pointerType; } : undefined}
      onFocus={!boundary && interactive ? () => onInspect({ path: position.path, touchPreview: false }) : undefined}
      onBlur={!boundary && interactive ? (event) => {
        if (!event.currentTarget.matches(":hover") && activePath === position.path) onInspect();
      } : undefined}
      onClick={!boundary && interactive && region ? () => {
        if (pointerType.current === "touch" && !(activePath === position.path && inspection?.touchPreview)) {
          onInspect({ path: position.path, touchPreview: true });
        } else {
          onSelect(region.node);
        }
        pointerType.current = undefined;
      } : undefined}
      onKeyDown={!boundary && interactive && region ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(region.node);
        }
      } : undefined}
      style={boundary ? undefined : { fillOpacity: highlighted ? 1 : fillOpacity(region) }}
    />;
  };
  const progressMark = (position: ReviewRegionPosition) => {
    const region = regions.get(position.path);
    if (!region || (region.counts.completed === 0 && region.state !== "visited")) return null;
    const { x, y } = position.anchor;
    if (region.state !== "completed" && region.counts.completed > 0) {
      return <circle className="world-map__review-partial-mark" cx={x} cy={y} key={position.path + "-partial"} r={11} />;
    }
    if (region.state === "visited") {
      return <path className="world-map__review-visited-mark" d={"M " + (x - 10) + "," + (y + 10) + " L " + (x + 10) + "," + (y - 10)} key={position.path + "-visited"} />;
    }
    return null;
  };
  return <>
    <svg aria-label="World Review territories" className="world-map__review-overlay" role="group" viewBox="0 0 3840 2160">
      <defs>{layouts.map((layout, index) => <clipPath id={"review-country-" + index} key={index}>
        <path d={layout.mask.d} transform={layout.mask.transform} />
      </clipPath>)}</defs>
      {layouts.map((layout, index) => {
        const firstLevel = layout.regions.filter((position) => position.depth === 1);
        return <g clipPath={"url(#review-country-" + index + ")"} key={countries[index].id}>
          {firstLevel.map((first) => {
            const secondLevel = layout.regions.filter((position) => position.depth === 2 && position.parentPath === first.path);
            return <g key={first.path}>
              {regionPath(first, false, secondLevel.length === 0)}
              {secondLevel.map((second) => regionPath(second))}
              {secondLevel.length ? secondLevel.map(progressMark) : progressMark(first)}
              {regionPath(first, true)}
            </g>;
          })}
          <path className="world-map__review-coast" d={layout.mask.d} transform={layout.mask.transform} />
        </g>;
      })}
    </svg>
    {markers.map((group) => {
      const names = group.parents.map((parent) => parent.node.title).join(", ");
      return <button
        aria-label={group.parents.length === 1 ? "Completed parent milestone: " + names : group.parents.length + " completed parent milestones: " + names + ". See the parent list"}
        className="world-map__review-parent"
        key={group.parents.map((parent) => parent.node.id).join("|")}
        onClick={() => {
          if (group.parents.length === 1) onSelect(group.parents[0].node);
          else {
            const list = document.getElementById("world-review-parents");
            list?.focus({ preventScroll: true });
            list?.scrollIntoView({ behavior: "auto" });
          }
        }}
        style={{ left: group.x / 3840 * 100 + "%", top: group.y / 2160 * 100 + "%" }}
        type="button"
      >{group.parents.length > 1 ? group.parents.length : "✦"}</button>;
    })}
  </>;
}
