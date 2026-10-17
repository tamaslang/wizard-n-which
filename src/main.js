import { state, showScene } from "./scenes.js";
import { startHome } from "./home.js";
import { startDesigner } from "./designer.js";
import { STARTERS, characterSvg } from "./character.js";

addEventListener("DOMContentLoaded", () => {
  for (const art of document.querySelectorAll(".choice-art")) {
    art.innerHTML = characterSvg(STARTERS[art.dataset.art]);
  }

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
