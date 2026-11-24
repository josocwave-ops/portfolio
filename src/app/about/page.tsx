import type { Metadata } from "next";
import { links } from "@/content/work";
import DialUp from "../components/DialUp";
import NoteWindow from "../components/NoteWindow";
import Placeholder from "../components/Placeholder";
import TextLink from "../components/TextLink";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Wave from "../components/Wave";
import Background from "../components/Background";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "about" };

// TODO(Ona): this bio is a first draft pieced together from the portfolio; rewrite it in your own words.
export default function AboutPage() {
  return (
    <>
      <Background />
      <SiteHeader current="about" />
      <main className={styles.main}>
        <div className={styles.about}>
          <NoteWindow title="✿ me.jpg" flush>
            {/* loads in like an old dial-up photo when you hover it */}
            <DialUp file="me.jpg">
              <Placeholder ratio={4 / 5} color="var(--pink)" ink="var(--pink-ink)" sprite="heart" label="a photo of you" />
            </DialUp>
          </NoteWindow>
          <NoteWindow title="<3 about_me.txt" bodyClassName={styles.prose} trim>
            <h1 className={`${styles.heading} pixel`} style={{ marginTop: 0 }}>
              <Wave text="hi, i’m ona" />
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
              I also run a small ceramics studio, <TextLink href={links.shop}>Clay by Ona</TextLink>, where some of my
              pieces are for sale.
            </p>
            <p>
              <TextLink href="/contact">Say hello</TextLink>.
            </p>
          </NoteWindow>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
