import styles from "./Wave.module.css";

// Text that ripples when you hover it: each letter hops up and back down a
// beat after the one before, like a little wave. Screen readers get the
// plain words.
export default function Wave({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`${styles.wave} ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <span key={i} className={styles.letter} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
          {ch}
        </span>
      ))}
    </span>
  );
}
