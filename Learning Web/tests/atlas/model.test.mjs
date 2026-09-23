import assert from "node:assert/strict";
import test from "node:test";
import { register } from "tsx/esm/api";

register();

const { atlasHash, parseHashRoute } = await import("../../src/app/routes.ts");
const { canonicalCountries, descendantCount, findNodeTrail, questRouteStops, questStopsAtFocus, territoryPositions } = await import("../../src/atlas/model.ts");

const node = (id, title, kind, relativePath, children = [], unindexed = undefined) => ({
  id, title, kind, relativePath, headings: [], children, ...(unindexed ? { unindexed } : {})
});

const lesson = node("lesson", "Timers", "lesson", "02_Software/RTOS/timers.md");
const topic = node("topic", "RTOS", "region", "02_Software/RTOS", [lesson]);
const protocolLesson = node("i2c", "I2C", "lesson", "03_Interfaces-and-Protocols/01_Basic/02_I2C.md");
const countries = [
  node("c3", "Protocols", "country", "03_Interfaces-and-Protocols", [protocolLesson]),
  node("c1", "Hardware", "country", "01_Hardware"),
  node("c2", "Software", "country", "02_Software", [topic]),
  node("c6", "Products", "country", "06_Product_Concepts"),
  node("c5", "Advanced", "country", "05_Advanced-Topics"),
  node("c4", "Skills", "country", "04_Soft-Skills")
];
const root = node("world", "Embedded World", "world", undefined, countries);

test("hash routes preserve nested atlas paths", () => {
  const hash = atlasHash("02_Software/RTOS/timers.md");
  assert.equal(hash, "#/atlas?path=02_Software%2FRTOS%2Ftimers.md");
  assert.deepEqual(parseHashRoute(hash), { name: "atlas", path: "02_Software/RTOS/timers.md" });
  assert.deepEqual(parseHashRoute("#/quests"), { name: "quests" });
  assert.deepEqual(parseHashRoute("#/unknown"), { name: "home" });
});

test("atlas derives canonical order, hierarchy trail, and descendant counts", () => {
  assert.deepEqual(canonicalCountries(root).map((country) => country.relativePath), [
    "01_Hardware",
    "02_Software",
    "03_Interfaces-and-Protocols",
    "04_Soft-Skills",
    "05_Advanced-Topics",
    "06_Product_Concepts"
  ]);
  assert.deepEqual(findNodeTrail(root, lesson.relativePath).map((entry) => entry.title), ["Embedded World", "Software", "RTOS", "Timers"]);
  assert.deepEqual(findNodeTrail(root, "missing"), [root]);
  assert.equal(descendantCount(countries[2]), 2);
});

test("projects ordered cross-country quest stops and preserves repeats", () => {
  const quest = { milestones: [{ id: "m1", title: "Build", knowledgeLinks: [lesson.relativePath, lesson.relativePath, protocolLesson.relativePath, "missing/path.md"] }] };
  const stops = questRouteStops(root, quest);

  assert.deepEqual(stops.map((stop) => stop.countryPath), ["02_Software", "02_Software", "03_Interfaces-and-Protocols", undefined]);
  assert.deepEqual(questStopsAtFocus(root, stops).map(({ territoryPath }) => territoryPath), [
    "02_Software", "02_Software", "03_Interfaces-and-Protocols"
  ]);
  assert.deepEqual(questStopsAtFocus(countries[2], stops).map(({ territoryPath }) => territoryPath), [
    "02_Software/RTOS", "02_Software/RTOS"
  ]);
  assert.equal(stops[3].node, undefined);
});

test("lays territories out in a stable grid within the map frame", () => {
  const children = Array.from({ length: 18 }, (_, index) => node(
    `topic-${index}`, `Topic ${index}`, "topic", `02_Software/topic-${index}`
  ));
  const positions = territoryPositions(children);

  assert.equal(positions.length, 18);
  assert.deepEqual(positions.map(({ path }) => path), children.map(({ relativePath }) => relativePath));
  assert.equal(new Set(positions.map(({ x, y }) => `${x},${y}`)).size, 18);
  for (const { x, y, width, height } of positions) {
    assert.ok(x - width / 2 >= 0 && x + width / 2 <= 100);
    assert.ok(y - height / 2 >= 0 && y + height / 2 <= 100);
  }
});
