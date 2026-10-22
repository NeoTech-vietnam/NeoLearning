import assert from "node:assert/strict";
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { register } from "tsx/esm/api";

register();

const { ProgressStore, ProgressValidationError } = await import("../../server/progress/index.ts");
const { ContentIndex } = await import("../../server/content/index.ts");
const { canonicalCountries, questRouteStops, questStopsAtFocus } = await import("../../src/atlas/model.ts");
const { QuestCatalog, QuestValidationError } = await import("../../server/quests/index.ts");
const { createQuestRouter } = await import("../../server/routes/quests.ts");
const { createProgressRouter } = await import("../../server/routes/progress.ts");
const express = (await import("express")).default;

const questMarkdown = (overrides = "") => `---
id: sensor-quest
title: Sensor quest
level: beginner
problem: Read a sensor safely.
regions:
  - content:software
knowledgeLinks:
  - 02_Software/03_Microcontrollers/02_ADC-DAC
milestones:
  - id: describe-signal
    title: Describe the signal
    order: 1
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 02_Software/03_Microcontrollers/02_ADC-DAC
  - id: read-signal
    title: Read the signal
    order: 2
    required: true
    evidenceRequired: false
    knowledgeLinks:
      - 03_Interfaces-and-Protocols/01_Basic/02_I2C
completionCriteria:
  - Finish the required work.
${overrides}---

# Sensor quest
`;

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "neolearning-quests-"));
  const quests = path.join(root, "Learning Web", "quests");
  const write = async (relative, value = "") => {
    const target = path.join(root, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, value, "utf8");
  };
  await write("02_Software/03_Microcontrollers/02_ADC-DAC/README.md", "# ADC");
  await write("03_Interfaces-and-Protocols/01_Basic/02_I2C/README.md", "# I2C");
  await mkdir(quests, { recursive: true });
  await write("Learning Web/quests/sensor-quest.md", questMarkdown());
  return { root, quests, write };
}

test("loads the environmental sentinel directly from Markdown frontmatter", async () => {
  const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const catalog = new QuestCatalog(path.resolve(project, ".."), path.join(project, "quests"));
  const quest = await catalog.get("environmental-sentinel");
  assert.equal(quest?.title, "Environmental Sentinel");
  assert.equal(quest?.milestones[0].id, "define-sampling-contract");
  assert.ok(quest?.knowledgeLinks.every((link) => !path.isAbsolute(link)));
});

test("maps the watchtower expedition to nine regions across three countries", async () => {
  const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const root = path.resolve(project, "..");
  const catalog = new QuestCatalog(root, path.join(project, "quests"));
  const quests = await catalog.list();
  const quest = quests.find((item) => item.id === "environmental-watchtower");
  assert.ok(quest);
  assert.ok(quests.some((item) => item.id === "environmental-sentinel"));
  assert.equal(quest.title, "Hành trình Trạm Quan trắc");
  assert.match(quest.destination, /truyền số đo/);
  assert.equal(quest.milestones.length, 9);
  assert.ok(quest.milestones.every((item) => item.required && item.challenge && item.knowledgeLinks.length === 1));
  assert.deepEqual(quest.milestones.filter((item) => item.evidenceRequired).map((item) => item.order), [3, 6, 9]);

  const tree = await new ContentIndex(root).tree();
  const stops = questRouteStops(tree.root, quest);
  assert.equal(stops.length, 9);
  assert.ok(stops.every((stop) => stop.node?.kind === "region" && stop.challenge));
  assert.deepEqual(stops.map((stop) => stop.countryPath), [
    ...Array(3).fill("01_Hardware"),
    ...Array(3).fill("02_Software"),
    ...Array(3).fill("03_Interfaces-and-Protocols")
  ]);
  const countries = canonicalCountries(tree.root).slice(0, 3);
  assert.deepEqual(countries.map((country) => questStopsAtFocus(country, stops).length), [3, 3, 3]);
});

test("requires evidence at watchtower checkpoints and persists its completion", async (t) => {
  const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const repositoryRoot = path.resolve(project, "..");
  const quest = await new QuestCatalog(repositoryRoot, path.join(project, "quests")).get("environmental-watchtower");
  assert.ok(quest);
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "neolearning-watchtower-progress-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const progressPath = path.join(temporaryRoot, "progress.json");
  const store = new ProgressStore(progressPath);
  for (const milestone of quest.milestones) {
    if (milestone.evidenceRequired) {
      await assert.rejects(store.setMilestone(quest, milestone.id, "complete"), ProgressValidationError);
      await store.setMilestone(quest, milestone.id, "complete", `evidence/${milestone.id}.md`);
    } else {
      await store.setMilestone(quest, milestone.id, "complete");
    }
  }
  const reloaded = await new ProgressStore(progressPath).readQuest(quest);
  assert.ok(reloaded.completedAt);
  assert.equal(Object.values(reloaded.milestones).filter((item) => item.status === "complete").length, 9);
  assert.equal(reloaded.milestones["deliver-the-reading"].evidence, "evidence/deliver-the-reading.md");
});

