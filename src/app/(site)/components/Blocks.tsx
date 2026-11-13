import { paragraphs, type Block } from "@/content/load";
import Frame from "./Frame";
import styles from "./Blocks.module.css";

// The stack of blocks Ona builds in the editing room, in her order.
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className={styles.blocks}>
      {blocks.map((b, i) => (
        <section key={i} className={`${styles.block} ${styles[b.kind]}`}>
          <BlockBody block={b} />
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

function BlockBody({ block: b }: { block: Block }) {
  switch (b.kind) {
    case "photo":
      return <Frame src={b.image} caption={b.caption} className={styles[b.size]} />;
    case "scatter":
      return (
        <>
          <div className={styles.scatterPhotos}>
            {b.photos.map((p, i) => (
              <Frame key={i} src={p.image} caption={p.caption} />
            ))}
          </div>
          {b.note && <p className={styles.hand}>{b.note}</p>}
        </>
      );
    case "sketchbook":
      return (
        <>
          <div className={styles.pages}>
            {b.pages.map((p, i) => (
              <Frame key={i} src={p.image} caption={p.caption} />
            ))}
          </div>
          {b.note && <Paragraphs text={b.note} className={styles.prose} />}
        </>
      );
    case "process":
      return (
        <>
          {b.title && <h2 className={styles.heading}>{b.title}</h2>}
          <ol className={styles.steps}>
            {b.steps.map((s, i) => (
              <li key={i}>
                <Frame src={s.image} caption={s.note} />
              </li>
            ))}
          </ol>
        </>
      );
    case "experiments":
      return (
        <>
          {b.title && <h2 className={styles.heading}>{b.title}</h2>}
          <div className={styles.grid}>
            {b.items.map((p, i) => (
              <Frame key={i} src={p.image} caption={p.caption} />
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
      return <Paragraphs text={b.text} className={styles[`note_${b.style}`]} />;
    case "poem":
      return (
        <>
          {b.image && <Frame src={b.image} />}
          <div>
            {b.title && <h2 className={styles.poemTitle}>{b.title}</h2>}
            <Paragraphs text={b.lines} className={styles.lines} />
            {b.note && <Paragraphs text={b.note} className={styles.prose} />}
          </div>
        </>
      );
    case "outcome":
      return (
        <>
          {b.title && <h2 className={styles.heading}>{b.title}</h2>}
          <Frame src={b.image} caption={b.caption} />
        </>
      );
  }
}
