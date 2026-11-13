import type { Metadata } from "next";
import { getSite } from "@/content/load";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Spiral from "../components/Spiral";
import Swirls from "../components/Swirls";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "contact" };

export default function ContactPage() {
  const { contact } = getSite();
  return (
    <>
      <Swirls density="page" />
      <SiteHeader current="contact" />
      <main className={styles.main}>
        <h1 className={styles.heading}>contact</h1>
        {contact.line && <p className={styles.lead}>{contact.line}</p>}
        <div className={styles.contactList}>
          {contact.email && (
            <a href={`mailto:${contact.email}`}>
              <Spiral color="#c98fa6" seed={4} className={styles.headingSpiral} />
              <span>
                {contact.email}
                <br />
                <small>email</small>
              </span>
            </a>
          )}
          {contact.instagram && (
            <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer">
              <Spiral color="#8394b5" seed={5} className={styles.headingSpiral} />
              <span>
                @{contact.instagram}
                <br />
                <small>instagram</small>
              </span>
            </a>
          )}
          {contact.shopUrl && (
            <a href={contact.shopUrl} target="_blank" rel="noopener noreferrer">
              <Spiral color="#8fa89a" seed={6} className={styles.headingSpiral} />
              <span>
                {contact.shopUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                <br />
                <small>{contact.shopName || "the shop"}</small>
              </span>
            </a>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
