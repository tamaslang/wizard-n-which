export const HEADS = {
  round: { label: "Round", rx: 20, ry: 20 },
  oval: { label: "Oval", rx: 16, ry: 24 },
  wide: { label: "Wide", rx: 25, ry: 18 },
};

const COLORS = {
  witch: { robe: "#3b2a8f", hat: "#3b2a8f" },
  wizard: { robe: "#7a1f2b", hat: "#7a1f2b" },
};

// Draws the character with feet at (0, 0), facing right.
export function drawCharacter(ctx, { type, head }) {
  const { robe, hat } = COLORS[type];
  const { rx, ry } = HEADS[head];
  const headY = -50 - ry;

  ctx.fillStyle = robe;
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.quadraticCurveTo(-28, -48, -30, 0);
  ctx.lineTo(30, 0);
  ctx.quadraticCurveTo(28, -48, 0, -50);
  ctx.fill();

  ctx.fillStyle = "#ffe0bd";
  ctx.beginPath();
  ctx.ellipse(0, headY, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(rx * 0.4, headY - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  const brimY = headY - ry * 0.6;
  ctx.fillStyle = hat;
  ctx.beginPath();
  ctx.moveTo(-2, brimY - 44);
  ctx.lineTo(-26, brimY);
  ctx.lineTo(24, brimY);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-32, brimY - 2, 62, 6);
}
