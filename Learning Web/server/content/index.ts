import { Dirent, promises as fs } from "node:fs";
import path from "node:path";
import {
  type ContentDocument,
  type ContentHeading,
  type ContentNode,
  type ContentNodeKind
} from "../../src/shared/contracts.js";
import type {
  ContentDiagnostic,
  ContentDocumentResponse,
  ContentSearchResponse,
  ContentTreeResponse
} from "../../src/shared/content.js";

const COUNTRY_ROOTS = [
  "01_Hardware",
  "02_Software",
  "03_Interfaces-and-Protocols",
  "04_Soft-Skills",
  "05_Advanced-Topics",
  "06_Product_Concepts"
] as const;

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".data",
  "node_modules",
  "dist",
  "dist-server",
  "coverage"
]);
const SEARCH_RESULT_LIMIT = 50;

interface TaxonomyEntry {
  title: string;
  order: number;
}

interface ScannedDirectory {
  absolutePath: string;
  relativePath: string;
  directories: ScannedDirectory[];
  files: string[];
}

interface IndexedDocument {
  document: ContentDocument;
  node: ContentNode;
  diagnostics: ContentDiagnostic[];
  searchText: string;
}

interface BuiltIndex {
  response: ContentTreeResponse;
  documents: Map<string, IndexedDocument>;
  searchableNodes: Array<{ node: ContentNode; searchText: string }>;
}

function normalizeRelativePath(value: string): string {
  return value.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/+$/, "");
}

function stableId(relativePath: string): string {
  const normalized = normalizeRelativePath(relativePath).toLocaleLowerCase();
  return `content:${encodeURIComponent(normalized)}`;
}

