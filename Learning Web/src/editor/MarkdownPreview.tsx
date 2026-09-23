import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function markdownBody(source: string): string {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
}

export function MarkdownPreview({ source }: { source: string }) {
  return <article className="markdown-preview">
    <Markdown remarkPlugins={[remarkGfm]} skipHtml>{markdownBody(source)}</Markdown>
  </article>;
}
