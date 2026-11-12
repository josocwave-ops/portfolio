import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { links } from "@/content/work";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Swirls from "../components/Swirls";
import styles from "../inner.module.css";
import portrait from "../../../public/about.jpg";

export const metadata: Metadata = { title: "about" };

// TODO(Ona): this bio is a first draft pieced together from the portfolio; rewrite it in your own words.
export default function AboutPage() {
  return (
    <>
      <Swirls density="page" />
      <SiteHeader current="about" />
      <main className={styles.main}>
        <div className={styles.about}>
          <Image src={portrait} alt="Painting of Ona" className={styles.portrait} sizes="(max-width: 720px) 92vw, 420px" />
          <div className={styles.prose}>
            <h1 className={styles.heading} style={{ marginTop: 0 }}>
              hi, i&rsquo;m ona
            </h1>
            <p>
              I make things with clay, fabric, paint and words. Most of my work starts with a memory, a place, or a
              mistake I decided to keep.
            </p>
            <p>
              My ceramics range from mugs with poems carved into them to sculptural faces; my clothes are built from
              discarded fabric and unravelled sweaters; and I draw and paint in between.
            </p>
            <p>
              I also run a small ceramics studio,{" "}
              <a href={links.shop} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                Clay by Ona
              </a>
              , where some of my pieces are for sale.
            </p>
            <p>
              <Link href="/contact" style={{ textDecoration: "underline" }}>
                Say hello
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
