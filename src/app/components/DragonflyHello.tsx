"use client";

import { useEffect, useState } from "react";
import { isOn, play } from "./Sounds";
import { unlock } from "./notices";
import styles from "./DragonflyHello.module.css";

// The ASCII dragonfly by the big onA. Click it and it gives a little hop, a
// wing-flutter sound, and a speech bubble ("bzz! hi <3") that floats away.
// Until it's been clicked once (remembered in this browser), a little comic
// speech bubble with three bouncing dots sits above it, as if it wants to talk.
// TODO(Ona): the bubble words are a draft.
const SAYINGS = ["bzz! hi <3", "bzz bzz :)", "hello hello ✦", "*flutters*"];
const KEY = "onA-said-hi";

export default function DragonflyHello({ className }: { className?: string }) {
  const [bubbles, setBubbles] = useState<{ id: number; text: string }[]>([]);
  const [hop, setHop] = useState(0);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    try {
      setHint(localStorage.getItem(KEY) !== "yes");
    } catch {}
  }, []);

  const hello = () => {
    const id = Date.now();
    const text = SAYINGS[bubbles.length % SAYINGS.length];
    setBubbles((b) => [...b.slice(-2), { id, text }]);
    setHop((h) => h + 1);
    if (isOn()) play("buzz");
    unlock("dragonfly");
    setHint(false);
    try {
      localStorage.setItem(KEY, "yes");
    } catch {}
    window.setTimeout(() => setBubbles((b) => b.filter((x) => x.id !== id)), 1800);
  };

  return (
    <button type="button" className={`${styles.fly} ${className ?? ""}`} onClick={hello} data-sfx="none" aria-label="say hi to the dragonfly">
      {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG */}
      <img key={hop} src="/decor/dragonfly.svg" alt="" draggable={false} className={hop ? styles.hop : undefined} />
      {/* a comic speech bubble with three bouncing dots, as if it's about to
          say something, until you click it for the first time */}
      {hint && (
        <span className={styles.hint} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      {bubbles.map((b) => (
        <span key={b.id} className={`${styles.bubble} pixel`} aria-live="polite">
          {b.text}
        </span>
      ))}
    </button>
  );
}
