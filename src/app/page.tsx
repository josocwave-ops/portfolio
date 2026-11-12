import Link from "next/link";
import { links, sections } from "@/content/work";
import Signature from "./components/Signature";
import Spiral from "./components/Spiral";
import Swirls from "./components/Swirls";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Swirls density="cover" />
      <main className={styles.cover}>
        <h1 className={styles.title}>
          <Signature size="large" />
        </h1>
        <nav className={styles.menu} aria-label="Sections">
          {sections.map((s, i) => (
            <Link key={s.id} href={`/${s.id}`} className={styles.link} style={{ "--c": s.ink } as React.CSSProperties}>
              <Spiral color={s.color} seed={i + 3} className={styles.spiral} />
              {s.label}
            </Link>
          ))}
        </nav>
        <nav className={styles.small} aria-label="More">
          <Link href="/about">about</Link>
          <Link href="/contact">contact</Link>
          <a href={links.shop} target="_blank" rel="noopener noreferrer">
            clay by ona shop ↗
          </a>
        </nav>
      </main>
    </>
  );
}
