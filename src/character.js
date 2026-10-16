import { CATEGORIES, CLOTH_COLORS, HAIR_COLORS, SKIN_COLORS, characterSvgBody, helpers } from "./parts.js";

const NS = "http://www.w3.org/2000/svg";

export const STARTERS = {
  witch: {
    head: "round", skin: SKIN_COLORS[0], hair: "long", hairColor: HAIR_COLORS[2], beard: "none", beardColor: HAIR_COLORS[4],
    hat: "stars", hatColor: CLOTH_COLORS[0], outfit: "dress", outfitColor: CLOTH_COLORS[0], face: "happy", helper: "none",
  },
  wizard: {
    head: "round", skin: SKIN_COLORS[0], hair: "short", hairColor: HAIR_COLORS[4], beard: "long", beardColor: HAIR_COLORS[4],
    hat: "stars", hatColor: CLOTH_COLORS[1], outfit: "cape", outfitColor: CLOTH_COLORS[1], face: "calm", helper: "none",
  },
};

export function characterSvg(c) {
  return `<svg xmlns="${NS}" viewBox="0 0 200 260">${characterSvgBody(c)}</svg>`;
}

export function helperSvg(name) {
  return `<svg xmlns="${NS}" viewBox="0 0 200 200">${helpers[name]()}</svg>`;
}

// Character on the left, helper (if any) standing beside it.
export function previewSvg(c) {
  const helper = c.helper === "none" ? "" : `<g transform="translate(185 120) scale(0.7)">${helpers[c.helper]()}</g>`;
  return `<svg xmlns="${NS}" viewBox="0 0 330 260" role="img" aria-label="Your character">
    <g transform="translate(-10 0)">${characterSvgBody(c)}</g>${helper}</svg>`;
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];

export function randomCharacter() {
  const c = {};
  for (const { key, options, colorKey, colors } of CATEGORIES) {
    c[key] = pick(options);
    if (colorKey) c[colorKey] = pick(colors);
  }
  if (c.beard !== "none" && Math.random() < 0.5) c.beard = "none";
  return c;
}
