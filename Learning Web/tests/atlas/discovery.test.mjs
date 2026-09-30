import assert from "node:assert/strict";
import test from "node:test";
import { discoveryPools, pickDiscovery } from "../../src/atlas/discovery.ts";
const node = (path, kind, children = []) => ({ id: path, relativePath: path, title: path.split("/").at(-1), kind, headings: [], children });
const folder = (path) => node(path, "topic", [node(`${path}/read.md`, "lesson")]);
const root = node("", "world", [
  node("01_Hardware", "country", [folder("01_Hardware/small"), node("01_Hardware/empty", "topic"), node("01_Hardware/country-only.md", "lesson")]),
  node("02_Software", "country", [node("02_Software/parent", "region", [folder("02_Software/parent/one"), folder("02_Software/parent/two"), node("02_Software/parent/empty", "topic")]), folder("02_Software/three")]),
  node("03_Interfaces-and-Protocols", "country", [node("03_Interfaces-and-Protocols/only.md", "lesson")]),
  node("unrelated", "country", [folder("unrelated/topic")])
]);
test("discovery finds nonempty terminal subfolders recursively, never countries/files/empty parents", () => {
  const pools = discoveryPools(root);
  assert.deepEqual(pools.map((pool) => pool.country.relativePath), ["01_Hardware", "02_Software"]);
  assert.deepEqual(pools.map((pool) => pool.destinations.length), [1, 3]);
  assert.deepEqual(pools[1].destinations[0].trail.map((item) => item.relativePath), ["02_Software", "02_Software/parent", "02_Software/parent/one"]);
  assert.equal(pools[0].destinations[0].lessons[0].relativePath, "01_Hardware/small/read.md");
  assert.equal(discoveryPools(node("", "world")).length, 0);
});
test("country-first sampling remains equal despite differently sized folder pools", () => {
  const pools = discoveryPools(root);
  const counts = new Map();
  for (let countryDraw = 0; countryDraw < 100; countryDraw++) {
    let calls = 0;
    const result = pickDiscovery(pools, undefined, () => calls++ === 0 ? countryDraw / 100 : .999);
    assert.equal(calls, 2);
    counts.set(result.country.relativePath, (counts.get(result.country.relativePath) ?? 0) + 1);
  }
  assert.deepEqual([...counts.values()], [50, 50]);
  for (const [value, expected] of [[0, "one"], [.4, "two"], [.999, "three"]]) {
    let call = 0;
    assert.equal(pickDiscovery(pools, undefined, () => call++ === 0 ? .75 : value).node.title, expected);
  }
});
test("previous result is excluded without retry loops and singleton/empty worlds remain safe", () => {
  const pools = discoveryPools(root);
  assert.notEqual(pickDiscovery(pools, "01_Hardware/small", () => 0).node.relativePath, "01_Hardware/small");
  assert.equal(pickDiscovery([pools[0]], "01_Hardware/small", () => 0).node.relativePath, "01_Hardware/small");
  assert.equal(pickDiscovery([], undefined, () => { throw new Error("Should not draw"); }), undefined);
  assert.equal(pickDiscovery(pools, "deleted/topic", () => 0).node.relativePath, "01_Hardware/small");
  for (const value of [-1, 1, NaN, Infinity]) assert.throws(() => pickDiscovery(pools, undefined, () => value), /Random value/);
});
