"use client";

import { useState } from "react";
import { isOn, play } from "./Sounds";
import styles from "./PhotoViewer.module.css";

// An old picture viewer for a project's photos: one big photo, ◀ prev and
// next ▶, a "2 of 5" counter and a row of thumbnails. Every change of photo
// makes an old-camera click and a quick white flash. The
// left/right arrow keys work too once you've clicked into it. The photos are
// drawn on the server and handed in as `slides` and `thumbs`. The photo area
// takes each photo's own shape (`ratios`, width / height), so tall and wide
// photos both fill it without being cropped or boxed in.
export default function PhotoViewer({
  slides,
  thumbs,
  ratios,
  name,
}: {
  slides: React.ReactNode[];
  thumbs: React.ReactNode[];
  ratios?: number[];
  name: string;
}) {
  const [i, setI] = useState(0);
  const [flash, setFlash] = useState(0);
  const n = slides.length;
  const show = (k: number) => {
    if (k === i) return;
    setI(k);
    setFlash((f) => f + 1);
    if (isOn()) play("shutter");
  };
  const go = (d: number) => show((i + d + n) % n);

  return (
    <div
      className={styles.viewer}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      role="group"
      aria-roledescription="photo viewer"
      aria-label={`${name}, photos`}
    >
      <div className={styles.stage} style={ratios?.[i] ? ({ "--r": ratios[i] } as React.CSSProperties) : undefined}>
        {slides.map((s, k) => (
          <div key={k} className={styles.slide} hidden={k !== i} aria-hidden={k !== i}>
            {s}
          </div>
        ))}
        {/* a new key each time restarts the flash animation */}
        {flash > 0 && <span key={flash} className={styles.flash} aria-hidden="true" />}
      </div>

      {n > 1 && (
        <>
          <div className={`${styles.controls} pixel`}>
            <button type="button" onClick={() => go(-1)} data-sfx="none">
              ◀ prev
            </button>
            <span className={styles.count} aria-live="polite">
              {i + 1} of {n}
            </span>
            <button type="button" onClick={() => go(1)} data-sfx="none">
              next ▶
            </button>
          </div>
          <div className={styles.thumbs}>
            {thumbs.map((t, k) => (
              <button
                key={k}
                type="button"
                className={styles.thumb}
                aria-current={k === i ? "true" : undefined}
                aria-label={`photo ${k + 1}`}
                onClick={() => show(k)}
                data-sfx="none"
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
