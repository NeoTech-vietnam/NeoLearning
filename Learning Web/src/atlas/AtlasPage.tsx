import { useEffect, useMemo, useState } from "react";
import type { ContentNode } from "../shared";
import type { ContentTreeResponse } from "../shared/content";
import { Badge, Button, Card, EmptyState, ErrorState, Skeleton } from "../ui";
import { atlasHash } from "../app/routes";
import { canonicalCountries, descendantCount, findNodeTrail } from "./model";
import { WorldMap } from "./WorldMap";
import "./atlas.css";

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; tree: ContentTreeResponse };

export function AtlasPage({ selectedPath }: { selectedPath?: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/content/tree", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Content API returned ${response.status}.`);
        return response.json() as Promise<ContentTreeResponse>;
      })
      .then((tree) => setState({ status: "ready", tree }))
      .catch((cause: unknown) => {
        if (!(cause instanceof DOMException && cause.name === "AbortError")) {
          setState({ status: "error", message: cause instanceof Error ? cause.message : "Content could not be loaded." });
        }
      });
    return () => controller.abort();
  }, []);

  if (state.status === "loading") return <div className="atlas-page"><Skeleton lines={7} /></div>;
  if (state.status === "error") return <div className="atlas-page"><ErrorState title="Atlas unavailable">{state.message}</ErrorState></div>;

  return <AtlasReady root={state.tree.root} selectedPath={selectedPath} />;
}

function AtlasReady({ root, selectedPath }: { root: ContentNode; selectedPath?: string }) {
  const trail = useMemo(() => findNodeTrail(root, selectedPath), [root, selectedPath]);
  const selected = trail.at(-1) ?? root;
  const countries = canonicalCountries(root);
  const selectedCountry = trail.find((node) => node.kind === "country");
  const invalidPath = Boolean(selectedPath && selected === root);

  const navigate = (node?: ContentNode) => {
    window.location.hash = atlasHash(node?.relativePath);
  };

  return <main className="atlas-page">
    <header className="atlas-page__heading">
      <div><p className="eyebrow">Cartographic learning atlas</p><h1>{selected.title}</h1></div>
      {selected !== root && <Button onClick={() => navigate(trail.at(-2))} variant="secondary">← Zoom out</Button>}
    </header>

    <nav aria-label="Atlas breadcrumb" className="atlas-breadcrumb">
      {trail.map((node, index) => <span key={node.id}>
        {index > 0 && <span aria-hidden="true">›</span>}
        <a aria-current={node === selected ? "page" : undefined} href={atlasHash(node.relativePath)}>{node.title}</a>
      </span>)}
    </nav>

    {invalidPath && <ErrorState title="Landmark not found">The requested path is not part of the current atlas. Showing Embedded World instead.</ErrorState>}
    {countries.length !== 6 && <ErrorState title="Incomplete world map">Expected six canonical countries, but the content API returned {countries.length}.</ErrorState>}

    <div className="atlas-page__layout">
      <div className="atlas-page__map"><WorldMap countries={countries} onSelect={navigate} selectedPath={selectedCountry?.relativePath} /></div>
      <aside className="atlas-page__panel">
        <div className="atlas-page__meta">
          <Badge tone={selected.unindexed ? "muted" : "accent"}>{selected.unindexed ? "Uncharted" : selected.kind}</Badge>
          <span>{descendantCount(selected)} discoveries</span>
        </div>
        {selected.unindexed && <p className="atlas-page__uncharted">This land exists on disk but is missing from the canonical README taxonomy.</p>}
        {selected.summary && <p>{selected.summary}</p>}
        {selected.children.length ? <section aria-label={`${selected.title} landmarks`} className="atlas-landmarks">
          {selected.children.map((child) => <Card className={child.unindexed ? "atlas-landmark atlas-landmark--uncharted" : "atlas-landmark"} interactive key={child.id}>
            <button onClick={() => navigate(child)} type="button">
              <span>{child.kind}</span><strong>{child.title}</strong><small>{descendantCount(child)} descendants</small>
            </button>
          </Card>)}
        </section> : <EmptyState title="End of this trail">This lesson has no deeper landmarks yet.</EmptyState>}
      </aside>
    </div>
  </main>;
}
