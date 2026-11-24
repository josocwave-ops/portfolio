"use client";

import { useCallback, useState } from "react";
import Pixel from "./Pixel";
import Popup, { type PopupText } from "./Popup";
import { isOn, play } from "./Sounds";
import { unlock } from "./notices";
import styles from "./WindowBar.module.css";

// The pink window bar along the very top of every page, with three little
// buttons, like an old computer window. Each one opens its own cute pop-up
// instead of doing what it normally would, and a "← click me!" bobs next to
// them so people find them.
// TODO(Ona): the pop-up words are drafts; change them to your own.

const POPUPS: (PopupText & { label: string })[] = [
  {
    label: "close the window",
    big: "wait! you can’t leave yet :(",
    small: "there’s still so much to look at. stay a little longer? <3",
    ok: "okay, i’ll stay <3",
    sprite: "fairy",
  },
  {
    label: "make the window small",
    big: "no hiding me! :p",
    small: "this page likes being looked at <3",
    ok: "okay, okay <3",
    sprite: "bow",
  },
  {
    label: "make the window big",
    big: "this is as big as i get <3",
    small: "but there’s plenty more to scroll through below ✦",
    ok: "fair enough ✦",
    sprite: "star8",
  },
];

const DOTS = [styles.one, styles.two, styles.three];

export default function WindowBar() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div className={styles.bar}>
        {POPUPS.map((pop, i) => (
          <button
            key={pop.label}
            type="button"
            className={`${styles.dot} ${DOTS[i]}`}
            aria-label={pop.label}
            data-sfx="none"
            onClick={() => {
              setOpen(i);
              if (isOn()) play("ding");
              unlock("clicker");
            }}
          />
        ))}
        <span className={`${styles.hint} pixel`} aria-hidden="true">
          <Pixel name="arrow" size={2} color="var(--pink-ink)" />
          click me!
        </span>
      </div>

      {open !== null && <Popup text={POPUPS[open]} onClose={close} />}
    </>
  );
}
