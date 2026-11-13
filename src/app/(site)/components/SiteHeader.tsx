import Link from "next/link";
import { colourOf, getSections } from "@/content/load";
import Signature from "./Signature";
import styles from "./SiteHeader.module.css";

export default function SiteHeader({ current }: { current?: string }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.home} aria-label="Home">
        <Signature size="small" />
      </Link>
      <nav className={styles.nav} aria-label="Sections">
        {getSections().map((s) => (
          <Link
            key={s.slug}
            href={`/${s.slug}`}
            className={styles.link}
            style={{ "--c": colourOf(s.colour).color } as React.CSSProperties}
            aria-current={current === s.slug ? "page" : undefined}
          >
            {s.name}
          </Link>
        ))}
        <Link href="/about" className={`${styles.link} ${styles.plain}`} aria-current={current === "about" ? "page" : undefined}>
          about
        </Link>
      </nav>
    </header>
  );
}
