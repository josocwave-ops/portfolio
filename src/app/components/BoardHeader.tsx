import Link from "next/link";
import { sectionById, sections } from "@/content/work";
import Pixel from "./Pixel";
import TrackArea from "./TrackArea";
import Wave from "./Wave";
import styles from "../board.module.css";

// The top of a category "board": a sprite, the title, a line about it,
// and pill-shaped links to the other boards (the current one gets a sparkle
// and a stitched underline, like the main nav).
const ALL = sections.map((s) => s.id);

export default function BoardHeader({ section, count }: { section: string; count: string }) {
  const meta = sectionById(section)!;
  return (
    <header className={styles.head} style={{ "--c": meta.color, "--ink-c": meta.ink } as React.CSSProperties}>
      <TrackArea area={section} all={ALL} />
      {/* the board's main sprite, flanked by the rest of its family */}
      <span className={styles.halo} aria-hidden="true">
        <Pixel name="sparkle" size={2} twinkle className={styles.h1} />
        <Pixel name={meta.family[1]} size={3} className={styles.kin} />
        <Pixel name={meta.sprite} size={5} className={styles.headSprite} />
        <Pixel name={meta.family[2]} size={3} className={styles.kin} />
        <Pixel name="sparkle" size={2} twinkle className={styles.h2} />
      </span>
      <h1 className={`${styles.title} pixel`}>
        <Wave text={meta.label} />
      </h1>
      <p className={styles.blurb}>{meta.blurb}</p>
      <p className={styles.line} aria-hidden="true">
        .:*~*:._.:*~*:._.:*~*:._.:*~*:.
      </p>
      <p className={styles.count}>[ {count} ]</p>
      <nav className={styles.chips} aria-label="Other boards">
        {sections.map((s) => (
          <Link
            key={s.id}
            href={`/${s.id}`}
            className={`${styles.chip} pixel lift`}
            aria-current={s.id === section ? "page" : undefined}
            style={{ "--c": s.color, "--ink-c": s.ink } as React.CSSProperties}
          >
            <Pixel name="sparkle" size={2} className={styles.chipSpark} />
            <span className={styles.chipText}>{s.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
