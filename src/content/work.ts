// All of the site's work and words.
//
// The ceramics, fashion and art boards hold Ona's real work (her drawings, and
// the projects and words from her 2025 print portfolio). The poems and the one
// art project without photos are still PLACEHOLDERS.

import type { SpriteName } from "@/app/components/Pixel";
import images from "./images.json";

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
}[] = [
  {
    id: "ceramics",
    label: "ceramics",
    color: "var(--mist)",
    ink: "var(--peri-ink)",
    sprite: "vase",
    family: ["vase", "key", "crown"],
  },
  {
    id: "art",
    label: "art & drawing",
    color: "var(--ice)",
    ink: "var(--blue-ink)",
    sprite: "pencil",
    family: ["pencil", "butterfly", "dragonfly"],
  },
  {
    id: "fashion",
    label: "fashion & textiles",
    color: "var(--pink)",
    ink: "var(--pink-ink)",
    sprite: "dress",
    family: ["dress", "bow", "swan"],
  },
  {
    id: "writing",
    label: "poetry",
    color: "var(--lilac)",
    ink: "var(--lilac-ink)",
    sprite: "quill",
    family: ["quill", "moon", "cloud", "fairy"],
  },
];

// Words for the home page. TODO(Ona): rewrite the intro in your own voice.
export const site = {
  // little faces like :) :D ^_^ and hearts like <3 get drawn in pink pixel type
  intro:
    "hi, i'm ona :) i make things with clay, fabric, paint and words <3 most of my work starts with a memory, a place, or a mistake i decided to keep.",
  // only the mood is shown right now (under "online now!"); the other lines
  // are kept in case they come back
  status: {
    doing: "glazing a new set of mugs :)", // shown as "ona is …"
    mood: "dreamy ☁",
    reading: "old fairy tales",
    listening: "rain on the window <3",
  },
  // clicking the mood in the status line steps through these (draft words:
  // change them to your own moods)
  moods: ["dreamy ☁", "sleepy ☾", "inspired ✦", "cosy ♨", "giddy <3"],
  // the projects shown under "featured" on the home page, in order
  // (project slugs or poem slugs both work)
  featured: ["memory-cups", "art-1", "poem-1"],
  // page background: any mix of the options on the /style page, e.g.
  // "flourish", "ascii-lily", "ascii-garden", "stitch-lily", "halftone", "chrome", "cropmarks", "sparkles", "flowers"
  background: ["ascii-lily", "ascii-garden", "flourish"] as import("@/app/components/Background").BackgroundKind[],
};

export const sectionById = (id: string) => sections.find((s) => s.id === id);

// light (0), mid (1) or deep (2) shade for the nth pin or photo spot, in a
// shuffled order so neighbours on a board rarely match
const TONE_ORDER = [1, 2, 0, 2, 0, 1, 0, 1, 2];
export const toneAt = (i: number) => TONE_ORDER[i % TONE_ORDER.length];

// ---- placeholders -------------------------------------------------------

// varied photo shapes so the Pinterest-style grid has a real rhythm
const SHAPES = [4 / 5, 1, 2 / 3, 4 / 3, 3 / 4, 3 / 5, 1, 4 / 5, 5 / 4, 2 / 3];
const COUNT: Record<Piece["section"], number> = { ceramics: 10, art: 8, fashion: 7 };
const NUMBER = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

// real names given so far; everything else keeps its placeholder name
const TITLES: Record<string, string> = {
  "ceramics-1": "the memory cup project",
  "fashion-1": "castle walls corset",
  "art-1": "experiments with oil",
  "poem-1": "operating manual for a silenced thing",
};
// and their years (shown on their folders instead of "medium, year")
const YEARS: Record<string, string> = {
  "ceramics-1": "2026",
  "art-1": "2026",
  "poem-1": "2025",
};

// ---- real work ------------------------------------------------------------

// Ona's drawings, one project each, shown first on the art & drawing board.
// Photos live in public/work/<slug>/1.jpg (turned upright and trimmed to the page).
// TODO(Ona): the titles are working names so each one is easy to find; rename
// them, and swap "medium, year" for the real medium and year.
const DRAWINGS: { slug: string; title: string; size: [number, number] }[] = [
  { slug: "swirls", title: "swirls", size: [780, 1100] },
  { slug: "flower-girl", title: "flower girl", size: [1400, 1030] },
  { slug: "teal-shape", title: "teal shape", size: [1170, 1650] },
  { slug: "patterned-fairy", title: "patterned fairy", size: [1150, 800] },
  { slug: "falling-fairy", title: "falling fairy", size: [1120, 1600] },
  { slug: "woodland-bunny", title: "woodland bunny", size: [1040, 760] },
];

const drawings: Piece[] = DRAWINGS.map(({ slug, title, size: [width, height] }) => ({
  slug,
  section: "art",
  title,
  details: "medium, year",
  summary: "",
  statement: [],
  images: [{ src: `/work/${slug}/1.jpg`, width, height }],
}));

