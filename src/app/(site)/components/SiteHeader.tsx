import Link from "next/link";
import { getSections } from "@/content/load";
import Signature from "./Signature";
import { PixelSpark } from "./Ornaments";
import styles from "./SiteHeader.module.css";

// The signature (home) on the left; the four areas, about and contact on the right,
// strung together with tiny twinkles rather than sitting in a menu bar.
export default function SiteHeader({ current }: { current?: string }) {
  const links = [
    ...getSections().map((s) => ({ href: `/${s.slug}`, key: s.slug, label: s.menuName })),
    { href: "/about", key: "about", label: "about" },
    { href: "/contact", key: "contact", label: "contact" },
  ];
  return (
    <header className={styles.header}>
      {current === "home" ? (
        <span />
      ) : (
        <Link href="/" className={styles.home} aria-label="Home">
          <Signature size="small" />
        </Link>
      )}
      <nav aria-label="Main">
        <ul className={styles.nav}>
          {links.map((l, i) => (
            <li key={l.key}>
              {i > 0 && <PixelSpark colour="#e391b2" className={styles.sep} />}
              <Link href={l.href} className={styles.link} aria-current={current === l.key ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
