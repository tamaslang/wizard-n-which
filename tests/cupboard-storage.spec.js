import { test, expect } from "@playwright/test";

async function startInMyRoom(page, x) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
  await page.evaluate((x) => { Object.assign(window.__game.player, { room: "myRoom", x, y: 0, bag: ["#ff5fa2", "#5fd0ff"] }); }, x);
  await page.waitForTimeout(150);
}

const counts = (page) => page.evaluate(() => ({ bag: window.__game.player.bag.length, stored: window.__game.cupboardPotions.length }));

test("my room has a wardrobe", async ({ page }) => {
  await startInMyRoom(page, 480);
  const knob = await page.evaluate(() => {
    const { x, y } = window.__game.wardrobeKnob("mum");
    return [...document.getElementById("game").getContext("2d").getImageData(x, y, 1, 1).data];
  });
  expect(knob).toEqual([42, 42, 42, 255]);
});

test("pressing down in front of my cupboard puts the bought potions in it", async ({ page }) => {
  await startInMyRoom(page, 375);
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => counts(page)).toEqual({ bag: 0, stored: 2 });
});

test("pressing down away from my cupboard keeps the potions (unhappy path)", async ({ page }) => {
  await startInMyRoom(page, 900);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(150);
  expect(await counts(page)).toEqual({ bag: 2, stored: 0 });
});

test("pressing down at my cupboard with an empty bag does nothing (unhappy path)", async ({ page }) => {
  await startInMyRoom(page, 375);
  await page.evaluate(() => { window.__game.player.bag = []; });
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(150);
  expect(await counts(page)).toEqual({ bag: 0, stored: 0 });
});