// Ona's fashion projects, with her words and photos from the 2025 print portfolio
// (photos in public/work/<slug>/). The corset's second photo, a dark close-up, is
// left out for now.
const fashion: Piece[] = [
  {
    slug: "castle-walls-corset",
    section: "fashion",
    title: "castle walls corset",
    details: "medium, year",
    summary: "A corset built like architecture.",
    statement: [
      "This piece was inspired not by the women inside castles, but by the walls that surrounded them. I approached the corset as a structural object, built through precision, repetition, and restraint. Sewing it pushed my technical abilities further than any previous project and shifted my understanding of garments as architectural forms.",
    ],
    images: [{ src: "/work/castle-walls-corset/1.jpg", width: 888, height: 914 }],
  },
  {
    slug: "earthern-skirt",
    section: "fashion",
    title: "the earthern skirt",
    details: "discarded fabrics, 2024",
    summary: "Earth and identity, fabric as geography.",
    statement: [
      "My first full garment, developed through research into how clothing is shaped by geography and culture. I was particularly inspired by Romani dress: layered skirts and the way fabric carries movement, history, and place. Made from discarded fabrics sourced from donation bins, it was shown and sold at a school sustainability event to raise money for charity.",
    ],
    images: [
      { src: "/work/earthern-skirt/1.jpg", width: 770, height: 1710 },
      { src: "/work/earthern-skirt/2.jpg", width: 1056, height: 1068 },
      { src: "/work/earthern-skirt/3.jpg", width: 742, height: 1120 },
    ],
  },
  {
    slug: "repurposed-crochet",
    section: "fashion",
    title: "repurposed crochet",
    details: "photoshoot & collection, 2023",
    summary: "Unravelled sweaters, rebuilt as full looks.",
    statement: [
      "This collection began with discarded sweaters and thrifted garments, which I unravelled and transformed into new crochet pieces. Undoing and rebuilding informed the visual language, drawing from rust, erosion, and organic overgrowth. The final beach photoshoot became an extension of the project, where weathered materials, natural light, and movement echoed the themes of decay and regeneration.",
    ],
    images: [
      { src: "/work/repurposed-crochet/1.jpg", width: 1544, height: 1454 },
      { src: "/work/repurposed-crochet/2.jpg", width: 1486, height: 1484 },
      { src: "/work/repurposed-crochet/3.jpg", width: 926, height: 784 },
      { src: "/work/repurposed-crochet/4.jpg", width: 1392, height: 494 },
    ],
  },
  {
    slug: "medieval-silhouettes",
    section: "fashion",
    title: "medieval silhouettes",
    details: "runway show, 2024",
    summary: "Two looks of dreamy, dark softness.",
    statement: [
      "This project emerged from an interest in folklore, fantasy, and medieval silhouettes, particularly the dreamy, dark softness of worlds like Maleficent. Created during a two-week intensive, designing for another body pushed me to think about movement, structure, and how garments transform when worn. The runway became an extension of the design, where fabric, body, and motion completed the work.",
    ],
    images: [
      { src: "/work/medieval-silhouettes/1.jpg", width: 802, height: 1618 },
      { src: "/work/medieval-silhouettes/2.jpg", width: 828, height: 1744 },
    ],
  },
];

// the photos of each print-portfolio project (sizes in images.json)
const img = (slug: keyof typeof images) => images[slug] as Img[];

