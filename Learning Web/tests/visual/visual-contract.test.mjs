import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("visual contract names every required landmark state", async () => {
  const source = await read("src/ui/Landmark.tsx");
  for (const state of ["default", "hover", "focus", "selected", "visited", "active-quest", "completed", "locked", "unavailable"]) {
    assert.match(source + await read("src/app/styles/map.css"), new RegExp(state));
  }
});

test("reference targets cover all required desktop viewports", async () => {
  const targets = JSON.parse(await read("tests/visual/reference-targets.json"));
  assert.deepEqual(targets.captures.map((capture) => [capture.viewport.width, capture.viewport.height]), [[1440, 900], [1280, 800], [1024, 768]]);
  assert.equal(targets.browser.reducedMotion, "reduce");
});

test("tokens and primitive exports are the sole visual entry points", async () => {
  const [tokens, primitives] = await Promise.all([read("src/app/styles/tokens.css"), read("src/ui/index.ts")]);
  assert.match(tokens, /--color-accent:/);
  assert.match(tokens, /--target-min: 2\.75rem/);
  for (const primitive of ["Button", "IconButton", "Card", "Badge", "Progress", "Tooltip", "Modal", "Skeleton", "EmptyState", "ErrorState"]) assert.match(primitives, new RegExp(primitive));
});
