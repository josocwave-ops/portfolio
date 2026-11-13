import { getSite } from "@/content/load";
import styles from "./Frame.module.css";

// A photo on a print, or an empty frame (with a little note) when no photo has been added yet.
export default function Frame({
  src,
  caption,
  alt = "",
  eager = false,
  className,
}: {
  src: string | null;
  caption?: string;
  alt?: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <figure className={`${styles.frame} ${className ?? ""}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- uploaded photos have no known size, so a plain img keeps their shape
        <img src={src} alt={alt || caption || ""} loading={eager ? "eager" : "lazy"} />
      ) : (
        <span className={styles.empty}>{getSite().words.emptyPhoto}</span>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
