import { HEADS, drawCharacter } from "./character.js";

export function startDesigner({ state, onDone }) {
  const canvas = document.getElementById("preview");
  const options = document.getElementById("head-options");
  const ctx = canvas.getContext("2d");

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height - 20);
    ctx.scale(2.2, 2.2);
    drawCharacter(ctx, state.character);
    ctx.restore();
    for (const button of options.children) {
      button.setAttribute("aria-pressed", button.dataset.head === state.character.head);
    }
  };

  options.replaceChildren(
    ...Object.entries(HEADS).map(([key, { label }]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.dataset.head = key;
      button.textContent = label;
      button.addEventListener("click", () => {
        state.character.head = key;
        render();
      });
      return button;
    })
  );

  document.getElementById("designer-done").onclick = onDone;
  render();
}
