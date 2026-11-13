// The handmade marks used across the site: ink that bleeds and skips, pixel sparkles,
// cross-stitch, filigree, dotted vines, a stitched spiral, hand-drawn arrows and circles.
// All plain SVG drawn on the server, so they cost nothing to run in the browser.
import { rng } from "../lib/scatter";

/** The ink filters, defined once per page. `ink` wobbles a line, `print` adds riso speckle, `skip` breaks it like an old print. */
export function InkDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="ink" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="print" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="bled" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="9" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.2 0 0 0 1.7" result="speckle" />
          <feComposite in="bled" in2="speckle" operator="in" />
        </filter>
        <filter id="skip" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="11" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="bled" />
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="1" seed="21" result="gaps" />
          <feColorMatrix in="gaps" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.25" result="holes" />
          <feComposite in="bled" in2="holes" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

// ---------- pixel and cross-stitch patterns ----------
// X = main colour, O = centre (gold), G = leaves (sage), H = second colour

export const PATTERNS = {
  spark: ["...X...", "...X...", "..XXX..", "XXXXXXX", "..XXX..", "...X...", "...X..."],
  heart: [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."],
  arrow: ["....X...", "....XX..", "XXXXXXX.", "XXXXXXXX", "XXXXXXX.", "....XX..", "....X..."],
  daisy: ["....X....", "..X.X.X..", "...XXX...", ".XXXOXXX.", "...XXX...", "..X.X.X..", "....G....", "...GGG...", "....G...."],
  bloom: ["...XXX...", "..XXXXX..", ".XXXOXXX.", "..XXXXX..", "...XXX...", "....G....", "..GGG....", "....GGG..", "....G...."],
  tulip: ["..X...X..", ".XXX.XXX.", ".XXXXXXX.", "..XXOXX..", "...XXX...", "....X....", "...GG....", "..G.G.G..", "....G...."],
  rose: ["....X....", "...XXX...", "..XXXXX..", "X.XXOXX.X", "XXXXXXXXX", "..XXXXX..", "...XGX...", "...GGG...", "....G...."],
  moth: ["XX.......XX", "XXX.....XXX", "XXXX.O.XXXX", ".XXXXOXXXX.", "..XXXOXXX..", ".XXXXOXXXX.", "XXX..O..XXX", "XX.......XX"],
  mushroom: ["..XXXXX..", ".XXHXXHX.", "XXXXXXXHX", "XHXXXXXXX", "...OOO...", "...OOO...", "...OOO...", "..GGGGG.."],
  star: ["....X....", "....X....", "...XXX...", "XXXXXXXXX", ".XXXXXXX.", "..XXXXX..", ".XXX.XXX.", "XX.....XX"],
} as const;

export type PatternName = keyof typeof PATTERNS;

/** A pattern drawn as cross-stitches (little uneven Xs of thread) or as crisp pixels. */
export function Stitch({
  pattern,
  colour = "#e391b2",
  second = "#c4b3e0",
  mode = "stitch",
  className,
  style,
  seed = 1,
  label,
}: {
  pattern: PatternName;
  colour?: string;
  second?: string;
  mode?: "stitch" | "pixel";
  className?: string;
  style?: React.CSSProperties;
  seed?: number | string;
  label?: string;
}) {
  const rows = PATTERNS[pattern];
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const colours: Record<string, string> = { X: colour, H: second, O: "#e7c98a", G: "#9dbfa6" };
  const r = rng(`stitch${pattern}${seed}`);
  const cells: React.ReactNode[] = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const c = colours[ch];
      if (!c) return;
      if (mode === "pixel") {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={c} />);
        return;
      }
      const j = () => ((r() - 0.5) * 0.16).toFixed(2);
      cells.push(
        <path
          key={`${x}-${y}`}
          d={`M${x + 0.16 + +j()} ${y + 0.16 + +j()} L${x + 0.84 + +j()} ${y + 0.84 + +j()} M${x + 0.84 + +j()} ${y + 0.16 + +j()} L${x + 0.16 + +j()} ${y + 0.84 + +j()}`}
          stroke={c}
        />,
      );
    }),
  );
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={{ overflow: "visible", ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      shapeRendering={mode === "pixel" ? "crispEdges" : undefined}
    >
      {mode === "stitch" ? (
        <g fill="none" strokeWidth={0.26} strokeLinecap="round">
          {cells}
        </g>
      ) : (
        cells
      )}
    </svg>
  );
}

/** A tiny 7×7 pixel sparkle. */
export function PixelSpark({ colour = "#f4bfd3", className, style }: { colour?: string; className?: string; style?: React.CSSProperties }) {
  return <Stitch pattern="spark" mode="pixel" colour={colour} className={className} style={style} />;
}

// ---------- ink drawings ----------

