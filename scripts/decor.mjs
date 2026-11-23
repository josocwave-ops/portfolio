// Generates the decorative background drawings in public/decor/.
// Run with:  node scripts/decor.mjs
//
// Each drawing is built from simple vector shapes (curves, spirals, petals)
// and then "printed" onto a grid, like the dot-matrix / ASCII / cross-stitch
// flowers on Ona's Pinterest board. The output is plain SVG, so it's tiny
// and the browser just shows it like an image.

import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../public/decor/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// ---- tiny geometry kit ------------------------------------------------------

let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const bez = (p0, p1, p2, p3, n = 60) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  });

// an inward spiral starting at (x,y) heading at angle a0
function spiral(x, y, a0, r0, turns, dir = 1, n = 80) {
  const pts = [];
  // centre sits r0 away, to the side we turn toward
  const cx = x + Math.cos(a0 + (dir * Math.PI) / 2) * r0;
  const cy = y + Math.sin(a0 + (dir * Math.PI) / 2) * r0;
  const start = Math.atan2(y - cy, x - cx);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + dir * t * turns * Math.PI * 2;
    const r = r0 * (1 - t * 0.85);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

// a stroke: a polyline with a width that tapers from w0 to w1
const stroke = (pts, w0, w1 = w0) => ({ kind: "stroke", pts, w0, w1 });

// a closed blob (petal, leaf) given as a centre line and a width profile
const blob = (pts, width, tag = "petal") => ({ kind: "blob", pts, width, tag });

const angleAt = (pts) => {
  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];
  return Math.atan2(b[1] - a[1], b[0] - a[0]);
};

function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const l = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / l;
  t = Math.max(0, Math.min(1, t));
  return [Math.hypot(px - ax - t * dx, py - ay - t * dy), t];
}

// how far inside the shape set a point is; also which shape and where along it
function sample(shapes, x, y) {
  let best = { d: Infinity };
  for (const s of shapes) {
    const n = s.pts.length;
    for (let i = 0; i < n - 1; i++) {
      const [a, b] = [s.pts[i], s.pts[i + 1]];
      // quick reject
      if (Math.abs(x - a[0]) > 60 && Math.abs(x - b[0]) > 60) continue;
      if (Math.abs(y - a[1]) > 60 && Math.abs(y - b[1]) > 60) continue;
      const [d, tt] = distToSeg(x, y, a[0], a[1], b[0], b[1]);
      const t = (i + tt) / (n - 1);
      const half = s.kind === "stroke" ? (s.w0 + (s.w1 - s.w0) * t) / 2 : s.width(t);
      const m = d - half;
      if (m < best.d) best = { d: m, shape: s, t, rel: d / Math.max(half, 0.01) };
    }
  }
  return best;
}

// lay a grid over the drawing; returns cells with inside/edge info
function raster(shapes, W, H, pitch) {
  const cols = Math.ceil(W / pitch);
  const rows = Math.ceil(H / pitch);
  const grid = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * pitch + pitch / 2;
      const y = r * pitch + pitch / 2;
      const s = sample(shapes, x, y);
      grid.push({ r, c, x, y, inside: s.d < 0, ...s });
    }
  }
  const at = (r, c) => (r < 0 || c < 0 || r >= rows || c >= cols ? null : grid[r * cols + c]);
  for (const g of grid) {
    if (!g.inside) continue;
    g.edge = [at(g.r - 1, g.c), at(g.r + 1, g.c), at(g.r, g.c - 1), at(g.r, g.c + 1)].some((n) => !n || !n.inside);
  }
  return grid;
}

