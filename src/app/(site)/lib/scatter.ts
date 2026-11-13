// Deterministic "hand-placed" variation: the same key always gives the same tilt and tear,
// so pages render identically on the server and in the browser and don't jump between visits.

export function rng(key: string | number) {
  let h = 2166136261;
  for (const ch of String(key)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** A tilt in degrees between -max and max, never quite straight. */
export function tilt(key: string | number, max = 3) {
  const r = rng(`tilt${key}`)();
  const t = (r * 2 - 1) * max;
  return Math.abs(t) < 0.4 ? t + Math.sign(t || 1) * 0.6 : t;
}

/** A torn / deckled edge as a clip-path. Bites only inward, so nothing spills outside the box. */
export function torn(key: string | number, amp = 3, steps = 26) {
  const R = rng(`tear${key}`);
  const pts: string[] = [];
  let drift = 0;
  const bite = () => {
    drift = drift * 0.55 + (R() - 0.5) * amp * 1.3;
    return (Math.abs(drift) + R() * amp * 0.35).toFixed(1);
  };
  for (let i = 0; i < steps; i++) pts.push(`${((i / steps) * 100).toFixed(2)}% ${bite()}px`);
  for (let i = 0; i < steps; i++) pts.push(`calc(100% - ${bite()}px) ${((i / steps) * 100).toFixed(2)}%`);
  for (let i = 0; i < steps; i++) pts.push(`${(100 - (i / steps) * 100).toFixed(2)}% calc(100% - ${bite()}px)`);
  for (let i = 0; i < steps; i++) pts.push(`${bite()}px ${(100 - (i / steps) * 100).toFixed(2)}%`);
  return `polygon(${pts.join(",")})`;
}

const TAPES = ["rgba(211,163,185,0.62)", "rgba(140,192,184,0.6)", "rgba(184,166,208,0.62)", "rgba(217,184,115,0.55)"];
export const tapeColour = (key: string | number) => TAPES[Math.floor(rng(`tape${key}`)() * TAPES.length)];
