import { createHash, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ApiErrorCode } from "../../src/shared/contracts.js";
import type {
  FileDiffLine,
  FileDiffPreview,
  FileMutationRequest,
  MarkdownFile
} from "../../src/shared/files.js";

const PROTECTED_DIRECTORY_NAMES = new Set([
  ".git",
  ".data",
  "node_modules",
  "dist",
  "dist-server",
  "build",
  "coverage"
]);
const SHA256_REVISION = /^[a-f0-9]{64}$/;

export class FileApiError extends Error {
  public constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details?: Record<string, string | number | boolean | null>
  ) {
    super(message);
    this.name = "FileApiError";
  }
}

interface ResolvedMarkdownFile {
  canonicalPath: string;
  relativePath: string;
}

interface FileSnapshot extends MarkdownFile {
  mode: number;
}

function isInside(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join("/");
}

function invalidPath(message: string): FileApiError {
  return new FileApiError(400, "BAD_REQUEST", message);
}

function forbiddenPath(): FileApiError {
  return new FileApiError(403, "FORBIDDEN", "This path is not available for editing.");
}

function validateRelativePath(value: string): string[] {
  if (!value || value.includes("\0")) {
    throw invalidPath("Path must be a non-empty repository-relative Markdown path.");
  }
  if (path.isAbsolute(value) || path.win32.isAbsolute(value)) {
    throw invalidPath("Path must be repository-relative.");
  }

  const segments = value.replaceAll("\\", "/").split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw invalidPath("Path must not contain traversal segments.");
  }
  if (segments.some((segment) => PROTECTED_DIRECTORY_NAMES.has(segment.toLocaleLowerCase()))) {
    throw forbiddenPath();
  }
  if (!segments.at(-1)?.toLocaleLowerCase().endsWith(".md")) {
    throw invalidPath("Only Markdown files may be edited.");
  }
  return segments;
}

function hash(contents: Buffer): string {
  return createHash("sha256").update(contents).digest("hex");
}

function splitLines(content: string): string[] {
  return content.split(/\r?\n/);
}

/**
 * Myers' shortest-edit-script algorithm. It keeps a line-level diff usable by
 * the editor without bringing a diff dependency into the local application.
 */
function calculateLineDiff(current: string, proposed: string): FileDiffLine[] {
  const before = splitLines(current);
  const after = splitLines(proposed);
  const trace: Array<Map<number, number>> = [];
  const frontier = new Map<number, number>([[1, 0]]);
  const maximumDistance = before.length + after.length;

  for (let distance = 0; distance <= maximumDistance; distance += 1) {
    trace.push(new Map(frontier));
    for (let diagonal = -distance; diagonal <= distance; diagonal += 2) {
      const down = frontier.get(diagonal + 1) ?? Number.NEGATIVE_INFINITY;
      const right = frontier.get(diagonal - 1) ?? Number.NEGATIVE_INFINITY;
      let x = diagonal === -distance || (diagonal !== distance && right < down)
        ? down
        : right + 1;
      let y = x - diagonal;
      while (x < before.length && y < after.length && before[x] === after[y]) {
        x += 1;
        y += 1;
      }
      frontier.set(diagonal, x);
      if (x >= before.length && y >= after.length) {
        return backtrackLineDiff(trace, before, after);
      }
    }
  }

  return [];
}

