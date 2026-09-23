import type { ContentNode } from "../shared";
import anchors from "../../assets/maps/embedded-world-label-anchors.json";

const mapUrl = new URL("../../assets/maps/embedded-world-source.svg", import.meta.url).href;
const maskUrl = new URL("../../assets/maps/embedded-world-country-mask.svg", import.meta.url).href;

export interface WorldMapProps {
  countries: ContentNode[];
  selectedPath?: string;
  activePaths?: string[];
  onSelect: (country: ContentNode) => void;
}

export function WorldMap({ activePaths = [], countries, selectedPath, onSelect }: WorldMapProps) {
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
    </section>
  );
}
