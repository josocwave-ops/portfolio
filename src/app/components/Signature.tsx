import { serif } from "../fonts";
import AsciiName from "./AsciiName";
import styles from "./Signature.module.css";

// The onA signature, drawn as ASCII art (bars and dashes, like the lily),
// with "cabedo wells" typed underneath.
// tone "light" prints it in paper and pink, for dark bars.
export default function Signature({ size = "large", tone = "ink" }: { size?: "large" | "small"; tone?: "ink" | "light" }) {
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
        {...(tone === "light" ? { color: "#fff8f8", edgeColor: "#e8b5d0" } : {})}
      />
      {large && <span className={`${styles.surname} pixel`}>cabedo wells</span>}
    </span>
  );
}
