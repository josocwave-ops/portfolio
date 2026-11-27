import Link from "next/link";
import NoteWindow from "./NoteWindow";
import Pixel, { type SpriteName } from "./Pixel";
import styles from "./Viewer.module.css";

// A featured project on the home page: a little image-viewer window, the same
// kind as hello.txt, with the file's name in the title bar (tinted in the
// section's colour), the photo edge to edge, and a status bar along the
// bottom with the project's name and year.
export default function Viewer({
  href,
  file,
  section,
  sprite,
  title,
  year,
  color,
  ink,
  big = false,
  children,
}: {
  href: string;
  /** the title-bar name, e.g. "ceramics_1.jpg" or "poem_1.txt" */
  file: string;
  section: string;
  sprite: SpriteName;
  title: string;
  year?: string;
  color: string;
  ink: string;
  big?: boolean;
  /** the photo, a placeholder, or a scrap of a poem */
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${styles.link} ${big ? styles.big : ""}`}
      style={{ "--bar": ink, "--bar-glow": color, "--c": color } as React.CSSProperties}
      data-sfx="blip"
    >
      <NoteWindow title={file} flush label={false}>
        <span className={styles.photo}>{children}</span>
        <span className={styles.status}>
          <span className={`${styles.title} pixel`}>
            <Pixel name={sprite} size={2} color="var(--navy)" />
            {title}
          </span>
          <span className={styles.meta}>
            {section}
            {year && ` · ${year}`}
          </span>
        </span>
      </NoteWindow>
    </Link>
  );
}
