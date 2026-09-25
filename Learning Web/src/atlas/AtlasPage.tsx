import { useEffect, useMemo, useState } from "react";
import type { ContentNode, Quest, QuestProgress } from "../shared";
import type { AtlasLearningState } from "../shared/learning";
import type { ContentTreeResponse } from "../shared/content";
import type { AllProgressResponse, QuestListResponse } from "../shared/quests";
import { Badge, Button, Card, EmptyState, ErrorState, Skeleton } from "../ui";
import { atlasHash, editorHash, type AtlasViewMode } from "../app/routes";
import { activeMilestone, nextRouteStop, territoryState } from "./gameplay";
import { canonicalCountries, descendantCount, findNodeTrail, questRouteStops, type QuestRouteStop } from "./model";
import { WorldMap } from "./WorldMap";
import type { ReviewInspection } from "./WorldReviewOverlay";
import { WorldReviewPanel } from "./WorldReviewPanel";
import { buildWorldReview } from "./world-review";
import { NestedMap } from "./NestedMap";
import "./atlas.css";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; tree: ContentTreeResponse; quests: Quest[]; learning: AtlasLearningState; progress: Record<string, QuestProgress | undefined> };

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
      fetch("/api/content/tree?view=atlas", { signal: controller.signal }),
      fetch("/api/quests", { signal: controller.signal }),
      fetch("/api/learning/atlas", { signal: controller.signal }),
      fetch("/api/progress", { signal: controller.signal })
    ]).then(async ([contentResponse, questResponse, learningResponse, progressResponse]) => {
      if ([contentResponse, questResponse, learningResponse, progressResponse].some((response) => !response.ok)) throw new Error("Atlas or progress services are unavailable.");
      const tree = await contentResponse.json() as ContentTreeResponse;
      const questPayload = await questResponse.json() as QuestListResponse;
      const learning = await learningResponse.json() as AtlasLearningState;
      const progressPayload = await progressResponse.json() as AllProgressResponse;
      setState({ status: "ready", tree, quests: questPayload.quests, learning, progress: progressPayload.progress.quests });
    }).catch((cause: unknown) => {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        setState({ status: "error", message: cause instanceof Error ? cause.message : "Atlas data could not be loaded." });
      }
    });
    return () => controller.abort();
  }, []);

  if (state.status === "loading") return <div className="atlas-page"><Skeleton lines={7} /></div>;
  if (state.status === "error") return <div className="atlas-page"><ErrorState title="Atlas unavailable">{state.message}</ErrorState></div>;

  return <AtlasReady key={state.tree.root.id} mode={mode} questId={questId} quests={state.quests} root={state.tree.root} selectedPath={selectedPath} initialLearning={state.learning} progress={state.progress} />;
}

