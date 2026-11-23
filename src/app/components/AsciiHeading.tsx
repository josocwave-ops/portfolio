import styles from "./AsciiHeading.module.css";

// A section heading flanked by typed sparkle-lines, old-personal-website style:
//   .:*~*:._.:*~*:.  ✿ featured projects ✿  .:*~*:._.:*~*:.
const LINE = ".:*~*:._".repeat(16);

export default function AsciiHeading({
  children,
  id,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  id?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag id={id} className={`${styles.h} ${className ?? ""}`}>
      <span className={styles.line} aria-hidden="true">
        {LINE}
      </span>
      <span className={`${styles.text} pixel`}>
        <span aria-hidden="true">✿ </span>
        {children}
        <span aria-hidden="true"> ✿</span>
      </span>
      <span className={`${styles.line} ${styles.right}`} aria-hidden="true">
        {LINE}
      </span>
    </Tag>
  );
}
