"use client";

import { useState } from "react";
import Cute from "./Cute";
import styles from "./Mood.module.css";

// The mood in the status line. Click it and it changes to the next one in
// site.moods (src/content/work.ts), with a little blip.
export default function Mood({ first, others }: { first: string; others: string[] }) {
  const moods = [first, ...others.filter((m) => m !== first)];
  const [i, setI] = useState(0);
  return (
    <button
      type="button"
      className={styles.mood}
      data-sfx="blip"
      onClick={() => setI((i + 1) % moods.length)}
      title="click to change my mood"
      aria-live="polite"
    >
      <Cute text={moods[i]} />
    </button>
  );
}
