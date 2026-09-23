import { useCallback, useEffect, useState } from "react";
import type { ApiErrorResponse } from "../shared";
import type { FileDiffPreview, MarkdownFile } from "../shared/files";
import { Badge, Button, ErrorState, Modal, Skeleton } from "../ui";
import { DiffReview } from "./DiffReview";
import { MarkdownPreview } from "./MarkdownPreview";
import { MonacoEditor } from "./MonacoEditor";
import "./editor.css";

type EditorMode = "read" | "split" | "diff";
type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; file: MarkdownFile };
type ConflictState = { message: string; currentRevision?: string };

async function errorMessage(response: Response): Promise<string> {
  try {
    const payload = await response.json() as ApiErrorResponse;
    return payload.error.message;
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

export function EditorPage({ path }: { path?: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<EditorMode>("read");
  const [diff, setDiff] = useState<FileDiffPreview>();
  const [notice, setNotice] = useState<string>();
  const [error, setError] = useState<string>();
  const [conflict, setConflict] = useState<ConflictState>();
  const [saving, setSaving] = useState(false);
  const [pendingHash, setPendingHash] = useState<string>();

  const load = useCallback(async () => {
    if (!path) {
      setState({ status: "error", message: "No Markdown path was provided." });
      return;
    }
    setState({ status: "loading" });
    setError(undefined);
    try {
      const response = await fetch(`/api/files/read?${new URLSearchParams({ path }).toString()}`);
      if (!response.ok) {
        setState({ status: "error", message: await errorMessage(response) });
        return;
      }
      const file = await response.json() as MarkdownFile;
      setDraft(file.content);
      setState({ status: "ready", file });
      setMode("read");
      setDiff(undefined);
      setConflict(undefined);
      setNotice(undefined);
    } catch (cause) {
      setState({ status: "error", message: cause instanceof Error ? cause.message : "The document could not be loaded." });
    }
  }, [path]);

  useEffect(() => { void load(); }, [load]);

  const dirty = state.status === "ready" && draft !== state.file.content;

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const interceptLink = (event: MouseEvent) => {
      if (!dirty || event.defaultPrevented || event.button !== 0) return;
      const element = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
      const href = element?.getAttribute("href");
      if (!href || href === window.location.hash) return;
      event.preventDefault();
      setPendingHash(href);
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", interceptLink, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", interceptLink, true);
    };
  }, [dirty]);

  const review = async () => {
    if (state.status !== "ready") return;
    setError(undefined);
    setNotice(undefined);
    try {
      const response = await fetch("/api/files/preview-diff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: state.file.relativePath, baseRevision: state.file.revision, content: draft })
      });
      if (!response.ok) { setError(await errorMessage(response)); return; }
      const preview = await response.json() as FileDiffPreview;
      if (preview.conflicted) {
        setConflict({ message: "The source changed before diff review.", currentRevision: preview.currentRevision });
        return;
      }
      setDiff(preview);
      setMode("diff");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The diff could not be prepared.");
    }
  };

  const save = async () => {
    if (state.status !== "ready" || !diff) return;
    setSaving(true);
    setError(undefined);
    try {
      const response = await fetch("/api/files/write", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: state.file.relativePath, baseRevision: state.file.revision, content: draft })
      });
      if (response.status === 409) {
        const payload = await response.json() as ApiErrorResponse;
        setConflict({ message: payload.error.message, currentRevision: typeof payload.error.details?.currentRevision === "string" ? payload.error.details.currentRevision : undefined });
        return;
      }
      if (!response.ok) { setError(await errorMessage(response)); return; }
      const file = await response.json() as MarkdownFile;
      setState({ status: "ready", file });
      setDraft(file.content);
      setDiff(undefined);
      setMode("read");
      setNotice("Saved. The content index has been refreshed.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The draft could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const reloadCurrent = async () => {
    if (!path) return;
    setError(undefined);
    try {
      const response = await fetch(`/api/files/read?${new URLSearchParams({ path }).toString()}`);
      if (!response.ok) { setError(await errorMessage(response)); return; }
      const file = await response.json() as MarkdownFile;
      setState({ status: "ready", file });
      setDraft(file.content);
      setDiff(undefined);
      setConflict(undefined);
      setMode("read");
      setNotice("Reloaded the current source. The previous draft was discarded.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The current source could not be reloaded. Your draft is still intact.");
    }
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setNotice("Draft copied to the clipboard.");
    } catch {
      setError("The browser could not copy the draft. It remains open in the editor.");
    }
  };

  if (state.status === "loading") return <main className="editor-page"><Skeleton lines={9} /></main>;
  if (state.status === "error") return <main className="editor-page"><ErrorState title="Document unavailable">{state.message}</ErrorState><a href="#/atlas">Return to Atlas</a></main>;

  return <main className="editor-page">
    <header className="editor-page__header">
      <div><p className="eyebrow">Markdown workspace</p><h1>{state.file.relativePath.split("/").at(-1)}</h1><p>{state.file.relativePath}</p></div>
      <Badge tone={dirty ? "accent" : "muted"}>{dirty ? "Unsaved draft" : "Saved"}</Badge>
    </header>

    <section aria-label="Editor controls" className="editor-toolbar">
      <div className="editor-toolbar__modes">
        <Button aria-pressed={mode === "read"} onClick={() => setMode("read")} variant={mode === "read" ? "primary" : "secondary"}>Read</Button>
        <Button aria-pressed={mode === "split"} onClick={() => setMode("split")} variant={mode === "split" ? "primary" : "secondary"}>Source + preview</Button>
      </div>
      <Button disabled={!dirty || saving} onClick={() => void review()}>Review save</Button>
    </section>

    {notice && <p aria-live="polite" className="editor-notice editor-notice--success">{notice}</p>}
    {error && <p aria-live="assertive" className="editor-notice editor-notice--error">{error}</p>}

    {mode === "read" && <MarkdownPreview source={draft} />}
    {mode === "split" && <div className="editor-split">
      <section aria-label="Markdown source" className="editor-source"><MonacoEditor height="70vh" language="markdown" onChange={(value) => { setDraft(value ?? ""); setNotice(undefined); }} options={{ ariaLabel: "Markdown source editor", automaticLayout: true, minimap: { enabled: false }, wordWrap: "on", padding: { top: 16 } }} theme="vs-light" value={draft} /></section>
      <MarkdownPreview source={draft} />
    </div>}
    {mode === "diff" && diff && <><DiffReview preview={diff} /><div className="editor-save-actions"><Button onClick={() => setMode("split")} variant="secondary">Back to draft</Button><Button disabled={saving || diff.conflicted} onClick={() => void save()}>{saving ? "Saving…" : "Confirm save"}</Button></div></>}

    <Modal onClose={() => setPendingHash(undefined)} open={Boolean(pendingHash)} title="Discard unsaved draft?">
      <p>This draft has not been written. Continue only if you are comfortable discarding it.</p>
      <div className="editor-modal-actions"><Button onClick={() => setPendingHash(undefined)} variant="secondary">Keep editing</Button><Button onClick={() => { const target = pendingHash; setPendingHash(undefined); if (target) window.location.hash = target; }} variant="danger">Discard and leave</Button></div>
    </Modal>

    <Modal onClose={() => setConflict(undefined)} open={Boolean(conflict)} title="The source changed">
      <p>{conflict?.message} Your draft is still intact. Automatic merging is intentionally disabled.</p>
      {conflict?.currentRevision && <p className="editor-revision">Current revision: {conflict.currentRevision}</p>}
      <div className="editor-modal-actions"><Button onClick={() => void copyDraft()} variant="secondary">Copy draft</Button><Button onClick={() => void reloadCurrent()}>Reload current</Button></div>
    </Modal>
  </main>;
}
