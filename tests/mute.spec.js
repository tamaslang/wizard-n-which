import { test, expect } from "@playwright/test";

const muted = (page) => page.evaluate(() => localStorage.getItem("wnw-muted"));

async function startGame(page) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
}

test("sound button turns sound off and on again", async ({ page }) => {
  await page.goto("/");
  await page.click("#mute");
  expect(await muted(page)).toBe("1");
  await expect(page.locator("#mute")).toHaveAttribute("aria-pressed", "true");
  await page.click("#mute");
  expect(await muted(page)).toBe("0");
  await expect(page.locator("#mute")).toHaveAttribute("aria-pressed", "false");
});

test("sound stays off while playing, even after pressing jump or enter (unhappy path)", async ({ page }) => {
  await startGame(page);
  await page.click("#mute");
  expect(await muted(page)).toBe("1");
  for (const key of ["Space", "Enter", "ArrowUp"]) {
    await page.keyboard.press(key);
    await page.waitForTimeout(100);
  }
  expect(await muted(page)).toBe("1");
});

test("muted state is remembered after a reload", async ({ page }) => {
  await page.goto("/");
  await page.click("#mute");
  await page.reload();
  await expect(page.locator("#mute")).toHaveAttribute("aria-pressed", "true");
});