// Ona's ceramics and paintings from the 2025 print portfolio, with her words.
// TODO(Ona): she'll likely rewrite these and swap in new photos.
const ceramics: Piece[] = [
  {
    slug: "memory-cups",
    section: "ceramics",
    title: "the memory cup project",
    details: "stoneware, ongoing capstone",
    summary: "One mug for each memory I can't stop returning to.",
    statement: [
      "This is my capstone, an ongoing project, the work I've chosen to mark the end of my high school journey. I thought about memory: about how countless memories exist in my life, yet there are eight I can't stop returning to, eight that take over my mind with such vivid detail I can see every shadow, hear every sound, feel every texture. From age five to seventeen, these moments have quietly shaped me, and now they are demanding to be made visible.",
      "The concept became simple: one mug for each memory. Nothing about this process is accidental; every shape, every mark, every glaze choice is deliberate. Poems I've written over the years about these moments decorate the mugs' surfaces, fragments of sentences, some broken, some covered, some highlighted, forcing the viewer to read and move around the cup to grasp the story.",
      "To hold one is to hold memory itself: visceral, fragmented, intimate. Each cup is both vessel and archive, object and story, surface and thought.",
    ],
    images: img("memory-cups"),
  },
  {
    slug: "hard-work-kills",
    section: "ceramics",
    title: "hard work kills!",
    details: "stoneware, two sculptural vases",
    summary: "Two faces recording what decades of labour leave behind.",
    statement: [
      "This project began with a drawing I made on a train. I sketched an old man whose face appeared deeply worn, every wrinkle, shadow, and sag suggesting a lifetime of labour. Across from him sat another man who seemed to be the same age, yet looked relaxed, youthful, untouched by strain.",
      "One vase depicts a man overwhelmed by physical strain, his mouth open, his wrinkles long and deeply carved. The second portrays a woman whose exhaustion is quieter and more internalised: her mouth closed, yet heavy eye bags and a sunken expression suggest emotional depletion. Placed side by side, they form a dialogue about visible collapse versus silent endurance.",
    ],
    images: img("hard-work-kills"),
  },
  {
    slug: "anatomy-of-a-mistake",
    section: "ceramics",
    title: "the anatomy of a mistake",
    details: "stoneware, 2024",
    summary: "A vessel built outward from its own collapse.",
    statement: [
      "This piece was formed through a collapse. When the neck of the vessel caved in, I resisted the instinct to fix or hide it and instead allowed the failure to become the focus of the work. The form evolved through a kind of negotiation, building outward from the distortion and accentuating its presence.",
      "Although viewers often describe the piece as resembling a heart or a flower, these associations emerged after the fact. The process felt almost like a dance, responding to the mistake rather than erasing it.",
    ],
    images: img("anatomy-of-a-mistake"),
  },
  {
    slug: "many-funky-mugs",
    section: "ceramics",
    title: "many funky mugs",
    details: "stoneware, 2024–2025",
    summary: "An ongoing family of mugs held together by their irregularities.",
    statement: [
      "An ongoing collection of mugs connected less by uniformity than by shared irregularities: twisted handles, shifting proportions, glaze that slips or pools unpredictably. I was inspired by spirals found in tiles and snail shells, where variation exists within underlying structure.",
      "Rather than correcting these “mistakes,” I chose to work with them, exploring how asymmetry can still create balance. Some mugs unintentionally mirror one another, fitting together in unexpected ways.",
    ],
    images: img("many-funky-mugs"),
  },
  {
    slug: "grandmothers-tiles",
    section: "ceramics",
    title: "my grandmother's tiles",
    details: "stoneware, 2025",
    summary: "Pattern as inheritance, from the tiles of old Spanish kitchens.",
    statement: [
      "Inspired by the ornate, colourful tiles of old Spanish kitchens, particularly those in my grandmother's home. Each piece translates the visual rhythm, colour intensity, and intricate detail of the original tiles into ceramic form, bridging personal memory with craft and pattern.",
    ],
    images: img("grandmothers-tiles"),
  },
  {
    slug: "neighborhood-flowers",
    section: "ceramics",
    title: "the neighborhood flowers",
    details: "stoneware, three painted vases",
    summary: "Mapping nostalgia through the flowers along a walk home.",
    statement: [
      "This collection grew out of walking. Moving between my current home and the neighbourhood of my childhood, I began to notice the same flowers appearing along the paths, unchanged from my early memories of them. The three vases are painted with the flowers encountered along these routes, each one rooted in direct observation.",
    ],
    images: img("neighborhood-flowers"),
  },
  {
    slug: "bee-swarm",
    section: "ceramics",
    title: "bee swarm collection",
    details: "stoneware, 2025",
    summary: "Fear and fascination, chaos and delicacy.",
    statement: [
      "I've always been drawn to beehives: the twisting, patterned structures, the way they feel both aggressive and mesmerising. Bees unsettle me, yet I am drawn to the flowers they inhabit. One vase spirals and tilts, echoing the hive's dizzying chaos, while another embraces calm, covered in delicate lavender.",
    ],
    images: img("bee-swarm"),
  },
  {
    slug: "crema-catalana-bowl",
    section: "ceramics",
    title: "the crema catalana bowl",
    details: "stoneware, 2025",
    summary: "Glaze as a surface you want to taste.",
    statement: [
      "Glaze has always fascinated me for its strange, edible quality: smooth, glossy, and tempting even when empty. This bowl evokes the orange-hued memories of Catalan restaurants, where old lights and the murmur of conversation filled the air. The cracks and surface patterns echo both the texture of dessert and the lived-in quality of those moments.",
    ],
    images: img("crema-catalana-bowl"),
  },
  {
    slug: "decay-and-growth",
    section: "ceramics",
    title: "decay & growth",
    details: "stoneware, 2025",
    summary: "An exploration of mould: consuming and transforming.",
    statement: [
      "This collection investigates decay and growth through the lens of mould. One piece appears almost devoured, raw clay exposed beneath spreading redness inspired by mouldy strawberries. The second is carved and covered, fully “grown,” yet new forms push through the surface. Together they explore impermanence and transformation through destruction.",
    ],
    images: img("decay-and-growth"),
  },
];

