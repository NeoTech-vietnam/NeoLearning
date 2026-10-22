import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const testsRoot = path.join(projectRoot, "tests");
const filters = process.argv.slice(2).map((value) => value.toLocaleLowerCase());

async function findTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findTests(entryPath);
    return entry.isFile() && entry.name.endsWith(".test.mjs") ? [entryPath] : [];
  }));
  return files.flat();
}

const candidates = await findTests(testsRoot);
const selected = candidates.filter((file) => {
  if (filters.length === 0) return true;
  const relativePath = path.relative(testsRoot, file).replaceAll(path.sep, "/").toLocaleLowerCase();
  return filters.some((filter) => relativePath.includes(filter));
});

if (selected.length === 0) {
  console.error(`No tests matched: ${filters.join(", ") || "all"}`);
  process.exitCode = 1;
} else {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--test", ...selected],
    { cwd: projectRoot, stdio: "inherit" }
  );
  process.exitCode = result.status ?? 1;
}
