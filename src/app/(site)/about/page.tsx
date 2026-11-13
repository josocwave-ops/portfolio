import type { Metadata } from "next";
import { getSite, paragraphs } from "@/content/load";
import Frame from "../components/Frame";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Swirls from "../components/Swirls";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "about" };

export default function AboutPage() {
  const { about } = getSite();
  return (
    <>
      <Swirls density="page" />
      <SiteHeader current="about" />
      <main className={styles.main}>
        <div className={styles.about}>
          <Frame src={about.portrait} alt="Portrait" eager className={styles.portrait} />
          <div className={styles.prose}>
            {about.heading && (
              <h1 className={styles.heading} style={{ marginTop: 0 }}>
                {about.heading}
              </h1>
            )}
            {paragraphs(about.body).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
