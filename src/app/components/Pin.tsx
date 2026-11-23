import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/content/work";
import Pixel, { type SpriteName } from "./Pixel";
import Placeholder from "./Placeholder";
import styles from "./Pin.module.css";

type Common = {
  href: string;
  title: string;
  note?: string;
  color: string;
  ink: string;
  sprite: SpriteName;
};

// One pin on a Pinterest-style board: a photo at its own shape in a pixel
// frame, title underneath. On hover it lifts onto a pixel shadow and a sparkle
// appears.
export function PhotoPin({ image, ratio, index = 0, ...p }: Common & { image?: Img; ratio?: number; index?: number }) {
  return (
    <Link href={p.href} className={styles.pin} style={{ "--c": p.color, "--ink-c": p.ink } as React.CSSProperties}>
      <span className="lift">
        <span className={`${styles.photo} px-frame`}>
          {image ? (
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt=""
              sizes="(max-width: 600px) 46vw, (max-width: 1000px) 31vw, 280px"
              loading={index < 6 ? "eager" : "lazy"}
            />
          ) : (
            <Placeholder ratio={ratio ?? 4 / 5} color={p.color} ink={p.ink} sprite={p.sprite} />
          )}
          <Pixel name="sparkle" size={2} className={styles.spark} />
        </span>
      </span>
      <span className={styles.caption}>
        <span className={styles.title}>{p.title}</span>
        {p.note && <span className={styles.note}>{p.note}</span>}
      </span>
    </Link>
  );
}

// A pin made of words, for poems.
export function TextPin({ lines, ...p }: Common & { lines: string }) {
  return (
    <Link href={p.href} className={styles.pin} style={{ "--c": p.color, "--ink-c": p.ink } as React.CSSProperties}>
      <span className="lift">
        <span className={`${styles.text} px-frame`}>
          <Pixel name={p.sprite} size={2} className={styles.textSprite} />
          <span className={styles.lines}>{lines}</span>
          <Pixel name="sparkle" size={2} className={styles.spark} />
        </span>
      </span>
      <span className={styles.caption}>
        <span className={styles.title}>{p.title}</span>
        {p.note && <span className={styles.note}>{p.note}</span>}
      </span>
    </Link>
  );
}
