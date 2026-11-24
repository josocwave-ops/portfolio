import styles from "./Stitch.module.css";

// Cross-stitch drawings: each filled square of the grid is sewn as a little
// "x", like the stitched swirls on the board.
//   a = main thread (--c, rose)   b = second thread (--c2, periwinkle)   c = third (--c3, lilac)
const PATTERNS = {
  swirl: [
    "...........aaa..",
    ".........aa...a.",
    "........a......a",
    ".......a...aa..a",
    "......a...a..a.a",
    ".....a....a.b..a",
    ".....a.....aa.a.",
    "....a........a..",
    "....a.......a...",
    "...a.....aa.....",
    "...a....a.......",
    "..a....a..b.....",
    "..a.....aa......",
    ".a..............",
    ".a......c.......",
    "a......ccc......",
    "a.......c.......",
  ],
} as const;

export type StitchName = keyof typeof PATTERNS;

export default function Stitch({ name, size = 4, className }: { name: StitchName; size?: number; className?: string }) {
  const rows = PATTERNS[name];
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const marks: { x: number; y: number; k: string }[] = [];
  rows.forEach((row, y) => [...row].forEach((k, x) => k !== "." && marks.push({ x, y, k })));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * size} height={h * size} aria-hidden="true" className={`${styles.stitch} ${className ?? ""}`}>
      {marks.map(({ x, y, k }) => (
        <path key={`${x}-${y}`} className={styles[k]} d={`M${x + 0.2} ${y + 0.2}L${x + 0.8} ${y + 0.8}M${x + 0.8} ${y + 0.2}L${x + 0.2} ${y + 0.8}`} />
      ))}
    </svg>
  );
}
