import { test, expect } from "@playwright/test";

async function startGame(page) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
}

const knobPixel = (page, room) =>
  page.evaluate((r) => {
    const { x, y } = window.__game.wardrobeKnob(r);
    return [...document.getElementById("game").getContext("2d").getImageData(x, y, 1, 1).data];
  }, room);

test("mum's room has a wardrobe with a dark round knob", async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { window.__game.player.x = 1700 + 65; });
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "mum");
  await page.waitForTimeout(100);
  expect(await knobPixel(page, "mum")).toEqual([42, 42, 42, 255]);
});

test("dad's room has a wardrobe with a dark round knob", async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { window.__game.player.x = 1530 + 65; });
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "homeDad");
  await page.waitForTimeout(100);
  expect(await knobPixel(page, "dad")).toEqual([42, 42, 42, 255]);
});

test("wardrobe is absent in rooms that don't have one (unhappy path)", async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { Object.assign(window.__game.player, { room: "shop", x: 900 }); });
  await page.waitForTimeout(150);
  expect(await knobPixel(page, "mum")).not.toEqual([42, 42, 42, 255]);
});

const neighbourRooms = [
  ["pinkMum", "mum"], ["blueMum", "mum"], ["yellowMum", "mum"],
  ["pinkDad", "dad"], ["blueDad", "dad"], ["yellowDad", "dad"],
];

for (const [room, kind] of neighbourRooms) {
  test(`${room} has a wardrobe with a dark round knob`, async ({ page }) => {
    await startGame(page);
    await page.evaluate((r) => { window.__game.player.room = r; window.__game.player.x = 400; }, room);
    await page.waitForTimeout(150);
    expect(await knobPixel(page, kind)).toEqual([42, 42, 42, 255]);
  });
}

test("pressing up in front of the wardrobe opens it, and again closes it", async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { window.__game.player.x = 1700 + 65; });
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "mum");
  await page.evaluate(() => { window.__game.player.x = 375; });
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(150);
  expect(await knobPixel(page, "mum")).not.toEqual([42, 42, 42, 255]);
  expect(await page.evaluate(() => window.__game.openWardrobes.has("mum"))).toBe(true);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.__game.openWardrobes.has("mum"))).toBe(false);
  await page.evaluate(() => { window.__game.player.x = 470; });
  await page.waitForTimeout(150);
  expect(await knobPixel(page, "mum")).toEqual([42, 42, 42, 255]);
});

test("pressing up away from the wardrobe does not open it", async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { window.__game.player.x = 1700 + 65; });
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "mum");
  await page.evaluate(() => { window.__game.player.x = 700; });
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.__game.openWardrobes.size)).toBe(0);
});

async function openWardrobeInMumRoom(page) {
  await startGame(page);
  await page.evaluate(() => { window.__game.player.x = 1700 + 65; });
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => window.__game.player.room === "mum");
  await page.evaluate(() => { window.__game.player.x = 375; });
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(100);
}

test("left + up lights up a dress, down puts it on", async ({ page }) => {
  await openWardrobeInMumRoom(page);
  await page.keyboard.down("ArrowLeft");
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(150);
  await page.keyboard.up("ArrowUp");
  await page.keyboard.up("ArrowLeft");
  expect(await page.evaluate(() => window.__game.litRobe.get("mum"))).toBe(0);
  expect(await page.evaluate(() => window.__game.openWardrobes.has("mum"))).toBe(true);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.__game.player.dress)).toBe("#7a3fa0");
});

test("pressing the combo again lights the next dress", async ({ page }) => {
  await openWardrobeInMumRoom(page);
  for (let i = 0; i < 2; i++) {
    await page.keyboard.down("ArrowLeft");
    await page.keyboard.down("ArrowUp");
    await page.waitForTimeout(120);
    await page.keyboard.up("ArrowUp");
    await page.keyboard.up("ArrowLeft");
    await page.waitForTimeout(60);
  }
  expect(await page.evaluate(() => window.__game.litRobe.get("mum"))).toBe(1);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.__game.player.dress)).toBe("#2f6fd0");
});

test("down without a lit dress, or with a closed cupboard, wears nothing", async ({ page }) => {
  await openWardrobeInMumRoom(page);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.__game.player.dress)).toBeFalsy();
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(100);
  await page.keyboard.down("ArrowLeft");
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(120);
  await page.keyboard.up("ArrowUp");
  await page.keyboard.up("ArrowLeft");
  expect(await page.evaluate(() => window.__game.litRobe.size)).toBe(0);
});
