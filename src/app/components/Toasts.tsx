"use client";

import { useEffect, useState } from "react";
import Pixel from "./Pixel";
import { isOn, play } from "./Sounds";
import { onNotice, type Notice } from "./notices";
import styles from "./Toasts.module.css";

// Little windows that slide up in the bottom-left corner, like an old
// messenger app: "<visitor name> has signed in", a tiny chat from ona, and
// achievements.
// Each goes away on its own after a few seconds (or with its ×).

type Shown = Notice & { id: number; typing?: boolean };

const STAY = { signin: 5000, chat: 14000, achievement: 6500 } as const;
let next = 1;

export default function Toasts() {
  const [list, setList] = useState<Shown[]>([]);

  useEffect(
    () =>
      onNotice((n) => {
        const id = next++;
        const remove = () => setList((l) => l.filter((t) => t.id !== id));
        setList((l) => [...l.slice(-2), { ...n, id, typing: n.kind === "chat" }]);
        if (isOn()) play(n.kind === "achievement" ? "achieve" : n.kind === "signin" ? "signin" : "message");
        // the chat shows "ona is typing…" for a moment first
        if (n.kind === "chat") window.setTimeout(() => setList((l) => l.map((t) => (t.id === id ? { ...t, typing: false } : t))), 1600);
        window.setTimeout(remove, STAY[n.kind]);
      }),
    [],
  );

  const close = (id: number) => setList((l) => l.filter((t) => t.id !== id));

  return (
    <div className={styles.stack} aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={`${styles.toast} lift`}>
          <div className={`${styles.win} px-frame ${styles[t.kind]}`}>
            <div className={`${styles.bar} pixel`}>
              <span>{t.kind === "signin" ? "✉ onA messenger" : t.kind === "chat" ? "<3 chat with ona" : "✦ achievement unlocked ✦"}</span>
              <button type="button" className={styles.x} aria-label="close" onClick={() => close(t.id)} data-sfx="pop">
                ×
              </button>
            </div>
            <div className={styles.body}>
              {t.kind === "signin" && (
                <>
                  <Pixel name="heart" size={3} color="var(--rose)" />
                  <p className="pixel">
                    {t.name} has signed in ✦<small>welcome to onA &lt;3</small>
                  </p>
                </>
              )}
              {t.kind === "chat" && (
                <p>
                  <b className="pixel">ona says:</b> {t.typing ? <span className={styles.typing}>typing</span> : t.text}
                </p>
              )}
              {t.kind === "achievement" && (
                <>
                  <Pixel name="star8" size={3} color="var(--rose)" className={styles.star} />
                  <p>
                    <b className="pixel">{t.title}</b>
                    <small>{t.text}</small>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
