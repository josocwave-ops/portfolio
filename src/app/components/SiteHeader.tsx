import Link from "next/link";
import { links, sections, site } from "@/content/work";
import { BadgeStatus } from "./BadgeCase";
import Mood from "./Mood";
import NavMenu from "./NavMenu";
import Pixel from "./Pixel";
import Signature from "./Signature";
import WindowBar from "./WindowBar";
import styles from "./SiteHeader.module.css";

// The top of every page: a little night sky that runs the full width of the
// screen, under a pink window bar (logo, dragonfly, twinkling pixel
// stars, online now!, ona's mood and your badges), then a band of links
// split by tiny flowers and a lace trim. The words live in src/content/work.ts (site.status.mood and site.moods).

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

// the stars in the sky. `at` is how far along the open sky each one sits:
// 0 is right beside the name, 1 is just before the moon (see .star in the
// CSS). `top` is a share of the band's height. Only the `phone` ones show on
// a phone, where the logo fills the left half.
const STARS: {
  name: "sparkle" | "twinkle" | "star";
  at: number;
  top: string;
  size: number;
  color: string;
  delay: string;
  phone?: boolean;
}[] = [
  { name: "sparkle", at: 0, top: "62%", size: 1, color: "var(--pink)", delay: "0.4s" },
  { name: "twinkle", at: 0.06, top: "14%", size: 2, color: "var(--ice)", delay: "1.9s", phone: true },
  { name: "twinkle", at: 0.15, top: "72%", size: 1, color: "var(--mist)", delay: "2.5s" },
  { name: "twinkle", at: 0.24, top: "12%", size: 1, color: "var(--pink)", delay: "1.6s" },
  { name: "sparkle", at: 0.33, top: "68%", size: 2, color: "var(--ice)", delay: "0s", phone: true },
  { name: "twinkle", at: 0.44, top: "16%", size: 2, color: "var(--mist)", delay: "2.2s" },
  { name: "sparkle", at: 0.54, top: "70%", size: 1, color: "var(--pink)", delay: "1.1s" },
  { name: "sparkle", at: 0.63, top: "10%", size: 2, color: "var(--ice)", delay: "2.8s", phone: true },
  { name: "twinkle", at: 0.73, top: "66%", size: 1, color: "var(--pink)", delay: "0.8s" },
  { name: "sparkle", at: 0.84, top: "20%", size: 1, color: "var(--mist)", delay: "1.3s", phone: true },
  { name: "twinkle", at: 0.93, top: "62%", size: 2, color: "var(--ice)", delay: "2s" },
  { name: "sparkle", at: 1, top: "74%", size: 1, color: "var(--pink)", delay: "0.6s" },
];

export default function SiteHeader({ current, home = false }: { current?: string; home?: boolean }) {
  const here = home ? "home" : current;
  const hereLabel = [...WORK, ...ME].find((it) => it.id === here)?.label;

  return (
    <header className={styles.wrap}>
      {/* a pink window bar along the very top; its red button won't let you leave */}
      <WindowBar />

      {/* the night sky: logo, dragonfly, online now */}
      <div className={styles.sky}>
        <div className={styles.stars} aria-hidden="true">
          {STARS.map((s, i) => (
            <span
              key={i}
              className={`${styles.star} ${s.phone ? "" : styles.notPhone}`}
              style={{ "--at": s.at, top: s.top, "--delay": s.delay } as React.CSSProperties}
            >
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
            <Signature size="small" />
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
            {/* the badges you've found here; click to see them all */}
            <span className={styles.mood}>
              <span className="pixel">badges:</span> <BadgeStatus />
            </span>
          </span>
        </div>
      </div>

      {/* every page: the work on the left, about ona on the right */}
      <nav className={`${styles.nav} pixel`} aria-label="Main">
        <div className={styles.inner}>
          <NavMenu
            here={hereLabel}
            classes={{ menu: styles.menu, open: styles.open, toggle: styles.toggle, here: styles.here, links: styles.links }}
          >
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
          </NavMenu>
        </div>
      </nav>
      <div className={styles.lace} aria-hidden="true" />

    </header>
  );
}
