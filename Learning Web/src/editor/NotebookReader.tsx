import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { lessonHeadings } from "../shared/learning";
import { quoteOffset, type NotebookEntry, type ReadingNotebook } from "../shared/notebook";
import { markdownBody } from "./MarkdownPreview";
import { RichMarkdown } from "./RichMarkdown";
import "./notebook.css";

type SelectionNote = Pick<NotebookEntry, "heading" | "quote" | "prefix" | "suffix">;
type HighlightWindow = Window & { Highlight?: new (...ranges: Range[]) => unknown };
const highlightRegistry = () => (window.CSS as typeof CSS & { highlights?: Map<string, unknown> }).highlights;
function textRange(element: Element, at: number, length: number): Range | undefined {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let offset = 0; let start: { node: Node; offset: number } | undefined;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const end = offset + (node.textContent?.length ?? 0);
    if (!start && at < end) start = { node, offset: at - offset };
    if (start && at + length <= end) {
      const range = document.createRange(); range.setStart(start.node, start.offset); range.setEnd(node, at + length - offset); return range;
    }
    offset = end;
  }
}
export function NotebookReader({ source, path, revision, children, fallbackPosition, persist = true }: {
  source: string; path: string; revision: string; children?: ReactNode; fallbackPosition?: string; persist?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const headings = useMemo(() => lessonHeadings(source), [source]);
  const [notebook, setNotebook] = useState<ReadingNotebook>({ entries: [] });
  const [active, setActive] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [focus, setFocus] = useState(false);
  const [size, setSize] = useState("normal");
  const [width, setWidth] = useState("comfortable");
  const [theme, setTheme] = useState("paper");
  const [selection, setSelection] = useState<SelectionNote>();
  const [selectionTools, setSelectionTools] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [resumeAnchor, setResumeAnchor] = useState<string>();
  const [attached, setAttached] = useState<string[]>([]);
  const [retry, setRetry] = useState(0);
  const pending = useRef(Promise.resolve());
  const url = `/api/notebook?${new URLSearchParams({ path })}`;
  const lastPosition = useRef("");
  const hasScrolled = useRef(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("neolearning:reader-settings") ?? "null");
      if (saved && ["normal", "large", "largest"].includes(saved.size)) setSize(saved.size);
      if (saved && ["comfortable", "wide"].includes(saved.width)) setWidth(saved.width);
      if (saved && ["paper", "light", "night"].includes(saved.theme)) setTheme(saved.theme);
    } catch { /* Preferences are optional; server notebook is unaffected. */ }
  }, []);
  const settings = (next: { size?: string; width?: string; theme?: string }) => {
    const values = { size, width, theme, ...next };
    setSize(values.size); setWidth(values.width); setTheme(values.theme);
    try { localStorage.setItem("neolearning:reader-settings", JSON.stringify(values)); } catch { /* Session controls still work. */ }
  };
  useEffect(() => {
    const controller = new AbortController(); setReady(false);
    if (!persist) return;
    fetch(url, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Notebook could not be loaded. Retry to restore notes.");
      const value = await response.json() as ReadingNotebook;
      if (controller.signal.aborted) return;
      setNotebook(value); setResumeAnchor(value.positionRevision === revision ? value.position : undefined); lastPosition.current = value.position ?? "";
      setReady(value.currentRevision === revision); setError(value.currentRevision === revision ? "" : "The document changed on the server. Reload the document before adding notes.");
    }).catch((cause: Error) => { if (!controller.signal.aborted) setError(cause.message); });
    return () => controller.abort();
  }, [url, persist, retry, revision]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") setRetry((value) => value + 1); };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);
  const mutate = async (method: string, payload: object, quiet = false) => {
    if (!ready || !persist) return;
    if (!quiet) setBusy(true);
    let successful = false;
    const operation = pending.current.then(async () => {
      const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, baseRevision: revision }) });
      if (!response.ok) throw new Error("Notebook was not saved. Your draft is retained; please retry.");
      setNotebook(await response.json() as ReadingNotebook); if (!quiet) setError(""); successful = true;
    });
    pending.current = operation.catch((cause: Error) => { setError(cause.message); });
    await pending.current;
    if (!quiet) setBusy(false);
    return successful;
  };
  const section = (slug: string) => body.current?.querySelector<HTMLElement>(`[data-heading-slug="${CSS.escape(slug)}"]`);
  const jump = (slug: string) => section(slug)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  useEffect(() => {
    let frame = 0;
    const update = (event?: Event) => {
      if (event?.type === "scroll") hasScrolled.current = true;
      cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
        const sections = [...(body.current?.querySelectorAll<HTMLElement>("[data-heading-slug]") ?? [])];
        const current = sections.filter((item) => item.getBoundingClientRect().top <= 210).at(-1) ?? sections[0];
        setActive(current?.dataset.headingSlug ?? "");
        const rectangle = body.current?.getBoundingClientRect();
        if (rectangle) setPercentage(Math.round(Math.max(0, Math.min(1, (210 - rectangle.top) / Math.max(1, rectangle.height - innerHeight + 210))) * 100));
      });
    };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [source]);
  useEffect(() => {
    if (!active || !ready || !persist || !hasScrolled.current || active === lastPosition.current) return;
    const timer = setTimeout(() => { void mutate("PUT", { position: active }, true).then((ok) => { if (ok) lastPosition.current = active; }); }, 900);
    return () => clearTimeout(timer);
  }, [active, ready, persist, url]);
  const ranges = useMemo(() => new Map<string, Range>(), []);
  useEffect(() => {
    ranges.clear(); const highlights: Range[] = [];
    for (const entry of notebook.entries) {
      if (entry.kind !== "note" || entry.sourceRevision !== revision) continue;
      const element = entry.heading ? section(entry.heading) : body.current?.querySelector(".notebook-reader__intro");
      if (!element) continue;
      const at = quoteOffset(element.textContent ?? "", entry.quote, entry.prefix, entry.suffix);
      const range = at === undefined ? undefined : textRange(element, at, entry.quote.length);
      if (range) { highlights.push(range); ranges.set(entry.id, range); }
    }
    const Constructor = (window as HighlightWindow).Highlight;
    if (Constructor) highlightRegistry()?.set("notebook-notes", new Constructor(...highlights));
    const ids = [...ranges.keys()];
    setAttached((old) => old.join() === ids.join() ? old : ids);
    return () => { highlightRegistry()?.delete("notebook-notes"); };
  }, [notebook, source, revision]);
  const capture = () => {
    const selected = window.getSelection();
    if (!selected?.rangeCount || !selected.toString().trim() || selected.toString().length > 4000) return;
    const range = selected.getRangeAt(0);
    if (!body.current?.contains(range.commonAncestorContainer)) return;
    const parent = range.startContainer.parentElement?.closest<HTMLElement>("[data-heading-slug], .notebook-reader__intro");
    if (!parent?.contains(range.endContainer)) { setError("Select text inside one section at a time."); return; }
    if (range.startContainer.parentElement?.closest("button, textarea, input, .activity-card, .reader-code")) return;
    const before = document.createRange(); before.selectNodeContents(parent); before.setEnd(range.startContainer, range.startOffset);
    const after = document.createRange(); after.selectNodeContents(parent); after.setStart(range.endContainer, range.endOffset);
    setSelection({ heading: parent.dataset.headingSlug ?? "", quote: selected.toString(), prefix: before.toString().slice(-40), suffix: after.toString().slice(0, 40) });
    setSelectionTools(true);
  };
  useEffect(() => {
    document.addEventListener("selectionchange", capture);
    return () => document.removeEventListener("selectionchange", capture);
  }, [source]);
  const resume = resumeAnchor ?? (notebook.position ? undefined : fallbackPosition);
  const lines = markdownBody(source).split(/\r?\n/);
  return <div ref={root} className="notebook-reader" data-focus={focus} data-size={size} data-width={width} data-theme={theme}>
    <section className="notebook-reader__controls" aria-label="Reading preferences">
      <button type="button" aria-pressed={focus} onClick={() => setFocus(!focus)}>{focus ? "Exit focus" : "Focus reading"}</button>
      <label>Text size<select value={size} onChange={(event) => settings({ size: event.target.value })}><option value="normal">Normal</option><option value="large">Large</option><option value="largest">Extra large</option></select></label>
      <label>Page width<select value={width} onChange={(event) => settings({ width: event.target.value })}><option value="comfortable">Comfortable</option><option value="wide">Wide</option></select></label>
      <label>Reading theme<select value={theme} onChange={(event) => settings({ theme: event.target.value })}><option value="paper">Paper</option><option value="light">Light</option><option value="night">Night</option></select></label>
      <span aria-label="Reading position">{percentage}% read position</span><progress aria-label="Reading position in document" max={100} value={percentage} />
    </section>
    {error && <p role="alert">{error} <button type="button" onClick={() => setRetry(retry + 1)}>Reload notebook</button></p>}
    {!persist && <p>Unsaved draft: notebook actions are paused until the document is saved.</p>}
    <div className="notebook-reader__layout">
      <aside className="notebook-reader__index" aria-label="Document navigation">
        <h2>Field guide</h2>
        {resume && headings.some((heading) => heading.slug === resume) && <button type="button" onClick={() => jump(resume)}>Resume reading</button>}
        <nav aria-label="Document sections">{headings.map((heading) => <button key={heading.slug} type="button" aria-current={active === heading.slug ? "location" : undefined} onClick={() => jump(heading.slug)}>{heading.text}</button>)}</nav>
        <button type="button" disabled={!ready || !active || busy} onClick={() => void mutate("POST", { kind: "bookmark", heading: active, quote: "", prefix: "", suffix: "", note: "" })}>Bookmark section</button>
        <small>Reading position is not proof of learning.</small>
      </aside>
      <div ref={body} className="notebook-reader__document" onPointerUp={capture} onKeyUp={capture}>
        {children ?? <article className="markdown-preview">
          <div className="notebook-reader__intro"><RichMarkdown documentPath={path} source={lines.slice(0, headings[0] ? headings[0].line - 1 : lines.length).join("\n")} /></div>
          {headings.map((heading, index) => <section key={heading.slug} data-heading-slug={heading.slug}>
            <RichMarkdown documentPath={path} source={lines.slice(heading.line - 1, headings[index + 1] ? headings[index + 1].line - 1 : lines.length).join("\n")} />
          </section>)}
        </article>}
      </div>
    </div>
    {selection && selectionTools && <aside className="notebook-reader__selection-tools" aria-label="Selected passage actions">
      <span>{selection.quote.slice(0, 75)}{selection.quote.length > 75 ? "…" : ""}</span>
      <button type="button" onClick={() => { setSelectionTools(false); root.current?.querySelector<HTMLTextAreaElement>(".notebook-reader__notes textarea")?.focus(); }}>Write a note</button>
      <button type="button" onClick={() => { window.getSelection()?.removeAllRanges(); setSelection(undefined); }}>Cancel selection</button>
    </aside>}
    <section className="notebook-reader__notes" aria-label="Personal notebook">
      <h2>Personal notebook</h2><p>Select a passage, then save a highlight and your note. Synced through your private server.</p>
      {selection && <blockquote>{selection.quote}</blockquote>}
      <label>Note for selected passage<textarea value={note} maxLength={8000} onChange={(event) => setNote(event.target.value)} /></label>
      <button type="button" disabled={!selection || !ready || busy} onClick={() => { if (selection) void mutate("POST", { kind: "note", ...selection, note }).then((ok) => { if (ok) { setSelection(undefined); setNote(""); } }); }}>Save highlight</button>
      {notebook.entries.map((entry) => <details key={entry.id}><summary>{entry.kind === "bookmark" ? "★ " : "✎ "}{entry.quote.slice(0, 90) || headings.find((heading) => heading.slug === entry.heading)?.text || "Detached bookmark"}</summary>
        {entry.quote && <blockquote>{entry.quote}</blockquote>}<p>{entry.note}</p>
        {entry.kind === "note" && !attached.includes(entry.id) && <p>Detached note: the original passage changed or is no longer uniquely identifiable.</p>}
        <button type="button" onClick={() => {
          const range = ranges.get(entry.id);
          if (range) { const selected = window.getSelection(); selected?.removeAllRanges(); selected?.addRange(range); range.startContainer.parentElement?.scrollIntoView({ block: "center", behavior: "auto" }); }
          else if (entry.kind === "bookmark" && entry.sourceRevision === notebook.currentRevision) jump(entry.heading);
        }} disabled={entry.kind === "note" ? !attached.includes(entry.id) : entry.sourceRevision !== notebook.currentRevision}>Go to passage</button>
        {entry.kind === "bookmark" && entry.sourceRevision !== notebook.currentRevision && <p>Detached bookmark: the document changed. Bookmark the section again after reviewing it.</p>}
        {entry.kind === "note" && <form onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get("note"); if (typeof value === "string") void mutate("PATCH", { id: entry.id, note: value }); }}><label>Edit note<textarea name="note" defaultValue={entry.note} maxLength={8000} /></label><button disabled={busy} type="submit">Update note</button></form>}
        <button disabled={busy} type="button" onClick={() => void mutate("DELETE", { id: entry.id })}>Remove entry</button>
      </details>)}
    </section>
  </div>;
}
