import { links } from "@/content/work";
import Cute from "./Cute";
import Pixel from "./Pixel";
import styles from "./Postcard.module.css";

// The contact page: a pixel postcard. A note on the left, the ways to reach
// ona written on the address lines on the right, a night-sky stamp and a
// round postmark, all in the pixel type. It sits on the same chunky shadow
// as the windows and lifts when you hover it.
// TODO(Ona): the note is a draft; write it in your own words.
export default function Postcard() {
  return (
    <div className={`${styles.wrap} lift hover-lift`}>
      <article className={`${styles.card} px-frame`}>
        <p className={`${styles.heading} pixel`} aria-hidden="true">
          ✦ p o s t &nbsp; c a r d ✦
        </p>

        <div className={`${styles.note} pixel`}>
          <p>dear you,</p>
          <p>
            <Cute text="for commissions, collaborations, or just to say hi, i'd love to hear from you :)" />
          </p>
          <p className={styles.sign}>
            <Cute text="love, ona <3" />
          </p>
          {/* a little flower row; every other one bobs, like the rest of the site */}
          <span className={`${styles.doodle} bob-row`} aria-hidden="true">
            <Pixel name="tulip" size={2} color="var(--rose)" />
            <Pixel name="daisy" size={2} color="var(--lilac)" />
            <Pixel name="bluebell" size={2} color="var(--peri)" />
            <Pixel name="tulip" size={2} color="var(--pink)" />
            <Pixel name="daisy" size={2} color="var(--mist)" />
          </span>
        </div>

        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.side}>
          {/* the stamp: a little night sky with perforated edges */}
          <span className={styles.stamp} aria-hidden="true">
            <span className={styles.stampArt}>
              <Pixel name="moon" size={3} color="var(--pink)" />
              <Pixel name="star8" size={2} color="var(--paper)" className={styles.stampStar} />
              <span className="pixel">onA post</span>
            </span>
          </span>
          {/* the postmark, stamped over the corner */}
          <svg className={styles.postmark} viewBox="0 0 110 64" aria-hidden="true">
            <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="32" cy="32" r="17" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="32" y="30" textAnchor="middle" className={styles.markText}>
              onA
            </text>
            <text x="32" y="40" textAnchor="middle" className={styles.markSmall}>
              &lt;3 2026
            </text>
            <path
              d="M60 20 h8 v-3 h8 v3 h8 v-3 h8 v3 h8 M60 30 h8 v-3 h8 v3 h8 v-3 h8 v3 h8 M60 40 h8 v-3 h8 v3 h8 v-3 h8 v3 h8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>

          {/* the address lines */}
          <ul className={styles.lines}>
            <li>
              <a href={`mailto:${links.email}`} className="pixel">
                <Pixel name="envelope" size={2} color="var(--rose)" />
                {links.email}
              </a>
              <small>email</small>
            </li>
            <li>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="pixel">
                <Pixel name="heart" size={2} color="var(--peri)" />
                @claybyona
              </a>
              <small>instagram</small>
            </li>
            <li>
              <a href={links.shop} target="_blank" rel="noopener noreferrer" className="pixel">
                <Pixel name="vase" size={2} color="var(--blue)" />
                claybyona.com
              </a>
              <small>the shop</small>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
}
