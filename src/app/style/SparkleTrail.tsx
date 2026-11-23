"use client";

import { useRef } from "react";
import styles from "./style.module.css";

const COLOURS = ["#d68db5", "#8583c4", "#526a9c", "#8583c4", "#e8b5d0"];

// Little pixel sparkles that fall off the cursor inside this box.
export default function SparkleTrail({ children }: { children?: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const last = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    const el = box.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = performance.now();
    if (now - last.current < 45) return;
    last.current = now;
    const r = el.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = styles.trailDot;
    s.style.left = `${e.clientX - r.left}px`;
    s.style.top = `${e.clientY - r.top}px`;
    s.style.background = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    el.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  };

  return (
    <div ref={box} className={styles.trailBox} onPointerMove={onMove}>
      {children}
    </div>
  );
}
