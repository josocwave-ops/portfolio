"use client";

import { useEffect, useState } from "react";
import styles from "./Sounds.module.css";

// Little video-game blips when you click things, like an early-2000s
// personal site. The sounds are synthesised in the browser (no audio files):
//   blip — windows, pins and cards
//   ding — the 88×31 web buttons, and turning sound on
//   pop  — opening the phone menu
//   tick — any other link
//   tap  — a soft little tap, when you click anywhere that isn't a button or link
//   shutter — an old camera click, when the photo viewer changes photo
//   nope    — an old "wrong!" buzz, for the pop-up × that won't close
//   signin  — a messenger chime, when "ona has signed in"
//   message — a little knock-knock, when ona sends a chat
//   achieve — a happy fanfare, for an achievement
//   buzz    — the dragonfly saying hi
// Anything can pick its click sound with data-sfx="blip|ding|pop|tick|none".
// Visitors can turn it off in the footer; the choice is remembered.

type Sfx = "blip" | "ding" | "pop" | "tick" | "tap" | "shutter" | "nope" | "signin" | "message" | "achieve" | "buzz";

const KEY = "onA-sounds";
const VOLUME = 0.05;

let ctx: AudioContext | null = null;

export function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// one note: a quick attack, then a fade
export function note(a: AudioContext, freq: number, at: number, dur: number, type: OscillatorType, vol = 1, slideTo?: number) {
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(VOLUME * vol, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

// a burst of filtered noise: the stuff of camera clicks
function noise(a: AudioContext, at: number, dur: number, vol: number, freq: number, q: number, type: BiquadFilterType = "bandpass") {
  const len = Math.max(1, Math.floor(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const filter = a.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = a.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(VOLUME * vol, at + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(at);
  src.stop(at + dur + 0.02);
}

// Each kind of click has a few variations, all from the same soft (pentatonic)
// scale, so clicking around sounds like a little tune instead of one beep on
// repeat. It never picks the same variation twice in a row.
const TICKS = [1319, 1568, 1760, 2093, 2349];
const TAPS = [523, 587, 659, 784, 880];
const BLIPS: [number, number][] = [
  [988, 1480],
  [880, 1319],
  [1047, 1568],
  [784, 1175],
  [1175, 1760],
  [1319, 1976],
];
const DINGS: [number, number][] = [
  [1568, 2349],
  [1319, 1976],
  [1760, 2637],
];
const last: Record<string, number> = {};
function pick<T>(kind: string, list: T[]): T {
  let i = Math.floor(Math.random() * list.length);
  if (list.length > 1 && i === last[kind]) i = (i + 1) % list.length;
  last[kind] = i;
  return list[i];
}

export function play(sfx: Sfx) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  if (sfx === "tick") note(a, pick("tick", TICKS), t, 0.035, "square", 0.45);
  if (sfx === "tap") note(a, pick("tap", TAPS), t, 0.05, "triangle", 0.5);
  if (sfx === "blip") {
    const [lo, hi] = pick("blip", BLIPS);
    note(a, lo, t, 0.06, "square", 0.6);
    note(a, hi, t + 0.06, 0.09, "square", 0.6);
  }
  if (sfx === "ding") {
    const [lo, hi] = pick("ding", DINGS);
    note(a, lo, t, 0.32, "triangle", 1.2);
    note(a, hi, t + 0.07, 0.42, "triangle", 0.9);
  }
  if (sfx === "pop") note(a, 420, t, 0.09, "sine", 1.4, pick("pop", [880, 980, 1100, 1240]));
  if (sfx === "signin") {
    note(a, 784, t, 0.12, "triangle", 1.1);
    note(a, 1175, t + 0.1, 0.12, "triangle", 1.1);
    note(a, 1568, t + 0.2, 0.3, "triangle", 1);
  }
  if (sfx === "message") {
    note(a, 1319, t, 0.05, "square", 0.5);
    note(a, 1319, t + 0.11, 0.07, "square", 0.5);
  }
  if (sfx === "achieve") {
    [1047, 1319, 1568, 2093].forEach((f, i) => note(a, f, t + i * 0.08, i === 3 ? 0.35 : 0.1, "square", 0.55));
  }
  if (sfx === "buzz") {
    // a tiny wing-flutter: a quick wobble of high notes
    for (let i = 0; i < 6; i++) note(a, i % 2 ? 1760 : 1568, t + i * 0.035, 0.03, "square", 0.35);
  }
  if (sfx === "nope") {
    // two low, buzzy notes going down: "uh-uh"
    note(a, 233, t, 0.13, "square", 0.9);
    note(a, 175, t + 0.14, 0.22, "square", 0.9);
  }
  if (sfx === "shutter") {
    // the two halves of an old shutter: a sharp click, then a softer clack
    noise(a, t, 0.025, 1.6, 4200, 0.8, "highpass");
    noise(a, t + 0.065, 0.045, 1.3, 1800, 1.2);
  }
}

export const isOn = () => {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
};

// listens for clicks anywhere on the page; mounted once in the layout
export default function SoundEffects() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!isOn() || !(e.target instanceof Element)) return;
      const el = e.target.closest<HTMLElement>("[data-sfx], a, summary, button");
      // clicking anywhere else gives a soft little tap
      if (!el) return play("tap");
      const chosen = el.dataset.sfx;
      if (chosen === "none") return;
      const sfx: Sfx =
        chosen === "blip" || chosen === "ding" || chosen === "pop" || chosen === "tick"
          ? chosen
          : el.tagName === "SUMMARY"
            ? "pop"
            : el.querySelector(".lift")
              ? "blip"
              : "tick";
      play(sfx);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

// the "♪ sounds: on / off" switch in the footer
export function SoundToggle() {
  const [on, setOn] = useState(true);
  useEffect(() => setOn(isOn()), []);
  return (
    <button
      type="button"
      className={`${styles.toggle} pixel`}
      aria-pressed={on}
      data-sfx="none"
      onClick={() => {
        const next = !on;
        setOn(next);
        try {
          localStorage.setItem(KEY, next ? "on" : "off");
        } catch {}
        if (next) play("ding");
      }}
    >
      ♪ sounds: {on ? "on" : "off"}
    </button>
  );
}
