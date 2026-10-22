import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { register } from "tsx/esm/api";

register();

const { ContentIndex } = await import("../../server/content/index.ts");
const { createContentRouter } = await import("../../server/routes/content.ts");
const express = (await import("express")).default;

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "neolearning-content-"));
  const write = async (relativePath, content = "") => {
    const file = path.join(root, relativePath);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content, "utf8");
  };
  await write("README.md", `
## 01 — Hardware

### [Core & Unicode](01_Hardware/01_Core/)
- [Nested](01_Hardware/01_Core/02_Nested/)
- [Examples](01_Hardware/01_Core/02_example/)
- [Missing listed folder](01_Hardware/01_Missing/)

## 02 — Software

### [Languages](02_Software/01_Languages/)
`);
  await write("01_Hardware/01_Core/README.md");
  await write("01_Hardware/01_Core/02_Nested/lesson.md", "---\ntitle: Bài học\n---\n# Bài học\n\n## Đầu đề Unicode\n\nNeedle body text.");
  await write("01_Hardware/01_Core/02_Nested/second.md", "# Same Title\n\nAnother lesson.");
  await write("01_Hardware/01_Core/02_example/README.md", "# Excluded example");
  await write("01_Hardware/01_Core/03_Examples/README.md", "# Excluded examples");
  await write("01_Hardware/01_Core/03_Unexpected/04_Deep/third.md", "# Same Title\n\nDeep content.");
  await write("01_Hardware/01_Core/bad.md", "---\ntitle broken\n---\n# Broken metadata");
  await write("01_Hardware/01_Core/unclosed.md", "# Broken Markdown\n\n```c\nint main(void) {}");
  await write("01_Hardware/node_modules/ignored.md", "# Must not appear");
  await write("01_Hardware/.data/ignored.md", "# Must not appear");
  await write("01_Hardware/.git/ignored.md", "# Must not appear");
  await write("02_Software/01_Languages/README.md", "# Languages");
  await write("05_Advanced-Topics/README.md", "# Advanced");
  return { root, write };
}

function flatten(node) {
  return [node, ...node.children.flatMap(flatten)];
}

test("indexes all on-disk topic folders except Example branches", async (t) => {
  const { root } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const index = new ContentIndex(root);
  const tree = await index.tree();
  const allNodes = flatten(tree.root);

  assert.deepEqual(tree.root.children.map((node) => node.relativePath), [
    "01_Hardware", "02_Software", "03_Interfaces-and-Protocols", "04_Soft-Skills", "05_Advanced-Topics", "06_Product_Concepts"
  ]);
  assert.ok(allNodes.some((node) => node.relativePath === "01_Hardware/01_Core/README.md"));
  assert.ok(allNodes.some((node) => node.relativePath === "01_Hardware/01_Core/02_Nested/lesson.md" && node.title === "Bài học"));
  assert.equal(allNodes.filter((node) => node.title === "Same Title").length, 2);
  assert.ok(!allNodes.some((node) => node.title === "Uncharted" || node.unindexed));
  assert.ok(allNodes.some((node) => node.relativePath === "01_Hardware/01_Core/03_Unexpected/04_Deep" && node.kind === "topic"));
  assert.ok(!allNodes.some((node) => node.relativePath?.includes("example") || node.relativePath?.includes("Examples")));
  assert.ok(!allNodes.some((node) => node.relativePath?.includes("node_modules")));
  assert.ok(tree.diagnostics.some((item) => item.code === "README_LINK_MISSING" && item.relativePath === "01_Hardware/01_Missing"));
  assert.ok(!tree.diagnostics.some((item) => item.code === "UNINDEXED_PATH"));
  assert.ok(tree.diagnostics.some((item) => item.code === "MALFORMED_FRONTMATTER" && item.relativePath.endsWith("bad.md")));
  assert.ok(tree.diagnostics.some((item) => item.code === "MALFORMED_MARKDOWN" && item.relativePath.endsWith("unclosed.md")));
  assert.ok(tree.diagnostics.some((item) => item.code === "MISSING_COUNTRY_TAXONOMY" && item.relativePath === "06_Product_Concepts"));
});

test("serves documents, caps searchable content, and refreshes after a save", async (t) => {
  const { root, write } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const index = new ContentIndex(root);
  const document = await index.document("01_Hardware/01_Core/README.md");
  assert.equal(document?.document.content, "");
  assert.equal((await index.document("../README.md")), undefined);
  assert.equal((await index.document("01_Hardware/01_Core/02_example/README.md")), undefined);
  assert.equal((await index.search("Excluded example")).results.length, 0);
  assert.equal((await index.search("đầu đề unicode")).results[0].node.title, "Bài học");

  await write("01_Hardware/01_Core/04_New/lesson.md", "# Fresh lesson\n\nnew searchable content");
  assert.equal((await index.search("fresh lesson")).results.length, 0);
  const refreshed = await index.refresh();
  assert.ok(flatten(refreshed.root).some((node) => node.relativePath === "01_Hardware/01_Core/04_New" && node.kind === "topic"));
  assert.equal((await index.search("fresh lesson")).results.length, 1);
});

test("content routes expose the tree, document and search APIs", async (t) => {
  const { root, write } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const app = express();
  const index = new ContentIndex(root);
  app.use("/api/content", createContentRouter(index));
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/api/content`;

  const fullResponse = await fetch(`${base}/tree`);
  assert.equal(fullResponse.status, 200);
  const fullTree = await fullResponse.json();
  const atlasResponse = await fetch(`${base}/tree?view=atlas`);
  assert.equal(atlasResponse.headers.get("content-encoding"), "gzip");
  const atlasTree = await atlasResponse.json();
  const collectPaths = (node) => [node.relativePath, ...node.children.flatMap(collectPaths)];
  assert.deepEqual(collectPaths(atlasTree.root), collectPaths(fullTree.root));
  assert.deepEqual(atlasTree.diagnostics, []);
  assert.ok(JSON.stringify(atlasTree).length < JSON.stringify(fullTree).length);
  const identityResponse = await fetch(`${base}/tree?view=atlas`, { headers: { "accept-encoding": "identity" } });
  assert.equal(identityResponse.headers.get("content-encoding"), null);
  assert.deepEqual(await identityResponse.json(), atlasTree);
  await write("01_Hardware/01_Core/new.md", "# New route landmark");
  await index.refresh();
  const refreshedAtlas = await (await fetch(`${base}/tree?view=atlas`)).json();
  assert.ok(collectPaths(refreshedAtlas.root).includes("01_Hardware/01_Core/new.md"));
  assert.equal((await fetch(`${base}/document?path=../README.md`)).status, 400);
  assert.equal((await fetch(`${base}/document?path=01_Hardware%2F01_Core%2FREADME.md`)).status, 200);
  assert.equal((await fetch(`${base}/search?q=Needle`)).status, 200);
  assert.equal((await fetch(`${base}/search?q=`)).status, 400);
});