const svg = (W, H, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges">${body}</svg>\n`;

// merge cells of one colour into a single path of little rectangles
function rects(cells, w, h, dx = 0, dy = 0) {
  return cells
    .map((g) => `M${(g.x - w / 2 + dx).toFixed(1)} ${(g.y - h / 2 + dy).toFixed(1)}h${w}v${h}h-${w}z`)
    .join("");
}

// ---- 1. Victorian flourish corner, in fine dots (board pins #5, #6) --------

function flourishArm() {
  const S = [];
  // the main stem runs along the top edge in an S, ending in a big curl
  const main = bez([34, 34], [150, 4], [250, 96], [372, 52], 90);
  S.push(stroke(main, 16, 9));
  S.push(stroke(spiral(...main.at(-1), angleAt(main), 30, 1.35, 1), 9, 3));
  // a C-scroll hanging below the stem
  const c1 = bez(main[28], [140, 70], [96, 120], [150, 132], 40);
  S.push(stroke(c1, 9, 6));
  S.push(stroke(spiral(...c1.at(-1), angleAt(c1), 15, 1.2, -1), 6, 2));
  // a little curl lifting above the stem
  const c2 = bez(main[58], [262, 50], [286, 12], [318, 18], 30);
  S.push(stroke(c2, 7, 5));
  S.push(stroke(spiral(...c2.at(-1), angleAt(c2), 10, 1.2, 1), 5, 2));
  // a second hanging curl further along
  const c3 = bez(main[74], [330, 96], [300, 130], [262, 120], 30);
  S.push(stroke(c3, 7, 5));
  S.push(stroke(spiral(...c3.at(-1), angleAt(c3), 11, 1.1, 1), 5, 2));
  // leaves: pointed, slightly curved teardrops
  const leaf = (x, y, a, L, W) =>
    blob(
      Array.from({ length: 16 }, (_, i) => {
        const t = i / 15;
        return [x + Math.cos(a) * L * t - Math.sin(a) * W * 0.6 * t * t, y + Math.sin(a) * L * t + Math.cos(a) * W * 0.6 * t * t];
      }),
      (t) => W * Math.sin(Math.PI * Math.pow(t, 0.75)) * 0.5,
      "leaf",
    );
  // extra small curls for a lacier look
  const c4 = bez(main[12], [70, 70], [60, 96], [84, 104], 24);
  S.push(stroke(c4, 6, 4));
  S.push(stroke(spiral(...c4.at(-1), angleAt(c4), 8, 1.3, -1), 4, 2));
  const c5 = bez(main[86], [400, 20], [430, 10], [452, 26], 24);
  S.push(stroke(c5, 6, 4));
  S.push(stroke(spiral(...c5.at(-1), angleAt(c5), 9, 1.3, 1), 4, 2));
  S.push(leaf(...main[16], -0.9, 40, 18));
  S.push(leaf(...main[44], 0.9, 34, 16));
  S.push(leaf(...main[66], -1.1, 30, 14));
  return S;
}

function flourish() {
  const W = 520;
  const arm = flourishArm();
  // mirror the arm across the diagonal for the left edge
  const mirror = (s) => ({ ...s, pts: s.pts.map(([x, y]) => [y, x]) });
  const shapes = [...arm, ...arm.map(mirror)];
  // the corner rosette and a curl running down the diagonal
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.3;
    const pts = Array.from({ length: 10 }, (_, i) => [40 + Math.cos(a) * i * 2.2, 40 + Math.sin(a) * i * 2.2]);
    shapes.push(blob(pts, (t) => 7 * Math.sin(Math.PI * Math.pow(t, 0.6)), "petal"));
  }
  const diag = bez([52, 52], [100, 70], [70, 100], [128, 128], 30);
  shapes.push(stroke(diag, 8, 6));
  shapes.push(stroke(spiral(...diag.at(-1), angleAt(diag), 16, 1.25, 1), 6, 2));

  const grid = raster(shapes, W, W, 4);
  const outline = grid.filter((g) => g.inside && g.edge);
  // loose "pollen" dots drifting off the ends
  seed = 11;
  const pollen = Array.from({ length: 40 }, () => ({ x: 380 + rand() * 120, y: 70 + rand() * 120 }));
  const pollen2 = pollen.map((p) => ({ x: p.y, y: p.x }));
  return svg(
    W,
    W,
    `<path fill="#8583c4" d="${rects(outline, 2, 2)}"/>` +
      `<path fill="#c9a5ed" d="${rects([...pollen, ...pollen2].map((p) => ({ x: Math.round(p.x / 4) * 4 + 2, y: Math.round(p.y / 4) * 4 + 2 })), 2, 2)}"/>`,
  );
}

// ---- lilies: one set of shapes, printed three ways --------------------------

function petal(cx, cy, a, L, Wd, curl = 0.25) {
  const pts = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    const along = L * t;
    const side = curl * L * t * t;
    return [cx + Math.cos(a) * along - Math.sin(a) * side, cy + Math.sin(a) * along + Math.cos(a) * side];
  });
  // widest a third of the way out, then tapering to a point, like a lily petal
  return blob(pts, (t) => Wd * Math.pow(Math.sin(Math.PI * Math.min(1, Math.pow(t, 0.55))), 0.9) * 0.5 + 0.5, "petal");
}

