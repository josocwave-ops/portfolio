"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Pixel from "./Pixel";
import { ICONS, ICON_COLOURS, type IconName } from "./poemIcons";
import win from "./NoteWindow.module.css";
import styles from "./PoemDesktop.module.css";

// The writing section as a little pixel computer: a pastel monitor whose
// screen shows a video-game sky, a desktop of little .txt poem files, sticky notes for the shortest poems, and a taskbar with a start
// button and a clock. The first visit opens readme.txt; clicking a file opens
// its poem in a pop-up window over the page, which scrolls inside itself.
export type DeskPoem = { slug: string; title: string; year?: string; text: string };

// TODO(Ona): these readme words are a first draft; rewrite them in your own voice
const README = {
  hello: "hi, welcome to my poems <3",
  lines: ["each file is a poem. click one to open it.", "take your time."],
  ok: "ok, let me read ✿",
};

const SEEN_README = "ona-poems-readme";
// the tiny poems that sit on the desktop as sticky notes instead of files
const STICKY = new Set(["no-particular-reason", "i-wont-i-wont"]);
const isShort = (p: DeskPoem) => STICKY.has(p.slug);

export default function PoemDesktop({ poems, initial }: { poems: DeskPoem[]; initial?: string }) {
  const [open, setOpen] = useState<string | null>(initial ?? null);
  const [readme, setReadme] = useState(false);
  const [mounted, setMounted] = useState(false);
  const files = useRef<Record<string, HTMLButtonElement | null>>({});
  const body = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const at = poems.findIndex((p) => p.slug === open);
  const poem = at >= 0 ? poems[at] : null;
  const go = (step: number) => setOpen(poems[(at + step + poems.length) % poems.length].slug);
  const fileList = poems.filter((p) => !isShort(p));
  const notes = poems.filter(isShort);

  // first visit this session (and not arriving at one poem's own address):
  // the readme pops up before anything else
  useEffect(() => {
    setMounted(true);
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_README) === "1";
    } catch {}
    if (!seen && !initial) setReadme(true);
  }, [initial]);

  const closeReadme = () => {
    setReadme(false);
    try {
      sessionStorage.setItem(SEEN_README, "1");
    } catch {}
  };

  // a newly opened poem starts at its top, and its window takes the focus
  useEffect(() => {
    if (!open) return;
    body.current?.scrollTo(0, 0);
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        files.current[open]?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    if (open) files.current[open]?.focus({ preventScroll: true });
    setOpen(null);
  };

  return (
    <div className={styles.computer}>
      <div className="lift">
        <div className={`${styles.casing} px-frame`}>
          <div className={styles.screen}>
            <Wallpaper />

            <div className={styles.desk}>
              <ul className={styles.files}>
                <li>
                  <button type="button" className={styles.file} onClick={() => setReadme(true)} data-sfx="tick">
                    <PoemIcon name="readme" />
                    <span className={`${styles.name} pixel`}>readme.txt</span>
                  </button>
                </li>
                {fileList.map((p) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      ref={(el) => {
                        files.current[p.slug] = el;
                      }}
                      className={styles.file}
                      data-open={p.slug === open || undefined}
                      onClick={() => setOpen(p.slug)}
                      data-sfx="tick"
                    >
                      <PoemIcon name="txt" />
                      <span className={`${styles.name} pixel`}>{p.title}.txt</span>
                    </button>
                  </li>
                ))}
              </ul>

              {notes.length > 0 && (
                <div className={styles.notes}>
                  {notes.map((p, i) => (
                    <button
                      key={p.slug}
                      type="button"
                      ref={(el) => {
                        files.current[p.slug] = el;
                      }}
                      className={styles.sticky}
                      style={{ "--tilt": i % 2 ? "2deg" : "-2.5deg" } as React.CSSProperties}
                      onClick={() => setOpen(p.slug)}
                      data-sfx="tick"
                    >
                      <span className={`${styles.stickyTitle} pixel`}>{p.title}</span>
                      <span className={styles.stickyText}>{p.text.replace(/\n\s*\n/g, "\n")}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`${styles.taskbar} pixel`}>
              <button type="button" className={styles.start} onClick={() => setReadme(true)} data-sfx="blip">
                <Pixel name="sparkle" size={1} color="var(--pink-ink)" /> start
              </button>
              {poem && (
                <button type="button" className={styles.task} onClick={() => closeBtn.current?.focus()}>
                  {poem.title}.txt
                </button>
              )}
              <Clock />
            </div>

            {readme && (
              <div className={styles.readmeShade}>
                <div className={`${win.wrap} lift ${styles.readme}`} role="dialog" aria-label="readme">
                  <div className={`${win.note} px-frame`}>
                    <div className={`${win.bar} pixel`}>
                      <span className={win.title}>readme.txt</span>
                      <span className={win.dots} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                    <div className={styles.readmeBody}>
                      <PoemIcon name="readme" size={4} />
                      <p className={`${styles.readmeHello} pixel`}>{README.hello}</p>
                      {README.lines.map((l) => (
                        <p key={l}>{l}</p>
                      ))}
                      <button type="button" className={`${styles.ok} pixel`} onClick={closeReadme} data-sfx="ding" autoFocus>
                        {README.ok}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.chin} aria-hidden="true">
            <span className={`${styles.brand} pixel`}>onA</span>
            <span className={styles.vents} />
            <span className={styles.led} />
          </div>
        </div>
      </div>
      <div className={styles.stand} aria-hidden="true">
        <span className={styles.neck} />
        <span className={styles.base} />
      </div>

      {mounted &&
        poem &&
        createPortal(
          <div className={styles.shade} onClick={close}>
            <div
              className={`${win.wrap} lift ${styles.reader}`}
              role="dialog"
              aria-modal="true"
              aria-label={poem.title}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${win.note} px-frame ${styles.frame}`}>
                <div className={`${win.bar} pixel`}>
                  <span className={win.title}>{poem.title}.txt</span>
                  <span className={win.dots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <button ref={closeBtn} type="button" className={styles.x} onClick={close} aria-label="close the poem">
                    ×
                  </button>
                </div>
                <div ref={body} className={styles.body}>
                  <h2 className={`${styles.title} pixel`}>{poem.title}</h2>
                  {poem.year && <p className={`${styles.year} pixel`}>{poem.year}</p>}
                  <div className={styles.text}>{poem.text}</div>
                </div>
                <div className={`${styles.foot} pixel`}>
                  <button type="button" onClick={() => go(-1)}>
                    ← previous
                  </button>
                  <span>
                    {at + 1} of {poems.length}
                  </span>
                  <button type="button" onClick={() => go(1)}>
                    next →
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

// one of the little multi-colour icons from poemIcons.ts
function PoemIcon({ name, size = 3 }: { name: IconName; size?: number }) {
  const rows = ICONS[name];
  const w = Math.max(...rows.map((r) => r.length));
  const cells: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const k = row[x];
      let n = 1;
      while (row[x + n] === k) n++;
      if (k !== ".") cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={n} height={1} fill={ICON_COLOURS[k]} />);
      x += n;
    }
  });
  return (
    <svg
      className={styles.icon}
      viewBox={`0 0 ${w} ${rows.length}`}
      width={w * size}
      height={rows.length * size}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {cells}
    </svg>
  );
}

// the screen's wallpaper: a sky in hard pixel bands, clouds, stars and a
// moon, with stepped hills along the bottom, like an old game's title screen
function Wallpaper() {
  // stepped hills: two rows of blocks following gentle waves
  const back: React.ReactNode[] = [];
  const front: React.ReactNode[] = [];
  for (let x = 0; x < 80; x++) {
    const hb = Math.round(5 + 3 * Math.sin(x / 7) + 1.5 * Math.sin(x / 3.1));
    const hf = Math.round(3 + 2.2 * Math.sin(x / 5 + 2) + Math.sin(x / 2.3));
    back.push(<rect key={`b${x}`} x={x} y={16 - hb} width={1} height={hb} />);
    front.push(<rect key={`f${x}`} x={x} y={16 - hf} width={1} height={hf} />);
  }
  return (
    <div className={styles.wallpaper} aria-hidden="true">
      <Pixel name="moon" size={3} color="var(--paper)" className={styles.moon} />
      <Pixel name="cloud" size={3} color="var(--paper)" className={styles.cloudA} />
      <Pixel name="cloud" size={2} color="var(--paper)" className={styles.cloudB} />
      <Pixel name="sparkle" size={2} color="var(--paper)" twinkle className={styles.starA} />
      <Pixel name="sparkle" size={1} color="var(--paper)" twinkle className={styles.starB} />
      <Pixel name="star8" size={1} color="var(--paper)" twinkle className={styles.starC} />
      <svg className={styles.hills} viewBox="0 0 80 16" preserveAspectRatio="none" shapeRendering="crispEdges">
        <g fill="color-mix(in srgb, var(--peri) 55%, var(--mist))">{back}</g>
        <g fill="var(--peri)">{front}</g>
      </svg>
    </div>
  );
}

// the taskbar clock (filled in after the page loads, so it shows your time)
function Clock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className={styles.clock}>{now}</span>;
}
