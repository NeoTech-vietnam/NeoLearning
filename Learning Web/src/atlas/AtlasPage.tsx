import { useEffect, useMemo, useState } from "react";
import type { ContentNode, Quest } from "../shared";
import type { ContentTreeResponse } from "../shared/content";
import type { QuestListResponse } from "../shared/quests";
import { Badge, Button, Card, EmptyState, ErrorState, Skeleton } from "../ui";
import { atlasHash, editorHash, type AtlasViewMode } from "../app/routes";
import { canonicalCountries, descendantCount, findNodeTrail, questRouteStops } from "./model";
import { WorldMap } from "./WorldMap";
import "./atlas.css";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; tree: ContentTreeResponse; quests: Quest[] };

export interface AtlasPageProps {
  selectedPath?: string;
  mode?: AtlasViewMode;
  questId?: string;
}

export function AtlasPage({ selectedPath, mode, questId }: AtlasPageProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/content/tree", { signal: controller.signal }),
      fetch("/api/quests", { signal: controller.signal })
    ]).then(async ([contentResponse, questResponse]) => {
      if (!contentResponse.ok) throw new Error(`Content API returned ${contentResponse.status}.`);
      if (!questResponse.ok) throw new Error(`Quest API returned ${questResponse.status}.`);
      const tree = await contentResponse.json() as ContentTreeResponse;
      const questPayload = await questResponse.json() as QuestListResponse;
      setState({ status: "ready", tree, quests: questPayload.quests });
    }).catch((cause: unknown) => {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        setState({ status: "error", message: cause instanceof Error ? cause.message : "Atlas data could not be loaded." });
      }
    });
    return () => controller.abort();
  }, []);

  if (state.status === "loading") return <div className="atlas-page"><Skeleton lines={7} /></div>;
  if (state.status === "error") return <div className="atlas-page"><ErrorState title="Atlas unavailable">{state.message}</ErrorState></div>;

  return <AtlasReady mode={mode} questId={questId} quests={state.quests} root={state.tree.root} selectedPath={selectedPath} />;
}

function AtlasReady({ root, selectedPath, mode, questId, quests }: { root: ContentNode; selectedPath?: string; mode?: AtlasViewMode; questId?: string; quests: Quest[] }) {
  const trail = useMemo(() => findNodeTrail(root, selectedPath), [root, selectedPath]);
  const selected = trail.at(-1) ?? root;
  const countries = canonicalCountries(root);
  const selectedCountry = trail.find((node) => node.kind === "country");
  const invalidPath = Boolean(selectedPath && selected === root);
  const selectedQuest = quests.find((quest) => quest.id === questId) ?? quests[0];
  const viewMode: AtlasViewMode = mode === "quest" && selectedQuest ? "quest" : "explore";
  const routeStops = useMemo(() => selectedQuest ? questRouteStops(root, selectedQuest) : [], [root, selectedQuest]);
  const activePaths = viewMode === "quest" ? routeStops.map((stop) => stop.relativePath) : [];

  const navigate = (node?: ContentNode, nextMode = viewMode, nextQuest = selectedQuest) => {
    window.location.hash = atlasHash(node?.relativePath, {
      mode: nextMode,
      ...(nextMode === "quest" && nextQuest ? { questId: nextQuest.id } : {})
    });
  };

  return <main className="atlas-page">
    <header className="atlas-page__heading">
      <div><p className="eyebrow">Cartographic learning atlas</p><h1>{selected.title}</h1></div>
      {selected !== root && <Button onClick={() => navigate(trail.at(-2))} variant="secondary">← Zoom out</Button>}
    </header>

    <nav aria-label="Atlas breadcrumb" className="atlas-breadcrumb">
      {trail.map((node, index) => <span key={node.id}>
        {index > 0 && <span aria-hidden="true">›</span>}
        <a aria-current={node === selected ? "page" : undefined} href={atlasHash(node.relativePath, { mode: viewMode, questId: viewMode === "quest" ? selectedQuest?.id : undefined })}>{node.title}</a>
      </span>)}
    </nav>

    <section aria-label="Atlas view mode" className="atlas-toolbar">
      <div className="atlas-toolbar__modes">
        <Button aria-pressed={viewMode === "explore"} onClick={() => navigate(selected, "explore")} variant={viewMode === "explore" ? "primary" : "secondary"}>Explore</Button>
        <Button aria-pressed={viewMode === "quest"} disabled={!selectedQuest} onClick={() => navigate(selected, "quest", selectedQuest)} variant={viewMode === "quest" ? "primary" : "secondary"}>Quest route</Button>
      </div>
      {viewMode === "quest" && selectedQuest && <label>Active quest
        <select onChange={(event) => navigate(selected, "quest", quests.find((quest) => quest.id === event.target.value))} value={selectedQuest.id}>
          {quests.map((quest) => <option key={quest.id} value={quest.id}>{quest.title}</option>)}
        </select>
      </label>}
    </section>

    {invalidPath && <ErrorState title="Landmark not found">The requested path is not part of the current atlas. Showing Embedded World instead.</ErrorState>}
    {countries.length !== 6 && <ErrorState title="Incomplete world map">Expected six canonical countries, but the content API returned {countries.length}.</ErrorState>}

    <div className="atlas-page__layout">
      <div className="atlas-page__map"><WorldMap activePaths={activePaths} countries={countries} onSelect={navigate} selectedPath={selectedCountry?.relativePath} /></div>
      <aside className="atlas-page__panel">
        {viewMode === "quest" && selectedQuest ? <QuestRoutePanel onSelect={(node) => navigate(node)} quest={selectedQuest} selectedPath={selected.relativePath} stops={routeStops} /> : <ExplorePanel navigate={navigate} selected={selected} />}
      </aside>
    </div>
  </main>;
}

