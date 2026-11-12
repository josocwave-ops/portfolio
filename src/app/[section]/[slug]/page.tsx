import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { pieceBy, pieces, piecesIn, sectionById, writings } from "@/content/work";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import Swirls from "../../components/Swirls";
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
    <Suspense fallback={<Swirls density="page" />}>
      <PieceBody params={params} />
    </Suspense>
  );
}

async function PieceBody({ params }: { params: PageProps<"/[section]/[slug]">["params"] }) {
  const { section, slug } = await params;
  const piece = pieceBy(section, slug);
  const meta = sectionById(section);
  if (!piece || !meta) notFound();

  const list = piecesIn(section);
  const at = list.findIndex((p) => p.slug === slug);
  const next = list[(at + 1) % list.length];
  const [hero, ...rest] = piece.images;
  const poems = writings.filter((w) => w.pairedWith === piece.slug);

  return (
    <>
      <Swirls density="page" />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <article className={styles.piece}>
          <Link href={`/${section}`} className={styles.back}>
            ← {meta.label}
          </Link>
          <Image
            className={styles.hero}
            src={hero.src}
            width={hero.width}
            height={hero.height}
            alt={piece.title}
            sizes="(max-width: 800px) 92vw, 760px"
            priority
          />
          <h1 className={styles.pieceTitle}>{piece.title}</h1>
          {piece.details && <p className={styles.details}>{piece.details}</p>}
          <div className={styles.statement}>
            {piece.statement.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          {poems.length > 0 && (
            <p className={styles.details} style={{ marginTop: 28 }}>
              The poems carved into these cups are in{" "}
              <Link href="/writing" style={{ color: "#7d6b8d", textDecoration: "underline" }}>
                writing
              </Link>
              .
            </p>
          )}

          {rest.length > 0 && (
            <div className={styles.more}>
              {rest.map((im) => (
                <Image key={im.src} src={im.src} width={im.width} height={im.height} alt="" sizes="(max-width: 800px) 92vw, 760px" />
              ))}
            </div>
          )}

          {next && next.slug !== piece.slug && (
            <nav className={styles.pager} style={{ "--c": meta.ink } as React.CSSProperties}>
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
