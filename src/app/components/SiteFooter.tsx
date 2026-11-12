import Link from "next/link";
import { links } from "@/content/work";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Link href="/contact">contact</Link>
      <a href={links.instagram} target="_blank" rel="noopener noreferrer">
        instagram ↗
      </a>
      <a href={links.shop} target="_blank" rel="noopener noreferrer">
        clay by ona shop ↗
      </a>
    </footer>
  );
}
