import type { Metadata } from "next";
import Image from "next/image";
import { links } from "@/content/work";
import Divider from "../components/Divider";
import NoteWindow from "../components/NoteWindow";
import TextLink from "../components/TextLink";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Wave from "../components/Wave";
import Background from "../components/Background";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "about" };

export default function AboutPage() {
  return (
    <>
      <Background />
      <SiteHeader current="about" />
      <main className={styles.main}>
        <div className={styles.about}>
          <NoteWindow title="✿ me.jpg" flush>
            <div className={styles.portrait}>
              <Image
                src="/me.jpg"
                alt="Ona on old stone steps in a garden, between olive trees and wildflowers"
                fill
                sizes="(max-width: 760px) 92vw, 420px"
                priority
              />
            </div>
          </NoteWindow>
          <div>
            <NoteWindow title="<3 about_me.txt" bodyClassName={styles.prose} trim>
              <h1 className={`${styles.heading} pixel`} style={{ marginTop: 0 }}>
                <Wave text="hi, im ona !!" />
              </h1>
              <p>
                i’ve always loved making things, in pretty much any way i can. i like working with my hands,
                experimenting with materials, seeing where things take me, and losing myself in creation.
              </p>
              <p>
                i love stories, memories and creating little worlds for things to exist in. most of my ideas start with
                writing, but they rarely stay there. they find their way into clay, fabric, drawings, paintings, or
                whatever else i happen to be working with.
              </p>
              <p>
                i’m based in barcelona, and some of my ceramic work is available at{" "}
                <TextLink href={links.shop}>clay by ona</TextLink>.
              </p>
              <p>have a look around!! :)</p>
            </NoteWindow>
            {/* a little bed of flowers under the window so the column isn't so empty */}
            <Divider kind="flowers" size={4} className={styles.aboutFlowers} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
