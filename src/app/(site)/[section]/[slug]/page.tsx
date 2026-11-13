import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { colourOf, getProject, getProjects, getProjectsIn, getSection, getSections, getSite, paragraphs } from "@/content/load";
import Blocks from "../../components/Blocks";
import Frame from "../../components/Frame";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import Swirls from "../../components/Swirls";
import styles from "../../inner.module.css";

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
    <Suspense fallback={<Swirls density="page" />}>
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
  const at = list.findIndex((p) => p.slug === slug);
  const next = list[(at + 1) % list.length];
  const meta2 = [project.details, project.year].filter(Boolean).join(", ");

  return (
    <>
      <Swirls density="page" />
      <SiteHeader current={section} />
      <main className={styles.main}>
        <article className={styles.piece}>
          <Link href={`/${section}`} className={styles.back}>
            ← {words.back}
          </Link>
          {project.draft && <p className={styles.draftNote}>draft · only you can see this page</p>}
          {project.cover && <Frame src={project.cover} alt={project.title} eager className={styles.hero} />}
          <h1 className={styles.pieceTitle}>{project.title}</h1>
          {meta2 && <p className={styles.details}>{meta2}</p>}
          {project.intro && (
            <div className={styles.statement}>
              {paragraphs(project.intro).map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          )}

          <Blocks blocks={project.blocks} />

          {next && next.slug !== project.slug && (
            <nav className={styles.pager} style={{ "--c": colourOf(meta.colour).ink } as React.CSSProperties}>
              <Link href={`/${section}`}>all {meta.name}</Link>
              <Link href={`/${section}/${next.slug}`}>
                {words.next} {next.title}
              </Link>
            </nav>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
