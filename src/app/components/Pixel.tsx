import styles from "./Pixel.module.css";

// Little pixel-art sprites, drawn as text grids so they're easy to tweak.
//   a = main colour (--c, defaults to the text colour)
//   b = highlight   (--c2, defaults to paper)
//   c = leaf/accent (--c3, defaults to periwinkle)
const SPRITES = {
  sparkle: [
    "....a....",
    "....a....",
    "....a....",
    "...aba...",
    "aaabbbaaa",
    "...aba...",
    "....a....",
    "....a....",
    "....a....",
  ],
  star: [
    ".....a.....",
    "....aaa....",
    "....aba....",
    "aaaaabaaaaa",
    ".aaabbbaaa.",
    "..aaabaaa..",
    "...aaaaa...",
    "..aaa.aaa..",
    "..aa...aa..",
    ".a.......a.",
  ],
  moon: [
    "...aaaa..",
    "..aab....",
    ".aab.....",
    ".aa......",
    ".aa......",
    ".aa......",
    ".aaa.....",
    "..aaa..a.",
    "...aaaa..",
  ],
  heart: [
    ".aa...aa.",
    "abaa.aaaa",
    "abaaaaaaa",
    "aaaaaaaaa",
    ".aaaaaaa.",
    "..aaaaa..",
    "...aaa...",
    "....a....",
  ],
  flower: [
    "...aaa...",
    "..aaaaa..",
    "aa.aaa.aa",
    "aaaabaaaa",
    ".aabbbaa.",
    "aaaabaaaa",
    "aa.aaa.aa",
    "..aaaaa..",
    "...aaa...",
  ],
  tulip: [
    ".a.a.a.",
    ".aaaaa.",
    ".abaaa.",
    ".aaaaa.",
    "..aaa..",
    "...c...",
    "c..c...",
    ".c.c.c.",
    "..ccc..",
    "...c...",
  ],
  vase: [
    "..aaaaa..",
    "...aaa...",
    "...aaa...",
    "..aaaaa..",
    ".aaaaaaa.",
    "aabbbbbaa",
    "aaaaaaaaa",
    "aabbbbbaa",
    ".aaaaaaa.",
    "..aaaaa..",
  ],
  pencil: [
    "........bb",
    ".......bbb",
    "......aab.",
    ".....aaa..",
    "....aaa...",
    "...aaa....",
    "..aaa.....",
    ".ccc......",
    ".cc.......",
    "c.........",
  ],
  dress: [
    "...a...a...",
    "...aa.aa...",
    "...aaaaa...",
    "...abbba...",
    "...aaaaa...",
    "..aaaaaaa..",
    "..aaaaaaa..",
    ".aaaaaaaaa.",
    ".aaaaaaaaa.",
    "aaaaaaaaaaa",
    "abababababa",
  ],
  quill: [
    ".........a",
    "........aa",
    ".......aaa",
    "......aaa.",
    ".....aaab.",
    "....aaab..",
    "...aaab...",
    "..aaab....",
    "..aab.....",
    "..ab......",
    ".b........",
    "b.........",
  ],
  daisy: [
    "...a.a...",
    ".a.aaa.a.",
    "..aaaaa..",
    "aaabbbaaa",
    ".aabbbaa.",
    "aaabbbaaa",
    "..aaaaa..",
    ".a.aaa.a.",
    "...a.a...",
  ],
  rose: [
    "..aaaa...",
    ".abbaaa..",
    "aaabbaaa.",
    "abaaabbaa",
    "abbaaaaba",
    ".abbbbba.",
    "..aaaaa..",
    "...c..c..",
    "..cc.cc..",
    "....c....",
    "....c....",
  ],
  bluebell: [
    "....c....",
    "...c.c...",
    "..c...c..",
    ".aaa.aaa.",
    "aaaaaaaaa",
    "abaa.aaba",
    "a.a...a.a",
  ],
  sprout: [
    ".cc...cc.",
    "cccc.cccc",
    ".cccccc..",
    "....c....",
    "....c....",
  ],
  blossom: [
    ".a.a.",
    "aabaa",
    ".a.a.",
  ],
  swan: [
    "..aaa.........",
    ".abbba........",
    "aabba.........",
    "...ba.........",
    "...ba.....aa..",
    "...ba...aabba.",
    "...baaaabbbbaa",
    "...abbbbbbbbba",
    "....abbbbbbba.",
    ".....aaaaaaa..",
  ],
  dragonfly: [
    ".....a.....",
    "....aaa....",
    "cc..aaa..cc",
    "cccbaaabccc",
    ".ccbaaabcc.",
    "cccbaaabccc",
    "cc...a...cc",
    ".....a.....",
    ".....a.....",
    ".....a.....",
    ".....a.....",
  ],
  fairy: [
    "....aaa....",
    "....aba....",
    "cc...a...cc",
    "ccc.aaa.ccc",
    ".cccaaaccc.",
    "..c.aaa.c..",
    "...aaaaa...",
    "..aaaaaaa..",
    ".aaaaaaaaa.",
    "....b.b....",
    "....b.b....",
  ],
  unicorn: [
    "...........a.",
    "..........aa.",
    "...aa....aa..",
    "..abba..aa...",
    ".cabbbaaba...",
    "ccabbbbbbaa..",
    "ccabbbbabbba.",
    "ccabbbbbbbbba",
    "cc.abbbbbbbba",
    "c..abbbbaaaa.",
    "...abbbba....",
    "...abbbba....",
  ],
  lily: [
    "a.....a.....a",
    ".a....a....a.",
    ".aa..aaa..aa.",
    "..aa.aba.aa..",
    "..abaabaaba..",
    "...abbbbba...",
    "....abbba....",
    ".....aaa.....",
    "......c......",
    "...cc.c......",
    "....ccc......",
    "......c......",
  ],
  // a little pointing arrow (points left)
  arrow: [
    "...a.....",
    "..aa.....",
    ".aaaaaaaa",
    "aaaaaaaaa",
    ".aaaaaaaa",
    "..aa.....",
    "...a.....",
  ],
  // the pink eight-point star from the board
  star8: [
    "......a......",
    "......a......",
    ".a....a....a.",
    "..a..aba..a..",
    "...a.aba.a...",
    "....abbba....",
    "aaaaabbbaaaaa",
    "....abbba....",
    "...a.aba.a...",
    "..a..aba..a..",
    ".a....a....a.",
    "......a......",
    "......a......",
  ],
  twinkle: [
    "......a......",
    "......a......",
    ".....aba.....",
    ".....aba.....",
    "....abbba....",
    "..aabbbbbaa..",
    "aabbbbbbbbbaa",
    "..aabbbbbaa..",
    "....abbba....",
    ".....aba.....",
    ".....aba.....",
    "......a......",
    "......a......",
  ],
  key: [
    ".aaa.......",
    "a...a......",
    "a...aaaaaaa",
    "a...a...a.a",
    ".aaa.......",
  ],
  envelope: [
    "aaaaaaaaaaa",
    "aabbbbbbbaa",
    "abaabbbaaba",
    "abbbaaabbba",
    "abbbbabbbba",
    "abbbbbbbbba",
    "aaaaaaaaaaa",
  ],
  camera: [
    ".aaaaaaaaa.",
    "abbbbbbbaba",
    "abbbaaabbba",
    "abbabbbabba",
    "abbabbbabba",
    "abbabbbabba",
    "abbbaaabbba",
    "abbbbbbbbba",
    ".aaaaaaaaa.",
  ],
  bow: [
    "aa.......aa",
    "abaa...aaba",
    "abbaaaaabba",
    "abbaabaabba",
    "abbaaaaabba",
    "abaa.a.aaba",
    "aa..a.a..aa",
    "...a...a...",
  ],
  butterfly: [
    "....c.c....",
    "aa...c...aa",
    "abaa.c.aaba",
    "abbbacabbba",
    "abbbacabbba",
    ".aaaacaaaa.",
    ".abbacabba.",
    ".abba.abba.",
    "..aa...aa..",
  ],
  mushroom: [
    "..aaaaa..",
    ".aabaaba.",
    "aabaaaaba",
    "aaaabaaaa",
    "aaaaaaaaa",
    "..ccccc..",
    "..ccccc..",
    "..ccccc..",
    "...ccc...",
  ],
  cloud: [
    "....aaa......",
    "..aabbbaaa...",
    ".abbbbbbbbaa.",
    "abbbbbbbbbbba",
    "abbbbbbbbbbba",
    ".aaaaaaaaaaa.",
  ],
  crown: [
    "a....a....a",
    "aa..aba..aa",
    "aaa.aaa.aaa",
    "aaaaaaaaaaa",
    "abababababa",
    "aaaaaaaaaaa",
  ],
} as const;

export type SpriteName = keyof typeof SPRITES;

const FILL: Record<string, string> = {
  a: "var(--c, currentColor)",
  b: "var(--c2, var(--paper))",
  c: "var(--c3, var(--peri))",
};

// merge runs of the same colour on each row into one rect
function rects(rows: readonly string[]) {
  const out: { x: number; y: number; w: number; k: string }[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const k = row[x];
      if (k === ".") {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === k) w++;
      out.push({ x, y, w, k });
      x += w;
    }
  });
  return out;
}

export default function Pixel({
  name,
  size = 3,
  color,
  className,
  twinkle = false,
}: {
  name: SpriteName;
  /** screen pixels per sprite pixel */
  size?: number;
  color?: string;
  className?: string;
  twinkle?: boolean;
}) {
  const rows = SPRITES[name];
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * size}
      height={h * size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={`${styles.pixel} ${twinkle ? styles.twinkle : ""} ${className ?? ""}`}
      style={color ? ({ "--c": color } as React.CSSProperties) : undefined}
    >
      {rects(rows).map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={FILL[r.k]} />
      ))}
    </svg>
  );
}