function lilyShapes() {
  seed = 3;
  const S = [];
  // an open lily, six recurved petals
  const open = (cx, cy, L, rot) => {
    for (let k = 0; k < 6; k++) {
      const a = rot + (k / 6) * Math.PI * 2 + (rand() - 0.5) * 0.2;
      S.push(petal(cx, cy, a, L * (0.85 + rand() * 0.25), L * 0.62, (k % 2 ? 1 : -1) * 0.3));
    }
    for (let k = 0; k < 6; k++) {
      const a = rot + 0.5 + (k / 6) * Math.PI * 2;
      const line = bez([cx, cy], [cx + Math.cos(a) * L * 0.3, cy + Math.sin(a) * L * 0.3], [cx + Math.cos(a + 0.2) * L * 0.55, cy + Math.sin(a + 0.2) * L * 0.55], [cx + Math.cos(a + 0.15) * L * 0.72, cy + Math.sin(a + 0.15) * L * 0.72], 12);
      S.push({ ...stroke(line, 2.5, 2.5), tag: "stamen" });
      const e = line.at(-1);
      S.push({ ...stroke([e, [e[0] + Math.cos(a + 1.4) * 7, e[1] + Math.sin(a + 1.4) * 7]], 5, 5), tag: "anther" });
    }
  };
  // a side-on lily: a trumpet of three petals
  const side = (cx, cy, L, dir) => {
    for (const off of [-0.5, 0, 0.5]) S.push(petal(cx, cy, dir + off, L * (off ? 0.95 : 1.05), L * 0.55, off * 0.6));
  };
  // a closed bud
  const bud = (cx, cy, L, dir) => S.push(petal(cx, cy, dir, L, L * 0.4, 0.05));

  open(150, 165, 98, -0.3);
  side(78, 318, 78, 2.3);
  bud(232, 70, 70, -0.9);
  bud(212, 300, 56, 0.4);
  // stems and long leaves
  const stem = bez([150, 190], [146, 280], [160, 380], [150, 480], 50);
  S.push({ ...stroke(stem, 6, 7), tag: "stem" });
  S.push({ ...stroke(bez([150, 250], [120, 280], [96, 300], [80, 318], 20), 5, 4), tag: "stem" });
  S.push({ ...stroke(bez([170, 120], [190, 100], [210, 86], [232, 70], 20), 4, 3), tag: "stem" });
  S.push({ ...stroke(bez([152, 330], [172, 320], [196, 308], [212, 300], 20), 4, 3), tag: "stem" });
  const leaf = (x, y, a, L) => ({ ...petal(x, y, a, L, 22, 0.15), tag: "leaf" });
  S.push(leaf(150, 400, -2.5, 90), leaf(152, 370, -0.7, 80), leaf(150, 440, -0.4, 70), leaf(150, 450, 3.6, 60));
  return S;
}

// 2. ASCII / text-mode lily, pink (board pin #1)
function asciiLily() {
  const W = 300;
  const H = 500;
  const grid = raster(lilyShapes(), W, H, 4);
  seed = 5;
  const bars = [];
  const dashes = [];
  for (const g of grid) {
    if (!g.inside) continue;
    const fill = g.shape.tag === "petal" ? g.t < 0.5 : g.shape.tag === "leaf" ? g.rel < 0.35 : true;
    if (g.edge) dashes.push(g);
    else if (fill && rand() < 0.85) bars.push(g);
    else if (rand() < 0.08) dashes.push(g);
  }
  return svg(W, H, `<g fill="#e8b5d0"><path d="${rects(bars, 1.6, 3.4)}"/><path d="${rects(dashes, 3.2, 1.4)}"/></g>`);
}

// 2b. more text-mode flowers in the same bars-and-dashes print as the lily,
// each in one palette colour, for the "ascii-garden" background and page edges

