import Link from "next/link";
import Pixel, { type SpriteName } from "./Pixel";
import styles from "./Folder.module.css";

// A pixel file folder: a tab with a name on it, a back flap, a photo (or
// two) tucked inside, and a front pocket with the title. Hover it and the
// photo inside peeks up and the tab gives a little wiggle. Coloured by its section: --fc is the pastel front,
// --fd the deeper back and tab.
export default function Folder({
  href,
  tab,
  title,
  meta,
  sprite,
  color,
  deep,
  photo,
  photoBehind,
  small = false,
  twinkle,
}: {
  href: string;
  tab: string;
  title: string;
  meta?: string;
  sprite?: SpriteName;
  color: string;
  deep: string;
  /** what's tucked inside: a photo, a placeholder or a scrap of a poem */
  photo: React.ReactNode;
  /** a second paper behind the first, peeking out at an angle */
  photoBehind?: React.ReactNode;
  small?: boolean;
  /** when (in seconds) this folder's little star takes its turn to twinkle */
  twinkle?: number;
}) {
  return (
    <Link href={href} className={`${styles.link} lift`} style={{ "--fc": color, "--fd": deep } as React.CSSProperties} data-sfx="blip">
      <span className={`${styles.fold} ${small ? styles.small : ""}`}>
        <span className={`${styles.tab} pixel`}>{tab}</span>
        <span className={styles.back} />
        {photoBehind && <span className={`${styles.peek} ${styles.behind}`}>{photoBehind}</span>}
        <span className={styles.peek}>{photo}</span>
        {twinkle !== undefined && (
          <span className={styles.twinkle} style={{ animationDelay: `${twinkle}s` }} aria-hidden="true">
            <Pixel name="star8" size={2} color="var(--paper)" />
          </span>
        )}
        <span className={styles.front}>
          <span className={`${styles.title} pixel`}>
            {sprite && <Pixel name={sprite} size={3} color="var(--navy)" className={styles.sprite} />}
            {title}
          </span>
          {meta && <span className={styles.meta}>{meta}</span>}
        </span>
      </span>
    </Link>
  );
}
