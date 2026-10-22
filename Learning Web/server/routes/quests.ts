import { Router } from "express";
import type { ApiErrorResponse } from "../../src/shared/contracts.js";
import type { QuestDetailResponse, QuestListResponse } from "../../src/shared/quests.js";
import { QuestCatalog, getQuestCatalog } from "../quests/index.js";

function error(code: ApiErrorResponse["error"]["code"], message: string): ApiErrorResponse {
  return { error: { code, message } };
}

export function createQuestRouter(catalog: QuestCatalog = getQuestCatalog()): Router {
  const router = Router();
  router.get("/", async (_request, response, next) => {
    try { response.json({ quests: await catalog.list() } satisfies QuestListResponse); }
    catch (cause) { next(cause); }
  });
  router.get("/:questId", async (request, response, next) => {
    try {
      const quest = await catalog.get(request.params.questId);
      if (!quest) { response.status(404).json(error("NOT_FOUND", "Quest was not found.")); return; }
      response.json({ quest } satisfies QuestDetailResponse);
    } catch (cause) { next(cause); }
  });
  return router;
}
