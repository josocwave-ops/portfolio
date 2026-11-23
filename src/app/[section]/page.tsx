import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { piecesIn, sectionById, sections } from "@/content/work";
import BoardHeader from "../components/BoardHeader";
import { PhotoPin } from "../components/Pin";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Background from "../components/Background";
import styles from "../board.module.css";

export function generateStaticParams() {
  return sections.filter((s) => s.id !== "writing").map((s) => ({ section: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: sectionById(section)?.label ?? section };
}

// params are read inside Suspense so navigation into the route can show the shell instantly
export default function SectionPage({ params }: PageProps<"/[section]">) {
  return (
    <Suspense fallback={<Background />}>
      <SectionBody params={params} />
    </Suspense>
  );
}

async function SectionBody({ params }: { params: PageProps<"/[section]">["params"] }) {
  const { section } = await params;
  const meta = sectionById(section);
  if (!meta || meta.id === "writing") notFound();
  const items = piecesIn(section);
  // empty photo spots cycle through the board's pastels, starting with this section's own
  const tints = [meta, ...sections.filter((s) => s.id !== meta.id)];

  return (
    <>
      <Background />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <BoardHeader section={meta.id} count={`${items.length} projects`} />
        <div className={styles.masonry}>
          {items.map((p, i) => {
            const t = tints[i % tints.length];
            return (
              <PhotoPin
                key={p.slug}
                href={`/${section}/${p.slug}`}
                image={p.images[0]}
                ratio={p.shapes?.[0]}
                index={i}
                title={p.title}
                note={p.details}
                color={t.color}
                ink={t.ink}
                sprite={meta.family[i % meta.family.length]}
              />
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
