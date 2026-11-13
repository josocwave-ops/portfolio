"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./Atmosphere.module.css";

const WASH = ["#3d2f56", "#2a3153", "#46304a", "#17131f", "#322849", "#3f2c40", "#2c3a52"];

// Painted night sky, grain, vignette and a faint candle glow that follows the mouse.
// Also gives every [data-depth] element a little parallax, so the page has layers.
export default function Atmosphere() {
  const sky = useRef<HTMLCanvasElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // depth + glow, re-measured on every page
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = matchMedia("(pointer: fine)").matches;
    const layers = [...document.querySelectorAll<HTMLElement>("[data-depth]")].map((el) => ({
      el,
      d: parseFloat(el.dataset.depth || "0"),
      base: 0,
    }));
    const measure = () => {
      for (const L of layers) L.el.style.translate = "";
      for (const L of layers) {
        const r = L.el.getBoundingClientRect();
        L.base = r.top + scrollY + r.height / 2;
      }
    };
    measure();

    let tx = 0;
    let ty = 0;
    let mx = 0;
    let my = 0;
    let gx = innerWidth / 2;
    let gy = innerHeight / 2;
    let ggx = gx;
    let ggy = gy;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
      ggx = e.clientX;
      ggy = e.clientY;
      glow.current?.classList.add(styles.on);
    };
    const onLeave = () => glow.current?.classList.remove(styles.on);
    if (fine) {
      addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(measure, 250);
    };
    addEventListener("resize", onResize);
    // images arriving late shift the layout, so measure again once things settle
    const settle = window.setTimeout(measure, 900);

    let raf = 0;
    const frame = () => {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      gx += (ggx - gx) * 0.12;
      gy += (ggy - gy) * 0.12;
      if (glow.current) glow.current.style.transform = `translate(${gx.toFixed(1)}px, ${gy.toFixed(1)}px)`;
      const mid = scrollY + innerHeight / 2;
      for (const L of layers) {
        const s = (L.base - mid) * L.d * -0.06;
        L.el.style.translate = `${(-mx * L.d * 14).toFixed(2)}px ${(-my * L.d * 10 + s).toFixed(2)}px`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      clearTimeout(settle);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      removeEventListener("resize", onResize);
      for (const L of layers) L.el.style.translate = "";
    };
  }, [pathname]);

  return (
    <div aria-hidden="true">
      <canvas ref={sky} className={styles.sky} />
      <div className={styles.grain} />
      <div className={styles.vignette} />
      <div ref={glow} className={styles.glow} />
    </div>
  );
}
