import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pieces, sectionById, writings } from "@/content/work";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Spiral from "../components/Spiral";
import Swirls from "../components/Swirls";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "writing" };

export default function WritingPage() {
  const meta = sectionById("writing")!;
  return (
    <>
      <Swirls density="page" />
      <SiteHeader current="writing" />
      <main className={styles.main}>
        <h1 className={styles.heading}>
          <Spiral color={meta.color} seed={7} className={styles.headingSpiral} />
          writing
        </h1>
        <p className={styles.lead}>
          My writing lives on the work. These are the poems from the memory cups, each one carved into the cup it
          belongs to.
        </p>
        <div className={styles.poems}>
          {writings.map((w, i) => {
            const work = pieces.find((p) => p.slug === w.pairedWith);
            return (
              <article key={w.slug} id={w.slug} className={styles.poem}>
                <div className={styles.poemImage}>
                  <Image src={w.image.src} width={w.image.width} height={w.image.height} alt="" sizes="(max-width: 720px) 92vw, 420px" loading={i === 0 ? "eager" : "lazy"} />
                </div>
                <div>
                  <h2 className={styles.poemTitle}>{w.title}</h2>
                  <p className={styles.lines}>{w.lines}</p>
                  <p className={styles.poemText}>{w.text}</p>
                  {work && (
                    <Link href={`/${work.section}/${work.slug}`} className={styles.pairLink}>
                      see it on the cup → {work.title}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
