import Image from "next/image";
import { pieces, piecesIn, sectionById, sections, site, writings } from "@/content/work";
import AsciiHeading from "./components/AsciiHeading";
import Background from "./components/Background";
import Cute from "./components/Cute";
import Divider from "./components/Divider";
import DragonflyHello from "./components/DragonflyHello";
import Folder from "./components/Folder";
import IntroStar from "./components/IntroStar";
import NoteWindow from "./components/NoteWindow";
import Placeholder from "./components/Placeholder";
import Signature from "./components/Signature";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import Viewer from "./components/Viewer";
import WebButtons from "./components/WebButtons";
import styles from "./page.module.css";


export default function Home() {
  // featured can mix projects and poems; both become a little viewer window
  const featured = site.featured
    .map((slug) => {
      const p = pieces.find((x) => x.slug === slug);
      if (p) return { slug, section: p.section, href: `/${p.section}/${p.slug}`, title: p.title, year: p.details, image: p.images[0], lines: undefined };
      const w = writings.find((x) => x.slug === slug);
      if (w) return { slug, section: "writing", href: `/writing/${w.slug}`, title: w.title, year: w.year, image: undefined, lines: w.lines };
      return undefined;
    })
    .filter((f) => f !== undefined);
  const poem = writings[0];

  return (
    <>
      <Background />
      <SiteHeader home />
      {/* on the first visit, a shooting star sweeps up past the big A */}
      <IntroStar targetSelector="main h1" />
      <main className={styles.main}>
        {/* hello */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            <Signature size="large" />
            {/* the ASCII dragonfly in the empty corner above "on"; click it to say hi */}
            <DragonflyHello className={styles.dragonfly} />
          </h1>
          <NoteWindow title="hiiii.txt <3" className={styles.hello} trim loading>
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
          {/* a few favourites, each in its own little image-viewer window: the first one big */}
          <div className={styles.featured}>
            {featured.map((p, i) => {
              const s = sectionById(p.section)!;
              const big = i === 0;
              return (
                <Viewer
                  key={p.slug}
                  href={p.href}
                  file={`${p.slug.replace("-", "_")}.${p.lines ? "txt" : "jpg"}`}
                  section={s.label}
                  sprite={s.sprite}
                  title={p.title}
                  year={p.year}
                  color={s.color}
                  ink={s.ink}
                  big={big}
                >
                  {p.image ? (
                    <Image src={p.image.src} alt="" fill sizes={big ? "(max-width: 760px) 92vw, 640px" : "(max-width: 760px) 92vw, 420px"} loading={i === 0 ? "eager" : "lazy"} />
                  ) : p.lines ? (
                    <span className={styles.poemPrint}>{p.lines}</span>
                  ) : (
                    <Placeholder fill color={s.color} ink={s.ink} sprite={s.sprite} label={big ? "photo" : ""} />
                  )}
                </Viewer>
              );
            })}
          </div>
        </section>

        <Divider kind="star" />

        {/* the four ways in: one window of folders */}
        <section aria-labelledby="work-heading">
          <AsciiHeading id="work-heading">gallery</AsciiHeading>
          <NoteWindow title="✿ gallery/" meta="4 folders" label={false}>
            <div className={styles.folders}>
              {sections.map((s, i) => {
                const items = piecesIn(s.id);
                const [a, b] = items.flatMap((p) => p.images);
                const count = s.id === "writing" ? `${writings.length} pieces` : `${items.length} projects`;
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
                    tab={`✿ ${s.label.split(" ")[0]}`}
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
