import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { pieceBy, pieces, piecesIn, sectionById, toneAt, writings } from "@/content/work";
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

// NOTE: this is still the simple first version of a project page.
// The full case-study layout (starting point, research, sketches, process...) comes next.
async function PieceBody({ params }: { params: PageProps<"/[section]/[slug]">["params"] }) {
  const { section, slug } = await params;
  const piece = pieceBy(section, slug);
  const meta = sectionById(section);
  if (!piece || !meta) notFound();

  const list = piecesIn(section);
  const at = list.findIndex((p) => p.slug === slug);
  const next = list[(at + 1) % list.length];
  const [hero, ...rest] = piece.images;
  const extraShapes = piece.shapes?.slice(1) ?? [];
  const poems = writings.filter((w) => w.pairedWith === piece.slug);
  const ph = { color: meta.color, ink: meta.ink, sprite: meta.sprite };

  return (
    <>
      <Background />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <article className={styles.piece}>
          <Link href={`/${section}`} className={`${styles.back} pixel`}>
            ← {meta.label}
          </Link>
          {/* every photo sits in the same pixel frame as the pins */}
          <span className={`${styles.photo} ${styles.heroFrame} px-frame`}>
            {hero ? (
              <Image
                className={styles.hero}
                src={hero.src}
                width={hero.width}
                height={hero.height}
                alt={piece.title}
                sizes="(max-width: 800px) 92vw, 760px"
                priority
              />
            ) : (
              <Placeholder ratio={4 / 3} {...ph} label="main photo" />
            )}
          </span>
          <h1 className={styles.pieceTitle}>{piece.title}</h1>
          {piece.details && <p className={styles.details}>{piece.details}</p>}
          <div className={styles.statement}>
            {piece.statement.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          {poems.length > 0 && (
            <p className={styles.details} style={{ marginTop: 28 }}>
              The poems that belong to this project are in <TextLink href="/writing">writing</TextLink>.
            </p>
          )}

          <div className={styles.more}>
            {rest.length > 0
              ? rest.map((im) => (
                  <span key={im.src} className={`${styles.photo} px-frame`}>
                    <Image src={im.src} width={im.width} height={im.height} alt="" sizes="(max-width: 800px) 92vw, 760px" />
                  </span>
                ))
              : !hero &&
                extraShapes.map((r, i) => (
                  // empty spots take turns with the board's sprite family
                  <span key={i} className={`${styles.photo} px-frame`}>
                    <Placeholder ratio={r} {...ph} sprite={meta.family[(i + 1) % meta.family.length]} tone={toneAt(i + 1)} />
                  </span>
                ))}
          </div>

          {next && next.slug !== piece.slug && (
            <nav className={`${styles.pager} pixel`} style={{ "--ink-c": meta.ink } as React.CSSProperties}>
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
