import Link from "next/link";
import { getSite } from "@/content/load";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const { contact, words } = getSite();
  return (
    <footer className={styles.footer}>
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
      {words.footer && <span>{words.footer}</span>}
    </footer>
  );
}
