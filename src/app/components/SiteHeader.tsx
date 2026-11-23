import Link from "next/link";
import { Fragment } from "react";
import { links, sections, site } from "@/content/work";
import Cute from "./Cute";
import Pixel from "./Pixel";
import Signature from "./Signature";
import styles from "./SiteHeader.module.css";

// The top of every page, built like a mid-2000s profile site: a dark band
// with the logo, a lighter band of links split by pipes, and a little status
// box (what ona is doing, mood, reading, listening). The words live in
// src/content/work.ts (site.tagline and site.status).

type Item = { id: string; label: string; href: string; out?: boolean };

const ITEMS: Item[] = [
  { id: "home", label: "home", href: "/" },
  ...sections.map((s) => ({ id: s.id, label: s.label, href: `/${s.id}` })),
  { id: "about", label: "about", href: "/about" },
  { id: "contact", label: "contact", href: "/contact" },
  { id: "shop", label: "clay by ona ↗", href: links.shop, out: true },
];

export default function SiteHeader({ current, home = false }: { current?: string; home?: boolean }) {
  const here = home ? "home" : current;
  const { doing, ...rest } = site.status;

  return (
    <header className={styles.wrap}>
      <div className={styles.box}>
        {/* dark band: logo, tagline, online now */}
        <div className={styles.top}>
          <Link href="/" className={styles.logo} aria-label="onA, home">
            <Signature size="small" tone="light" />
          </Link>
          <span className={styles.tagline}>{site.tagline}</span>
          <span className={`${styles.online} pixel`}>
            <i aria-hidden="true" />
            online now!
          </span>
        </div>

        {/* light band: every page, split by pipes */}
        <nav className={`${styles.nav} pixel`} aria-label="Main">
          {ITEMS.map((it, i) => (
            <Fragment key={it.id}>
              {i > 0 && (
                <span className={styles.pipe} aria-hidden="true">
                  |
                </span>
              )}
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
            </Fragment>
          ))}
        </nav>

        {/* status box */}
        <div className={styles.status}>
          <p className={styles.doing}>
            <b className="pixel">ona is</b> <Cute text={doing} />
          </p>
          <dl className={styles.facts}>
            {Object.entries(rest).map(([k, v]) => (
              <div key={k}>
                <dt className="pixel">{k}:</dt>
                <dd>
                  <Cute text={v} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  );
}
