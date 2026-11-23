// TEMPORARY: a page for choosing the look of the site. Delete once Ona has picked.
import type { Metadata } from "next";
import { Bodoni_Moda, Jacquard_24, Jacquarda_Bastarda_9, Pinyon_Script, Pixelify_Sans, Silkscreen } from "next/font/google";
import AsciiName from "../components/AsciiName";
import Background, { type BackgroundKind } from "../components/Background";
import Divider from "../components/Divider";
import NoteWindow from "../components/NoteWindow";
import Pixel, { type SpriteName } from "../components/Pixel";
import SiteHeader from "../components/SiteHeader";
import WebButtons from "../components/WebButtons";
import SparkleTrail from "./SparkleTrail";
import styles from "./style.module.css";

export const metadata: Metadata = { title: "style picker", robots: { index: false } };

const bodoni = Bodoni_Moda({ subsets: ["latin"], style: "italic", weight: ["400", "800"] });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400" });
const jacquarda = Jacquarda_Bastarda_9({ subsets: ["latin"], weight: "400" });
const jacquard = Jacquard_24({ subsets: ["latin"], weight: "400" });
const pixelify = Pixelify_Sans({ subsets: ["latin"] });
const silkscreen = Silkscreen({ subsets: ["latin"], weight: "400" });

// a name drawn in a font, in the onA layout (small "on", big "A")
function FontName({ className, size = 56 }: { className: string; size?: number }) {
  return (
    <span className={`${styles.mark} ${className}`} style={{ fontSize: size }}>
      <span className={styles.on}>on</span>
      <span className={styles.a}>A</span>
    </span>
  );
}

const BACKGROUNDS: { id: string; name: string; note: string; kinds: BackgroundKind[] }[] = [
  {
    id: "B1",
    name: "dot-matrix flourishes",
    note: "Victorian corner scrolls drawn in tiny dots, with crop marks (like your grey filigree pins). On the site now.",
    kinds: ["flourish", "cropmarks"],
  },
  {
    id: "B2",
    name: "text-mode lily",
    note: "a pink lily drawn in little bars and dashes, like ASCII art (your pink lily pin)",
    kinds: ["ascii-lily", "cropmarks"],
  },
  {
    id: "B3",
    name: "cross-stitch lilies",
    note: "big pixel lilies growing in from the edges (your magazine page pin)",
    kinds: ["stitch-lily"],
  },
  { id: "B4", name: "halftone corners", note: "printed dots growing into two corners", kinds: ["halftone"] },
  {
    id: "B5",
    name: "my virtual garden",
    note: "chrome stars, a bead chain and a tassel, plus sparkles (your iridescent pin)",
    kinds: ["chrome", "sparkles"],
  },
  { id: "B6", name: "flourishes + halftone", note: "B1 and B4 together", kinds: ["flourish", "halftone"] },
  { id: "B7", name: "stitch lilies + halftone", note: "B3 and B4 together", kinds: ["stitch-lily", "halftone"] },
  { id: "B8", name: "text-mode lily + flourishes", note: "B2 and B1 together", kinds: ["ascii-lily", "flourish"] },
];

const SPRITES: SpriteName[] = [
  "sparkle",
  "twinkle",
  "star",
  "moon",
  "heart",
  "bow",
  "key",
  "crown",
  "cloud",
  "butterfly",
  "dragonfly",
  "fairy",
  "unicorn",
  "swan",
  "lily",
  "rose",
  "tulip",
  "daisy",
  "bluebell",
  "flower",
  "mushroom",
  "sprout",
  "blossom",
  "envelope",
  "vase",
  "pencil",
  "dress",
  "quill",
];
const SPRITE_COLOURS = ["#d68db5", "#8583c4", "#c9a5ed", "#526a9c", "#e8b5d0"];

function Num({ children }: { children: React.ReactNode }) {
  return <span className={`${styles.num} pixel`}>{children}</span>;
}

