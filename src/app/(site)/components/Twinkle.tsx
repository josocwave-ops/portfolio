import styles from "./Twinkle.module.css";

// A tiny four-pointed sparkle, slightly lopsided like it was inked by hand.
export default function Twinkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-12 -12 24 24" className={`${styles.twinkle} ${className ?? ""}`} style={style} aria-hidden="true">
      <path d="M0.4 -10.5 C 1.2 -3.6, 2.4 -1.6, 9.6 -0.6 C 2.6 0.9, 1.1 2.6, -0.2 10.8 C -1.3 2.8, -2.8 1.2, -10.2 0.3 C -2.9 -1.1, -1.4 -2.7, 0.4 -10.5 Z" />
    </svg>
  );
}
