/** Transport contracts for explicit, conflict-aware Markdown authoring. */

export interface MarkdownFile {
  relativePath: string;
  content: string;
  /** ISO-8601 timestamp from the filesystem metadata. */
  mtime: string;
  /** SHA-256 of the file bytes, used for optimistic concurrency. */
  revision: string;
}

export interface FileMutationRequest {
  path: string;
  baseRevision: string;
  content: string;
}

export type FileDiffLineKind = "context" | "added" | "removed";

/** A single logical line in a preview of the current file against a draft. */
export interface FileDiffLine {
  kind: FileDiffLineKind;
  content: string;
  oldLine?: number;
  newLine?: number;
}

export interface FileDiffPreview {
  relativePath: string;
  baseRevision: string;
  currentRevision: string;
  conflicted: boolean;
  diff: FileDiffLine[];
}
