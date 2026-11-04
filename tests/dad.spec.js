import { test, expect } from "@playwright/test";

const SKIN = [232, 213, 181, 255];
const dadRooms = ["homeDad", "pinkDad", "blueDad", "yellowDad"];

async function startGame(page) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
}

const sample = (page, visit, lookup) =>
  page.evaluate(([visit, lookup]) => {
    window.__game.player.room = visit;
    window.__game.player.x = 900;
    return new Promise((resolve) => setTimeout(() => {
      const { x, y } = window.__game.dadFace(lookup);
      resolve([...document.getElementById("game").getContext("2d").getImageData(x - 420, y, 1, 1).data]);
    }, 150));
  }, [visit, lookup]);

for (const room of dadRooms) {
  test(`${room} has a dad standing in it`, async ({ page }) => {
    await startGame(page);
    expect(await sample(page, room, room)).toEqual(SKIN);
  });
}

test("there is no dad in my room (unhappy path)", async ({ page }) => {
  await startGame(page);
  expect(await sample(page, "myRoom", "pinkDad")).not.toEqual(SKIN);
});
