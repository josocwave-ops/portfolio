import Link from "next/link";
import { colourOf, getHomepage, getProjectsIn, getSections, stickersFor } from "@/content/load";
import MarginStickers from "./components/MarginStickers";
import { PixelSpark, Stitch, StitchedSpiral, type PatternName } from "./components/Ornaments";
import Paper from "./components/Paper";
import Signature from "./components/Signature";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { rng, tilt, torn } from "./lib/scatter";
import styles from "./page.module.css";

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];

// a few tiny twinkles in the sky around the signature, fading in and out at their own pace
const SKY = Array.from({ length: 6 }, (_, i) => {
  const r = rng(`sky${i}`);
  return { left: 6 + r() * 88, top: 8 + r() * 78, size: 7 + r() * 7, delay: r() * 6, speed: 5 + r() * 4 };
});

export default function Home() {
  const home = getHomepage();
  const sections = getSections();

  return (
    <>
      <div className={styles.top}>
        <SiteHeader current="home" />
        <header className={styles.cover}>
          <StitchedSpiral className={styles.spiral} />
          {SKY.map((t, i) => (
            <PixelSpark
              key={i}
              className={styles.sky}
              style={{ left: `${t.left}%`, top: `${t.top}%`, width: t.size, height: t.size, animationDelay: `${t.delay}s`, animationDuration: `${t.speed}s` }}
            />
          ))}
          <div id="cover-title" className={styles.titleblock}>
            <h1 className={styles.title}>
              <Signature size="large" />
            </h1>
            {home.hello && <p className={styles.hello}>{home.hello}</p>}
          </div>
        </header>
      </div>

      <main className={styles.doorsWrap}>
        <MarginStickers id="home" stickers={stickersFor(home.stickers)} />
        <nav className={styles.doors} aria-label="Areas">
          {sections.map((s, i) => {
            const projects = getProjectsIn(s.slug);
            const covers = projects.filter((p) => p.cover).slice(0, 3);
            const c = colourOf(s.colour);
            return (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className={styles.door}
                style={{ "--c": c.color, "--ink": c.ink, "--tilt": `${tilt(`door${s.slug}`, 2.2)}deg` } as React.CSSProperties}
                data-depth={(0.15 + (i % 2) * 0.15).toFixed(2)}
              >
                {/* a few of the area's own photos peeking out from behind the card */}
                {covers.length > 0 && (
                  <span className={styles.peeks} aria-hidden="true">
                    {covers.map((p, j) => (
                      <span key={p.slug} className={styles.peek} style={{ "--j": j - (covers.length - 1) / 2, "--a": Math.abs(j - (covers.length - 1) / 2), clipPath: torn(`peek${p.slug}`, 1.2, 18) } as React.CSSProperties}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- uploaded photos have no known size */}
                        <img src={p.cover!} alt="" loading="lazy" />
                      </span>
                    ))}
                  </span>
                )}
                <Paper id={`door-${s.slug}`} tear={3.5} depth={0.45} className={styles.card} innerClassName={styles.cardInner}>
                  <span className={styles.cardTop}>
                    <span className={`${styles.no} pixel`}>no. {ROMAN[i] ?? i + 1}</span>
                    <Stitch pattern={s.mark as PatternName} colour={c.color} seed={s.slug} className={styles.mark} />
                  </span>
                  <h2 className={styles.name}>{s.name}</h2>
                  {s.intro && <p className={styles.intro}>{s.intro}</p>}
                  <span className={`${styles.count} pixel`}>
                    {projects.length} {projects.length === 1 ? "project" : "projects"}
                    <Stitch pattern="arrow" mode="pixel" colour={c.ink} className={styles.arrow} />
                  </span>
                </Paper>
                <PixelSpark className={styles.spark} />
              </Link>
            );
          })}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