/** A loose filigree corner in skipping ink. Flip it with CSS for other corners. */
export function FiligreeCorner({ colour = "#c46a8f", className, style }: { colour?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 160 160" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke={colour} strokeLinecap="round" strokeLinejoin="round" filter="url(#skip)">
        <path d="M6 150 C 6 96, 14 52, 44 30 C 70 11, 108 8, 150 6" strokeWidth="2.2" />
        <path d="M44 30 C 34 44, 46 58, 58 50 C 68 42, 60 28, 50 34" strokeWidth="1.8" />
        <path d="M90 10 C 94 24, 110 26, 114 16 C 117 8, 108 4, 104 10" strokeWidth="1.6" />
        <path d="M12 92 C 26 96, 30 112, 20 116 C 12 119, 8 110, 14 106" strokeWidth="1.6" />
        <path d="M58 50 C 76 60, 92 52, 94 40" strokeWidth="1.4" />
        <path d="M26 66 C 40 66, 50 76, 46 88" strokeWidth="1.4" />
        <circle cx="122" cy="22" r="1.8" />
        <circle cx="130" cy="26" r="1.3" />
        <circle cx="24" cy="128" r="1.8" />
        <circle cx="28" cy="137" r="1.3" />
        <path d="M70 22 l3 -6 l3 6 l-3 6 z" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

/** A dotted, stitched-looking vine with a couple of curls, different for every `seed`. */
export function DottedVine({
  seed,
  colour = "#e391b2",
  className,
  vertical = false,
  length = 520,
}: {
  seed: string;
  colour?: string;
  className?: string;
  vertical?: boolean;
  length?: number;
}) {
  const r = rng(`vine${seed}`);
  const amp = 12 + r() * 8;
  const pts: string[] = [];
  const curls: string[] = [];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * (length - 12) + 6;
    const y = 20 + (i % 2 ? -amp : amp) * (0.6 + r() * 0.4);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    if (i > 0 && i < steps && r() < 0.6) {
      const s = i % 2 ? 1 : -1;
      curls.push(`M${x.toFixed(1)} ${y.toFixed(1)} c 6 ${-8 * s}, 18 ${-8 * s}, 16 0 c -2 ${7 * s}, -10 ${6 * s}, -8 ${s}`);
    }
  }
  // smooth the points into a gentle wave
  let d = `M${pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1].split(" ").map(Number);
    const [x1, y1] = pts[i].split(" ").map(Number);
    const mx = (x0 + x1) / 2;
    d += ` C ${mx.toFixed(1)} ${y0.toFixed(1)}, ${mx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return (
    <svg
      viewBox={`0 0 ${length} 40`}
      className={className}
      style={vertical ? { transform: "rotate(90deg)" } : undefined}
      aria-hidden="true"
    >
      <g fill="none" stroke={colour} strokeLinecap="round" filter="url(#ink)">
        <path d={d} strokeWidth="2.4" strokeDasharray="0.1 7" />
        {curls.map((c, i) => (
          <path key={i} d={c} strokeWidth="1.5" />
        ))}
      </g>
    </svg>
  );
}

/** A loose spiral, stitched in dots with a skipping ink thread beside it, plus a few pixel sparkles. */
export function StitchedSpiral({ seed = "cover", className }: { seed?: string; className?: string }) {
  const r = rng(`spiral${seed}`);
  const turns = 3.4;
  const cx = 500;
  const cy = 500;
  const reach = 520;
  const b = reach / (turns * Math.PI * 2);
  const p1 = r() * 6.28;
  let d = "";
  let th = 1.1;
  const pts: [number, number][] = [];
  while (th < turns * Math.PI * 2) {
    const rr = b * th * (1 + 0.06 * Math.sin(th * 0.9 + p1));
    const x = cx + Math.cos(th) * rr;
    const y = cy + Math.sin(th) * rr * 0.86;
    pts.push([x, y]);
    d += `${d ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    th += 0.06;
  }
  const sparks = [0.35, 0.55, 0.72, 0.88].map((t) => pts[Math.floor(t * (pts.length - 1))]);
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        <path d={d} stroke="#f4bfd3" strokeWidth="3.4" strokeDasharray="0.1 11" opacity="0.85" filter="url(#ink)" />
        <path d={d} stroke="#c4b3e0" strokeWidth="1.3" opacity="0.55" transform="translate(7 5)" filter="url(#skip)" />
      </g>
      {sparks.map(([x, y], i) => (
        <g key={i} transform={`translate(${(x - 10).toFixed(1)} ${(y - 10).toFixed(1)}) scale(${2.6 + (i % 2)})`}>
          {PATTERNS.spark.map((row, py) =>
            [...row].map((ch, px) => (ch === "X" ? <rect key={`${px}-${py}`} x={px} y={py} width={1} height={1} fill={i % 2 ? "#e7c98a" : "#f4bfd3"} /> : null)),
          )}
        </g>
      ))}
    </svg>
  );
}

/** A hand-drawn arrow, pointing right (rotate or flip with CSS). */
export function HandArrow({ colour = "#c94f80", className, style }: { colour?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 90 50" className={className} style={style} aria-hidden="true">
      <path d="M4 40 C 30 48, 62 40, 82 16 M70 14 L 83 15 L 81 28" fill="none" stroke={colour} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#ink)" />
    </svg>
  );
}

/** A hand-drawn circle, stretched to fill its box. */
export function HandCircle({ colour = "#c94f80", className, style }: { colour?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d="M8 30 C 6 10, 50 2, 80 8 C 98 14, 96 44, 70 52 C 40 60, 10 52, 12 32" fill="none" stroke={colour} strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" filter="url(#ink)" />
    </svg>
  );
}

/** A paperclip, in pink wire. */
export function Paperclip({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 26 64" className={className} style={style} aria-hidden="true">
      <path d="M8 52 V12 a5 5 0 0 1 10 0 V48 a8 8 0 0 1 -16 0 V18" fill="none" stroke="#d9709b" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 50 V14" stroke="#f6c3d6" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}