test("accepts optional destination and milestone challenge without changing older quests", async (t) => {
  const { root, quests, write } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  await write("Learning Web/quests/sensor-quest.md", questMarkdown()
    .replace("problem: Read a sensor safely.", "problem: Read a sensor safely.\ndestination: A reproducible reading.")
    .replace("    order: 1", "    order: 1\n    challenge: Capture one sensor sample."));
  const quest = await new QuestCatalog(root, quests).get("sensor-quest");
  assert.equal(quest?.destination, "A reproducible reading.");
  assert.equal(quest?.milestones[0].challenge, "Capture one sensor sample.");
  assert.equal(quest?.milestones[1].challenge, undefined);
  await write("Learning Web/quests/sensor-quest.md", questMarkdown().replace("problem: Read a sensor safely.", "problem: Read a sensor safely.\ndestination: 42"));
  await assert.rejects(new QuestCatalog(root, quests).list(), /destination must be a non-empty string/);
  await write("Learning Web/quests/sensor-quest.md", questMarkdown().replace("    order: 1", "    order: 1\n    challenge: 42"));
  await assert.rejects(new QuestCatalog(root, quests).list(), /challenge must be a non-empty string/);
});

test("rejects invalid IDs, order, and broken repository-relative knowledge links", async (t) => {
  const { root, quests, write } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const catalog = new QuestCatalog(root, quests);
  await write("Learning Web/quests/invalid.md", questMarkdown().replace("id: sensor-quest", "id: Invalid ID"));
  await assert.rejects(catalog.list(), QuestValidationError);
  await rm(path.join(quests, "invalid.md"));
  await write("Learning Web/quests/invalid.md", questMarkdown().replace("order: 2", "order: 3"));
  await assert.rejects(catalog.list(), /consecutive/);
  await rm(path.join(quests, "invalid.md"));
  await write("Learning Web/quests/invalid.md", questMarkdown().replace("03_Interfaces-and-Protocols/01_Basic/02_I2C", "missing/topic"));
  await assert.rejects(catalog.list(), /does not exist/);
});

test("migrates legacy progress and atomically replaces the state file", async (t) => {
  const { root, quests, write } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const catalog = new QuestCatalog(root, quests);
  const quest = await catalog.get("sensor-quest");
  assert.ok(quest);
  const progressPath = path.join(root, "Learning Web", ".data", "progress.json");
  await write("Learning Web/.data/progress.json", JSON.stringify({ schemaVersion: 0, quests: { "sensor-quest": { milestones: { "describe-signal": true } } } }));
  const store = new ProgressStore(progressPath);
  assert.equal((await store.readQuest(quest)).milestones["describe-signal"].status, "complete");
  await store.setMilestone(quest, "read-signal", "in-progress");
  const persisted = JSON.parse(await readFile(progressPath, "utf8"));
  assert.equal(persisted.schemaVersion, 1);
  assert.equal((await readdir(path.dirname(progressPath))).filter((name) => name.endsWith(".tmp")).length, 0);
});

test("requires evidence and every required milestone before recording quest completion", async (t) => {
  const { root, quests } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const catalog = new QuestCatalog(root, quests);
  const quest = await catalog.get("sensor-quest");
  assert.ok(quest);
  const store = new ProgressStore(path.join(root, "Learning Web", ".data", "progress.json"));
  await assert.rejects(store.setMilestone(quest, "describe-signal", "complete"), ProgressValidationError);
  await store.setMilestone(quest, "describe-signal", "complete", "photos/adc-capture.png");
  assert.equal((await store.readQuest(quest)).completedAt, undefined);
  await store.setMilestone(quest, "read-signal", "complete");
  assert.ok((await store.readQuest(quest)).completedAt);
});

test("quest and progress APIs reject unknown quest and milestone IDs", async (t) => {
  const { root, quests } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const catalog = new QuestCatalog(root, quests);
  const store = new ProgressStore(path.join(root, "Learning Web", ".data", "progress.json"));
  const app = express();
  app.use("/api/quests", createQuestRouter(catalog));
  app.use("/api/progress", createProgressRouter(catalog, store));
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  assert.equal((await fetch(`${base}/quests/nope`)).status, 404);
  assert.equal((await fetch(`${base}/progress/nope`)).status, 404);
  assert.equal((await fetch(`${base}/progress/sensor-quest/milestones/nope`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: "complete" }) })).status, 400);
  const valid = await fetch(`${base}/quests`);
  assert.equal(valid.status, 200);
  assert.equal((await valid.json()).quests[0].id, "sensor-quest");
});


test("journal entries persist, validate, and leave older completion records readable", async (t) => {
  const { root, quests } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const quest = await new QuestCatalog(root, quests).get("sensor-quest");
  assert.ok(quest);
  const store = new ProgressStore(path.join(root, "progress.json"));
  const journal = { tried: "Sampled ADC at 1 kHz", result: "Observed stable values", nextMeasurement: "Compare with a scope" };
  await assert.rejects(store.setMilestone(quest, "read-signal", "complete", undefined, { ...journal, result: " " }), ProgressValidationError);
  await store.setMilestone(quest, "read-signal", "complete", undefined, journal);
  assert.deepEqual((await new ProgressStore(store.filePath).readQuest(quest)).milestones["read-signal"].journal, journal);
  await store.setMilestone(quest, "read-signal", "in-progress");
  assert.deepEqual((await store.readQuest(quest)).milestones["read-signal"].journal, journal);
});
