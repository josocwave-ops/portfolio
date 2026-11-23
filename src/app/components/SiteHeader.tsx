import Link from "next/link";
import { links, sections } from "@/content/work";
import Pixel from "./Pixel";
import Signature from "./Signature";
import styles from "./SiteHeader.module.css";
import Ticker from "./Ticker";

function Links({ current }: { current?: string }) {
  return (
    <>
      {sections.map((s) => (
        <Link
          key={s.id}
          href={`/${s.id}`}
          className={styles.link}
          style={{ "--c": s.color, "--ink-c": s.ink } as React.CSSProperties}
          aria-current={current === s.id ? "page" : undefined}
        >
          <Pixel name="sparkle" size={2} className={styles.spark} />
          {s.label}
        </Link>
      ))}
      <span className={styles.divider} aria-hidden="true" />
      <Link href="/about" className={styles.link} aria-current={current === "about" ? "page" : undefined}>
        <Pixel name="sparkle" size={2} className={styles.spark} />
        about
      </Link>
      <Link href="/contact" className={styles.link} aria-current={current === "contact" ? "page" : undefined}>
        <Pixel name="sparkle" size={2} className={styles.spark} />
        contact
      </Link>
      <a href={links.shop} target="_blank" rel="noopener noreferrer" className={`${styles.link} ${styles.out}`}>
        clay by ona ↗
      </a>
    </>
  );
}

export default function SiteHeader({ current, home = false }: { current?: string; home?: boolean }) {
  return (
    <>
      <header className={`${styles.header} ${home ? styles.onHome : ""}`}>
        {!home && (
          <Link href="/" className={styles.home} aria-label="onA, home">
            <Signature size="small" />
          </Link>
        )}
        <nav className={`${styles.nav} pixel`} aria-label="Main">
          <Links current={current} />
        </nav>
        {/* phones: the same links behind a little menu button */}
        <details className={`${styles.menu} pixel`}>
          <summary className="px-frame">
            <Pixel name="star" size={2} />
            menu
          </summary>
          <nav className={`${styles.sheet} px-frame`} aria-label="Main">
            <Links current={current} />
          </nav>
        </details>
      </header>
      <Ticker />
    </>
  );
}
