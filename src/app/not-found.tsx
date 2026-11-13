import "./globals.css";
import Link from "next/link";
import { getSite } from "@/content/load";
import Atmosphere from "./(site)/components/Atmosphere";
import Paper from "./(site)/components/Paper";
import SiteFooter from "./(site)/components/SiteFooter";
import SiteHeader from "./(site)/components/SiteHeader";
import StarCursor from "./(site)/components/StarCursor";
import Sticker from "./(site)/components/Sticker";
import styles from "./not-found.module.css";

// Shown for any link that leads nowhere. The message is editable under "Site text & links".
export default function NotFound() {
  const { words } = getSite();
  return (
    <>
      <Atmosphere />
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.moth} data-depth="0.8">
          <Sticker sticker={{ slug: "lost", image: null, drawing: "moth", colour: "vellum" }} />
        </div>
        <Paper id="not-found" tear={4} depth={0.5} className={styles.slip} innerClassName={styles.inner}>
          <p className={styles.code}>404</p>
          <h1 className={styles.message}>{words.notFound || "This page couldn't be found."}</h1>
          <Link href="/" className={`${styles.home} hand`}>
            ← back to the beginning
          </Link>
        </Paper>
      </main>
      <SiteFooter />
      <StarCursor />
    </>
  );
}