// print any set of shapes the ASCII way: bars inside, dashes on the edges
function asciiPrint(shapes, W, H, colour, s = 5, pitch = 4) {
  const grid = raster(shapes, W, H, pitch);
  seed = s;
  const bars = [];
  const dashes = [];
  for (const g of grid) {
    if (!g.inside) continue;
    const tag = g.shape.tag;
    const fill = tag === "petal" ? g.t < 0.55 : tag === "leaf" ? g.rel < 0.35 : true;
    if (g.edge) dashes.push(g);
    else if (fill && rand() < 0.85) bars.push(g);
    else if (rand() < 0.08) dashes.push(g);
  }
  return svg(W, H, `<g fill="${colour}"><path d="${rects(bars, 1.6, 3.4)}"/><path d="${rects(dashes, 3.2, 1.4)}"/></g>`);
}

const leafAt = (x, y, a, L, w = 18) => ({ ...petal(x, y, a, L, w, 0.15), tag: "leaf" });
const stemOf = (pts, w0 = 5, w1 = 6) => ({ ...stroke(pts, w0, w1), tag: "stem" });

// tulips: cups of three petals on tall stems
function asciiTulips() {
  const S = [];
  const tulip = (cx, cy, L, lean) => {
    for (const off of [-0.42, 0, 0.42]) S.push(petal(cx, cy + L * 0.75, -Math.PI / 2 + lean + off, L, L * 0.62, off * 0.5));
  };
  tulip(70, 60, 62, -0.12);
  tulip(168, 120, 54, 0.15);
  S.push(petal(118, 230, -Math.PI / 2 - 0.3, 46, 20, 0.05)); // a bud
  S.push(stemOf(bez([72, 110], [66, 220], [90, 330], [96, 420], 40)));
  S.push(stemOf(bez([166, 165], [160, 260], [120, 340], [100, 420], 40)));
  S.push(stemOf(bez([112, 270], [110, 320], [104, 370], [98, 420], 20), 4, 5));
  S.push(leafAt(92, 400, -2.2, 110), leafAt(102, 396, -0.8, 100), leafAt(96, 330, -2.6, 70));
  return S;
}

// daisies: a little cluster of round flowers
function asciiDaisies() {
  const S = [];
  const daisy = (cx, cy, R, rot) => {
    for (let k = 0; k < 12; k++) S.push(petal(cx, cy, rot + (k / 12) * Math.PI * 2, R, R * 0.36, 0.04));
    S.push({ ...stroke([[cx - 2, cy], [cx + 2, cy]], R * 0.5, R * 0.5), tag: "stamen" });
  };
  daisy(70, 70, 44, 0.1);
  daisy(170, 120, 34, 0.4);
  daisy(110, 190, 26, 0.2);
  S.push(stemOf(bez([70, 110], [80, 200], [96, 280], [100, 340], 30), 4, 5));
  S.push(stemOf(bez([166, 152], [150, 230], [118, 290], [104, 340], 30), 4, 5));
  S.push(leafAt(100, 320, -2.4, 64, 16), leafAt(104, 318, -0.7, 60, 16));
  return S;
}

// bluebells: one arching stem with bells hanging off it
function asciiBells() {
  const S = [];
  const arch = bez([30, 330], [40, 120], [150, 30], [250, 80], 60);
  S.push(stemOf(arch, 4, 3));
  for (const [i, L] of [[24, 34], [32, 32], [40, 30], [48, 26], [55, 22]]) {
    const [x, y] = arch[i];
    const hang = bez([x, y], [x + 6, y + 10], [x + 8, y + 18], [x + 8, y + 24], 8);
    S.push(stemOf(hang, 2.5, 2.5));
    for (const off of [-0.4, 0, 0.4]) S.push(petal(x + 8, y + 22, Math.PI / 2 + off, L, L * 0.58, off * 0.4));
  }
  S.push(leafAt(34, 320, -1.2, 120, 20), leafAt(38, 324, -2.0, 90, 18));
  return S;
}

// 3. cross-stitch lily, three pinks + periwinkle leaves (board pin #3)
function stitchLily() {
  const W = 300;
  const H = 500;
  const grid = raster(lilyShapes(), W, H, 6);
  seed = 9;
  const tones = { deep: [], mid: [], light: [], leafDark: [], leafLight: [] };
  for (const g of grid) {
    if (!g.inside || rand() < 0.07) continue; // the odd missed stitch
    const tag = g.shape.tag;
    if (tag === "leaf" || tag === "stem") (g.edge || g.rel < 0.3 ? tones.leafDark : tones.leafLight).push(g);
    else if (tag === "stamen" || tag === "anther" || g.edge) tones.deep.push(g);
    else if (g.t < 0.4 || (g.rel < 0.25 && rand() < 0.6)) tones.mid.push(g);
    else tones.light.push(g);
  }
  const p = (cells, c) => `<path fill="${c}" d="${rects(cells, 5, 5)}"/>`;
  return svg(
    W,
    H,
    p(tones.light, "#e8b5d0") +
      p(tones.mid, "#d68db5") +
      p(tones.deep, "#9c4a78") +
      p(tones.leafLight, "#b9b8e3") +
      p(tones.leafDark, "#8583c4"),
  );
}

