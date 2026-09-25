import { expect, test } from "@playwright/test";

test("Review mode maps fixed level-1 and level-2 borders and survives reload", async ({ page }) => {
  const response = await page.request.get("/api/content/tree?view=atlas");
  const tree = await response.json();
  type TreeNode = { kind: string; relativePath?: string; children: TreeNode[] };
  const regionPaths: string[] = [];
  for (const country of tree.root.children as TreeNode[]) {
    if (country.kind !== "country") continue;
    const first = country.children.filter((child) => child.kind !== "lesson");
    for (const region of first.length ? first : [country]) {
      if (region.relativePath) regionPaths.push(region.relativePath);
      for (const second of region.children.filter((child) => child.kind !== "lesson")) {
        if (second.relativePath) regionPaths.push(second.relativePath);
      }
    }
  }
  await page.goto("/#/atlas?mode=review");
  await expect(page.getByRole("region", { name: "World Review coverage" })).toBeVisible();
  await expect(page.locator(".world-map__review-overlay [data-review-path]")).toHaveCount(regionPaths.length);
  const actual = await page.locator(".world-map__review-overlay [data-review-path]").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-review-path")));
  expect(actual.sort()).toEqual(regionPaths.sort());
  await expect(page.locator(".world-map__review-overlay clipPath")).toHaveCount(6);
  await page.reload();
  await expect(page.locator(".world-map__review-overlay [data-review-path]")).toHaveCount(regionPaths.length);
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await expect(page).not.toHaveURL(/mode=review/);
  await page.getByRole("button", { name: "World Review" }).click();
  await expect(page).toHaveURL(/mode=review/);
});

test("hover and keyboard focus inspect an exact region before opening it", async ({ page }) => {
  const path = "02_Software/01_Programming/02_Patterns";
  await page.goto("/#/atlas?mode=review");
  const region = page.locator(`[data-review-path="${path}"]`);
  await expect(region).toHaveAttribute("role", "button");
  await region.hover();
  await expect(region).toHaveAttribute("data-review-active", "true");
  const card = page.locator(".world-review-panel__inspect");
  await expect(card).toContainText("Patterns");
  await expect(card).toContainText("Software Empire / Programming");
  await expect(card).toContainText(/terminal folders visited or completed/);
  await expect(page.locator(".world-map__review-boundary[data-review-active='true']")).toHaveCount(1);
  await page.mouse.move(0, 0);
  await expect(card).toContainText("Hover, focus, or tap a territory");
  await region.focus();
  await expect(card).toContainText("Patterns");
  await region.press("Enter");
  await expect(page).toHaveURL(new RegExp("path=" + path.replaceAll("/", "%2F"), "i"));
});

test("inspector stays outside the map in the same panel corner across hovers", async ({ page }) => {
  await page.goto("/#/atlas?mode=review");
  const card = page.locator(".world-review-panel__inspect");
  const first = page.locator('[data-review-path="02_Software/01_Programming/02_Patterns"]');
  const second = page.locator('[data-review-path="02_Software/01_Programming/01_Basics"]');
  const bounds = () => page.evaluate(() => {
    const card = document.querySelector(".world-review-panel__inspect")!.getBoundingClientRect();
    const panel = document.querySelector(".atlas-page__panel")!.getBoundingClientRect();
    const map = document.querySelector(".atlas-page__map")!.getBoundingClientRect();
    return { left: card.left - panel.left, top: card.top - panel.top, height: card.height,
      outsideRight: card.left >= map.right - 1, outsideBelow: card.top >= map.bottom - 1 };
  });
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await first.hover();
    await expect(card).toContainText("Patterns");
    const firstBounds = await bounds();
    expect(viewport.width === 390 ? firstBounds.outsideBelow : firstBounds.outsideRight).toBe(true);
    await second.hover();
    await expect(card).toContainText("Basics");
    const secondBounds = await bounds();
    expect(secondBounds.left).toBeCloseTo(firstBounds.left, 0);
    expect(secondBounds.top).toBeCloseTo(firstBounds.top, 0);
    expect(secondBounds.height).toBe(firstBounds.height);
    expect(viewport.width === 390 ? secondBounds.outsideBelow : secondBounds.outsideRight).toBe(true);
  }
});

