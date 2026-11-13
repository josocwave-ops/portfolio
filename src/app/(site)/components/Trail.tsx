import Link from "next/link";
import Twinkle from "./Twinkle";
import styles from "./Trail.module.css";

// "home ✦ ceramics ✦ the memory cup project": a little trail so nobody gets lost.
export default function Trail({ steps }: { steps: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="You are here" className={`${styles.trail} hand`}>
      {steps.map((s, i) => (
        <span key={s.label + i} className={styles.step}>
          {i > 0 && <Twinkle className={styles.sep} />}
          {s.href ? (
            <Link href={s.href}>{s.label}</Link>
          ) : (
            <span aria-current="page">{s.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
