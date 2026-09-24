import assert from "node:assert/strict";
import { createServer, request as httpRequest } from "node:http";
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

test("private preview protects both pages and APIs with a Tailscale identity", async (t) => {
  assert.throws(() => createApp({ tailnetLogin: " " }), /must not be empty/);
  const server = createServer(createApp({ tailnetLogin: "owner@example.com" }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = "http://127.0.0.1:" + address.port;

  for (const route of ["/", "/api/health", "/api/quests"]) {
    assert.equal((await fetch(base + route)).status, 403, route);
  }
  assert.equal((await fetch(base + "/api/files/write", { method: "PUT" })).status, 403);
  assert.equal((await fetch(base + "/api/health", { headers: { "Tailscale-User-Login": "guest@example.com" } })).status, 403);

  const headers = { "Tailscale-User-Login": "owner@example.com" };
  assert.equal((await fetch(base + "/api/health", { headers })).status, 200);
  assert.equal((await fetch(base + "/api/quests", { headers })).status, 200);
});

test("direct Tailnet preview requires the exact host and a strong password", async (t) => {
  assert.throws(() => createApp({ password: "short", allowedHost: "100.123.52.88:4176" }), /strong password/);
  assert.throws(() => createApp({ password: "correct-secret-of-length" }), /exact allowed host/);
  const server = createServer(createApp({
    password: "correct-secret-of-length",
    allowedHost: "100.123.52.88:4176"
  }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = "http://127.0.0.1:" + address.port;
  const host = "100.123.52.88:4176";
  const authorization = "Basic " + Buffer.from("neo:correct-secret-of-length").toString("base64");
  const requestAs = (route, headers = {}, method = "GET") => new Promise((resolve, reject) => {
    const request = httpRequest(base + route, { method, headers }, (response) => {
      response.resume();
      response.on("end", () => resolve(response));
    });
    request.on("error", reject);
    request.end();
  });

  assert.equal((await requestAs("/api/health")).statusCode, 403);
  const missing = await requestAs("/", { Host: host });
  assert.equal(missing.statusCode, 401);
  assert.match(missing.headers["www-authenticate"] ?? "", /Basic/);
  assert.equal((await requestAs("/api/health", { Host: host, Authorization: "Basic " + Buffer.from("neo:wrong").toString("base64") })).statusCode, 401);
  assert.equal((await requestAs("/api/files/write", { Host: host }, "PUT")).statusCode, 401);
  const headers = { Host: host, Authorization: authorization };
  assert.equal((await requestAs("/api/health", headers)).statusCode, 200);
  assert.equal((await requestAs("/api/quests", headers)).statusCode, 200);
});
