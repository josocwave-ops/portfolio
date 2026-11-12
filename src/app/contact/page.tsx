import type { Metadata } from "next";
import { links } from "@/content/work";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Spiral from "../components/Spiral";
import Swirls from "../components/Swirls";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "contact" };

export default function ContactPage() {
  return (
    <>
      <Swirls density="page" />
      <SiteHeader current="contact" />
      <main className={styles.main}>
        <h1 className={styles.heading}>contact</h1>
        <p className={styles.lead}>For commissions, collaborations, or just to say hi.</p>
        <div className={styles.contactList}>
          <a href={`mailto:${links.email}`}>
            <Spiral color="#c98fa6" seed={4} className={styles.headingSpiral} />
            <span>
              {links.email}
              <br />
              <small>email</small>
            </span>
          </a>
          <a href={links.instagram} target="_blank" rel="noopener noreferrer">
            <Spiral color="#8394b5" seed={5} className={styles.headingSpiral} />
            <span>
              @claybyona
              <br />
              <small>instagram</small>
            </span>
          </a>
          <a href={links.shop} target="_blank" rel="noopener noreferrer">
            <Spiral color="#8fa89a" seed={6} className={styles.headingSpiral} />
            <span>
              claybyona.com
              <br />
              <small>the shop</small>
            </span>
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
