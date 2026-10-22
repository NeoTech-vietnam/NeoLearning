import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { register } from "tsx/esm/api";

register();

const { buildWorldReview } = await import("../../src/atlas/world-review.ts");
const { countryReviewLayout, reviewPolygonPath } = await import("../../src/atlas/world-review-layout.ts");
const { atlasHash, parseHashRoute } = await import("../../src/app/routes.ts");
const { ContentIndex } = await import("../../server/content/index.ts");
const { countryMaskGeometry } = await import("../../src/atlas/territory-layout.ts");

const node = (id, kind, path, children = []) => ({
  id, title: id, kind, relativePath: path, headings: [], children
});
const basicsLesson = node("basics lesson", "lesson", "02_Software/Programming/Basics/intro.md");
const patternsLesson = node("patterns lesson", "lesson", "02_Software/Programming/Patterns/pattern.md");
const basics = node("Basics", "topic", "02_Software/Programming/Basics", [basicsLesson]);
const patterns = node("Patterns", "topic", "02_Software/Programming/Patterns", [patternsLesson]);
const programming = node("Programming", "region", "02_Software/Programming", [basics, patterns]);
const software = node("Software", "country", "02_Software", [programming]);
const hardware = node("Hardware", "country", "01_Hardware", [node("Circuit", "topic", "01_Hardware/Circuit")]);
const root = node("Embedded World", "world", undefined, [
  hardware, software,
  node("Protocols", "country", "03_Interfaces-and-Protocols"),
  node("Skills", "country", "04_Soft-Skills"),
  node("Advanced", "country", "05_Advanced-Topics"),
  node("Products", "country", "06_Product_Concepts")
]);
const emptyLearning = { visits: {}, practiced: {} };

test("World Review routes round-trip without changing Explore or Quest", () => {
  assert.deepEqual(parseHashRoute(atlasHash(undefined, { mode: "review" })), { name: "atlas", mode: "review" });
  assert.deepEqual(parseHashRoute(atlasHash("02_Software/Programming", { mode: "review" })),
    { name: "atlas", path: "02_Software/Programming", mode: "review" });
  assert.equal(atlasHash(), "#/atlas");
  assert.equal(atlasHash(undefined, { mode: "quest", questId: "q" }), "#/atlas?mode=quest&quest=q");
});

test("World Review visits only containing terminals, never all children of an ancestor", () => {
  const review = buildWorldReview(root, {
    visits: {
      "02_Software/Programming": "today",
      "02_Software/Programming/Basics/intro.md": "today"
    },
    practiced: {}
  }, [], {});
  assert.equal(review.cells.find((cell) => cell.node.id === "Basics").state, "visited");
  assert.equal(review.cells.find((cell) => cell.node.id === "Patterns").state, "unvisited");
  assert.equal(review.regions.find((region) => region.node.id === "Programming").state, "visited");
  assert.equal(review.regions.find((region) => region.node.id === "Basics").depth, 2);
  assert.deepEqual(review.countries["02_Software"], { total: 2, visited: 1, completed: 0 });
  assert.equal(Object.values(review.countries).reduce((sum, counts) => sum + counts.total, 0), review.world.total);
});

test("completed activity and exact Quest leaf light cells; parent Quest remains a separate marker", () => {
  const quests = [{
    id: "journey", title: "Journey", milestones: [
      { id: "parent", title: "Broad challenge", knowledgeLinks: ["02_Software/Programming", "deleted/path"] },
      { id: "leaf", title: "Pattern challenge", knowledgeLinks: ["02_Software/Programming/Patterns", "02_Software/Programming/Patterns"] }
    ]
  }];
  const progress = { journey: { milestones: {
    parent: { status: "complete" },
    leaf: { status: "complete" }
  } } };
  const parentOnly = buildWorldReview(root, emptyLearning, quests, {
    journey: { milestones: { parent: { status: "complete" } } }
  });
  assert.equal(parentOnly.parents.length, 1);
  assert.equal(parentOnly.parents[0].node.id, "Programming");
  assert.equal(parentOnly.countries["02_Software"].completed, 0);
  assert.equal(parentOnly.cells.find((cell) => cell.node.id === "Patterns").state, "unvisited");
  assert.equal(parentOnly.regions.find((region) => region.node.id === "Programming").state, "unvisited");

  const review = buildWorldReview(root, {
    visits: {},
    practiced: { [basicsLesson.relativePath]: "today" }
  }, quests, progress);
  assert.deepEqual(review.countries["02_Software"], { total: 2, visited: 2, completed: 2 });
  assert.equal(review.parents.length, 1);
  assert.equal(review.parents[0].milestones.length, 1);
  assert.ok(review.world.completed <= review.world.visited);
  assert.equal(review.regions.find((region) => region.node.id === "Programming").state, "completed");
  const partial = buildWorldReview(root, { visits: {}, practiced: { [basicsLesson.relativePath]: "today" } }, [], {});
  const programmingRegion = partial.regions.find((region) => region.node.id === "Programming");
  assert.deepEqual(programmingRegion.counts, { total: 2, visited: 1, completed: 1 });
  assert.equal(programmingRegion.state, "visited");
});

