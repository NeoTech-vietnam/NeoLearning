import { defineConfig } from "@playwright/test";
import path from "node:path";

const fixtureRoot = path.resolve(import.meta.dirname, "tests/.tmp/repository");
const fixtureQuestDirectory = path.resolve(import.meta.dirname, "tests/.tmp/quests");
const fixtureDataRoot = path.resolve(import.meta.dirname, "tests/.tmp/e2e-data");
const clientPort = 5180;
const apiPort = 4180;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  retries: 0,
  timeout: 45_000,
  globalSetup: "./tests/e2e/global-setup.ts",
  use: { baseURL: `http://127.0.0.1:${clientPort}`, trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: `concurrently --kill-others-on-fail \"npm run dev:server\" \"npm run dev:client -- --port ${clientPort}\"`,
    url: `http://127.0.0.1:${clientPort}`,
    reuseExistingServer: false,
    env: {
      API_PORT: String(apiPort),
      NEOLEARNING_REPOSITORY_ROOT: fixtureRoot,
      NEOLEARNING_QUEST_DIRECTORY: fixtureQuestDirectory,
      NEOLEARNING_DATA_ROOT: fixtureDataRoot
    }
  }
});
