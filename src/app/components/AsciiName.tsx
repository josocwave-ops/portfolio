"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AsciiName.module.css";

// The onA signature redrawn as ASCII art, the same way the lily in the
// background is drawn: the letters are painted onto a hidden canvas in a real
// font, then re-printed on a grid as little characters.
//
//   mode "bars":  bars inside, dashes on the edges (matches the lily)
//   mode "chars": classic ASCII art, characters chosen by how much ink is there

const RAMP = " .:-=+*#%@";

// how much of a grid cell the letter must cover to print: a solid bar or dash
// from SOLID up, a fine dot (the hairlines) between FAINT and SOLID
const SOLID = 0.3;
const FAINT = 0.07;

type Cell = { x: number; y: number; edge: boolean; ink: number };
export type Art = { cols: number; rows: number; pitch: number; grid: string };

// a pre-drawn grid (see signatureArt.ts) back into cells
function fromArt(art: Art) {
  const cells: Cell[] = [];
  art.grid.split("\n").forEach((line, y) => {
    [...line].forEach((ch, x) => {
      if (ch === "#") cells.push({ x, y, edge: false, ink: 1 });
      else if (ch === "-") cells.push({ x, y, edge: true, ink: 1 });
      else if (ch === ".") cells.push({ x, y, edge: false, ink: FAINT });
    });
  });
  return { w: art.cols, h: art.rows, cells };
}

