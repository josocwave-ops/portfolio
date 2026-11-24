"use client";

// Little notices that slide up in the bottom-left corner (see Toasts.tsx),
// and the achievements visitors can collect. Anything on the site can call
// notify() or unlock(); Toasts.tsx listens and draws them.
// TODO(Ona): all the words here are drafts; change them to your own.

export type Notice =
  | { kind: "signin"; name: string }
  | { kind: "chat"; text: string }
  | { kind: "achievement"; title: string; text: string };

// notices sent before the corner is ready (e.g. while a page is still
// loading) wait here and show as soon as it starts listening
let listener: ((n: Notice) => void) | null = null;
const waiting: Notice[] = [];

export function notify(n: Notice) {
  if (listener) listener(n);
  else waiting.push(n);
}

export function onNotice(fn: (n: Notice) => void) {
  listener = fn;
  waiting.splice(0).forEach(fn);
  return () => {
    if (listener === fn) listener = null;
  };
}

// ---- achievements: each one shows once per visitor (remembered in their browser) ----

export const ACHIEVEMENTS = {
  clicker: { title: "curious clicker", text: "you pressed a button you weren't supposed to :p" },
  explorer: { title: "explorer", text: "you opened all four folders ✦" },
  dragonfly: { title: "dragonfly friend", text: "you said hi to the dragonfly <3" },
  music: { title: "music lover", text: "you pressed play ♫" },
  stillhere: { title: "still here!", text: "you came back from your break ☁" },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

const GOT = "onA-achievements";
const AREAS = "onA-areas-seen";

function read(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function write(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export function unlock(id: AchievementId) {
  const got = read(GOT);
  if (got.includes(id)) return;
  write(GOT, [...got, id]);
  notify({ kind: "achievement", ...ACHIEVEMENTS[id] });
}

// called when a visitor opens one of the four areas
export function sawArea(area: string, all: string[]) {
  const seen = read(AREAS);
  if (!seen.includes(area)) write(AREAS, [...seen, area]);
  const now = read(AREAS);
  if (all.every((a) => now.includes(a))) unlock("explorer");
}
