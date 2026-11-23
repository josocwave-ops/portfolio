import { site } from "@/content/work";
import Cute from "./Cute";
import styles from "./Ticker.module.css";

// A slow scrolling "currently…" strip, like an old marquee. The text lives in
// src/content/work.ts (site.ticker) so it's easy to change.
export default function Ticker() {
  const text = site.ticker;
  return (
    <div className={`${styles.ticker} pixel`}>
      <span className="sr-only">{text}</span>
      <div className={styles.track} aria-hidden="true">
        {/* two copies, so the loop is seamless */}
        <span>
          <Cute text={text} />
        </span>
        <span>
          <Cute text={text} />
        </span>
      </div>
    </div>
  );
}
