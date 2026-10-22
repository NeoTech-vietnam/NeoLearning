import { expect, test } from "@playwright/test";
import { discoveryPools } from "../../src/atlas/discovery";
import type { ContentTreeResponse } from "../../src/shared/content";

test("Home spin opens a real small territory, exposes documents, and never immediately repeats", async ({ page, request }) => {
  const tree = await (await request.get("/api/content/tree?view=atlas")).json() as ContentTreeResponse;
  const paths = discoveryPools(tree.root).flatMap((pool) => pool.destinations.map((item) => item.node.relativePath));
  await page.goto("/");
  await page.getByRole("button", { name: "Discover randomly" }).click();
  await expect(page.getByRole("button", { name: "Spinning…" })).toBeDisabled();
  const result = page.locator("[data-discovery-path]");
  await expect(result).toBeVisible();
  const first = await result.getAttribute("data-discovery-path");
  expect(paths).toContain(first); expect(first).not.toMatch(/\.md$/);
  expect(new URL(page.url()).hash).toBe(`#/atlas?${new URLSearchParams({ path: first! })}`);
  await expect(page.locator(".atlas-breadcrumb")).toContainText("Software");
  await page.getByRole("button", { name: "Spin again" }).click();
  await expect(result).not.toHaveAttribute("data-discovery-path", first!);
  const second = await result.getAttribute("data-discovery-path");
  expect(paths).toContain(second);
  await page.reload(); await expect(result).toHaveAttribute("data-discovery-path", second!);
  await page.getByRole("link", { name: "Read documents here →" }).click();
  await expect(page.getByRole("button", { name: "Source + preview" })).toBeVisible();
  await page.goBack(); await expect(result).toHaveAttribute("data-discovery-path", second!);
});

test("cancelled spins and leaving the page do not navigate or record transient visits", async ({ page }) => {
  const visits: string[] = [];
  page.on("request", (request) => { if (request.url().includes("/api/learning/atlas/visit")) visits.push(request.postData() ?? ""); });
  await page.goto("/#/atlas");
  const original = page.url();
  await page.getByRole("button", { name: "Discover randomly" }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  expect(page.url()).toBe(original); expect(visits).toEqual([]);
  await page.getByRole("button", { name: "Discover randomly" }).click();
  await page.getByRole("link", { name: "Quests", exact: true }).click();
  await page.waitForTimeout(1200);
  await expect(page).toHaveURL(/#\/quests$/); expect(visits).toEqual([]);
});

test("discovery remains usable and avoids repeats when session storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage blocked"); };
    Storage.prototype.setItem = () => { throw new Error("Storage blocked"); };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/"); await page.getByRole("button", { name: "Discover randomly" }).click();
  const result = page.locator("[data-discovery-path]"); await expect(result).toBeVisible();
  const first = await result.getAttribute("data-discovery-path");
  await page.getByRole("button", { name: "Spin again" }).click();
  await expect(result).not.toHaveAttribute("data-discovery-path", first!);
});

test("reduced-motion keyboard discovery on phone exits Quest/Review without changing progress", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.setViewportSize({ width: 390, height: 844 });
  const progressWrites: string[] = [];
  page.on("request", (request) => { if (request.url().includes("/api/progress") && request.method() !== "GET") progressWrites.push(request.url()); });
  for (const hash of ["#/atlas?mode=quest&quest=fixture-quest", "#/atlas?mode=review"]) {
    await page.goto(`/${hash}`);
    const button = page.getByRole("button", { name: "Discover randomly" });
    await button.focus(); await page.keyboard.press("Enter");
    await expect(page.locator("[data-discovery-path]")).toBeVisible();
    expect(page.url()).not.toContain("mode="); expect(page.url()).not.toContain("quest=");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: "/tmp/neolearning-discovery-phone.png", fullPage: true });
  }
  expect(progressWrites).toEqual([]);
});

test("Home tree failures retry and empty country-only maps explain why a spin is unavailable", async ({ page }) => {
  await page.route("**/api/content/tree?view=atlas", (route) => route.fulfill({ status: 503, body: "{}", contentType: "application/json" }));
  await page.goto("/"); await page.getByRole("button", { name: "Discover randomly" }).click();
  await expect(page.locator(".discovery-compass [role='alert']")).toContainText("Try again");
  await page.unroute("**/api/content/tree?view=atlas");
  await page.getByRole("button", { name: "Discover randomly" }).click();
  await expect(page.locator("[data-discovery-path]")).toBeVisible();
  await page.route("**/api/content/tree?view=atlas", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ root: { id: "empty-world", title: "Embedded World", kind: "world", children: [], headings: [] } }) }));
  await page.goto("/"); await page.getByRole("button", { name: "Discover randomly" }).click();
  await expect(page.locator(".discovery-compass")).toContainText("No small territories with documents");
  await expect(page.getByRole("button", { name: "Discover randomly" })).toBeDisabled();
});
