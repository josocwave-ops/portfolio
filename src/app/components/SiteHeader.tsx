import Link from "next/link";
import { sections } from "@/content/work";
import Signature from "./Signature";
import Spiral from "./Spiral";
import styles from "./SiteHeader.module.css";

export default function SiteHeader({ current }: { current?: string }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.home} aria-label="Home">
        <Signature size="small" />
      </Link>
      <nav className={styles.nav} aria-label="Sections">
        {sections.map((s, i) => (
          <Link
            key={s.id}
            href={`/${s.id}`}
            className={styles.link}
            style={{ "--c": s.ink } as React.CSSProperties}
            aria-current={current === s.id ? "page" : undefined}
          >
            <Spiral color={s.color} seed={i + 3} className={styles.spiral} />
            {s.label}
          </Link>
        ))}
        <Link href="/about" className={styles.link} aria-current={current === "about" ? "page" : undefined}>
          about
        </Link>
      </nav>
    </header>
  );
}
