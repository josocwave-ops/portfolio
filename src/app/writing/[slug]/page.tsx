import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { pieces, sectionById, writingBy, writings } from "@/content/work";
import Pixel from "../../components/Pixel";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import Background from "../../components/Background";
import TextLink from "../../components/TextLink";
import styles from "./poem.module.css";

export function generateStaticParams() {
  return writings.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: writingBy(slug)?.title ?? "writing" };
}

export default function PoemPage({ params }: PageProps<"/writing/[slug]">) {
  return (
    <Suspense fallback={<Background />}>
      <PoemBody params={params} />
    </Suspense>
  );
}

// a poem on its own page: lots of air, the serif, line breaks kept
async function PoemBody({ params }: { params: PageProps<"/writing/[slug]">["params"] }) {
  const { slug } = await params;
  const poem = writingBy(slug);
  if (!poem) notFound();
  const at = writings.indexOf(poem);
  const next = writings[(at + 1) % writings.length];
  const work = poem.pairedWith ? pieces.find((p) => p.slug === poem.pairedWith) : undefined;
  const meta = sectionById("writing")!;

  return (
    <>
      <Background />
      <SiteHeader current="writing" />
      <main className={styles.main} style={{ "--c": meta.color, "--ink-c": meta.ink } as React.CSSProperties}>
        <Link href="/writing" className={`${styles.back} pixel`}>
          ← writing
        </Link>
        <article className={`${styles.poem} px-frame`}>
          <span className={styles.deco} aria-hidden="true">
            <Pixel name="cloud" size={2} />
            <Pixel name="sparkle" size={2} twinkle />
            <Pixel name="moon" size={3} />
            <Pixel name="sparkle" size={2} twinkle />
            <Pixel name="fairy" size={2} />
          </span>
          <h1 className={styles.title}>{poem.title}</h1>
          {poem.year && <p className={`${styles.year} pixel`}>{poem.year}</p>}
          <div className={styles.text}>{poem.text}</div>
          {work && (
            <p className={styles.pair}>
              This poem belongs to <TextLink href={`/${work.section}/${work.slug}`}>{work.title}</TextLink>.
            </p>
          )}
        </article>
        {next && next.slug !== poem.slug && (
          <nav className={`${styles.next} pixel`}>
            <Link href={`/writing/${next.slug}`}>next poem: {next.title} →</Link>
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
