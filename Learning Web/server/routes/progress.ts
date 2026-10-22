import { json, Router } from "express";
import type { ApiErrorResponse } from "../../src/shared/contracts.js";
import type { AllProgressResponse, QuestProgressResponse, SetMilestoneProgressRequest, SetMilestoneProgressResponse } from "../../src/shared/quests.js";
import { ProgressStore, ProgressValidationError, getProgressStore } from "../progress/index.js";
import { QuestCatalog, getQuestCatalog } from "../quests/index.js";

function error(code: ApiErrorResponse["error"]["code"], message: string): ApiErrorResponse {
  return { error: { code, message } };
}

function requestBody(value: unknown): SetMilestoneProgressRequest | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const body = value as Record<string, unknown>;
  if (body.status !== "not-started" && body.status !== "in-progress" && body.status !== "complete") return undefined;
  if (body.evidence !== undefined && typeof body.evidence !== "string") return undefined;
  if (body.journal !== undefined && (!body.journal || typeof body.journal !== "object" || Array.isArray(body.journal))) return undefined;
  return { status: body.status, ...(typeof body.evidence === "string" ? { evidence: body.evidence } : {}), ...(body.journal ? { journal: body.journal as SetMilestoneProgressRequest["journal"] } : {}) };
}

export function createProgressRouter(catalog: QuestCatalog = getQuestCatalog(), store: ProgressStore = getProgressStore()): Router {
  const router = Router();
  router.use(json());
  router.get("/", async (_request, response, next) => {
    try { response.json({ progress: await store.readState() } satisfies AllProgressResponse); }
    catch (cause) { next(cause); }
  });
  router.get("/:questId", async (request, response, next) => {
    try {
      const quest = await catalog.get(request.params.questId);
      if (!quest) { response.status(404).json(error("NOT_FOUND", "Quest was not found.")); return; }
      response.json({ progress: await store.readQuest(quest) } satisfies QuestProgressResponse);
    } catch (cause) { next(cause); }
  });
  router.put("/:questId/milestones/:milestoneId", async (request, response, next) => {
    const body = requestBody(request.body);
    if (!body) { response.status(400).json(error("BAD_REQUEST", "Body must contain a valid milestone status and optional evidence string.")); return; }
    try {
      const quest = await catalog.get(request.params.questId);
      if (!quest) { response.status(404).json(error("NOT_FOUND", "Quest was not found.")); return; }
      response.json({ progress: await store.setMilestone(quest, request.params.milestoneId, body.status, body.evidence, body.journal) } satisfies SetMilestoneProgressResponse);
    } catch (cause) {
      if (cause instanceof ProgressValidationError) { response.status(400).json(error("BAD_REQUEST", cause.message)); return; }
      next(cause);
    }
  });
  return router;
}
