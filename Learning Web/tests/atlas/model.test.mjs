import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { register } from "tsx/esm/api";

register();

const { atlasHash, parseHashRoute } = await import("../../src/app/routes.ts");
const { clipOutlineToCell, territoryLayoutAtFocus } = await import("../../src/atlas/territory-layout.ts");
const { canonicalCountries, countryOutlineFromMask, descendantCount, findNodeTrail, questRouteStops, questStopsAtFocus, territoryLayout, territoryLayoutInCountry } = await import("../../src/atlas/model.ts");

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

test("territories are stable, irregular and exactly partition one landmass", () => {
  const children = Array.from({ length: 18 }, (_, index) => node(
    `topic-${index}`, `Topic ${index}`, "topic", `02_Software/topic-${index}`
  ));
  const layout = territoryLayout(children, "02_Software");
  assert.equal(layout.rows, 5);
  assert.deepEqual(layout, territoryLayout(children, "02_Software"));
  assert.notDeepEqual(layout.outline, territoryLayout(children, "01_Hardware").outline);
  assert.deepEqual(layout.territories.map(({ path }) => path), children.map(({ relativePath }) => relativePath));
  assert.ok(new Set(layout.territories.map(({ polygon }) => polygon.length)).size > 1);

  const contains = (polygon, point) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i];
      const b = polygon[j];
      if ((a.y > point.y) !== (b.y > point.y) &&
          point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };
  for (const territory of layout.territories) {
    assert.ok(territory.polygon.length >= 3);
    assert.ok(contains(territory.polygon, territory));
    for (const point of territory.polygon) {
      assert.ok(point.x >= 0 && point.x <= 100 && point.y >= 0 && point.y <= 100);
    }
  }
  // Interior samples belong to one territory, never a gap or overlapping regions.
  for (let x = 0.37; x < 100; x += 1.97) {
    for (let y = 0.29; y < 100; y += 2.03) {
      const point = { x, y };
      if (!contains(layout.outline, point)) continue;
      assert.equal(layout.territories.filter(({ polygon }) => contains(polygon, point)).length, 1);
    }
  }
});
test("Software pilot follows the authored coastline and assigns more land to more lessons", () => {
  const source = readFileSync(new URL("../../assets/maps/embedded-world-country-mask.svg", import.meta.url), "utf8");
  const outline = countryOutlineFromMask(source, "country-02");
  assert.ok(outline.length > 400);
  assert.throws(() => countryOutlineFromMask(source, "country-99"), /missing/);
  const children = [
    node("large", "Large", "topic", "02_Software/Large",
      Array.from({ length: 60 }, (_, index) => node("large-" + index, "Lesson", "lesson"))),
    ...Array.from({ length: 3 }, (_, index) => node(
      "small-" + index, "Small", "topic", "02_Software/Small-" + index,
      [node("lesson-" + index, "Lesson", "lesson")]
    ))
  ];
  const layout = territoryLayoutInCountry(children, "02_Software", outline);
  assert.deepEqual(layout, territoryLayoutInCountry(children, "02_Software", outline));
  assert.ok(layout.territories[0].areaSamples > 2 * layout.territories[1].areaSamples);
  assert.ok(layout.territories.every((territory) => territory.areaSamples > 0));

  const contains = (polygon, point) => {
    let inside = false;
    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
      const a = polygon[index];
      const b = polygon[previous];
      if ((a.y > point.y) !== (b.y > point.y) &&
          point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };
  assert.ok(layout.territories.every((territory) => contains(outline, territory)));
});
test("recursive atlas preserves the selected parent silhouette through two zoom levels", () => {
  const source = readFileSync(new URL("../../assets/maps/embedded-world-country-mask.svg", import.meta.url), "utf8");
  const outline = countryOutlineFromMask(source, "country-02");
  const basics = node("basics", "Basics", "region", "02_Software/Programming/Basics",
    [node("basic-lesson", "Basics lesson", "lesson", "02_Software/Programming/Basics/lesson.md")]);
  const patterns = node("patterns", "Patterns", "region", "02_Software/Programming/Patterns",
    [node("pattern-lesson", "Patterns lesson", "lesson", "02_Software/Programming/Patterns/lesson.md")]);
  const programming = node("programming", "Programming", "region", "02_Software/Programming", [basics, patterns]);
  const systems = node("systems", "Systems", "region", "02_Software/Systems",
    [node("systems-lesson", "Systems lesson", "lesson", "02_Software/Systems/lesson.md")]);
  const country = node("software", "Software", "country", "02_Software", [programming, systems]);
  const rootLayout = territoryLayoutAtFocus(country, country, outline);
  const childLayout = territoryLayoutAtFocus(country, programming, outline);
  const grandchildLayout = territoryLayoutAtFocus(country, basics, outline);

  assert.equal(childLayout.outline.length, clipOutlineToCell(outline, rootLayout.territories[0].polygon).length);
  assert.equal(grandchildLayout.outline.length,
    clipOutlineToCell(childLayout.outline, childLayout.territories[0].polygon).length);
  assert.notDeepEqual(childLayout.outline, outline);
  assert.notDeepEqual(grandchildLayout.outline, childLayout.outline);
  assert.strictEqual(grandchildLayout, territoryLayoutAtFocus(country, basics, outline));
  assert.strictEqual(rootLayout, territoryLayoutAtFocus(country, country, outline));
  assert.strictEqual(childLayout, territoryLayoutAtFocus(country, programming, outline));
  const refreshedCountry = { ...country, children: [...country.children] };
  assert.notStrictEqual(rootLayout, territoryLayoutAtFocus(refreshedCountry, refreshedCountry, outline));
  assert.ok([rootLayout, childLayout, grandchildLayout].every((layout) =>
    layout.territories.every((territory) => territory.areaSamples > 0)));
});

test("convex cell clipping keeps a concave coast's actual visible area", () => {
  const coast = [
    { x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 2 },
    { x: 3, y: 2 }, { x: 3, y: 8 }, { x: 0, y: 8 }
  ];
  const cell = [{ x: 1, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 6 }, { x: 1, y: 6 }];
  const clipped = clipOutlineToCell(coast, cell);
  const contains = (polygon, point) => {
    let inside = false;
    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
      const a = polygon[index];
      const b = polygon[previous];
      if ((a.y > point.y) !== (b.y > point.y) &&
          point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };
  for (let x = .17; x < 8; x += .29) {
    for (let y = .13; y < 8; y += .31) {
      const point = { x, y };
      assert.equal(contains(clipped, point), contains(coast, point) && contains(cell, point));
    }
  }
});
test("recursive atlas keeps dense disk-backed regions selectable", () => {
  const leaves = Array.from({ length: 25 }, (_, index) => node(
    "leaf-" + index, "Leaf " + index, "topic", "02_Software/Real/leaf-" + index,
    [node("note-" + index, "Note", "lesson", "02_Software/Real/leaf-" + index + "/note.md")]
  ));
  const region = node("real", "Real", "region", "02_Software/Real", leaves);
  const country = node("software", "Software", "country", "02_Software", [region]);
  const shallowCoast = [
    { x: 12, y: 36 }, { x: 88, y: 36 }, { x: 88, y: 66 }, { x: 12, y: 66 }
  ];
  const dense = territoryLayoutInCountry(leaves, region.relativePath, shallowCoast);
  assert.ok(dense.territories.every((territory) => territory.areaSamples > 0 && territory.polygon.length >= 3));
  assert.ok(dense.territories.some((territory) => territory.compactLabel), "crowded regions use short map markers");
  const focused = territoryLayoutAtFocus(country, leaves[17], shallowCoast);
  assert.equal(focused.territories.length, 1);
  assert.ok(focused.outline.length >= 3);
});
