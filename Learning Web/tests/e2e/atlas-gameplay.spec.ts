import { expect, test } from "@playwright/test";

test("continues across borders, opens a gate, and reloads its field journal", async ({ page }) => {
  await page.goto("/#/atlas?path=01_Hardware%2Flesson.md&mode=quest&quest=atlas-gameplay-quest");
  const compass = page.getByRole("region", { name: "Journey compass" });
  await expect(compass).toContainText("Software fixture");
  const portal = page.getByRole("button", { name: /Cross border to/ });
  await expect(portal).toHaveAttribute("data-portal", "country");
  await portal.click();
  await expect(page).toHaveURL(/02_Software%2Flesson.md/);
  await expect(compass).toContainText("Protocol fixture");
  await compass.getByRole("button", { name: "Continue journey" }).click();
  await expect(page).toHaveURL(/03_Interfaces-and-Protocols%2Flesson.md/);
  await compass.getByRole("button", { name: "Open challenge gate" }).click();
  await expect(page.getByRole("heading", { name: "Atlas Gameplay Quest" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Complete", exact: true })).toBeDisabled();
  await page.getByLabel("Trace the road tried").fill("Traced a path through the three fixture regions.");
  await page.getByLabel("Trace the road result").fill("The route and links resolved correctly.");
  await page.getByLabel("Trace the road next measurement").fill("Measure the fixture signal on real hardware.");
  await page.getByRole("button", { name: "Complete", exact: true }).click();
  await expect(page.getByText("complete", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Trace on Atlas" }).click();
  await expect(page.getByRole("region", { name: "Expedition journal" })).toContainText("Measure the fixture signal on real hardware.");
  await page.reload();
  await expect(page.getByRole("region", { name: "Expedition journal" })).toContainText("Traced a path through the three fixture regions.");
});

test("visited territory state survives reload and road motion respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/atlas?path=02_Software&mode=quest&quest=atlas-gameplay-quest");
  await expect.poll(async () => (await page.request.get("/api/learning/atlas")).json()).toMatchObject({ visits: { "02_Software": expect.any(String) } });
  await page.reload();
  await expect(page.getByRole("region", { name: "Journey compass" })).toContainText(/Contains (visited|practiced|evidenced) activity/);
  const road = page.locator(".atlas-nested-map__roads polyline").first();
  if (await road.count()) await expect(road).toHaveCSS("animation-name", "none");
});
