import express, { Router, type ErrorRequestHandler } from "express";
import type { ApiErrorResponse } from "../../src/shared/contracts.js";
import type { FileMutationRequest, MarkdownFile } from "../../src/shared/files.js";
import { asFileApiError, FileApiError, getMarkdownFileStore, MarkdownFileStore } from "../files/index.js";

function errorResponse(error: FileApiError): ApiErrorResponse {
  return {
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {})
    }
  };
}

function singleQueryValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function mutationRequest(value: unknown): FileMutationRequest | undefined {
  if (!value || typeof value !== "object") return undefined;
  const body = value as Record<string, unknown>;
  return typeof body.path === "string" && typeof body.baseRevision === "string" && typeof body.content === "string"
    ? { path: body.path, baseRevision: body.baseRevision, content: body.content }
    : undefined;
}

function sendError(response: Parameters<ErrorRequestHandler>[2], cause: unknown): void {
  const error = asFileApiError(cause);
  response.status(error.status).json(errorResponse(error));
}

export type FileWriteListener = (file: MarkdownFile) => void | Promise<void>;

export function createFilesRouter(
  store: MarkdownFileStore = getMarkdownFileStore(),
  onWrite?: FileWriteListener
): Router {
  const router = Router();
  router.use(express.json({ limit: "5mb" }));
  router.use(((cause, _request, response, next) => {
    if (cause && typeof cause === "object" && "type" in cause && cause.type === "entity.parse.failed") {
      response.status(400).json(errorResponse(new FileApiError(400, "BAD_REQUEST", "Request body must be valid JSON.")));
      return;
    }
    if (cause && typeof cause === "object" && "type" in cause && cause.type === "entity.too.large") {
      response.status(400).json(errorResponse(new FileApiError(400, "BAD_REQUEST", "Request body is too large.")));
      return;
    }
    next(cause);
  }) satisfies ErrorRequestHandler);

  router.get("/read", async (request, response) => {
    const relativePath = singleQueryValue(request.query.path);
    if (!relativePath) {
      sendError(response, new FileApiError(400, "BAD_REQUEST", "Query parameter path is required."));
      return;
    }
    try {
      response.json(await store.read(relativePath));
    } catch (cause) {
      sendError(response, cause);
    }
  });

  router.post("/preview-diff", async (request, response) => {
    const body = mutationRequest(request.body);
    if (!body) {
      sendError(response, new FileApiError(400, "BAD_REQUEST", "Request must include a path, base revision, and Markdown content."));
      return;
    }
    try {
      response.json(await store.previewDiff(body));
    } catch (cause) {
      sendError(response, cause);
    }
  });

  router.put("/write", async (request, response) => {
    const body = mutationRequest(request.body);
    if (!body) {
      sendError(response, new FileApiError(400, "BAD_REQUEST", "Request must include a path, base revision, and Markdown content."));
      return;
    }
    try {
      const file = await store.write(body);
      await onWrite?.(file);
      response.json(file);
    } catch (cause) {
      sendError(response, cause);
    }
  });

  return router;
}
