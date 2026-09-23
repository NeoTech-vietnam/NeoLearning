import { expect, test } from "@playwright/test";

test("keeps map artwork and the six-country hit layer aligned", async ({ page }) => {
  await page.goto("/#/atlas");
  const map = page.locator(".world-map");
  await expect(map.locator(".world-map__country")).toHaveCount(6);

  const box = await map.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  expect(box.width / box.height).toBeCloseTo(16 / 9, 2);

  const x = box.x + box.width * 0.7;
  const y = box.y + box.height * 0.2;
  await expect.poll(() => page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.getAttribute("aria-label"),
    { x, y }
  )).toMatch(/^02 Software/);

  await page.mouse.click(x, y);
  await expect(map.locator('.world-map__country[aria-label^="02 Software"]')).toHaveAttribute("data-selected", "true");
});
