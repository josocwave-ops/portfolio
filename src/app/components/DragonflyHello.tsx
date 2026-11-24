"use client";

import { useEffect, useRef, useState } from "react";
import { isOn, play } from "./Sounds";
import { unlock } from "./notices";
import styles from "./DragonflyHello.module.css";

// The ASCII dragonfly by the big onA. A little comic speech bubble with three
// bouncing dots sits above it, as if it wants to talk, so people know to
// click. Click it and it hops, flutters, and says something in that same
// bubble ("bzz! hi <3"), then goes back to its three dots.
// TODO(Ona): the things it says are drafts.
const SAYINGS = ["bzz! hi <3", "bzz bzz :)", "hello hello ✦", "*flutters*"];
const TALK_FOR = 1800; // ms

export default function DragonflyHello({ className }: { className?: string }) {
  const [saying, setSaying] = useState<string | null>(null);
  const count = useRef(0);
  const img = useRef<HTMLImageElement>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hello = () => {
    setSaying(SAYINGS[count.current++ % SAYINGS.length]);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaying(null), TALK_FOR);
    if (isOn()) play("buzz");
    unlock("dragonfly");
    // a happy hop on the picture itself
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      img.current?.animate(
        [
          { translate: "0 0", rotate: "0deg" },
          { translate: "4px -14px", rotate: "8deg", offset: 0.4 },
          { translate: "0 0", rotate: "0deg" },
        ],
        { duration: 500, easing: "steps(5, jump-none)" },
      );
    }
  };

  return (
    <button type="button" className={`${styles.fly} ${className ?? ""}`} onClick={hello} data-sfx="none" aria-label="say hi to the dragonfly">
      {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG */}
      <img ref={img} src="/decor/dragonfly.svg" alt="" width={124} height={114} draggable={false} />
      {/* one speech bubble: three bouncing dots, or what it's saying */}
      <span className={styles.bubble} aria-live="polite">
        {saying ? (
          <span key={saying + count.current} className={`${styles.words} pixel`}>
            {saying}
          </span>
        ) : (
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </span>
    </button>
  );
}
