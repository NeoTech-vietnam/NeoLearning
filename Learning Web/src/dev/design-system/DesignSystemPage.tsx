import { useState } from "react";
import { Badge, Button, Card, EmptyState, ErrorState, IconButton, Landmark, Modal, Progress, Skeleton, Tooltip, type LandmarkState } from "../../ui";
import "../../app/styles/design-system.css";

const landmarkStates: LandmarkState[] = ["default", "selected", "visited", "active-quest", "completed", "locked", "unavailable"];

export function DesignSystemPage() {
  const [overlay, setOverlay] = useState<"modal" | "drawer" | null>(null);
  return <main className="design-system">
    <header className="design-system__hero"><p className="design-system__eyebrow">Development only · visual contract</p><h1>Cartographic foundations</h1><p>Semantic interface building blocks for the Embedded World. The real raster, masks, and label anchors remain external artwork deliverables.</p></header>

    <section aria-labelledby="ds-actions"><h2 id="ds-actions">Actions and information</h2><div className="design-system__grid"><Card><h3>Buttons</h3><div className="design-system__row"><Button>Continue route</Button><Button variant="secondary">Open map</Button><Button variant="danger">Discard draft</Button><Button disabled>Locked route</Button></div><div className="design-system__row"><IconButton label="Open navigation">☰</IconButton><Tooltip label="Keyboard and pointer discoverable"><Button variant="secondary">Tooltip</Button></Tooltip></div></Card><Card><h3>Badges and progress</h3><div className="design-system__row"><Badge>Default</Badge><Badge tone="accent">Active quest</Badge><Badge tone="muted">Visited</Badge></div><Progress label="Quest progress" value={62} /></Card></div></section>

    <section aria-labelledby="ds-feedback"><h2 id="ds-feedback">Feedback and overlays</h2><div className="design-system__grid"><Card><h3>Loading</h3><Skeleton lines={3} /></Card><div className="design-system__stack"><EmptyState title="No discoveries yet">Start with a country to reveal its learning routes.</EmptyState><ErrorState title="Map data unavailable">The local index could not be read. Retry after checking the server.</ErrorState></div></div><div className="design-system__row"><Button onClick={() => setOverlay("modal")}>Open modal</Button><Button variant="secondary" onClick={() => setOverlay("drawer")}>Open drawer</Button></div></section>

    <section aria-labelledby="ds-map"><h2 id="ds-map">Landmark and quest states</h2><p className="design-system__hint">All landmarks are semantic buttons. Locked and unavailable locations stay discoverable but cannot be activated.</p><div className="map-stage design-system__map" aria-label="Landmark state sample">
      {landmarkStates.map((state, index) => <Landmark icon={state === "completed" ? "✓" : state === "locked" ? "" : "✦"} key={state} label={state.replace("-", " ")} meta={state === "active-quest" ? "Current stop" : "11 discoveries"} state={state} style={{ left: `${8 + (index % 4) * 25}%`, top: `${20 + Math.floor(index / 4) * 50}%` }} />)}
    </div></section>

    <section aria-labelledby="ds-rules"><h2 id="ds-rules">Responsive map rules</h2><div className="design-system__rules"><Card><h3>Desktop ≥ 1024px</h3><p>World title, country labels, metadata, panels, and legend can coexist in their reserved safe areas.</p></Card><Card><h3>Compact 768–1023px</h3><p>Preserve country labels and controls; collapse secondary metadata and stack non-map panels.</p></Card><Card><h3>Small &lt; 768px</h3><p>Prioritize landmarks and focus order. Hide map metadata first, then labels; show detail in the selected-region drawer.</p></Card></div></section>
    <Modal mode={overlay ?? "modal"} onClose={() => setOverlay(null)} open={overlay !== null} title={overlay === "drawer" ? "Selected region" : "Route details"}><p>This example closes with Escape, its close control, or by selecting the backdrop.</p></Modal>
  </main>;
}
