// Older browsers (Chrome/Edge < 99, Firefox < 112, Safari < 16) lack roundRect.
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii = 0) {
    const list = [].concat(radii).map((r) => (typeof r === "object" ? r.x : r));
    const [tl, tr = tl, br = tl, bl = tr] = list;
    const clamp = (r) => Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
    const [a, b, c, d] = [tl, tr, br, bl].map(clamp);
    this.moveTo(x + a, y);
    this.arcTo(x + w, y, x + w, y + h, b);
    this.arcTo(x + w, y + h, x, y + h, c);
    this.arcTo(x, y + h, x, y, d);
    this.arcTo(x, y, x + w, y, a);
    this.closePath();
  };
}
