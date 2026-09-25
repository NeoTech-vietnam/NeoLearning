import type { ContentNode } from "../shared";
import type { ReviewCounts, WorldReview } from "./world-review";
import type { ReviewInspection } from "./WorldReviewOverlay";

function Coverage({ counts }: { counts: ReviewCounts }) {
  return <span>{counts.completed} completed · {counts.visited} visited or completed · {counts.total} terminal folders</span>;
}

export function WorldReviewPanel({ review, countries, selected, inspection, onSelect }: {
  review: WorldReview;
  countries: ContentNode[];
  selected: ContentNode;
  inspection?: ReviewInspection;
  onSelect: (node: ContentNode) => void;
}) {
  const inspected = review.regions.find((region) => region.node.relativePath === inspection?.path);
  const country = countries.find((node) => node.relativePath === inspected?.countryPath);
  const parentPath = inspected?.depth === 2 ? inspected.node.relativePath?.slice(0, inspected.node.relativePath.lastIndexOf("/")) : undefined;
  const parent = parentPath ? review.regions.find((region) => region.node.relativePath === parentPath) : undefined;
  return <section aria-label="World Review coverage" className="world-review-panel">
    <div className="world-review-panel__inspect" role="status" aria-live="polite" data-review-inspect-path={inspected?.node.relativePath}>
      <small>{inspected ? `${country?.title ?? "World"}${parent ? ` / ${parent.node.title}` : ""} · Level ${inspected.depth}` : "Territory inspector"}</small>
      {inspected ? <>
        <strong>{inspected.node.title}</strong>
        <span>{inspected.counts.visited} / {inspected.counts.total} terminal folders visited or completed</span>
        <span>{inspected.counts.completed} / {inspected.counts.total} completed</span>
        <small>{inspected.state === "completed" ? "Entire region complete" : inspected.counts.completed > 0 ? "Partly complete" : inspected.state === "visited" ? "Visited, not completed" : "Unvisited"} · {inspection?.touchPreview ? "Tap again to open" : "Click or press Enter to open"}</small>
      </> : <span>Hover, focus, or tap a territory to see its details here.</span>}
    </div>
    <header><p className="eyebrow">World Review</p><h2>Explore your knowledge map</h2>
      <p>Borders show folder levels 1 and 2. Colors summarize deeper folders; a territory glows only when all its terminal folders are complete. Counts below still cover every terminal folder.</p>
    </header>
    <div className="world-review-panel__total"><strong>Whole world</strong><Coverage counts={review.world} /></div>
    <div className="world-review-panel__countries">
      {countries.map((country) => <button
        aria-current={selected.id === country.id ? "location" : undefined}
        key={country.id}
        onClick={() => onSelect(country)}
        type="button"
      ><strong>{country.title}</strong><Coverage counts={review.countries[country.relativePath ?? ""] ?? { total: 0, visited: 0, completed: 0 }} /></button>)}
    </div>
    <section id="world-review-parents" className="world-review-panel__parents" tabIndex={-1}>
      <h3>Completed parent milestones <small>({review.parents.length})</small></h3>
      <p>These mark a broader area. They do not complete its smaller regions.</p>
      {review.parents.length === 0 ? <p>No parent milestones completed yet.</p> :
        <ul>{review.parents.map((parent) => <li key={parent.node.id}>
          <button onClick={() => onSelect(parent.node)} type="button"><strong>✦ {parent.node.title}</strong><small>{parent.milestones.join("; ")}</small></button>
        </li>)}</ul>}
    </section>
  </section>;
}
