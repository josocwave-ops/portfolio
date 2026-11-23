import styles from "./Cute.module.css";

// Draws little text faces and hearts (:) :D ^_^ <3 ☆) in pink pixel type,
// so they look like they were typed on an old personal website.
const FACES = /(:\)|:D|:3|;\)|\^_\^|<3|♡|☆|✧)/g;

export default function Cute({ text }: { text: string }) {
  const parts = text.split(FACES);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={`${styles.face} ${part === "<3" || part === "♡" ? styles.heart : ""} pixel`}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
