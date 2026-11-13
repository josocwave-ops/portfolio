import type { StickerDef } from "@/content/load";
import { DOODLES, type DoodleName } from "./Doodles";
import { Stitch, type PatternName } from "./Ornaments";
import styles from "./Sticker.module.css";

const INK: Record<string, string> = {
  pink: "#f4bfd3",
  rose: "#e391b2",
  lavender: "#c4b3e0",
  slate: "#a7b6e6",
  vellum: "#ecdfd0",
  gold: "#e7c98a",
  teal: "#8cc0b8",
  sage: "#aac6b2",
};

// One sticker: a built-in doodle printed in one ink (with a little bleed and speckle),
// a cross-stitched one ("x-" drawings), or Ona's own uploaded drawing.
export default function Sticker({ sticker, className, style }: { sticker: StickerDef; className?: string; style?: React.CSSProperties }) {
  const ink = INK[sticker.colour] ?? INK.pink;
  if (sticker.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- uploaded drawings have no known size
      <img src={sticker.image} alt="" className={`${styles.sticker} ${styles.own} ${className ?? ""}`} style={style} />
    );
  }
  if (sticker.drawing.startsWith("x-")) {
    return <Stitch pattern={sticker.drawing.slice(2) as PatternName} colour={ink} second="#c4b3e0" seed={sticker.slug} className={`${styles.stitched} ${className ?? ""}`} style={style} />;
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
      <g filter="url(#print)">{doodle}</g>
    </svg>
  );
}
