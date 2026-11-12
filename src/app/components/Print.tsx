import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/content/work";
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
}: {
  href: string;
  image: Img;
  title: string;
  note?: string;
  index: number;
  color: string;
}) {
  const tilt = TILTS[index % TILTS.length];
  const taped = index % 3 !== 1;
  return (
    <Link href={href} className={styles.print} style={{ "--tilt": `${tilt}deg`, "--tape": color } as React.CSSProperties}>
      {taped && <span className={styles.tape} aria-hidden="true" />}
      <span className={styles.photo}>
        <Image src={image.src} alt="" fill sizes="(max-width: 700px) 45vw, 300px" loading={index < 4 ? "eager" : "lazy"} />
      </span>
      <span className={styles.title}>{title}</span>
      {note && <span className={styles.note}>{note}</span>}
    </Link>
  );
}
