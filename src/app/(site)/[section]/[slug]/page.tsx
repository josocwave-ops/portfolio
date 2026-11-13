import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { colourOf, getProject, getProjects, getProjectsIn, getSection, getSections, getSite, paperOf, paragraphs, stickersFor } from "@/content/load";
import Blocks from "../../components/Blocks";
import { Stitch, type PatternName } from "../../components/Ornaments";
import Loading from "../../components/Loading";
import PageInk from "../../components/PageInk";
import MarginStickers from "../../components/MarginStickers";
import Paper from "../../components/Paper";
import Print from "../../components/Print";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import Trail from "../../components/Trail";
import styles from "./project.module.css";

export function generateStaticParams() {
  const params = getProjects().flatMap((p) => p.sections.map((section) => ({ section, slug: p.slug })));
  // with Cache Components the build needs at least one entry, even before anything is published
  return params.length ? params : [{ section: getSections()[0]?.slug ?? "ceramics", slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/[section]/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project?.title ?? "work", description: project?.teaser || undefined };
}

// params are read inside Suspense so navigation into the route can show the shell instantly
export default function ProjectPage({ params }: PageProps<"/[section]/[slug]">) {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectBody params={params} />
    </Suspense>
  );
}

async function ProjectBody({ params }: { params: PageProps<"/[section]/[slug]">["params"] }) {
  const { section, slug } = await params;
  const project = getProject(slug);
  const meta = getSection(section);
  if (!project || !meta || !project.sections.includes(section)) notFound();

  const { words } = getSite();
  const list = getProjectsIn(section);
  const next = list[(list.findIndex((p) => p.slug === slug) + 1) % list.length];
  const accent = colourOf(project.mood.accent);
  const allSections = getSections().filter((s) => project.sections.includes(s.slug));
  const facts = [project.details, project.year].filter(Boolean).join(", ");

  // the project's mood: its paper, its accent colour and its background line
  const mood = {
    "--paper-tone": paperOf(project.mood.paper),
    "--accent": accent.color,
    "--accent-ink": accent.ink,
    "--mood-tape": accent.color + "99",
  } as React.CSSProperties;

  return (
    <div className={styles.page} style={mood}>
      <PageInk kind={project.mood.line} seed={slug} colour={accent.color} />
      <MarginStickers id={slug} stickers={stickersFor(project.mood.stickers)} />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <Trail steps={[{ href: "/", label: "home" }, { href: `/${section}`, label: meta.name }, { label: project.title }]} />

        <section className={`${styles.hero} ${project.cover ? "" : styles.noCover}`}>
          {project.draft && <span className="draft-tag">draft · only you can see this page</span>}
          <Paper id={`hero-${slug}`} tear={5} depth={0.35} className={styles.sheet} innerClassName={styles.sheetInner}>
            <h1 className={styles.title}>{project.title}</h1>
            {facts && <p className={`${styles.facts} pixel`}>{facts}</p>}
            <p className={styles.sections}>
              {allSections.map((s) => (
                <Link key={s.slug} href={`/${s.slug}`} style={{ "--c": colourOf(s.colour).ink } as React.CSSProperties}>
                  <Stitch pattern={s.mark as PatternName} colour={colourOf(s.colour).color} seed={s.slug} className={styles.tagMark} />
                  {s.name}
                </Link>
              ))}
            </p>
            {project.intro && (
              <div className={styles.intro}>
                {paragraphs(project.intro).map((p, i) =>
                  i === 0 ? (
                    <p key={p.slice(0, 32)}>
                      {/* an ornamental first letter in a stitched box */}
                      <span className={styles.initial} aria-hidden="true">
                        <svg viewBox="0 0 74 74">
                          <g fill="none" stroke="var(--accent-ink)" strokeLinecap="round" filter="url(#ink)">
                            <rect x="4" y="4" width="66" height="66" rx="3" strokeWidth="1.2" strokeDasharray="5 4" />
                            <path d="M8 66 C 20 50, 14 34, 24 24 C 30 18, 38 22, 34 28" strokeWidth="1.4" />
                            <circle cx="62" cy="12" r="1.6" />
                          </g>
                        </svg>
                        <b>{p[0]}</b>
                      </span>
                      <span className="sr-only">{p[0]}</span>
                      {p.slice(1)}
                    </p>
                  ) : (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ),
                )}
              </div>
            )}
          </Paper>
          {project.cover && (
            <div className={styles.cover} data-depth="0.5">
              <Print id={`cover-${slug}`} image={project.cover} alt={project.title} depth={0.7} maxTilt={3} eager />
            </div>
          )}
        </section>

        <Blocks id={slug} blocks={project.blocks} />

        {next && next.slug !== project.slug && (
          <nav className={styles.pager}>
            <Link href={`/${section}`} className={styles.all}>
              all {meta.name}
            </Link>
            <Link href={`/${section}/${next.slug}`} className={styles.next}>
              <Paper id={`next-${next.slug}`} tear={3} depth={0.6} innerClassName={styles.nextInner}>
                <span className="hand">{words.next}</span>
                <strong>{next.title}</strong>
              </Paper>
            </Link>
          </nav>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
