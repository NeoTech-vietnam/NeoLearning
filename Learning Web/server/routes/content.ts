import { gzipSync } from "node:zlib";
import { Router } from "express";
import type { ApiErrorResponse, ContentNode } from "../../src/shared/contracts.js";
import type { ContentTreeResponse } from "../../src/shared/content.js";
import { ContentIndex, getContentIndex, isSafeRelativePath } from "../content/index.js";

function error(code: ApiErrorResponse["error"]["code"], message: string): ApiErrorResponse {
  return { error: { code, message } };
}

function singleQueryValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function atlasNode(node: ContentNode): ContentNode {
  return {
    id: node.id,
    title: node.title,
    kind: node.kind,
    ...(node.relativePath ? { relativePath: node.relativePath } : {}),
    ...(node.summary ? { summary: node.summary } : {}),
    ...(node.unindexed ? { unindexed: true } : {}),
    headings: [],
    children: node.children.map(atlasNode)
  };
}

export function createContentRouter(index: ContentIndex = getContentIndex()): Router {
  const router = Router();
  let atlasCache: { source: ContentTreeResponse; plain: string; gzip: Buffer } | undefined;

  router.get("/tree", async (request, response, next) => {
    try {
      const tree = await index.tree();
      if (request.query.view !== "atlas") {
        response.json(tree);
        return;
      }
      if (atlasCache?.source !== tree) {
        const plain = JSON.stringify({ root: atlasNode(tree.root), diagnostics: [], indexedAt: tree.indexedAt });
        atlasCache = { source: tree, plain, gzip: gzipSync(plain) };
      }
      response.vary("Accept-Encoding");
      if (request.acceptsEncodings("gzip")) {
        response.set("Content-Encoding", "gzip").type("json").send(atlasCache.gzip);
      } else {
        response.type("json").send(atlasCache.plain);
      }
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
