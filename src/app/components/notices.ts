"use client";

// Little notices that slide up in the bottom-left corner (see Toasts.tsx),
// and the achievements visitors can collect. Anything on the site can call
// notify() or unlock(); Toasts.tsx listens and draws them.
// TODO(Ona): all the words here are drafts; change them to your own.

import { useMemo, useSyncExternalStore } from "react";
import type { SpriteName } from "./Pixel";

export type Notice = { kind: "signin"; name: string } | { kind: "chat"; text: string } | { kind: "achievement"; title: string; text: string };

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
// The badge case (BadgeCase.tsx) shows them all: the ones you've found, and a
// hint for each one you haven't. "secret" ones stay a mystery until found.

export const ACHIEVEMENTS = {
  clicker: {
    title: "curious clicker",
    text: "you pressed a button you weren't supposed to :p",
    hint: "some buttons on the homepage look very pressable…",
    sprite: "arrow",
  },
  explorer: {
    title: "explorer",
    text: "you opened all four folders ✦",
    hint: "peek inside every folder",
    sprite: "key",
  },
  dragonfly: {
    title: "dragonfly friend",
    text: "you said hi to the dragonfly <3",
    hint: "someone small is buzzing about the homepage",
    sprite: "dragonfly",
  },
  music: {
    title: "music lover",
    text: "you pressed play ♫",
    hint: "there's a song waiting somewhere",
    sprite: "note",
  },
  stillhere: {
    title: "still here!",
    text: "you came back from your break ☁",
    hint: "wander off for a little while, then come back",
    sprite: "cloud",
  },
  collector: {
    title: "collector",
    text: "you found every single badge. you're the best <3",
    hint: "a secret one… find all the others first",
    sprite: "crown",
    secret: true,
  },
} as const satisfies Record<
  string,
  {
    title: string;
    text: string;
    hint: string;
    sprite: SpriteName;
    secret?: boolean;
  }
>;

export type AchievementId = keyof typeof ACHIEVEMENTS;
export const ACHIEVEMENT_IDS = Object.keys(ACHIEVEMENTS) as AchievementId[];

const GOT = "onA-achievements"; // ids, in the order they were found
const WHEN = "onA-achievements-when"; // id → when it was found (ms)
const SEEN = "onA-achievements-seen"; // ids already shown in the badge case
const AREAS = "onA-areas-seen";
const CHANGED = "onA-achievements-changed";
const OPEN_CASE = "onA-open-badge-case";

function read<T>(key: string, empty: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? empty;
  } catch {
    return empty;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function unlock(id: AchievementId) {
  const got = read<string[]>(GOT, []);
  if (got.includes(id)) return;
  write(GOT, [...got, id]);
  write(WHEN, { ...read<Record<string, number>>(WHEN, {}), [id]: Date.now() });
  window.dispatchEvent(new Event(CHANGED));
  const { title, text } = ACHIEVEMENTS[id];
  notify({ kind: "achievement", title, text });
  // the secret one: every other badge found
  const now = read<string[]>(GOT, []);
  if (ACHIEVEMENT_IDS.every((a) => a === "collector" || now.includes(a))) unlock("collector");
}

// called when a visitor opens one of the four areas
export function sawArea(area: string, all: string[]) {
  const seen = read<string[]>(AREAS, []);
  if (!seen.includes(area)) write(AREAS, [...seen, area]);
  const now = read<string[]>(AREAS, []);
  if (all.every((a) => now.includes(a))) unlock("explorer");
}

// ---- reading them back, for the badge case and its footer button ----

export type Found = {
  got: Partial<Record<AchievementId, number | null>>;
  seen: AchievementId[];
};

// The raw saved text, so React can tell cheaply whether anything changed.
function snapshot() {
  try {
    return [GOT, WHEN, SEEN].map((k) => localStorage.getItem(k) ?? "").join("\u0000");
  } catch {
    return "";
  }
}

function subscribe(fn: () => void) {
  window.addEventListener(CHANGED, fn);
  window.addEventListener("storage", fn); // other tabs
  return () => {
    window.removeEventListener(CHANGED, fn);
    window.removeEventListener("storage", fn);
  };
}

export function useFound(): Found {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  return useMemo(() => {
    if (!raw) return { got: {}, seen: [] };
    const when = read<Record<string, number>>(WHEN, {});
    const got: Found["got"] = {};
    // badges found before dates were saved have no date
    for (const id of read<string[]>(GOT, [])) if (id in ACHIEVEMENTS) got[id as AchievementId] = when[id] ?? null;
    return { got, seen: read<AchievementId[]>(SEEN, []) };
  }, [raw]);
}

// the badge case calls this once it has shown the new ones
export function markSeen(ids: AchievementId[]) {
  write(SEEN, ids);
  window.dispatchEvent(new Event(CHANGED));
}

export function openBadgeCase() {
  window.dispatchEvent(new Event(OPEN_CASE));
}

export function onOpenBadgeCase(fn: () => void) {
  window.addEventListener(OPEN_CASE, fn);
  return () => window.removeEventListener(OPEN_CASE, fn);
}
