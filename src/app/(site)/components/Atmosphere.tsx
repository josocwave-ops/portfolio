"use client";

import { useEffect, useRef } from "react";
import styles from "./Atmosphere.module.css";

const WASH = ["#3d2f56", "#2a3153", "#46304a", "#17131f", "#322849", "#3f2c40", "#2c3a52"];

// Painted night sky, grain, vignette and a faint candle glow that follows the mouse.
export default function Atmosphere() {
  const sky = useRef<HTMLCanvasElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  // the sky is painted once per visit (and again if the window changes size a lot)
  useEffect(() => {
    const c = sky.current;
    if (!c) return;
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = innerWidth;
      const h = innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      const g = c.getContext("2d")!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = "#1d1729";
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 24; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = (0.2 + Math.random() * 0.5) * Math.max(w, h);
        const col = WASH[Math.floor(Math.random() * WASH.length)];
        const grd = g.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, col);
        grd.addColorStop(1, col + "00");
        g.globalAlpha = 0.6;
        g.fillStyle = grd;
        g.fillRect(0, 0, w, h);
      }
      g.globalAlpha = 1;
    };
    paint();
    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(paint, 300);
    };
    addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      removeEventListener("resize", onResize);
    };
  }, []);

  // the candle glow follows the mouse, and only animates while it's catching up (then it rests)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = glow.current;
    if (!el) return;
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    const frame = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(frame) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add(styles.on);
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => el.classList.remove(styles.on);
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <canvas ref={sky} className={styles.sky} />
      <div className={styles.grain} />
      <div className={styles.vignette} />
      <div ref={glow} className={styles.glow} />
    </div>
  );
}
