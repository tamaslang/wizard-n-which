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

const ROOMS = {
  home: {
    width: 2400,
    doors: [
      { id: "mum", x: 1700, label: "Mum", to: "mum", arrive: "home" },
      { id: "out", x: 2000, label: "Out", to: "outside", arrive: "home" },
    ],
    draw: drawHome,
  },
  mum: {
    width: 1700,
    doors: [{ id: "home", x: 150, label: "Back", to: "home", arrive: "mum" }],
    seats: [
      { name: "chair", x: 1045, reach: 50, height: 70, dir: -1 },
      { name: "bed", x: 1450, reach: 170, height: 55, dir: 1 },
    ],
    draw: drawMumRoom,
  },
  outside: {
    width: 2400,
    doors: [{ id: "home", x: 300, label: "Home", to: "home", arrive: "out" }],
    draw: drawOutside,
  },
};

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
  await image.decode();
  return image;
}

export async function startHome(canvas, character) {
  cancelAnimationFrame(frame);
  const ctx = canvas.getContext("2d");
  const player = {
    room: "home", seat: null, x: 200, dir: 1, walk: 0, helperX: 130, y: 0, vy: 0, crouch: false,
    image: await loadSvg(characterSvg(character)),
    helperKind: character.helper,
    helperImage: character.helper === "none" ? null : await loadSvg(helperSvg(character.helper)),
  };
  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(player, dt);
    draw(ctx, player);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

export function stopHome() {
  cancelAnimationFrame(frame);
}

function update(player, dt) {
  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const move = (right ? 1 : 0) - (left ? 1 : 0);
  const UP_KEYS = ["ArrowUp", "KeyW", "Space"];
  const upPressed = UP_KEYS.some((k) => tapped.has(k));
  tapped.clear();

  if (player.seat) {
    if (move || upPressed) {
      player.seat = null;
      player.vy = JUMP_SPEED * 0.45;
      if (move) player.dir = move;
    } else {
      player.walk = 0;
      player.helperX += (player.x - player.dir * 75 - player.helperX) * Math.min(1, dt * 5);
      return;
    }
  }
  const down = keys.has("ArrowDown") || keys.has("KeyS");
  player.crouch = down && player.y === 0;
  const speed = player.crouch ? SPEED * CROUCH_SPEED : SPEED;
  if (move) {
    player.dir = move;
    player.walk += dt * 10;
    player.x = Math.min(ROOMS[player.room].width - 40, Math.max(40, player.x + move * speed * dt));
  } else {
    player.walk = 0;
  }
  const grounded = player.y === 0;
  const up = UP_KEYS.some((k) => keys.has(k));
  const door = nearDoor(player);
  if (grounded && !player.crouch && door && upPressed) enterDoor(player, door);
  else if (grounded && !player.crouch && !door && upPressed && nearSeat(player)) sitDown(player, nearSeat(player));
  else if (grounded && !player.crouch && !door && !nearSeat(player) && up) player.vy = JUMP_SPEED;
  if (!grounded || player.vy > 0) {
    player.vy -= GRAVITY * dt;
    player.y = Math.max(0, player.y + player.vy * dt);
    if (player.y === 0) player.vy = 0;
  }
  const target = player.x - player.dir * 75;
  player.helperX += (target - player.helperX) * Math.min(1, dt * 5);
}

function sitDown(player, seat) {
  player.seat = seat;
  player.x = seat.x;
  player.y = seat.height;
  player.vy = 0;
  player.dir = seat.dir;
  player.crouch = false;
}

function enterDoor(player, door) {
  const target = ROOMS[door.to];
  const arrival = target.doors.find((d) => d.id === door.arrive);
  player.room = door.to;
  player.x = doorCentre(arrival);
  player.helperX = player.x - 40;
  player.dir = 1;
}

function draw(ctx, player) {
  const room = ROOMS[player.room];
  const camX = Math.min(room.width - VIEW_W, Math.max(0, player.x - VIEW_W / 2));
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.save();
  ctx.translate(-camX, 0);
  room.draw(ctx);
  drawKid(ctx, player);
  if (!player.seat && (nearDoor(player) || nearSeat(player))) drawDoorHint(ctx, player);
  ctx.restore();
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
  for (let x = 700; x < w; x += 450) drawTree(ctx, x);
  ctx.fillStyle = "#2f6b4a";
  ctx.fillRect(0, FLOOR_Y, w, VIEW_H - FLOOR_Y);
  drawHouse(ctx, ROOMS.outside.doors[0].x + DOOR_W / 2);
  drawDoor(ctx, ROOMS.outside.doors[0].x, "Home");
}

function drawHouse(ctx, cx) {
  const half = 260;
  const top = FLOOR_Y - 300;
  ctx.fillStyle = "#6b4a3a";
  ctx.fillRect(cx - half, top, half * 2, 300);
  ctx.fillStyle = "#5a3d30";
  for (let y = top + 30; y < FLOOR_Y; y += 30) ctx.fillRect(cx - half, y, half * 2, 3);
  ctx.fillStyle = "#4a2f6e";
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
  for (const wx of [cx - 200, cx + 110]) {
    ctx.fillStyle = "#ffe08a";
    ctx.fillRect(wx, top + 70, 90, 80);
    ctx.fillStyle = "#3b2a1a";
    ctx.fillRect(wx + 43, top + 70, 4, 80);
    ctx.fillRect(wx, top + 108, 90, 4);
  }
}

function drawMumRoom(ctx) {
  const w = ROOMS.mum.width;
  ctx.fillStyle = "#5b3a6e";
  ctx.fillRect(0, 0, w, FLOOR_Y);
  ctx.fillStyle = "#6b4a2b";
  ctx.fillRect(0, FLOOR_Y, w, VIEW_H - FLOOR_Y);

  drawWeb(ctx, 40, 0);
  drawCabinet(ctx, 650);
  drawHangingRack(ctx, 900);
  drawFireplace(ctx, 620);
  drawCat(ctx, 760, FLOOR_Y);
  drawChair(ctx, 1010);
  drawMirror(ctx, 1160, FLOOR_Y - 70);
  drawBed(ctx, 1300);
  drawDoor(ctx, ROOMS.mum.doors[0].x, "Back");
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

function drawBed(ctx, x) {
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(x, FLOOR_Y - 120, 20, 120);
  ctx.fillRect(x + 280, FLOOR_Y - 75, 20, 75);
  ctx.fillRect(x, FLOOR_Y - 55, 300, 20);
  ctx.fillStyle = "#6b4fbf";
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
  ctx.fillText("↑", player.x, FLOOR_Y - 150 + Math.sin(performance.now() / 200) * 4);
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
  ctx.fillRect(x, 220, 260, 12);
  ctx.fillRect(x, 320, 260, 12);
  const potions = ["#ff5fa2", "#5fd0ff", "#7dff8a", "#ffd166"];
  potions.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x + 40 + i * 60, 200, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 34 + i * 60, 168, 12, 16);
    ctx.beginPath();
    ctx.arc(x + 40 + i * 60, 300, 18, 0, Math.PI * 2);
    ctx.fill();
  });
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

function drawKid(ctx, player) {
  const sitting = Boolean(player.seat);
  const bob = sitting ? player.y : player.crouch ? 0 : player.y > 0 ? player.y : Math.abs(Math.sin(player.walk)) * 4;
  const s = KID_SCALE;
  ctx.save();
  ctx.translate(player.x, FLOOR_Y - bob);
  ctx.scale(player.dir, sitting ? SIT_SQUASH : player.crouch ? CROUCH_SQUASH : 1);
  ctx.drawImage(player.image, (-200 * s) / 2, -250 * s, 200 * s, 260 * s);
  ctx.restore();

  if (player.helperImage) {
    const h = HELPER_SCALE;
    const lift = player.helperKind === "bat" || player.helperKind === "owl" ? 40 + Math.sin(player.walk * 0.5 + performance.now() / 300) * 6 : 0;
    ctx.save();
    ctx.translate(player.helperX, FLOOR_Y - lift);
    ctx.scale(player.dir, 1);
    ctx.drawImage(player.helperImage, (-200 * h) / 2, -190 * h, 200 * h, 200 * h);
    ctx.restore();
  }
}
