import { test, expect } from "@playwright/test";

const SKIN = [232, 213, 181, 255];
const mumRooms = ["mum", "pinkMum", "blueMum", "yellowMum"];

async function startGame(page) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
}

const forehead = (page, room) =>
  page.evaluate((room) => {
    window.__game.player.room = room;
    window.__game.player.x = 900;
    return new Promise((resolve) => setTimeout(() => {
      const { x, y } = window.__game.mumFace(room);
      resolve([...document.getElementById("game").getContext("2d").getImageData(x - 420, y, 1, 1).data]);
    }, 150));
  }, room);

for (const room of mumRooms) {
  test(`${room} has a mum standing in it`, async ({ page }) => {
    await startGame(page);
    expect(await forehead(page, room)).toEqual(SKIN);
  });
}

test("there is no mum in a dad's room (unhappy path)", async ({ page }) => {
  await startGame(page);
  const pixel = await page.evaluate(() => {
    window.__game.player.room = "pinkDad";
    window.__game.player.x = 900;
    return new Promise((resolve) => setTimeout(() => {
      const { x, y } = window.__game.mumFace("pinkMum");
      resolve([...document.getElementById("game").getContext("2d").getImageData(x - 420, y, 1, 1).data]);
    }, 150));
  });
  expect(pixel).not.toEqual(SKIN);
});
