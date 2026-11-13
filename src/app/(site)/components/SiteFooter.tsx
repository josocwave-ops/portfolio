import Link from "next/link";
import { getSite } from "@/content/load";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const { contact, words } = getSite();
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="Elsewhere">
        <Link href="/contact">contact</Link>
        {contact.instagram && (
          <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer">
            instagram ↗
          </a>
        )}
        {contact.shopUrl && (
          <a href={contact.shopUrl} target="_blank" rel="noopener noreferrer">
            {contact.shopName || "shop"} ↗
          </a>
        )}
      </nav>
      {words.footer && <p className={styles.words}>{words.footer}</p>}
    </footer>
  );
}
