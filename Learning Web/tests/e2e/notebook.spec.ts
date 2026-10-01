import { test, expect } from "@playwright/test";
const path = "01_Hardware/notebook.md";
const route = `/#/editor?${new URLSearchParams({ path })}`;
test("ordinary Markdown gets focus/settings, safe rich code, table and image dialog", async ({ page }) => {
  await page.route("https://example.test/illustration.png", (route) => route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aJ1sAAAAASUVORK5CYII=", "base64") }));
  await page.goto(route);
  await expect(page.getByRole("navigation", { name: "Document sections" }).getByRole("button", { name: "Measurement", exact: true })).toHaveCount(2);
  await page.getByLabel("Text size").selectOption("large"); await page.getByLabel("Reading theme").selectOption("night");
  await page.getByRole("button", { name: "Focus reading" }).click(); await expect(page.getByRole("button", { name: "Exit focus" })).toBeVisible();
  await expect(page.locator(".notebook-reader__index")).toBeHidden();
  await page.getByRole("button", { name: "Exit focus" }).click();
  await expect(page.locator(".code-token--keyword").first()).toContainText("const");
  await page.getByRole("button", { name: "Expand code" }).click();
  await expect(page.locator(".reader-code")).toContainText("Plan the next experiment");
  await page.getByLabel("Page width").selectOption("wide");
  await expect(page.getByRole("button", { name: "Collapse code" })).toBeVisible();
  await page.getByRole("button", { name: "Copy code" }).click(); await expect(page.locator(".reader-code [role=status]")).not.toBeEmpty();
  await page.getByRole("button", { name: "Enlarge image: Test illustration" }).click();
  await expect(page.getByRole("dialog")).toBeVisible(); await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Enlarge image: Test illustration" })).toBeFocused();
  await page.reload(); await expect(page.getByLabel("Reading theme")).toHaveValue("night");
  await page.screenshot({ path: "/tmp/neolearning-notebook-desktop.png", fullPage: true });
});
test("highlights and bookmarks sync to a second browser and notes remain after source changes", async ({ page, browser, request }) => {
  await page.goto(route);
  await expect(page.getByRole("button", { name: "Bookmark section" })).toBeEnabled();
  await page.locator('[data-heading-slug="measurement"]').evaluate((element) => {
    const text = element.querySelector("p")!.firstChild!;
    const range = document.createRange(); range.selectNodeContents(text);
    const selection = window.getSelection()!; selection.removeAllRanges(); selection.addRange(range);
  });
  await page.locator(".notebook-reader__document").dispatchEvent("pointerup");
  await page.getByLabel("Note for selected passage").fill("Check voltage with a meter.");
  await page.getByRole("button", { name: "Save highlight" }).click();
  await expect(page.locator(".notebook-reader__notes details")).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => (CSS as typeof CSS & { highlights?: Map<string, { size: number }> }).highlights?.get("notebook-notes")?.size ?? 0)).toBe(1);
  await page.getByRole("button", { name: "Bookmark section" }).click();
  await expect(page.locator(".notebook-reader__notes details")).toHaveCount(2);
  const other = await browser.newPage(); await other.goto(route);
  await expect(other.locator(".notebook-reader__notes details")).toHaveCount(2); await other.close();
  const file = await (await request.get(`/api/files/read?${new URLSearchParams({ path })}`)).json();
  await request.put("/api/files/write", { data: { path, baseRevision: file.revision, content: file.content.replace("Measure voltage before connecting a new component.", "The passage was rewritten.") } });
  await page.reload(); await page.locator(".notebook-reader__notes details").first().locator("summary").click();
  await expect(page.getByText(/Detached note:/)).toBeVisible();
  await expect(page.locator(".notebook-reader__notes details p").filter({ hasText: "Check voltage with a meter." })).toBeVisible();
});
test("phone reader respects reduced motion and notebook failure retains note draft", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route); await expect(page.getByRole("button", { name: "Bookmark section" })).toBeEnabled();
  await page.route("**/api/notebook?*", async (route) => { if (route.request().method() === "POST") await route.fulfill({ status: 500, body: "failure" }); else await route.continue(); });
  await page.getByRole("button", { name: "Bookmark section" }).click(); await expect(page.getByRole("alert")).toContainText("not saved");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: "/tmp/neolearning-notebook-phone.png", fullPage: true });
});
test("server resume is retained on initial load and reader never writes mastery or EXP", async ({ page, request }) => {
  const file = await (await request.get(`/api/files/read?${new URLSearchParams({ path })}`)).json();
  await request.put(`/api/notebook?${new URLSearchParams({ path })}`, { data: { position: "next-experiment", baseRevision: file.revision } });
  const forbidden: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET" && /\/api\/(learning\/attempt|progress\/|explorer\/check-in)/.test(request.url())) forbidden.push(request.url());
  });
  await page.goto(route); await expect(page.getByRole("button", { name: "Resume reading" })).toBeVisible();
  await expect.poll(async () => (await (await request.get(`/api/notebook?${new URLSearchParams({ path })}`)).json()).position).toBe("next-experiment");
  await page.getByRole("button", { name: "Resume reading" }).click();
  await page.getByRole("button", { name: "Focus reading" }).click();
  expect(forbidden).toEqual([]);
});
