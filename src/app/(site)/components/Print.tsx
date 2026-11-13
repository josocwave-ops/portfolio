import Link from "next/link";
import { getSite } from "@/content/load";
import styles from "./Print.module.css";

// A white-edged photo print, tilted a little, with tape on some.
const TILTS = [-1.6, 1.2, -0.7, 1.8, -2.1, 0.9, -1.1, 1.5];

export default function Print({
  href,
  image,
  title,
  note,
  index,
  color,
  draft,
}: {
  href: string;
  image: string | null;
  title: string;
  note?: string;
  index: number;
  color: string;
  draft?: boolean;
}) {
  const words = getSite().words;
  const tilt = TILTS[index % TILTS.length];
  const taped = index % 3 !== 1;
  return (
    <Link
      href={href}
      className={styles.print}
      style={{ "--tilt": `${tilt}deg`, "--tape": color } as React.CSSProperties}
      title={words.peek || undefined}
    >
      {taped && <span className={styles.tape} aria-hidden="true" />}
      {draft && <span className={styles.draft}>draft · only you can see this</span>}
      <span className={styles.photo}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- uploaded photos have no known size
          <img src={image} alt="" loading={index < 4 ? "eager" : "lazy"} />
        ) : (
          <span className={styles.empty}>{words.emptyPhoto}</span>
        )}
      </span>
      <span className={styles.title}>{title}</span>
      {note && <span className={styles.note}>{note}</span>}
    </Link>
  );
}
