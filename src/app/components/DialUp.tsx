"use client";

import { useEffect, useRef, useState } from "react";
import { isOn, play } from "./Sounds";
import styles from "./DialUp.module.css";

// A photo that "loads in" like it's coming over a dial-up modem: hover, tap
// or tab to it and it appears a band at a time from the top while a little
// progress bar fills, then a ding. Once loaded it stays loaded. Visitors who
// prefer less motion just see the photo.
export default function DialUp({ children, file }: { children: React.ReactNode; file: string }) {
  const [p, setP] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setP(100);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  const start = () => {
    if (timer.current || p >= 100) return;
    timer.current = window.setInterval(() => {
      setP((v) => {
        const next = Math.min(100, v + 4 + Math.random() * 9);
        if (next >= 100 && timer.current) {
          window.clearInterval(timer.current);
          timer.current = null;
          if (isOn()) play("ding");
        }
        return next;
      });
    }, 140);
  };

  const done = p >= 100;
  // reveal in bands of 10%, so it steps down the way old images did
  const shown = done ? 100 : Math.floor(p / 10) * 10;

  return (
    <div
      className={styles.wrap}
      onPointerEnter={start}
      onClick={start}
      onFocus={start}
      tabIndex={done ? -1 : 0}
      role="img"
      aria-label={`${file}${done ? "" : ", loading"}`}
    >
      <div className={styles.photo} style={{ clipPath: `inset(0 0 ${100 - shown}% 0)` }}>
        {children}
      </div>
      {!done && (
        <div className={styles.status} aria-hidden="true">
          <span className={styles.bar}>
            <i style={{ width: `${p}%` }} />
          </span>
          <span className={styles.text}>{p > 0 ? `loading ${file}… ${Math.floor(p)}%` : `hover to load ${file}`}</span>
        </div>
      )}
    </div>
  );
}
