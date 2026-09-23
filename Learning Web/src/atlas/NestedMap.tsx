import type { ContentNode } from "../shared";
import type { QuestRouteStop } from "./model";
import { questStopsAtFocus, territoryPositions } from "./model";
import anchors from "../../assets/maps/embedded-world-label-anchors.json";
import "./nested-map.css";

const mapUrl = new URL("../../assets/maps/embedded-world-source.svg", import.meta.url).href;

export interface NestedMapProps {
  country: ContentNode;
  countryIndex: number;
  focus: ContentNode;
  selectedPath?: string;
  routeStops?: QuestRouteStop[];
  onSelect: (node: ContentNode) => void;
}

export function NestedMap({ country, countryIndex, focus, selectedPath, routeStops = [], onSelect }: NestedMapProps) {
  const mapId = `country-0${countryIndex + 1}` as keyof typeof anchors;
  const focusPoint = anchors[mapId].focus;
  const positions = territoryPositions(focus.children);
  const positionByPath = new Map(positions.map((position) => [position.path, position]));
  const projectedStops = questStopsAtFocus(focus, routeStops);
  const localStops = projectedStops.flatMap((projection) => {
    const position = positionByPath.get(projection.territoryPath);
    return position ? [{ ...projection, position, number: routeStops.findIndex((stop) => stop.key === projection.stop.key) + 1 }] : [];
  });
  const localStopKeys = new Set(localStops.map(({ stop }) => stop.key));
  const outsideStops = routeStops.filter((stop) => stop.node && !localStopKeys.has(stop.key));
  const outsideCountries = [...new Set(outsideStops.flatMap((stop) => stop.trail
    .filter((entry) => entry.kind === "country" && entry.relativePath !== country.relativePath)
    .map((entry) => entry.title)))];
  const routeNote = outsideCountries.length > 0
    ? `Route also crosses ${outsideCountries.join(", ")}`
    : outsideStops.length > 0 ? "Quest continues beyond this territory" : undefined;
  const routeSegments: string[][] = [];
  let segment: string[] = [];
  let previousNumber = 0;
  for (const stop of localStops) {
    if (previousNumber > 0 && stop.number !== previousNumber + 1) {
      if (segment.length > 1) routeSegments.push(segment);
      segment = [];
    }
    segment.push(`${stop.position.x},${stop.position.y}`);
    previousNumber = stop.number;
  }
  if (segment.length > 1) routeSegments.push(segment);
  const routeByTerritory = new Map<string | undefined, number[]>();
  for (const stop of localStops) {
    const numbers = routeByTerritory.get(stop.territoryPath) ?? [];
    numbers.push(stop.number);
    routeByTerritory.set(stop.territoryPath, numbers);
  }
  const zoom = 3.6;
  const artStyle = {
    width: `${zoom * 100}%`,
    height: `${zoom * 100}%`,
    left: `${50 - focusPoint.x * zoom * 100}%`,
    top: `${50 - focusPoint.y * zoom * 100}%`
  };

  return <section aria-label={`${focus.title} territory map`} className="atlas-nested-map" data-country={country.relativePath} data-focus={focus.relativePath}>
    <div aria-hidden="true" className="atlas-nested-map__landscape">
      <img alt="" className="atlas-nested-map__art" src={mapUrl} style={artStyle} />
      <div className="atlas-nested-map__wash" />
    </div>
    <div aria-hidden="true" className="atlas-nested-map__caption">
      <span>{country.title}</span><small>Territories of {focus.title}</small>
    </div>
    {routeNote && <div aria-label="Quest route continues beyond this territory" className="atlas-nested-map__route-note">{routeNote}</div>}
    <svg aria-hidden="true" className="atlas-nested-map__roads" viewBox="0 0 100 100" preserveAspectRatio="none">
      {routeSegments.map((points, index) => <polyline key={index} points={points.join(" ")} />)}
    </svg>
    <div aria-label={`${focus.title} topics`} className="atlas-nested-map__territories" role="group">
      {focus.children.map((child, index) => {
        const position = positions[index];
        const markers = routeByTerritory.get(child.relativePath) ?? [];
        return <button
          aria-pressed={child.relativePath === selectedPath}
          className={`atlas-territory${child.unindexed ? " atlas-territory--uncharted" : ""}`}
          data-route={markers.length > 0}
          data-path={child.relativePath}
          key={child.id}
          onClick={() => onSelect(child)}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            width: `${position.width}%`,
            height: `${position.height}%`
          }}
          type="button"
        >
          <span className="atlas-territory__number">{String(index + 1).padStart(2, "0")}</span>
          <strong>{child.title}</strong>
          <small>{child.unindexed ? "Uncharted" : child.kind}</small>
          {markers.length > 0 && <span aria-hidden="true" className="atlas-territory__route-stops">{markers.map((number) => <i key={number}>{number}</i>)}</span>}
        </button>;
      })}
    </div>
    {focus.children.length === 0 && <p className="atlas-nested-map__empty">No mapped territories at this depth.</p>}
  </section>;
}
