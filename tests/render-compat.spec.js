import { test, expect } from "@playwright/test";

async function enterGame(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await expect(page.locator("#game")).toBeVisible();
  await page.waitForFunction(() => window.__game);
  await page.waitForTimeout(400);
  return errors;
}

const paintedPixels = (page) =>
  page.evaluate(() => {
    const d = document.getElementById("game").getContext("2d").getImageData(0, 0, 960, 540).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 200) if (d[i]) n++;
    return n;
  });

test("game canvas renders in this browser", async ({ page }) => {
  const errors = await enterGame(page);
  expect(await paintedPixels(page)).toBeGreaterThan(5000);
  expect(errors).toEqual([]);
});

test("game still renders when canvas roundRect is unsupported (older browsers)", async ({ page }) => {
  await page.addInitScript(() => delete CanvasRenderingContext2D.prototype.roundRect);
  const errors = await enterGame(page);
  expect(await page.evaluate(() => typeof CanvasRenderingContext2D.prototype.roundRect)).toBe("function");
  expect(await paintedPixels(page)).toBeGreaterThan(5000);
  expect(errors).toEqual([]);
});

test("game still renders when Image.decode() rejects", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLImageElement.prototype.decode = () => Promise.reject(new DOMException("nope", "EncodingError"));
  });
  const errors = await enterGame(page);
  expect(await paintedPixels(page)).toBeGreaterThan(5000);
  expect(errors).toEqual([]);
});

test("a drawing error does not freeze the game loop", async ({ page }) => {
  await enterGame(page);
  const before = await page.evaluate(() => window.__game.player.x);
  await page.evaluate(() => {
    const orig = CanvasRenderingContext2D.prototype.fillRect;
    let hits = 0;
    CanvasRenderingContext2D.prototype.fillRect = function (...a) {
      if (hits++ < 3) throw new Error("boom");
      return orig.apply(this, a);
    };
  });
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(500);
  await page.keyboard.up("ArrowRight");
  expect(await page.evaluate(() => window.__game.player.x)).toBeGreaterThan(before);
  expect(await paintedPixels(page)).toBeGreaterThan(5000);
});