function AtlasReady({ root, selectedPath, mode, questId, quests, initialLearning, progress }: { root: ContentNode; selectedPath?: string; mode?: AtlasViewMode; questId?: string; quests: Quest[]; initialLearning: AtlasLearningState; progress: Record<string, QuestProgress | undefined> }) {
  const [learning, setLearning] = useState(initialLearning);
  const [visitError, setVisitError] = useState(false);
  const [inspection, setInspection] = useState<ReviewInspection>();
  const trail = useMemo(() => findNodeTrail(root, selectedPath), [root, selectedPath]);
  const selected = trail.at(-1) ?? root;
  const countries = useMemo(() => canonicalCountries(root), [root]);
  const selectedCountry = trail.find((node) => node.kind === "country");
  const invalidPath = Boolean(selectedPath && selected === root);
  const selectedQuest = quests.find((quest) => quest.id === questId) ?? quests[0];
  const viewMode: AtlasViewMode = mode === "review" && selected === root ? "review" : mode === "quest" && selectedQuest ? "quest" : "explore";
  const review = useMemo(() => buildWorldReview(root, learning, quests, progress), [root, learning, quests, progress]);
  const routeStops = useMemo(() => selectedQuest ? questRouteStops(root, selectedQuest) : [], [root, selectedQuest]);
  const activePaths = viewMode === "quest" ? routeStops.map((stop) => stop.relativePath) : [];
  const mapFocus = selected.children.length > 0 || selected.kind === "country" ? selected : trail.at(-2) ?? selected;
  const countryIndex = countries.findIndex((country) => country.id === selectedCountry?.id);
  const nextStop = viewMode === "quest" && selectedQuest ? nextRouteStop(routeStops, selectedQuest, progress[selectedQuest.id], selected.relativePath) : undefined;
  const gate = viewMode === "quest" && selectedQuest ? activeMilestone(selectedQuest, progress[selectedQuest.id]) : undefined;
  const stateFor = (path?: string) => territoryState(path, learning, quests, progress);

  useEffect(() => { if (viewMode !== "review") setInspection(undefined); }, [viewMode]);

  useEffect(() => {
    const path = selected.relativePath;
    if (!path || learning.visits[path] || invalidPath) return;
    let cancelled = false;
    fetch("/api/learning/atlas/visit", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ path }) })
      .then(async (response) => { if (!response.ok) throw new Error("Visit could not be saved"); return response.json() as Promise<AtlasLearningState>; })
      .then((updated) => { if (!cancelled) { setLearning(updated); setVisitError(false); } })
      .catch(() => { if (!cancelled) setVisitError(true); });
    return () => { cancelled = true; };
  }, [selected.relativePath, learning.visits, invalidPath]);

  const selectMapNode = (node: ContentNode) => {
    if (node.kind === "lesson" && node.relativePath) window.location.hash = editorHash(node.relativePath);
    else navigate(node);
  };
  const navigate = (node?: ContentNode, nextMode = viewMode, nextQuest = selectedQuest) => {
    window.location.hash = atlasHash(node?.relativePath, {
      mode: nextMode,
      ...(nextMode === "quest" && nextQuest ? { questId: nextQuest.id } : {})
    });
  };
  const continueJourney = () => { if (nextStop?.node) navigate(nextStop.node); else if (gate && selectedQuest) window.location.hash = `#/quests?${new URLSearchParams({ quest: selectedQuest.id })}`; };

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
        <Button aria-pressed={viewMode === "review"} onClick={() => navigate(root, "review")} variant={viewMode === "review" ? "primary" : "secondary"}>World Review</Button>
      </div>
      {viewMode === "quest" && selectedQuest && <label>Active quest
        <select onChange={(event) => navigate(selected, "quest", quests.find((quest) => quest.id === event.target.value))} value={selectedQuest.id}>
          {quests.map((quest) => <option key={quest.id} value={quest.id}>{quest.title}</option>)}
        </select>
      </label>}
    </section>
    <section aria-label="Journey compass" className="atlas-compass">
      <div><small>Current location</small><strong>{selected.title}</strong><span>{selected === root ? "Choose a country" : `Contains ${stateFor(selected.relativePath)} activity`}</span></div>
      {viewMode === "quest" && selectedQuest && <div><small>Next waypoint</small><strong>{nextStop?.node?.title ?? (gate ? `${gate.title} · challenge gate` : "Expedition complete")}</strong><span>{nextStop?.countryPath && nextStop.countryPath !== selectedCountry?.relativePath ? "Across the border" : nextStop ? "Follow the marked road" : gate ? "Record evidence and your journal" : "All milestones complete"}</span></div>}
      {viewMode === "quest" && gate && <Button onClick={continueJourney}>{nextStop ? "Continue journey →" : "Open challenge gate →"}</Button>}
    </section>
    {viewMode === "review" ? <div aria-label="World Review legend" className="atlas-legend atlas-legend--review"><span data-state="unvisited">◇ Unvisited</span><span data-state="visited">▨ Visited territory</span><span data-state="partial">• Some learning complete</span><span data-state="completed">✦ Entire territory complete</span><span data-state="parent">◆ Parent Quest milestone</span><small>Only level-1/2/3 borders are shown. Parent Quest markers do not complete children.</small></div> : <div aria-label="Territory status legend" className="atlas-legend"><span data-state="unvisited">Unvisited</span><span data-state="visited">Visited</span><span data-state="practiced">Practiced</span><span data-state="evidenced">Evidence recorded</span><small>Parent colors show the strongest activity somewhere inside, not mastery of every child.</small></div>}
    {visitError && <p role="status" className="atlas-page__visit-error">This visit has not been saved. Check the connection, then revisit this territory.</p>}
    {invalidPath && <ErrorState title="Landmark not found">The requested path is not part of the current atlas. Showing Embedded World instead.</ErrorState>}
    {countries.length !== 6 && <ErrorState title="Incomplete world map">Expected six canonical countries, but the content API returned {countries.length}.</ErrorState>}
    <div className="atlas-page__layout">
      <div className={"atlas-page__map" + (viewMode === "review" ? " atlas-page__map--review" : "")}>{selected === root ? <WorldMap
        activePaths={activePaths} countries={countries} onSelect={viewMode === "review" ? (node) => navigate(node, "explore") : navigate} routeStops={viewMode === "quest" ? routeStops : []}
        selectedPath={selectedCountry?.relativePath} stateFor={viewMode === "review" ? undefined : stateFor} nextPath={nextStop?.relativePath}
        review={viewMode === "review" ? review : undefined} inspection={inspection} onInspect={setInspection}
      /> : selectedCountry && countryIndex >= 0 ? <NestedMap
        country={selectedCountry} countryIndex={countryIndex} focus={mapFocus} onSelect={selectMapNode}
        routeStops={viewMode === "quest" ? routeStops : []} selectedPath={selected.relativePath}
        stateFor={stateFor} nextStop={nextStop} onContinue={continueJourney}
      /> : null}</div>
      <aside className="atlas-page__panel">
        {viewMode === "review" ? <WorldReviewPanel review={review} countries={countries} selected={selected} inspection={inspection} onSelect={(node) => navigate(node, "explore")} /> : viewMode === "quest" && selectedQuest ? <><QuestRoutePanel onSelect={(node) => navigate(node)} quest={selectedQuest} selectedPath={selected.relativePath} stops={routeStops} nextStop={nextStop} gate={gate?.id} /><JourneyJournal quest={selectedQuest} progress={progress[selectedQuest.id]} /></> : <ExplorePanel navigate={navigate} selected={selected} />}
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

