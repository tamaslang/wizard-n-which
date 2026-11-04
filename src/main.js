import { sfx, isMuted, setMuted } from "./sound.js";
import { state, showScene } from "./scenes.js";
import { startHome } from "./home.js";
import { startDesigner } from "./designer.js";
import { STARTERS, characterSvg } from "./character.js";

addEventListener("DOMContentLoaded", () => {
  for (const art of document.querySelectorAll(".choice-art")) {
    art.innerHTML = characterSvg(STARTERS[art.dataset.art]);
  }

  const mute = document.getElementById("mute");
  const speaker = (muted) => `<svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h5l7-6v20l-7-6H5z" fill="currentColor"/>${muted ? '<path d="M22 12l7 8M29 12l-7 8"/>' : '<path d="M22 11c2 3 2 7 0 10M26 7c4 5 4 13 0 18"/>'}</svg>`;
  const showMute = () => { mute.innerHTML = speaker(isMuted()); mute.setAttribute("aria-pressed", String(isMuted())); };
  showMute();
  mute.addEventListener("click", () => { setMuted(!isMuted()); showMute(); sfx.click(); mute.blur(); });
  document.addEventListener("click", (e) => { if (e.target.closest("button:not(#mute):not(#touch button)")) sfx.click(); });

  const start = document.getElementById("start");

  start.addEventListener("click", () => showScene("choice"));

  for (const button of document.querySelectorAll(".choice")) {
    button.addEventListener("click", () => {
      state.character = { ...STARTERS[button.dataset.character] };
      showScene("designer");
      startDesigner({
        state,
        onDone: () => {
          showScene("home");
          startHome(document.getElementById("game"), state.character);
        },
      });
    });
  }
});