const paintings: Piece[] = [
  {
    slug: "self-portrait",
    section: "art",
    title: "an exploration into self portraiture",
    details: "gouache",
    summary: "My first painting, turning the subject inward.",
    statement: [
      "This self-portrait was the first painting I ever completed, a conscious decision to confront my fear of painting by turning the subject inward. Working in gouache with a CMY palette, I aimed for a face that feels unsettled rather than obviously expressive: wide eyes looking beyond the viewer, a restrained smile, an expression that suggests thought rather than clarity.",
    ],
    images: img("self-portrait"),
  },
  {
    slug: "oil-pastels",
    section: "art",
    title: "experiments in oil pastels",
    details: "oil pastel, year",
    summary: "Aftermath, and other loud faces.",
    statement: ["A series of experiments in oil pastel."],
    images: img("oil-pastels"),
  },
  {
    slug: "colored-pencil",
    section: "art",
    title: "colored pencil",
    details: "coloured pencil, year",
    summary: "Sketchbook pages in coloured pencil.",
    statement: ["Sketchbook studies in coloured pencil."],
    images: img("colored-pencil"),
  },
  {
    slug: "charcoal",
    section: "art",
    title: "charcoal",
    details: "charcoal, year",
    summary: "Studies in charcoal.",
    statement: ["Studies in charcoal."],
    images: img("charcoal"),
  },
];

// ---- placeholders, until the real work replaces them ------------------------

const placeholders: Piece[] = (["ceramics", "art", "fashion"] as const).flatMap((section, si) =>
  Array.from({ length: COUNT[section] }, (_, i) => ({
    slug: `${section}-${i + 1}`,
    section,
    title: TITLES[`${section}-${i + 1}`] ?? `project ${NUMBER[i]}`,
    details: YEARS[`${section}-${i + 1}`] ?? "medium, year",
    summary: "A line about this project.",
    statement: [
      "Where it started: the memory, object, place or question that began this project.",
      "What you made, how, and what you found along the way.",
    ],
    images: [],
    shapes: [SHAPES[(i + si * 3) % SHAPES.length], 4 / 3, 4 / 5, 1, 3 / 4],
  })),
);

// every board is real work now; the one placeholder kept is the named art
// project "experiments with oil", until it gets its photos
export const pieces: Piece[] = [
  ...ceramics,
  ...drawings,
  ...paintings,
  ...placeholders.filter((p) => p.section === "art" && TITLES[p.slug]),
  ...fashion,
];

