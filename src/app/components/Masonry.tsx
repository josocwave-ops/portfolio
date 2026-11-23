"use client";

import { Children, useEffect, useRef, useState } from "react";
import styles from "./Masonry.module.css";

// Pinterest-style board: pins are dealt left to right into columns, and the
// columns sit centred. Never more columns than pins, so a board with only a
// few pieces stays in the middle instead of leaving empty space on the right.
const MIN = 200; // narrowest a column may get, in px
const GAP = 16;

export default function Masonry({ children, max = 5 }: { children: React.ReactNode; max?: number }) {
  const items = Children.toArray(children);
  const n = items.length;
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(Math.max(1, Math.min(max, n)));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth;
      const c = w < 600 ? 2 : Math.floor((w + GAP) / (MIN + GAP));
      setCols(Math.max(1, Math.min(max, n, c)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [max, n]);

  return (
    <div ref={ref} className={styles.masonry}>
      {Array.from({ length: cols }, (_, c) => (
        <div key={c} className={styles.col}>
          {items.filter((_, i) => i % cols === c)}
        </div>
      ))}
    </div>
  );
}
