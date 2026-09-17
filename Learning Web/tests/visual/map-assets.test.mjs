import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (relativePath) => readFile(new URL(relativePath, root), "utf8");

function pathsById(svg) {
  const result = new Map();
  for (const match of svg.matchAll(/<path\s+id="(country-0[1-6])"\s+d="([^"]+)"/g)) {
    result.set(match[1], match[2]);
  }
  return result;
}

test("source and interaction mask share all six country paths exactly", async () => {
  const [source, mask] = await Promise.all([
    read("assets/maps/embedded-world-source.svg"),
    read("assets/maps/embedded-world-country-mask.svg")
  ]);
  const sourcePaths = pathsById(source);
  const maskPaths = pathsById(mask);
  assert.deepEqual([...sourcePaths.keys()], ["country-01", "country-02", "country-03", "country-04", "country-05", "country-06"]);
  assert.deepEqual(maskPaths, sourcePaths);
  assert.match(source, /viewBox="0 0 3840 2160"/);
});

test("land mask and anchors use the shared coordinate contract", async () => {
  const [land, anchorText] = await Promise.all([
    read("assets/maps/embedded-world-land-mask.svg"),
    read("assets/maps/embedded-world-label-anchors.json")
  ]);
  assert.match(land, /id="embedded-world-land"/);
  assert.match(land, /viewBox="0 0 3840 2160"/);
  const anchors = JSON.parse(anchorText);
  assert.deepEqual(Object.keys(anchors), ["country-01", "country-02", "country-03", "country-04", "country-05", "country-06"]);
  for (const anchor of Object.values(anchors)) {
    for (const point of [anchor.label, anchor.capital, anchor.focus]) {
      assert.ok(point.x > 0 && point.x < 1);
      assert.ok(point.y > 0 && point.y < 1);
    }
    assert.ok(anchor.recommendedLabelWidth > 0 && anchor.recommendedLabelWidth < 1);
  }
});

test("master remains text-free and exposes editable cartographic layers", async () => {
  const source = await read("assets/maps/embedded-world-source.svg");
  for (const layer of ["00_paper", "01_sea", "02_continent_base", "03_country_washes", "04_mountains", "05_rivers_lakes", "06_forests", "07_roads_bridges", "08_settlements_landmarks", "09_coastline_borders", "10_compass_decoration", "11_texture_grading"]) {
    assert.match(source, new RegExp(`inkscape:label="${layer}"`));
  }
  assert.doesNotMatch(source, /<text\b/);
});
