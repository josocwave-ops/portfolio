import Link from "next/link";
import { colourOf, getSections, getSite, type Project } from "@/content/load";
import { Weave } from "./Lines";
import Paper from "./Paper";
import Print from "./Print";
import styles from "./Thread.module.css";

type Spot = { x: number; y: number; w: number; z?: number; depth: number; crop: "portrait" | "square" | "landscape"; fix: "tape" | "corners" };

// Where up to four prints land on a 1180-wide spread. Mirrored on every other thread.
const SPOTS: Spot[] = [
  { x: 35, y: 120, w: 40, z: 6, depth: 0.6, crop: "landscape", fix: "tape" },
  { x: 79, y: 20, w: 18, z: 1, depth: 0.35, crop: "portrait", fix: "tape" },
  { x: 63, y: 450, w: 27, z: 8, depth: 0.8, crop: "square", fix: "corners" },
  { x: 4, y: 590, w: 20, z: 9, depth: 0.95, crop: "portrait", fix: "tape" },
];

/** One thread on the homepage: a scrapbook spread of projects that share an idea. */
export default function Thread({
  index,
  title,
  intro,
  line,
  projects,
}: {
  index: number;
  title: string;
  intro: string;
  line: "spiral" | "wavy";
  projects: Project[];
}) {
  const flip = index % 2 === 1;
  const place = (x: number, w: number) => (flip ? 100 - x - w : x);
  const sections = getSections().filter((s) => projects.some((p) => p.sections.includes(s.slug)));
  const href = (p: Project) => `/${p.sections[0]}/${p.slug}`;
  const lead = projects[0];
  // the slip quotes a project in the thread, never repeating the thread's own intro
  const quoted = projects.find((p) => p.teaser && p.teaser.trim() !== intro.trim());
  const words = getSite().words;
  const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"][index] ?? String(index + 1);

  return (
    <Weave kind={line} className={styles.spread}>
      <div
        className={`${styles.item} ${styles.label}`}
        style={{ "--x": `${place(2, 28)}%`, "--y": 40, "--w": "28%" } as React.CSSProperties}
        data-depth="0.15"
      >
        <span className={`${styles.no} hand`}>thread {roman}</span>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.media}>
          {sections.map((s) => (
            <span key={s.slug} style={{ "--c": colourOf(s.colour).color } as React.CSSProperties}>
              {s.name}
            </span>
          ))}
        </div>
        {intro && <p className={styles.intro}>{intro}</p>}
        {lead && (
          <Link className={`${styles.more} hand`} href={href(lead)}>
            open {lead.title} →
          </Link>
        )}
      </div>

      <Paper
        id={`sheet-${title}`}
        tear={5}
        depth={0.2}
        className={`${styles.item} ${styles.sheet}`}
        innerClassName={styles.sheetPaper}
        style={{ "--x": `${place(30, 54)}%`, "--y": 70, "--w": "54%", "--r": `${flip ? 1.2 : -1.4}deg` } as React.CSSProperties}
      />

      {projects.slice(0, 4).map((p, i) => {
        const s = SPOTS[i];
        return (
          <div
            key={p.slug}
            className={styles.item}
            data-depth={s.depth}
            style={{ "--x": `${place(s.x, s.w)}%`, "--y": s.y, "--w": `${s.w}%`, "--z": s.z } as React.CSSProperties}
          >
            <Print
              id={`thread-${p.slug}`}
              image={p.cover}
              caption={p.title}
              note={p.sections.join(" · ")}
              href={href(p)}
              crop={s.crop}
              fix={s.fix}
              depth={s.depth}
              draft={p.draft}
              maxTilt={5}
            />
          </div>
        );
      })}

      {quoted && (
        <Paper
          id={`slip-${quoted.slug}`}
          tear={3.5}
          depth={1}
          className={`${styles.item} ${styles.slip}`}
          innerClassName={styles.slipPaper}
          style={{ "--x": `${place(projects.length > 3 ? 30 : 16, 30)}%`, "--y": 700, "--w": "30%", "--z": 10 } as React.CSSProperties}
        >
          <p>{quoted.teaser}</p>
          <span className="hand">from {quoted.title}</span>
        </Paper>
      )}

      {!projects.length && <p className={`${styles.item} hand`}>{words.emptySection}</p>}
    </Weave>
  );
}
