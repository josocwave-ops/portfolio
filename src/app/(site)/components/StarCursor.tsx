"use client";

import { useEffect, useRef } from "react";
import styles from "./StarCursor.module.css";

const CLICKABLE = "a, button, [role='button'], summary, label, select";
const DUST = 14;

// A tiny hand-inked star that follows the mouse, sheds a little gold dust,
// and turns a quarter-turn over anything clickable. Only on devices with a real mouse.
export default function StarCursor() {
  const star = useRef<HTMLDivElement>(null);
  const dust = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = star.current;
    const box = dust.current;
    if (!el || !box) return;

    let on = false;
    let x = -100;
    let y = -100;
    let sx = x;
    let sy = y;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let next = 0;
    const specks = [...box.children] as HTMLElement[];

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      el.classList.add(styles.shown);
      // a speck of dust every so often while moving
      if (!calm && Math.hypot(x - lastX, y - lastY) > 16) {
        lastX = x;
        lastY = y;
        const s = specks[next++ % specks.length];
        s.style.left = `${x + (Math.random() - 0.5) * 10}px`;
        s.style.top = `${y + (Math.random() - 0.5) * 10}px`;
        s.style.setProperty("--dx", `${(Math.random() - 0.5) * 18}px`);
        s.style.setProperty("--size", `${2 + Math.random() * 3}px`);
        s.classList.remove(styles.fall);
        void s.offsetWidth; // restart the little fall
        s.classList.add(styles.fall);
      }
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(CLICKABLE);
      el.classList.toggle(styles.hover, !!hit);
    };
    const down = () => el.classList.add(styles.press);
    const up = () => el.classList.remove(styles.press);
    const hide = () => el.classList.remove(styles.shown);

    const frame = () => {
      // the star trails ever so slightly behind the real pointer
      sx += (x - sx) * 0.45;
      sy += (y - sy) * 0.45;
      el.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (on) return;
      on = true;
      document.documentElement.classList.add(styles.active);
      addEventListener("pointermove", move);
      addEventListener("pointerover", over);
      addEventListener("pointerdown", down);
      addEventListener("pointerup", up);
      document.documentElement.addEventListener("pointerleave", hide);
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!on) return;
      on = false;
      document.documentElement.classList.remove(styles.active);
      removeEventListener("pointermove", move);
      removeEventListener("pointerover", over);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", hide);
      cancelAnimationFrame(raf);
      hide();
    };
    const sync = () => (mq.matches ? start() : stop());
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={dust}>
        {Array.from({ length: DUST }, (_, i) => (
          <span key={i} className={styles.speck} />
        ))}
      </div>
      <div ref={star} className={styles.star}>
        <svg viewBox="-12 -12 24 24">
          {/* four uneven points, as if inked by hand */}
          <path d="M0.4 -10.5 C 1.2 -3.6, 2.4 -1.6, 9.6 -0.6 C 2.6 0.9, 1.1 2.6, -0.2 10.8 C -1.3 2.8, -2.8 1.2, -10.2 0.3 C -2.9 -1.1, -1.4 -2.7, 0.4 -10.5 Z" />
        </svg>
      </div>
    </div>
  );
}
