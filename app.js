const steps = [
  { key: "bread", title: "Choose your bread", multi: false, options: ["Sourdough", "Rye", "Ciabatta", "Baguette"] },
  { key: "protein", title: "Pick a protein", multi: false, options: ["Turkey", "Ham", "Falafel", "Tofu"] },
  { key: "toppings", title: "Add toppings", multi: true, options: ["Lettuce", "Tomato", "Pickles", "Onion", "Cheese"] },
  { key: "sauce", title: "Select a sauce", multi: false, options: ["Mayo", "Mustard", "Pesto", "Hummus"] },
];

const state = {};
let index = 0;

const $ = (id) => document.getElementById(id);

function render() {
  const el = $("step");
  const back = $("back");
  const next = $("next");
  $("progress").innerHTML = `<div style="width:${(index / (steps.length + 1)) * 100}%"></div>`;
  back.disabled = index === 0;

  if (index === steps.length) {
    const { bread, protein, toppings = [], sauce } = state;
    el.innerHTML = `<h2>Your spell is complete ✨</h2>
      <p>A <strong>${protein}</strong> sandwich on <strong>${bread}</strong>
      with ${toppings.length ? toppings.join(", ") : "no toppings"} and <strong>${sauce}</strong>.</p>`;
    next.textContent = "Start over";
    next.disabled = false;
    return;
  }

  const step = steps[index];
  const type = step.multi ? "checkbox" : "radio";
  const chosen = [].concat(state[step.key] ?? []);
  el.innerHTML = `<h2>${step.title}</h2><div class="options">${step.options
    .map((o) => `<label><input type="${type}" name="${step.key}" value="${o}"
      ${chosen.includes(o) ? "checked" : ""}> ${o}</label>`).join("")}</div>`;
  next.textContent = "Next";
  const update = () => {
    const vals = [...el.querySelectorAll("input:checked")].map((i) => i.value);
    state[step.key] = step.multi ? vals : vals[0];
    next.disabled = !step.multi && !vals.length;
  };
  el.addEventListener("change", update);
  update();
}

$("back").onclick = () => { index = Math.max(0, index - 1); render(); };
$("next").onclick = () => {
  if (index === steps.length) { Object.keys(state).forEach((k) => delete state[k]); index = 0; }
  else index++;
  render();
};

render();
