import Link from "next/link";
import { links } from "@/content/work";
import Pixel, { type SpriteName } from "./Pixel";
import styles from "./WebButtons.module.css";

// Little 88×31 buttons, like the link badges on early personal websites.
type Button = { href: string; label: string; sprite: SpriteName; tint: string; ink: string; external?: boolean };

const BUTTONS: Button[] = [
  { href: "/about", label: "about me", sprite: "heart", tint: "var(--pink)", ink: "var(--pink-ink)" },
  { href: "/contact", label: "contact", sprite: "envelope", tint: "var(--lilac)", ink: "var(--lilac-ink)" },
  { href: links.shop, label: "clay by ona", sprite: "vase", tint: "var(--mist)", ink: "var(--peri-ink)", external: true },
];

// only the footer shows this one
const INSTAGRAM: Button = {
  href: links.instagram,
  label: "instagram",
  sprite: "camera",
  tint: "var(--ice)",
  ink: "var(--blue-ink)",
  external: true,
};

export default function WebButtons({ className, instagram = false }: { className?: string; instagram?: boolean }) {
  const buttons = instagram ? [...BUTTONS, INSTAGRAM] : BUTTONS;
  return (
    <nav className={`${styles.row} ${className ?? ""}`} aria-label="Links">
      {buttons.map((b) => {
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
