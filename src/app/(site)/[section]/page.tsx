import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { colourOf, getProjectsIn, getSection, getSections, getSite } from "@/content/load";
import Print from "../components/Print";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Spiral from "../components/Spiral";
import Swirls from "../components/Swirls";
import styles from "../inner.module.css";

export function generateStaticParams() {
  return getSections().map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: getSection(section)?.name ?? section };
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
  const meta = getSection(section);
  if (!meta) notFound();
  const c = colourOf(meta.colour);
  const items = getProjectsIn(section);

  return (
    <>
      <Swirls density="page" />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <h1 className={styles.heading}>
          <Spiral color={c.color} seed={7} className={styles.headingSpiral} />
          {meta.name}
        </h1>
        {meta.intro && <p className={styles.lead}>{meta.intro}</p>}
        {items.length ? (
          <div className={styles.grid}>
            {items.map((p, i) => (
              <Print
                key={p.slug}
                href={`/${section}/${p.slug}`}
                image={p.cover}
                title={p.title}
                note={p.teaser || p.details}
                index={i}
                color={c.color}
                draft={p.draft}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{getSite().words.emptySection}</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
