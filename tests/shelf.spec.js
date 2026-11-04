import { test, expect } from "@playwright/test";

async function startInShop(page, x) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
  await page.evaluate((x) => { Object.assign(window.__game.player, { room: "shop", x, y: 0 }); }, x);
}

const bag = (page) => page.evaluate(() => window.__game.player.basket.length);
const hold = async (page) => {
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(80);
  await page.keyboard.up("ArrowUp");
};
const height = (page) => page.evaluate(() => window.__game.player.y);

test("pressing up in front of a shelf takes a potion off it", async ({ page }) => {
  await startInShop(page, 500);
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => bag(page)).toBe(1);
  expect(await page.evaluate(() => window.__game.takenPotions.size)).toBe(1);
  expect(await height(page)).toBe(0);
});

test("each press takes a different potion until the shelf is empty, then up jumps (unhappy path)", async ({ page }) => {
  await startInShop(page, 500);
  for (let i = 1; i <= 8; i++) {
    await page.keyboard.press("ArrowUp");
    await expect.poll(() => bag(page)).toBe(i);
  }
  await hold(page);
  await expect.poll(() => page.evaluate(() => window.__game.player.vy !== 0 || window.__game.player.y > 0)).toBe(true);
  expect(await bag(page)).toBe(8);
});

test("pressing up away from any shelf just jumps and takes nothing (unhappy path)", async ({ page }) => {
  await startInShop(page, 900);
  await hold(page);
  await expect.poll(() => page.evaluate(() => window.__game.player.vy !== 0 || window.__game.player.y > 0)).toBe(true);
  expect(await bag(page)).toBe(0);
});

const state = (page) => page.evaluate(() => ({ money: window.__game.player.money, bag: window.__game.player.bag.length, basket: window.__game.player.basket.length }));

test("taking a potion then pressing down at the counter pays and keeps it", async ({ page }) => {
  await startInShop(page, 500);
  expect((await state(page)).money).toBe(20);
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => bag(page)).toBe(1);
  await page.evaluate(() => { window.__game.player.x = 1100; });
  await page.waitForTimeout(100);
  await page.keyboard.press("ArrowDown");
  await expect.poll(async () => (await state(page)).bag).toBe(1);
  expect(await state(page)).toEqual({ money: 18, bag: 1, basket: 0 });
});

test("pressing down away from the counter does not pay (unhappy path)", async ({ page }) => {
  await startInShop(page, 500);
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => bag(page)).toBe(1);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(100);
  expect(await state(page)).toEqual({ money: 20, bag: 0, basket: 1 });
});

test("cannot pay without enough money (unhappy path)", async ({ page }) => {
  await startInShop(page, 500);
  await page.evaluate(() => { window.__game.player.money = 1; });
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => bag(page)).toBe(1);
  await page.evaluate(() => { window.__game.player.x = 1100; });
  await page.waitForTimeout(100);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(100);
  expect(await state(page)).toEqual({ money: 1, bag: 0, basket: 1 });
});

test("unpaid potions go back on the shelf when you leave the shop", async ({ page }) => {
  await startInShop(page, 500);
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => bag(page)).toBe(1);
  await page.evaluate(() => { window.__game.player.x = 215; });
  await page.waitForTimeout(100);
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "outside");
  expect(await state(page)).toEqual({ money: 20, bag: 0, basket: 0 });
  expect(await page.evaluate(() => window.__game.takenPotions.size)).toBe(0);
});
