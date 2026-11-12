"use client";

import { useEffect, useRef } from "react";
import styles from "./Swirls.module.css";

const PALETTE = ["#8fa89a", "#8394b5", "#a99bb5", "#c98fa6", "#9fb3b8", "#d7a1b8"];
const NS = "http://www.w3.org/2000/svg";

type Pt = [number, number, number];
type Density = "cover" | "page";

const PRESETS: Record<Density, { threads: number; origins: number; bold: number; dust: number }> = {
  cover: { threads: 8, origins: 8, bold: 3, dust: 130 },
  page: { threads: 3, origins: 4, bold: 1, dust: 45 },
};

function el(name: string, attrs: Record<string, string | number>) {
  const node = document.createElementNS(NS, name);
  for (const k in attrs) node.setAttribute(k, String(attrs[k]));
  return node;
}

// One tapered stroke that flows, then curls into a loose spiral.
// Every stroke gets its own quirks so nothing looks machine-perfect.
function tendril(x: number, y: number, ang: number, len: number, w: number, bold: boolean) {
  const R = Math.random;
  const steps = 170;
  let curl = R() < 0.5 ? 1 : -1;
  const pw = bold ? 1.6 + R() * 0.8 : 1.8 + R() * 2.4;
  const kmax = bold ? 0.55 + R() * 0.4 : 0.25 + R() * 0.5;
  const noise = 0.02 + R() * 0.05;
  const shrink = bold ? 0.88 + R() * 0.08 : 0.7 + R() * 0.22;
  const flipAt = !bold && R() < 0.4 ? 0.3 + R() * 0.35 : 2;
  const wf = 0.05 + R() * 0.15;
  const wa = 0.01 + R() * 0.03;
  const open = !bold && R() < 0.3 ? 0.75 + R() * 0.2 : 1;
  const asym = 0.6 + R() * 0.8;

  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * open;
    pts.push([x, y, i / steps]);
    if (t > flipAt && t < flipAt + 1 / steps) curl = -curl;
    ang += curl * (0.004 + kmax * Math.pow(t, pw)) + Math.sin(i * wf) * wa + (R() - 0.5) * noise * (1 - t);
    const ds = (len / steps) * (1 - shrink * Math.pow(t, 1.3)) * 1.3;
    x += Math.cos(ang) * ds;
    y += Math.sin(ang) * ds;
  }

  const left: [number, number][] = [];
  const right: [number, number][] = [];
  pts.forEach((p, i) => {
    const q = pts[Math.min(i + 1, pts.length - 1)];
    const o = pts[Math.max(i - 1, 0)];
    let dx = q[0] - o[0];
    let dy = q[1] - o[1];
    const m = Math.hypot(dx, dy) || 1;
    dx /= m;
    dy /= m;
    const tt = Math.pow(p[2], asym);
    const ww = w * Math.pow(Math.sin(Math.PI * Math.min(tt * 1.05, 1)), bold ? 0.8 : 1.2) + 0.1;
    left.push([p[0] - dy * ww, p[1] + dx * ww]);
    right.push([p[0] + dy * ww, p[1] - dx * ww]);
  });
  const d = "M" + left.concat(right.reverse()).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L") + "Z";
  return { d, pts };
}

type Group = { g: SVGGElement; cx: number; cy: number; n: number; x: number; y: number; o: number; still?: boolean };

