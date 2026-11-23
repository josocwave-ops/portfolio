import Link from "next/link";
import Pixel from "./Pixel";
import styles from "./TextLink.module.css";

// A link inside a sentence: pixel type, and a little sparkle pops in on hover,
// like the links in the menu. External links open in a new tab.
export default function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  const inner = (
    <>
      <Pixel name="sparkle" size={1} className={styles.spark} />
      {children}
    </>
  );
  return /^(https?:|mailto:)/.test(href) ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`${styles.link} pixel`}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} className={`${styles.link} pixel`}>
      {inner}
    </Link>
  );
}
