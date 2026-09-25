import { expect, test } from "@playwright/test";

test("practices a lesson, saves the PWM lab, and offers its result to a Quest", async ({ page }) => {
  await page.goto("/#/editor?path=01_Hardware%2Finteractive-lesson.md");
  await expect(page.getByRole("heading", { name: "Fixture lesson workshop" })).toBeVisible();
  await expect(page.getByText("0/4 activities practiced")).toBeVisible();

  const choice = page.getByRole("region", { name: "Choose the safe result" });
  await choice.getByLabel("Wrong result").check();
  await choice.getByRole("button", { name: "Check answer" }).click();
  await expect(choice).toContainText("Not quite");
  await choice.getByLabel("Correct result").check();
  await choice.getByRole("button", { name: "Check answer" }).click();
  await expect(choice).toContainText("Correct — explain why");

  const order = page.getByRole("region", { name: "Put steps in order" });
  await order.getByRole("button", { name: "Move step 2 up" }).click();
  await order.getByRole("button", { name: "Check sequence" }).click();
  await expect(order).toContainText("Sequence correct");

  const reflection = page.getByRole("region", { name: "Explain the idea" });
  await reflection.getByLabel("Explain it in your own words").fill("This fixture proves I can explain an interactive lesson.");
  await reflection.getByRole("button", { name: "I can explain it" }).click();
  await expect(reflection).toContainText("This fixture verifies");

  const lab = page.getByRole("region", { name: "Fixture waveform lab" });
  const sliders = lab.locator('input[type="range"]');
  await sliders.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await sliders.nth(1).focus();
  for (let index = 0; index < 5; index++) await page.keyboard.press("ArrowLeft");
  await expect(lab).toContainText("1,000 Hz");
  await expect(lab).toContainText("25%");
  await lab.getByLabel("Your predicted HIGH time (µs)").fill("250");
  await lab.getByRole("button", { name: "Check waveform" }).click();
  await expect(lab).toContainText("Waveform matched");
  await expect(page.getByText("4/4 activities practiced")).toBeVisible();

  await lab.getByRole("link", { name: /Use this simulation result/ }).click();
  await page.locator(".quest-board__card").filter({ hasText: "Fixture Quest" }).getByRole("button", { name: "View quest" }).click();
  const suggestion = page.getByRole("button", { name: /Use completed lab: Fixture waveform lab/ });
  await expect(suggestion).toBeVisible();
  await suggestion.click();
  await expect(page.getByLabel("Read fixture evidence")).toHaveValue(/NeoLearning simulation:/);

  await page.goto("/#/editor?path=01_Hardware%2Finteractive-lesson.md");
  await expect(page.getByText("4/4 activities practiced")).toBeVisible();
});

test("loads the source editor only after asking to edit", async ({ page }) => {
  const editorRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("MonacoEditor.tsx")) editorRequests.push(request.url());
  });
  await page.goto("/#/editor?path=01_Hardware%2Finteractive-lesson.md");
  await expect(page.getByRole("heading", { name: "Fixture lesson workshop" })).toBeVisible();
  expect(editorRequests).toHaveLength(0);
  await page.getByRole("button", { name: "Source + preview" }).click();
  await expect(page.locator(".monaco-editor .view-lines")).toBeVisible();
  expect(editorRequests.length).toBeGreaterThan(0);
});

test("interactive lesson works on a phone and honors reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/editor?path=01_Hardware%2Finteractive-lesson.md");
  await expect(page.getByRole("heading", { name: "Fixture waveform lab" })).toBeVisible();
  const scan = page.locator(".pwm-lab__scan");
  await expect(scan).toHaveCSS("animation-name", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
  await page.getByText("Lesson sections").click();
  await expect(page.getByRole("navigation", { name: "Lesson sections" })).toBeVisible();
});


test("keeps activities accessible when an author changes the lesson heading", async ({ page, request }) => {
  const current = await request.get("/api/files/read?path=01_Hardware%2Finteractive-lesson.md");
  const document = await current.json() as { revision: string };
  const update = await request.put("/api/files/write", {
    data: { path: "01_Hardware/interactive-lesson.md", baseRevision: document.revision, content: "# New title\n\nThe lesson was edited." }
  });
  expect(update.ok()).toBeTruthy();
  await page.goto("/#/editor?path=01_Hardware%2Finteractive-lesson.md");
  await expect(page.getByRole("heading", { name: "Activities needing a location" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Fixture waveform lab" })).toBeVisible();
});
