import Link from "next/link";
import { links } from "@/content/work";
import Pixel, { type SpriteName } from "./Pixel";
import styles from "./WebButtons.module.css";

// Little 88×31 buttons, like the link badges on early personal websites.
const BUTTONS: { href: string; label: string; sprite: SpriteName; tint: string; ink: string; external?: boolean }[] = [
  { href: "/about", label: "about me", sprite: "heart", tint: "var(--pink)", ink: "var(--pink-ink)" },
  { href: "/contact", label: "contact", sprite: "envelope", tint: "var(--lilac)", ink: "var(--lilac-ink)" },
  { href: links.shop, label: "clay by ona", sprite: "vase", tint: "var(--mist)", ink: "var(--peri-ink)", external: true },
];

export default function WebButtons({ className }: { className?: string }) {
  return (
    <nav className={`${styles.row} ${className ?? ""}`} aria-label="About, contact and shop">
      {BUTTONS.map((b) => {
        const inner = (
          <>
            <span className={styles.icon}>
              <Pixel name={b.sprite} size={2} />
            </span>
            <span className={`${styles.text} pixel`}>
              {b.label}
              {b.external && " ↗"}
            </span>
          </>
        );
        const style = { "--tint": b.tint, "--ink-c": b.ink } as React.CSSProperties;
        return b.external ? (
          <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer" className={styles.btn} style={style} data-sfx="ding">
            {inner}
          </a>
        ) : (
          <Link key={b.label} href={b.href} className={styles.btn} style={style} data-sfx="ding">
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
