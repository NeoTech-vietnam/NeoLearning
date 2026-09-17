import assert from "node:assert/strict";
import test from "node:test";
import { register } from "tsx/esm/api";

register();

const { atlasHash, parseHashRoute } = await import("../../src/app/routes.ts");
const { canonicalCountries, descendantCount, findNodeTrail } = await import("../../src/atlas/model.ts");

const node = (id, title, kind, relativePath, children = [], unindexed = undefined) => ({
  id, title, kind, relativePath, headings: [], children, ...(unindexed ? { unindexed } : {})
});

const lesson = node("lesson", "Timers", "lesson", "02_Software/RTOS/timers.md");
const topic = node("topic", "RTOS", "region", "02_Software/RTOS", [lesson]);
const countries = [
  node("c3", "Protocols", "country", "03_Interfaces-and-Protocols"),
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
