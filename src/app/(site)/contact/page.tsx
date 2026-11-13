import type { Metadata } from "next";
import { getSite } from "@/content/load";
import PageInk from "../components/PageInk";
import Paper from "../components/Paper";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "../pages.module.css";

export const metadata: Metadata = { title: "contact" };

export default function ContactPage() {
  const { contact } = getSite();
  const cards = [
    contact.email && { id: "email", href: `mailto:${contact.email}`, big: contact.email, small: "email", external: false },
    contact.instagram && { id: "insta", href: `https://instagram.com/${contact.instagram}`, big: `@${contact.instagram}`, small: "instagram", external: true },
    contact.shopUrl && {
      id: "shop",
      href: contact.shopUrl,
      big: contact.shopUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      small: contact.shopName || "the shop",
      external: true,
    },
  ].filter((c): c is { id: string; href: string; big: string; small: string; external: boolean } => !!c);

  return (
    <div className={styles.page}>
      <PageInk kind="wavy" seed="contact" />
      <SiteHeader current="contact" />
      <main className={styles.main}>
        <div className={styles.contactHead}>
          <h1 className={styles.bigTitle}>contact</h1>
          {contact.line && <p className={styles.lead}>{contact.line}</p>}
        </div>
        <div className={styles.cards}>
          {cards.map((c, i) => (
            <a
              key={c.id}
              href={c.href}
              className={styles.card}
              style={{ rotate: `${[-2, 1.5, -1][i % 3]}deg` }}
              data-depth={(0.3 + i * 0.2).toFixed(1)}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Paper id={`contact-${c.id}`} tear={3} depth={0.5} innerClassName={styles.cardInner}>
                <span className="hand">{c.small}</span>
                <strong>
                  {c.big}
                  {c.external && " ↗"}
                </strong>
              </Paper>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
