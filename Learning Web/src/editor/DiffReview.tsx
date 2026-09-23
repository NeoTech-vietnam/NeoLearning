import type { FileDiffPreview } from "../shared/files";

export function DiffReview({ preview }: { preview: FileDiffPreview }) {
  return <section aria-label="Markdown changes" className="editor-diff">
    <header><h2>Review changes</h2><p>{preview.conflicted ? "The source changed after this draft was opened." : "These exact changes will be written."}</p></header>
    <pre>{preview.diff.map((line, index) => <span className={`editor-diff__line editor-diff__line--${line.kind}`} key={`${line.kind}:${line.oldLine ?? ""}:${line.newLine ?? ""}:${index}`}>
      <span aria-hidden="true">{line.kind === "added" ? "+" : line.kind === "removed" ? "−" : " "}</span>
      <span>{line.oldLine ?? ""}</span><span>{line.newLine ?? ""}</span><code>{line.content || " "}</code>
    </span>)}</pre>
  </section>;
}