export default function StylePage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <h1 className={`${styles.h1} pixel`}>
          <Pixel name="sparkle" size={3} color="#d68db5" twinkle /> style picker
        </h1>
        <p className={styles.lead}>
          Your palette, fonts (Bodoni Moda italic for onA, Pixelify Sans, Karla), the note window, dividers, web buttons
          and pixel cursor are now on the site. Still to choose: a background, and any extra details below.
        </p>

        {/* name */}
        <h2 className={`${styles.h2} pixel`}>your name: onA</h2>
        <div className={`${styles.grid} ${styles.nameGrid}`}>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N1</Num>
            <AsciiName fontFamily={bodoni.style.fontFamily} italic weight={800} size={84} pitch={4} />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>ASCII onA</strong> · your Bodoni pick, re-printed in bars and dashes like the lily
            </figcaption>
          </figure>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N2</Num>
            <AsciiName fontFamily={pinyon.style.fontFamily} size={80} pitch={4} color="#9c4a78" edgeColor="#e8a6c6" />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>ASCII script onA</strong> · a swirly script, printed in pink bars
            </figcaption>
          </figure>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N3</Num>
            <AsciiName fontFamily={bodoni.style.fontFamily} italic weight={800} size={72} pitch={6} mode="chars" />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>classic ASCII art</strong> · made of real typed characters ( . : * # @ )
            </figcaption>
          </figure>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N4</Num>
            <FontName className={jacquarda.className} size={60} />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>Jacquarda Bastarda 9</strong> · pixel fairytale blackletter
            </figcaption>
          </figure>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N5</Num>
            <FontName className={jacquard.className} size={60} />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>Jacquard 24</strong> · like a woven / stitched label
            </figcaption>
          </figure>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N6</Num>
            <FontName className={silkscreen.className} size={44} />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>Silkscreen</strong> · crisp, classic pixel type
            </figcaption>
          </figure>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N7</Num>
            <AsciiName fontFamily={jacquard.style.fontFamily} size={64} pitch={4} color="#30314f" edgeColor="#c9a5ed" />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>ASCII Jacquard</strong> · N5, re-printed in bars and dashes
            </figcaption>
          </figure>
          <figure className={`${styles.card} ${styles.sig}`}>
            <Num>N8</Num>
            <FontName className={pixelify.className} size={50} />
            <span className={`${styles.surname2} pixel`}>cabedo wells</span>
            <figcaption>
              <strong>Pixelify Sans</strong> · same font as your headings
            </figcaption>
          </figure>
        </div>

        {/* backgrounds */}
        <h2 className={`${styles.h2} pixel`}>backgrounds, drawn from your board</h2>
        <div className={`${styles.grid} ${styles.bgGrid}`}>
          {BACKGROUNDS.map((b, i) => (
            <figure key={b.id} className={styles.card}>
              <Num>{b.id}</Num>
              <div className={styles.bgBox}>
                <Background kinds={b.kinds} contained seed={11 + i} />
                <span className={styles.bgCard}>
                  <span className="pixel">page content</span>
                  <span>sits here, in the middle</span>
                </span>
              </div>
              <figcaption>
                <strong>{b.name}</strong> · {b.note}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* sprites */}
        <h2 className={`${styles.h2} pixel`}>pixel sprites</h2>
        <figure className={styles.card}>
          <Num>S</Num>
          <div className={styles.sprites}>
            {SPRITES.map((s, i) => (
              <span key={s} className={styles.sprite}>
                <Pixel name={s} size={4} color={SPRITE_COLOURS[i % SPRITE_COLOURS.length]} />
                <small>{s}</small>
              </span>
            ))}
          </div>
          <figcaption>
            <strong>the full set</strong> · new: twinkle, key, dragonfly, fairy, unicorn, swan, lily. Tell me which you
            want more of, or anything to add.
          </figcaption>
        </figure>

        {/* details */}
        <h2 className={`${styles.h2} pixel`}>details</h2>
        <div className={styles.details}>
          <figure className={styles.card}>
            <Num>✓</Num>
            <div className={styles.demo}>
              <NoteWindow title="♡ hello.txt">
                <span className={styles.noteText}>Now holding the intro on the homepage.</span>
              </NoteWindow>
            </div>
            <figcaption>
              <strong>note window</strong> · on the site
            </figcaption>
          </figure>

          <figure className={styles.card}>
            <Num>✓</Num>
            <div className={`${styles.demo} ${styles.dividers}`}>
              <Divider kind="dots" className={styles.tight} />
              <Divider kind="flowers" className={styles.tight} />
              <Divider kind="star" className={styles.tight} />
            </div>
            <figcaption>
              <strong>dividers</strong> · on the site, between homepage sections
            </figcaption>
          </figure>

          <figure className={styles.card}>
            <Num>✓</Num>
            <div className={styles.demo}>
              <WebButtons />
            </div>
            <figcaption>
              <strong>web buttons</strong> · recoloured in your palette
            </figcaption>
          </figure>

          <figure className={styles.card}>
            <Num>D4</Num>
            <div className={`${styles.demo} ${styles.blinkies}`}>
              <span className={`${styles.blinkie} pixel`} style={{ "--b1": "#e8b5d0", "--b2": "#fff" } as React.CSSProperties}>
                ✧ handmade with love ✧
              </span>
              <span className={`${styles.blinkie} pixel`} style={{ "--b1": "#c9a5ed", "--b2": "#fff" } as React.CSSProperties}>
                ♡ now making: mugs ♡
              </span>
            </div>
            <figcaption>
              <strong>blinkies</strong> · tiny glittery badges with a slow blink (not used yet)
            </figcaption>
          </figure>

          <figure className={styles.card}>
            <Num>D5</Num>
            <div className={styles.demo}>
              <div className={`${styles.ticker} pixel`}>
                <span>
                  ✦ currently: glazing mugs ✦ reading: fairy tales ✦ listening: rain ✦ currently: glazing mugs ✦
                  reading: fairy tales ✦ listening: rain
                </span>
              </div>
            </div>
            <figcaption>
              <strong>scrolling ticker</strong> · a &ldquo;currently&rdquo; strip under the menu (not used yet)
            </figcaption>
          </figure>

          <figure className={styles.card}>
            <Num>D7</Num>
            <SparkleTrail>
              <span className="pixel">move your mouse in here</span>
            </SparkleTrail>
            <figcaption>
              <strong>sparkle trail</strong> · sparkles fall off the cursor, homepage only (not used yet)
            </figcaption>
          </figure>
        </div>
      </main>
    </>
  );
}