export default function AsciiName({
  fontFamily,
  italic = false,
  weight = 400,
  mode = "bars",
  pitch = 5,
  size = 120,
  color = "#30314f",
  edgeColor = "#8583c4",
  backColor = "#fff8f8",
  art,
  className,
}: {
  /** the CSS font-family to draw the letters in (e.g. from next/font's style.fontFamily) */
  fontFamily: string;
  italic?: boolean;
  weight?: number;
  mode?: "bars" | "chars";
  /** grid size in CSS pixels; smaller = finer */
  pitch?: number;
  /** font size of the small "on" in CSS pixels (the A is 2.3× this) */
  size?: number;
  color?: string;
  edgeColor?: string;
  /** fills the letter's shape behind the bars; "" leaves the gaps see-through */
  backColor?: string;
  /** a pre-drawn grid: shown straight away, with no font loading or canvas */
  art?: Art;
  className?: string;
}) {
  if (art) pitch = art.pitch;
  const [grid, setGrid] = useState<{ w: number; h: number; cells: Cell[] } | null>(() => (art ? fromArt(art) : null));
  const done = useRef(false);

  useEffect(() => {
    if (done.current || art) return;
    done.current = true;
    const style = `${italic ? "italic " : ""}${weight} `;
    const big = size * 2.3;
    const draw = async () => {
      await Promise.all([
        document.fonts.load(`${style}${size}px ${fontFamily}`, "on"),
        document.fonts.load(`${style}${big}px ${fontFamily}`, "A"),
      ]);
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.font = `${style}${size}px ${fontFamily}`;
      const onW = ctx.measureText("on").width;
      ctx.font = `${style}${big}px ${fontFamily}`;
      const aM = ctx.measureText("A");
      const W = Math.ceil(onW + aM.width + size * 0.4);
      const H = Math.ceil(big * 1.15);
      c.width = W;
      c.height = H;
      const base = Math.round(big * 0.92);
      ctx.fillStyle = "#000";
      ctx.textBaseline = "alphabetic";
      ctx.font = `${style}${size}px ${fontFamily}`;
      ctx.fillText("on", size * 0.15, base);
      ctx.font = `${style}${big}px ${fontFamily}`;
      ctx.fillText("A", size * 0.15 + onW - size * 0.02, base);

      const data = ctx.getImageData(0, 0, W, H).data;
      const cols = Math.floor(W / pitch);
      const rows = Math.floor(H / pitch);
      const ink = (cx: number, cy: number) => {
        // average coverage over the cell
        let sum = 0;
        let n = 0;
        for (let y = cy * pitch; y < (cy + 1) * pitch; y += 2)
          for (let x = cx * pitch; x < (cx + 1) * pitch; x += 2) {
            sum += data[(y * W + x) * 4 + 3];
            n++;
          }
        return sum / n / 255;
      };
      const cov: number[] = [];
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) cov.push(ink(q, r));
      const at = (q: number, r: number) => (q < 0 || r < 0 || q >= cols || r >= rows ? 0 : cov[r * cols + q]);
      const cells: Cell[] = [];
      for (let r = 0; r < rows; r++)
        for (let q = 0; q < cols; q++) {
          const v = at(q, r);
          // Bodoni's hairlines are thinner than one grid cell, so they only
          // half-fill it. Keep those cells too (as fine dots), or the "o" and
          // "n" lose their shape and the name stops reading.
          if (v < FAINT) continue;
          const edge = at(q - 1, r) < SOLID || at(q + 1, r) < SOLID || at(q, r - 1) < SOLID || at(q, r + 1) < SOLID;
          cells.push({ x: q, y: r, edge, ink: v });
        }
      setGrid({ w: cols, h: rows, cells });
    };
    draw();
  }, [fontFamily, italic, weight, pitch, size, art]);

  const label = <span className="sr-only">onA, Ona Cabedo Wells</span>;
  if (!grid) return <span className={`${styles.wrap} ${className ?? ""}`} style={{ height: size * 2.3 * 1.15 }}>{label}</span>;

  if (mode === "chars") {
    const lines: string[] = Array.from({ length: grid.h }, () => " ".repeat(grid.w));
    for (const c of grid.cells) {
      const ch = RAMP[Math.min(RAMP.length - 1, Math.round(c.ink * (RAMP.length - 1)))];
      lines[c.y] = lines[c.y].slice(0, c.x) + ch + lines[c.y].slice(c.x + 1);
    }
    return (
      <span className={`${styles.wrap} ${className ?? ""}`}>
        {label}
        <pre className={styles.pre} style={{ fontSize: pitch * 1.25, lineHeight: `${pitch * 1.25}px`, color }} aria-hidden="true">
          {lines.join("\n")}
        </pre>
      </span>
    );
  }

  // every mark sits on whole grid pixels (no half-pixel offsets), so the
  // bars come out the same width everywhere instead of flickering 1px/2px
  const d = (cells: Cell[], w: number, h: number) => cells.map((c) => `M${c.x * pitch} ${c.y * pitch}h${w}v${h}h-${w}z`).join("");
  // faint cells right next to the letter are just its soft fringe; printed
  // solid they look like stray dots outside the outline, so leave them out
  // and keep only faint cells that stand on their own (real hairlines)
  const solid = new Set(grid.cells.filter((c) => c.ink >= SOLID).map((c) => `${c.x},${c.y}`));
  const fringe = (c: Cell) => c.ink < SOLID && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => solid.has(`${c.x + a},${c.y + b}`));
  const shown = grid.cells.filter((c) => !fringe(c));
  return (
    <span className={`${styles.wrap} ${className ?? ""}`}>
      {label}
      <svg
        viewBox={`0 0 ${grid.w * pitch} ${grid.h * pitch}`}
        width={grid.w * pitch}
        height={grid.h * pitch}
        shapeRendering="crispEdges"
        aria-hidden="true"
        className={styles.svg}
      >
        {/* the letter's whole shape filled in first, so the background
            doesn't show through between the bars; then unbroken bars inside
            (one pixel of gap between them), a solid pixel outline, and any
            lone hairlines in the outline colour */}
        {backColor && <path fill={backColor} d={d(shown, pitch, pitch)} />}
        <path fill={color} d={d(shown.filter((c) => c.ink >= SOLID && !c.edge), Math.max(1, pitch - 1), pitch)} />
        <path fill={edgeColor} d={d(shown.filter((c) => c.ink >= SOLID && c.edge), pitch, pitch)} />
        <path fill={edgeColor} d={d(shown.filter((c) => c.ink < SOLID), pitch, pitch)} />
      </svg>
    </span>
  );
}
