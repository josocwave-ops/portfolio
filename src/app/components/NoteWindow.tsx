import Pixel from "./Pixel";
import Stitch from "./Stitch";
import styles from "./NoteWindow.module.css";

// A little window with a title bar: the site's one frame for everything
// (the hello note, category folders, featured projects), so it all matches.
// Every window lifts onto a bigger pixel shadow when you hover it; inside a
// link a sparkle also appears in the title bar.
export default function NoteWindow({
  title,
  meta,
  children,
  className,
  bodyClassName,
  flush = false,
  label = true,
  trim = false,
  loading = false,
}: {
  title: string;
  /** small text on the right of the title bar, e.g. "10 files" */
  meta?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** no padding in the body, for photos that run edge to edge */
  flush?: boolean;
  /** set false when the window sits inside a link that already has a name */
  label?: boolean;
  /** the little extras for a few special windows: cross-stitch swirls in two
      corners, a fairy sitting on top, and a couple of twinkling stars */
  trim?: boolean;
  /** the three title-bar dots light up pink one by one, then reset,
      like a little loading bar */
  loading?: boolean;
}) {
  const win = (
    <div
      className={`${styles.wrap} lift hover-lift ${trim ? "" : (className ?? "")}`}
      role={label ? "region" : undefined}
      aria-label={label ? title : undefined}
    >
      <div className={`${styles.note} px-frame`}>
        <div className={`${styles.bar} pixel`} aria-hidden="true">
          <span className={styles.title}>{title}</span>
          {meta && <span className={styles.meta}>{meta}</span>}
          <Pixel name="sparkle" size={2} className={styles.spark} />
          <span className={`${styles.dots} ${loading ? styles.loading : ""}`}>
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className={`${styles.body} ${flush ? styles.flush : ""} ${bodyClassName ?? ""}`}>{children}</div>
      </div>
    </div>
  );
  if (!trim) return win;
  return (
    <div className={`${styles.trimmed} ${className ?? ""}`}>
      <span className={`${styles.trim} ${styles.swirlTl}`} aria-hidden="true">
        <Stitch name="swirl" size={4} />
      </span>
      <span className={`${styles.trim} ${styles.swirlBr}`} aria-hidden="true">
        <Stitch name="swirl" size={4} />
      </span>
      <span className={`${styles.trim} ${styles.fairy}`} aria-hidden="true">
        <Pixel name="fairy" size={3} color="var(--pink-ink)" />
      </span>
      <span className={`${styles.trim} ${styles.starA}`} aria-hidden="true">
        <Pixel name="star8" size={2} color="var(--rose)" twinkle />
      </span>
      <span className={`${styles.trim} ${styles.starB}`} aria-hidden="true">
        <Pixel name="sparkle" size={2} color="var(--peri)" twinkle />
      </span>
      {win}
    </div>
  );
}
