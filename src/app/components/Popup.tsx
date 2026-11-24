"use client";

import { useEffect, useRef } from "react";
import Pixel, { type SpriteName } from "./Pixel";
import { isOn, play } from "./Sounds";
import styles from "./Popup.module.css";

// An old-computer pop-up ("⚠ onA.exe") in the middle of the page. Its own ×
// won't close it: it buzzes "wrong!" and shakes (so does clicking the dimmed
// page). The button underneath, or the Escape key, closes it.
export type PopupText = { big: string; small: string; ok: string; sprite: SpriteName };

export default function Popup({ text, onClose }: { text: PopupText; onClose: () => void }) {
  const ok = useRef<HTMLButtonElement>(null);
  const win = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ok.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const nope = () => {
    if (isOn()) play("nope");
    win.current?.animate(
      [{ translate: "0 0" }, { translate: "-7px 0" }, { translate: "7px 0" }, { translate: "-5px 0" }, { translate: "4px 0" }, { translate: "0 0" }],
      { duration: 360, easing: "steps(6, jump-none)" },
    );
  };

  return (
    <div className={styles.backdrop} onClick={nope}>
      <div
        className={`${styles.popup} lift`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={win} className={`${styles.window} px-frame`}>
          <div className={`${styles.title} pixel`}>
            <span>⚠ onA.exe</span>
            <button type="button" className={styles.x} aria-label="try to close the pop-up" onClick={nope} data-sfx="none">
              ×
            </button>
          </div>
          <div className={styles.body}>
            <Pixel name={text.sprite} size={4} color="var(--pink-ink)" className={styles.sprite} />
            <div>
              <p id="popup-title" className={`${styles.big} pixel`}>
                {text.big}
              </p>
              <p id="popup-text" className={styles.small}>
                {text.small}
              </p>
            </div>
          </div>
          <div className={styles.buttons}>
            <button ref={ok} type="button" className={`${styles.btn} pixel`} onClick={onClose} data-sfx="blip">
              {text.ok}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
