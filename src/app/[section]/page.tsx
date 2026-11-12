import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { piecesIn, sectionById, sections } from "@/content/work";
import Print from "../components/Print";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Spiral from "../components/Spiral";
import Swirls from "../components/Swirls";
import styles from "../inner.module.css";

const LEADS: Record<string, string> = {
  ceramics: "Stoneware vessels, mugs and faces: memory, mistakes, and the places I come from.",
  fashion: "Garments built from discarded fabric, unravelled sweaters, castle walls and folklore.",
  art: "Painting, oil pastel, coloured pencil and charcoal.",
};

export function generateStaticParams() {
  return sections.filter((s) => s.id !== "writing").map((s) => ({ section: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: section };
}

// params are read inside Suspense so navigation into the route can show the shell instantly
export default function SectionPage({ params }: PageProps<"/[section]">) {
  return (
    <Suspense fallback={<Swirls density="page" />}>
      <SectionBody params={params} />
    </Suspense>
  );
}

async function SectionBody({ params }: { params: PageProps<"/[section]">["params"] }) {
  const { section } = await params;
  const meta = sectionById(section);
  if (!meta) notFound();
  const items = piecesIn(section);

  return (
    <>
      <Swirls density="page" />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <h1 className={styles.heading}>
          <Spiral color={meta.color} seed={7} className={styles.headingSpiral} />
          {meta.label}
        </h1>
        <p className={styles.lead}>{LEADS[section]}</p>
        <div className={styles.grid}>
          {items.map((p, i) => (
            <Print
              key={p.slug}
              href={`/${section}/${p.slug}`}
              image={p.images[0]}
              title={p.title}
              note={p.details}
              index={i}
              color={meta.color}
            />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
