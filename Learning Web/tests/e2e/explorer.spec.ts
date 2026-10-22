import { expect, test } from "@playwright/test";

test("daily check-in updates camp, calendar and EXP once and survives reload on mobile", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Explorer camp" })).toBeVisible();
  await expect(page.locator(".explorer-panel__rank")).toBeVisible();
  const before = await (await request.get("/api/explorer")).json() as { totalExp: number; checkedIn: boolean };
  if (!before.checkedIn) await page.getByRole("button", { name: "Daily check-in · +5 EXP" }).click();
  await expect(page.getByRole("button", { name: "Checked in today ✓" })).toBeDisabled();
  const earned = await (await request.get("/api/explorer")).json() as { totalExp: number };
  expect(earned.totalExp).toBe(before.totalExp + (before.checkedIn ? 0 : 5));
  await request.post("/api/explorer/check-in", { data: { exp: 999999, day: "2001-01-01" } });
  expect((await (await request.get("/api/explorer")).json() as { totalExp: number }).totalExp).toBe(earned.totalExp);
  await page.reload();
  await expect(page.getByRole("button", { name: "Checked in today ✓" })).toBeDisabled();
  await page.getByRole("button", { name: /Show reward history/ }).click();
  await expect(page.locator(".explorer-panel__history")).toContainText("Daily check-in");
  await page.screenshot({ path: "/tmp/neolearning-camp-phone.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("quest expedition exposes current stage, focus mode and free map navigation", async ({ page }) => {
  await page.goto("/#/quests?quest=environmental-watchtower");
  await expect(page.getByRole("region", { name: "Current expedition stage" })).toBeVisible();
  await page.getByRole("button", { name: "Show all stages" }).click();
  await page.getByRole("button", { name: "Focus current stage" }).click();
  await expect(page.getByRole("button", { name: "Show all stages" })).toBeVisible();
  await page.getByRole("link", { name: "Explore this stage →" }).click();
  await expect(page.getByRole("heading", { name: "Fixture Expedition" })).toBeVisible();
  await expect(page.locator('[data-explorer="true"]')).toHaveCount(1);
});

test("field encounters explain wrong predictions, save one reward, and keep evidence checkpoints separate", async ({ page, request }) => {
  await page.goto("/#/quests?quest=environmental-watchtower");
  await expect(page.getByRole("heading", { name: "The silent sensor" })).toBeVisible();
  await page.getByRole("button", { name: "Show all stages" }).click();
  await expect(page.getByRole("button", { name: "Complete", exact: true }).nth(1)).toBeDisabled();
  await page.getByLabel("Connect directly and compensate in firmware").check();
  await page.getByRole("button", { name: "Check prediction" }).click();
  await expect(page.locator(".field-clue")).toContainText("Not yet");
  await page.getByLabel("Check voltage ratings and design compatible level shifting").check();
  await page.getByRole("button", { name: "Check prediction" }).click();
  await expect(page.locator(".field-clue")).toContainText("Clue understood");
  await page.getByRole("button", { name: "Check prediction" }).click();
  const profile = await (await request.get("/api/explorer")).json() as { rewards: { id: string; exp: number }[] };
  expect(profile.rewards.filter((item) => item.id === "clue:environmental-watchtower:choose-electrical-contract")).toEqual([expect.objectContaining({ exp: 20 })]);
  const progress = await (await request.get("/api/progress/environmental-watchtower")).json() as { progress: { milestones: Record<string, { status: string }> } };
  expect(progress.progress.milestones["choose-electrical-contract"].status).toBe("not-started");
  await page.screenshot({ path: "/tmp/neolearning-expedition-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "/tmp/neolearning-expedition-phone.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("explorer error is recoverable and does not display fabricated progress", async ({ page }) => {
  await page.route("**/api/explorer/sync", (route) => route.fulfill({ status: 500, body: "{}", contentType: "application/json" }));
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("has not been reset");
  await expect(page.getByRole("button", { name: "Daily check-in · +5 EXP" })).toBeDisabled();
  await page.unroute("**/api/explorer/sync");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.locator(".explorer-panel__rank")).toBeVisible();
});

test("ordered stages advance to destination, persist journals and light the completed map road", async ({ page, request }) => {
  await page.goto("/#/quests?quest=environmental-watchtower");
  for (const [index, title] of ["Check electrical contract", "Measure the bench", "Prove the prototype"].entries()) {
    await expect(page.locator(".expedition-brief")).toContainText(`Stage ${index + 1}/3`);
    await page.getByLabel(`${title} tried`).fill("I built and tested the fixture circuit.");
    await page.getByLabel(`${title} result`).fill("The observed result matched the expected behavior.");
    await page.getByLabel(`${title} next measurement`).fill("Repeat the measurement on physical hardware.");
    if (index === 2) await page.getByLabel(`${title} evidence`).fill("fixture-test-report.log");
    await page.getByRole("button", { name: "Complete", exact: true }).click();
  }
  await expect(page.getByRole("heading", { name: "Destination reached ✦" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Destination reached ✦" })).toBeVisible();
  await expect(page.getByLabel("Prove the prototype result")).toHaveValue("The observed result matched the expected behavior.");
  await request.post("/api/explorer/sync");
  const profile = await (await request.get("/api/explorer")).json() as { rewards: { id: string; exp: number }[] };
  expect(profile.rewards.find((item) => item.id === "quest:environmental-watchtower")?.exp).toBe(200);
  await page.getByRole("link", { name: "Trace on Atlas" }).click();
  await expect(page.locator('.world-map__quest-marker[data-complete="true"]')).toHaveCount(3);
  await expect(page.locator(".world-map__quest-road--complete")).toHaveCount(2);
});
