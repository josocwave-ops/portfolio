import Pixel, { type SpriteName } from "./Pixel";
import styles from "./Divider.module.css";

const FLOWERS: { name: SpriteName; color: string }[] = [
  { name: "tulip", color: "var(--pink)" },
  { name: "daisy", color: "var(--lilac)" },
  { name: "rose", color: "var(--rose)" },
  { name: "bluebell", color: "var(--peri)" },
  { name: "tulip", color: "var(--lilac)" },
  { name: "daisy", color: "var(--pink)" },
  { name: "rose", color: "var(--peri)" },
];

// Little separators between sections: a bead chain, a row of flowers,
// or a bead chain with a star in the middle.
export default function Divider({ kind = "star", className }: { kind?: "dots" | "flowers" | "star"; className?: string }) {
  return (
    <div className={`${styles.divider} ${styles[kind]} ${className ?? ""}`} aria-hidden="true">
      {kind === "flowers" &&
        FLOWERS.map((f, i) => <Pixel key={i} name={f.name} size={2} color={f.color} />)}
      {kind === "star" && <Pixel name="sparkle" size={2} color="var(--peri)" />}
    </div>
  );
}
