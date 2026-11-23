import { site } from "@/content/work";
import Pixel, { type SpriteName } from "./Pixel";
import styles from "./Background.module.css";

// Decorative page backgrounds, taken from the Pinterest board.
// Everything is deterministic (seeded), so it renders on the server with no JS.
export type BackgroundKind =
  | "plain"
  | "flourish" // dot-matrix Victorian corner flourishes (public/decor/flourish.svg)
  | "ascii-lily" // a pink text-mode lily (public/decor/lily-ascii.svg)
  | "ascii-garden" // text-mode tulips, daisies and bluebells around the edges (public/decor/*-ascii.svg)
  | "stitch-lily" // cross-stitch lilies growing in from the edges (public/decor/lily-stitch.svg)
  | "halftone" // halftone dots in two corners (public/decor/halftone.svg)
  | "chrome" // "my virtual garden": chrome stars and a bead chain (public/decor/garden.svg)
  | "cropmarks" // little printer's crop marks in the four corners
  | "lace" // dotted rose-curve flowers
  | "sparkles"
  | "stickers"
  | "flowers"; // tiny pixel flowers in the margins

// the drawings in public/decor are made by scripts/decor.mjs

function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- dot-matrix lilies, like the pink dotted flowers on the board --------

const STEP = 6;

// a flower made of dots on a grid: petals from a rose curve, dots on the
// outline drawn bigger than the fill so it reads like a stitched drawing
function dotFlower(cx: number, cy: number, R: number, petals: number, rot: number) {
  const dots: [number, number, number][] = [];
  const inside = (x: number, y: number) => {
    const dx = x - cx;
    const dy = y - cy;
    const r = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx) - rot;
    const edge = R * Math.pow(Math.abs(Math.cos((petals / 2) * a)), 0.7);
    return r <= edge || r < R * 0.16;
  };
  for (let x = Math.floor((cx - R) / STEP) * STEP; x <= cx + R; x += STEP) {
    for (let y = Math.floor((cy - R) / STEP) * STEP; y <= cy + R; y += STEP) {
      if (!inside(x, y)) continue;
      const edge = !inside(x + STEP, y) || !inside(x - STEP, y) || !inside(x, y + STEP) || !inside(x, y - STEP);
      const centre = Math.hypot(x - cx, y - cy) < R * 0.18;
      dots.push([x, y, edge ? 1.9 : centre ? 2.2 : 0.9]);
    }
  }
  return dots;
}

// a dotted stem, curving from (x1,y1) to (x2,y2)
function dotStem(x1: number, y1: number, qx: number, qy: number, x2: number, y2: number) {
  const dots: [number, number, number][] = [];
  const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 7);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * qx + t * t * x2;
    const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * qy + t * t * y2;
    dots.push([x, y, 1.3]);
  }
  return dots;
}