function QuestRoutePanel({ quest, stops, selectedPath, onSelect, nextStop, gate }: { quest: Quest; stops: QuestRouteStop[]; selectedPath?: string; onSelect: (node: ContentNode) => void; nextStop?: QuestRouteStop; gate?: string }) {
  const milestone = quest.milestones.find((item) => item.id === gate);
  return <section className="quest-route">
    <header><p className="eyebrow">Active expedition</p><h2>{quest.title}</h2>{quest.problem && <p>{quest.problem}</p>}{quest.destination && <p className="quest-route__destination"><strong>Destination:</strong> {quest.destination}</p>}</header>
    {milestone && <Card className="quest-encounter"><small>Challenge gate · {milestone.title}</small><h3>{milestone.challenge ?? milestone.description ?? "Apply what you discover along this road."}</h3><p>{milestone.evidenceRequired ? "Bring a test result or project artifact as evidence." : "Document what you tried and observed."}</p><p>{milestone.knowledgeLinks.length} knowledge landmarks on this leg.</p>{nextStop?.node ? <Button onClick={() => onSelect(nextStop.node!)}>Enter next region →</Button> : <a href={`#/quests?${new URLSearchParams({ quest: quest.id })}`}>Record evidence at this gate →</a>}</Card>}
    {stops.length ? <ol className="quest-route__stops">
      {stops.map((stop, index) => <li data-current={stop.relativePath === selectedPath} data-next={stop.key === nextStop?.key} data-resolved={Boolean(stop.node)} key={stop.key}>
        <span className="quest-route__number">{index + 1}</span>
        <button aria-current={stop.relativePath === selectedPath ? "step" : undefined} disabled={!stop.node} onClick={() => stop.node && onSelect(stop.node)} type="button">
          <small>{stop.milestoneTitle}</small><strong>{stop.node?.title ?? stop.relativePath}</strong>
          {stop.challenge && <span className="quest-route__challenge">{stop.challenge}</span>}
          {!stop.node && <em>Missing from current atlas</em>}
        </button>
      </li>)}
    </ol> : <EmptyState title="No route stops">This quest has no knowledge landmarks yet.</EmptyState>}
  </section>;
}

function JourneyJournal({ quest, progress }: { quest: Quest; progress?: QuestProgress }) {
  const entries = quest.milestones.flatMap((milestone) => {
    const recorded = progress?.milestones[milestone.id];
    return recorded?.status === "complete" ? [{ milestone, recorded }] : [];
  });
  return <section aria-label="Expedition journal" className="journey-journal"><h2>Expedition journal</h2>
    {entries.length ? <ol>{entries.map(({ milestone, recorded }) => <li key={milestone.id}><strong>{milestone.title}</strong><small>{recorded.updatedAt ? new Date(recorded.updatedAt).toLocaleDateString() : "Completed"}</small>{recorded.journal ? <><p><b>Tried:</b> {recorded.journal.tried}</p><p><b>Result:</b> {recorded.journal.result}</p><p><b>Next measurement:</b> {recorded.journal.nextMeasurement}</p></> : <p>Completed before journal notes were added.</p>}{recorded.evidence && <p><b>Evidence:</b> {recorded.evidence}</p>}</li>)}</ol> : <p>No completed gates yet. Your experiment notes will appear here.</p>}
  </section>;
}
