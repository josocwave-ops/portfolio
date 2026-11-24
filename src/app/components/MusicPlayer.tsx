"use client";

import { useEffect, useRef, useState } from "react";
import { audio, note } from "./Sounds";
import { unlock } from "./notices";
import styles from "./MusicPlayer.module.css";

// A little music player tucked into the bottom corner of every page, like a
// widget on an old personal site. It plays a soft made-up chiptune, made in
// the browser (no audio file), and never starts on its own. It lives in the
// layout, so the song keeps going as you click between pages. The _ button
// tucks it away into a small ♫ tab; that choice is remembered. On a phone it
// starts tucked. Drag it around by its title bar, like an old desktop window;
// it stays where you put it while you browse.

const TITLE = "rain on the window <3";
// the tune: one melody note every beat, a soft bass note every other beat
const MELODY = [659, 784, 880, 784, 659, 587, 523, 587, 659, 659, 587, 523, 494, 523, 587, 523];
const BASS = [262, 262, 196, 196, 220, 220, 175, 196];
const BEAT = 260; // ms
const KEY = "onA-player";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [bars, setBars] = useState<number[]>(() => Array(8).fill(2));
  const beat = useRef(0);
  const box = useRef<HTMLElement>(null);
  // where it's been dragged to (null = its usual corner)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const drag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as Element).closest("button") || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    const bar = e.currentTarget;
    bar.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      // keep it on screen
      const x = Math.min(Math.max(0, ev.clientX - dx), window.innerWidth - r.width);
      const y = Math.min(Math.max(0, ev.clientY - dy), window.innerHeight - r.height);
      setPos({ x, y });
    };
    const up = () => {
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
      bar.removeEventListener("pointercancel", up);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
    bar.addEventListener("pointercancel", up);
  };

  useEffect(() => {
    // on a phone it starts tucked away, so it doesn't cover the page
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    setTucked(saved ? saved === "tucked" : window.matchMedia("(max-width: 640px)").matches);
  }, []);

  useEffect(() => {
    if (!playing) {
      setBars(Array(8).fill(2));
      return;
    }
    const tick = () => {
      const a = audio();
      if (!a) return;
      const t = a.currentTime;
      const b = beat.current++;
      note(a, MELODY[b % MELODY.length], t, 0.22, "square", 0.35);
      if (b % 2 === 0) note(a, BASS[(b / 2) % BASS.length] / 2, t, 0.4, "triangle", 0.9);
      setBars((old) => old.map(() => 2 + Math.floor(Math.random() * 7) * 2));
    };
    tick();
    const id = window.setInterval(tick, BEAT);
    return () => window.clearInterval(id);
  }, [playing]);

  const tuck = (v: boolean) => {
    setTucked(v);
    try {
      localStorage.setItem(KEY, v ? "tucked" : "open");
    } catch {}
  };

  if (tucked) {
    return (
      <button type="button" className={`${styles.tab} pixel`} onClick={() => tuck(false)} data-sfx="pop" aria-label="open the music player">
        ♫{playing && <span className={styles.dot} aria-hidden="true" />}
      </button>
    );
  }

  return (
    <aside
      ref={box}
      className={`${styles.player} lift hover-lift`}
      aria-label="music player"
      style={pos ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : undefined}
    >
      <div className={`${styles.inner} px-frame`}>
        <div className={`${styles.bar} pixel`} onPointerDown={drag} title="drag me around">
          <span className={styles.title}>♫ now playing</span>
          <button type="button" className={styles.min} onClick={() => tuck(true)} data-sfx="pop" aria-label="tuck the music player away">
            _
          </button>
        </div>
        <div className={styles.body}>
          <button
            type="button"
            className={`${styles.play} pixel`}
            onClick={() => {
              setPlaying((p) => !p);
              unlock("music");
            }}
            data-sfx="none"
            aria-pressed={playing}
            aria-label={playing ? "pause" : "play"}
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <span className={styles.song}>
            <span className={`${styles.name} pixel`}>{TITLE}</span>
            <span className={styles.eq} aria-hidden="true">
              {bars.map((h, i) => (
                <i key={i} style={{ height: h }} />
              ))}
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}
