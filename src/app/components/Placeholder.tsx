import Pixel, { type SpriteName } from "./Pixel";
import styles from "./Placeholder.module.css";

// how deep the wash is: light, mid or deep, so a board of empty spots isn't
// one flat colour
const TONES = [
  ["30%", "62%"],
  ["55%", "90%"],
  ["78%", "100%"],
] as const;

// An empty, softly tinted spot where one of Ona's photos will go.
export default function Placeholder({
  ratio,
  color = "var(--lilac)",
  ink = "var(--lilac-ink)",
  sprite = "sparkle",
  label = "photo",
  fill = false,
  tone = 1,
  className,
}: {
  /** width / height; ignored when `fill` is set */
  ratio?: number;
  color?: string;
  ink?: string;
  sprite?: SpriteName;
  label?: string;
  /** stretch to fill a positioned parent instead of using a ratio */
  fill?: boolean;
  /** 0 light, 1 mid, 2 deep */
  tone?: number;
  className?: string;
}) {
  return (
    <span
      className={`${styles.ph} ${fill ? styles.fill : ""} ${className ?? ""}`}
      style={
        {
          "--tint": color,
          "--ink-c": ink,
          "--t1": TONES[tone % 3][0],
          "--t2": TONES[tone % 3][1],
          aspectRatio: fill ? undefined : ratio,
        } as React.CSSProperties
      }
      role="img"
      aria-label={`${label} placeholder`}
    >
      <span className={styles.mark}>
        <Pixel name={sprite} size={3} />
        <span className={`${styles.label} pixel`}>{label}</span>
      </span>
    </span>
  );
}
