import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import express from "express";
import { register } from "tsx/esm/api";

register();

const { ActivityCatalog, ActivityValidationError, publicLesson } = await import("../../server/learning/catalog.ts");
const { LearningProgressStore, LearningValidationError, gradeActivity } = await import("../../server/learning/progress.ts");
const { createLearningRouter } = await import("../../server/routes/learning.ts");

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "neo-learning-activity-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const repository = path.join(root, "repository");
  const activities = path.join(root, "activities");
  await mkdir(path.join(repository, "01_Hardware"), { recursive: true });
  await mkdir(activities);
  await writeFile(path.join(repository, "01_Hardware/interactive-lesson.md"), "# Fixture lesson\n\nLearn by trying.\n");
  const sample = JSON.parse(await readFile(new URL("../fixtures/activities/fixture-learning.json", import.meta.url), "utf8"));
  await writeFile(path.join(activities, "fixture.json"), JSON.stringify(sample));
  return { root, activities, repository, sample, catalog: new ActivityCatalog(repository, activities), store: new LearningProgressStore(path.join(root, "data/progress.json")) };
}

test("activity catalog validates sidecars and keeps answer keys off the reader API", async (t) => {
  const f = await fixture(t);
  const [plan] = await f.catalog.list();
  assert.equal(plan.activities.length, 4);
  const publicPlan = publicLesson(plan);
  assert.equal(publicPlan.lessonPath, "01_Hardware/interactive-lesson.md");
  assert.equal("answer" in publicPlan.activities[0], false);
  assert.equal("modelAnswer" in publicPlan.activities[2], false);
  assert.equal("explanation" in publicPlan.activities[3], false);

  await writeFile(path.join(f.activities, "fixture.json"), JSON.stringify({ ...f.sample, activities: [{ ...f.sample.activities[0], afterHeading: "missing" }, ...f.sample.activities.slice(1)] }));
  assert.equal((await f.catalog.list())[0].activities[0].afterHeading, "missing");
  await writeFile(path.join(f.activities, "fixture.json"), JSON.stringify({ ...f.sample, lessonPath: "../README.md" }));
  await assert.rejects(() => f.catalog.list(), ActivityValidationError);
});

test("all checkpoint kinds grade and reject malformed answers", async (t) => {
  const f = await fixture(t);
  const { activities } = (await f.catalog.list())[0];
  assert.equal(gradeActivity(activities[0], "wrong").correct, false);
  assert.equal(gradeActivity(activities[0], "correct").correct, true);
  assert.equal(gradeActivity(activities[1], ["first", "second"]).correct, true);
  assert.equal(gradeActivity(activities[1], ["second", "first"]).correct, false);
  assert.equal(gradeActivity(activities[2], { note: "I can explain the model.", confident: true }).correct, true);
  assert.equal(gradeActivity(activities[2], { note: "I still need more practice.", confident: false }).correct, false);
  assert.equal(gradeActivity(activities[3], { frequencyHz: 1000, dutyPercent: 25, predictedHighUs: 250 }).correct, true);
  assert.equal(gradeActivity(activities[3], { frequencyHz: 1000, dutyPercent: 25, predictedHighUs: 500 }).correct, false);
  assert.throws(() => gradeActivity(activities[0], "invented"), LearningValidationError);
  assert.throws(() => gradeActivity(activities[1], ["first", "first"]), LearningValidationError);
});

test("learning progress persists, schedules review, and offers only completed simulation evidence", async (t) => {
  const f = await fixture(t);
  const plan = (await f.catalog.list())[0];
  await f.store.visit(plan.lessonPath, "fixture-lesson");
  const wrong = await f.store.attempt(plan, plan.activities[0], "wrong");
  assert.equal(wrong.progress.activities["fixture-choice"].successStreak, 0);
  const correct = await f.store.attempt(plan, plan.activities[0], "correct");
  assert.equal(correct.progress.activities["fixture-choice"].attempts, 2);
  assert.equal(correct.progress.activities["fixture-choice"].successStreak, 1);
  assert.deepEqual(await f.store.evidence([plan], "fixture-quest", "read-fixture"), []);
  await f.store.attempt(plan, plan.activities[3], { frequencyHz: 1000, dutyPercent: 25, predictedHighUs: 250 });
  const evidence = await f.store.evidence([plan], "fixture-quest", "read-fixture");
  assert.equal(evidence.length, 1);
  assert.match(evidence[0].evidence, /not a hardware measurement/);
  assert.equal((await f.store.due([plan])).length, 0);
  assert.equal((await f.store.due([plan], new Date(Date.now() + 2 * 86_400_000))).length, 2);
  await Promise.all([
    f.store.attempt(plan, plan.activities[0], "wrong"),
    f.store.attempt(plan, plan.activities[0], "correct")
  ]);
  const stored = await new LearningProgressStore(f.store.filePath).readLesson(plan.lessonPath);
  assert.equal(stored.activities["fixture-choice"].attempts, 4);
  assert.equal(stored.lastHeading, "fixture-lesson");
});

test("learning API serves a lesson, saves attempts, and exposes quest evidence", async (t) => {
  const f = await fixture(t);
  const app = express();
  app.use("/api/learning", createLearningRouter(f.catalog, f.store));
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}/api/learning`;
  const lesson = await (await fetch(base + "/lesson?path=01_Hardware%2Finteractive-lesson.md")).json();
  assert.equal(lesson.lesson.activities.length, 4);
  assert.equal((await fetch(base + "/review")).status, 200);
  const attempt = await fetch(base + "/attempt", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ lessonPath: "01_Hardware/interactive-lesson.md", activityId: "fixture-lab", response: { frequencyHz: 1000, dutyPercent: 25, predictedHighUs: 250 } })
  });
  assert.equal(attempt.status, 200);
  assert.equal((await attempt.json()).correct, true);
  const evidence = await (await fetch(base + "/evidence?questId=fixture-quest&milestoneId=read-fixture")).json();
  assert.equal(evidence.options.length, 1);
  const bad = await fetch(base + "/attempt", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ lessonPath: "01_Hardware/interactive-lesson.md", activityId: "fixture-choice", response: "invented" })
  });
  assert.equal(bad.status, 400);
});
