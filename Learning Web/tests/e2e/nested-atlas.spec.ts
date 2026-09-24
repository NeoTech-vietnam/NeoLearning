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
test("country atlas clips its territories to the authored coast", async ({ page }) => {
  await page.goto("/#/atlas?path=02_Software");
  const map = page.getByRole("region", { name: "Software Empire territory map" });
  await expect(map).toHaveAttribute("data-silhouette", "inherited");
  await expect(map.locator("clipPath#atlas-inherited-coast path")).toHaveAttribute("d", /^M .+ Z$/);
  await expect(map.locator(".atlas-nested-map__coast")).toBeVisible();
  await expect(map.locator(".atlas-territory")).toHaveCount(3);
  await map.locator('[data-path="02_Software/lesson.md"]').click();
  await expect(page.getByRole("heading", { name: "lesson.md" })).toBeVisible();
});
test("drills recursively through two topic levels and restores their silhouettes", async ({ page }) => {
  await page.goto("/#/atlas?path=02_Software");
  const map = page.locator(".atlas-nested-map");
  const coast = map.locator(".atlas-nested-map__coast");
  const countryOutline = await coast.getAttribute("d");

  await map.locator('[data-path="02_Software/01_Programming"]').click();
  await expect(page).toHaveURL(/01_Programming/);
  await expect(map.locator(".atlas-territory")).toHaveCount(2);
  const programmingOutline = await coast.getAttribute("d");
  expect(programmingOutline).not.toEqual(countryOutline);

  await map.locator('[data-path="02_Software/01_Programming/01_Basics"]').click();
  await expect(page).toHaveURL(/01_Basics/);
  await expect(map.locator(".atlas-territory")).toHaveCount(1);
  const basicsOutline = await coast.getAttribute("d");
  expect(basicsOutline).not.toEqual(programmingOutline);

  await page.reload();
  await expect(coast).toHaveAttribute("d", basicsOutline!);
  await page.goBack();
  await expect(coast).toHaveAttribute("d", programmingOutline!);
  await page.goForward();
  await expect(coast).toHaveAttribute("d", basicsOutline!);
  await map.locator('[data-path="02_Software/01_Programming/01_Basics/lesson.md"]').click();
  await expect(page.getByRole("heading", { name: "lesson.md" })).toBeVisible();
});

test("uses the compact artwork and disables map motion when requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/atlas?path=02_Software");
  const map = page.locator(".atlas-nested-map");
  await expect(map.locator(".atlas-nested-map__art")).toHaveAttribute("src", /\.webp$/);
  const motion = await map.locator(".atlas-nested-map__territories").evaluate((element) =>
    getComputedStyle(element).animationName);
  expect(motion).toBe("none");
});

test("marks a pressed territory before changing the focused map", async ({ page }) => {
  await page.goto("/#/atlas?path=02_Software");
  const target = page.locator('[data-path="02_Software/01_Programming"]');
  await expect(target).toBeVisible();
  const highlighted = await target.evaluate((button) => new Promise<boolean>((resolve) => {
    const observer = new MutationObserver(() => {
      if (button.getAttribute("data-entering") === "true") {
        observer.disconnect();
        resolve(true);
      }
    });
    observer.observe(button, { attributes: true, attributeFilter: ["data-entering"] });
    button.click();
    setTimeout(() => { observer.disconnect(); resolve(false); }, 200);
  }));
  expect(highlighted).toBe(true);
  await expect(page).toHaveURL(/01_Programming/);
});
