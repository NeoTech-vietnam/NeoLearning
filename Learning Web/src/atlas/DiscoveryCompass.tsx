import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentNode } from "../shared";
import type { ContentTreeResponse } from "../shared/content";
import { atlasHash, editorHash } from "../app/routes";
import { Button } from "../ui";
import { discoveryPools, pickDiscovery, type DiscoveryDestination } from "./discovery";
import "./discovery.css";

const STORAGE_KEY = "neolearning:discovery:last-path";
let rememberedPath: string | undefined;
function lastPath(): string | undefined {
  try { return sessionStorage.getItem(STORAGE_KEY) ?? rememberedPath; } catch { return rememberedPath; }
}
function remember(path: string) {
  rememberedPath = path;
  try { sessionStorage.setItem(STORAGE_KEY, path); } catch { /* Discovery remains usable with storage disabled. */ }
}

export function DiscoveryCompass({ root: providedRoot, selectedPath, compact = false }: { root?: ContentNode; selectedPath?: string; compact?: boolean }) {
  const [loadedRoot, setLoadedRoot] = useState<ContentNode>();
  const [phase, setPhase] = useState<"idle" | "loading" | "spinning">("idle");
  const [preview, setPreview] = useState(""); const [error, setError] = useState<string>();
  const [previousPath, setPreviousPath] = useState(lastPath);
  const root = providedRoot ?? loadedRoot;
  const pools = useMemo(() => root ? discoveryPools(root) : [], [root]);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const cycling = useRef<ReturnType<typeof setInterval>>();
  const controller = useRef<AbortController>();
  const busy = useRef(false); const generation = useRef(0);
  const resultElement = useRef<HTMLDivElement>(null);
  const selectedResult = useMemo(() => selectedPath === previousPath ? pools.flatMap((pool) => pool.destinations).find((item) => item.node.relativePath === selectedPath) : undefined, [pools, selectedPath, previousPath]);

  const cancel = () => {
    generation.current++; clearTimeout(timer.current); clearInterval(cycling.current);
    controller.current?.abort(); busy.current = false; setPhase("idle"); setPreview("");
  };
  useEffect(() => {
    const onNavigation = () => cancel();
    window.addEventListener("hashchange", onNavigation);
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && busy.current) cancel(); };
    window.addEventListener("keydown", onEscape);
    return () => {
      generation.current++; busy.current = false; controller.current?.abort(); clearTimeout(timer.current); clearInterval(cycling.current);
      window.removeEventListener("hashchange", onNavigation); window.removeEventListener("keydown", onEscape);
    };
  }, []);
  useEffect(() => { if (selectedResult) resultElement.current?.focus({ preventScroll: true }); }, [selectedResult]);

  const start = async () => {
    if (busy.current) return;
    busy.current = true; setError(undefined);
    const currentGeneration = ++generation.current;
    let currentRoot = root;
    try {
      if (!currentRoot) {
        setPhase("loading"); controller.current = new AbortController();
        const response = await fetch("/api/content/tree?view=atlas", { signal: controller.current.signal });
        if (!response.ok) throw new Error("The discovery map could not be loaded. Try again.");
        currentRoot = (await response.json() as ContentTreeResponse).root;
        if (currentGeneration !== generation.current) return;
        setLoadedRoot(currentRoot);
      }
      const choices = discoveryPools(currentRoot);
      const result = pickDiscovery(choices, lastPath());
      if (!result) { busy.current = false; setPhase("idle"); return; }
      const arrive = (destination: DiscoveryDestination) => {
        if (currentGeneration !== generation.current) return;
        clearInterval(cycling.current); busy.current = false; setPhase("idle"); setPreview("");
        remember(destination.node.relativePath!); setPreviousPath(destination.node.relativePath);
        window.location.hash = atlasHash(destination.node.relativePath);
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { arrive(result); return; }
      setPhase("spinning"); setPreview(choices[0].country.title);
      let frame = 0;
      cycling.current = setInterval(() => { frame++; setPreview(choices[frame % choices.length].country.title); }, 120);
      timer.current = setTimeout(() => arrive(result), 1000);
    } catch (cause) {
      if (currentGeneration !== generation.current) return;
      busy.current = false; setPhase("idle"); setError(cause instanceof Error ? cause.message : "Discovery is unavailable. Try again.");
    }
  };

  return <section className={`discovery-compass${compact ? " discovery-compass--compact" : ""}`} aria-label="Discovery compass" data-phase={phase}>
    <div className="discovery-compass__intro"><span className="discovery-compass__dial" aria-hidden="true"><span>✦</span></span><div><strong>La bàn khám phá</strong>{!compact && <p>A country, a small territory, a new idea. Let curiosity choose your next trail.</p>}</div></div>
    <div className="discovery-compass__actions"><Button disabled={phase !== "idle" || Boolean(root && !pools.length)} onClick={() => void start()}>{phase === "loading" ? "Loading map…" : phase === "spinning" ? "Spinning…" : selectedResult ? "Spin again" : "Discover randomly"}</Button>{phase !== "idle" && <Button variant="secondary" onClick={cancel}>Cancel spin</Button>}</div>
    <div className="discovery-compass__status" role="status" aria-live="polite">{phase === "spinning" ? <span>Compass spinning… <span aria-hidden="true">{preview}</span></span> : phase === "loading" ? "Preparing the knowledge map…" : !selectedResult ? "Opens a small folder with documents. No EXP for spinning." : null}</div>
    {root && !pools.length && <p>No small territories with documents are available yet.</p>}
    {error && <p role="alert">{error}</p>}
    {selectedResult && <div className="discovery-compass__result" ref={resultElement} tabIndex={-1} data-discovery-path={selectedResult.node.relativePath}>
      <small>Discovered territory · {selectedResult.trail.map((item) => item.title).join(" → ")}</small><strong>{selectedResult.node.title}</strong>
      <p>{selectedResult.node.summary ?? `${selectedResult.lessons.length} document${selectedResult.lessons.length === 1 ? "" : "s"} to explore. Start with ${selectedResult.lessons[0].title}.`}</p>
      <a href={editorHash(selectedResult.lessons[0].relativePath!)}>Read documents here →</a>
    </div>}
  </section>;
}
