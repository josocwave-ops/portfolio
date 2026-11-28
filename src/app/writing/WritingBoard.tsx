import { writings } from "@/content/work";
import BoardHeader from "../components/BoardHeader";
import PoemDesktop from "../components/PoemDesktop";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Background from "../components/Background";
import styles from "../board.module.css";

// The writing section: the board header, then a little pixel computer whose
// desktop holds the poem files. A poem's own address (/writing/<slug>) shows the same desktop
// with that poem already open.
export default function WritingBoard({ open }: { open?: string }) {
  const poems = writings.map(({ slug, title, year, text }) => ({ slug, title, year, text }));
  return (
    <>
      <Background />
      <SiteHeader current="writing" />
      <main className={styles.main}>
        <BoardHeader section="writing" count={`${writings.length} pieces`} />
        <PoemDesktop poems={poems} initial={open} />
      </main>
      <SiteFooter />
    </>
  );
}
