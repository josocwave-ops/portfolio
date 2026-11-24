import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { pieceBy, pieces, piecesIn, sectionById, toneAt, writings } from "@/content/work";
import NoteWindow from "../../components/NoteWindow";
import PhotoViewer from "../../components/PhotoViewer";
import Placeholder from "../../components/Placeholder";
import TextLink from "../../components/TextLink";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import Background from "../../components/Background";
import styles from "../../inner.module.css";

export function generateStaticParams() {
  return pieces.map((p) => ({ section: p.section, slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[section]/[slug]">): Promise<Metadata> {
  const { section, slug } = await params;
  const piece = pieceBy(section, slug);
  return { title: piece?.title ?? "work", description: piece?.summary };
}

// params are read inside Suspense so navigation into the route can show the shell instantly
export default function PiecePage({ params }: PageProps<"/[section]/[slug]">) {
  return (
    <Suspense fallback={<Background />}>
      <PieceBody params={params} />
    </Suspense>
  );
}

// A project: its photos in a picture viewer, with the words in a notes
// window beside it, then a link to the next project.
async function PieceBody({ params }: { params: PageProps<"/[section]/[slug]">["params"] }) {
  const { section, slug } = await params;
  const piece = pieceBy(section, slug);
  const meta = sectionById(section);
  if (!piece || !meta) notFound();

  const list = piecesIn(section);
  const at = list.findIndex((p) => p.slug === slug);
  const next = list[(at + 1) % list.length];
  const extraShapes = piece.shapes?.slice(1) ?? [];
  const poems = writings.filter((w) => w.pairedWith === piece.slug);
  const ph = { color: meta.color, ink: meta.ink, sprite: meta.sprite };

  // the photos, or soft placeholders until there are photos
  const slides: React.ReactNode[] = [];
  const thumbs: React.ReactNode[] = [];
  if (piece.images.length > 0) {
    piece.images.forEach((im, i) => {
      slides.push(<Image key={im.src} src={im.src} alt={i === 0 ? piece.title : ""} fill sizes="(max-width: 900px) 92vw, 640px" priority={i === 0} />);
      thumbs.push(<Image key={im.src} src={im.src} alt="" fill sizes="80px" />);
    });
  } else {
    [undefined, ...extraShapes].forEach((_, i) => {
      const sprite = i === 0 ? meta.sprite : meta.family[i % meta.family.length];
      slides.push(<Placeholder key={i} fill {...ph} sprite={sprite} tone={toneAt(i)} label={i === 0 ? "main photo" : "photo"} />);
      thumbs.push(<Placeholder key={i} fill {...ph} sprite={sprite} tone={toneAt(i)} label="" />);
    });
  }
  const fileName = piece.title.replace(/\s+/g, "_");

  return (
    <>
      <Background />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <article className={styles.piece} style={{ "--ink-c": meta.ink } as React.CSSProperties}>
          <Link href={`/${section}`} className={`${styles.back} pixel`}>
            ← {meta.label}
          </Link>
          <div className={styles.viewerLayout}>
            {/* the photos, in an old picture viewer */}
            <NoteWindow title={`✿ ${fileName}.jpg`} meta={`${slides.length} ${slides.length === 1 ? "photo" : "photos"}`} flush className={styles.viewerWin}>
              <PhotoViewer slides={slides} thumbs={thumbs} name={piece.title} />
            </NoteWindow>

            {/* the words, in a notes window beside it */}
            <NoteWindow title="<3 notes.txt" className={styles.notesWin} bodyClassName={styles.notes}>
              <h1 className={styles.pieceTitle}>{piece.title}</h1>
              {piece.details && <p className={styles.details}>{piece.details}</p>}
              <div className={styles.statement}>
                {piece.statement.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              {poems.length > 0 && (
                <p className={styles.details}>
                  The poems that belong to this project are in <TextLink href="/writing">writing</TextLink>.
                </p>
              )}
            </NoteWindow>
          </div>

          {next && next.slug !== piece.slug && (
            <nav className={`${styles.pager} pixel`}>
              <Link href={`/${section}`}>all {meta.label}</Link>
              <Link href={`/${section}/${next.slug}`}>next: {next.title} →</Link>
            </nav>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
