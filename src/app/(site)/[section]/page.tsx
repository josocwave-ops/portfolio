import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { colourOf, getProjectsIn, getSection, getSections, getSite } from "@/content/load";
import { PageLines } from "../components/Lines";
import Print from "../components/Print";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Trail from "../components/Trail";
import { rng } from "../lib/scatter";
import styles from "./section.module.css";

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
    <Suspense fallback={<p className={`${styles.loading} hand`}>{getSite().words.loading}</p>}>
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
  const index = getSections().findIndex((s) => s.slug === section);

  return (
    <div className={styles.page} style={{ "--c": c.color } as React.CSSProperties}>
      <PageLines kind={index % 2 ? "wavy" : "spiral"} side={index % 2 ? "left" : "right"} />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <Trail steps={[{ href: "/", label: "home" }, { label: meta.name }]} />
        <div className={styles.head} data-depth="0.08">
          <h1 className={styles.title}>{meta.name}</h1>
          {meta.intro && <p className={styles.intro}>{meta.intro}</p>}
        </div>

        {items.length ? (
          <div className={styles.pile}>
            {items.map((p, i) => {
              // each print lands a little differently, decided by its name
              const r = rng(p.slug);
              const drop = Math.round((r() - 0.3) * 60);
              const scale = 0.92 + r() * 0.16;
              return (
                <div
                  key={p.slug}
                  className={styles.spot}
                  style={{ "--drop": `${drop}px`, "--scale": scale } as React.CSSProperties}
                  data-depth={(0.2 + r() * 0.5).toFixed(2)}
                >
                  <Print
                    id={`${section}-${p.slug}`}
                    image={p.cover}
                    caption={p.title}
                    note={p.teaser || p.details}
                    href={`/${section}/${p.slug}`}
                    crop={i % 3 === 2 ? "square" : "portrait"}
                    fix={i % 4 === 1 ? "corners" : "tape"}
                    tape={i % 2 ? undefined : c.color + "99"}
                    draft={p.draft}
                    maxTilt={4}
                    eager={i < 4}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className={`${styles.empty} hand`}>{getSite().words.emptySection}</p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
