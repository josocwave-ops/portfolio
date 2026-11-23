import Image from "next/image";
import Link from "next/link";
import { pieces, piecesIn, sectionById, sections, site, writings } from "@/content/work";
import AsciiHeading from "./components/AsciiHeading";
import Background from "./components/Background";
import Cute from "./components/Cute";
import Divider from "./components/Divider";
import NoteWindow from "./components/NoteWindow";
import Pixel from "./components/Pixel";
import Placeholder from "./components/Placeholder";
import Signature from "./components/Signature";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import WebButtons from "./components/WebButtons";
import styles from "./page.module.css";

const vars = (c: string, ink: string) => ({ "--c": c, "--ink-c": ink }) as React.CSSProperties;
// "project one" -> "project_one.jpg", like a file on an old desktop
const fileName = (title: string) => `${title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}.jpg`;

export default function Home() {
  const featured = site.featured.map((slug) => pieces.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const poem = writings[0];

  return (
    <>
      <Background />
      <SiteHeader home />
      <main className={styles.main}>
        {/* hello */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            <Signature size="large" />
            {/* an ASCII dragonfly in the empty corner above "on" (made by scripts/decor.mjs) */}
            {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG */}
            <img src="/decor/dragonfly.svg" alt="" aria-hidden="true" className={styles.dragonfly} draggable={false} />
          </h1>
          <NoteWindow title="♡ hello.txt" className={styles.hello}>
            <p className={styles.intro}>
              <Cute text={site.intro} />
            </p>
            <WebButtons className={styles.buttons} />
          </NoteWindow>
        </section>

        <Divider kind="flowers" />

        {/* a few favourites, first */}
        <section aria-labelledby="featured-heading">
          <AsciiHeading id="featured-heading">featured projects</AsciiHeading>
          <div className={styles.featured}>
            {featured.map((p, i) => {
              const s = sectionById(p.section)!;
              const im = p.images[0];
              return (
                <Link key={p.slug} href={`/${p.section}/${p.slug}`} className={styles.feature} style={vars(s.color, s.ink)}>
                  <NoteWindow title={`✿ ${fileName(p.title)}`} label={false} flush className={styles.win}>
                    <span className={styles.featureImg}>
                      {im ? (
                        <Image src={im.src} alt="" fill sizes="(max-width: 760px) 92vw, 380px" loading={i === 0 ? "eager" : "lazy"} />
                      ) : (
                        <Placeholder fill color={s.color} ink={s.ink} sprite={s.sprite} />
                      )}
                    </span>
                    <span className={styles.featureText}>
                      <span className={`${styles.featureSection} pixel`}>
                        <Pixel name={s.sprite} size={2} />
                        {s.label}
                      </span>
                      <span className={`${styles.featureTitle} pixel`}>{p.title}</span>
                      <span className={styles.featureSummary}>{p.summary}</span>
                    </span>
                  </NoteWindow>
                </Link>
              );
            })}
          </div>
        </section>

        <Divider kind="star" />

        {/* the four ways in */}
        <section aria-labelledby="work-heading">
          <AsciiHeading id="work-heading">the work</AsciiHeading>
          <div className={styles.cards}>
            {sections.map((s) => {
              const items = piecesIn(s.id);
              const cover = items[0]?.images[0];
              const count = s.id === "writing" ? `${writings.length} poems` : `${items.length} projects`;
              return (
                <Link key={s.id} href={`/${s.id}`} className={styles.card} style={vars(s.color, s.ink)}>
                  <NoteWindow title={`✿ ${s.label}/`} meta={count} label={false} flush className={styles.win}>
                    <span className={styles.cover}>
                      {s.id !== "writing" ? (
                        cover ? (
                          <Image src={cover.src} alt="" fill sizes="(max-width: 760px) 92vw, 560px" />
                        ) : (
                          <Placeholder fill color={s.color} ink={s.ink} sprite={s.sprite} label="cover photo" />
                        )
                      ) : (
                        <span className={styles.poemCover}>
                          <span>&ldquo;{poem.lines}&rdquo;</span>
                        </span>
                      )}
                    </span>
                    <span className={styles.cardText}>
                      <span className={styles.cardHead}>
                        <Pixel name={s.sprite} size={3} className={styles.sprite} />
                        <span className={`${styles.cardTitle} pixel`}>{s.label}</span>
                        <span className={`${styles.open} pixel`} aria-hidden="true">
                          open →
                        </span>
                      </span>
                      <span className={styles.blurb}>{s.blurb}</span>
                    </span>
                  </NoteWindow>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
