import Link from "next/link";
import Pixel, { type SpriteName } from "./Pixel";
import styles from "./Polaroid.module.css";

// A featured project on the home page: a photo printed like a polaroid, taped
// down at a slight angle, with the section, name and year written in the
// wide bottom margin. `big` is the lead one; the photo grows to fill the space.
export default function Polaroid({
  href,
  section,
  sprite,
  title,
  year,
  color,
  ink,
  tilt = 0,
  big = false,
  children,
}: {
  href: string;
  section: string;
  sprite: SpriteName;
  title: string;
  year?: string;
  color: string;
  ink: string;
  /** degrees; a little crooked, like it was stuck down by hand */
  tilt?: number;
  big?: boolean;
  /** the photo, a placeholder, or a scrap of a poem */
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${styles.card} ${big ? styles.big : ""}`}
      style={{ "--c": color, "--ink-c": ink, rotate: `${tilt}deg` } as React.CSSProperties}
      data-sfx="blip"
    >
      <span className={styles.tape} aria-hidden="true" />
      <span className={`${styles.lift} lift`}>
        <span className={`${styles.paper} px-frame`}>
          <span className={styles.photo}>{children}</span>
          <span className={styles.caption}>
            <span className={`${styles.chip} pixel`}>
              <Pixel name={sprite} size={2} color="var(--navy)" />
              {section}
            </span>
            <span className={`${styles.title} pixel`}>{title}</span>
            {year && <span className={styles.year}>{year}</span>}
          </span>
          <Pixel name="sparkle" size={2} className={styles.spark} />
        </span>
      </span>
    </Link>
  );
}