// ---- 4. halftone corner: dots that grow toward the corner ------------------

function halftone() {
  const W = 420;
  seed = 21;
  let d = "";
  for (let y = 5; y < W; y += 10) {
    for (let x = 5; x < W; x += 10) {
      const f = 1 - Math.hypot(x, y) / (W * 1.05);
      if (f <= 0) continue;
      const r = Math.min(4.6, Math.pow(f, 1.6) * 6 * (0.8 + rand() * 0.4));
      if (r < 0.5) continue;
      const q = r.toFixed(1);
      d += `M${(x - r).toFixed(1)} ${y}a${q} ${q} 0 1 0 ${(2 * r).toFixed(1)} 0a${q} ${q} 0 1 0 -${(2 * r).toFixed(1)} 0`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}"><path fill="#c9a5ed" d="${d}"/></svg>\n`;
}

// ---- 5. "my virtual garden": chrome stars and a bead chain (board pin #9) --

function garden() {
  const W = 520;
  const H = 360;
  seed = 4;
  const star = (cx, cy, R, r, id) => {
    const p = [];
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 - Math.PI / 2;
      const b = a + Math.PI / 4;
      p.push(`${k ? "L" : "M"}${(cx + Math.cos(a) * R).toFixed(1)} ${(cy + Math.sin(a) * R).toFixed(1)}`);
      p.push(`Q${(cx + Math.cos(b) * r).toFixed(1)} ${(cy + Math.sin(b) * r).toFixed(1)} `);
      const a2 = a + Math.PI / 2;
      p.push(`${(cx + Math.cos(a2) * R).toFixed(1)} ${(cy + Math.sin(a2) * R).toFixed(1)}`);
    }
    return `<path d="${p.join("")}Z" fill="url(#${id})" stroke="#8583c4" stroke-width="1.2"/>`;
  };
  // a drooping bead chain from the top-left corner
  const chain = bez([0, 40], [140, 200], [300, 220], [470, 70], 46);
  const beads = chain
    .map(([x, y], i) => {
      const big = i % 6 === 3;
      const fill = ["#e8b5d0", "#c9a5ed", "#b4c2dd", "#fff8f8"][i % 4];
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big ? 7 : 4.2}" fill="${fill}" stroke="#8583c4" stroke-width="1"/>`;
    })
    .join("");
  // a little tassel hanging off the end
  const [tx, ty] = chain.at(-1);
  const tassel = Array.from({ length: 7 }, (_, i) => `<path d="M${tx} ${ty + 6} q${(i - 3) * 2} 30 ${(i - 3) * 3} 52" stroke="#e8b5d0" stroke-width="1.6" fill="none"/>`).join("");
  const grad = (id, a, b, c) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff8f8"/><stop offset=".35" stop-color="${a}"/><stop offset=".7" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${grad("g1", "#c9a5ed", "#b4c2dd", "#e8b5d0")}${grad("g2", "#e8b5d0", "#c9a5ed", "#b4c2dd")}${grad("g3", "#b4c2dd", "#e8b5d0", "#c9a5ed")}</defs>${tassel}${beads}${star(110, 70, 54, 9, "g1")}${star(330, 150, 30, 6, "g2")}${star(220, 46, 18, 4, "g3")}${star(420, 40, 14, 3, "g1")}${star(40, 160, 12, 3, "g2")}</svg>\n`;
}

// ---- 6. hand-drawn "garden" doodle that drapes around the onA title --------
// In the spirit of the crayon-drawn starfish / bead-chain pin on the board:
// soft wobbly lines, a grainy crayon texture, starfish, long sparkles,
// a wavy ribbon, bead chains with tiny spiral and heart beads, tassels.

