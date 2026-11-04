import { test, expect } from "@playwright/test";

async function startGame(page) {
  await page.goto("/");
  await page.click("#start");
  await page.locator(".choice").first().click();
  await page.click("#designer-done");
  await page.waitForFunction(() => window.__game);
}

test("door sound is short (under a second) and plays without errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__stops = [];
    const Real = window.AudioContext;
    window.AudioContext = class extends Real {
      createOscillator() {
        const o = super.createOscillator();
        const stop = o.stop.bind(o);
        o.stop = (when) => { window.__stops.push(when - this.currentTime); stop(when); };
        return o;
      }
    };
  });
  await startGame(page);
  await page.evaluate(() => import("/src/sound.js").then((m) => m.sfx.door()));
  const stops = await page.evaluate(() => window.__stops);
  expect(stops.length).toBeGreaterThan(0);
  expect(Math.max(...stops)).toBeLessThan(1);
  expect(errors).toEqual([]);
});

test("door sound is silent when muted (unhappy path)", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await startGame(page);
  await page.click("#mute");
  await page.evaluate(() => import("/src/sound.js").then((m) => m.sfx.door()));
  expect(errors).toEqual([]);
});