test("clicking a region opens that region while the country label still opens its country", async ({ page }) => {
  await page.goto("/#/atlas?mode=review");
  await page.locator('[data-review-path="02_Software/01_Programming/02_Patterns"]').click();
  await expect(page).toHaveURL(/path=02_Software%2F01_Programming%2F02_Patterns/i);
  await page.goto("/#/atlas?mode=review");
  await page.locator(".world-map__label").filter({ hasText: "Software Empire" }).click();
  await expect(page).toHaveURL(/path=02_Software(?:&|$)/);
});

test.describe("touch interaction", () => {
  test.use({ hasTouch: true });
  test("inspects first and opens the same region on a second tap", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/atlas?mode=review");
    const region = page.locator('[data-review-path="02_Software/01_Programming/02_Patterns"]');
    await region.tap();
    await expect(page).toHaveURL(/mode=review/);
    await expect(page.locator(".world-review-panel__inspect")).toContainText("Patterns");
    await expect(page.locator(".world-review-panel__inspect")).toContainText("Tap again to open");
    await region.tap();
    await expect(page).toHaveURL(/path=02_Software%2F01_Programming%2F02_Patterns/i);
  });
});

test("terminal visit persists across Review reloads", async ({ page }) => {
  const path = "02_Software/01_Programming/02_Patterns";
  await page.goto("/#/atlas?path=" + encodeURIComponent(path));
  await expect.poll(async () => {
    const response = await page.request.get("/api/learning/atlas");
    return (await response.json()).visits[path];
  }).toBeTruthy();
  await page.getByRole("button", { name: "World Review" }).click();
  await expect(page.locator('[data-review-path="' + path + '"]')).toHaveAttribute("data-review-state", "visited");
  await page.reload();
  await expect(page.locator('[data-review-path="' + path + '"]')).toHaveAttribute("data-review-state", "visited");
});

test("completed parent Quest milestone gets its own marker without completing child cells", async ({ page }) => {
  await page.route("**/api/quests", async (route) => {
    const body = await (await route.fetch()).json();
    body.quests.find((quest: { id: string }) => quest.id === "atlas-gameplay-quest").milestones[0].knowledgeLinks = ["02_Software/01_Programming"];
    await route.fulfill({ json: body });
  });
  await page.route("**/api/progress", async (route) => {
    const body = await (await route.fetch()).json();
    body.progress.quests["atlas-gameplay-quest"] = {
      milestones: { "trace-road": { status: "complete", updatedAt: new Date().toISOString() } }
    };
    await route.fulfill({ json: body });
  });
  await page.goto("/#/atlas?mode=review");
  const panel = page.getByRole("region", { name: "World Review coverage" });
  await expect(panel.getByRole("heading", { name: /Completed parent milestones/ })).toContainText("(1)");
  await expect(page.locator(".world-map__review-parent")).toHaveCount(1);
  await expect(panel).toContainText(/Programming/);
  await expect(page.locator('[data-review-path="02_Software/01_Programming/02_Patterns"]')).not.toHaveAttribute("data-review-state", "completed");
});

test("mobile Review keeps map pannable and reduced motion quiet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/atlas?mode=review");
  await expect(page.getByRole("region", { name: "World Review coverage" })).toBeVisible();
  const dimensions = await page.locator(".atlas-page__map--review").evaluate((element) => ({
    visible: element.clientWidth, content: element.scrollWidth
  }));
  expect(dimensions.content).toBeGreaterThan(dimensions.visible);
  await expect(page.locator(".world-map__review-region").first()).toHaveCSS("animation-name", "none");
});
