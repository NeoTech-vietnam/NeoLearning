import { Router } from "express";
import type { ApiErrorResponse } from "../../src/shared/contracts.js";
import { ContentIndex, getContentIndex, isSafeRelativePath } from "../content/index.js";

function error(code: ApiErrorResponse["error"]["code"], message: string): ApiErrorResponse {
  return { error: { code, message } };
}

function singleQueryValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function createContentRouter(index: ContentIndex = getContentIndex()): Router {
  const router = Router();

  router.get("/tree", async (_request, response, next) => {
    try {
      response.json(await index.tree());
    } catch (cause) {
      next(cause);
    }
  });

  router.get("/document", async (request, response, next) => {
    const relativePath = singleQueryValue(request.query.path);
    if (!relativePath || !isSafeRelativePath(relativePath)) {
      response.status(400).json(error("BAD_REQUEST", "Query parameter path must be a safe repository-relative Markdown path."));
      return;
    }
    try {
      const document = await index.document(relativePath);
      if (!document) {
        response.status(404).json(error("NOT_FOUND", "Markdown document was not found in the content index."));
        return;
      }
      response.json(document);
    } catch (cause) {
      next(cause);
    }
  });

  router.get("/search", async (request, response, next) => {
    const query = singleQueryValue(request.query.q)?.trim();
    if (!query) {
      response.status(400).json(error("BAD_REQUEST", "Query parameter q must not be empty."));
      return;
    }
    try {
      response.json(await index.search(query));
    } catch (cause) {
      next(cause);
    }
  });

  return router;
}