function backtrackLineDiff(
  trace: Array<Map<number, number>>,
  before: string[],
  after: string[]
): FileDiffLine[] {
  const reversed: FileDiffLine[] = [];
  let oldIndex = before.length;
  let newIndex = after.length;

  for (let distance = trace.length - 1; distance > 0; distance -= 1) {
    const frontier = trace[distance];
    const diagonal = oldIndex - newIndex;
    const down = frontier.get(diagonal + 1) ?? Number.NEGATIVE_INFINITY;
    const right = frontier.get(diagonal - 1) ?? Number.NEGATIVE_INFINITY;
    const previousDiagonal = diagonal === -distance || (diagonal !== distance && right < down)
      ? diagonal + 1
      : diagonal - 1;
    const previousOldIndex = frontier.get(previousDiagonal) ?? 0;
    const previousNewIndex = previousOldIndex - previousDiagonal;

    while (oldIndex > previousOldIndex && newIndex > previousNewIndex) {
      reversed.push({ kind: "context", content: before[oldIndex - 1], oldLine: oldIndex, newLine: newIndex });
      oldIndex -= 1;
      newIndex -= 1;
    }

    if (oldIndex === previousOldIndex) {
      reversed.push({ kind: "added", content: after[newIndex - 1], newLine: newIndex });
      newIndex -= 1;
    } else {
      reversed.push({ kind: "removed", content: before[oldIndex - 1], oldLine: oldIndex });
      oldIndex -= 1;
    }
  }

  while (oldIndex > 0 && newIndex > 0) {
    reversed.push({ kind: "context", content: before[oldIndex - 1], oldLine: oldIndex, newLine: newIndex });
    oldIndex -= 1;
    newIndex -= 1;
  }
  while (oldIndex > 0) {
    reversed.push({ kind: "removed", content: before[oldIndex - 1], oldLine: oldIndex });
    oldIndex -= 1;
  }
  while (newIndex > 0) {
    reversed.push({ kind: "added", content: after[newIndex - 1], newLine: newIndex });
    newIndex -= 1;
  }
  return reversed.reverse();
}

export function asFileApiError(cause: unknown): FileApiError {
  if (cause instanceof FileApiError) return cause;
  const code = typeof cause === "object" && cause !== null && "code" in cause ? cause.code : undefined;
  if (code === "ENOENT" || code === "ENOTDIR") {
    return new FileApiError(404, "NOT_FOUND", "Markdown file was not found.");
  }
  if (code === "EACCES" || code === "EPERM") {
    return new FileApiError(403, "FORBIDDEN", "This file is not available for editing.");
  }
  return new FileApiError(500, "INTERNAL_ERROR", "The file operation could not be completed.");
}

/** A repository-root constrained Markdown reader and explicit-write service. */
export class MarkdownFileStore {
  private readonly writeChains = new Map<string, Promise<void>>();
  private canonicalRootPromise?: Promise<string>;

  public constructor(private readonly repositoryRoot: string) {}

  public async read(relativePath: string): Promise<MarkdownFile> {
    try {
      return this.toPublicFile(await this.readSnapshot(await this.resolveExisting(relativePath)));
    } catch (cause) {
      throw asFileApiError(cause);
    }
  }

  public async previewDiff(request: FileMutationRequest): Promise<FileDiffPreview> {
    this.validateMutation(request);
    try {
      const current = await this.readSnapshot(await this.resolveExisting(request.path));
      return {
        relativePath: current.relativePath,
        baseRevision: request.baseRevision,
        currentRevision: current.revision,
        conflicted: current.revision !== request.baseRevision,
        diff: calculateLineDiff(current.content, request.content)
      };
    } catch (cause) {
      throw asFileApiError(cause);
    }
  }

  public async write(request: FileMutationRequest): Promise<MarkdownFile> {
    this.validateMutation(request);
    let resolved: ResolvedMarkdownFile;
    try {
      resolved = await this.resolveExisting(request.path);
    } catch (cause) {
      throw asFileApiError(cause);
    }

    return this.serialize(resolved.canonicalPath, async () => {
      try {
        // Resolve again after acquiring the canonical-path lock so a concurrent
        // caller cannot validate a stale revision and then overwrite a new one.
        const resolvedCurrent = await this.resolveExisting(request.path);
        const current = await this.readSnapshot(resolvedCurrent);
        if (current.revision !== request.baseRevision) {
          throw new FileApiError(409, "CONFLICT", "The Markdown file changed since it was read.", {
            currentRevision: current.revision
          });
        }
        await this.atomicReplace({ ...current, ...resolvedCurrent }, request.content);
        return this.toPublicFile(await this.readSnapshot(await this.resolveExisting(current.relativePath)));
      } catch (cause) {
        throw asFileApiError(cause);
      }
    });
  }

