import Link from "next/link";
import { getSite } from "@/content/load";
import { tapeColour, tilt, torn } from "../lib/scatter";
import { HandCircle, Paperclip, PixelSpark } from "./Ornaments";
import styles from "./Print.module.css";

export type Fix = "tape" | "clip" | "crop" | "stitch" | "pin" | "corners" | "none";
export type CircleSpot = "none" | "top-left" | "top-right" | "middle" | "bottom-left" | "bottom-right";

// A photo on photo paper: a little tilted, held on with tape, a paperclip, a pin or stitches,
// or framed by printer's crop marks. With no photo yet, it's an empty frame with a note
// (only you will see those, on drafts). Optionally a hand-drawn circle around part of it.
export default function Print({
  id,
  image,
  caption,
  note,
  href,
  alt,
  crop,
  fix = "tape",
  tape,
  draft,
  depth = 0.5,
  maxTilt = 3,
  eager,
  fig,
  circle = "none",
  className,
  style,
}: {
  id: string;
  image: string | null;
  caption?: string;
  note?: string;
  href?: string;
  alt?: string;
  /** crop to a fixed shape (galleries) instead of keeping the photo's own shape */
  crop?: "portrait" | "square" | "landscape";
  fix?: Fix;
  tape?: string;
  draft?: boolean;
  depth?: number;
  maxTilt?: number;
  eager?: boolean;
  /** a little pixel "fig. 3" label under the photo */
  fig?: number;
  circle?: CircleSpot;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = getSite().words;
  const body = (
    <>
      {fix === "tape" && <span className="tape" style={{ "--tape": tape ?? tapeColour(id), "--tr": `${tilt(`t${id}`, 6)}deg` } as React.CSSProperties} />}
      {fix === "clip" && <Paperclip className={styles.clip} style={{ rotate: `${tilt(`c${id}`, 10)}deg` }} />}
      {fix === "pin" && <span className={styles.pin} aria-hidden="true" />}
      {draft && <span className="draft-tag">draft · only you can see this</span>}
      <span className={`lift ${fix === "crop" ? styles.crop : ""}`} style={{ "--d": depth } as React.CSSProperties}>
        <span className={`paper ${styles.frame} ${fix === "stitch" ? styles.stitched : ""}`} style={fix === "stitch" ? undefined : { clipPath: torn(id, 1.3, 30) }}>
          <span className={`${styles.photo} ${crop ? styles[crop] : ""}`}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element -- uploaded photos have no known size, so a plain img keeps their shape
              <img src={image} alt={alt ?? caption ?? ""} loading={eager ? "eager" : "lazy"} />
            ) : (
              <span className={`${styles.empty} hand`}>{words.emptyPhoto}</span>
            )}
            {circle !== "none" && <HandCircle className={`${styles.circle} ${styles[`c-${circle}`]}`} />}
          </span>
          {(caption || note) && (
            <span className={styles.caption}>
              {caption && <span className="hand">{caption}</span>}
              {note && <small>{note}</small>}
            </span>
          )}
        </span>
      </span>
      {fig !== undefined && <span className={`${styles.fig} pixel`}>fig. {fig}</span>}
      {href && words.peek && <span className={`${styles.peek} hand`}>{words.peek}</span>}
      {href && <PixelSpark className={styles.spark} />}
    </>
  );
  const cls = `${styles.print} ${fix === "corners" ? "corners" : ""} ${href ? styles.link : ""} ${className ?? ""}`;
  const st = { "--tilt": `${tilt(id, maxTilt)}deg`, ...style } as React.CSSProperties;
  return href ? (
    <Link href={href} className={cls} style={st}>
      {body}
    </Link>
  ) : (
    <figure className={cls} style={st}>
      {body}
    </figure>
  );
}
