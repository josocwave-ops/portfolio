import Image from "next/image";
import { pieces, piecesIn, sectionById, sections, site, writings } from "@/content/work";
import AsciiHeading from "./components/AsciiHeading";
import Background from "./components/Background";
import Cute from "./components/Cute";
import Divider from "./components/Divider";
import DragonflyHello from "./components/DragonflyHello";
import Folder from "./components/Folder";
import NoteWindow from "./components/NoteWindow";
import Placeholder from "./components/Placeholder";
import Signature from "./components/Signature";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import WebButtons from "./components/WebButtons";
import styles from "./page.module.css";


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
            {/* the ASCII dragonfly in the empty corner above "on"; click it to say hi */}
            <DragonflyHello className={styles.dragonfly} />
          </h1>
          <NoteWindow title="<3 hello.txt" className={styles.hello} trim>
            <p className={styles.intro}>
              <Cute text={site.intro} />
            </p>
            <WebButtons className={styles.buttons} />
          </NoteWindow>
        </section>

        <Divider kind="flowers" />

        {/* a few favourites, first: each one a little folder */}
        <section aria-labelledby="featured-heading">
          <AsciiHeading id="featured-heading">featured projects</AsciiHeading>
          <div className={styles.featured}>
            {featured.map((p, i) => {
              const s = sectionById(p.section)!;
              const im = p.images[0];
              return (
                <Folder
                  key={p.slug}
                  href={`/${p.section}/${p.slug}`}
                  tab={s.label}
                  title={p.title}
                  meta={p.details ?? p.summary}
                  color={s.color}
                  deep={s.ink}
                  small
                  twinkle={[0, 4, 8][i]}
                  photo={
                    im ? (
                      <Image src={im.src} alt="" fill sizes="(max-width: 760px) 80vw, 300px" loading={i === 0 ? "eager" : "lazy"} />
                    ) : (
                      <Placeholder fill color={s.color} ink={s.ink} sprite={s.sprite} />
                    )
                  }
                />
              );
            })}
          </div>
        </section>

        <Divider kind="star" />

        {/* the four ways in: one window of folders */}
        <section aria-labelledby="work-heading">
          <AsciiHeading id="work-heading">the work</AsciiHeading>
          <NoteWindow title="✿ my_work/" meta="4 folders" label={false}>
            <div className={styles.folders}>
              {sections.map((s, i) => {
                const items = piecesIn(s.id);
                const [a, b] = items.flatMap((p) => p.images);
                const count = s.id === "writing" ? `${writings.length} poems` : `${items.length} projects`;
                const inside =
                  s.id === "writing" ? (
                    <span className={styles.poemScrap}>&ldquo;{poem.lines}&rdquo;</span>
                  ) : a ? (
                    <Image src={a.src} alt="" fill sizes="(max-width: 760px) 40vw, 220px" />
                  ) : (
                    <Placeholder fill color={s.color} ink={s.ink} sprite={s.sprite} label="" />
                  );
                const behind = b ? <Image src={b.src} alt="" fill sizes="200px" /> : <Placeholder fill color={s.color} ink={s.ink} sprite={s.family[1] ?? s.sprite} label="" tone={2} />;
                return (
                  <Folder
                    key={s.id}
                    href={`/${s.id}`}
                    tab={`✿ ${s.label}`}
                    title={s.label}
                    meta={count}
                    sprite={s.sprite}
                    color={s.color}
                    deep={s.ink}
                    photo={inside}
                    photoBehind={behind}
                    twinkle={[2, 6, 10, 12][i]}
                  />
                );
              })}
            </div>
          </NoteWindow>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
