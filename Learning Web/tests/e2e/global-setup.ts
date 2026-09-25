import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

export default async function globalSetup() {
  // This is deliberately a leaf directory: fixture setup must never touch
  // source-controlled test files.
  const temporaryRoot = path.resolve(import.meta.dirname, "../.tmp");
  await rm(temporaryRoot, { recursive: true, force: true });
  await mkdir(temporaryRoot, { recursive: true });
  await Promise.all([
    cp(path.resolve(import.meta.dirname, "../fixtures/repository"), path.join(temporaryRoot, "repository"), { recursive: true }),
    cp(path.resolve(import.meta.dirname, "../fixtures/quests"), path.join(temporaryRoot, "quests"), { recursive: true }),
    cp(path.resolve(import.meta.dirname, "../fixtures/activities"), path.join(temporaryRoot, "activities"), { recursive: true }),
    mkdir(path.join(temporaryRoot, "e2e-data"), { recursive: true })
  ]);
}
