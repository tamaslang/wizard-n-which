import "./compat.js";
import { sfx } from "./sound.js";
import { characterSvg, helperSvg } from "./character.js";

const VIEW_W = 960;
const VIEW_H = 540;
const FLOOR_Y = 440;
const SPEED = 260;
const KID_SCALE = 0.5;
const HELPER_SCALE = 0.4;
const JUMP_SPEED = 620;
const GRAVITY = 1700;
const CROUCH_SPEED = 0.4;
const CROUCH_SQUASH = 0.65;
const SIT_SQUASH = 0.8;
const DOOR_W = 130;

const WARDROBE_X = { mum: 300, dad: 300 };
const SHOP_X = 2750;
const MUM_X = { mum: 1135, pinkMum: 1245, blueMum: 975, yellowMum: 880 };
const DAD_X = { homeDad: 1170, pinkDad: 1230, blueDad: 1060, yellowDad: 750 };
const MUM_FACE_Y = 335;
const ROOMS_MUM_WIDTH = 1700;
const KITCHEN_WIDTH = 1900;

const SEATS = {
  chair: { reach: 50, height: 70, dir: -1, dx: 35 },
  bed: { reach: 170, height: 55, dir: 1, dx: 150 },
};

const ROOMS = {
  home: {
    width: 2400,
    doors: [
      { id: "kitchen", x: 300, label: "Kitchen", to: "homeKitchen", arrive: "back" },
      { id: "mine", x: 1200, label: "My room", to: "myRoom", arrive: "back" },
      { id: "dad", x: 1530, label: "Dad", to: "homeDad", arrive: "back" },
      { id: "mum", x: 1700, label: "Mum", to: "mum", arrive: "home" },
      { id: "out", x: 2000, label: "Out", to: "outside", arrive: "home" },
    ],
    draw: drawHome,
  },
  mum: {
    width: 1700,
    wardrobe: true,
    doors: [{ id: "home", x: 150, label: "Back", to: "home", arrive: "mum" }],
    seats: [
      { name: "chair", x: 1045, reach: 50, height: 70, dir: -1 },
      { name: "bed", x: 1450, reach: 170, height: 55, dir: 1 },
    ],
    draw: drawMumRoom,
  },
  outside: {
    width: 4100,
    doors: [
      { id: "home", x: 300, label: "Home", to: "home", arrive: "out" },
      { id: "n1", x: 1015, to: "pink", arrive: "out" },
      { id: "n2", x: 1685, to: "blue", arrive: "out" },
      { id: "n3", x: 2185, to: "yellow", arrive: "out" },
      { id: "shop", x: SHOP_X - DOOR_W / 2, to: "shop", arrive: "back" },
    ],
    draw: drawOutside,
  },
  pinkMum: mumRoom("pink", "#8a4a7a", [drawWardrobe, WARDROBE_X.mum], [drawDresser, 480], [drawShelf, 700], [drawCauldron, 880], [drawChair, 1000, "chair"], [drawMirror, 1150, null], [drawBed, 1300, "bed"], [drawMum, MUM_X.pinkMum, null, "#c0608f"]),
  blueMum: mumRoom("blue", "#3f5a8a", [drawWardrobe, WARDROBE_X.mum], [drawDresser, 480], [drawCabinet, 740], [drawFireplace, 710], [drawCat, 850, null], [drawHangingRack, 990], [drawChair, 1050, "chair"], [drawBed, 1250, "bed"], [drawMum, MUM_X.blueMum, null, "#3f6fb0"]),
  yellowMum: mumRoom("yellow", "#8a7a3a", [drawWardrobe, WARDROBE_X.mum], [drawDresser, 480], [drawCabinet, 480], [drawFireplace, 760], [drawMirror, 1020, null], [drawBroom, 1270], [drawChair, 1310, "chair"], [drawBed, 1400, "bed"], [drawMum, MUM_X.yellowMum, null, "#c08a2f"]),
  homeDad: dadRoom("home", "#3a4a6e", [drawWardrobe, WARDROBE_X.dad], [drawCauldron, 600], [drawShelf, 760], [drawChair, 1000, "chair"], [drawBed, 1250, "bed", "#2f6fd0"], [drawDad, DAD_X.homeDad, null, "#2f6fd0"]),
  pinkDad: dadRoom("pink", "#6e3a5a", [drawWardrobe, WARDROBE_X.dad], [drawBroom, 500], [drawBed, 650, "bed", "#c0392b"], [drawCauldron, 1100], [drawChair, 1300, "chair"], [drawDad, DAD_X.pinkDad, null, "#c0392b"]),
  blueDad: dadRoom("blue", "#2f4a5e", [drawWardrobe, WARDROBE_X.dad], [drawShelf, 500], [drawChair, 800, "chair"], [drawHangingRack, 950], [drawCauldron, 1250], [drawBroom, 1450], [drawDad, DAD_X.blueDad, null, "#2f7a8a"]),
  yellowDad: dadRoom("yellow", "#6e5e2f", [drawWardrobe, WARDROBE_X.dad], [drawCabinet, 490], [drawFireplace, 490], [drawBed, 1000, "bed", "#1f5a3a"], [drawMirror, 1380, null], [drawChair, 1480, "chair"], [drawDad, DAD_X.yellowDad, null, "#1f7a4a"]),
  shop: backRoom("outside", "shop", "#2a1a3a", [[drawShelf, 400], [drawHangingCandles, 700], [drawShopLady, 1000], [drawShopCounter, 1000], [drawPumpkin, 1400], [drawShelf, 1450], [drawSpider, 1360], [drawCeilingBats, 450], [drawCeilingBats, 1150]]),
  myRoom: backRoom("home", "mine", "#4a5a9a", [[drawWardrobe, WARDROBE_X.mum], [drawDresser, 480], [drawShelf, 700], [drawBed, 1000, "bed", "#8e44ad"], [drawMirror, 1350, null], [drawChair, 1500, "chair"]]),
  homeKitchen: kitchenRoom("home", "#e8d9b5", "#5b8fb9"),
  pinkKitchen: kitchenRoom("pink", "#f0d3e0", "#c0608f"),
  blueKitchen: kitchenRoom("blue", "#d3e3f0", "#3f6fb0"),
  yellowKitchen: kitchenRoom("yellow", "#f3e8b0", "#c08a2f"),
  pink: neighbourRoom("n1", "pinkMum", "pinkDad", "pinkKitchen", "#7a5a8a", [drawShelf, 450], [drawCauldron, 900], [drawBed, 1000, "bed"]),
  blue: neighbourRoom("n2", "blueMum", "blueDad", "blueKitchen", "#3a4f7a", [drawCabinet, 450], [drawChair, 900, "chair"], [drawMirror, 1050, null], [drawCat, 1200, null]),
  yellow: neighbourRoom("n3", "yellowMum", "yellowDad", "yellowKitchen", "#7a6a3a", [drawShelf, 450], [drawBroom, 800], [drawChair, 950, "chair"], [drawBed, 1050, "bed"]),
};

function mumRoom(parent, wall, ...items) {
  return backRoom(parent, "mum", wall, items);
}

function dadRoom(parent, wall, ...items) {
  return backRoom(parent, "dad", wall, items);
}