function doodle() {
  const W = 1000;
  const H = 380;
  seed = 17;
  const f = (n) => n.toFixed(1);
  const out = [];

  // a five-armed starfish with softly curved arms
  const starfish = (cx, cy, R, rot, fill, line, glow) => {
    const r = R * 0.27;
    let d = "";
    for (let k = 0; k < 5; k++) {
      const a = rot + (k / 5) * Math.PI * 2;
      const b = a + Math.PI / 5;
      const tip = [cx + Math.cos(a) * R * (0.9 + rand() * 0.2), cy + Math.sin(a) * R * (0.9 + rand() * 0.2)];
      const inner = [cx + Math.cos(b) * r, cy + Math.sin(b) * r];
      const bend = (rand() - 0.5) * R * 0.25;
      if (!k) d += `M${f(tip[0])} ${f(tip[1])}`;
      d += `Q${f(cx + Math.cos(a + 0.3) * R * 0.55 + bend)} ${f(cy + Math.sin(a + 0.3) * R * 0.55 + bend)} ${f(inner[0])} ${f(inner[1])}`;
      const a2 = a + (2 * Math.PI) / 5;
      const tip2 = [cx + Math.cos(a2) * R * (0.9 + rand() * 0.2), cy + Math.sin(a2) * R * (0.9 + rand() * 0.2)];
      d += `Q${f(cx + Math.cos(a2 - 0.3) * R * 0.55)} ${f(cy + Math.sin(a2 - 0.3) * R * 0.55)} ${f(tip2[0])} ${f(tip2[1])}`;
    }
    if (glow) out.push(`<path d="${d}Z" fill="${glow}" filter="url(#glow)" opacity=".8"/>`);
    out.push(`<path d="${d}Z" fill="${fill}" stroke="${line}" stroke-width="2.4" stroke-linejoin="round" filter="url(#crayon)"/>`);
    // little texture dots along the arms
    for (let k = 0; k < 5; k++) {
      const a = rot + (k / 5) * Math.PI * 2;
      for (let j = 1; j <= 3; j++) {
        const t = j / 4.2;
        out.push(`<circle cx="${f(cx + Math.cos(a) * R * t)}" cy="${f(cy + Math.sin(a) * R * t)}" r="1.4" fill="${line}" opacity=".6"/>`);
      }
    }
  };

  // a long, thin four-ray sparkle
  const sparkle = (cx, cy, L, color, glow = true) => {
    const w = 1.8;
    const d = `M${cx} ${cy - L}L${cx + w} ${cy}L${cx} ${cy + L * 0.8}L${cx - w} ${cy}ZM${cx - L * 0.6} ${cy}L${cx} ${cy - w}L${cx + L * 0.6} ${cy}L${cx} ${cy + w}Z`;
    if (glow) out.push(`<circle cx="${cx}" cy="${cy}" r="${L * 0.22}" fill="${color}" opacity=".35" filter="url(#glow)"/>`);
    out.push(`<path d="${d}" fill="${color}" filter="url(#crayon)"/>`);
  };

  // a wavy ribbon with a lighter sheen down the middle
  const ribbon = (pts, colour, sheen) => {
    const d = "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L");
    out.push(`<path d="${d}" fill="none" stroke="#8583c4" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" opacity=".55" filter="url(#crayon)"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${colour}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" filter="url(#crayon)"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${sheen}" stroke-width="4" stroke-linecap="round" opacity=".9" transform="translate(-2 -2)" filter="url(#crayon)"/>`);
  };

  // beads along a hanging curve; every so often a spiral, heart or star bead
  const chain = (pts) => {
    pts.forEach(([x, y], i) => {
      const fill = ["#fff8f8", "#e8b5d0", "#c9a5ed", "#b4c2dd", "#b9b8e3"][i % 5];
      if (i % 9 === 4) {
        out.push(`<path d="M${f(x)} ${f(y + 5)}l-6 -6a3.4 3.4 0 0 1 6 -4a3.4 3.4 0 0 1 6 4z" fill="#e8b5d0" stroke="#9c4a78" stroke-width="1.2"/>`);
      } else if (i % 9 === 7) {
        out.push(`<path d="M${f(x)} ${f(y)}m-5 0a5 5 0 1 1 5 5a3.4 3.4 0 1 1 -3 -4a1.6 1.6 0 1 1 2 2" fill="none" stroke="#526a9c" stroke-width="1.6"/>`);
      } else {
        const r = i % 4 === 0 ? 4.6 : 3.4;
        out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="#8583c4" stroke-width="1.2"/>`);
      }
    });
  };

  const tassel = (x, y, colour) => {
    out.push(`<path d="M${x - 5} ${y}h10l-2 8h-6z" fill="${colour}" stroke="#9c4a78" stroke-width="1"/>`);
    for (let i = 0; i < 9; i++)
      out.push(`<path d="M${x - 4 + i} ${y + 8}q${(i - 4) * 0.6} 22 ${(i - 4) * 1.3} 38" stroke="${colour}" stroke-width="1.5" fill="none" filter="url(#crayon)"/>`);
  };

  const flower = (cx, cy, r, colour) => {
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 + rand();
      out.push(`<circle cx="${f(cx + Math.cos(a) * r)}" cy="${f(cy + Math.sin(a) * r)}" r="${f(r * 0.8)}" fill="none" stroke="${colour}" stroke-width="1.8" filter="url(#crayon)"/>`);
    }
  };

  const curl = (cx, cy, r, colour) => {
    let d = "";
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const a = t * Math.PI * 4;
      const rr = r * (1 - t * 0.85);
      d += `${i ? "L" : "M"}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
    }
    out.push(`<path d="${d}" fill="none" stroke="${colour}" stroke-width="3" stroke-linecap="round" filter="url(#crayon)"/>`);
  };

  // the left side: a ribbon falling down, a big pearly starfish, sparkles
  const rib = Array.from({ length: 60 }, (_, i) => {
    const t = i / 59;
    return [34 + Math.sin(t * 7) * 26 + t * 60, 10 + t * 350];
  });
  ribbon(rib, "#b4c2dd", "#fff8f8");
  flower(108, 228, 12, "#b4c2dd");
  flower(300, 214, 10, "#e8b5d0");
  curl(160, 330, 14, "#526a9c");

  // the chain swoops across the top, above the title
  const top = bez([70, 70], [330, 150], [640, -40], [930, 120], 64);
  chain(top);
  const hang = bez([250, 92], [262, 170], [300, 240], [280, 300], 22);
  chain(hang);
  tassel(280, 304, "#e8b5d0");
  const hang2 = bez([846, 84], [880, 140], [870, 190], [896, 214], 14);
  chain(hang2);
  tassel(896, 218, "#e8b5d0");

  starfish(196, 120, 66, -0.4, "#fff8f8", "#c9a5ed", "#c9a5ed");
  starfish(250, 314, 34, 0.5, "#e8b5d0", "#d68db5");
  starfish(770, 60, 28, 0.2, "#fff8f8", "#8583c4", "#c9a5ed");
  starfish(940, 300, 36, -0.2, "#b4c2dd", "#526a9c");

  sparkle(62, 96, 70, "#8583c4");
  sparkle(340, 60, 34, "#c9a5ed");
  sparkle(734, 230, 86, "#526a9c");
  sparkle(660, 40, 24, "#d68db5", false);
  sparkle(966, 170, 40, "#c9a5ed");
  flower(720, 120, 9, "#c9a5ed");
  flower(978, 70, 9, "#b4c2dd");
  curl(960, 40, 12, "#8583c4");

  const defs =
    `<filter id="crayon" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="warp"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="warp" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="wobbly"/>` +
    `<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="8" result="grain"/>` +
    `<feColorMatrix in="grain" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 -1.6 1.55" result="grainMask"/>` +
    `<feComposite in="wobbly" in2="grainMask" operator="in"/></filter>` +
    `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${out.join("")}</svg>\n`;
}

const files = {
  "doodle.svg": doodle(),
  "flourish.svg": flourish(),
  "lily-ascii.svg": asciiLily(),
  "tulips-ascii.svg": asciiPrint(asciiTulips(), 240, 430, "#c9a5ed", 13),
  "daisies-ascii.svg": asciiPrint(asciiDaisies(), 230, 350, "#8583c4", 17),
  "bells-ascii.svg": asciiPrint(asciiBells(), 280, 340, "#b4c2dd", 19),
  "lily-stitch.svg": stitchLily(),
  "halftone.svg": halftone(),
  "garden.svg": garden(),
};
for (const [name, body] of Object.entries(files)) {
  writeFileSync(new URL(name, OUT), body);
  console.log(`${name}  ${(body.length / 1024).toFixed(1)} KB`);
}
