import styles from "./Wave.module.css";

// Text that ripples when you hover it: each letter hops up and back down a
// beat after the one before, like a little wave. With `always`, it keeps
// rippling on its own every couple of seconds. Screen readers get the plain
// words.
export default function Wave({ text, className, always = false }: { text: string; className?: string; always?: boolean }) {
  return (
    <span className={`${styles.wave} ${always ? styles.always : ""} ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <span key={i} className={styles.letter} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
          {ch}
        </span>
      ))}
    </span>
  );
}
