// Reads what the editing room (Keystatic) saves in /content.
// Reads are synchronous on purpose: pages still prerender at build time,
// and in development every request sees the latest saved edits.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = path.join(process.cwd(), "content");

// drafts show up while working on your computer, never on the live site
export const showDrafts = process.env.NODE_ENV === "development";

type Yaml = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function read(file: string): Yaml {
  try {
    return (yaml.load(fs.readFileSync(file, "utf8")) as Yaml) ?? {};
  } catch {
    return {};
  }
}

function list(dir: string) {
  try {
    return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true });
  } catch {
    return [];
  }
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const img = (v: unknown) => (typeof v === "string" && v ? v : null);

/** Split text on empty lines. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

// ---------- colours ----------

export const COLOURS: Record<string, { color: string; ink: string }> = {
  teal: { color: "#7fa9a6", ink: "#4f7a77" },
  lavender: { color: "#a99bb5", ink: "#7d6b8d" },
  slate: { color: "#8394b5", ink: "#5d6f94" },
  rose: { color: "#c98fa6", ink: "#a5627c" },
  sage: { color: "#8fa89a", ink: "#5f7a6b" },
  gold: { color: "#d6b56f", ink: "#9c7a33" },
};
export const colourOf = (name: string) => COLOURS[name] ?? COLOURS.lavender;

// ---------- sections ----------

export type Section = { slug: string; name: string; intro: string; colour: string; order: number };

export function getSections(): Section[] {
  return list("sections")
    .filter((f) => f.isFile() && f.name.endsWith(".yaml"))
    .map((f) => {
      const d = read(path.join(ROOT, "sections", f.name));
      const slug = f.name.replace(/\.yaml$/, "");
      return { slug, name: str(d.name) || slug, intro: str(d.intro), colour: str(d.colour) || "lavender", order: d.order ?? 1 };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export const getSection = (slug: string) => getSections().find((s) => s.slug === slug);

// ---------- projects ----------

export type Captioned = { image: string | null; caption: string };

export type Block =
  | { kind: "photo"; image: string | null; caption: string; size: "full" | "medium" | "small" }
  | { kind: "scatter"; photos: Captioned[]; note: string }
  | { kind: "sketchbook"; pages: Captioned[]; note: string }
  | { kind: "process"; title: string; steps: { image: string | null; note: string }[] }
  | { kind: "experiments"; title: string; items: Captioned[] }
  | { kind: "text"; heading: string; body: string }
  | { kind: "note"; text: string; style: "slip" | "hand" | "typed" }
  | { kind: "poem"; title: string; lines: string; note: string; image: string | null }
  | { kind: "outcome"; image: string | null; title: string; caption: string };

export type Project = {
  slug: string;
  title: string;
  draft: boolean;
  sections: string[];
  year: string;
  details: string;
  teaser: string;
  cover: string | null;
  order: number;
  intro: string;
  mood: { paper: string; accent: string; line: string };
  blocks: Block[];
};

const captioned = (v: unknown): Captioned[] =>
  Array.isArray(v) ? v.map((x: Yaml) => ({ image: img(x?.image), caption: str(x?.caption) })) : [];

function block(raw: Yaml): Block | null {
  const v: Yaml = raw?.value ?? {};
  switch (raw?.discriminant) {
    case "photo":
      return { kind: "photo", image: img(v.image), caption: str(v.caption), size: v.size ?? "full" };
    case "scatter":
      return { kind: "scatter", photos: captioned(v.photos), note: str(v.note) };
    case "sketchbook":
      return { kind: "sketchbook", pages: captioned(v.pages), note: str(v.note) };
    case "process":
      return {
        kind: "process",
        title: str(v.title),
        steps: Array.isArray(v.steps) ? v.steps.map((s: Yaml) => ({ image: img(s?.image), note: str(s?.note) })) : [],
      };
    case "experiments":
      return { kind: "experiments", title: str(v.title), items: captioned(v.items) };
    case "text":
      return { kind: "text", heading: str(v.heading), body: str(v.body) };
    case "note":
      return { kind: "note", text: str(v.text), style: v.style ?? "slip" };
    case "poem":
      return { kind: "poem", title: str(v.title), lines: str(v.lines), note: str(v.note), image: img(v.image) };
    case "outcome":
      return { kind: "outcome", image: img(v.image), title: str(v.title), caption: str(v.caption) };
    default:
      return null;
  }
}

function readProject(slug: string): Project {
  const d = read(path.join(ROOT, "projects", slug, "index.yaml"));
  return {
    slug,
    title: str(d.title) || slug,
    draft: d.status !== "published",
    sections: Array.isArray(d.sections) ? d.sections : [],
    year: str(d.year),
    details: str(d.details),
    teaser: str(d.teaser),
    cover: img(d.cover),
    order: d.order ?? 100,
    intro: str(d.intro),
    mood: { paper: d.mood?.paper ?? "parchment", accent: d.mood?.accent ?? "lavender", line: d.mood?.line ?? "spiral" },
    blocks: Array.isArray(d.blocks) ? d.blocks.map(block).filter((b): b is Block => b !== null) : [],
  };
}

/** Every project the visitor is allowed to see (plus drafts on your computer). */
export function getProjects(): Project[] {
  return list("projects")
    .filter((f) => f.isDirectory())
    .map((f) => readProject(f.name))
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export const getProjectsIn = (section: string) => getProjects().filter((p) => p.sections.includes(section));
export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);

// ---------- singletons ----------

export function getSite() {
  const d = read(path.join(ROOT, "site.yaml"));
  const w: Yaml = d.words ?? {};
  const c: Yaml = d.contact ?? {};
  const a: Yaml = d.about ?? {};
  return {
    name: str(d.name) || "Ona Cabedo Wells",
    description: str(d.description),
    about: { heading: str(a.heading), body: str(a.body), portrait: img(a.portrait) },
    contact: {
      line: str(c.line),
      email: str(c.email),
      instagram: str(c.instagram),
      shopName: str(c.shopName),
      shopUrl: str(c.shopUrl),
    },
    words: {
      loading: str(w.loading) || "…",
      emptySection: str(w.emptySection),
      peek: str(w.peek),
      notFound: str(w.notFound),
      emptyPhoto: str(w.emptyPhoto) || "photo goes here",
      back: str(w.back) || "back",
      next: str(w.next) || "next",
      footer: str(w.footer),
    },
  };
}

export type Site = ReturnType<typeof getSite>;

export function getHomepage() {
  const d = read(path.join(ROOT, "homepage.yaml"));
  return {
    threadsTitle: str(d.threadsTitle) || "threads",
    threadsIntro: str(d.threadsIntro),
    threads: (Array.isArray(d.threads) ? d.threads : []).map((t: Yaml) => ({
      title: str(t?.title),
      intro: str(t?.intro),
      line: str(t?.line) || "spiral",
      projects: (Array.isArray(t?.projects) ? t.projects : []).filter((s: unknown) => typeof s === "string") as string[],
    })),
  };
}
