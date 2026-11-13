// The editing room: everything Ona can change without touching code.
// Open it at /keystatic while the site is running on your computer.
import { collection, config, fields, singleton } from "@keystatic/core";

// every uploaded photo lands in public/projects/<project>/ and is served from /projects/<project>/
const photo = (label: string, description?: string) =>
  fields.image({ label, description, directory: "public/projects", publicPath: "/projects/" });

const caption = (label = "Caption") => fields.text({ label, description: "Optional. Little words under the photo." });

const captioned = (label: string) =>
  fields.object({ image: photo("Photo"), caption: caption() }, { label });

const COLOURS = [
  { label: "Teal", value: "teal" },
  { label: "Lavender", value: "lavender" },
  { label: "Slate blue", value: "slate" },
  { label: "Dusty rose", value: "rose" },
  { label: "Sage", value: "sage" },
  { label: "Gold", value: "gold" },
] as const;

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "onA · editing room" },
    navigation: {
      "your work": ["projects", "sections"],
      "your website": ["homepage", "site"],
    },
  },

  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*/",
      columns: ["title", "status", "year"],
      schema: {
        title: fields.slug({
          name: { label: "Title", description: "The project's name, written however you like (lowercase is fine!)." },
          slug: { label: "Web address", description: "Made from the title automatically. Only change it if you want a different link." },
        }),
        status: fields.select({
          label: "Visible on the website?",
          description: "Drafts only show up on your computer (with a little 'draft' tag), never on the live site.",
          options: [
            { label: "Hidden draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
        sections: fields.multiRelationship({
          label: "Sections",
          description: "Pick one or more. A project can live in several sections at once (e.g. ceramics and writing).",
          collection: "sections",
        }),
        year: fields.text({ label: "Year", description: "e.g. 2025, or 2024–2025" }),
        details: fields.text({ label: "Materials / details", description: "e.g. stoneware, ongoing capstone" }),
        teaser: fields.text({ label: "One-line teaser", description: "Shown under the thumbnail in the gallery." }),
        cover: photo("Cover photo", "The thumbnail people click on in the gallery."),
        order: fields.integer({
          label: "Order in the gallery",
          description: "Lower numbers appear first. Leave the same to sort by title.",
          defaultValue: 100,
        }),
        intro: fields.text({ label: "Introduction", multiline: true, description: "The opening words at the top of the project page." }),

        mood: fields.object(
          {
            paper: fields.select({
              label: "Paper",
              options: [
                { label: "Parchment", value: "parchment" },
                { label: "Blue-grey", value: "bluegrey" },
                { label: "Lilac", value: "lilac" },
                { label: "Sage", value: "sage" },
              ],
              defaultValue: "parchment",
            }),
            accent: fields.select({ label: "Accent colour", options: COLOURS, defaultValue: "lavender" }),
            line: fields.select({
              label: "Line in the background",
              options: [
                { label: "Starry spiral", value: "spiral" },
                { label: "Wavy spiral", value: "wavy" },
                { label: "None", value: "none" },
              ],
              defaultValue: "spiral",
            }),
          },
          { label: "Mood", description: "Small choices that give this project its own little world." },
        ),

        blocks: fields.blocks(
          {
            photo: {
              label: "Big photo",
              itemLabel: (p) => p.fields.caption.value || "Big photo",
              schema: fields.object({
                image: photo("Photo"),
                caption: caption(),
                size: fields.select({
                  label: "Size",
                  options: [
                    { label: "Full width", value: "full" },
                    { label: "Medium", value: "medium" },
                    { label: "Small, tucked to the side", value: "small" },
                  ],
                  defaultValue: "full",
                }),
              }),
            },
            scatter: {
              label: "Photo scatter",
              itemLabel: (p) => `Photo scatter (${p.fields.photos.elements.length})`,
              schema: fields.object({
                photos: fields.array(captioned("Photo"), {
                  label: "Photos",
                  description: "2 to 5 photos, tossed onto the page and overlapping.",
                  itemLabel: (p) => p.fields.caption.value || "Photo",
                }),
                note: fields.text({ label: "Handwritten note", description: "Optional. Scribbled beside the photos." }),
              }),
            },
            sketchbook: {
              label: "Sketchbook spread",
              itemLabel: (p) => `Sketchbook (${p.fields.pages.elements.length})`,
              schema: fields.object({
                pages: fields.array(captioned("Drawing"), {
                  label: "Drawings and sketches",
                  itemLabel: (p) => p.fields.caption.value || "Drawing",
                }),
                note: fields.text({ label: "Note", multiline: true }),
              }),
            },
            process: {
              label: "Process strip",
              itemLabel: (p) => p.fields.title.value || "Process strip",
              schema: fields.object({
                title: fields.text({ label: "Title", description: "e.g. how it was made" }),
                steps: fields.array(
                  fields.object({ image: photo("Photo"), note: fields.text({ label: "What's happening here" }) }),
                  { label: "Steps", itemLabel: (p) => p.fields.note.value || "Step" },
                ),
              }),
            },
            experiments: {
              label: "Experiments & details",
              itemLabel: (p) => p.fields.title.value || "Experiments & details",
              schema: fields.object({
                title: fields.text({ label: "Title", description: "e.g. glaze tests, close-ups, things that went wrong" }),
                items: fields.array(captioned("Photo"), { label: "Photos", itemLabel: (p) => p.fields.caption.value || "Photo" }),
              }),
            },
            text: {
              label: "Writing / description",
              itemLabel: (p) => p.fields.heading.value || "Writing",
              schema: fields.object({
                heading: fields.text({ label: "Heading", description: "Optional." }),
                body: fields.text({ label: "Text", multiline: true, description: "Leave an empty line between paragraphs." }),
              }),
            },
            note: {
              label: "Little note",
              itemLabel: (p) => p.fields.text.value.slice(0, 40) || "Little note",
              schema: fields.object({
                text: fields.text({ label: "Note", multiline: true }),
                style: fields.select({
                  label: "Looks like",
                  options: [
                    { label: "A torn paper slip", value: "slip" },
                    { label: "Handwriting in the margin", value: "hand" },
                    { label: "A typed label", value: "typed" },
                  ],
                  defaultValue: "slip",
                }),
              }),
            },
            poem: {
              label: "Poem",
              itemLabel: (p) => p.fields.title.value || "Poem",
              schema: fields.object({
                title: fields.text({ label: "Title" }),
                lines: fields.text({ label: "The poem", multiline: true }),
                note: fields.text({ label: "A few words about it", multiline: true, description: "Optional." }),
                image: photo("Photo", "Optional. e.g. the piece the poem lives on."),
              }),
            },
            outcome: {
              label: "Final outcome",
              itemLabel: (p) => p.fields.title.value || "Final outcome",
              schema: fields.object({
                image: photo("Photo"),
                title: fields.text({ label: "Title", description: "Optional. e.g. the finished set!!" }),
                caption: caption(),
              }),
            },
          },
          {
            label: "Page blocks",
            description: "Build the project page by stacking blocks in any order. Drag to reorder.",
          },
        ),
      },
    }),

    sections: collection({
      label: "Sections",
      slugField: "name",
      path: "content/sections/*",
      columns: ["order"],
      schema: {
        name: fields.slug({ name: { label: "Name", description: "e.g. ceramics" } }),
        intro: fields.text({ label: "Intro", multiline: true, description: "A line or two at the top of the section page." }),
        colour: fields.select({ label: "Colour", options: COLOURS, defaultValue: "lavender" }),
        order: fields.integer({ label: "Order in the menu", defaultValue: 1 }),
      },
    }),
  },

  singletons: {
    homepage: singleton({
      label: "Homepage",
      path: "content/homepage",
      schema: {
        threadsTitle: fields.text({ label: "Threads heading", defaultValue: "threads" }),
        threadsIntro: fields.text({ label: "Threads intro", multiline: true }),
        threads: fields.array(
          fields.object({
            title: fields.text({ label: "Title", description: "e.g. memory" }),
            intro: fields.text({ label: "A line about it", multiline: true }),
            line: fields.select({
              label: "Line",
              options: [
                { label: "Starry spiral", value: "spiral" },
                { label: "Wavy spiral", value: "wavy" },
              ],
              defaultValue: "spiral",
            }),
            projects: fields.array(fields.relationship({ label: "Project", collection: "projects" }), {
              label: "Projects in this thread",
              description: "2 to 4 projects, ideally from different sections.",
            }),
          }),
          { label: "Threads", itemLabel: (p) => p.fields.title.value || "Thread" },
        ),
      },
    }),

    site: singleton({
      label: "Site text & links",
      path: "content/site",
      schema: {
        name: fields.text({ label: "Your name", defaultValue: "Ona Cabedo Wells" }),
        description: fields.text({ label: "Short description", description: "Used by search engines and link previews." }),
        about: fields.object(
          {
            heading: fields.text({ label: "Heading" }),
            body: fields.text({ label: "About you", multiline: true, description: "Leave an empty line between paragraphs." }),
            portrait: fields.image({ label: "Portrait", directory: "public/site", publicPath: "/site/" }),
          },
          { label: "About page" },
        ),
        contact: fields.object(
          {
            line: fields.text({ label: "Line at the top of the contact page" }),
            email: fields.text({ label: "Email" }),
            instagram: fields.text({ label: "Instagram handle", description: "Without the @" }),
            shopName: fields.text({ label: "Shop name" }),
            shopUrl: fields.url({ label: "Shop link" }),
          },
          { label: "Contact" },
        ),
        words: fields.object(
          {
            loading: fields.text({ label: "While a page loads" }),
            emptySection: fields.text({ label: "When a section has no projects yet" }),
            peek: fields.text({ label: "When hovering over a project" }),
            notFound: fields.text({ label: "Page not found" }),
            emptyPhoto: fields.text({ label: "Empty photo frame (only you see this)" }),
            back: fields.text({ label: "Back link" }),
            next: fields.text({ label: "Next project link" }),
            footer: fields.text({ label: "Footer" }),
          },
          { label: "Little words", description: "The small labels and messages around the site. Make them sound like you!" },
        ),
      },
    }),
  },
});