function draw(svg: SVGSVGElement, density: Density) {
  const R = Math.random;
  const { threads, origins, bold, dust } = PRESETS[density];
  const W = svg.clientWidth;
  const H = svg.clientHeight;
  const S = Math.min(W, H);
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.replaceChildren();
  const pick = () => PALETTE[Math.floor(R() * PALETTE.length)];
  const groups: Group[] = [];
  const group = () => {
    const g = el("g", {}) as SVGGElement;
    svg.appendChild(g);
    const G: Group = { g, cx: 0, cy: 0, n: 0, x: 0, y: 0, o: 1 };
    groups.push(G);
    return G;
  };

  // faint connecting threads
  for (let i = 0; i < threads; i++) {
    const G = group();
    let x = R() * W;
    let y = R() * H;
    let a = R() * Math.PI * 2;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    for (let s = 0; s < 70; s++) {
      a += Math.sin(s * 0.15 + i * 2) * 0.07 + (R() - 0.5) * 0.05;
      x += Math.cos(a) * (S / 45);
      y += Math.sin(a) * (S / 45);
      d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
      G.cx += x;
      G.cy += y;
      G.n++;
    }
    G.g.appendChild(el("path", { d, fill: "none", stroke: pick(), "stroke-width": 0.6, opacity: 0.35 }));
  }

  const grow = (G: Group, x: number, y: number, ang: number, len: number, w: number, depth: number, col: string, op: number, isBold: boolean) => {
    const t = tendril(x, y, ang, len, w, isBold);
    G.g.appendChild(el("path", { d: t.d, fill: col, opacity: op.toFixed(2) }));
    t.pts.forEach((p) => {
      G.cx += p[0];
      G.cy += p[1];
      G.n++;
    });
    for (let k = 0; k < 5; k++) {
      const p = t.pts[Math.floor(R() * t.pts.length)];
      G.g.appendChild(
        el("circle", {
          cx: (p[0] + (R() - 0.5) * 18).toFixed(1),
          cy: (p[1] + (R() - 0.5) * 18).toFixed(1),
          r: (0.4 + R() * 1.2).toFixed(2),
          fill: col,
          opacity: (0.35 + R() * 0.55).toFixed(2),
        }),
      );
    }
    if (depth > 0) {
      const branches = 1 + Math.floor(R() * 3);
      for (let b = 0; b < branches; b++) {
        const i = Math.floor(t.pts.length * (0.12 + R() * 0.55));
        const q = t.pts[i];
        const n = t.pts[i + 1];
        const a = Math.atan2(n[1] - q[1], n[0] - q[0]) + (R() < 0.5 ? 1 : -1) * (0.3 + R() * 0.8);
        grow(G, q[0], q[1], a, len * (0.25 + R() * 0.35), w * (0.55 + R() * 0.3), depth - 1, R() < 0.5 ? col : pick(), Math.max(0.2, op * (0.5 + R() * 0.6)), false);
      }
    }
  };

  // from every corner and edge, aimed roughly inward
  const starts: [number, number][] = [
    [-10, -10], [W + 10, -10], [-10, H + 10], [W + 10, H + 10],
    [W * 0.3, -10], [W + 10, H * 0.55], [W * 0.65, H + 10], [-10, H * 0.4],
  ];
  starts
    .sort(() => R() - 0.5)
    .slice(0, origins)
    .forEach((o, i) => {
      const G = group();
      const isBold = i < bold;
      const start: [number, number] = isBold ? [o[0] + (W / 2 - o[0]) * 0.22, o[1] + (H / 2 - o[1]) * 0.22] : o;
      const toward = Math.atan2(H * (0.35 + R() * 0.3) - start[1], W * (0.3 + R() * 0.4) - start[0]);
      grow(
        G, start[0], start[1], toward + (R() - 0.5) * 1.1,
        S * (isBold ? 0.6 + R() * 0.3 : 0.55 + R() * 0.45),
        isBold ? 3.6 + R() * 1.6 : 1.3 + R() * 0.8,
        isBold ? 2 : 3, PALETTE[i % PALETTE.length],
        isBold ? 0.55 + R() * 0.3 : 0.35 + R() * 0.6, isBold,
      );
    });

  const dustGroup = group();
  dustGroup.still = true;
  for (let i = 0; i < dust; i++) {
    dustGroup.g.appendChild(
      el("circle", {
        cx: (R() * W).toFixed(1),
        cy: (R() * H).toFixed(1),
        r: (0.3 + Math.pow(R(), 3) * 1.9).toFixed(2),
        fill: pick(),
        opacity: (0.2 + R() * 0.75).toFixed(2),
      }),
    );
  }
  groups.forEach((G) => {
    G.cx /= G.n || 1;
    G.cy /= G.n || 1;
  });
  return { groups, W, H, S };
}

export default function Swirls({ density = "cover" }: { density?: Density }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let scene = draw(svg, density);
    let mx = -1e4;
    let my = -1e4;
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: PointerEvent) => {
      const b = svg.getBoundingClientRect();
      mx = ((e.clientX - b.left) * scene.W) / b.width;
      my = ((e.clientY - b.top) * scene.H) / b.height;
    };
    const onLeave = () => {
      mx = my = -1e4;
    };
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => (scene = draw(svg, density)), 250);
    };

    // swirls lean away from the cursor and brighten as it passes
    const tick = () => {
      for (const G of scene.groups) {
        if (G.still) continue;
        const dx = G.cx - mx;
        const dy = G.cy - my;
        const d = Math.hypot(dx, dy);
        const f = Math.max(0, 1 - d / (scene.S * 0.6));
        const tx = d ? (dx / d) * f * 18 : 0;
        const ty = d ? (dy / d) * f * 18 : 0;
        G.x += (tx - G.x) * 0.08;
        G.y += (ty - G.y) * 0.08;
        G.o += (1 + f * 0.9 - G.o) * 0.08;
        G.g.setAttribute("transform", `translate(${G.x.toFixed(2)} ${G.y.toFixed(2)})`);
        G.g.style.filter = `brightness(${G.o.toFixed(3)}) saturate(${(1 + (G.o - 1) * 1.5).toFixed(3)})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return <svg ref={ref} className={styles.swirls} aria-hidden="true" />;
}
