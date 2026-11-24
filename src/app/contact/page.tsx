import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Wave from "../components/Wave";
import Postcard from "../components/Postcard";
import Background from "../components/Background";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "contact" };

export default function ContactPage() {
  return (
    <>
      <Background />
      <SiteHeader current="contact" />
      <main className={`${styles.main} ${styles.centred}`}>
        <h1 className={styles.heading}>
          <Wave text="contact" />
        </h1>
        {/* an old "you've got mail!" line, blinking, over the postcard */}
        <p className={`${styles.mail} pixel`}>✉ you&rsquo;ve got mail!</p>
        <Postcard />
      </main>
      <SiteFooter />
    </>
  );
}
