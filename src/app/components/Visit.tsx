"use client";

import { useCallback, useEffect, useState } from "react";
import Popup from "./Popup";
import { notify, unlock } from "./notices";

// The little moments of a visit, each at most once per visit:
//   - "<your visitor name> has signed in ✦" a couple of seconds after you
//     arrive; every visit gets a cute made-up name, like "stargazer_27"
//   - a tiny chat from ona after about a minute of looking around
//   - "are you still there? ☁" if you sit still for two minutes
// It lives in the layout, so it keeps counting as you move between pages.
// TODO(Ona): the words are drafts; change them to your own.

const CHAT = "thanks for looking around :) let me know what you think <3";
const SIGNIN_AFTER = 2500;
const CHAT_AFTER = 60_000;
const IDLE_AFTER = 120_000;

// the made-up visitor names: a cute word and a number
const NAMES = ["stargazer", "moonmoth", "petal", "fairydust", "dewdrop", "daydreamer", "lilypad", "pixie", "teacup", "bluebell", "clayfriend", "glitterbug"];

function visitorName() {
  try {
    const saved = sessionStorage.getItem("onA-visitor");
    if (saved) return saved;
  } catch {}
  const name = `${NAMES[Math.floor(Math.random() * NAMES.length)]}_${10 + Math.floor(Math.random() * 90)}`;
  try {
    sessionStorage.setItem("onA-visitor", name);
  } catch {}
  return name;
}

function once(key: string) {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
  } catch {}
  return true;
}

function visitStart() {
  try {
    const saved = Number(sessionStorage.getItem("onA-visit-start"));
    if (saved) return saved;
    sessionStorage.setItem("onA-visit-start", String(Date.now()));
  } catch {}
  return Date.now();
}

export default function Visit() {
  const [idle, setIdle] = useState(false);
  const close = useCallback(() => {
    setIdle(false);
    unlock("stillhere");
  }, []);

  // signed in, then the chat
  useEffect(() => {
    const start = visitStart();
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        if (once("onA-signed-in")) notify({ kind: "signin", name: visitorName() });
      }, Math.max(0, SIGNIN_AFTER - (Date.now() - start))),
    );
    timers.push(
      window.setTimeout(() => {
        if (once("onA-chatted")) notify({ kind: "chat", text: CHAT });
      }, Math.max(SIGNIN_AFTER + 4000, CHAT_AFTER - (Date.now() - start))),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // are you still there?
  useEffect(() => {
    let timer = 0;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (once("onA-asked-idle")) setIdle(true);
      }, IDLE_AFTER);
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, []);

  return idle ? (
    <Popup
      text={{
        big: "are you still there? ☁",
        small: "take your time, i'll be right here <3",
        ok: "yes! i'm here <3",
        sprite: "cloud",
      }}
      onClose={close}
    />
  ) : null;
}