// Ona's poems, newest first. The text is kept exactly as she wrote it: each
// line break and each empty line shows on the poem's page.
const poems: Writing[] = [
  {
    slug: "things-that-arent-possible",
    title: "things that aren't possible when you're starving",
    year: "2026",
    lines: "there's so much living i keep missing\nwhile i'm busy disappearing",
    text: `there's flowers by the pavement now
i haven't stopped to smell them once
i've got a head that's full of numbers
there isn't room for anyone

can't finish half the books i start
can't sit through films without a pause

i’m sick no matter what i do

sick is better for a good cause

even when that cause isn’t true
every page just blurs together
i can’t focus on a sentence

unless it’s talking about food

i don't write songs the way i used to
they all sound hungry in the end
every chord becomes a question
every answer is a means to an end

i never dance around the kitchen
waiting for the kettle's song
i stand there counting out my meals

drinking 12 cups of tea

i know is low in calories
and staying up till dawn

i don't wish on shooting stars now
they remind me i should run

or wish that i was alone

so i wasn’t dancing around everyone

tiptoeing through meals

with an elaborate string of lies

i hate lying to the people around me
i don't blow the seeds from dandelions
wishing takes energy i don’t have

i miss the way i used to wander
finding shells or bits of glass
i'd hold them like they meant salvation
now i only let them pass

i reserve my presence for surviving

and try my best to hold the mask

there's so much living i keep missing
while i'm busy disappearing
people say it gets much easier
they don't mention what you're fearing

because hunger isn't empty
it's a room that fills your head
there just isn't space for sunsets
when you're counting crumbs instead

i don't swim out past the breakers
the sea asks more than i can spare
i miss the weight of moving freely
without a body made of air

i don't climb the hills at sunset
though i know the view by heart
i'm always saving up my strength
for simply making it to dark

i don't laugh until i'm breathless
or sing too loud inside the car

my breath is halted and it’s quiet

i can’t risk losing anymore

i don't bake for all my neighbours
or steal warm cookies from the tray
i measure everything too closely
to let delight get in the way

i don't stretch out in the morning
like the cat asleep in sun
i fold myself into the smallest shape
until the day is done

i want to dance until i'm dizzy
walk for hours with nowhere to be
eat because the bread is fragrant
not because it frightened me

that you asked if i’ve eaten today

and now the thoughts won’t go away

so i eat so you see me eat

and i don’t eat the next couple of days

i want to read a hundred pages
and know what every sentence meant
fall asleep before the sunrise
without rehearsing my regret

i want flowers to be flowers
instead of colours in the blur i occupy
i want to stop beside the pavement
and remember that i don't actually want to die`,
  },
  {
    slug: "technicolour",
    title: "technicolour",
    year: "2026",
    lines: "how something so lovely can feel so extreme,\nhow a touch can turn everything technicolour,",
    text: `i really want you to cover me in colours

i want you to take to my skin

and turn me violet,

press down so hard it's violent,

leave your thumbprint raw on my neck.

i want the red where your fingers have been,
the blue underneath, the purple between,
i want to see all of the colours i've seen
when i look at you looking at me.

don't touch me lightly, don't leave me clean,
don't keep your hands where they're easy to see,
i want you to find every shade underneath,
the ones that come out when you get close to me.

put your hands where the colour begins,
let it bloom from the outside and bleed from within,
let it gather and scatter and gather again,
till there's nothing but colour wherever you've been.

i want to be dizzy, i want to be bright,
i want to be purpled all over tonight,
i want the kind of feeling that swallows the light,
that makes every ordinary colour ignite.

and i don't know how to explain what i mean,
how something so lovely can feel so extreme,
how a touch can turn everything technicolour,
how i can be bursting and still want another.

so press until violet rises through,
until all of the red starts running to blue,
until i can't tell where i end and you do,
until all that i feel is finally in view.

and maybe it's selfish, the wanting, the need,
to have something beautiful happen to me,
but i've never been good at feeling things small,
and i don't want to be careful with all of it at all.

i want the orange that gathers at dawn,
the pink of a mouth when the lipstick is gone,
the gold that spills out when the curtains are drawn,
i want every colour i've ever looked on.

i want them to multiply under your hands,
to spread like a wildfire across foreign lands,
to bloom like a garden that nobody planned,
to grow somewhere wild where i cannot command.

because sometimes a feeling is bigger than me,
a wave with no shoreline, a mouth with no teeth,
a thousand bright birds that refuse to be freed,
a sky full of lightning with nowhere to be.

and what am i meant to do with it all?
where does it go when it won't fit inside?
how do i make all this colour subside
when every time you touch me it multiplies?

so give me the green of the leaves after rain,
the blue of the sea when it swallows the day,
the purple that gathers where sunlight gives way,
give me the colours that have no names.

i want to be painted in every extreme,
to feel like a fever, to look like a dream,
to have you pull colours out of me
i never knew lived underneath my skin.

and when all the colours have run into one,
when the red meets the violet, violet meets sun,
when there's no way of knowing where you end and i begin,
i hope you can see what i've been trying to give.

because i have so much, and nowhere to put it,
so much that i carry and nowhere to spill it,
and if you could just touch me and somehow unseal it,
perhaps i could finally show you what feeling is.`,
  },
  {
    slug: "tomorrow-night",
    title: "tomorrow night",
    year: "2024",
    lines:
      "there's a girl who lives below me\nwho plays the same song every day\ni've started learning all the words\nthough i've never heard her say my name",
    text: `you call me when i'm sleeping
'cause you know i won't pick up
if you know that i'm sleeping
then you're safe from my love

and you can say you tried
it's not your fault i'm in bed by nine
i'll text you in the morning
and you'll answer tomorrow night

and i know that you're busy
and i know you've got things to do
and i know that i'm being dramatic
for expecting something from you

you'll tell me that you miss me
when the silence gets too loud
and i'll pretend that i believe you
just to keep the peace somehow

and i don't wanna be difficult
i don't wanna make a scene
but you only ever seem to want me
when there's nothing in between

you touch me when you want to,
and i let you, when i have to

i'll leave the light on
like i always seem to do
you'll come home when it's convenient
and i'll make excuses for you

i'll text you in the morning
like there's nothing left to say
you'll answer when it's midnight
and i'll tell you it's okay

i bought a plant last sunday
just to keep something alive
and i've been meaning to water it
but i keep forgetting every night

there's a woman at the supermarket
who always asks me how i've been
i think she knows more about my life
than all my closest friends

and my mother says i'm growing up
like that's a good thing to do
but i still sleep with the window open
like peter pan might come through

i've been taking different bus routes
just to see where they might go
and i've started keeping all my receipts
though i don't know what for

there's a girl who lives below me
who plays the same song every day
i've started learning all the words
though i've never heard her say my name

and sometimes i think about the future
like it's somewhere i could go
like there's a version of me waiting
who knows things i don't know

and i'll leave the light on
though there's nobody coming through
i've got better things to worry about
but i still make room for you

i'll text you in the morning
like i always said i would
you'll answer when you're lonely
and i'll say that you're misunderstood

and i wonder if you remember
the colour of my bedroom walls
or the way i hate the winter
or that i don't like phone calls

and i wonder if you notice
when i cut my hair too short
or if you only see me leaving
when i'm standing at the door

i could make a list of reasons
why i ought to let you go
but i've always been pretty good
at doing what i'm told

so i'll keep your favourite sweater
in the bottom of my drawer
and i'll tell myself it's nothing
but i think so much, my head is sore

and the plant is getting better
there's a little something new
i think it's strange that i can keep it
when i can't seem to get through to you

and maybe i'll be thirty
and i'll finally sleep past nine
maybe i'll meet somebody
who doesn't have to make the time

maybe i'll move somewhere
where the winters aren't so long
where the girl downstairs is different
and i don't know her favourite song

and maybe you'll still call me
when there's nothing else to do
and maybe i'll be happy
that i don't have to answer you

and i won't text you in the morning
i won't check my phone tonight
but i'll probably think about you
when my bedroom gets too quiet

and maybe you'll be sleeping
when i finally turn off the light
you can text me in the morning
i'll answer tomorrow night.`,
  },
  {
    slug: "load-of-delicates",
    title: "load of delicates",
    year: "2026",
    // TODO(Ona): which lines show on the card (the opening, for now)
    lines: "you hold your breath when you get too close\nlike i might stain the air you breathe",
    text: `you hold your breath when you get too close
like i might stain the air you breathe
i learned to fold myself smaller
so i’d fit whatever you need

you like me best when i’m quiet
when i don’t ask where you’ve been
i polish all my rough edges
just to let you in

i count my flaws like laundry
separate the whites from the reds
tell me what parts are too much
i’ll leave them folded on the bed

you only want to touch me
when i’m “clean enough” for you
it’s a shame, ’cause your hands
always leave me feeling used
i scrub myself raw trying
to be something i’m not
you say i’m finally perfect
either way i know you’ll still get off

you say you love me carefully
like love’s a fragile thing
but you never seem to notice
what your carefulness brings

i mistake your distance
for something i should earn
if i just stay spotless
maybe you won’t turn

away

you only want to touch me
when i’m clean enough for you
i swear i was fine before
i learned myself through you

maybe i was never dirty
maybe you just needed proof
that you could leave your fingerprints
on a girl you know you won’t lose

i’m tired of washing away
someone else’s shame
i think i miss the girl i was
before you knew my name`,
  },
  {
    slug: "all-boys-push",
    title: "all boys push",
    year: "2025",
    // TODO(Ona): which lines show on the card (the opening, for now)
    lines: "my mother told me once\nall boys push",
    text: `my mother told me once

all boys push

i laughed

because my brother
let me win races

the boys at school
shared their snacks

my father carried me
on his shoulders

all i knew
was gentle hands

i thought she meant

they pushed each other
off swings

into lakes

onto the grass

she didn't explain

she just looked at me

like she knew

i'd understand one day

and i did

first

my father stopped
carrying me

his hand became

a shove
between my shoulder blades

telling me to move

then boys at school

figured out

i was easy to ask

can i copy yours?

can you help me?

can i borrow this?

can you do me a favour?

and i always did

because i thought

being kind

was how people
became kind back

i thought

if i never gave anyone
a reason to dislike me

they wouldn't

i thought

good girls
were looked after

i still wanted

everyone

to like me

the first boy

asked

is this okay?

his hand

already resting

against my thigh

i wanted

to say no

instead

i smiled

he moved

a little further

is this okay?

i nodded

because i didn't want

to embarrass him

because i didn't want

to make him feel bad

because i thought

if i kept being gentle

he would be too

he wasn't

after that

there were other boys

other hands
on my thighs

other hands
around my waist

other hands

that always seemed

to move

a little further

than i expected

they'd ask

while they were already doing it

as though

the answer

had already been decided

but i would never
have said no anyway

i've spent

so much of my life

trying not

to disappoint people

that i forgot

sometimes

you're supposed to

i'm scared

i would do anything

for anyone

if they asked

my mother never said

all boys hurt you

she said

all boys push

i think

she meant

they keep pushing

until they find

the place

you won't protect

and i wonder

if one day

i'll stop apologising

for pushing back.`,
  },
  {
    slug: "goodnight-ghosts",
    title: "goodnight, ghosts",
    year: "2025",
    // TODO(Ona): which lines show on the card (the opening, for now)
    lines: "i'll tell you it's alright.\nyou'll tell me,\n\"i know.\"",
    text: `i'll tell you it's alright.

you'll tell me,
"i know."

you'll put the whole thing down.

it follows me home.

you'll sleep through the night.

i'll count every ghost.

i'll tell you
you don't owe me.

i wish you did though.

but you don't,

so i say

goodnight, ghosts.

we spend all our hours

throwing our stones

yours sink and get swallowed

i can't put mine down

a stupid rock in my hands

is all i think about

a stupid rock in my hands

somehow means kissing on your couch

everything is everything to me

everything is you to me

if i throw this stone

does it mean you'll leave?

you tell me you love me

but it's hard to believe

the stones i hold aren't smooth

they wouldn't skip on a pond

their edges are sharp

and their beauty is gone

anything i could say to you

would break you into two

and if i can't have all of you

there's not much left to do

so i'd rather

be quiet

and tell myself you don't owe me,

i wish you did though.

but you don't,

so i say,

goodnight, ghosts.`,
  },
  {
    slug: "no-particular-reason",
    title: "no particular reason",
    year: "2026",
    // short enough that the whole poem fits on its card
    lines: "i close my eyes when i’m getting changed\nopen them when i’m dressed\nget scared all the same",
    text: `i close my eyes when i’m getting changed

open them when i’m dressed

get scared all the same`,
  },
  {
    slug: "perfume",
    title: "perfume",
    year: "2025",
    // TODO(Ona): which lines show on the card (the opening, for now)
    lines: "i hate you\nand you love me\nbeen a few months\nand i can't breathe",
    text: `i hate you
and you love me
been a few months
and i can't breathe
i'm trying
to be lovely
but your mind's shut
and it's empty

and i keep
collecting proof
little things
i can point to
the way you laugh
the way you speak
but these things
they're things i can't keep
when it's dark out
and you aren't with me

you lived like smoke
inside my room
i held my breath
to keep you too

you were a coat
hung on a chair
i kept talking
like you were there

your coffee cup
stayed in the sink
i washed around it
for a week

i still moved over
in my sleep
though half the bed
stayed cold for weeks

you memorized
my favorite lines
left the margins
blank every time

you love the girl
that stays the same
the one you built
inside your brain
and i can't tell
what's left of me
beneath the shape
you want to see

you filled the room
the way perfume
outlives the skin
it once belonged to

i hate you
and you love me
i'm finally learning
what that means
all i kept
was what you knew
none of it
was really you`,
  },
  {
    slug: "liar",
    title: "liar",
    year: "2026",
    // TODO(Ona): which lines show on the card (the opening, for now)
    lines: "try not to bruise me, i'm delicate\nall that i've said, i hope you forget",
    text: `try not to bruise me, i'm delicate

all that i've said, i hope you forget

it's hard not to hurt when i'm so close to it

you promise to stay

but it feels like a threat


try all i want, you've still got me beat

i'm boring and tired

can't get myself to eat

you said do what you want

so i crawled into your sheets

waiting to see if you'd maybe

let me sleep in your arms for a while

flash you that "beautiful smile"

let me rest and confess

everything i've been thinking


say i wanna die with my seatbelt on

won't risk my life, i'm not that far gone

you call me a liar

i don't disagree

my sadness is fun

till it's trapping me

say i wanna die with my seatbelt on

i don't wanna die

i don't really wanna die

while you're still in my life

so for now,

i'll say i wanna die with my seatbelt on.`,
  },
  {
    slug: "thursday-morning-7-am",
    title: "thursday morning, 7 am",
    year: "2024",
    // TODO(Ona): which lines show on the card (the opening, for now)
    lines: "i wake up at 7 again\nyour room feels borrowed, not mine",
    text: `i wake up at 7 again
your room feels borrowed, not mine
the air is heavy, like it knows
i shouldn't still be inside

your curtains suffocate the light
i told you i hate the dark
it presses fingers to my eyes
it listens when my thoughts get loud

i turn to you
you turn away
even unconscious, you don't stay

you look so safe when you're like this
mouth half-open, not existing
but i'm scared to be asleep
while you're awake

so i hold my body hostage
force my eyes to never break
if i blink you might become someone
who finally walks away

i measure time in your breathing
count the rise and fall like proof
that there's a person in this body
even if it's not with me

how did i fall into this
loving something that won't see me?
you're here enough to touch my face
not enough to ever be

your nose drags soft across my skin
i wake up fast, i let it in

i stare and wait for something real
for that rush i'm meant to feel
isn't love supposed to hit?
isn't it supposed to ache?

but i'm scared to close my eyes
scared of what i'll wake up to
there's someone kinder in my head
someone kinder than you

maybe in a couple months
you'll wake up, really wake up
say my name like it belongs to you
not like something you picked up

for now you're never here
just a shape i memorize
i learn your face like it's a language
i'll never hear out loud

if i beg, you let me stay
like i'm asking for too much
like i'm something temporary
you forgot you even touched

so i stay awake
i stay awake
i stay awake

until the house starts breathing
until footsteps fill the hall
until i have to be a stranger
who was never here at all

you seem so safe
you seem so safe

but i'm terrified
to sleep at all`,
  },
  {
    slug: "fresh-bread",
    title: "fresh bread",
    year: "2026",
    // TODO(Ona): which lines show on the card (the opening, for now)
    lines: "i don’t think i could be nearly as good as you were,\nor as kind,\nor as patient.",
    text: `i don’t think i could be nearly as good as you were,
or as kind,
or as patient.

my children would never wake up to fresh bread,
and i wouldn’t teach them how to love right.

i would burn the crust
or forget the salt
or let the dough collapse in on itself
because i was too tired to knead it back to life.

i would love them loudly,
clumsily,
with hands that shake
and words that trip over their own apologies.

i would tell them the truth too soon.
i would let them see me cry in the kitchen light.
i would not smooth the sharp edges of the world
before placing it in their palms.

they would not wake to the smell of something rising,
only to the sound of me trying.

and maybe that is the difference.

you built mornings out of flour and silence.
i would build them out of confession.

you knew how to hold love steady,
how to slice it evenly,
how to make it last the week.

i would hand it to them torn,
still warm,
unmeasured,

and hope
they learn
that love does not have to be perfect
to be real.`,
  },
  {
    slug: "broken-keys-disguised-as-steam",
    title: "broken keys, disguised as steam",
    // TODO(Ona): which lines show on the card (the opening, for now)
    year: "2026",
    lines: "i stapled your name to every telephone pole in my chest.",
    text: `i stapled your name to every telephone pole in my chest.

used red ink ran out halfway through.

switched to blue.

it didn’t feel right,

but it still bled.

you weren’t even really gone.
you were on the couch,
three galaxies away,
still breathing,
but like you hadn’t agreed to the day.

i left out food.
said your name in the voice
you’re supposed to use for skittish things,
soft, like maybe i wouldn’t ask anything of you
if you just came home.

i asked the fire hydrant if it had seen you.
it yawned.
told me you'd passed by
disguised as steam.

i started writing missing
on my own forehead,
just in case anyone asked.

i left out bowls of water,
one for you,
one for the version of you
who might still be thirsty.

i sprinkled the lawn with broken keys
and forgot what door i was waiting at.

you liked latching onto concepts.
said emotions made more sense
if you put them in a bridge.
you wrote songs about drowning,
but never once tried to swim.

i think you liked music
because it let you talk without choosing a side.
you could pretend you weren’t saying anything at all.
just notes and rhymes and some girl’s name
you’d never admit was mine.

and maybe you weren’t lost.
maybe you just fell asleep in a metaphor
and forgot how to climb out.

maybe you melted into your own unfinished chorus
and left no forwarding address.

i kept trying to spell you right
in alphabet soup.
kept checking the answering machine
for bark-sounds.
kept thinking grief would knock
before it let itself in.

eventually, i stopped
translating the silence.
let the bowls of water evaporate.
let the broken keys rust
into a new kind of language
no one asks me to read.

i didn’t move on.
i just
moved sideways.
like a crab. or a bad decision.

anyway,
if you come back,
the porch light’s out.
but i think the moon
remembers how to find us.

and still,

some part of me

is stapling your name

to every telephone pole i pass,

even now,

with nothing left to offer

but an old picture,

and a number

that no longer rings.`,
  },
  {
    slug: "and-i-loved-you-for-a-very-long-time",
    title: "and i loved you for a very long time",
    // TODO(Ona): which lines show on the card (the opening, for now)
    year: "2026",
    lines: "i hate you and i loved you for a very long time\nwe used to trade insults\nbut still you were mine",
    text: `i hate you and i loved you for a very long time

we used to trade insults

but still you were mine

scared to stare at you

scared of what i might find

i miss how your sheets felt

but your room was a mess

i hated waking up

to the smell of cigarettes

i swear if i look too hard

i just might get gone

the fantasy has melted

all bets are off

the curtains were closed

so you could sleep late

you didn’t seem to think

it was a sign of decay

you’re safe, you’re safe

that’s what you say

but i’m scared to be asleep

while you’re awake

there’s things i know

you know i know

like how i think of you

everywhere i go

like how you don’t know me

nearly as much as you think

how you hate to hold me

my touch makes you flinch

i made you buy cologne

i built you into a catch

you swam far away

my spell didn’t last

now some other girl

thinks you have great taste

and some other girl

doesn’t care how you’re late

and some other girl

thinks that i was crazy

but that new girl

doesn’t know that you made

me lose my mind

i hate that you changed me

now i can’t change back

so what if i miss me

missin won’t bring us back`,
  },
  {
    slug: "pretty-face",
    title: "pretty face",
    // TODO(Ona): which lines show on the card (the opening, for now)
    year: "2026",
    lines: "your sheets achieved what i never could\nyour bed finally made you feel \"understood\"",
    text: `your sheets achieved what i never could

your bed finally made you feel "understood"

your preference for barely existing

flew right over my head

made every little effort so you didn’t end up

dead

all the things you left

are more things to forget

jealous of your pretty face

i’m jealous of your pillowcase

it got to feel that pretty face

without feeling so ashamed

of wanting something

so, so

unattainable

my friends had a point

didn’t think i’d prove them right

i thought you letting me stay the night

might have been a sign

this time it was right

this time you were mine`,
  },
  {
    slug: "i-wont-i-wont",
    title: "i wont i wont",
    year: "2026",
    // short enough that the whole poem fits on its card
    lines: "i don’t think i can stay here\nit’s like you won’t let me breathe\nnothing i do will please you\nbut you know i won’t leave",
    text: `i don’t think i can stay here

it’s like you won’t let me breathe

nothing i do will please you

but you know i won’t leave`,
  },
];

// "operating manual for a silenced thing" has a title but no text yet, so it
// stays as a placeholder (it's featured on the home page) until Ona adds it
export const writings: Writing[] = [
  ...poems,
  {
    slug: "poem-1",
    title: TITLES["poem-1"],
    lines: "the first line of the poem,\nand maybe the second.",
    text: "your poem goes here,\nline by line,\nwith its own breaks kept\n\nand its stanzas too.",
    year: YEARS["poem-1"],
  },
];

export const piecesIn = (section: string) => pieces.filter((p) => p.section === section);
export const pieceBy = (section: string, slug: string) =>
  pieces.find((p) => p.section === section && p.slug === slug);
export const writingBy = (slug: string) => writings.find((w) => w.slug === slug);

export const links = {
  shop: "https://claybyona.com",
  instagram: "https://instagram.com/claybyona",
  email: "claybyona@gmail.com",
};
