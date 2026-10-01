import { Children, isValidElement, useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Modal } from "../ui";

function textOf(node: ReactNode): string {
  return Children.toArray(node).map((child): string => typeof child === "string" || typeof child === "number" ? String(child)
    : isValidElement<{ children?: ReactNode }>(child) ? textOf(child.props.children) : "").join("");
}
/** Small lexical palette for common embedded languages; unknown languages stay plain. */
function coloredCode(text: string, language: string): ReactNode {
  if (!/^(c|cpp|c\+\+|h|js|javascript|ts|typescript|python|py|json|bash|sh)$/.test(language)) return text;
  const pattern = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|let|var|if|else|for|while|return|void|int|float|double|bool|struct|class|static|include|def|import|from|True|False|true|false|null|None|async|await)\b|\b\d+(?:\.\d+)?\b)/g;
  return text.split(pattern).map((part, index) => index % 2 === 1 ? <span key={index} className={`code-token code-token--${/^\//.test(part) ? "comment" : /^["']/.test(part) ? "string" : /^\d/.test(part) ? "number" : "keyword"}`}>{part}</span> : part);
}
function CodeBlock({ children }: { children?: ReactNode }) {
  const text = textOf(children);
  const child = Children.toArray(children).find(isValidElement);
  const language = isValidElement<{ className?: string }>(child) ? child.props.className?.replace("language-", "") ?? "text" : "text";
  const [collapsed, setCollapsed] = useState(text.split("\n").length > 18);
  const [notice, setNotice] = useState("");
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setNotice("Copied"); }
    catch { setNotice("Copy unavailable — select the code to copy manually."); }
  };
  return <div className="reader-code" data-collapsed={collapsed}>
    <div className="reader-code__tools"><span>{language}</span><button type="button" onClick={() => void copy()}>Copy code</button>
      {text.split("\n").length > 18 && <button type="button" aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>{collapsed ? "Expand code" : "Collapse code"}</button>}
      <span role="status">{notice}</span></div>
    <pre><code>{coloredCode(collapsed ? text.split("\n").slice(0, 12).join("\n") + "\n…" : text, language)}</code></pre>
  </div>;
}
export function RichMarkdown({ source, documentPath }: { source: string; documentPath?: string }) {
  const [image, setImage] = useState<{ src: string; alt: string }>();
  const root = useRef<HTMLDivElement>(null);
  const restoreLabel = useRef<string>();
  useEffect(() => {
    if (!image && restoreLabel.current) {
      root.current?.querySelector<HTMLButtonElement>(`button[aria-label="${CSS.escape(restoreLabel.current)}"]`)?.focus();
      restoreLabel.current = undefined;
    }
  }, [image]);
  const components = useMemo<Components>(() => ({
    pre: CodeBlock,
    table: ({ children }) => <div className="reader-table" tabIndex={0} role="region" aria-label="Scrollable table"><table>{children}</table></div>,
    img: ({ src, alt }) => {
      const resolved = src && documentPath && !/^(?:[a-z]+:|\/|#)/i.test(src) ? `/api/notebook/image?${new URLSearchParams({ path: documentPath, src })}` : src;
      return resolved ? <button className="reader-image" type="button" aria-label={`Enlarge image: ${alt || "illustration"}`} onClick={() => { restoreLabel.current = `Enlarge image: ${alt || "illustration"}`; setImage({ src: resolved, alt: alt ?? "" }); }}><img src={resolved} alt={alt ?? ""} loading="lazy" /></button> : null;
    }
  }), [documentPath]);
  return <div ref={root}><Markdown remarkPlugins={[remarkGfm]} skipHtml components={components}>{source}</Markdown>
    <Modal open={Boolean(image)} title={image?.alt || "Illustration"} onClose={() => setImage(undefined)}>
      {image && <img className="reader-image--large" src={image.src} alt={image.alt} />}
    </Modal></div>;
}
