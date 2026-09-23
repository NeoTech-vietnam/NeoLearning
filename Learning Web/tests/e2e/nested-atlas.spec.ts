import { expect, test } from "@playwright/test";

test("zooms into a country and opens a topic territory from the map", async ({ page }) => {
  await page.goto("/#/atlas?path=01_Hardware");
  const map = page.getByRole("region", { name: "Hardware Kingdom territory map" });
  await expect(map).toBeVisible();
  const lesson = map.locator('[data-path="01_Hardware/lesson.md"]');
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.getByRole("heading", { name: "lesson.md" })).toBeVisible();
  await page.goBack();
  await expect(map).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "lesson.md" })).toBeVisible();
  await page.goBack();
  await expect(map).toBeVisible();
  await page.reload();
  await expect(map).toBeVisible();
});

test("shows an ordered quest road across countries and opens its stops", async ({ page }) => {
  await page.goto("/#/atlas?mode=quest&quest=fixture-quest");
  await expect(page.locator(".world-map__route-overlay")).toBeVisible();
  const stop = page.getByRole("button", { name: /^Quest stop 1:/ });
  await expect(stop).toBeVisible();
  await stop.click();
  await expect(page).toHaveURL(/path=01_Hardware/);
  await expect(page.locator(".atlas-nested-map__route-note")).toContainText("Software Empire");
  await page.locator(".quest-route__stops button").nth(2).click();
  await expect(page).toHaveURL(/path=03_Interfaces-and-Protocols/);
  await expect(page.locator(".atlas-nested-map__route-note")).toContainText("Hardware Kingdom");
});

test("keeps territory controls usable on a phone-sized viewport and supports Enter", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/atlas?path=01_Hardware");
  const map = page.getByRole("region", { name: "Hardware Kingdom territory map" });
  const lesson = map.locator('[data-path="01_Hardware/lesson.md"]');
  await expect(lesson).toBeVisible();
  const box = await lesson.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await lesson.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/editor/);
  await expect(page.getByRole("heading", { name: "lesson.md" })).toBeVisible();
});
