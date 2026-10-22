import { json, Router } from "express";
import { calendarDay, collectAchievements, getExplorerStore, type ExplorerStore } from "../explorer/index.js";
import { expeditionClues, gradeClue } from "../explorer/clues.js";
import { EXP_REWARDS } from "../../src/shared/explorer.js";

export function createExplorerRouter(store: ExplorerStore = getExplorerStore()): Router {
  const router = Router();
  router.use(json({ limit: "4kb" }));
  router.get("/clues/:questId", (request, response) => { response.json({ clues: expeditionClues(request.params.questId) }); });
  router.post("/clues/:questId/:milestoneId", async (request, response, next) => {
    let result;
    try { result = gradeClue(request.params.questId, request.params.milestoneId, (request.body as Record<string, unknown> | undefined)?.response); }
    catch { response.status(400).json({ error: { code: "BAD_REQUEST", message: "Choose one of the offered answers." } }); return; }
    if (!result) { response.status(404).json({ error: { code: "NOT_FOUND", message: "Clue not found." } }); return; }
    try {
      if (result.correct) {
        const now = store.clock();
        await store.sync([{ id: `clue:${request.params.questId}:${request.params.milestoneId}`, label: `Field clue · ${expeditionClues(request.params.questId).find((item) => item.milestoneId === request.params.milestoneId)!.title}`, exp: EXP_REWARDS.activity, earnedAt: now.toISOString() }], [calendarDay(now, store.timeZone)]);
      }
      response.json(result);
    } catch (cause) { next(cause); }
  });
  router.get("/", async (_request, response, next) => {
    try { response.json(await store.snapshot()); } catch (cause) { next(cause); }
  });
  for (const action of ["sync", "check-in"] as const) router.post(`/${action}`, async (_request, response, next) => {
    try {
      const earned = await collectAchievements(store.timeZone);
      response.json(await store.sync(earned.rewards, earned.learningDays, action === "check-in"));
    } catch (cause) { next(cause); }
  });
  return router;
}