function backRoom(parent, arrive, wall, items) {
  const door = { id: "back", x: 150, label: "Back", to: parent, arrive };
  return {
    width: ROOMS_MUM_WIDTH,
    doors: [door],
    seats: seatsFor(items),
    shelves: shelvesFor(items),
    wardrobe: items.some(([fn]) => fn === drawWardrobe),
    draw(ctx) {
      paintRoom(ctx, ROOMS_MUM_WIDTH, wall);
      furnish(ctx, items);
      drawDoor(ctx, door.x, door.label);
    },
  };
}

function seatsFor(items) {
  return items
    .filter(([, , kind]) => kind in SEATS)
    .map(([, x, kind]) => ({ name: kind, x: x + SEATS[kind].dx, reach: SEATS[kind].reach, height: SEATS[kind].height, dir: SEATS[kind].dir }));
}

function shelvesFor(items) {
  return items.filter(([fn]) => fn === drawShelf).map(([, x]) => x);
}

function paintRoom(ctx, width, wall) {
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, FLOOR_Y);
  ctx.fillStyle = "#6b4a2b";
  ctx.fillRect(0, FLOOR_Y, width, VIEW_H - FLOOR_Y);
  drawWeb(ctx, 40, 0);
}

function furnish(ctx, items) {
  for (const [fn, x, , colour] of items) {
    if (fn === drawCat) fn(ctx, x, FLOOR_Y);
    else if (fn === drawMirror) fn(ctx, x, FLOOR_Y - 70);
    else fn(ctx, x, colour);
  }
}

function neighbourRoom(arrive, mumKey, dadKey, kitchenKey, wall, ...items) {
  const width = 2100;
  const seats = seatsFor(items);
  const door = { id: "out", x: 150, label: "Out", to: "outside", arrive };
  const mumDoor = { id: "mum", x: 1500, label: "Mum", to: mumKey, arrive: "back" };
  const dadDoor = { id: "dad", x: 1800, label: "Dad", to: dadKey, arrive: "back" };
  const kitchenDoor = { id: "kitchen", x: 300, label: "Kitchen", to: kitchenKey, arrive: "back" };
  return {
    width,
    doors: [door, kitchenDoor, mumDoor, dadDoor],
    seats,
    shelves: shelvesFor(items),
    draw(ctx) {
      paintRoom(ctx, width, wall);
      furnish(ctx, items);
      drawDoor(ctx, door.x, door.label);
      drawDoor(ctx, mumDoor.x, mumDoor.label);
      drawDoor(ctx, dadDoor.x, dadDoor.label);
      drawDoor(ctx, kitchenDoor.x, kitchenDoor.label);
    },
  };
}

function kitchenRoom(parent, wall, accent) {
  const door = { id: "back", x: 150, label: "Back", to: parent, arrive: "kitchen" };
  return {
    width: KITCHEN_WIDTH,
    doors: [door],
    shelves: [500],
    seats: [
      { name: "stool", x: 1520, reach: 40, height: 45, dir: 1 },
      { name: "stool", x: 1740, reach: 40, height: 45, dir: -1 },
    ],
    draw(ctx) {
      drawKitchen(ctx, KITCHEN_WIDTH, wall, accent);
      drawDoor(ctx, door.x, door.label);
    },
  };
}

