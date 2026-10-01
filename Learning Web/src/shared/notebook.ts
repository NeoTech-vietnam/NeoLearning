export interface NotebookEntry {
  id: string;
  kind: "note" | "bookmark";
  heading: string;
  quote: string;
  prefix: string;
  suffix: string;
  note: string;
  createdAt: string;
  sourceRevision?: string;
}
export interface ReadingNotebook {
  position?: string;
  positionRevision?: string;
  currentRevision?: string;
  entries: NotebookEntry[];
}
/** Resolve a quote only when its context identifies one exact occurrence. */
export function quoteOffset(text: string, quote: string, prefix = "", suffix = ""): number | undefined {
  if (!quote) return undefined;
  const matches: number[] = [];
  let start = 0;
  while (start <= text.length) {
    const at = text.indexOf(quote, start);
    if (at < 0) break;
    if ((!prefix || text.slice(Math.max(0, at - prefix.length), at) === prefix) &&
        (!suffix || text.slice(at + quote.length, at + quote.length + suffix.length) === suffix)) matches.push(at);
    start = at + 1;
  }
  return matches.length === 1 ? matches[0] : undefined;
}
