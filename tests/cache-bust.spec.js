import { test, expect } from "@playwright/test";
import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "../scripts/build-site.mjs";

test("built site stamps every script, import and stylesheet with the version", () => {
  const out = mkdtempSync(join(tmpdir(), "site-"));
  buildSite(out, "abc123");
  const html = readFileSync(join(out, "index.html"), "utf8");
  expect(html).toContain('src="src/main.js?v=abc123"');
  expect(html).toContain('href="style.css?v=abc123"');
  for (const f of readdirSync(join(out, "src")).filter((n) => n.endsWith(".js"))) {
    const imports = readFileSync(join(out, "src", f), "utf8").match(/from\s+"\.\/[^"]+"/g) || [];
    for (const i of imports) expect(i, `${f}: ${i}`).toContain("?v=abc123");
  }
});

test("different deploys produce different URLs", () => {
  const a = mkdtempSync(join(tmpdir(), "a-"));
  const b = mkdtempSync(join(tmpdir(), "b-"));
  buildSite(a, "v1");
  buildSite(b, "v2");
  expect(readFileSync(join(a, "index.html"), "utf8")).not.toBe(readFileSync(join(b, "index.html"), "utf8"));
});

test("stamped site still loads and runs the game", async ({ page }) => {
  const out = mkdtempSync(join(tmpdir(), "site-"));
  buildSite(out, "abc123");
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("http://stamped.test/**", (route) => {
    const u = new URL(route.request().url());
    const path = join(out, u.pathname === "/" ? "index.html" : u.pathname);
    const type = path.endsWith(".js") ? "text/javascript" : path.endsWith(".css") ? "text/css" : "text/html";
    route.fulfill({ body: readFileSync(path), contentType: type });
  });
  await page.goto("http://stamped.test/");
  await expect(page.locator("#mute")).toBeVisible();
  expect(errors).toEqual([]);
});
