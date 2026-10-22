import { promises as fs } from "node:fs";
import path from "node:path";
import { json, Router } from "express";
import type { ApiErrorResponse } from "../../src/shared/contracts.js";
import type {
  AtlasLearningState, AttemptResponse, LessonResponse, QuestEvidenceOption, ReviewItem
} from "../../src/shared/learning.js";
import { lessonHeadings } from "../../src/shared/learning.js";
import type { ContentNode } from "../../src/shared/contracts.js";
import { ContentIndex, getContentIndex, isSafeRelativePath } from "../content/index.js";
import { ActivityCatalog, getActivityCatalog, publicLesson } from "../learning/catalog.js";
import { LearningProgressStore, LearningValidationError, getLearningProgressStore } from "../learning/progress.js";

function error(code: ApiErrorResponse["error"]["code"], message: string): ApiErrorResponse {
  return { error: { code, message } };
}

function value(input: unknown): string | undefined {
  return typeof input === "string" ? input : undefined;
}

export function createLearningRouter(
  catalog: ActivityCatalog = getActivityCatalog(),
  store: LearningProgressStore = getLearningProgressStore(),
  content: ContentIndex = getContentIndex()
): Router {
  const router = Router();
  router.use(json({ limit: "16kb" }));

  router.get("/atlas", async (_request, response, next) => {
    try { response.json(await store.atlasState() satisfies AtlasLearningState); }
    catch (cause) { next(cause); }
  });

  router.put("/atlas/visit", async (request, response, next) => {
    const relativePath = value((request.body as Record<string, unknown> | undefined)?.path);
    if (!relativePath || !isSafeRelativePath(relativePath)) {
      response.status(400).json(error("BAD_REQUEST", "Provide a safe Atlas path.")); return;
    }
    try {
      const tree = await content.tree();
      const exists = (node: ContentNode): boolean => node.relativePath === relativePath || node.children.some(exists);
      if (!exists(tree.root)) { response.status(404).json(error("NOT_FOUND", "Atlas territory was not found.")); return; }
      response.json(await store.visitAtlas(relativePath) satisfies AtlasLearningState);
    } catch (cause) { next(cause); }
  });

  router.get("/lesson", async (request, response, next) => {
    const lessonPath = value(request.query.path);
    if (!lessonPath) { response.status(400).json(error("BAD_REQUEST", "Provide a lesson path.")); return; }
    try {
      const plan = await catalog.get(lessonPath);
      response.json({
        lesson: plan ? publicLesson(plan) : null,
        progress: plan ? await store.readLesson(lessonPath) : { activities: {} }
      } satisfies LessonResponse);
    } catch (cause) { next(cause); }
  });

  router.put("/position", async (request, response, next) => {
    const body = request.body as Record<string, unknown> | undefined;
    const lessonPath = value(body?.lessonPath);
    const heading = value(body?.heading);
    if (!lessonPath || (body?.heading !== undefined && !heading)) {
      response.status(400).json(error("BAD_REQUEST", "Provide a lesson path and optional heading slug.")); return;
    }
    try {
      const plan = await catalog.get(lessonPath);
      if (!plan) { response.status(404).json(error("NOT_FOUND", "Interactive lesson was not found.")); return; }
      if (heading) {
        const markdown = await fs.readFile(path.join(catalog.repositoryRoot, plan.lessonPath), "utf8");
        if (!lessonHeadings(markdown).some((item) => item.slug === heading)) {
          response.status(400).json(error("BAD_REQUEST", "Heading was not found in this lesson.")); return;
        }
      }
      response.json({ progress: await store.visit(lessonPath, heading) });
    } catch (cause) { next(cause); }
  });

  router.post("/attempt", async (request, response, next) => {
    const body = request.body as Record<string, unknown> | undefined;
    const lessonPath = value(body?.lessonPath);
    const activityId = value(body?.activityId);
    if (!lessonPath || !activityId || body?.response === undefined) {
      response.status(400).json(error("BAD_REQUEST", "Provide lessonPath, activityId and response.")); return;
    }
    try {
      const plan = await catalog.get(lessonPath);
      const activity = plan?.activities.find((item) => item.id === activityId);
      if (!plan || !activity) { response.status(404).json(error("NOT_FOUND", "Activity was not found.")); return; }
      response.json(await store.attempt(plan, activity, body.response) satisfies AttemptResponse);
    } catch (cause) {
      if (cause instanceof LearningValidationError) { response.status(400).json(error("BAD_REQUEST", cause.message)); return; }
      next(cause);
    }
  });

  router.get("/review", async (_request, response, next) => {
    try { response.json({ items: await store.due(await catalog.list()) } satisfies { items: ReviewItem[] }); }
    catch (cause) { next(cause); }
  });

  router.get("/evidence", async (request, response, next) => {
    const questId = value(request.query.questId);
    const milestoneId = value(request.query.milestoneId);
    if (!questId || !milestoneId) { response.status(400).json(error("BAD_REQUEST", "Provide questId and milestoneId.")); return; }
    try {
      response.json({ options: await store.evidence(await catalog.list(), questId, milestoneId) } satisfies { options: QuestEvidenceOption[] });
    } catch (cause) { next(cause); }
  });

  return router;
}
