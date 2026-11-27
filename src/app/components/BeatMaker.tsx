"use client";

import { useEffect, useRef, useState } from "react";
import { unlock } from "./notices";
import { audio, noise, note, useSoundOn } from "./Sounds";
import styles from "./BeatMaker.module.css";

// A tiny beat maker tucked into the bottom corner of every page. Closed, it's
// just a small ♫ tab; click it and a little grid pops up: click squares to
// make a loop (kick, clap, bass, bell), then press play. Every note comes from
// the same scale, so whatever you make stays in tune. The sounds are made in
// the browser (no audio files) and it never starts on its own. It lives in the
// layout, so the beat keeps going as you click between pages, and the tab
// blinks while it plays. Your pattern is remembered. It disappears (and stops)
// when sounds are turned off in the footer.

const ROWS = [
  { icon: "✿", name: "kick" },
  { icon: "✦", name: "clap" },
  { icon: "♪", name: "bass" },
  { icon: "♫", name: "bell" },
];
const STEPS = 8;
const STEP_MS = 200;
// the notes the bass and bell play on each step
const BASSLINE = [48, 48, 55, 55, 53, 53, 52, 52];
const BELLS = [84, 88, 91, 88, 86, 91, 93, 91];
// the pattern it starts with
const START = [
  [1, 0, 0, 0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0],
];
const KEY = "onA-beat";

// a MIDI note number to a pitch (69 = the A above middle C)
const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);

function hit(row: number, step: number) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  if (row === 0) note(a, 170, t, 0.2, "sine", 4, 45);
  if (row === 1) noise(a, t, 0.09, 1.8, 1500, 0.9);
  if (row === 2) note(a, hz(BASSLINE[step]), t, 0.18, "triangle", 1.8);
  if (row === 3) note(a, hz(BELLS[step]), t, 0.12, "square", 0.4);
}

function load(): number[][] {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (Array.isArray(saved) && saved.length === ROWS.length && saved.every((r) => Array.isArray(r) && r.length === STEPS)) {
      return saved.map((r: unknown[]) => r.map((v) => (v ? 1 : 0)));
    }
  } catch {}
  return START;
}

export default function BeatMaker() {
  const soundOn = useSoundOn();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [grid, setGrid] = useState(START);
  const [step, setStep] = useState(-1);
  const gridRef = useRef(grid);

  useEffect(() => setGrid(load()), []);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // sounds off in the footer: stop the beat
  useEffect(() => {
    if (!soundOn) setPlaying(false);
  }, [soundOn]);

  useEffect(() => {
    if (!playing) {
      setStep(-1);
      return;
    }
    let s = 0;
    const tick = () => {
      gridRef.current.forEach((row, r) => row[s] && hit(r, s));
      setStep(s);
      s = (s + 1) % STEPS;
    };
    tick();
    const id = window.setInterval(tick, STEP_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  // Escape tucks it away
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const save = (next: number[][]) => {
    setGrid(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const toggle = (r: number, s: number) => {
    // switching a square on while it's stopped plays that sound, so you can hear it
    if (!playing && !grid[r][s]) hit(r, s);
    save(grid.map((row, i) => (i === r ? row.map((v, j) => (j === s ? 1 - v : v)) : row)));
  };

  if (!soundOn) return null;

  return (
    <div className={styles.corner}>
      {open && (
        <aside className={`${styles.pop} lift hover-lift`} id="beat-maker" aria-label="beat maker">
          <div className={`${styles.inner} px-frame`}>
            <div className={`${styles.bar} pixel`}>
              <span className={styles.title}>♪ make a beat</span>
              <button type="button" className={styles.min} onClick={() => setOpen(false)} data-sfx="pop" aria-label="tuck the beat maker away">
                _
              </button>
            </div>
            <div className={styles.body}>
              <div className={styles.grid}>
                {ROWS.map((row, r) => (
                  <div key={row.name} className={styles.row}>
                    <span className={`${styles.icon} pixel`} title={row.name} aria-hidden="true">
                      {row.icon}
                    </span>
                    {grid[r].map((on, s) => (
                      <button
                        key={s}
                        type="button"
                        data-sfx="none"
                        className={`${styles.cell} ${on ? styles.on : ""} ${s === step ? styles.now : ""}`}
                        onClick={() => toggle(r, s)}
                        aria-pressed={!!on}
                        aria-label={`${row.name}, step ${s + 1}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={`${styles.play} pixel`}
                  onClick={() => {
                    setPlaying((p) => !p);
                    unlock("music");
                  }}
                  data-sfx="none"
                  aria-pressed={playing}
                  aria-label={playing ? "stop" : "play"}
                >
                  {playing ? "❚❚" : "▶"}
                </button>
                <button type="button" className={`${styles.text} pixel`} data-sfx="none" onClick={() => save(START.map((r) => r.map(() => 0)))}>
                  clear
                </button>
                <button type="button" className={`${styles.text} pixel`} data-sfx="none" onClick={() => save(START)}>
                  reset
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
      <button
        type="button"
        className={`${styles.tab} pixel`}
        onClick={() => setOpen((o) => !o)}
        data-sfx="pop"
        aria-expanded={open}
        aria-controls="beat-maker"
        aria-label={open ? "tuck the beat maker away" : "open the beat maker"}
      >
        ♫{playing && <span className={styles.dot} aria-hidden="true" />}
      </button>
    </div>
  );
}
