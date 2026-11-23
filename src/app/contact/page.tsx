import type { Metadata } from "next";
import { links } from "@/content/work";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import NoteWindow from "../components/NoteWindow";
import Pixel from "../components/Pixel";
import Background from "../components/Background";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "contact" };

export default function ContactPage() {
  return (
    <>
      <Background />
      <SiteHeader current="contact" />
      <main className={styles.main}>
        <h1 className={styles.heading}>contact</h1>
        <p className={styles.lead}>For commissions, collaborations, or just to say hi.</p>
        <NoteWindow title="✉ contact.txt" className={styles.contactWin} bodyClassName={styles.contactList}>
          <a href={`mailto:${links.email}`}>
            <Pixel name="envelope" size={3} color="var(--rose)" />
            <span>
              {links.email}
              <br />
              <small>email</small>
            </span>
          </a>
          <a href={links.instagram} target="_blank" rel="noopener noreferrer">
            <Pixel name="heart" size={3} color="var(--peri)" />
            <span>
              @claybyona
              <br />
              <small>instagram</small>
            </span>
          </a>
          <a href={links.shop} target="_blank" rel="noopener noreferrer">
            <Pixel name="vase" size={3} color="var(--peri)" />
            <span>
              claybyona.com
              <br />
              <small>the shop</small>
            </span>
          </a>
        </NoteWindow>
      </main>
      <SiteFooter />
    </>
  );
}
