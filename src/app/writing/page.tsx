import type { Metadata } from "next";
import { sectionById, toneAt, writings } from "@/content/work";
import BoardHeader from "../components/BoardHeader";
import { TextPin } from "../components/Pin";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Masonry from "../components/Masonry";
import Background from "../components/Background";
import styles from "../board.module.css";

export const metadata: Metadata = { title: "writing" };

export default function WritingPage() {
  const meta = sectionById("writing")!;
  return (
    <>
      <Background />
      <SiteHeader current="writing" />
      <main className={styles.main}>
        <BoardHeader section="writing" count={`${writings.length} pieces`} />
        <Masonry>
          {writings.map((w, i) => (
            <TextPin
              key={w.slug}
              href={`/writing/${w.slug}`}
              lines={w.lines}
              title={w.title}
              note={w.year}
              color={meta.color}
              ink={meta.ink}
              sprite={meta.family[i % meta.family.length]}
              tone={toneAt(i)}
            />
          ))}
        </Masonry>
      </main>
      <SiteFooter />
    </>
  );
}
