import { json, Router, type ErrorRequestHandler } from "express";
import { getMarkdownFileStore, type MarkdownFileStore, asFileApiError } from "../files/index.js";
import { getNotebookStore, type NotebookStore } from "../notebook/index.js";
import { lessonHeadings } from "../../src/shared/learning.js";
import { promises as fs } from "node:fs";
import path from "node:path";

export function createNotebookRouter(store: NotebookStore = getNotebookStore(), files: MarkdownFileStore = getMarkdownFileStore()) {
  const router = Router();
  router.use(json({ limit: "32kb" }));
  router.use(((cause, _request, response, next) => {
    if (cause?.type === "entity.parse.failed" || cause?.type === "entity.too.large") {
      response.status(400).json({ error: { code: "BAD_REQUEST", message: "Provide valid JSON within the notebook payload limit." } }); return;
    }
    next(cause);
  }) satisfies ErrorRequestHandler);
  router.use(async (request, response, next) => {
    const documentPath = request.query.path;
    if (typeof documentPath !== "string") { response.status(400).json({ error: { code: "BAD_REQUEST", message: "Provide a Markdown path." } }); return; }
    try { response.locals.document = await files.read(documentPath); next(); }
    catch (cause) { const error = asFileApiError(cause); response.status(error.status).json({ error: { code: error.code, message: error.message } }); }
  });
  router.get("/", async (_request, response, next) => {
    try { response.json({ ...await store.snapshot(response.locals.document.relativePath), currentRevision: response.locals.document.revision }); } catch (cause) { next(cause); }
  });
  router.get("/image", async (request, response) => {
    const src = request.query.src;
    const fail = () => response.status(404).end();
    if (typeof src !== "string" || /^(?:[a-z]+:|\/|\\)/i.test(src) || src.includes("\\")) { fail(); return; }
    try {
      const root = await fs.realpath(process.env.NEOLEARNING_REPOSITORY_ROOT ?? path.resolve(process.cwd(), ".."));
      const relative = path.posix.normalize(path.posix.join(path.posix.dirname(response.locals.document.relativePath), decodeURIComponent(src)));
      const country = response.locals.document.relativePath.split("/")[0];
      if (!relative.startsWith(country + "/") || /(?:^|\/)examples?(?:\/|$)/i.test(relative)) { fail(); return; }
      const mime: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
      const type = mime[path.extname(relative).toLowerCase()];
      if (!type) { fail(); return; }
      const file = await fs.realpath(path.resolve(root, relative));
      if (!file.startsWith(path.join(root, country) + path.sep) || (await fs.stat(file)).size > 15_000_000) { fail(); return; }
      response.set("X-Content-Type-Options", "nosniff").type(type).send(await fs.readFile(file));
    } catch { fail(); }
  });
  router.all("/", async (request, response, next) => {
    const body = request.body as Record<string, unknown> | undefined;
    const document = response.locals.document;
    const bounded = (value: unknown, max: number): value is string => typeof value === "string" && value.length <= max;
    const bad = () => response.status(400).json({ error: { code: "BAD_REQUEST", message: "Invalid notebook entry or heading." } });
    const hasHeading = (value: unknown) => bounded(value, 600) && lessonHeadings(document.content).some((item) => item.slug === value);
    try {
      if ((request.method === "PUT" || request.method === "POST") && body?.baseRevision !== document.revision) {
        response.status(409).json({ error: { code: "CONFLICT", message: "The document changed. Reload before adding a notebook anchor." } }); return;
      }
      if (request.method === "PUT" && hasHeading(body?.position)) {
        response.json({ ...await store.position(document.relativePath, body!.position as string, document.revision), currentRevision: document.revision }); return;
      }
      if (request.method === "DELETE" && bounded(body?.id, 100)) {
        response.json({ ...await store.remove(document.relativePath, body!.id as string), currentRevision: document.revision }); return;
      }
      if (request.method === "PATCH" && bounded(body?.id, 100) && bounded(body?.note, 8000)) {
        response.json({ ...await store.update(document.relativePath, body!.id as string, body!.note as string), currentRevision: document.revision }); return;
      }
      if (request.method === "POST" && body && ["note", "bookmark"].includes(body.kind as string) &&
          bounded(body.heading, 600) && (body.heading === "" || hasHeading(body.heading)) && bounded(body.quote, 4000) &&
          bounded(body.prefix, 100) && bounded(body.suffix, 100) && bounded(body.note, 8000) &&
          (body.kind === "bookmark" ? hasHeading(body.heading) : body.quote.trim().length > 0)) {
        response.json({ ...await store.add(document.relativePath, { kind: body.kind as "note" | "bookmark", heading: body.heading,
          quote: body.quote, prefix: body.prefix, suffix: body.suffix, note: body.note, sourceRevision: document.revision }), currentRevision: document.revision }); return;
      }
      bad();
    } catch (cause) { next(cause); }
  });
  return router;
}
