import Pixel from "./Pixel";
import styles from "./NoteWindow.module.css";

// A little window with a title bar: the site's one frame for everything
// (the hello note, category folders, featured projects), so it all matches.
// Inside a link, it lifts onto a pixel shadow on hover and a sparkle appears
// in the title bar.
export default function NoteWindow({
  title,
  meta,
  children,
  className,
  bodyClassName,
  flush = false,
  label = true,
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
}) {
  return (
    <div
      className={`${styles.wrap} lift ${className ?? ""}`}
      role={label ? "region" : undefined}
      aria-label={label ? title : undefined}
    >
      <div className={`${styles.note} px-frame`}>
        <div className={`${styles.bar} pixel`} aria-hidden="true">
          <span className={styles.title}>{title}</span>
          {meta && <span className={styles.meta}>{meta}</span>}
          <Pixel name="sparkle" size={2} className={styles.spark} />
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className={`${styles.body} ${flush ? styles.flush : ""} ${bodyClassName ?? ""}`}>{children}</div>
      </div>
    </div>
  );
}