function humanize(name: string): string {
  return name
    .replace(/\.md$/i, "")
    .replace(/^\d+[_-]?/, "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase()) || name;
}

function headingSlug(text: string): string {
  return text
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function parseScalar(value: string): string | number | boolean | null {
  const unquoted = value.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
  if (unquoted === "null") return null;
  if (unquoted === "true") return true;
  if (unquoted === "false") return false;
  const number = Number(unquoted);
  return Number.isFinite(number) && unquoted.trim() !== "" ? number : unquoted;
}

function parseMarkdown(content: string, relativePath: string): {
  body: string;
  title?: string;
  frontmatter: ContentDocument["frontmatter"];
  headings: ContentHeading[];
  summary?: string;
  plainText: string;
  diagnostics: ContentDiagnostic[];
} {
  const diagnostics: ContentDiagnostic[] = [];
  let body = content;
  const frontmatter: ContentDocument["frontmatter"] = {};

  if (content.startsWith("---")) {
    const closing = content.indexOf("\n---", 3);
    if (closing === -1) {
      diagnostics.push({
        code: "MALFORMED_FRONTMATTER",
        relativePath,
        message: "Opening YAML frontmatter delimiter has no closing delimiter."
      });
    } else {
      const lines = content.slice(3, closing).replace(/^\r?\n/, "").split(/\r?\n/);
      for (const line of lines) {
        if (!line.trim() || line.trimStart().startsWith("#")) continue;
        const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (!match) {
          diagnostics.push({
            code: "MALFORMED_FRONTMATTER",
            relativePath,
            message: `Cannot parse frontmatter line: ${line}`
          });
          continue;
        }
        frontmatter[match[1]] = parseScalar(match[2]);
      }
      body = content.slice(closing + 4).replace(/^\r?\n/, "");
    }
  }

  const headings: ContentHeading[] = [];
  const headingMatcher = /^(#{1,6})\s+(.+?)\s*#*\s*$/gm;
  for (const match of body.matchAll(headingMatcher)) {
    headings.push({ depth: match[1].length, text: match[2].trim(), slug: headingSlug(match[2].trim()) });
  }

  const fences = body.match(/^\s*```/gm)?.length ?? 0;
  if (fences % 2 !== 0) {
    diagnostics.push({
      code: "MALFORMED_MARKDOWN",
      relativePath,
      message: "Unclosed fenced code block."
    });
  }

  const plainText = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?(?:\[([^\]]*)\]\([^)]*\))/g, "$1")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const summary = plainText ? plainText.slice(0, 280) : undefined;
  const frontmatterTitle = typeof frontmatter.title === "string" ? frontmatter.title : undefined;

  return { body, title: frontmatterTitle ?? headings.find((heading) => heading.depth === 1)?.text, frontmatter, headings, summary, plainText, diagnostics };
}

function classifyDirectory(relativePath: string, unindexed: boolean): ContentNodeKind {
  if (unindexed) return "unindexed";
  const depth = normalizeRelativePath(relativePath).split("/").length;
  if (depth === 1) return "country";
  return depth === 2 ? "region" : "topic";
}

async function parseTaxonomy(repositoryRoot: string, diagnostics: ContentDiagnostic[]): Promise<Map<string, TaxonomyEntry>> {
  const result = new Map<string, TaxonomyEntry>();
  let readme: string;
  try {
    readme = await fs.readFile(path.join(repositoryRoot, "README.md"), "utf8");
  } catch (error) {
    diagnostics.push({ code: "READ_ERROR", relativePath: "README.md", message: `Cannot read root README: ${String(error)}` });
    return result;
  }

  let order = 0;
  for (const line of readme.split(/\r?\n/)) {
    const countryHeading = /^##\s+(\d{2})\s+[—-]\s+(.+?)\s*$/.exec(line);
    if (!countryHeading) continue;
    const country = COUNTRY_ROOTS.find((root) => root.startsWith(`${countryHeading[1]}_`));
    if (country && !result.has(country)) {
      result.set(country, { title: countryHeading[2].trim(), order: order++ });
    }
  }
  for (const match of readme.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    const relativePath = normalizeRelativePath(match[2]);
    if (!COUNTRY_ROOTS.some((country) => relativePath === country || relativePath.startsWith(`${country}/`))) continue;
    if (path.extname(relativePath)) continue;
    if (!result.has(relativePath)) result.set(relativePath, { title: match[1].trim(), order: order++ });
  }

  for (const country of COUNTRY_ROOTS) {
    if (!result.has(country)) {
      diagnostics.push({
        code: "MISSING_COUNTRY_TAXONOMY",
        relativePath: country,
        message: "Canonical country is absent from the root README taxonomy."
      });
    }
  }
  return result;
}

async function scanDirectory(absolutePath: string, relativePath: string): Promise<ScannedDirectory> {
  const directory: ScannedDirectory = { absolutePath, relativePath, directories: [], files: [] };
  let entries: Dirent[];
  try {
    entries = await fs.readdir(absolutePath, { withFileTypes: true });
  } catch {
    return directory;
  }

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.isSymbolicLink()) continue;
    const childRelativePath = normalizeRelativePath(path.posix.join(relativePath, entry.name));
    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      directory.directories.push(await scanDirectory(path.join(absolutePath, entry.name), childRelativePath));
    } else if (entry.isFile() && entry.name.toLocaleLowerCase().endsWith(".md")) {
      directory.files.push(childRelativePath);
    }
  }
  return directory;
}

async function readDocument(repositoryRoot: string, relativePath: string): Promise<IndexedDocument> {
  const absolutePath = path.join(repositoryRoot, relativePath);
  const content = await fs.readFile(absolutePath, "utf8");
  const parsed = parseMarkdown(content, relativePath);
  const metadata = await fs.stat(absolutePath);
  const title = parsed.title ?? humanize(path.posix.basename(relativePath));
  const document: ContentDocument = {
    id: stableId(relativePath),
    relativePath,
    title,
    content,
    revision: `${metadata.mtimeMs}:${metadata.size}`,
    modifiedAt: metadata.mtime.toISOString(),
    headings: parsed.headings,
    frontmatter: parsed.frontmatter
  };
  const node: ContentNode = {
    id: document.id,
    title,
    kind: "lesson",
    relativePath,
    summary: parsed.summary,
    headings: parsed.headings,
    children: [],
    modifiedAt: document.modifiedAt
  };
  return { document, node, diagnostics: parsed.diagnostics, searchText: `${title} ${relativePath} ${parsed.headings.map((heading) => heading.text).join(" ")} ${parsed.plainText}` };
}

function sortDirectories(directories: ScannedDirectory[], taxonomy: Map<string, TaxonomyEntry>): ScannedDirectory[] {
  return [...directories].sort((left, right) => {
    const leftOrder = taxonomy.get(left.relativePath)?.order;
    const rightOrder = taxonomy.get(right.relativePath)?.order;
    if (leftOrder !== undefined && rightOrder !== undefined) return leftOrder - rightOrder;
    if (leftOrder !== undefined) return -1;
    if (rightOrder !== undefined) return 1;
    return left.relativePath.localeCompare(right.relativePath);
  });
}

export async function buildContentIndex(repositoryRoot: string): Promise<BuiltIndex> {
  const diagnostics: ContentDiagnostic[] = [];
  const taxonomy = await parseTaxonomy(repositoryRoot, diagnostics);
  const documents = new Map<string, IndexedDocument>();
  const searchableNodes: Array<{ node: ContentNode; searchText: string }> = [];
  const indexedAt = new Date().toISOString();

  async function addDocument(relativePath: string, unindexed: boolean): Promise<ContentNode | undefined> {
    try {
      const indexed = await readDocument(repositoryRoot, relativePath);
      if (unindexed) indexed.node.unindexed = true;
      documents.set(relativePath, indexed);
      diagnostics.push(...indexed.diagnostics);
      searchableNodes.push({ node: indexed.node, searchText: indexed.searchText });
      return indexed.node;
    } catch (error) {
      diagnostics.push({ code: "READ_ERROR", relativePath, message: `Cannot read Markdown file: ${String(error)}` });
      return undefined;
    }
  }

  async function buildDirectory(directory: ScannedDirectory, unindexed: boolean): Promise<ContentNode> {
    const taxonomyEntry = taxonomy.get(directory.relativePath);
    const node: ContentNode = {
      id: stableId(directory.relativePath),
      title: taxonomyEntry?.title ?? humanize(path.posix.basename(directory.relativePath)),
      kind: classifyDirectory(directory.relativePath, unindexed),
      relativePath: directory.relativePath,
      section: directory.relativePath.split("/")[0],
      headings: [],
      children: [],
      unindexed: unindexed || undefined
    };
    searchableNodes.push({ node, searchText: `${node.title} ${directory.relativePath}` });

    const directUnindexed = sortDirectories(directory.directories, taxonomy).filter((child) => !taxonomy.has(child.relativePath));
    for (const child of sortDirectories(directory.directories, taxonomy).filter((child) => taxonomy.has(child.relativePath))) {
      node.children.push(await buildDirectory(child, false));
    }
    if (directUnindexed.length > 0) {
      const unchartedPath = `${directory.relativePath}/__uncharted`;
      const uncharted: ContentNode = {
        id: stableId(unchartedPath),
        title: "Uncharted",
        kind: "unindexed",
        relativePath: unchartedPath,
        section: directory.relativePath.split("/")[0],
        headings: [],
        children: [],
        unindexed: true
      };
      for (const child of directUnindexed) {
        diagnostics.push({
          code: "UNINDEXED_PATH",
          relativePath: child.relativePath,
          message: "Discovered on disk but absent from the root README taxonomy."
        });
        uncharted.children.push(await buildDirectory(child, true));
      }
      node.children.push(uncharted);
    }
    for (const file of directory.files.sort((left, right) => left.localeCompare(right))) {
      const documentNode = await addDocument(file, unindexed);
      if (documentNode) node.children.push(documentNode);
    }
    return node;
  }

  const world: ContentNode = {
    id: stableId(""),
    title: "Embedded World",
    kind: "world",
    headings: [],
    children: []
  };

  for (const country of COUNTRY_ROOTS) {
    const countryPath = path.join(repositoryRoot, country);
    try {
      const stat = await fs.lstat(countryPath);
      if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("Not a readable directory");
      world.children.push(await buildDirectory(await scanDirectory(countryPath, country), false));
    } catch {
      diagnostics.push({
        code: "README_LINK_MISSING",
        relativePath: country,
        message: "Canonical country is not present on disk."
      });
      world.children.push({
        id: stableId(country),
        title: taxonomy.get(country)?.title ?? humanize(country),
        kind: "country",
        relativePath: country,
        section: country,
        headings: [],
        children: []
      });
    }
  }

  for (const indexedPath of taxonomy.keys()) {
    try {
      const stat = await fs.lstat(path.join(repositoryRoot, indexedPath));
      if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("not a directory");
    } catch {
      diagnostics.push({
        code: "README_LINK_MISSING",
        relativePath: indexedPath,
        message: "Root README references a directory that is not present on disk."
      });
    }
  }

  return { response: { root: world, diagnostics, indexedAt }, documents, searchableNodes };
}

export class ContentIndex {
  private current?: BuiltIndex;

  public constructor(private readonly repositoryRoot: string) {}

  public async refresh(): Promise<ContentTreeResponse> {
    this.current = await buildContentIndex(this.repositoryRoot);
    return this.current.response;
  }

  public async tree(): Promise<ContentTreeResponse> {
    if (!this.current) await this.refresh();
    return this.current!.response;
  }

  public async document(relativePath: string): Promise<ContentDocumentResponse | undefined> {
    const normalizedPath = normalizeRelativePath(relativePath);
    if (!isSafeRelativePath(normalizedPath)) return undefined;
    if (!this.current) await this.refresh();
    const indexed = this.current!.documents.get(normalizedPath);
    return indexed ? { document: indexed.document, diagnostics: indexed.diagnostics } : undefined;
  }

  public async search(query: string): Promise<ContentSearchResponse> {
    if (!this.current) await this.refresh();
    const normalizedQuery = query.trim();
    const needle = normalizedQuery.toLocaleLowerCase();
    const results = needle
      ? this.current!.searchableNodes
          .filter(({ searchText }) => searchText.toLocaleLowerCase().includes(needle))
          .slice(0, SEARCH_RESULT_LIMIT)
          .map(({ node, searchText }) => ({ node, excerpt: excerptFor(searchText, needle) }))
      : [];
    return { query: normalizedQuery, results };
  }
}

function excerptFor(text: string, query: string): string | undefined {
  const lowerText = text.toLocaleLowerCase();
  const position = lowerText.indexOf(query);
  if (position === -1) return undefined;
  return text.slice(Math.max(0, position - 80), position + query.length + 160).trim();
}

export function isSafeRelativePath(value: string): boolean {
  return Boolean(value) && !path.isAbsolute(value) && !value.split("/").some((segment) => segment === ".." || segment === ".") && !value.includes("\0");
}

let processIndex: ContentIndex | undefined;

export function getContentIndex(repositoryRoot = path.resolve(process.cwd(), "..")): ContentIndex {
  if (!processIndex) processIndex = new ContentIndex(repositoryRoot);
  return processIndex;
}

/** Call this after a successful curriculum-file save to keep API reads current. */
export async function refreshContentIndex(): Promise<ContentTreeResponse> {
  return getContentIndex().refresh();
}
