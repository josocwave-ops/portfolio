// The hand-drawn lines: a chalky starry spiral and a wobbly painted band.
// Browser-only (canvas). Redrawn fresh on every visit, so no two are the same.

const R = Math.random;
const TAU = Math.PI * 2;

export type Pt = { x: number; y: number; nx: number; ny: number; w: number };
export type LineKind = "spiral" | "wavy";

function normals(pts: Omit<Pt, "nx" | "ny">[]): Pt[] {
  return pts.map((p, i) => {
    const a = pts[Math.max(i - 1, 0)];
    const b = pts[Math.min(i + 1, pts.length - 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const m = Math.hypot(dx, dy) || 1;
    return { ...p, nx: -dy / m, ny: dx / m };
  });
}

/** A loose, freehand spiral: the radius wanders so it never looks mathematical. */
export function spiralPts(cx: number, cy: number, reach: number, turns: number): Pt[] {
  const b = reach / (turns * TAU);
  const p1 = R() * TAU;
  const p2 = R() * TAU;
  const dir = R() < 0.5 ? 1 : -1;
  const squash = 0.82 + R() * 0.3;
  const tilt = R() * TAU;
  const pts: Omit<Pt, "nx" | "ny">[] = [];
  let th = 0.9;
  while (th < turns * TAU) {
    const r = b * th * (1 + 0.07 * Math.sin(th * 0.9 + p1) + 0.035 * Math.sin(th * 2.3 + p2));
    const ex = Math.cos(th * dir) * r;
    const ey = Math.sin(th * dir) * r * squash;
    pts.push({ x: cx + ex * Math.cos(tilt) - ey * Math.sin(tilt), y: cy + ex * Math.sin(tilt) + ey * Math.cos(tilt), w: Math.min(1, 0.35 + th / 8) });
    th += 1.6 / Math.max(r, 3);
  }
  return normals(pts);
}

/** A spiral whose band wobbles with waves of a steady size. */
export function wavyPts(cx: number, cy: number, reach: number, turns: number): Pt[] {
  const b = reach / (turns * TAU);
  const waves = 8 + R() * 5;
  const amp = 4 + R() * 4;
  const p = R() * TAU;
  const dir = R() < 0.5 ? 1 : -1;
  const pts: Omit<Pt, "nx" | "ny">[] = [];
  let th = 1.2;
  while (th < turns * TAU) {
    const r0 = b * th;
    const r = r0 + amp * Math.min(1, r0 / 60) * Math.sin((b * th * th) / 2 / waves + p);
    pts.push({ x: cx + Math.cos(th * dir) * r, y: cy + Math.sin(th * dir) * r, w: Math.min(1, 0.3 + th / 7) });
    th += 1.5 / Math.max(r, 3);
  }
  return normals(pts);
}

/** Chalk / pastel: a faint core plus tiny grains scattered across the width. */
export function chalk(g: CanvasRenderingContext2D, pts: Pt[], width: number, color: string, alpha: number) {
  if (pts.length < 2) return;
  g.strokeStyle = g.fillStyle = color;
  g.lineCap = g.lineJoin = "round";
  g.globalAlpha = alpha * 0.45;
  g.lineWidth = width * 0.55;
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.stroke();
  for (const p of pts) {
    const wv = width * p.w;
    for (let k = 0; k < 3; k++) {
      const o = (R() - 0.5) * wv;
      g.globalAlpha = alpha * (0.25 + R() * 0.75);
      g.fillRect(p.x + p.nx * o + (R() - 0.5), p.y + p.ny * o + (R() - 0.5), 0.6 + R() * 1.3, 0.6 + R() * 1.3);
    }
  }
  g.globalAlpha = 1;
}

/** A soft painted band with chalky edges. */
export function band(g: CanvasRenderingContext2D, pts: Pt[], width: number, color: string) {
  if (pts.length < 2) return;
  g.strokeStyle = color;
  g.lineCap = g.lineJoin = "round";
  g.globalAlpha = 0.28;
  g.lineWidth = width;
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.stroke();
  chalk(g, pts, width * 0.8, color, 0.5);
}

/** A puffy, slightly lopsided hand-painted star. */
export function star(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.save();
  g.translate(x, y);
  g.rotate(R() * TAU);
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * (0.42 + R() * 0.08) : r * (0.9 + R() * 0.2);
    const a = (i / 10) * TAU - Math.PI / 2;
    if (i) g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    else g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  g.closePath();
  const grd = g.createRadialGradient(-r * 0.2, -r * 0.25, 0, 0, 0, r);
  grd.addColorStop(0, "#f3dfa8");
  grd.addColorStop(1, "#c9a253");
  g.fillStyle = grd;
  g.strokeStyle = "#c9a253";
  g.lineJoin = "round";
  g.lineWidth = r * 0.28;
  g.globalAlpha = 0.9;
  g.stroke();
  g.fill();
  g.restore();
  g.globalAlpha = 1;
}

/** Stars along a path, sparse on purpose. */
export function starsAlong(g: CanvasRenderingContext2D, pts: Pt[], every: number, maxR: number) {
  let run = 0;
  let next = every * (0.5 + R());
  for (let i = 1; i < pts.length; i++) {
    run += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (run > next) {
      star(g, pts[i].x + pts[i].nx * (R() - 0.5) * 6, pts[i].y + pts[i].ny * (R() - 0.5) * 6, maxR * (0.55 + R() * 0.45));
      run = 0;
      next = every * (0.7 + R() * 0.8);
    }
  }
}

/** Size a canvas to its CSS box (sharp on retina) and return its context. */
export function sized(c: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = c.clientWidth;
  const h = c.clientHeight;
  c.width = Math.max(1, w * dpr);
  c.height = Math.max(1, h * dpr);
  const g = c.getContext("2d")!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  return [g, w, h];
}

/** Fade the drawing out in a soft oval around an element, so words stay readable. */
export function clearAround(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement, el: Element, pad = 50) {
  const tb = el.getBoundingClientRect();
  const box = canvas.getBoundingClientRect();
  const cx = tb.left - box.left + tb.width / 2;
  const cy = tb.top - box.top + tb.height / 2;
  const rx = tb.width / 2 + pad;
  const ry = tb.height / 2 + pad;
  g.save();
  g.globalCompositeOperation = "destination-out";
  g.translate(cx, cy);
  g.scale(1, ry / rx);
  const grd = g.createRadialGradient(0, 0, rx * 0.7, 0, 0, rx * 1.2);
  grd.addColorStop(0, "rgba(0,0,0,1)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.beginPath();
  g.arc(0, 0, rx * 1.25, 0, TAU);
  g.fill();
  g.restore();
}

export const CHALK = "#e4d6bd";
export const BAND = "#9a7fa8";
