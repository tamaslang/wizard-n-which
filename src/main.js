import { state, showScene } from "./scenes.js";

const isPhone = matchMedia("(pointer: coarse) and (max-width: 820px)").matches;

addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById("start");
  const notice = document.getElementById("phone-notice");

  if (isPhone) {
    start.disabled = true;
    notice.hidden = false;
    return;
  }

  start.addEventListener("click", () => showScene("choice"));

  for (const button of document.querySelectorAll(".choice")) {
    button.addEventListener("click", () => {
      state.character = button.dataset.character;
      document.getElementById("choice-result").textContent =
        `You chose to be a ${state.character}! The character designer is coming soon.`;
    });
  }
});
