import { test, expect } from "@playwright/test";

async function startGame(page) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
}

const placeOutside = (page, x) =>
  page.evaluate((x) => { Object.assign(window.__game.player, { room: "outside", x, y: 0 }); }, x);

test("shop on the street can be entered and left", async ({ page }) => {
  await startGame(page);
  const door = await page.evaluate(() => window.__game.shopDoor());
  await placeOutside(page, door.x + 65);
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "shop");

  await page.evaluate(() => { window.__game.player.x = 150 + 65; });
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "outside");
  const x = await page.evaluate(() => window.__game.player.x);
  expect(Math.abs(x - (door.x + 65))).toBeLessThan(1);
});

test("shop front is drawn on the street", async ({ page }) => {
  await startGame(page);
  const door = await page.evaluate(() => window.__game.shopDoor());
  await placeOutside(page, door.x + 65);
  await page.waitForTimeout(150);
  const pixel = await page.evaluate(() =>
    [...document.getElementById("game").getContext("2d").getImageData(480, 170, 1, 1).data]);
  expect(pixel).toEqual([29, 16, 48, 255]);
});

test("pressing up away from the shop door does not enter it (unhappy path)", async ({ page }) => {
  await startGame(page);
  await placeOutside(page, 2500);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.__game.player.room)).toBe("outside");
});

test("a shop lady stands behind the counter", async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { Object.assign(window.__game.player, { room: "shop", x: 1100 }); });
  await page.waitForTimeout(150);
  const pixel = await page.evaluate(() => {
    const { x, y } = window.__game.shopLadyFace();
    return [...document.getElementById("game").getContext("2d").getImageData(x - 620, y, 1, 1).data];
  });
  expect(pixel).toEqual([232, 213, 181, 255]);
});

test("no shop lady in other rooms (unhappy path)", async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { Object.assign(window.__game.player, { room: "pinkDad", x: 1250 }); });
  await page.waitForTimeout(150);
  const pixel = await page.evaluate(() =>
    [...document.getElementById("game").getContext("2d").getImageData(480, 278, 1, 1).data]);
  expect(pixel).not.toEqual([232, 213, 181, 255]);
});