function ExplorePanel({ selected, navigate }: { selected: ContentNode; navigate: (node: ContentNode) => void }) {
  return <>
    <div className="atlas-page__meta">
      <Badge tone={selected.unindexed ? "muted" : "accent"}>{selected.unindexed ? "Uncharted" : selected.kind}</Badge>
      <span>{descendantCount(selected)} discoveries</span>
    </div>
    {selected.unindexed && <p className="atlas-page__uncharted">This land exists on disk but is missing from the canonical README taxonomy.</p>}
    {selected.summary && <p>{selected.summary}</p>}
    {selected.kind === "lesson" && selected.relativePath && <a className="atlas-page__editor-link" href={editorHash(selected.relativePath)}>Read or edit this lesson</a>}
    {selected.children.length ? <section aria-label={`${selected.title} landmarks`} className="atlas-landmarks">
      {selected.children.map((child) => <Card className={child.unindexed ? "atlas-landmark atlas-landmark--uncharted" : "atlas-landmark"} interactive key={child.id}>
        <button onClick={() => child.kind === "lesson" && child.relativePath ? window.location.hash = editorHash(child.relativePath) : navigate(child)} type="button">
          <span>{child.kind}</span><strong>{child.title}</strong><small>{descendantCount(child)} descendants</small>
        </button>
      </Card>)}
    </section> : selected.kind !== "lesson" && <EmptyState title="End of this trail">This landmark has no deeper discoveries yet.</EmptyState>}
  </>;
}

function QuestRoutePanel({ quest, stops, selectedPath, onSelect }: { quest: Quest; stops: ReturnType<typeof questRouteStops>; selectedPath?: string; onSelect: (node: ContentNode) => void }) {
  return <section className="quest-route">
    <header><p className="eyebrow">Active expedition</p><h2>{quest.title}</h2>{quest.problem && <p>{quest.problem}</p>}</header>
    {stops.length ? <ol className="quest-route__stops">
      {stops.map((stop, index) => <li data-current={stop.relativePath === selectedPath} data-resolved={Boolean(stop.node)} key={stop.key}>
        <span className="quest-route__number">{index + 1}</span>
        <button aria-current={stop.relativePath === selectedPath ? "step" : undefined} disabled={!stop.node} onClick={() => stop.node && onSelect(stop.node)} type="button">
          <small>{stop.milestoneTitle}</small>
          <strong>{stop.node?.title ?? stop.relativePath}</strong>
          {!stop.node && <em>Missing from current atlas</em>}
        </button>
      </li>)}
    </ol> : <EmptyState title="No route stops">This quest has no knowledge landmarks yet.</EmptyState>}
  </section>;
}
