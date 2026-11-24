"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./IntroStar.module.css";

// When you first open the homepage, a shooting star streaks up from the
// bottom-left corner, sweeps past right beside the big A, and flies off the
// top-right. About a second, once per visit. Visitors who prefer less motion
// don't see it.

const KEY = "onA-intro-star";
const DURATION = 1100; // ms
const TAIL = 140; // px of glowing tail behind the star

export default function IntroStar({ targetSelector }: { targetSelector: string }) {
  const [path, setPath] = useState<{ d: string; w: number; h: number } | null>(null);
  const line = useRef<SVGPathElement>(null);
  const head = useRef<HTMLSpanElement>(null);

  // work out the path once the page (and the A) has settled
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      const target = document.querySelector(targetSelector);
      if (!target) return;
      const r = target.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return; // the A isn't on screen
      const w = window.innerWidth;
      const h = window.innerHeight;
      // three points: bottom-left corner, just right of the A, top-right corner
      const start = { x: -30, y: h + 30 };
      const byA = { x: r.right + 14, y: r.top + r.height * 0.45 };
      const end = { x: w + 40, y: -40 };
      // a smooth curve through them: rising steeply first, then sweeping across
      const c1 = { x: byA.x - (byA.x - start.x) * 0.45, y: start.y - (start.y - byA.y) * 0.15 };
      const d = `M${start.x} ${start.y} Q${c1.x} ${c1.y} ${byA.x} ${byA.y} T${end.x} ${end.y}`;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setPath({ d, w, h });
    }, 700);
    return () => window.clearTimeout(t);
  }, [targetSelector]);

  // fly the star along the path
  useEffect(() => {
    if (!path || !line.current || !head.current) return;
    const p = line.current;
    const star = head.current;
    const total = p.getTotalLength();
    p.style.strokeDasharray = `${TAIL} ${total + TAIL}`;
    let raf = 0;
    const t0 = performance.now();
    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / DURATION);
      const at = ease(k) * (total + TAIL);
      const pt = p.getPointAtLength(Math.min(at, total));
      star.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      p.style.strokeDashoffset = `${TAIL - at}`;
      if (k < 1) raf = requestAnimationFrame(step);
      else setPath(null);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [path]);

  if (!path) return null;
  return (
    <div className={styles.sky} aria-hidden="true">
      <svg width={path.w} height={path.h} viewBox={`0 0 ${path.w} ${path.h}`}>
        <defs>
          <linearGradient id="intro-tail" gradientUnits="userSpaceOnUse" x1="0" y1={path.h} x2={path.w} y2="0">
            <stop offset="0" stopColor="#e8b5d0" />
            <stop offset="0.5" stopColor="#c9a5ed" />
            <stop offset="1" stopColor="#fff8f8" />
          </linearGradient>
        </defs>
        <path ref={line} d={path.d} className={styles.tail} stroke="url(#intro-tail)" />
      </svg>
      <span ref={head} className={styles.star} />
    </div>
  );
}
