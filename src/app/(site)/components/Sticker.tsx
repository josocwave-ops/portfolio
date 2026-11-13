import type { StickerDef } from "@/content/load";
import { DOODLES, type DoodleName } from "./Doodles";
import styles from "./Sticker.module.css";

const INK: Record<string, string> = {
  vellum: "#e4d6bd",
  gold: "#d9b873",
  teal: "#8cc0b8",
  lavender: "#b8a6d0",
  slate: "#98a9cc",
  rose: "#d3a3b9",
  sage: "#a7c2b0",
};

// One sticker: a built-in ink doodle, or Ona's own uploaded drawing.
export default function Sticker({ sticker, className, style }: { sticker: StickerDef; className?: string; style?: React.CSSProperties }) {
  const ink = INK[sticker.colour] ?? INK.vellum;
  if (sticker.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- uploaded drawings have no known size
      <img src={sticker.image} alt="" className={`${styles.sticker} ${styles.own} ${className ?? ""}`} style={style} />
    );
  }
  const doodle = DOODLES[sticker.drawing as DoodleName];
  if (!doodle) return null;
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${styles.sticker} ${className ?? ""}`}
      style={{ color: ink, "--fill": ink, ...style } as React.CSSProperties}
      aria-hidden="true"
    >
      {doodle}
    </svg>
  );
}
