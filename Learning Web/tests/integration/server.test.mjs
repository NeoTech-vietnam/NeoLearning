import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { register } from "tsx/esm/api";

register();

const { createApp } = await import("../../server/index.ts");

test("main server exposes content, files, quests, and progress APIs", async (t) => {
  const server = createServer(createApp());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;

  const cases = [
    ["/api/health", "status"],
    ["/api/content/tree", "root"],
    ["/api/files/read?path=README.md", "relativePath"],
    ["/api/quests", "quests"],
    ["/api/progress", "progress"]
  ];

  for (const [route, field] of cases) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
    assert.ok(field in await response.json(), `${route} returns ${field}`);
  }

  const missing = await fetch(`${base}/api/unknown`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error.code, "NOT_FOUND");
});
