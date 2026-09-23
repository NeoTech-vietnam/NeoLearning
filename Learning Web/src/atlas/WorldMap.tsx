import type { ContentNode } from "../shared";
import type { QuestRouteStop } from "./model";
import anchors from "../../assets/maps/embedded-world-label-anchors.json";

const mapUrl = new URL("../../assets/maps/embedded-world-source.svg", import.meta.url).href;
const maskUrl = new URL("../../assets/maps/embedded-world-country-mask.svg", import.meta.url).href;

export interface WorldMapProps {
  countries: ContentNode[];
  selectedPath?: string;
  activePaths?: string[];
  routeStops?: QuestRouteStop[];
  onSelect: (country: ContentNode) => void;
}

export function WorldMap({ activePaths = [], countries, routeStops = [], selectedPath, onSelect }: WorldMapProps) {
  const routePoints = routeStops.flatMap((stop, index) => {
    const countryIndex = countries.findIndex((country) => country.relativePath === stop.countryPath);
    if (countryIndex < 0) return [];
    const mapId = `country-0${countryIndex + 1}` as keyof typeof anchors;
    const repeated = routeStops.slice(0, index).filter((previous) => previous.countryPath === stop.countryPath).length;
    const point = anchors[mapId].focus;
    return [{ stop, number: index + 1, x: point.x + ((repeated % 3) - 1) * 0.055, y: point.y + (Math.floor(repeated / 3) - 0.5) * 0.1 }];
  });
  const routeSegments: typeof routePoints[] = [];
  let segment: typeof routePoints = [];
  for (const point of routePoints) {
    const previous = segment.at(-1);
    if (previous && point.number !== previous.number + 1) {
      if (segment.length > 1) routeSegments.push(segment);
      segment = [];
    }
    segment.push(point);
  }
  if (segment.length > 1) routeSegments.push(segment);
  return (
    <section aria-label="Embedded World country map" className="world-map">
      <img alt="" className="world-map__art" src={mapUrl} />
      <svg aria-label="Select a country" className="world-map__hit-regions" role="group" viewBox="0 0 3840 2160">
        {countries.map((country, index) => {
          const mapId = `country-0${index + 1}` as keyof typeof anchors;
          return <use
            aria-label={`${String(index + 1).padStart(2, "0")} ${country.title}`}
            className="world-map__country"
            data-route={activePaths.some((path) => path === country.relativePath || path.startsWith(`${country.relativePath}/`))}
            data-selected={country.relativePath === selectedPath}
            href={`${maskUrl}#${mapId}`}
            key={country.id}
            onClick={() => onSelect(country)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(country);
              }
            }}
            role="button"
            tabIndex={0}
          />;
        })}
      </svg>
      {routeSegments.length > 0 && <svg aria-hidden="true" className="world-map__route-overlay" viewBox="0 0 3840 2160" preserveAspectRatio="none">
        {routeSegments.map((points, index) => <polyline className="world-map__quest-road" key={index} points={points.map((point) => `${point.x * 3840},${point.y * 2160}`).join(" ")} />)}
      </svg>}
      {countries.map((country, index) => {
        const mapId = `country-0${index + 1}` as keyof typeof anchors;
        const anchor = anchors[mapId];
        return <button
          aria-pressed={country.relativePath === selectedPath}
          className="world-map__label"
          data-route={activePaths.some((path) => path === country.relativePath || path.startsWith(`${country.relativePath}/`))}
          data-selected={country.relativePath === selectedPath}
          key={country.id}
          onClick={() => onSelect(country)}
          style={{ left: `${anchor.label.x * 100}%`, top: `${anchor.label.y * 100}%`, width: `${anchor.recommendedLabelWidth * 100}%` }}
          type="button"
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {country.title}
        </button>;
      })}
      {routePoints.map(({ number, stop, x, y }) => <button
        aria-label={`Quest stop ${number}: ${stop.node?.title ?? stop.relativePath}`}
        className="world-map__quest-marker"
        disabled={!stop.node}
        key={stop.key}
        onClick={() => stop.node && onSelect(stop.node)}
        style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        type="button"
      >{number}</button>)}
    </section>
  );
}
