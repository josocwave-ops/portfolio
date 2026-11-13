"use client";

import { useEffect, useRef } from "react";
import { BAND, band, chalk, CHALK, clearAround, type LineKind, type Pt, sized, spiralPts, starsAlong, wavyPts } from "../lib/lines";
import styles from "./Lines.module.css";

const R = Math.random;

function redrawOnResize(draw: () => void) {
  draw();
  let t = 0;
  let lastW = innerWidth;
  const onResize = () => {
    // phones fire resize while scrolling (the address bar); only redraw when the width changes
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    clearTimeout(t);
    t = window.setTimeout(draw, 250);
  };
  addEventListener("resize", onResize);
  return () => {
    clearTimeout(t);
    removeEventListener("resize", onResize);
  };
}

/** The homepage cover: a starry spiral up close, a blurred wavy band far behind, both clearing around the title. */
export function CoverLines({ clear }: { clear: string }) {
  const far = useRef<HTMLCanvasElement>(null);
  const near = useRef<HTMLCanvasElement>(null);
  useEffect(
    () =>
      redrawOnResize(() => {
        if (!far.current || !near.current) return;
        {
          const [g, w, h] = sized(far.current);
          band(g, wavyPts(w * (0.2 + R() * 0.15), h * (0.7 + R() * 0.2), Math.max(w, h) * 0.9, 4), 12, BAND);
        }
        const [g, w, h] = sized(near.current);
        const pts = spiralPts(w * (0.5 + (R() - 0.5) * 0.25), h * (0.5 + (R() - 0.5) * 0.2), Math.hypot(w, h) * 0.62, 3.6 + R());
        chalk(g, pts, 4.2, CHALK, 0.75);
        starsAlong(g, pts, 320, 9);
        const target = document.querySelector(clear);
        if (target) clearAround(g, near.current, target, 60);
      }),
    [clear],
  );
  return (
    <>
      <canvas ref={far} className={`${styles.cover} ${styles.far}`} data-depth="0.12" aria-hidden="true" />
      <canvas ref={near} className={styles.cover} data-depth="0.3" aria-hidden="true" />
    </>
  );
}

/** A line that weaves through its children: some stretches pass behind them, some in front. */
export function Weave({ kind, children, className }: { kind: LineKind; children: React.ReactNode; className?: string }) {
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  useEffect(
    () =>
      redrawOnResize(() => {
        if (!back.current || !front.current) return;
        const [gb, w, h] = sized(back.current);
        const [gf] = sized(front.current);
        const pts =
          kind === "spiral"
            ? spiralPts(w * (0.95 + R() * 0.1), h * (0.45 + R() * 0.15), Math.max(w, h) * 0.95, 3.2 + R() * 0.8)
            : wavyPts(w * (0.02 + R() * 0.08), h * (0.5 + R() * 0.15), Math.max(w, h) * 0.95, 3.4 + R() * 0.6);
        let start = 0;
        let over = R() < 0.5;
        while (start < pts.length) {
          const len = 220 + Math.floor(R() * 420);
          const run: Pt[] = pts.slice(start, Math.min(start + len + 1, pts.length));
          const g = over ? gf : gb;
          if (kind === "spiral") {
            chalk(g, run, 3.6, CHALK, over ? 0.65 : 0.5);
            if (!over) starsAlong(g, run, 300, 8); // stars stay behind the work
          } else if (over) chalk(g, run, 3.4, "#c99ab0", 0.65);
          else band(g, run, 11, BAND);
          start += len;
          over = !over;
        }
      }),
    [kind],
  );
  return (
    <div className={`${styles.weave} ${className ?? ""}`}>
      <canvas ref={back} className={styles.back} aria-hidden="true" />
      {children}
      <canvas ref={front} className={styles.front} aria-hidden="true" />
    </div>
  );
}

/** A quiet line behind a whole page, drifting in from one side. */
export function PageLines({ kind, side = "right" }: { kind: LineKind | "none"; side?: "left" | "right" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (kind === "none") return;
    return redrawOnResize(() => {
      if (!ref.current) return;
      const [g, w, h] = sized(ref.current);
      const cx = side === "right" ? w * (0.95 + R() * 0.1) : w * (-0.05 + R() * 0.1);
      const cy = Math.min(h * 0.25, 700) * (0.6 + R() * 0.8);
      const reach = Math.min(Math.max(w, 900), 1400);
      if (kind === "spiral") {
        const pts = spiralPts(cx, cy, reach, 3 + R());
        chalk(g, pts, 3.2, CHALK, 0.3);
        starsAlong(g, pts, 420, 6);
      } else {
        band(g, wavyPts(cx, cy, reach, 3.2 + R() * 0.6), 10, BAND);
      }
    });
  }, [kind, side]);
  if (kind === "none") return null;
  return <canvas ref={ref} className={styles.page} data-depth="0.15" aria-hidden="true" />;
}
