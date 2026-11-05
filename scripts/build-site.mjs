// Copies the game into an output dir and stamps every script/style URL with a
// version, so browsers fetch fresh files after each deploy without a hard refresh.
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function buildSite(outDir, version) {
  mkdirSync(outDir, { recursive: true });
  cpSync("src", join(outDir, "src"), { recursive: true });
  cpSync("style.css", join(outDir, "style.css"));
  const stamp = (text, re) => text.replace(re, (_, a, p, b) => `${a}${p}?v=${version}${b}`);
  for (const f of readdirSync(join(outDir, "src")).filter((n) => n.endsWith(".js"))) {
    const file = join(outDir, "src", f);
    writeFileSync(file, stamp(readFileSync(file, "utf8"), /((?:from|import)\s+")(\.\/[^"?]+\.js)(")/g));
  }
  let html = readFileSync("index.html", "utf8");
  html = stamp(html, /(src=")(src\/[^"?]+\.js)(")/g);
  html = stamp(html, /(href=")(style\.css)(")/g);
  writeFileSync(join(outDir, "index.html"), html);
}

if (process.argv[1].endsWith("build-site.mjs")) {
  buildSite(process.argv[2] || "_site", process.argv[3] || String(Date.now()));
}
