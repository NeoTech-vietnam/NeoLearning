import { useState } from "react";
import type { ContentNode } from "../shared";
import { WorldMap } from "./WorldMap";
import "./world-map-preview.css";

const countries = [
  { id: "country-01", number: "01", name: "Hardware Kingdom", summary: "Materials, measurement, fabrication and physical systems." },
  { id: "country-02", number: "02", name: "Software Empire", summary: "Programming, operating systems, architecture and engineering practice." },
  { id: "country-03", number: "03", name: "Protocol Archipelago", summary: "Interfaces, networks and communication between systems." },
  { id: "country-04", number: "04", name: "Skills Guilds", summary: "Collaboration, communication and professional craft." },
  { id: "country-05", number: "05", name: "Advanced Frontier", summary: "Specialized topics, difficult terrain and future discoveries." },
  { id: "country-06", number: "06", name: "Product Realm", summary: "Capstones where knowledge becomes a working product." }
] as const;

const countryNodes: ContentNode[] = countries.map((country) => ({
  id: country.id,
  kind: "country",
  title: country.name,
  relativePath: country.id,
  headings: [],
  children: []
}));

export function WorldMapPreview() {
  const [selectedId, setSelectedId] = useState("country-02");
  const selected = countries.find((country) => country.id === selectedId) ?? countries[1];

  return (
    <main className="world-preview">
      <header className="world-preview__header">
        <p className="world-preview__eyebrow">Deterministic vector proof</p>
        <h1>Embedded World</h1>
        <p>One editable SVG, six shared country paths, and no runtime-generated geography.</p>
      </header>

      <WorldMap countries={countryNodes} onSelect={(country) => setSelectedId(country.id)} selectedPath={selectedId} />

      <aside aria-live="polite" className="world-preview__selection">
        <span>{selected.number}</span>
        <div><h2>{selected.name}</h2><p>{selected.summary}</p></div>
      </aside>
    </main>
  );
}
