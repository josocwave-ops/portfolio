import type { StickerDef } from "@/content/load";
import { rng } from "../lib/scatter";
import Sticker from "./Sticker";
import styles from "./MarginStickers.module.css";

// Stickers tucked into the margins, alternating sides, behind the content so they never cover the work.
export default function MarginStickers({ id, stickers }: { id: string; stickers: StickerDef[] }) {
  if (!stickers.length) return null;
  return (
    <div className={styles.layer} aria-hidden="true">
      {stickers.map((s, i) => {
        const r = rng(`${id}${s.slug}${i}`);
        const left = (i + (r() < 0.5 ? 0 : 1)) % 2 === 0;
        const top = 8 + ((i + 0.5) / stickers.length) * 76 + (r() - 0.5) * 10;
        return (
          <div
            key={`${s.slug}${i}`}
            className={styles.spot}
            data-depth={(0.4 + r() * 0.6).toFixed(2)}
            style={{
              top: `${top.toFixed(1)}%`,
              [left ? "left" : "right"]: `${(0.5 + r() * 4).toFixed(1)}%`,
              width: `${Math.round(56 + r() * 34)}px`,
              rotate: `${((r() - 0.5) * 40).toFixed(1)}deg`,
            }}
          >
            <Sticker sticker={s} />
          </div>
        );
      })}
    </div>
  );
}