function Lace({ corner, seed }: { corner: "tl" | "br"; seed: number }) {
  const R = seeded(seed);
  const pink: [number, number, number][] = [
    ...dotFlower(150, 140, 92, 6, R() * Math.PI),
    ...dotFlower(300, 70, 46, 5, R() * Math.PI),
  ];
  const lilac: [number, number, number][] = [
    ...dotFlower(70, 300, 54, 6, R() * Math.PI),
    ...dotStem(150, 230, 120, 360, 20, 430),
    ...dotStem(300, 116, 280, 200, 220, 220),
    ...dotStem(70, 354, 90, 400, 150, 430),
  ];
  // a few loose dots drifting off, like pollen
  const dust: [number, number, number][] = Array.from({ length: 26 }, () => [
    220 + R() * 200,
    160 + R() * 240,
    0.6 + R() * 1.2,
  ]);
  return (
    <svg viewBox="0 0 440 440" className={`${styles.lace} ${styles[corner]}`}>
      <g fill="#e8b5d0">
        {pink.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <g fill="#c9a5ed">
        {lilac.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <g fill="#b4c2dd">
        {dust.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}

// ---- twinkling pixel sparkles in the margins ------------------------------

const SPARKLE_COLOURS = ["#d68db5", "#8583c4", "#8583c4", "#526a9c", "#e8b5d0"];

function Sparkles({ seed }: { seed: number }) {
  const R = seeded(seed);
  const items = Array.from({ length: 22 }, (_, i) => {
    const left = R() < 0.5 ? 1 + R() * 12 : 86 + R() * 12;
    const kind: SpriteName = (["sparkle", "sparkle", "star", "heart", "sparkle", "moon"] as const)[Math.floor(R() * 6)];
    return {
      i,
      kind,
      left,
      top: R() * 96,
      color: SPARKLE_COLOURS[Math.floor(R() * SPARKLE_COLOURS.length)],
      size: kind === "sparkle" && R() < 0.4 ? 3 : 2,
      delay: R() * 3,
    };
  });
  return (
    <>
      {items.map((s) => (
        <span
          key={s.i}
          className={styles.spot}
          style={{ left: `${s.left}%`, top: `${s.top}%`, "--delay": `${s.delay.toFixed(2)}s` } as React.CSSProperties}
        >
          <Pixel name={s.kind} size={s.size} color={s.color} twinkle={s.kind === "sparkle" || s.kind === "star"} />
        </span>
      ))}
    </>
  );
}

// ---- pixel stickers dotted around the edges -------------------------------

const STICKERS: { name: SpriteName; color: string; left: number; top: number }[] = [
  { name: "butterfly", color: "#c9a5ed", left: 4, top: 14 },
  { name: "bow", color: "#e8b5d0", left: 91, top: 9 },
  { name: "mushroom", color: "#e8b5d0", left: 6, top: 62 },
  { name: "cloud", color: "#b4c2dd", left: 88, top: 38 },
  { name: "crown", color: "#c9a5ed", left: 92, top: 74 },
  { name: "tulip", color: "#c9a5ed", left: 3, top: 86 },
  { name: "star", color: "#b4c2dd", left: 12, top: 36 },
  { name: "heart", color: "#d68db5", left: 84, top: 92 },
];

function Stickers() {
  return (
    <>
      {STICKERS.map((s, i) => (
        <span key={i} className={styles.spot} style={{ left: `${s.left}%`, top: `${s.top}%` }}>
          <Pixel name={s.name} size={4} color={s.color} />
        </span>
      ))}
    </>
  );
}

// ---- pixel flowers scattered in the side margins -------------------------
// (the full flower bed grows along the footer, so it never sits behind text)

const BLOOMS: { name: SpriteName; color: string }[] = [
  { name: "tulip", color: "#e8b5d0" },
  { name: "daisy", color: "#f3d6e4" },
  { name: "bluebell", color: "#b4c2dd" },
  { name: "rose", color: "#d68db5" },
  { name: "flower", color: "#c9a5ed" },
  { name: "blossom", color: "#e8b5d0" },
  { name: "blossom", color: "#b4c2dd" },
  { name: "daisy", color: "#c9a5ed" },
];

function Flowers({ seed }: { seed: number }) {
  const R = seeded(seed + 3);
  const flowers = Array.from({ length: 18 }, (_, i) => {
    const b = BLOOMS[Math.floor(R() * BLOOMS.length)];
    return { i, ...b, left: R() < 0.5 ? 1 + R() * 11 : 88 + R() * 11, top: 6 + R() * 88 };
  });
  return (
    <>
      {flowers.map((f) => (
        <span key={f.i} className={styles.spot} style={{ left: `${f.left}%`, top: `${f.top}%` }}>
          <Pixel name={f.name} size={3} color={f.color} />
        </span>
      ))}
    </>
  );
}

const Img = ({ src, className }: { src: string; className: string }) => (
  // eslint-disable-next-line @next/next/no-img-element -- static decorative SVG, nothing to optimise
  <img src={src} alt="" className={className} draggable={false} />
);

export default function Background({
  kinds = site.background,
  contained = false,
  seed = 7,
}: {
  kinds?: BackgroundKind[];
  /** fill the nearest positioned parent instead of the whole window */
  contained?: boolean;
  seed?: number;
}) {
  const has = (k: BackgroundKind) => kinds.includes(k);
  return (
    <div className={`${styles.bg} ${contained ? styles.contained : styles.fixed}`} aria-hidden="true">
      {has("halftone") && (
        <>
          <Img src="/decor/halftone.svg" className={`${styles.art} ${styles.halftoneTr}`} />
          <Img src="/decor/halftone.svg" className={`${styles.art} ${styles.halftoneBl}`} />
        </>
      )}
      {has("flourish") && (
        <>
          <Img src="/decor/flourish.svg" className={`${styles.art} ${styles.flourishTl}`} />
          <Img src="/decor/flourish.svg" className={`${styles.art} ${styles.flourishBr}`} />
        </>
      )}
      {has("ascii-lily") && <Img src="/decor/lily-ascii.svg" className={`${styles.art} ${styles.asciiLily}`} />}
      {has("ascii-garden") && (
        <>
          <Img src="/decor/tulips-ascii.svg" className={`${styles.art} ${styles.tulips}`} />
          <Img src="/decor/daisies-ascii.svg" className={`${styles.art} ${styles.daisies}`} />
          <Img src="/decor/bells-ascii.svg" className={`${styles.art} ${styles.bells}`} />
        </>
      )}
      {has("stitch-lily") && (
        <>
          <Img src="/decor/lily-stitch.svg" className={`${styles.art} ${styles.stitchL}`} />
          <Img src="/decor/lily-stitch.svg" className={`${styles.art} ${styles.stitchR}`} />
        </>
      )}
      {has("chrome") && <Img src="/decor/garden.svg" className={`${styles.art} ${styles.chrome}`} />}
      {has("cropmarks") && (
        <>
          <i className={`${styles.crop} ${styles.cTl}`} />
          <i className={`${styles.crop} ${styles.cTr}`} />
          <i className={`${styles.crop} ${styles.cBl}`} />
          <i className={`${styles.crop} ${styles.cBr}`} />
        </>
      )}
      {has("lace") && (
        <>
          <Lace corner="tl" seed={seed} />
          <Lace corner="br" seed={seed + 1} />
        </>
      )}
      {has("sparkles") && <Sparkles seed={seed} />}
      {has("stickers") && <Stickers />}
      {has("flowers") && <Flowers seed={seed} />}
    </div>
  );
}
