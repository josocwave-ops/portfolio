// All of the site's work and words.
//
// For now every project and poem here is a PLACEHOLDER, so the design can be
// built and judged before Ona adds her own photos and writing. (The earlier
// content from the 2025 print portfolio is still in git history on `main`.)

import type { SpriteName } from "@/app/components/Pixel";

export type SectionId = "ceramics" | "fashion" | "art" | "writing";

export type Img = { src: string; width: number; height: number };

export type Piece = {
  slug: string;
  section: Exclude<SectionId, "writing">;
  title: string;
  details?: string;
  summary: string;
  statement: string[];
  images: Img[];
  /** placeholder only: the shape of the empty photo spots (width / height) */
  shapes?: number[];
};

export type Writing = {
  slug: string;
  title: string;
  /** a few lines shown on the card */
  lines: string;
  /** the full poem; line breaks are kept */
  text: string;
  year?: string;
  /** optional: the project this poem belongs to */
  pairedWith?: string;
};

// Each section has a soft colour (frames, sprites, fills), a darker "ink" of
// the same colour that is safe for text, and a little family of sprites used
// for its placeholders and decorations (the first one is its main sprite).
// Colours are the palette tokens from globals.css.
export const sections: {
  id: SectionId;
  label: string;
  color: string;
  ink: string;
  sprite: "vase" | "pencil" | "dress" | "quill";
  family: SpriteName[];
  blurb: string;
}[] = [
  {
    id: "ceramics",
    label: "ceramics",
    color: "var(--mist)",
    ink: "var(--peri-ink)",
    sprite: "vase",
    family: ["vase", "key", "crown"],
    blurb: "Stoneware vessels, mugs and faces: memory, mistakes, and the places I come from.",
  },
  {
    id: "art",
    label: "art & drawing",
    color: "var(--ice)",
    ink: "var(--blue-ink)",
    sprite: "pencil",
    family: ["pencil", "butterfly", "dragonfly"],
    blurb: "Painting, oil pastel, coloured pencil and charcoal.",
  },
  {
    id: "fashion",
    label: "fashion & textiles",
    color: "var(--pink)",
    ink: "var(--pink-ink)",
    sprite: "dress",
    family: ["dress", "bow", "swan"],
    blurb: "Garments built from discarded fabric, unravelled sweaters, castle walls and folklore.",
  },
  {
    id: "writing",
    label: "writing",
    color: "var(--lilac)",
    ink: "var(--lilac-ink)",
    sprite: "quill",
    family: ["quill", "moon", "cloud", "fairy"],
    blurb: "Poems, some standing on their own, some carved into the work.",
  },
];

// Words for the home page. TODO(Ona): rewrite the intro in your own voice.
export const site = {
  // little faces like :) :D ^_^ and hearts like <3 get drawn in pink pixel type
  intro:
    "hi, i'm ona :) i make things with clay, fabric, paint and words <3 most of my work starts with a memory, a place, or a mistake i decided to keep.",
  // the scrolling strip under the menu
  ticker:
    "✧ welcome to my little corner of the internet :) ✧ currently: glazing a new set of mugs ✧ reading: old fairy tales ✧ listening: rain on the window <3 ✧",
  // the projects shown under "featured" on the home page, in order
  featured: ["ceramics-1", "fashion-1", "art-1"],
  // page background: any mix of the options on the /style page, e.g.
  // "flourish", "ascii-lily", "ascii-garden", "stitch-lily", "halftone", "chrome", "cropmarks", "sparkles", "flowers"
  background: ["ascii-lily", "ascii-garden", "flourish"] as import("@/app/components/Background").BackgroundKind[],
};

export const sectionById = (id: string) => sections.find((s) => s.id === id);

// ---- placeholders -------------------------------------------------------

// varied photo shapes so the Pinterest-style grid has a real rhythm
const SHAPES = [4 / 5, 1, 2 / 3, 4 / 3, 3 / 4, 3 / 5, 1, 4 / 5, 5 / 4, 2 / 3];
const COUNT: Record<Piece["section"], number> = { ceramics: 10, art: 8, fashion: 7 };
const NUMBER = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

export const pieces: Piece[] = (["ceramics", "art", "fashion"] as const).flatMap((section, si) =>
  Array.from({ length: COUNT[section] }, (_, i) => ({
    slug: `${section}-${i + 1}`,
    section,
    title: `project ${NUMBER[i]}`,
    details: "medium, year",
    summary: "A line about this project.",
    statement: [
      "Where it started: the memory, object, place or question that began this project.",
      "What you made, how, and what you found along the way.",
    ],
    images: [],
    shapes: [SHAPES[(i + si * 3) % SHAPES.length], 4 / 3, 4 / 5, 1, 3 / 4],
  })),
);

export const writings: Writing[] = Array.from({ length: 6 }, (_, i) => ({
  slug: `poem-${i + 1}`,
  title: `poem title ${NUMBER[i]}`,
  lines: ["the first line of the poem,\nand maybe the second.", "a short line.", "a few words that\nstay with you,\nthree lines long."][i % 3],
  text: "your poem goes here,\nline by line,\nwith its own breaks kept\n\nand its stanzas too.",
  year: "year",
}));

export const piecesIn = (section: string) => pieces.filter((p) => p.section === section);
export const pieceBy = (section: string, slug: string) =>
  pieces.find((p) => p.section === section && p.slug === slug);
export const writingBy = (slug: string) => writings.find((w) => w.slug === slug);

export const links = {
  shop: "https://claybyona.com",
  instagram: "https://instagram.com/claybyona",
  email: "claybyona@gmail.com",
};
