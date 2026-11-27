"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cute from "./Cute";
import Divider from "./Divider";
import Pixel from "./Pixel";
import { isOn, play } from "./Sounds";
import { ACHIEVEMENT_IDS, ACHIEVEMENTS, markSeen, onOpenBadgeCase, openBadgeCase, useFound, type AchievementId } from "./notices";
import styles from "./BadgeCase.module.css";

// The badge case: a window listing every achievement. Found ones show their
// sprite, words and the day you found them; the rest show a hint. Opened by
// the footer button below, or from an achievement notice. Mounted once in the
// layout.

const TINT: Record<AchievementId, string> = {
  clicker: "var(--pink)",
  explorer: "var(--ice)",
  dragonfly: "var(--mist)",
  music: "var(--lilac)",
  stillhere: "var(--ice)",
  collector: "var(--pink)",
};

function day(ms: number | null) {
  if (ms === null) return "found a while ago";
  return `found ${new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

export default function BadgeCase() {
  const [open, setOpen] = useState(false);
  // the badges that were new when the case opened keep their "new!" until it closes
  const [fresh, setFresh] = useState<AchievementId[]>([]);
  const { got, seen } = useFound();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);

  useEffect(
    () =>
      onOpenBadgeCase(() => {
        opener.current = document.activeElement;
        setOpen(true);
      }),
    [],
  );

  // on opening: note which badges are new, then remember they've been seen
  useEffect(() => {
    if (!open) return;
    const found = ACHIEVEMENT_IDS.filter((id) => id in got);
    setFresh(found.filter((id) => !seen.includes(id)));
    markSeen(found);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // only when it opens, not each time a badge comes in while it's open
  }, [open, close]);

  if (!open) return null;

  const count = ACHIEVEMENT_IDS.filter((id) => id in got).length;
  const total = ACHIEVEMENT_IDS.length;

  return (
    <div className={styles.backdrop} onClick={close}>
      <div className={`${styles.case} lift`} role="dialog" aria-modal="true" aria-labelledby="badge-case-title" onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.window} px-frame`}>
          <div className={`${styles.bar} pixel`}>
            <span id="badge-case-title">✦ badge case</span>
            <span className={styles.meta}>
              {count} of {total}
            </span>
            <button ref={closeBtn} type="button" className={styles.x} aria-label="close the badge case" onClick={close} data-sfx="pop">
              ×
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.top}>
              <p className={styles.intro}>
                <Cute text="everything you've found so far :)" />
              </p>
              <div className={styles.hearts} aria-label={`${count} of ${total} badges found`} role="img">
                {ACHIEVEMENT_IDS.map((id, i) => (
                  <Pixel key={id} name="heart" size={2} className={i < count ? styles.full : styles.empty} />
                ))}
              </div>
            </div>

            <Divider kind="flowers" className={styles.flowers} />

            <ul className={styles.grid}>
              {ACHIEVEMENT_IDS.map((id) => {
                const a = ACHIEVEMENTS[id];
                const has = id in got;
                const secret = "secret" in a && a.secret;
                return (
                  <li key={id} className={`${styles.slot} ${has ? styles.has : styles.locked} px-frame`}>
                    <span className={styles.icon} style={{ "--tint": TINT[id] } as React.CSSProperties}>
                      {has || !secret ? (
                        <Pixel name={a.sprite} size={3} />
                      ) : (
                        <span className={`${styles.q} pixel`} aria-hidden="true">
                          ?
                        </span>
                      )}
                    </span>
                    <span className={styles.words}>
                      <b className="pixel">{has ? a.title : secret ? "??? (secret)" : "???"}</b>
                      <span className={styles.text}>
                        <Cute text={has ? a.text : a.hint} />
                      </span>
                      {has && <span className={styles.when}>{day(got[id] ?? null)}</span>}
                    </span>
                    {has && fresh.includes(id) && <span className={`${styles.new} pixel`}>new!</span>}
                  </li>
                );
              })}
            </ul>

            <p className={styles.foot}>
              <Cute
                text={
                  count === total
                    ? "all found! thank you for exploring <3"
                    : count === 0
                      ? "nothing yet… go have a look around ✦"
                      : `${total - count} still hiding ✦`
                }
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// "badges: ♥♥♥♡♡♡" in the header status, under ona's mood; click it to open
// the case. A heart fills for each badge found, and the new ones blink until
// you've looked.
export function BadgeStatus() {
  const { got, seen } = useFound();
  const count = ACHIEVEMENT_IDS.filter((id) => id in got).length;
  const unseen = ACHIEVEMENT_IDS.filter((id) => id in got && !seen.includes(id)).length;
  return (
    <button
      type="button"
      className={styles.status}
      onClick={() => {
        if (isOn()) play("ding");
        openBadgeCase();
      }}
      data-sfx="none"
      title="see your badges"
      aria-label={`badges: ${count} of ${ACHIEVEMENT_IDS.length} found${unseen ? `, ${unseen} new` : ""}. open the badge case`}
    >
      {ACHIEVEMENT_IDS.map((id, i) => (
        <Pixel
          key={id}
          name="heart"
          size={2}
          className={i < count ? (i >= count - unseen ? `${styles.on} ${styles.blink}` : styles.on) : styles.off}
        />
      ))}
    </button>
  );
}