function drawKitchen(ctx, w, wall, accent) {
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, FLOOR_Y);
  ctx.fillStyle = "#fffa";
  ctx.fillRect(0, 250, w, FLOOR_Y - 250);
  ctx.fillStyle = "#0002";
  for (let x = 0; x < w; x += 50) ctx.fillRect(x, 250, 2, FLOOR_Y - 250);
  for (let y = 250; y < FLOOR_Y; y += 50) ctx.fillRect(0, y, w, 2);
  for (let x = 0; x < w; x += 60) {
    for (let r = 0; r < 2; r++) {
      ctx.fillStyle = (x / 60 + r) % 2 ? "#e9e3d6" : "#9a8f7c";
      ctx.fillRect(x, FLOOR_Y + r * 50, 60, 50);
    }
  }

  // window with night sky and curtains
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(520, 70, 200, 170);
  ctx.fillStyle = "#26205a";
  ctx.fillRect(530, 80, 180, 150);
  ctx.fillStyle = "#ffe9a8";
  ctx.beginPath();
  ctx.arc(650, 130, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(617, 80, 6, 150);
  ctx.fillRect(530, 152, 180, 6);
  ctx.fillStyle = accent;
  ctx.fillRect(505, 62, 45, 190);
  ctx.fillRect(690, 62, 45, 190);

  // upper cabinets
  ctx.fillStyle = accent;
  for (const x of [250, 760]) {
    ctx.fillRect(x, 70, 230, 150);
    ctx.fillStyle = "#0003";
    ctx.fillRect(x + 113, 70, 4, 150);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(x + 95, 170, 8, 24);
    ctx.fillRect(x + 127, 170, 8, 24);
    ctx.fillStyle = accent;
  }

  // lower cabinets and worktop
  ctx.fillStyle = accent;
  ctx.fillRect(250, 340, 740, 100);
  ctx.fillStyle = "#0003";
  for (const x of [250, 430, 620, 800]) ctx.fillRect(x, 340, 4, 100);
  ctx.fillStyle = "#ffd166";
  for (const x of [380, 560, 750, 930]) ctx.fillRect(x - 8, 365, 8, 28);
  ctx.fillStyle = "#cfc6b8";
  ctx.fillRect(235, 325, 770, 18);

  // sink and tap
  ctx.fillStyle = "#9fb2bf";
  ctx.beginPath();
  ctx.roundRect(440, 322, 160, 12, [0, 0, 14, 14]);
  ctx.fill();
  ctx.fillStyle = "#aab";
  ctx.fillRect(515, 270, 10, 52);
  ctx.fillRect(515, 270, 40, 8);
  ctx.fillRect(547, 270, 8, 20);

  // kettle, jars and fruit bowl on the worktop
  ctx.fillStyle = "#d9d9e6";
  ctx.beginPath();
  ctx.roundRect(840, 285, 55, 40, 10);
  ctx.fill();
  ctx.fillRect(895, 295, 18, 6);
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(850, 276, 35, 6);
  ctx.fillStyle = "#c9b8ee";
  ctx.fillRect(275, 290, 30, 35);
  ctx.fillRect(315, 280, 30, 45);
  ctx.fillStyle = "#e94b3c";
  ctx.beginPath();
  ctx.arc(700, 315, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2c94c";
  ctx.beginPath();
  ctx.arc(722, 316, 10, 0, Math.PI * 2);
  ctx.fill();

  // stove, oven and extractor hood
  ctx.fillStyle = "#2b2b33";
  ctx.fillRect(1060, 340, 200, 100);
  ctx.fillStyle = "#444452";
  ctx.fillRect(1070, 372, 180, 60);
  ctx.fillStyle = "#6a6a78";
  ctx.fillRect(1080, 382, 160, 40);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(1100, 354, 10, 10);
  ctx.fillRect(1160, 354, 10, 10);
  ctx.fillRect(1210, 354, 10, 10);
  ctx.fillStyle = "#1c1c22";
  ctx.fillRect(1050, 328, 220, 14);
  ctx.fillStyle = "#1c1c22";
  ctx.beginPath();
  ctx.ellipse(1105, 326, 26, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(1215, 326, 26, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#b0b0bc";
  ctx.beginPath();
  ctx.moveTo(1060, 110);
  ctx.lineTo(1250, 110);
  ctx.lineTo(1280, 200);
  ctx.lineTo(1030, 200);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(1130, 60, 50, 50);

  // pot with steam
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.roundRect(1075, 282, 60, 44, [0, 0, 8, 8]);
  ctx.fill();
  ctx.fillStyle = "#333";
  ctx.fillRect(1066, 290, 10, 6);
  ctx.fillRect(1134, 290, 10, 6);
  ctx.strokeStyle = "#fffb";
  ctx.lineWidth = 3;
  const t = performance.now() / 500;
  for (const dx of [1090, 1105, 1120]) {
    ctx.beginPath();
    ctx.moveTo(dx, 275);
    ctx.bezierCurveTo(dx + 8 * Math.sin(t + dx), 260, dx - 8 * Math.sin(t + dx), 245, dx + 4, 230);
    ctx.stroke();
  }

  // hanging utensils
  ctx.strokeStyle = "#3b2a1a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(1300, 90);
  ctx.lineTo(1560, 90);
  ctx.stroke();
  ctx.fillStyle = "#777";
  for (const x of [1330, 1390, 1450]) {
    ctx.fillRect(x, 92, 4, 40);
    ctx.beginPath();
    ctx.arc(x + 2, 150, 20, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillRect(1510, 92, 4, 60);
  ctx.fillRect(1500, 150, 24, 8);

  // fridge
  ctx.fillStyle = "#f4f6fa";
  ctx.beginPath();
  ctx.roundRect(1300, 190, 150, 250, 8);
  ctx.fill();
  ctx.fillStyle = "#0003";
  ctx.fillRect(1300, 290, 150, 4);
  ctx.fillStyle = "#9aa";
  ctx.fillRect(1420, 220, 8, 50);
  ctx.fillRect(1420, 310, 8, 80);
  ctx.fillStyle = "#e94b3c";
  ctx.fillRect(1330, 210, 22, 22);
  ctx.fillStyle = "#4bb36b";
  ctx.fillRect(1360, 214, 22, 22);

  // table with stools
  ctx.fillStyle = "#8a5a2b";
  ctx.fillRect(1550, 385, 160, 12);
  ctx.fillRect(1560, 397, 10, 43);
  ctx.fillRect(1690, 397, 10, 43);
  for (const x of [1520, 1740]) {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(x - 24, 395, 48, 12, 6);
    ctx.fill();
    ctx.fillStyle = "#5b3f24";
    ctx.fillRect(x - 17, 407, 7, 33);
    ctx.fillRect(x + 10, 407, 7, 33);
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(1630, 380, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

const POTION_COLOURS = ["#ff5fa2", "#5fd0ff", "#7dff8a", "#ffd166"];
const SHELF_W = 260;
const takenPotions = new Set();
let drawingRoom = "";

const potionSpots = (sx) =>
  Array.from({ length: 8 }, (_, i) => ({ i, x: sx + 40 + (i % 4) * 60, y: i < 4 ? 200 : 300 }));

function nearPotion(player) {
  let best = null;
  for (const sx of ROOMS[player.room].shelves ?? []) {
    if (player.x < sx || player.x > sx + SHELF_W) continue;
    for (const spot of potionSpots(sx)) {
      if (takenPotions.has(`${player.room}:${sx}:${spot.i}`)) continue;
      const dist = Math.abs(player.x - spot.x);
      if (!best || dist < best.dist) best = { key: `${player.room}:${sx}:${spot.i}`, colour: POTION_COLOURS[spot.i % 4], dist };
    }
  }
  return best;
}

const POTION_PRICE = 2;
const COUNTER_X = 1000;
const COUNTER_W = 320;
const nearCounter = (player) => player.room === "shop" && player.x >= COUNTER_X && player.x <= COUNTER_X + COUNTER_W;

function takePotion(player, potion) {
  takenPotions.add(potion.key);
  if (player.room === "shop") player.basket.push(potion);
  else player.bag.push(potion.colour);
  sfx.take();
}

const openWardrobes = new Set();
const ROBE_COLOURS = ["#7a3fa0", "#2f6fd0", "#c0392b", "#2f7a8a"];
const litRobe = new Map();
const cupboardPotions = [];
const WARDROBE_W = 150;
const nearWardrobe = (player) =>
  ROOMS[player.room].wardrobe && player.x >= WARDROBE_X.mum && player.x <= WARDROBE_X.mum + WARDROBE_W;

const nearSeat = (player) =>
  (ROOMS[player.room].seats ?? []).find((seat) => Math.abs(player.x - seat.x) < seat.reach);

const doorCentre = (door) => door.x + DOOR_W / 2;
const nearDoor = (player) =>
  ROOMS[player.room].doors.find((d) => Math.abs(player.x - doorCentre(d)) < DOOR_W / 2);

const keys = new Set();
const tapped = new Set();
let frame = 0;

addEventListener("keydown", (e) => {
  if (!e.repeat) tapped.add(e.code);
  keys.add(e.code);
  if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault();
});
addEventListener("keyup", (e) => keys.delete(e.code));
addEventListener("blur", () => keys.clear());

for (const b of document.querySelectorAll("#touch [data-key]")) {
  const code = b.dataset.key;
  const down = (e) => { e.preventDefault(); b.setPointerCapture?.(e.pointerId); tapped.add(code); keys.add(code); b.classList.add("on"); };
  const up = () => { keys.delete(code); b.classList.remove("on"); };
  b.addEventListener("pointerdown", down);
  b.addEventListener("pointerup", up);
  b.addEventListener("pointercancel", up);
  b.addEventListener("contextmenu", (e) => e.preventDefault());
}

async function loadSvg(svg) {
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  try {
    await image.decode();
  } catch {
    // decode() rejects for some SVGs in some browsers; the load event still works.
    if (!image.complete || !image.naturalWidth) {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
    }
  }
  return image;
}

export async function startHome(canvas, character) {
  cancelAnimationFrame(frame);
  let ctx = canvas.getContext("2d");
  if (!ctx) {
    // Some embedded webviews refuse a 2d context on the original element; a clone gets one.
    const fresh = canvas.cloneNode();
    canvas.replaceWith(fresh);
    canvas = fresh;
    ctx = canvas.getContext("2d");
  }
  const player = {
    room: "home", seat: null, bag: [], basket: [], money: 20, x: 200, dir: 1, walk: 0, helperX: 130, y: 0, vy: 0, crouch: false,
    image: await loadSvg(characterSvg(character)),
    helperKind: character.helper,
    helperImage: character.helper === "none" ? null : await loadSvg(helperSvg(character.helper)),
  };
  window.__game = { player, shopDoor: () => ROOMS.outside.doors.find((d) => d.id === "shop"), takenPotions, dadFace: (room) => ({ x: DAD_X[room], y: MUM_FACE_Y + 1 }), mumFace: (room) => ({ x: MUM_X[room], y: MUM_FACE_Y - 9 }), shopLadyFace: () => ({ x: 1250, y: 278 }), openWardrobes, litRobe, cupboardPotions, robeColours: ROBE_COLOURS, wardrobeKnob: (room) => ({ x: WARDROBE_X[room] + 75, y: 270 }) };
  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    try {
      update(player, dt);
      draw(ctx, player);
    } catch (err) {
      if (!tick.failed) console.error("Game frame failed", err);
      tick.failed = true;
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

export function stopHome() {
  cancelAnimationFrame(frame);
}

const UP_KEYS_ANY = ["ArrowUp", "KeyW", "Space"];

function update(player, dt) {
  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const atOpenWardrobe = nearWardrobe(player) && openWardrobes.has(player.room);
  const comboHeld = atOpenWardrobe && left && UP_KEYS_ANY.some((k) => keys.has(k));
  const move = comboHeld ? 0 : (right ? 1 : 0) - (left ? 1 : 0);
  const UP_KEYS = ["ArrowUp", "KeyW", "Space"];
  const upPressed = UP_KEYS.some((k) => tapped.has(k));
  const leftPressed = ["ArrowLeft", "KeyA"].some((k) => tapped.has(k));
  const downPressed = ["ArrowDown", "KeyS"].some((k) => tapped.has(k));
  tapped.clear();

  if (player.seat) {
    if (move || upPressed || downPressed) {
      player.seat = null;
      sfx.stand();
      player.vy = JUMP_SPEED * 0.45;
      if (move) player.dir = move;
    } else {
      player.walk = 0;
      player.helperX += (player.x - player.dir * 75 - player.helperX) * Math.min(1, dt * 5);
      return;
    }
  }
  const down = keys.has("ArrowDown") || keys.has("KeyS");
  const wasCrouching = player.crouch;
  player.crouch = down && player.y === 0 && !(nearWardrobe(player) && openWardrobes.has(player.room)) && !nearCounter(player) && !(player.room === "myRoom" && nearWardrobe(player));
  if (player.crouch && !wasCrouching) sfx.crouch();
  const speed = player.crouch ? SPEED * CROUCH_SPEED : SPEED;
  if (move) {
    player.dir = move;
    player.walk += dt * 10;
    player.x = Math.min(ROOMS[player.room].width - 40, Math.max(40, player.x + move * speed * dt));
  } else {
    player.walk = 0;
  }
  const phase = Math.floor(player.walk / 3);
  if (move && player.y === 0 && phase !== player.stepPhase) player.crouch ? sfx.softStep() : sfx.step();
  player.stepPhase = move ? phase : 0;
  const grounded = player.y === 0;
  const up = UP_KEYS.some((k) => keys.has(k));
  const wardrobeOpen = nearWardrobe(player) && openWardrobes.has(player.room);
  if (wardrobeOpen && grounded && left && up && (upPressed || leftPressed)) {
    litRobe.set(player.room, ((litRobe.get(player.room) ?? -1) + 1) % ROBE_COLOURS.length);
    sfx.take();
  }
  if (grounded && downPressed && nearCounter(player)) payAtCounter(player);
  if (grounded && downPressed && player.room === "myRoom" && nearWardrobe(player) && !litRobe.has(player.room) && player.bag.length) {
    cupboardPotions.push(...player.bag);
    player.bag = [];
    sfx.take();
  }
  if (wardrobeOpen && grounded && downPressed && litRobe.has(player.room)) {
    player.dress = ROBE_COLOURS[litRobe.get(player.room)];
    sfx.take();
  }
  const door = nearDoor(player);
  if (grounded && !player.crouch && door && upPressed) enterDoor(player, door);
  else if (grounded && !player.crouch && !door && upPressed && nearSeat(player)) sitDown(player, nearSeat(player));
  else if (grounded && !player.crouch && !door && !nearSeat(player) && upPressed && !left && nearWardrobe(player)) {
    const had = openWardrobes.delete(player.room);
    if (!had) openWardrobes.add(player.room);
    litRobe.delete(player.room);
    sfx.take();
  }
  else if (grounded && !player.crouch && !door && !nearSeat(player) && upPressed && nearPotion(player)) takePotion(player, nearPotion(player));
  else if (grounded && !player.crouch && !door && !nearSeat(player) && !nearWardrobe(player) && !nearPotion(player) && up) {
    player.vy = JUMP_SPEED;
    sfx.jump();
  }
  if (!grounded || player.vy > 0) {
    player.vy -= GRAVITY * dt;
    player.y = Math.max(0, player.y + player.vy * dt);
    if (player.y === 0) {
      player.vy = 0;
      sfx.land();
    }
  }
  const target = player.x - player.dir * 75;
  player.helperX += (target - player.helperX) * Math.min(1, dt * 5);
}

function sitDown(player, seat) {
  sfx.sit();
  player.seat = seat;
  player.x = seat.x;
  player.y = seat.height;
  player.vy = 0;
  player.dir = seat.dir;
  player.crouch = false;
}

function payAtCounter(player) {
  const cost = player.basket.length * POTION_PRICE;
  if (!cost) return;
  if (cost > player.money) { sfx.stand(); return; }
  player.money -= cost;
  player.bag.push(...player.basket.map((p) => p.colour));
  player.basket = [];
  sfx.take();
}

function enterDoor(player, door) {
  for (const p of player.basket) takenPotions.delete(p.key);
  player.basket = [];
  sfx.door();
  const target = ROOMS[door.to];
  const arrival = target.doors.find((d) => d.id === door.arrive);
  player.room = door.to;
  player.x = doorCentre(arrival);
  player.helperX = player.x - 40;
  player.dir = 1;
}

function draw(ctx, player) {
  const room = ROOMS[player.room];
  drawingRoom = player.room;
  const camX = Math.min(room.width - VIEW_W, Math.max(0, player.x - VIEW_W / 2));
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.save();
  ctx.translate(-camX, 0);
  room.draw(ctx);
  drawKid(ctx, player);
  if (!player.seat && (nearDoor(player) || nearSeat(player) || nearWardrobe(player) || nearPotion(player))) drawDoorHint(ctx, player);
  ctx.restore();
  drawBag(ctx, player);
}

function drawBag(ctx, player) {
  player.bag.forEach((colour, i) => {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(30 + (i % 12) * 26, 30 + Math.floor(i / 12) * 26, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff8";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  player.basket.forEach((p, i) => {
    const n = player.bag.length + i;
    ctx.strokeStyle = p.colour;
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(30 + (n % 12) * 26, 30 + Math.floor(n / 12) * 26, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(30, 505, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(String(player.money), 48, 512);
}

function drawHome(ctx) {
  const w = ROOMS.home.width;
  ctx.fillStyle = "#4a3278";
  ctx.fillRect(0, 0, w, FLOOR_Y);
  ctx.fillStyle = "#6b4a2b";
  ctx.fillRect(0, FLOOR_Y, w, VIEW_H - FLOOR_Y);

  drawWeb(ctx, 40, 0);
  drawShelf(ctx, 500);
  drawCauldron(ctx, 1000);
  drawBroom(ctx, 1400);
  for (const door of ROOMS.home.doors) drawDoor(ctx, door.x, door.label);
}

function drawOutside(ctx) {
  const w = ROOMS.outside.width;
  const sky = ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
  sky.addColorStop(0, "#1b1446");
  sky.addColorStop(1, "#5a3f8f");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, FLOOR_Y);
  ctx.fillStyle = "#ffe9a8";
  ctx.beginPath();
  ctx.arc(1200, 110, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd34d";
  for (let x = 100; x < w; x += 230) ctx.fillRect(x, 40 + ((x * 7) % 120), 4, 4);
  for (const n of NEIGHBOURS) drawHouse(ctx, n.x, n);
  drawShopFront(ctx, SHOP_X);
  for (const x of [760, 1420, 2020]) drawTree(ctx, x);
  drawHill(ctx, w);
  ctx.fillStyle = "#2f6b4a";
  ctx.fillRect(0, FLOOR_Y, w, VIEW_H - FLOOR_Y);
  drawPath(ctx, w);
  drawHouse(ctx, ROOMS.outside.doors[0].x + DOOR_W / 2);
  drawDoor(ctx, ROOMS.outside.doors[0].x, "Home");
}

const HILL_START = 3200;
const PATH_TOP = FLOOR_Y + 4;

function hillTop(x) {
  const t = Math.min(1, Math.max(0, (x - HILL_START) / (ROOMS.outside.width - HILL_START)));
  return FLOOR_Y - 190 * Math.sin((t * Math.PI) / 2) ** 1.5;
}

function pathY(x) {
  const t = Math.max(0, (x - HILL_START) / (ROOMS.outside.width - HILL_START));
  const wind = 26 * Math.sin(x / 110) + 8 * Math.sin(x / 40 + 1);
  return 500 + wind * (1 - t) - t * (500 - PATH_TOP - 6);
}

function drawHill(ctx, w) {
  ctx.fillStyle = "#245a3c";
  ctx.beginPath();
  ctx.moveTo(HILL_START - 300, FLOOR_Y);
  for (let x = HILL_START - 300; x <= w; x += 20) ctx.lineTo(x, x < HILL_START ? FLOOR_Y : hillTop(x));
  ctx.lineTo(w, FLOOR_Y);
  ctx.closePath();
  ctx.fill();
}

function drawPath(ctx, w) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, FLOOR_Y, w, VIEW_H - FLOOR_Y);
  ctx.clip();
  const widthAt = (x) => 46 * Math.max(0, 1 - Math.max(0, (x - HILL_START) / (w - HILL_START)) ** 0.8);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const spurs = [ROOMS.outside.doors[0], ...ROOMS.outside.doors.slice(1)].map((d) => d.x + DOOR_W / 2);
  ctx.strokeStyle = "#c9a56b";
  ctx.lineWidth = 40;
  ctx.lineCap = "butt";
  for (const cx of spurs) {
    const y = pathY(cx);
    ctx.beginPath();
    ctx.moveTo(cx, FLOOR_Y);
    ctx.bezierCurveTo(cx + 30, PATH_TOP + 20, cx - 30, y - 20, cx, y);
    ctx.stroke();
  }
  ctx.lineCap = "round";
  for (let x = 0; x < w; x += 6) {
    ctx.lineWidth = widthAt(x);
    if (ctx.lineWidth < 0.5) break;
    ctx.beginPath();
    ctx.moveTo(x, pathY(x));
    ctx.lineTo(x + 7, pathY(x + 7));
    ctx.stroke();
  }
  ctx.restore();
}

const NEIGHBOURS = [
  { x: 1080, half: 200, h: 250, wall: "#7a5a6a", roof: "#2f6b8a", door: "#ff9ecb" },
  { x: 1750, half: 230, h: 320, wall: "#8a6a3a", roof: "#8a3a3a", door: "#4a8fd9" },
  { x: 2250, half: 130, h: 230, wall: "#5a7a6a", roof: "#6a4a9a", door: "#ffd166" },
];

function drawHouse(ctx, cx, o = {}) {
  const { half = 260, h = 300, wall = "#6b4a3a", roof = "#4a2f6e", door } = o;
  const top = FLOOR_Y - h;
  ctx.fillStyle = wall;
  ctx.fillRect(cx - half, top, half * 2, h);
  ctx.fillStyle = "#0003";
  for (let y = top + 30; y < FLOOR_Y; y += 30) ctx.fillRect(cx - half, y, half * 2, 3);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(cx - half - 30, top + 6);
  ctx.lineTo(cx, top - 130);
  ctx.lineTo(cx + half + 30, top + 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffd34d";
  ctx.beginPath();
  ctx.arc(cx, top - 55, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(cx + 130, top - 110, 36, 80);
  if (door) {
    ctx.fillStyle = door;
    ctx.beginPath();
    ctx.roundRect(cx - 30, FLOOR_Y - 110, 60, 110, [30, 30, 0, 0]);
    ctx.fill();
  }
  for (const wx of door ? [cx - half + 10, cx + half - 100] : [cx - 200, cx + 110]) {
    const wy = top + (door ? 30 : 70);
    ctx.fillStyle = "#ffe08a";
    ctx.fillRect(wx, wy, 90, 80);
    ctx.fillStyle = "#3b2a1a";
    ctx.fillRect(wx + 43, wy, 4, 80);
    ctx.fillRect(wx, wy + 38, 90, 4);
  }
}

function drawBat(ctx, x, y, size = 1, hanging = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, hanging ? -size : size);
  ctx.fillStyle = "#0d0818";
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 11, 0, 0, Math.PI * 2);
  ctx.moveTo(-6, -2);
  ctx.quadraticCurveTo(-26, -18, -40, -2);
  ctx.quadraticCurveTo(-30, -2, -26, 8);
  ctx.quadraticCurveTo(-18, 2, -10, 10);
  ctx.moveTo(6, -2);
  ctx.quadraticCurveTo(26, -18, 40, -2);
  ctx.quadraticCurveTo(30, -2, 26, 8);
  ctx.quadraticCurveTo(18, 2, 10, 10);
  ctx.fill();
  ctx.fillStyle = "#ff5a5a";
  ctx.fillRect(-5, -4, 3, 3);
  ctx.fillRect(2, -4, 3, 3);
  ctx.restore();
}

function drawPumpkin(ctx, x) {
  ctx.fillStyle = "#e8761c";
  ctx.beginPath();
  ctx.ellipse(x, FLOOR_Y - 28, 36, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3b6b1c";
  ctx.fillRect(x - 4, FLOOR_Y - 62, 8, 12);
  ctx.fillStyle = "#ffe14d";
  ctx.beginPath();
  ctx.moveTo(x - 20, FLOOR_Y - 40);
  ctx.lineTo(x - 8, FLOOR_Y - 40);
  ctx.lineTo(x - 14, FLOOR_Y - 28);
  ctx.moveTo(x + 20, FLOOR_Y - 40);
  ctx.lineTo(x + 8, FLOOR_Y - 40);
  ctx.lineTo(x + 14, FLOOR_Y - 28);
  ctx.moveTo(x - 20, FLOOR_Y - 18);
  ctx.lineTo(x - 10, FLOOR_Y - 12);
  ctx.lineTo(x - 4, FLOOR_Y - 18);
  ctx.lineTo(x + 4, FLOOR_Y - 12);
  ctx.lineTo(x + 10, FLOOR_Y - 18);
  ctx.lineTo(x + 20, FLOOR_Y - 18);
  ctx.lineTo(x + 12, FLOOR_Y - 8);
  ctx.lineTo(x - 12, FLOOR_Y - 8);
  ctx.fill();
}

function drawShopFront(ctx, cx) {
  const half = 170;
  const top = FLOOR_Y - 250;
  drawHouse(ctx, cx, { half, h: 250, wall: "#3a2a4a", roof: "#1d1030", door: "#3fae4a" });
  for (const wx of [cx - half + 10, cx + half - 100]) {
    const wy = top + 30;
    const glow = ctx.createRadialGradient(wx + 45, wy + 40, 5, wx + 45, wy + 40, 70);
    glow.addColorStop(0, "#d6ff8a");
    glow.addColorStop(1, "#3fae4a");
    ctx.fillStyle = glow;
    ctx.fillRect(wx, wy, 90, 80);
    ctx.fillStyle = "#ffe14d";
    ctx.beginPath();
    ctx.ellipse(wx + 28, wy + 40, 9, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(wx + 62, wy + 40, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a0f24";
    ctx.fillRect(wx + 26, wy + 35, 4, 10);
    ctx.fillRect(wx + 60, wy + 35, 4, 10);
    ctx.fillStyle = "#1a0f24";
    ctx.fillRect(wx, wy, 90, 5);
    ctx.fillRect(wx, wy + 75, 90, 5);
  }
  ctx.fillStyle = "#1a0f24";
  ctx.fillRect(cx - 70, FLOOR_Y - 180, 140, 40);
  ctx.fillStyle = "#8dff6a";
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SHOP", cx, FLOOR_Y - 150);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#4a2f6e" : "#150b22";
    ctx.fillRect(cx - 120 + i * 40, FLOOR_Y - 125, 40, 22);
  }
  drawPumpkin(ctx, cx + 110);
  drawBat(ctx, cx - 120, top - 150, 1);
  drawBat(ctx, cx + 60, top - 170, 0.7);
  drawBat(ctx, cx + 190, top - 110, 0.8);
}

function drawHangingCandles(ctx, x) {
  for (const [dx, len] of [[0, 120], [60, 190], [120, 90]]) {
    const cx = x + dx;
    ctx.strokeStyle = "#8a7a9a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, len);
    ctx.stroke();
    const glow = ctx.createRadialGradient(cx, len - 10, 2, cx, len - 10, 45);
    glow.addColorStop(0, "#ffe14d88");
    glow.addColorStop(1, "#ffe14d00");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 45, len - 55, 90, 90);
    ctx.fillStyle = "#f2eaff";
    ctx.fillRect(cx - 7, len, 14, 40);
    ctx.fillStyle = "#ffb52e";
    ctx.beginPath();
    ctx.ellipse(cx, len - 8, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCeilingBats(ctx, x) {
  drawBat(ctx, x, 22, 0.9, true);
  drawBat(ctx, x + 110, 18, 0.7, true);
}

function drawSpider(ctx, x) {
  ctx.strokeStyle = "#cfc4e6";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 150);
  ctx.stroke();
  ctx.fillStyle = "#0d0818";
  ctx.beginPath();
  ctx.ellipse(x, 160, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#0d0818";
  ctx.lineWidth = 2;
  for (const d of [-1, 1]) {
    for (const dy of [-6, 0, 6]) {
      ctx.beginPath();
      ctx.moveTo(x, 160 + dy / 2);
      ctx.lineTo(x + d * 18, 155 + dy * 2);
      ctx.stroke();
    }
  }
}

function drawMum(ctx, x, dress) {
  ctx.fillStyle = "#4a2a1a";
  ctx.beginPath();
  ctx.ellipse(x, MUM_FACE_Y + 14, 26, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dress;
  ctx.beginPath();
  ctx.moveTo(x - 16, MUM_FACE_Y + 18);
  ctx.lineTo(x + 16, MUM_FACE_Y + 18);
  ctx.lineTo(x + 34, FLOOR_Y - 4);
  ctx.lineTo(x - 34, FLOOR_Y - 4);
  ctx.fill();
  ctx.fillStyle = "#0003";
  ctx.fillRect(x - 24, FLOOR_Y - 14, 48, 4);
  ctx.strokeStyle = dress;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 14, MUM_FACE_Y + 26);
  ctx.lineTo(x - 28, MUM_FACE_Y + 62);
  ctx.moveTo(x + 14, MUM_FACE_Y + 26);
  ctx.lineTo(x + 28, MUM_FACE_Y + 62);
  ctx.stroke();
  ctx.fillStyle = "#e8d5b5";
  ctx.beginPath();
  for (const [cx, cy, r] of [[x - 28, MUM_FACE_Y + 64, 6], [x + 28, MUM_FACE_Y + 64, 6], [x, MUM_FACE_Y, 20]]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#1a0f24";
  ctx.beginPath();
  ctx.arc(x - 7, MUM_FACE_Y + 3, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 7, MUM_FACE_Y + 3, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a02c4a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, MUM_FACE_Y + 8, 7, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(x + 12, MUM_FACE_Y - 16, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawDad(ctx, x, robe) {
  const y = MUM_FACE_Y;
  ctx.fillStyle = robe;
  ctx.beginPath();
  ctx.moveTo(x - 20, y + 18);
  ctx.lineTo(x + 20, y + 18);
  ctx.lineTo(x + 38, FLOOR_Y - 4);
  ctx.lineTo(x - 38, FLOOR_Y - 4);
  ctx.fill();
  ctx.fillStyle = "#0003";
  ctx.fillRect(x - 28, FLOOR_Y - 14, 56, 4);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(x - 19, y + 52, 38, 6);
  ctx.strokeStyle = robe;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 26);
  ctx.lineTo(x - 32, y + 64);
  ctx.moveTo(x + 18, y + 26);
  ctx.lineTo(x + 32, y + 64);
  ctx.stroke();
  ctx.fillStyle = "#e8d5b5";
  for (const [cx, cy, r] of [[x - 32, y + 66, 6], [x + 32, y + 66, 6], [x, y, 21]]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#5a3a22";
  ctx.beginPath();
  ctx.arc(x, y - 1, 22, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 20, y + 6);
  ctx.quadraticCurveTo(x, y + 30, x + 20, y + 6);
  ctx.quadraticCurveTo(x, y + 12, x - 20, y + 6);
  ctx.fill();
  ctx.strokeStyle = "#1a0f24";
  ctx.lineWidth = 2;
  for (const dx of [-8, 8]) {
    ctx.beginPath();
    ctx.arc(x + dx, y + 3, 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 3);
  ctx.lineTo(x + 3, y + 3);
  ctx.stroke();
}

function drawShopLady(ctx, x) {
  const cx = x + 250;
  ctx.fillStyle = "#1f1230";
  ctx.beginPath();
  ctx.ellipse(cx, 300, 30, 46, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4a2a7a";
  ctx.beginPath();
  ctx.moveTo(cx - 28, 440);
  ctx.lineTo(cx - 20, 312);
  ctx.lineTo(cx + 20, 312);
  ctx.lineTo(cx + 28, 440);
  ctx.fill();
  ctx.fillStyle = "#e8d5b5";
  ctx.beginPath();
  ctx.arc(cx, 288, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe14d";
  ctx.beginPath();
  ctx.arc(cx - 8, 290, 4, 0, Math.PI * 2);
  ctx.arc(cx + 8, 290, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a0f24";
  ctx.fillRect(cx - 9, 287, 2, 6);
  ctx.fillRect(cx + 7, 287, 2, 6);
  ctx.strokeStyle = "#a02c4a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, 297, 8, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "#5b2a86";
  ctx.beginPath();
  ctx.moveTo(cx - 40, 268);
  ctx.lineTo(cx + 40, 268);
  ctx.lineTo(cx + 10, 262);
  ctx.lineTo(cx + 16, 200);
  ctx.lineTo(cx - 12, 262);
  ctx.fill();
  ctx.fillStyle = "#8dff6a";
  ctx.fillRect(cx - 22, 255, 40, 7);
}

function drawShopCounter(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x, 350, 320, 90);
  ctx.fillStyle = "#8a5a2b";
  ctx.fillRect(x + 8, 358, 304, 74);
  ctx.fillStyle = "#b8895a";
  ctx.fillRect(x - 10, 336, 340, 16);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(x + 20, 306, 50, 30);
  const jar = (jx, colour) => {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.roundRect(jx, 296, 34, 40, 8);
    ctx.fill();
  };
  jar(x + 90, "#9b5fff");
  jar(x + 140, "#5fd0ff");
  jar(x + 190, "#7dff8a");
  ctx.fillStyle = "#ffe14d";
  ctx.beginPath();
  ctx.arc(x + 152, 312, 4, 0, Math.PI * 2);
  ctx.arc(x + 164, 312, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a0f24";
  ctx.fillRect(x + 151, 309, 2, 6);
  ctx.fillRect(x + 163, 309, 2, 6);
}

function drawMumRoom(ctx, w = ROOMS.mum.width, wall = "#5b3a6e", doorX = ROOMS.mum.doors[0].x) {
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, FLOOR_Y);
  ctx.fillStyle = "#6b4a2b";
  ctx.fillRect(0, FLOOR_Y, w, VIEW_H - FLOOR_Y);

  drawWeb(ctx, 40, 0);
  drawWardrobe(ctx, WARDROBE_X.mum);
  drawDresser(ctx, 480);
  drawCabinet(ctx, 740);
  drawHangingRack(ctx, 990);
  drawFireplace(ctx, 710);
  drawCat(ctx, 850, FLOOR_Y);
  drawChair(ctx, 1010);
  drawMirror(ctx, 1235, FLOOR_Y - 70);
  drawBed(ctx, 1300);
  drawMum(ctx, MUM_X.mum, "#7a3fa0");
  drawDoor(ctx, doorX, "Back");
}

function drawWardrobe(ctx, x) {
  const w = 150;
  const top = 130;
  const bottom = FLOOR_Y - 30;
  const mid = x + w / 2;
  ctx.fillStyle = "#b8895a";
  for (const fx of [x + 5, x + w - 35]) {
    ctx.beginPath();
    ctx.moveTo(fx, bottom);
    ctx.lineTo(fx + 30, bottom);
    ctx.lineTo(fx + 30, FLOOR_Y - 10);
    ctx.quadraticCurveTo(fx + 30, FLOOR_Y, fx + 18, FLOOR_Y);
    ctx.lineTo(fx, FLOOR_Y);
    ctx.lineTo(fx, FLOOR_Y - 12);
    ctx.lineTo(fx + 10, FLOOR_Y - 12);
    ctx.lineTo(fx + 10, bottom);
    ctx.fill();
  }
  ctx.fillStyle = "#4a2f18";
  ctx.fillRect(x - 6, top - 12, w + 12, 12);
  ctx.fillRect(x, top, w, bottom - top);
  if (openWardrobes.has(drawingRoom)) {
    ctx.fillStyle = "#1a1008";
    ctx.fillRect(x + 6, top + 6, w - 12, bottom - top - 12);
    ctx.fillStyle = "#6b4423";
    ctx.fillRect(x + 6, top + 40, w - 12, 5);
    if (drawingRoom === "myRoom") {
      cupboardPotions.forEach((c, i) => {
        const bx = x + 20 + (i % 8) * 15;
        const by = bottom - 20 - Math.floor(i / 8) * 20;
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(bx, by, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(bx - 2, by - 12, 4, 7);
      });
    }
    ROBE_COLOURS.forEach((c, i) => {
      const rx = x + 22 + i * 32;
      if (litRobe.get(drawingRoom) === i) {
        ctx.fillStyle = "rgba(255, 240, 150, 0.85)";
        ctx.fillRect(rx - 10, top + 40, 48, 110);
      }
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(rx, top + 45);
      ctx.lineTo(rx + 24, top + 45);
      ctx.lineTo(rx + 28, top + 140);
      ctx.lineTo(rx - 4, top + 140);
      ctx.fill();
    });
    ctx.fillStyle = "#8a5a2b";
    ctx.fillRect(x - 12, top + 6, 14, bottom - top - 12);
    ctx.fillRect(x + w - 2, top + 6, 14, bottom - top - 12);
    return;
  }
  ctx.fillStyle = "#8a5a2b";
  ctx.fillRect(x + 6, top + 6, w / 2 - 9, bottom - top - 12);
  ctx.fillRect(mid + 3, top + 6, w / 2 - 9, bottom - top - 12);
  ctx.fillStyle = "#2a2a2a";
  ctx.beginPath();
  ctx.ellipse(mid, top + (bottom - top) / 2, 12, 15, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCabinet(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x, 70, 240, 230);
  ctx.fillStyle = "#5b3f24";
  ctx.fillRect(x + 8, 78, 224, 214);
  ctx.fillStyle = "#8a5a2b";
  ctx.fillRect(x + 8, 160, 224, 8);
  ctx.fillRect(x + 8, 235, 224, 8);
  const flask = (cx, cy, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - r / 4, cy - r * 1.7, r / 2, r);
  };
  flask(x + 55, 140, 22, "#ff5fa2");
  flask(x + 120, 142, 17, "#5fd0ff");
  flask(x + 180, 143, 14, "#7dff8a");
  ctx.fillStyle = "#c9b8ee";
  ctx.beginPath();
  ctx.roundRect(x + 35, 205, 45, 30, [0, 0, 18, 18]);
  ctx.roundRect(x + 110, 205, 45, 30, [0, 0, 18, 18]);
  ctx.fill();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(x + 70, 280, 8, 0, Math.PI * 2);
  ctx.arc(x + 130, 280, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawHangingRack(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x, 70, 190, 230);
  ctx.fillStyle = "#4a3278";
  ctx.fillRect(x + 8, 78, 174, 214);
  const rails = [100, 170, 240];
  rails.forEach((y, row) => {
    ctx.fillStyle = "#8a5a2b";
    ctx.fillRect(x + 8, y, 174, 6);
    for (let i = 0; i < 4 - (row === 2 ? 1 : 0); i++) {
      const hx = x + 28 + i * 42;
      ctx.strokeStyle = "#d8cff0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx, y + 6);
      ctx.lineTo(hx, y + 36);
      ctx.stroke();
      ctx.fillStyle = ["#ffd166", "#ff5fa2", "#5fd0ff", "#7dff8a"][(i + row) % 4];
      ctx.beginPath();
      ctx.arc(hx, y + 44, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawFireplace(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x - 30, 300, 520, 20);
  ctx.fillStyle = "#2a1a2e";
  ctx.fillRect(x, 320, 20, FLOOR_Y - 320);
  ctx.fillRect(x + 440, 320, 20, FLOOR_Y - 320);
  ctx.fillStyle = "#241530";
  ctx.fillRect(x + 20, 320, 420, FLOOR_Y - 320);
  ctx.strokeStyle = "#8a5a2b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 150, 320);
  ctx.lineTo(x + 150, 385);
  ctx.stroke();
  ctx.fillStyle = "#c9a227";
  ctx.beginPath();
  ctx.moveTo(x + 135, FLOOR_Y - 5);
  ctx.lineTo(x + 165, FLOOR_Y - 5);
  ctx.lineTo(x + 150, FLOOR_Y - 55);
  ctx.closePath();
  ctx.fillStyle = "#8a5a2b";
  ctx.fillRect(x + 147, 320, 6, 100);
  ctx.fillStyle = "#c9a227";
  ctx.beginPath();
  ctx.moveTo(x + 135, 420);
  ctx.lineTo(x + 165, 420);
  ctx.lineTo(x + 150, 372);
  ctx.closePath();
  ctx.fill();
}

function drawCat(ctx, x, floor) {
  ctx.fillStyle = "#1c1c26";
  ctx.beginPath();
  ctx.ellipse(x, floor - 22, 48, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 45, floor - 38, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 62, floor - 52);
  ctx.lineTo(x - 58, floor - 72);
  ctx.lineTo(x - 46, floor - 56);
  ctx.moveTo(x - 44, floor - 56);
  ctx.lineTo(x - 32, floor - 72);
  ctx.lineTo(x - 28, floor - 50);
  ctx.fill();
  ctx.strokeStyle = "#1c1c26";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + 45, floor - 22);
  ctx.quadraticCurveTo(x + 85, floor - 30, x + 80, floor - 70);
  ctx.stroke();
  ctx.fillStyle = "#7dff8a";
  ctx.beginPath();
  ctx.arc(x - 52, floor - 40, 3, 0, Math.PI * 2);
  ctx.arc(x - 38, floor - 40, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawChair(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x + 54, FLOOR_Y - 160, 12, 160);
  ctx.fillRect(x, FLOOR_Y - 70, 70, 10);
  ctx.fillRect(x + 4, FLOOR_Y - 60, 8, 60);
  ctx.fillRect(x + 56, FLOOR_Y - 60, 8, 60);
  ctx.fillRect(x + 30, FLOOR_Y - 60, 6, 60);
}

function drawBed(ctx, x, cover = "#6b4fbf") {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x, FLOOR_Y - 120, 20, 120);
  ctx.fillRect(x + 280, FLOOR_Y - 75, 20, 75);
  ctx.fillRect(x, FLOOR_Y - 55, 300, 20);
  ctx.fillStyle = cover;
  ctx.beginPath();
  ctx.roundRect(x + 20, FLOOR_Y - 100, 260, 48, 12);
  ctx.fill();
  ctx.fillStyle = "#ffd166";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(x + 70 + i * 60, FLOOR_Y - 76, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#f2eaff";
  ctx.beginPath();
  ctx.roundRect(x + 24, FLOOR_Y - 118, 75, 30, 12);
  ctx.fill();
}

function drawDresser(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x, 340, 190, 100);
  ctx.fillStyle = "#8a5a2b";
  ctx.fillRect(x + 6, 346, 178, 88);
  ctx.fillStyle = "#0004";
  ctx.fillRect(x + 6, 376, 178, 3);
  ctx.fillRect(x + 6, 406, 178, 3);
  ctx.fillStyle = "#ffd166";
  for (const y of [360, 392, 422]) {
    ctx.beginPath();
    ctx.arc(x + 70, y - 2, 5, 0, Math.PI * 2);
    ctx.arc(x + 120, y - 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#c9b8ee";
  ctx.fillRect(x + 20, 318, 34, 22);
  ctx.fillStyle = "#ff5fa2";
  ctx.beginPath();
  ctx.arc(x + 130, 328, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x + 126, 306, 8, 10);
}

function drawMirror(ctx, x, y) {
  ctx.fillStyle = "#c9a227";
  ctx.beginPath();
  ctx.arc(x, y, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a8d8ff";
  ctx.beginPath();
  ctx.arc(x, y, 33, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c9a227";
  ctx.fillRect(x - 6, y + 40, 12, 40);
}

function drawTree(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x - 12, FLOOR_Y - 120, 24, 120);
  ctx.fillStyle = "#1f5a3a";
  ctx.beginPath();
  ctx.arc(x, FLOOR_Y - 150, 70, 0, Math.PI * 2);
  ctx.fill();
}

function drawDoorHint(ctx, player) {
  ctx.fillStyle = "#ffd166";
  ctx.font = "bold 30px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("↑", player.x, groundY(player.room, player.x) - 150 + Math.sin(performance.now() / 200) * 4);
}

function drawWeb(ctx, x, y) {
  ctx.strokeStyle = "#d8cff0";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 160, y + Math.sin(a) * 160);
    ctx.stroke();
  }
  for (let r = 40; r <= 160; r += 40) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI / 2);
    ctx.stroke();
  }
}

function drawShelf(ctx, x) {
  ctx.fillStyle = "#8a5a2b";
  ctx.fillRect(x, 220, SHELF_W, 12);
  ctx.fillRect(x, 320, SHELF_W, 12);
  for (const spot of potionSpots(x)) {
    if (takenPotions.has(`${drawingRoom}:${x}:${spot.i}`)) continue;
    ctx.fillStyle = POTION_COLOURS[spot.i % 4];
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, 18, 0, Math.PI * 2);
    ctx.fill();
    if (spot.i < 4) ctx.fillRect(spot.x - 6, spot.y - 32, 12, 16);
  }
}

function drawCauldron(ctx, x) {
  ctx.fillStyle = "#1c1c26";
  ctx.beginPath();
  ctx.ellipse(x, FLOOR_Y - 45, 70, 55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7dff8a";
  ctx.beginPath();
  ctx.ellipse(x, FLOOR_Y - 85, 55, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBroom(ctx, x) {
  ctx.strokeStyle = "#8a5a2b";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x, FLOOR_Y);
  ctx.lineTo(x + 40, FLOOR_Y - 220);
  ctx.stroke();
  ctx.fillStyle = "#c9a227";
  ctx.beginPath();
  ctx.moveTo(x - 20, FLOOR_Y);
  ctx.lineTo(x + 20, FLOOR_Y);
  ctx.lineTo(x + 10, FLOOR_Y - 60);
  ctx.closePath();
  ctx.fill();
}

function drawDoor(ctx, x, label) {
  ctx.fillStyle = "#2e1b12";
  ctx.beginPath();
  ctx.roundRect(x, FLOOR_Y - 220, DOOR_W, 220, [65, 65, 0, 0]);
  ctx.fill();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(x + 105, FLOOR_Y - 100, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2eaff";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, x + 65, FLOOR_Y - 120);
}

function groundY(room, x) {
  return room === "outside" ? pathY(x) : FLOOR_Y;
}

function drawKid(ctx, player) {
  const sitting = Boolean(player.seat);
  const bob = sitting ? player.y : player.crouch ? 0 : player.y > 0 ? player.y : Math.abs(Math.sin(player.walk)) * 4;
  const s = KID_SCALE;
  ctx.save();
  ctx.translate(player.x, groundY(player.room, player.x) - bob);
  ctx.scale(player.dir, sitting ? SIT_SQUASH : player.crouch ? CROUCH_SQUASH : 1);
  ctx.drawImage(player.image, (-200 * s) / 2, -250 * s, 200 * s, 260 * s);
  if (player.dress) {
    ctx.fillStyle = player.dress;
    ctx.beginPath();
    ctx.moveTo(-9, -46);
    ctx.lineTo(9, -46);
    ctx.lineTo(24, -22);
    ctx.lineTo(-24, -22);
    ctx.fill();
  }
  ctx.restore();

  if (player.helperImage) {
    const h = HELPER_SCALE;
    const lift = player.helperKind === "bat" || player.helperKind === "owl" ? 40 + Math.sin(player.walk * 0.5 + performance.now() / 300) * 6 : 0;
    ctx.save();
    ctx.translate(player.helperX, groundY(player.room, player.helperX) - lift);
    ctx.scale(player.dir, 1);
    ctx.drawImage(player.helperImage, (-200 * h) / 2, -190 * h, 200 * h, 200 * h);
    ctx.restore();
  }
}
