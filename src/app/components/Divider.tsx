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
// `size` is the pixel scale of the flowers (2 = the usual small row).
export default function Divider({
  kind = "star",
  size = 2,
  className,
}: {
  kind?: "dots" | "flowers" | "star";
  size?: number;
  className?: string;
}) {
  return (
    <div className={`${styles.divider} ${styles[kind]} ${kind === "flowers" ? "bob-row" : ""} ${className ?? ""}`} aria-hidden="true">
      {kind === "flowers" &&
        FLOWERS.map((f, i) => <Pixel key={i} name={f.name} size={size} color={f.color} />)}
      {kind === "star" && <Pixel name="sparkle" size={2} color="var(--peri)" />}
    </div>
  );
}
