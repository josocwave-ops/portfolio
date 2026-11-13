import { paragraphs } from "@/content/load";
import { PATTERNS } from "./Ornaments";
import styles from "./PoemSpiral.module.css";

// A poem whose words wind inward along a loose spiral, read from the outside in.
// The spiral is sized to the poem, and the plain text is always there for screen readers.
export default function PoemSpiral({ title, lines, note }: { title: string; lines: string; note: string }) {
  const text = paragraphs(lines).join("  ✦  ").replace(/\s*\n\s*/g, " / ");
  // the spiral is sized to the words: short poems get a small, snug spiral, long ones a big one
  const estimate = text.length * 9.4;
  const turns = Math.min(4.2, Math.max(1.2, estimate / 1100));
  const rOut = Math.min(270, Math.max(110, estimate / (Math.PI * 1.35 * turns)));
  const rIn = rOut * 0.35;
  const cx = 300;
  const cy = 300;
  const steps = 500;
  let d = "";
  let length = 0;
  let px = 0;
  let py = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = -Math.PI * 0.6 + t * turns * Math.PI * 2;
    const rr = (rOut - (rOut - rIn) * t) * (1 + 0.035 * Math.sin(a * 1.7));
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr * 0.95;
    if (i) length += Math.hypot(x - px, y - py);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    px = x;
    py = y;
  }
  const box = rOut + 34;
  const id = `poem-${Math.abs([...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))}`;
  return (
    <figure className={styles.wrap}>
      <svg viewBox={`${cx - box} ${cy - box} ${box * 2} ${box * 2}`} className={styles.spiral} style={{ maxWidth: box * 2.2 }} aria-hidden="true">
        <path id={id} d={d} fill="none" />
        <text>
          {/* stretch the spacing so the words reach the centre */}
          <textPath href={`#${id}`} textLength={(length * 0.97).toFixed(0)} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
        <g transform={`translate(${cx - 12} ${cy - 12}) scale(3.4)`} fill="#f4bfd3">
          {PATTERNS.spark.map((row, y) => [...row].map((ch, x) => (ch === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)))}
        </g>
      </svg>
      <figcaption className={styles.side}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <p className="pixel">read from the outside in</p>
        {note && (
          <div className={styles.note}>
            {paragraphs(note).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        )}
      </figcaption>
      <div className="sr-only">
        {paragraphs(lines).map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>
    </figure>
  );
}