test("level-1/2/3 borders are stable, visible, and nested inside authored countries", () => {
  const source = readFileSync(new URL("../../assets/maps/embedded-world-country-mask.svg", import.meta.url), "utf8");
  const layout = countryReviewLayout(software, 1, source);
  assert.deepEqual(layout, countryReviewLayout(software, 1, source));
  assert.deepEqual(layout.regions.map((region) => [region.path, region.depth]), [
    ["02_Software/Programming", 1],
    ["02_Software/Programming/Basics", 2],
    ["02_Software/Programming/Patterns", 2]
  ]);
  assert.ok(layout.regions.every((region) => region.polygon.length >= 3));
  assert.ok(layout.regions.every((region) => reviewPolygonPath(region.polygon).endsWith(" Z")));
  const first = layout.regions[0];
  assert.ok(layout.regions.slice(1).every((region) => region.parentPath === first.path));
  const fallback = countryReviewLayout(root.children[5], 5, source);
  assert.equal(fallback.regions.length, 1);
  assert.equal(fallback.regions[0].depth, 1);
});

const leaf = (id, path) => node(id, "topic", path, [node(id + " lesson", "lesson", path + "/note.md")]);
const deepPath = "02_Software/Operating-Systems/RTOS";
const deepTopic = node("RTOS", "topic", deepPath, [
  leaf("FreeRTOS", deepPath + "/FreeRTOS"),
  leaf("Zephyr", deepPath + "/Zephyr")
]);
const deepCountry = node("Software", "country", "02_Software", [
  node("Operating Systems", "region", "02_Software/Operating-Systems", [deepTopic])
]);
const deepRoot = node("Embedded World", "world", undefined, [hardware, deepCountry, ...root.children.slice(2)]);

test("level-3 regions aggregate terminal coverage without completing their parent early", () => {
  const visit = { visits: { [deepPath + "/FreeRTOS/note.md"]: "today" }, practiced: {} };
  const reviewed = buildWorldReview(deepRoot, visit, [], {});
  const rtos = reviewed.regions.find((region) => region.node.relativePath === deepPath);
  const free = reviewed.regions.find((region) => region.node.relativePath === deepPath + "/FreeRTOS");
  const zephyr = reviewed.regions.find((region) => region.node.relativePath === deepPath + "/Zephyr");
  assert.equal(rtos.depth, 2);
  assert.deepEqual(rtos.counts, { total: 2, visited: 1, completed: 0 });
  assert.equal(free.depth, 3);
  assert.deepEqual(free.counts, { total: 1, visited: 1, completed: 0 });
  assert.equal(zephyr.state, "unvisited");
  const completed = buildWorldReview(deepRoot, {
    visits: {}, practiced: { [deepPath + "/FreeRTOS/note.md"]: "today" }
  }, [], {});
  assert.equal(completed.regions.find((region) => region.node.relativePath === deepPath + "/FreeRTOS").state, "completed");
  assert.equal(completed.regions.find((region) => region.node.relativePath === deepPath).state, "visited");
  const source = readFileSync(new URL("../../assets/maps/embedded-world-country-mask.svg", import.meta.url), "utf8");
  const layout = countryReviewLayout(deepCountry, 1, source);
  assert.deepEqual(layout.regions.map((region) => region.depth), [1, 2, 3, 3]);
  assert.deepEqual(layout, countryReviewLayout(deepCountry, 1, source));
});

function signedArea(points) {
  return points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0) / 2;
}
function insidePolygon(polygon, point) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index];
    const b = polygon[previous];
    if ((a.y > point.y) !== (b.y > point.y) &&
        point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
function insideConvex(polygon, point) {
  const direction = Math.sign(signedArea(polygon));
  return polygon.every((start, index) => {
    const end = polygon[(index + 1) % polygon.length];
    return direction * ((end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x)) >= -1e-4;
  });
}

test("every indexed folder through level 3 has one nondegenerate country-clipped polygon", async () => {
  const repo = fileURLToPath(new URL("../../..", import.meta.url));
  const tree = await new ContentIndex(repo).tree();
  const source = readFileSync(new URL("../../assets/maps/embedded-world-country-mask.svg", import.meta.url), "utf8");
  let thirdCount = 0;
  for (const [index, country] of tree.root.children.entries()) {
    const layout = countryReviewLayout(country, index, source);
    const positions = new Map(layout.regions.map((region) => [region.path, region]));
    const coast = countryMaskGeometry(source, "country-0" + (index + 1)).worldPoints;
    const expected = [];
    const first = country.children.filter((node) => node.kind !== "lesson");
    for (const region of first) {
      expected.push(region.relativePath);
      assert.ok(positions.has(region.relativePath), region.relativePath);
      for (const second of region.children.filter((node) => node.kind !== "lesson")) {
        expected.push(second.relativePath);
        assert.ok(positions.has(second.relativePath), second.relativePath);
        for (const third of second.children.filter((node) => node.kind !== "lesson")) {
          thirdCount += 1;
          expected.push(third.relativePath);
          assert.ok(positions.has(third.relativePath), third.relativePath);
        }
      }
    }
    assert.deepEqual([...positions.keys()].sort(), (expected.length ? expected : [country.relativePath]).sort());
    for (const position of layout.regions) {
      assert.ok(position.polygon.length >= 3, position.path);
      assert.ok(Number.isFinite(signedArea(position.polygon)) && Math.abs(signedArea(position.polygon)) > 1e-5, position.path);
      assert.ok(position.polygon.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)), position.path);
      if (position.depth === 3) {
        const parent = positions.get(position.parentPath);
        assert.ok(parent, position.path);
        assert.ok(position.polygon.every((point) => insideConvex(parent.polygon, point)), position.path);
        assert.ok(insideConvex(parent.polygon, position.anchor), position.path + " parent anchor");
        assert.ok(insideConvex(position.polygon, position.anchor), position.path + " own anchor");
        assert.ok(insidePolygon(coast, position.anchor), position.path + " coast anchor");
      }
    }
  }
  assert.ok(thirdCount > 0);
});
