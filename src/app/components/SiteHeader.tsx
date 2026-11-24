import Link from "next/link";
import { links, sections, site } from "@/content/work";
import Mood from "./Mood";
import Pixel from "./Pixel";
import Signature from "./Signature";
import WindowBar from "./WindowBar";
import styles from "./SiteHeader.module.css";

// The top of every page: a little night sky that runs the full width of the
// screen, under a pink window bar (logo, dragonfly, twinkling pixel
// stars, online now! and ona's
// mood), then a band of links split by tiny flowers and a lace trim. The
// words live in src/content/work.ts (site.status.mood and site.moods).

type Item = { id: string; label: string; href: string; out?: boolean };

// two groups: home and the work on the left, about ona on the right
const WORK: Item[] = [
  { id: "home", label: "home", href: "/" },
  ...sections.map((s) => ({ id: s.id, label: s.label, href: `/${s.id}` })),
];
const ME: Item[] = [
  { id: "about", label: "about", href: "/about" },
  { id: "contact", label: "contact", href: "/contact" },
  { id: "shop", label: "clay by ona ↗", href: links.shop, out: true },
];

// the stars in the sky: where they sit (as a share of the band) and how they twinkle
const STARS: { name: "sparkle" | "twinkle" | "star"; left: string; top: string; size: number; color: string; delay: string }[] = [
  // kept in the open sky between the logo and "online now!"
  { name: "twinkle", left: "26%", top: "12%", size: 1, color: "var(--pink)", delay: "1.6s" },
  { name: "sparkle", left: "35%", top: "68%", size: 2, color: "var(--ice)", delay: "0s" },
  { name: "twinkle", left: "46%", top: "16%", size: 2, color: "var(--mist)", delay: "2.2s" },
  { name: "sparkle", left: "55%", top: "70%", size: 1, color: "var(--pink)", delay: "1.1s" },
  { name: "sparkle", left: "62%", top: "10%", size: 2, color: "var(--ice)", delay: "2.8s" },
  { name: "twinkle", left: "69%", top: "66%", size: 1, color: "var(--pink)", delay: "0.8s" },
];

export default function SiteHeader({ current, home = false }: { current?: string; home?: boolean }) {
  const here = home ? "home" : current;

  return (
    <header className={styles.wrap}>
      {/* a pink window bar along the very top; its red button won't let you leave */}
      <WindowBar />

      {/* the night sky: logo, dragonfly, online now */}
      <div className={styles.sky}>
        <div className={styles.stars} aria-hidden="true">
          {STARS.map((s, i) => (
            <span key={i} className={styles.star} style={{ left: s.left, top: s.top, "--delay": s.delay } as React.CSSProperties}>
              <Pixel name={s.name} size={s.size} color={s.color} twinkle />
            </span>
          ))}
          {/* now and then a shooting star streaks across the open sky */}
          <span className={styles.shoot} />
          <span className={`${styles.shoot} ${styles.shoot2}`} />
          <span className={styles.moon}>
            <Pixel name="moon" size={3} color="var(--pink)" />
          </span>
        </div>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="onA, home">
            <Signature size="small" tone="light" />
            {/* the same ASCII dragonfly as the homepage, in moonlight colours */}
            <span className={styles.dragonfly} aria-hidden="true" />
          </Link>
          {/* online now!, with ona's mood underneath (click it to change it) */}
          <span className={styles.corner}>
            <span className={`${styles.online} pixel`}>
              <i aria-hidden="true" />
              online now!
            </span>
            <span className={styles.mood}>
              <span className="pixel">mood:</span> <Mood first={site.status.mood} others={site.moods} />
            </span>
          </span>
        </div>
      </div>

      {/* every page: the work on the left, about ona on the right */}
      <nav className={`${styles.nav} pixel`} aria-label="Main">
        <div className={styles.inner}>
          {[WORK, ME].map((group, g) => (
            <ul key={g} className={`${styles.group} ${g === 1 ? styles.me : ""}`}>
              {group.map((it) => (
                <li key={it.id}>
                  {it.out ? (
                    <a href={it.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {it.label}
                    </a>
                  ) : (
                    <Link href={it.href} className={styles.link} aria-current={here === it.id ? "page" : undefined}>
                      {here === it.id && <Pixel name="sparkle" size={2} className={styles.spark} />}
                      {it.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </nav>
      <div className={styles.lace} aria-hidden="true" />

    </header>
  );
}
