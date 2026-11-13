import { paragraphs, type Block } from "@/content/load";
import { tilt } from "../lib/scatter";
import Paper from "./Paper";
import Print from "./Print";
import styles from "./Blocks.module.css";

const TAPE = "var(--mood-tape)";

// The stack of blocks built in the editing room, in her order, each as a piece of the scrapbook.
export default function Blocks({ id, blocks }: { id: string; blocks: Block[] }) {
  return (
    <div className={styles.blocks}>
      {blocks.map((b, i) => (
        <section key={i} className={`${styles.block} ${styles[b.kind]}`}>
          <BlockBody block={b} id={`${id}-${i}`} />
        </section>
      ))}
    </div>
  );
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {paragraphs(text).map((p) => (
        <p key={p.slice(0, 32)}>{p}</p>
      ))}
    </div>
  );
}

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 120 60" aria-hidden="true">
      <path d="M4 10 C 30 50, 70 56, 108 30 M96 24 L109 29 L101 41" />
    </svg>
  );
}

function BlockBody({ block: b, id }: { block: Block; id: string }) {
  switch (b.kind) {
    case "photo":
      return (
        <div className={styles[b.size]} data-depth={b.size === "small" ? "0.6" : "0.35"}>
          <Print id={id} image={b.image} caption={b.caption} tape={TAPE} fix={b.size === "small" ? "corners" : "tape"} maxTilt={b.size === "full" ? 1.2 : 3} />
        </div>
      );

    case "scatter":
      return (
        <>
          <div className={styles.tossed}>
            {b.photos.map((p, i) => (
              <div key={i} className={styles.toss} data-depth={(0.3 + (i % 3) * 0.25).toFixed(2)}>
                <Print id={`${id}-${i}`} image={p.image} caption={p.caption} tape={TAPE} fix={i % 3 === 1 ? "corners" : "tape"} maxTilt={6} />
              </div>
            ))}
          </div>
          {b.note && (
            <p className={`${styles.margin} hand`}>
              <Arrow />
              {b.note}
            </p>
          )}
        </>
      );

    case "sketchbook":
      return (
        <Paper id={id} tear={2.5} depth={0.4} innerClassName={styles.book}>
          <div className={styles.pages}>
            {b.pages.map((p, i) => (
              <div key={i} style={{ rotate: `${tilt(`${id}${i}`, 3)}deg` }}>
                <Print id={`${id}-${i}`} image={p.image} caption={p.caption} tape={TAPE} depth={0.15} maxTilt={0.1} />
              </div>
            ))}
          </div>
          {b.note && <Paragraphs text={b.note} className={`${styles.bookNote} hand`} />}
        </Paper>
      );

    case "process":
      return (
        <>
          {b.title && <h2 className={styles.heading}>{b.title}</h2>}
          <ol className={styles.strip}>
            {b.steps.map((s, i) => (
              <li key={i}>
                <span className={`${styles.step} hand`}>{i + 1}</span>
                <Print id={`${id}-${i}`} image={s.image} fix={i % 2 ? "none" : "tape"} tape={TAPE} depth={0.3} maxTilt={2.5} />
                {s.note && <p className="hand">{s.note}</p>}
              </li>
            ))}
          </ol>
        </>
      );

    case "experiments":
      return (
        <>
          {b.title && (
            <Paper id={`${id}-label`} tear={1.5} depth={0.3} className={styles.label} innerClassName={styles.labelInner}>
              {b.title}
            </Paper>
          )}
          <div className={styles.contact}>
            {b.items.map((p, i) => (
              <Print key={i} id={`${id}-${i}`} image={p.image} caption={p.caption} crop="square" fix={i % 2 ? "none" : "tape"} tape={TAPE} depth={0.3} maxTilt={4} />
            ))}
          </div>
        </>
      );

    case "text":
      return (
        <>
          {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
          <Paragraphs text={b.body} className={styles.prose} />
        </>
      );

    case "note":
      if (b.style === "hand")
        return (
          <p className={`${styles.margin} hand`}>
            <Arrow />
            {b.text}
          </p>
        );
      return (
        <Paper id={id} tear={b.style === "typed" ? 1.5 : 3.5} depth={0.7} className={b.style === "typed" ? styles.typed : styles.slip} innerClassName={styles.slipInner}>
          <Paragraphs text={b.text} />
        </Paper>
      );

    case "poem":
      return (
        <div className={`${styles.poemWrap} ${b.image ? styles.withImage : ""}`}>
          {b.image && (
            <div data-depth="0.5">
              <Print id={`${id}-img`} image={b.image} tape={TAPE} maxTilt={4} />
            </div>
          )}
          <Paper id={id} tear={3} depth={0.4} innerClassName={styles.poemPage} style={{ rotate: `${tilt(id, 1.6)}deg`, translate: `${tilt(`x${id}`, 5)}% 0` }}>
            {b.title && <h2 className={styles.poemTitle}>{b.title}</h2>}
            <Paragraphs text={b.lines} className={styles.lines} />
            {b.note && <Paragraphs text={b.note} className={styles.poemNote} />}
          </Paper>
        </div>
      );

    case "outcome":
      return (
        <>
          <p className={`${styles.finalLabel} hand`}>{b.title || "final outcome"}</p>
          <div data-depth="0.4">
            <Print id={id} image={b.image} caption={b.caption} tape={TAPE} fix="corners" depth={0.8} maxTilt={1.5} />
          </div>
        </>
      );
  }
}
