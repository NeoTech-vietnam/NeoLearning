import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm, readFile, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createServer } from "node:http";
import express from "express";
import { NotebookStore } from "../../server/notebook/index.ts";
import { createNotebookRouter } from "../../server/routes/notebook.ts";
import { MarkdownFileStore } from "../../server/files/index.ts";
import { lessonHeadings } from "../../src/shared/learning.ts";
import { quoteOffset } from "../../src/shared/notebook.ts";
const note = { kind: "note", heading: "section", quote: "passage", prefix: "", suffix: "", note: "my observation" };
async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "neo-notebook-"));
  t.after(() => rm(root, { recursive: true, force: true })); return root;
}
test("headings exclude mixed and longer fences and identify duplicate headings", () => {
  const input = "# Start\n~~~~c\n# fake\n```\n~~~~\n## Repeat\n## Repeat\n````js\n# not real\n```\n# still fenced\n````\n## End";
  assert.deepEqual(lessonHeadings(input).map((item) => item.slug), ["start", "repeat", "repeat-2", "end"]);
  assert.equal(new Set(lessonHeadings("# A\n# A\n# A 2\n# A").map((item) => item.slug)).size, 4);
});
test("quote matching requires unique context, never guesses ambiguous or changed passages", () => {
  assert.equal(quoteOffset("one word then word", "word"), undefined);
  assert.equal(quoteOffset("one word then word", "word", "then "), 14);
  assert.equal(quoteOffset("changed", "old"), undefined);
  assert.equal(quoteOffset("a passage b", "passage", "a ", " b"), 2);
});
test("notebook serializes concurrent independent mutations and survives restart", async (t) => {
  const root = await fixture(t); const store = new NotebookStore(path.join(root, "notebook.json"));
  await Promise.all(Array.from({ length: 15 }, (_, index) => store.add("01_Hardware/lesson.md", { ...note, note: String(index) })));
  const before = await store.snapshot("01_Hardware/lesson.md"); assert.equal(before.entries.length, 15);
  await Promise.all([store.position("01_Hardware/lesson.md", "section"), store.update("01_Hardware/lesson.md", before.entries[0].id, "updated"), store.remove("01_Hardware/lesson.md", before.entries[1].id)]);
  const after = await new NotebookStore(store.filePath).snapshot("01_Hardware/lesson.md");
  assert.equal(after.position, "section"); assert.equal(after.entries.length, 14); assert.equal(after.entries[0].note, "updated");
  await store.add("01_Hardware/lesson.md", { ...note, kind: "bookmark", quote: "" });
  await store.add("01_Hardware/lesson.md", { ...note, kind: "bookmark", quote: "" });
  assert.equal((await store.snapshot("01_Hardware/lesson.md")).entries.filter((entry) => entry.kind === "bookmark").length, 1);
});
test("corrupt notebook is not silently reset", async (t) => {
  const root = await fixture(t); const file = path.join(root, "notebook.json"); await writeFile(file, "broken");
  await assert.rejects(new NotebookStore(file).add("lesson.md", note)); assert.equal(await readFile(file, "utf8"), "broken");
});
test("API validates paths, headings, payload bounds and keeps source untouched", async (t) => {
  const root = await fixture(t); await mkdir(path.join(root, "01_Hardware"));
  const source = "# Section\n\nA passage to study."; await writeFile(path.join(root, "01_Hardware/lesson.md"), source);
  const app = express(); app.use("/api/notebook", createNotebookRouter(new NotebookStore(path.join(root, "data.json")), new MarkdownFileStore(root)));
  const server = createServer(app); await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve)); t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}/api/notebook`;
  const baseRevision = (await new MarkdownFileStore(root).read("01_Hardware/lesson.md")).revision;
  const request = (method, data, query = "?path=01_Hardware%2Flesson.md") => fetch(base + query, { method, headers: { "content-type": "application/json" }, ...(data ? { body: JSON.stringify({ baseRevision, ...data }) } : {}) });
  assert.equal((await request("POST", note)).status, 200);
  assert.equal((await request("POST", { ...note, baseRevision: "stale" })).status, 409);
  assert.equal((await request("PUT", { position: "absent" })).status, 400);
  assert.equal((await request("POST", { ...note, quote: "x".repeat(4001) })).status, 400);
  assert.equal((await request("GET", undefined, "?path=..%2Fsecret.md")).status, 400);
  assert.equal((await request("GET", undefined, "?path=01_Hardware%2Fabsent.md")).status, 404);
  assert.equal((await request("GET")).status, 200);
  assert.equal(await readFile(path.join(root, "01_Hardware/lesson.md"), "utf8"), source);
  const image = await fetch(base + "/image?path=01_Hardware%2Flesson.md&src=../../secret.png"); assert.equal(image.status, 404);
});
