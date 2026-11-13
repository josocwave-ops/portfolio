import Link from "next/link";
import { colourOf, getHomepage, getProject, getSections, getSite, type Project } from "@/content/load";
import { CoverLines } from "./components/Lines";
import Signature from "./components/Signature";
import SiteFooter from "./components/SiteFooter";
import Thread from "./components/Thread";
import styles from "./page.module.css";

export default function Home() {
  const { contact } = getSite();
  const home = getHomepage();
  // drafts drop out on the live site, and a thread with nothing left in it isn't shown
  const threads = home.threads
    .map((t) => ({ ...t, projects: t.projects.map(getProject).filter((p): p is Project => !!p) }))
    .filter((t) => t.projects.length);

  return (
    <>
      <header className={styles.cover}>
        <CoverLines clear="#cover-title" />
        <div id="cover-title" className={styles.titleblock} data-depth="0.04">
          <h1 className={styles.title}>
            <Signature size="large" />
          </h1>
          <nav className={styles.menu} aria-label="Sections">
            {getSections().map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} style={{ "--c": colourOf(s.colour).color } as React.CSSProperties}>
                {s.name}
              </Link>
            ))}
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
        </div>
        {threads.length > 0 && (
          <a href="#threads" className={`${styles.hint} hand`}>
            {home.threadsTitle}
            <svg width="22" height="34" viewBox="0 0 22 34" aria-hidden="true">
              <path d="M11 2 C 7 10, 15 17, 11 30 M5 24 L11 31 L17 23" />
            </svg>
          </a>
        )}
      </header>

      {threads.length > 0 && (
        <main id="threads">
          <section className={styles.intro}>
            <h2>{home.threadsTitle}</h2>
            {home.threadsIntro && <p>{home.threadsIntro}</p>}
          </section>
          {threads.map((t, i) => (
            <Thread key={t.title + i} index={i} title={t.title} intro={t.intro} line={t.line === "wavy" ? "wavy" : "spiral"} projects={t.projects} />
          ))}
        </main>
      )}
      <SiteFooter />
    </>
  );
}
