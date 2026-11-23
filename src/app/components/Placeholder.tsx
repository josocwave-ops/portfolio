import Pixel, { type SpriteName } from "./Pixel";
import styles from "./Placeholder.module.css";

// An empty, softly tinted spot where one of Ona's photos will go.
export default function Placeholder({
  ratio,
  color = "var(--lilac)",
  ink = "var(--lilac-ink)",
  sprite = "sparkle",
  label = "photo",
  fill = false,
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
  className?: string;
}) {
  return (
    <span
      className={`${styles.ph} ${fill ? styles.fill : ""} ${className ?? ""}`}
      style={{ "--tint": color, "--ink-c": ink, aspectRatio: fill ? undefined : ratio } as React.CSSProperties}
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
