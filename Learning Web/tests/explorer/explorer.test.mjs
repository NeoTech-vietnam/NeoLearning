import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createServer } from "node:http";
import express from "express";
import test from "node:test";
import { ExplorerStore, calendarDay, collectAchievements, dayStreak } from "../../server/explorer/index.ts";
import { expeditionClues, gradeClue } from "../../server/explorer/clues.ts";
import { createExplorerRouter } from "../../server/routes/explorer.ts";
import { ProgressStore, ProgressValidationError } from "../../server/progress/index.ts";

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "neo-explorer-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}
test("calendar boundaries and streak grace do not depend on client timezone", () => {
  assert.equal(calendarDay(new Date("2026-09-30T17:30:00Z"), "Asia/Jakarta"), "2026-10-01");
  assert.equal(dayStreak(["2026-09-29", "2026-09-30"], "2026-10-01"), 2);
  assert.equal(dayStreak(["2026-09-29", "2026-09-30"], "2026-10-02"), 0);
  assert.equal(dayStreak(["2026-09-29", "2026-09-30", "2026-09-30"], "2026-09-30"), 2);
  assert.throws(() => new ExplorerStore("unused", "Invalid/Timezone"), RangeError);
});
test("concurrent check-ins and achievement replay grant once, persist and never remove EXP", async (t) => {
  const root = await fixture(t); let now = new Date("2026-09-30T09:00:00Z");
  const store = new ExplorerStore(path.join(root, "explorer.json"), "Asia/Jakarta", () => now);
  const reward = { id: "activity:lesson:quiz", label: "Quiz", exp: 20, earnedAt: now.toISOString() };
  await Promise.all(Array.from({ length: 30 }, () => store.sync([reward], ["2026-09-30"], true)));
  let profile = await store.snapshot();
  assert.equal(profile.totalExp, 25); assert.equal(profile.rewards.length, 2);
  assert.equal(profile.learningStreak, 1); assert.equal(profile.checkInStreak, 1);
  assert.equal((await new ExplorerStore(store.filePath, "Asia/Jakarta", () => now).snapshot()).totalExp, 25);
  now = new Date("2026-10-01T09:00:00Z");
  profile = await store.sync([], [], true);
  assert.equal(profile.totalExp, 30); assert.equal(profile.checkInStreak, 2);
  assert.equal(profile.learningStreak, 1);
  now = new Date("2026-10-05T09:00:00Z");
  profile = await store.sync([], []);
  assert.equal(profile.totalExp, 30); assert.equal(profile.checkInStreak, 0);
});
test("corrupted or incompatible ledger fails without overwrite", async (t) => {
  const root = await fixture(t); const file = path.join(root, "explorer.json");
  for (const source of ["broken json", JSON.stringify({ schemaVersion: 2 }), JSON.stringify({ schemaVersion: 1, checkIns: [], learningDays: [], rewards: { fake: { id: "fake", exp: -50 } } })]) {
    await writeFile(file, source);
    await assert.rejects(new ExplorerStore(file).sync([], [], true));
    assert.equal(await readFile(file, "utf8"), source);
  }
});
test("reconciliation credits only real completed catalogued work including legacy quests", async (t) => {
  const root = await fixture(t); const stamp = "2026-09-30T08:00:00Z";
  const quest = { id: "journey", title: "Journey", milestones: [
    { id: "first", title: "First", required: true, evidenceRequired: false },
    { id: "gate", title: "Gate", required: true, evidenceRequired: true }
  ] };
  const plans = { list: async () => [{ title: "Lesson", lessonPath: "real.md", activities: [{ id: "quiz", title: "Quiz" }] }] };
  const learning = { readState: async () => ({ lessons: { "real.md": { activities: { quiz: { completedAt: stamp, successStreak: 1, lastAttemptAt: stamp }, fake: { completedAt: stamp } } } } }) };
  const quests = { list: async () => [quest] };
  const state = { quests: { journey: { milestones: { first: { status: "complete", updatedAt: "" }, gate: { status: "complete", evidence: "trace.log", updatedAt: stamp } }, completedAt: stamp } } };
  const progress = { readState: async () => state };
  const earned = await collectAchievements("Asia/Jakarta", plans, learning, quests, progress);
  assert.deepEqual(earned.rewards.map((item) => item.exp), [20, 50, 100, 200]);
  assert.deepEqual(earned.learningDays, ["2026-09-30"]);
  const store = new ExplorerStore(path.join(root, "ledger.json"));
  assert.equal((await store.sync(earned.rewards, earned.learningDays)).totalExp, 370);
  delete state.quests.journey.milestones.gate.evidence;
  const invalid = await collectAchievements("Asia/Jakarta", plans, learning, quests, progress);
  assert.deepEqual(invalid.rewards.map((item) => item.exp), [20, 50]);
  assert.equal((await store.sync(invalid.rewards, invalid.learningDays)).totalExp, 370);
});
test("nine public clues hide answer keys, grade offered responses and reward once through API", async (t) => {
  const root = await fixture(t); const clues = expeditionClues("environmental-watchtower");
  assert.equal(clues.length, 9); assert.equal("answer" in clues[0], false); assert.equal("explanation" in clues[0], false);
  assert.deepEqual(expeditionClues("missing"), []);
  const app = express(); const store = new ExplorerStore(path.join(root, "ledger.json"));
  app.use("/explorer", createExplorerRouter(store));
  const server = createServer(app); await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/explorer/clues/environmental-watchtower/${clues[0].milestoneId}`;
  const attempt = (answer) => fetch(base, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ response: answer, exp: 999999 }) });
  assert.equal((await attempt("invalid")).status, 400);
  assert.equal((await (await attempt("b")).json()).correct, false);
  assert.equal((await store.snapshot()).totalExp, 0);
  await Promise.all(Array.from({ length: 8 }, () => attempt("a")));
  assert.equal((await store.snapshot()).totalExp, 20);
  for (const clue of clues) { assert.equal(gradeClue("environmental-watchtower", clue.milestoneId, "a").correct, true); }
});
test("ordered expeditions reject future stages while legacy quests remain unordered", async (t) => {
  const root = await fixture(t); const store = new ProgressStore(path.join(root, "progress.json"));
  const quest = { id: "ordered", ordered: true, milestones: [
    { id: "one", title: "One", order: 1, required: true, knowledgeLinks: [] },
    { id: "two", title: "Two", order: 2, required: true, evidenceRequired: true, knowledgeLinks: [] }
  ] };
  await assert.rejects(store.setMilestone(quest, "two", "in-progress"), ProgressValidationError);
  await store.setMilestone(quest, "one", "complete");
  await assert.rejects(store.setMilestone(quest, "two", "complete"), ProgressValidationError);
  assert.ok((await store.setMilestone(quest, "two", "complete", "test.log")).completedAt);
  const legacy = { ...quest, id: "legacy", ordered: undefined };
  assert.equal((await store.setMilestone(legacy, "two", "complete", "test.log")).milestones.two.status, "complete");
});
