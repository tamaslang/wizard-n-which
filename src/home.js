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
    width: 1400,
    doors: [{ id: "home", x: 150, label: "Back", to: "home", arrive: "mum" }],
    draw: drawMumRoom,
  },
  outside: {
    width: 2400,
    doors: [{ id: "home", x: 300, label: "Home", to: "home", arrive: "out" }],
    draw: drawOutside,
  },
};

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
    room: "home", x: 200, dir: 1, walk: 0, helperX: 130, y: 0, vy: 0, crouch: false,
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
  const UP_KEYS = ["ArrowUp", "KeyW", "Space"];
  const up = UP_KEYS.some((k) => keys.has(k));
  const upPressed = UP_KEYS.some((k) => tapped.has(k));
  tapped.clear();
  const door = nearDoor(player);
  if (grounded && !player.crouch && door && upPressed) enterDoor(player, door);
  else if (grounded && !player.crouch && !door && up) player.vy = JUMP_SPEED;
  if (!grounded || player.vy > 0) {
    player.vy -= GRAVITY * dt;
    player.y = Math.max(0, player.y + player.vy * dt);
    if (player.y === 0) player.vy = 0;
  }
  const target = player.x - player.dir * 75;
  player.helperX += (target - player.helperX) * Math.min(1, dt * 5);
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
  if (nearDoor(player)) drawDoorHint(ctx, player);
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
  drawDoor(ctx, ROOMS.outside.doors[0].x, "Home");
}

function drawMumRoom(ctx) {
  const w = ROOMS.mum.width;
  ctx.fillStyle = "#5b3a6e";
  ctx.fillRect(0, 0, w, FLOOR_Y);
  ctx.fillStyle = "#6b4a2b";
  ctx.fillRect(0, FLOOR_Y, w, VIEW_H - FLOOR_Y);

  // window with moon
  ctx.fillStyle = "#1b1446";
  ctx.fillRect(520, 90, 160, 170);
  ctx.fillStyle = "#ffe9a8";
  ctx.beginPath();
  ctx.arc(600, 160, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3b2a1a";
  ctx.lineWidth = 8;
  ctx.strokeRect(520, 90, 160, 170);
  ctx.beginPath();
  ctx.moveTo(600, 90);
  ctx.lineTo(600, 260);
  ctx.moveTo(520, 175);
  ctx.lineTo(680, 175);
  ctx.stroke();

  // rug
  ctx.fillStyle = "#9b3d6b";
  ctx.beginPath();
  ctx.ellipse(500, FLOOR_Y + 40, 180, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // bed
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(850, FLOOR_Y - 110, 20, 110);
  ctx.fillRect(1130, FLOOR_Y - 70, 20, 70);
  ctx.fillRect(850, FLOOR_Y - 55, 300, 20);
  ctx.fillStyle = "#6b4fbf";
  ctx.beginPath();
  ctx.roundRect(870, FLOOR_Y - 95, 260, 45, 12);
  ctx.fill();
  ctx.fillStyle = "#f2eaff";
  ctx.beginPath();
  ctx.roundRect(875, FLOOR_Y - 110, 70, 28, 12);
  ctx.fill();

  // lamp
  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(1218, FLOOR_Y - 90, 8, 90);
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.moveTo(1190, FLOOR_Y - 90);
  ctx.lineTo(1254, FLOOR_Y - 90);
  ctx.lineTo(1236, FLOOR_Y - 135);
  ctx.lineTo(1208, FLOOR_Y - 135);
  ctx.closePath();
  ctx.fill();

  drawDoor(ctx, ROOMS.mum.doors[0].x, "Back");
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
  const bob = player.crouch ? 0 : player.y > 0 ? player.y : Math.abs(Math.sin(player.walk)) * 4;
  const s = KID_SCALE;
  ctx.save();
  ctx.translate(player.x, FLOOR_Y - bob);
  ctx.scale(player.dir, player.crouch ? CROUCH_SQUASH : 1);
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
