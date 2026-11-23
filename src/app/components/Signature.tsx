import { serif } from "../fonts";
import AsciiName from "./AsciiName";
import styles from "./Signature.module.css";

// The onA signature, drawn as ASCII art (bars and dashes, like the lily),
// with "cabedo wells" typed underneath.
export default function Signature({ size = "large" }: { size?: "large" | "small" }) {
  const large = size === "large";
  return (
    <span className={styles.sig}>
      <AsciiName
        fontFamily={serif.style.fontFamily}
        italic
        weight={800}
        size={large ? 96 : 26}
        pitch={large ? 3 : 2}
        className={styles.ascii}
      />
      {large && <span className={`${styles.surname} pixel`}>cabedo wells</span>}
    </span>
  );
}
