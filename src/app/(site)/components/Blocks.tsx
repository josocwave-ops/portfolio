import { paragraphs, type Block } from "@/content/load";
import { tilt } from "../lib/scatter";
import { HandArrow, Stitch } from "./Ornaments";
import Paper from "./Paper";
import PoemSpiral from "./PoemSpiral";
import Print, { type CircleSpot, type Fix } from "./Print";
import styles from "./Blocks.module.css";

const TAPE = "var(--mood-tape)";
// tape, paperclips and crop marks most of all; stitches now and then
const MIX: Fix[] = ["tape", "clip", "crop", "tape", "stitch", "clip"];

// The stack of blocks built in the editing room, in her order, each as a piece of the scrapbook.
// Photos are numbered as little pixel "fig." labels as you go down the page.
export default function Blocks({ id, blocks }: { id: string; blocks: Block[] }) {
  let fig = 0;
  const nextFig = () => ++fig;
  return (
    <div className={styles.blocks}>
      {blocks.map((b, i) => (
        <section key={i} className={`${styles.block} ${styles[b.kind]}`}>
          <BlockBody block={b} id={`${id}-${i}`} nextFig={nextFig} />
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

/** A handwritten note with a hand-drawn arrow, for scribbling beside a photo. */
function Scribble({ text, flip }: { text: string; flip?: boolean }) {
  return (
    <p className={`${styles.scribble} ${flip ? styles.flip : ""} hand`}>
      <HandArrow className={styles.scribbleArrow} />
      {text}
    </p>
  );
}

function BlockBody({ block: b, id, nextFig }: { block: Block; id: string; nextFig: () => number }) {
  switch (b.kind) {
    case "photo": {
      const fix: Fix = b.size === "full" ? "crop" : b.size === "small" ? "clip" : "tape";
      return (
        <div className={`${styles[b.size]} ${b.note ? styles.withScribble : ""}`}>
          <div data-depth={b.size === "small" ? "0.6" : "0.35"}>
            <Print id={id} image={b.image} caption={b.caption} tape={TAPE} fix={fix} fig={nextFig()} circle={b.circle as CircleSpot} maxTilt={b.size === "full" ? 1.2 : 3} />
          </div>
          {b.note && <Scribble text={b.note} flip={b.size === "small"} />}
        </div>
      );
    }

    case "scatter":
      return (
        <>
          <div className={styles.tossed}>
            {b.photos.map((p, i) => (
              <div key={i} className={styles.toss} data-depth={(0.3 + (i % 3) * 0.25).toFixed(2)}>
                <Print id={`${id}-${i}`} image={p.image} caption={p.caption} tape={TAPE} fix={MIX[i % MIX.length]} fig={nextFig()} maxTilt={6} />
              </div>
            ))}
          </div>
          {b.note && <Scribble text={b.note} />}
        </>
      );

    case "sketchbook":
      return (
        <Paper id={id} tear={2.5} depth={0.4} innerClassName={styles.book}>
          <div className={styles.pages}>
            {b.pages.map((p, i) => (
              <div key={i} style={{ rotate: `${tilt(`${id}${i}`, 3)}deg` }}>
                <Print id={`${id}-${i}`} image={p.image} caption={p.caption} tape={TAPE} fix={i % 2 ? "clip" : "tape"} depth={0.15} maxTilt={0.1} />
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
                <span className={`${styles.step} pixel`}>{String(i + 1).padStart(2, "0")}</span>
                <Print id={`${id}-${i}`} image={s.image} fix={i % 2 ? "clip" : "tape"} tape={TAPE} depth={0.3} maxTilt={2.5} />
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
            <Paper id={`${id}-label`} tear={1.5} depth={0.3} className={styles.label} innerClassName={`${styles.labelInner} pixel`}>
              {b.title}
            </Paper>
          )}
          <div className={styles.contact}>
            {b.items.map((p, i) => (
              <Print key={i} id={`${id}-${i}`} image={p.image} caption={p.caption} crop="square" fix={MIX[(i + 2) % MIX.length]} tape={TAPE} depth={0.3} fig={nextFig()} maxTilt={4} />
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
      if (b.style === "hand") return <Scribble text={b.text} />;
      return (
        <Paper id={id} tear={b.style === "typed" ? 1.5 : 3.5} depth={0.7} className={b.style === "typed" ? styles.typed : styles.slip} innerClassName={styles.slipInner}>
          {b.style === "typed" && <Stitch pattern="heart" mode="pixel" colour="#e391b2" className={styles.heart} />}
          <Paragraphs text={b.text} />
        </Paper>
      );

    case "poem":
      if (b.shape === "spiral") return <PoemSpiral title={b.title} lines={b.lines} note={b.note} />;
      return (
        <div className={`${styles.poemWrap} ${b.image ? styles.withImage : ""}`}>
          {b.image && (
            <div data-depth="0.5">
              <Print id={`${id}-img`} image={b.image} tape={TAPE} fix="clip" maxTilt={4} />
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
          <p className={`${styles.finalLabel} pixel`}>{b.title || "final outcome"}</p>
          <div className={b.note ? styles.withScribble : ""}>
            <div data-depth="0.4">
              <Print id={id} image={b.image} caption={b.caption} tape={TAPE} fix="stitch" depth={0.8} fig={nextFig()} circle={b.circle as CircleSpot} maxTilt={1.5} />
            </div>
            {b.note && <Scribble text={b.note} />}
          </div>
        </>
      );
  }
}
