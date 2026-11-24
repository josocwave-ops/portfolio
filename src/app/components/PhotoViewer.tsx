"use client";

import { useState } from "react";
import styles from "./PhotoViewer.module.css";

// An old picture viewer for a project's photos: one big photo, ◀ prev and
// next ▶ (with a blip), a "2 of 5" counter and a row of thumbnails. The
// left/right arrow keys work too once you've clicked into it. The photos are
// drawn on the server and handed in as `slides` and `thumbs`.
export default function PhotoViewer({ slides, thumbs, name }: { slides: React.ReactNode[]; thumbs: React.ReactNode[]; name: string }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

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
      <div className={styles.stage}>
        {slides.map((s, k) => (
          <div key={k} className={styles.slide} hidden={k !== i} aria-hidden={k !== i}>
            {s}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <div className={`${styles.controls} pixel`}>
            <button type="button" onClick={() => go(-1)} data-sfx="blip">
              ◀ prev
            </button>
            <span className={styles.count} aria-live="polite">
              {i + 1} of {n}
            </span>
            <button type="button" onClick={() => go(1)} data-sfx="blip">
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
                onClick={() => setI(k)}
                data-sfx="tick"
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
