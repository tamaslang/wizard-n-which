import { test, expect } from "@playwright/test";

test("main page loads", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e));

  const response = await page.goto("/");

  expect(response.ok()).toBeTruthy();
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toEqual([]);
});
