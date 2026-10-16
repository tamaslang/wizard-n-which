import { characterSvg, helperSvg } from "./character.js";

const VIEW_W = 960;
const VIEW_H = 540;
const WORLD_W = 2400;
const FLOOR_Y = 440;
const SPEED = 260;
const KID_SCALE = 0.5;
const HELPER_SCALE = 0.4;

const keys = new Set();
let frame = 0;

addEventListener("keydown", (e) => {
  keys.add(e.code);
  if (e.code.startsWith("Arrow")) e.preventDefault();
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
    x: 200, dir: 1, walk: 0, helperX: 130,
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
  if (move) {
    player.dir = move;
    player.walk += dt * 10;
    player.x = Math.min(WORLD_W - 40, Math.max(40, player.x + move * SPEED * dt));
  } else {
    player.walk = 0;
  }
  const target = player.x - player.dir * 75;
  player.helperX += (target - player.helperX) * Math.min(1, dt * 5);
}

function draw(ctx, player) {
  const camX = Math.min(WORLD_W - VIEW_W, Math.max(0, player.x - VIEW_W / 2));
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.save();
  ctx.translate(-camX, 0);
  drawRoom(ctx);
  drawKid(ctx, player);
  ctx.restore();
}

function drawRoom(ctx) {
  ctx.fillStyle = "#4a3278";
  ctx.fillRect(0, 0, WORLD_W, FLOOR_Y);
  ctx.fillStyle = "#6b4a2b";
  ctx.fillRect(0, FLOOR_Y, WORLD_W, VIEW_H - FLOOR_Y);

  drawWeb(ctx, 40, 0);
  drawShelf(ctx, 500);
  drawCauldron(ctx, 1000);
  drawBroom(ctx, 1400);
  drawDoor(ctx, 2000, "Out");
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
  ctx.roundRect(x, FLOOR_Y - 220, 130, 220, [65, 65, 0, 0]);
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
  const bob = Math.abs(Math.sin(player.walk)) * 4;
  const s = KID_SCALE;
  ctx.save();
  ctx.translate(player.x, FLOOR_Y - bob);
  ctx.scale(player.dir, 1);
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
