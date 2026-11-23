import Link from "next/link";
import { links } from "@/content/work";
import Pixel, { type SpriteName } from "./Pixel";
import { SoundToggle } from "./Sounds";
import styles from "./SiteFooter.module.css";
import WebButtons from "./WebButtons";

// a pixel flower bed along the bottom of every page
const GARDEN: { name: SpriteName; color: string; size: number }[] = [
  { name: "sprout", color: "var(--peri)", size: 3 },
  { name: "tulip", color: "var(--pink)", size: 4 },
  { name: "daisy", color: "var(--mist)", size: 3 },
  { name: "bluebell", color: "var(--ice)", size: 3 },
  { name: "rose", color: "var(--rose)", size: 4 },
  { name: "sprout", color: "var(--peri)", size: 2 },
  { name: "flower", color: "var(--lilac)", size: 3 },
  { name: "tulip", color: "var(--lilac)", size: 3 },
  { name: "mushroom", color: "var(--pink)", size: 3 },
  { name: "daisy", color: "var(--lilac)", size: 4 },
  { name: "bluebell", color: "var(--lilac)", size: 3 },
  { name: "tulip", color: "var(--ice)", size: 4 },
  { name: "sprout", color: "var(--peri)", size: 3 },
  { name: "rose", color: "var(--pink)", size: 3 },
  { name: "flower", color: "var(--mist)", size: 3 },
  { name: "tulip", color: "var(--rose)", size: 3 },
];

// TODO(Ona): bump this when you update the site
const UPDATED = "november 2026";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.garden} aria-hidden="true">
        {GARDEN.map((g, i) => (
          <Pixel key={i} name={g.name} color={g.color} size={g.size} />
        ))}
      </div>
      <nav className={`${styles.links} pixel`} aria-label="Footer">
        <Link href="/about">about</Link>
        <Link href="/contact">contact</Link>
        <a href={links.instagram} target="_blank" rel="noopener noreferrer">
          instagram ↗
        </a>
        <a href={links.shop} target="_blank" rel="noopener noreferrer">
          clay by ona ↗
        </a>
      </nav>
      <WebButtons />
      <pre className={styles.ascii} aria-hidden="true">{`  .:*~*:._.:*~*:._.:*~*:._.:*~*:.  `}</pre>
      <p className={styles.small}>
        made by hand by Ona Cabedo Wells <span className={styles.heart}>&lt;3</span> · last updated {UPDATED}
      </p>
      <SoundToggle />
    </footer>
  );
}
