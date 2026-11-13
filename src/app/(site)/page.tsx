import Link from "next/link";
import { colourOf, getSections, getSite } from "@/content/load";
import Signature from "./components/Signature";
import Spiral from "./components/Spiral";
import Swirls from "./components/Swirls";
import styles from "./page.module.css";

export default function Home() {
  const { contact } = getSite();
  return (
    <>
      <Swirls density="cover" />
      <main className={styles.cover}>
        <h1 className={styles.title}>
          <Signature size="large" />
        </h1>
        <nav className={styles.menu} aria-label="Sections">
          {getSections().map((s, i) => {
            const c = colourOf(s.colour);
            return (
              <Link key={s.slug} href={`/${s.slug}`} className={styles.link} style={{ "--c": c.ink } as React.CSSProperties}>
                <Spiral color={c.color} seed={i + 3} className={styles.spiral} />
                {s.name}
              </Link>
            );
          })}
        </nav>
        <nav className={styles.small} aria-label="More">
          <Link href="/about">about</Link>
          <Link href="/contact">contact</Link>
          {contact.shopUrl && (
            <a href={contact.shopUrl} target="_blank" rel="noopener noreferrer">
              {contact.shopName || "shop"} ↗
            </a>
          )}
        </nav>
      </main>
    </>
  );
}