  private validateMutation(request: FileMutationRequest): void {
    if (!request || typeof request.path !== "string" || typeof request.baseRevision !== "string" || typeof request.content !== "string") {
      throw invalidPath("Request must include a path, base revision, and Markdown content.");
    }
    validateRelativePath(request.path);
    if (!SHA256_REVISION.test(request.baseRevision)) {
      throw invalidPath("Base revision must be a SHA-256 revision hash.");
    }
  }

  private async canonicalRoot(): Promise<string> {
    if (!this.canonicalRootPromise) {
      this.canonicalRootPromise = fs.realpath(this.repositoryRoot);
    }
    try {
      return await this.canonicalRootPromise;
    } catch (cause) {
      throw asFileApiError(cause);
    }
  }

  private async resolveExisting(requestedPath: string): Promise<ResolvedMarkdownFile> {
    const segments = validateRelativePath(requestedPath);
    const root = await this.canonicalRoot();
    const lexicalPath = path.resolve(root, ...segments);
    if (!isInside(root, lexicalPath)) throw forbiddenPath();

    let canonicalPath: string;
    try {
      canonicalPath = await fs.realpath(lexicalPath);
    } catch (cause) {
      throw asFileApiError(cause);
    }
    if (!isInside(root, canonicalPath)) throw forbiddenPath();

    const relativePath = toPortablePath(path.relative(root, canonicalPath));
    validateRelativePath(relativePath);
    let metadata;
    try {
      metadata = await fs.stat(canonicalPath);
    } catch (cause) {
      throw asFileApiError(cause);
    }
    if (!metadata.isFile()) {
      throw invalidPath("Path must identify a Markdown file.");
    }
    return { canonicalPath, relativePath };
  }

  private async readSnapshot(resolved: ResolvedMarkdownFile): Promise<FileSnapshot> {
    const [contents, metadata] = await Promise.all([
      fs.readFile(resolved.canonicalPath),
      fs.stat(resolved.canonicalPath)
    ]);
    if (!metadata.isFile()) throw invalidPath("Path must identify a Markdown file.");
    return {
      relativePath: resolved.relativePath,
      content: contents.toString("utf8"),
      mtime: metadata.mtime.toISOString(),
      revision: hash(contents),
      mode: metadata.mode
    };
  }

  private toPublicFile(snapshot: FileSnapshot): MarkdownFile {
    const { mode: _mode, ...document } = snapshot;
    return document;
  }

  private async atomicReplace(current: FileSnapshot & ResolvedMarkdownFile, content: string): Promise<void> {
    const directory = path.dirname(current.canonicalPath);
    const temporaryPath = path.join(directory, `.${path.basename(current.canonicalPath)}.${process.pid}.${randomUUID()}.tmp`);
    let handle: Awaited<ReturnType<typeof fs.open>> | undefined;
    try {
      handle = await fs.open(temporaryPath, "wx", 0o600);
      await handle.writeFile(content, "utf8");
      await handle.chmod(current.mode & 0o777);
      await handle.sync();
      await handle.close();
      handle = undefined;
      await fs.rename(temporaryPath, current.canonicalPath);
    } finally {
      await handle?.close().catch(() => undefined);
      await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
    }
  }

  private async serialize<T>(canonicalPath: string, operation: () => Promise<T>): Promise<T> {
    const previous = this.writeChains.get(canonicalPath) ?? Promise.resolve();
    let release: (() => void) | undefined;
    const completion = new Promise<void>((resolve) => {
      release = resolve;
    });
    const chain = previous.then(() => completion);
    this.writeChains.set(canonicalPath, chain);
    await previous;
    try {
      return await operation();
    } finally {
      release!();
      if (this.writeChains.get(canonicalPath) === chain) this.writeChains.delete(canonicalPath);
    }
  }
}

let processStore: MarkdownFileStore | undefined;

export function getMarkdownFileStore(repositoryRoot = path.resolve(process.cwd(), "..")): MarkdownFileStore {
  if (!processStore) processStore = new MarkdownFileStore(repositoryRoot);
  return processStore;
}
