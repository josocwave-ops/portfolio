import { serif } from "../fonts";
import AsciiName from "./AsciiName";
import { LARGE, SMALL } from "./signatureArt";
import Wave from "./Wave";
import styles from "./Signature.module.css";

// The onA signature, drawn in pixels, with "cabedo wells" typed underneath.
// Both sizes are "strawberry milk": solid soft pink, a deeper pink outline and
// a little shine along the top/left edges. The small header one is too thin
// for an outline, so it gets the deeper pink only on its bottom/right edges.
// Both are pre-drawn (signatureArt.ts) so the name is there the moment the
// page loads.
export default function Signature({ size = "large" }: { size?: "large" | "small" }) {
  const large = size === "large";
  return (
    <span className={styles.sig}>
      <AsciiName
        fontFamily={serif.style.fontFamily}
        italic
        weight={800}
        size={large ? 96 : 32}
        pitch={large ? 3 : 2}
        art={large ? LARGE : SMALL}
        className={styles.ascii}
        fill="solid"
        color="#f7c4db"
        edgeColor="#d0709f"
        shine="#fff6fa"
        smallShade={!large}
      />
      {large && (
        <span className={`${styles.surname} pixel`}>
          <Wave text="cabedo wells" always />
        </span>
      )}
    </span>
  );
}
