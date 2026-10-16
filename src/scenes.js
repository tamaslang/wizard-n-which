export const state = { character: null };

export function showScene(name) {
  for (const scene of document.querySelectorAll("[data-scene]")) {
    scene.hidden = scene.dataset.scene !== name;
  }
}
