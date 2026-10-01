import { RichMarkdown } from "./RichMarkdown";

export function markdownBody(source: string): string {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
}

export function MarkdownPreview({ source, documentPath }: { source: string; documentPath?: string }) {
  return <article className="markdown-preview">
    <RichMarkdown source={markdownBody(source)} documentPath={documentPath} />
  </article>;
}
