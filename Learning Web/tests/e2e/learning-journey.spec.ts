import { expect, test } from "@playwright/test";

test("opens a fixture lesson from the atlas without touching the real curriculum", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Atlas", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Embedded World" })).toBeVisible();
  await page.locator(".world-map__label", { hasText: "Hardware Kingdom" }).click();
  await page.locator(".atlas-page__panel").getByRole("button", { name: /Fixture Lesson/ }).click();
  await expect(page.getByRole("heading", { name: "lesson.md" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Fixture lesson", exact: true })).toBeVisible();
});

test("reviews, saves, and reloads Markdown only inside the temporary fixture", async ({ page }) => {
  await page.goto("/#/editor?path=01_Hardware%2Flesson.md");
  await page.getByRole("button", { name: "Source + preview" }).click();
  await page.locator(".monaco-editor .view-lines").click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText("# Updated from browser\n\nSafe fixture save.");
  await page.getByRole("button", { name: "Review save" }).click();
  await expect(page.getByRole("heading", { name: "Review changes" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm save" }).click();
  await expect(page.getByText("Saved. The content index has been refreshed.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Updated from browser")).toBeVisible();
});

test("keeps an unsaved draft when the server revision changes", async ({ page, request }) => {
  await page.goto("/#/editor?path=01_Hardware%2Flesson.md");
  await page.getByRole("button", { name: "Source + preview" }).click();
  await page.locator(".monaco-editor .view-lines").click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText("# Browser draft\n\nThis draft must survive a conflict.");

  const current = await request.get("/api/files/read?path=01_Hardware%2Flesson.md");
  const document = await current.json() as { revision: string };
  const update = await request.put("/api/files/write", {
    data: { path: "01_Hardware/lesson.md", baseRevision: document.revision, content: "# Server version" }
  });
  expect(update.ok()).toBeTruthy();

  await page.getByRole("button", { name: "Review save" }).click();
  await expect(page.getByRole("heading", { name: "The source changed" })).toBeVisible();
  await expect(page.locator(".monaco-editor .view-lines")).toContainText("Browser draft");
});

test("renders untrusted Markdown without raw HTML execution", async ({ page }) => {
  await page.goto("/#/editor?path=01_Hardware%2Funsafe-preview.md");
  await expect(page.getByRole("heading", { name: "Safe rendered heading" })).toBeVisible();
  await expect(page.locator(".markdown-preview script, .markdown-preview img")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (window as Window & { __unsafePreview?: boolean }).__unsafePreview)).toBeUndefined();
});

test("asks before local navigation discards an unsaved draft", async ({ page }) => {
  await page.goto("/#/editor?path=01_Hardware%2Flesson.md");
  await page.getByRole("button", { name: "Source + preview" }).click();
  await page.locator(".monaco-editor .view-lines").click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText("# Draft before navigation");

  await page.getByRole("link", { name: "Atlas", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Discard unsaved draft?" })).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(page.getByRole("heading", { name: "lesson.md" })).toBeVisible();
  await page.getByRole("link", { name: "Atlas", exact: true }).click();
  await page.getByRole("button", { name: "Discard and leave" }).click();
  await expect(page.getByRole("heading", { name: "Embedded World" })).toBeVisible();
});

test("rejects path traversal through the fixture file API", async ({ request }) => {
  const response = await request.get("/api/files/read?path=..%2FREADME.md");
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ error: { code: "BAD_REQUEST" } });
});

test("shows a quest destination and challenge and reports a failed save", async ({ page }) => {
  await page.goto("/#/quests");
  await expect(page.locator(".quest-board__card").filter({ hasText: "Fixture Quest" }).locator(".quest-board__destination")).toContainText("A working fixture result.");
  await page.locator(".quest-board__card").filter({ hasText: "Fixture Quest" }).getByRole("button", { name: "View quest" }).click();
  await expect(page.locator(".quest-detail__destination")).toContainText("A working fixture result.");
  await expect(page.locator(".quest-detail__challenge")).toContainText("Show that the fixture lesson can be traced");
  await page.route("**/api/progress/fixture-quest/milestones/read-fixture", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: '{"error":{"code":"INTERNAL_ERROR","message":"Temporary failure"}}' });
  });
  await page.getByLabel("Read fixture tried").fill("I traced the lesson and ran the fixture waveform lab.");
  await page.getByLabel("Read fixture result").fill("The simulated waveform matched the target.");
  await page.getByLabel("Read fixture next measurement").fill("Measure the output high time with a scope on hardware.");
  await page.getByRole("button", { name: "Complete", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Progress not saved" })).toBeVisible();
  await expect(page.locator(".quest-detail__challenge")).toContainText("Show that the fixture lesson");
  await page.unroute("**/api/progress/fixture-quest/milestones/read-fixture");
});

test("completes a fixture quest and exposes persisted progress in the UI", async ({ page }) => {
  await page.goto("/#/quests");
  await page.locator(".quest-board__card").filter({ hasText: "Fixture Quest" }).getByRole("button", { name: "View quest" }).click();
  await page.getByLabel("Read fixture tried").fill("I traced the lesson and ran the fixture waveform lab.");
  await page.getByLabel("Read fixture result").fill("The simulated waveform matched the target.");
  await page.getByLabel("Read fixture next measurement").fill("Measure the output high time with a scope on hardware.");
  await page.getByRole("button", { name: "Complete", exact: true }).click();
  await expect(page.getByText("complete", { exact: true })).toBeVisible();
});
