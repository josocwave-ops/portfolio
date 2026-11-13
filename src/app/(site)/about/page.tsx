import type { Metadata } from "next";
import Link from "next/link";
import { getSite, paragraphs } from "@/content/load";
import PageInk from "../components/PageInk";
import Paper from "../components/Paper";
import Print from "../components/Print";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "../pages.module.css";

export const metadata: Metadata = { title: "about" };

export default function AboutPage() {
  const { about, contact } = getSite();
  return (
    <div className={styles.page}>
      <PageInk kind="spiral" seed="about" />
      <SiteHeader current="about" />
      <main className={styles.main}>
        <div className={styles.about}>
          <div className={styles.portrait} data-depth="0.5">
            <Print id="about-portrait" image={about.portrait} alt="Portrait" fix="clip" depth={0.7} maxTilt={4} eager />
          </div>
          <Paper id="about-sheet" tear={5} depth={0.3} className={styles.aboutSheet} innerClassName={styles.sheetInner}>
            {about.heading && <h1 className={styles.heading}>{about.heading}</h1>}
            <div className={styles.prose}>
              {paragraphs(about.body).map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            {(contact.email || contact.instagram) && (
              <Link href="/contact" className={`${styles.hello} hand`}>
                say hello →
              </Link>
            )}
          </Paper>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
