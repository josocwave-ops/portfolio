import { getSite } from "@/content/load";
import styles from "./Loading.module.css";

// While a page loads: a little row of cross-stitches sewing themselves, then the loading words.
export default function Loading() {
  return (
    <div className={styles.wrap} role="status">
      <svg viewBox="0 0 80 10" className={styles.row} aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${i * 10 + 1.5} 1.5 l7 7 m0 -7 l-7 7`} style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </svg>
      <p className="hand">{getSite().words.loading}</p>
    </div>
  );
}
