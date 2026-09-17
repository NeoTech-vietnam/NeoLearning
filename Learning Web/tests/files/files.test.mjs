import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readdir, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { register } from "tsx/esm/api";

register();

const { FileApiError, MarkdownFileStore } = await import("../../server/files/index.ts");
const { createFilesRouter } = await import("../../server/routes/files.ts");
const express = (await import("express")).default;

const revisionFor = (contents) => createHash("sha256").update(contents).digest("hex");

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "neolearning-files-"));
  const outside = await mkdtemp(path.join(os.tmpdir(), "neolearning-files-outside-"));
  const write = async (relativePath, content) => {
    const file = path.join(root, relativePath);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content, "utf8");
  };
  await write("01_Hardware/lesson.md", "# Start\nold line\n");
  await write("01_Hardware/non-markdown.txt", "must not be editable");
  await write("node_modules/blocked.md", "blocked");
  await write(".git/config.md", "blocked");
  await write("dist/generated.md", "blocked");
  await writeFile(path.join(outside, "outside.md"), "outside", "utf8");
  await symlink(path.join(outside, "outside.md"), path.join(root, "01_Hardware", "escape.md"));
  return { root, outside, write };
}

test("reads only canonical repository Markdown paths and hashes their bytes", async (t) => {
  const { root, outside } = await fixture();
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  const store = new MarkdownFileStore(root);
  const document = await store.read("01_Hardware/lesson.md");

  assert.equal(document.relativePath, "01_Hardware/lesson.md");
  assert.equal(document.content, "# Start\nold line\n");
  assert.equal(document.revision, revisionFor(Buffer.from(document.content)));
  assert.match(document.mtime, /^\d{4}-\d{2}-\d{2}T/);

  for (const unsafePath of [
    "../01_Hardware/lesson.md",
    "01_Hardware/../01_Hardware/lesson.md",
    "01_Hardware\\..\\01_Hardware\\lesson.md",
    "/etc/passwd.md",
    "C:\\Windows\\system.md",
    "01_Hardware/lesson.md\0suffix"
  ]) {
    await assert.rejects(store.read(unsafePath), (error) => error instanceof FileApiError && error.status === 400);
  }
  await assert.rejects(store.read("01_Hardware/non-markdown.txt"), (error) => error instanceof FileApiError && error.status === 400);
  for (const forbiddenPath of ["node_modules/blocked.md", ".git/config.md", "dist/generated.md", "01_Hardware/escape.md"]) {
    await assert.rejects(store.read(forbiddenPath), (error) => error instanceof FileApiError && error.status === 403);
  }
});

test("previews a line-oriented diff without changing Unicode Markdown", async (t) => {
  const { root, outside } = await fixture();
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  const store = new MarkdownFileStore(root);
  const before = await store.read("01_Hardware/lesson.md");
  const preview = await store.previewDiff({
    path: before.relativePath,
    baseRevision: before.revision,
    content: "# Start\nDòng Unicode: tiếng Việt\n"
  });

  assert.equal(preview.conflicted, false);
  assert.equal(preview.currentRevision, before.revision);
  assert.deepEqual(preview.diff, [
    { kind: "context", content: "# Start", oldLine: 1, newLine: 1 },
    { kind: "removed", content: "old line", oldLine: 2 },
    { kind: "added", content: "Dòng Unicode: tiếng Việt", newLine: 2 },
    { kind: "context", content: "", oldLine: 3, newLine: 3 }
  ]);
  assert.equal((await readFile(path.join(root, before.relativePath), "utf8")), before.content);
});

test("atomically replaces valid Unicode content and serializes stale concurrent saves", async (t) => {
  const { root, outside } = await fixture();
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  const store = new MarkdownFileStore(root);
  const initial = await store.read("01_Hardware/lesson.md");
  const target = path.join(root, initial.relativePath);
  const originalInode = (await stat(target)).ino;

  const saved = await store.write({
    path: initial.relativePath,
    baseRevision: initial.revision,
    content: "# Đã lưu\nNội dung Unicode giữ nguyên.\n"
  });
  assert.equal(saved.content, "# Đã lưu\nNội dung Unicode giữ nguyên.\n");
  assert.notEqual(saved.revision, initial.revision);
  assert.notEqual((await stat(target)).ino, originalInode);
  assert.deepEqual((await readdir(path.dirname(target))).filter((name) => name.includes(".tmp")), []);

  const stale = saved.revision;
  const results = await Promise.allSettled([
    store.write({ path: saved.relativePath, baseRevision: stale, content: "# First writer\n" }),
    store.write({ path: saved.relativePath, baseRevision: stale, content: "# Second writer\n" })
  ]);
  const fulfilled = results.filter((result) => result.status === "fulfilled");
  const rejected = results.filter((result) => result.status === "rejected");
  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 1);
  assert.ok(rejected[0].reason instanceof FileApiError);
  assert.equal(rejected[0].reason.status, 409);
  assert.equal(rejected[0].reason.details.currentRevision, fulfilled[0].value.revision);

  const bytesAfterConflict = await readFile(target);
  assert.ok(bytesAfterConflict.equals(Buffer.from(fulfilled[0].value.content)));
  await assert.rejects(
    store.write({ path: saved.relativePath, baseRevision: stale, content: "# Failed overwrite\n" }),
    (error) => error instanceof FileApiError && error.status === 409
  );
  assert.ok((await readFile(target)).equals(bytesAfterConflict));
});

test("files router returns structured validation and conflict responses", async (t) => {
  const { root, outside } = await fixture();
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  const app = express();
  const writes = [];
  app.use("/api/files", createFilesRouter(new MarkdownFileStore(root), (file) => {
    writes.push(file.relativePath);
  }));
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/api/files`;

  const read = await fetch(`${base}/read?path=01_Hardware%2Flesson.md`);
  assert.equal(read.status, 200);
  const document = await read.json();
  assert.equal(document.revision, revisionFor(Buffer.from(document.content)));
  assert.equal((await fetch(`${base}/read?path=..%2Flesson.md`)).status, 400);
  assert.equal((await fetch(`${base}/read?path=.git%2Fconfig.md`)).status, 403);

  const preview = await fetch(`${base}/preview-diff`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path: document.relativePath, baseRevision: document.revision, content: "# Preview\n" })
  });
  assert.equal(preview.status, 200);
  assert.equal((await preview.json()).diff.at(-1).content, "");

  const write = (body) => fetch(`${base}/write`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const firstSave = await write({ path: document.relativePath, baseRevision: document.revision, content: "# Updated\n" });
  assert.equal(firstSave.status, 200);
  const current = await firstSave.json();
  assert.deepEqual(writes, [document.relativePath]);
  const conflict = await write({ path: document.relativePath, baseRevision: document.revision, content: "# Stale\n" });
  assert.equal(conflict.status, 409);
  assert.deepEqual(await conflict.json(), {
    error: {
      code: "CONFLICT",
      message: "The Markdown file changed since it was read.",
      details: { currentRevision: current.revision }
    }
  });
  assert.deepEqual(writes, [document.relativePath]);
});
