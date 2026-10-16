import { CATEGORIES } from "./parts.js";
import { characterSvg, helperSvg, previewSvg, randomCharacter } from "./character.js";

export function startDesigner({ state, onDone }) {
  const preview = document.getElementById("preview");
  const tabs = document.getElementById("tabs");
  const options = document.getElementById("options");
  const swatches = document.getElementById("swatches");
  const categories = () => CATEGORIES.filter((c) => !c.only || c.only === state.character.type);
  let current = categories()[0];

  const renderPreview = (bounce) => {
    preview.innerHTML = previewSvg(state.character);
    if (bounce) {
      preview.classList.remove("bounce");
      void preview.offsetWidth;
      preview.classList.add("bounce");
    }
  };

  const thumb = (category, id) =>
    category.key === "helper"
      ? helperSvg(id === "none" ? "none" : id)
      : characterSvg({ ...state.character, [category.key]: id });

  const renderTabs = () => {
    tabs.replaceChildren(
      ...categories().map((category) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tab";
        button.setAttribute("aria-pressed", category === current);
        button.innerHTML = `<span class="icon">${category.icon}</span>${category.label}`;
        button.onclick = () => {
          current = category;
          renderPanel();
        };
        return button;
      })
    );
  };

  const renderPanel = () => {
    renderTabs();
    options.replaceChildren(
      ...current.options.map((id) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";
        button.setAttribute("aria-label", id);
        button.setAttribute("aria-pressed", state.character[current.key] === id);
        button.innerHTML = id === "none" ? `<span class="none">None</span>` : thumb(current, id);
        button.onclick = () => {
          state.character[current.key] = id;
          renderPanel();
          renderPreview(true);
        };
        return button;
      })
    );
    swatches.replaceChildren(
      ...(current.colors ?? []).map((color) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "swatch";
        button.style.background = color;
        button.setAttribute("aria-label", `colour ${color}`);
        button.setAttribute("aria-pressed", state.character[current.colorKey] === color);
        button.onclick = () => {
          state.character[current.colorKey] = color;
          renderPanel();
          renderPreview(true);
        };
        return button;
      })
    );
  };

  document.getElementById("surprise").onclick = () => {
    state.character = randomCharacter(state.character.type);
    renderPanel();
    renderPreview(true);
  };
  document.getElementById("designer-done").onclick = onDone;

  renderPanel();
  renderPreview(false);
}
