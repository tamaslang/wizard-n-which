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
  const showMute = () => { mute.textContent = isMuted() ? "🔇" : "🔊"; mute.setAttribute("aria-pressed", String(isMuted())); };
  showMute();
  mute.addEventListener("click", () => { setMuted(!isMuted()); showMute(); sfx.click(); });
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
