import styles from "./Signature.module.css";

export default function Signature({ size = "large" }: { size?: "large" | "small" }) {
  return (
    <span className={`${styles.sig} ${styles[size]}`}>
      <span className={styles.on}>on</span>
      <span className={styles.a}>A</span>
      {size === "large" && <span className={styles.surname}>cabedo wells</span>}
      <span className="sr-only">Ona Cabedo Wells</span>
    </span>
  );
}
