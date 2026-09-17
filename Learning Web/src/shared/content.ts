import type { ContentDocument, ContentNode } from "./contracts.js";

export type ContentDiagnosticCode =
  | "MALFORMED_FRONTMATTER"
  | "MALFORMED_MARKDOWN"
  | "README_LINK_MISSING"
  | "MISSING_COUNTRY_TAXONOMY"
  | "UNINDEXED_PATH"
  | "READ_ERROR";

export interface ContentDiagnostic {
  code: ContentDiagnosticCode;
  relativePath: string;
  message: string;
}

export interface ContentTreeResponse {
  root: ContentNode;
  diagnostics: ContentDiagnostic[];
  indexedAt: string;
}

export interface ContentDocumentResponse {
  document: ContentDocument;
  diagnostics: ContentDiagnostic[];
}

export interface ContentSearchResult {
  node: ContentNode;
  excerpt?: string;
}

export interface ContentSearchResponse {
  query: string;
  results: ContentSearchResult[];
}
