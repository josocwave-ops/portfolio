import { DottedVine, FiligreeCorner } from "./Ornaments";
import styles from "./PageInk.module.css";

// Hand-drawn ink in a page's margins, chosen by the project's mood:
// "spiral" = inky filigree corners, "wavy" = a stitched vine, "none" = nothing.
export default function PageInk({ kind, seed, colour }: { kind: string; seed: string; colour?: string }) {
  if (kind === "none") return null;
  return (
    <div className={styles.layer} aria-hidden="true">
      {kind === "wavy" ? (
        <>
          <DottedVine seed={`${seed}a`} colour={colour} className={styles.vineTop} />
          <DottedVine seed={`${seed}b`} colour="#c4b3e0" className={styles.vineSide} />
        </>
      ) : (
        <>
          <FiligreeCorner colour={colour} className={`${styles.corner} ${styles.tl}`} />
          <FiligreeCorner colour={colour} className={`${styles.corner} ${styles.tr}`} />
        </>
      )}
    </div>
  );
}
