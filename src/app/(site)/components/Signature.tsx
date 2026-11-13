import { getSite } from "@/content/load";
import styles from "./Signature.module.css";

// "book + hand": a printed italic "on" tucked against a hand-drawn A.
export default function Signature({ size = "large" }: { size?: "large" | "small" }) {
  const { name } = getSite();
  const surname = name.split(" ").slice(1).join(" ").toLowerCase();
  return (
    <span className={`${styles.sig} ${styles[size]}`}>
      <span className={styles.on} aria-hidden="true">
        on
      </span>
      <span className={styles.a} aria-hidden="true">
        A
      </span>
      {size === "large" && surname && (
        <span className={styles.surname} aria-hidden="true">
          {surname}
        </span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}
