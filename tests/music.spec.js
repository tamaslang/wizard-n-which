import { test, expect } from "@playwright/test";

const playing = (page) => page.evaluate(() => import("/src/sound.js").then((m) => m.isMusicPlaying()));

test("spooky music plays on the opening screen after the first tap and stops when the game starts", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.mouse.click(10, 10);
  await page.waitForTimeout(500);
  expect(await playing(page)).toBe(true);
  await page.click("#start");
  expect(await playing(page)).toBe(false);
  expect(errors).toEqual([]);
});

test("music is off while muted and comes back when unmuted on the opening screen (unhappy path)", async ({ page }) => {
  await page.goto("/");
  await page.click("#mute");
  expect(await playing(page)).toBe(false);
  await page.click("#mute");
  expect(await playing(page)).toBe(true);
});

test("music does not come back after leaving the opening screen (unhappy path)", async ({ page }) => {
  await page.goto("/");
  await page.click("#start");
  await page.click("#mute");
  await page.click("#mute");
  expect(await playing(page)).toBe(false);
});
