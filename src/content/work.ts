// All of the site's work and words. Text is from Ona's 2025 print portfolio.
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
};

export type Writing = {
  slug: string;
  title: string;
  pairedWith: string;
  image: Img;
  lines: string;
  text: string;
};

export const sections: { id: SectionId; label: string; color: string; ink: string }[] = [
  { id: "ceramics", label: "ceramics", color: "#8fa89a", ink: "#5f7a6b" },
  { id: "fashion", label: "fashion", color: "#c98fa6", ink: "#a5627c" },
  { id: "art", label: "art", color: "#8394b5", ink: "#5d6f94" },
  { id: "writing", label: "writing", color: "#a99bb5", ink: "#7d6b8d" },
];

export const sectionById = (id: string) => sections.find((s) => s.id === id);

const img = (slug: keyof typeof images) => images[slug] as Img[];

export const pieces: Piece[] = [
  // ceramics
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
  // fashion
  {
    slug: "castle-walls-corset",
    section: "fashion",
    title: "the castle walls corset",
    summary: "A corset built like architecture.",
    statement: [
      "This piece was inspired not by the women inside castles, but by the walls that surrounded them. I approached the corset as a structural object, built through precision, repetition, and restraint. Sewing it pushed my technical abilities further than any previous project and shifted my understanding of garments as architectural forms.",
    ],
    images: img("castle-walls-corset"),
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
    images: img("earthern-skirt"),
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
    images: img("repurposed-crochet"),
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
    images: img("medieval-silhouettes"),
  },
  // art
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
    summary: "Aftermath, and other loud faces.",
    statement: ["A series of experiments in oil pastel."],
    images: img("oil-pastels"),
  },
  {
    slug: "colored-pencil",
    section: "art",
    title: "colored pencil",
    summary: "Sketchbook pages in coloured pencil.",
    statement: ["Sketchbook studies in coloured pencil."],
    images: img("colored-pencil"),
  },
  {
    slug: "charcoal",
    section: "art",
    title: "charcoal",
    summary: "Studies in charcoal.",
    statement: ["Studies in charcoal."],
    images: img("charcoal"),
  },
];

const cups = img("memory-cups");

// Writing lives with the work it belongs to: the memory cup poems.
export const writings: Writing[] = [
  {
    slug: "the-mirror",
    title: "do you remember the mirror that warped my face?",
    pairedWith: "memory-cups",
    image: cups[5],
    lines: "the mirror doesn't lie. it only repeats. it only shoves my own belief down my throat, makes me gag on the image.",
    text: "I used to watch myself for hours, mapping every curve, waiting to catch the moment when the reflection stopped being mine. This cup explores dysmorphia and the first moment I became aware of my own face. The sculpted face is young, almost baby-like, and the handle stretches and pulls at it.",
  },
  {
    slug: "how-to-disappear",
    title: "do you remember when i learned how to disappear?",
    pairedWith: "memory-cups",
    image: cups[4],
    lines: "and what i invent, becoming…",
    text: "This mug explores dissociation, the moment I realised I could vanish without leaving. The poem wrapping it is tangled in spiderwebs that crawl across the fragmented text, both decorating and suffocating it: the quiet terror of disappearing while remaining visible.",
  },
  {
    slug: "smelled-of-smoke",
    title: "do you remember the morning that smelled of smoke?",
    pairedWith: "memory-cups",
    image: cups[0],
    lines: "it smells like the beginning of something terrible, like the day is a hinge.",
    text: "This cup recalls living in a household perpetually marked by fire, a pattern baked into tradition and cycles of depression. Smoke wraps around the mug, and the poem traces tension creeping through walls, doors, and small sounds.",
  },
  {
    slug: "eyes-that-linger",
    title: "do you remember the eyes that linger?",
    pairedWith: "memory-cups",
    image: cups[1],
    lines: "all eyes on me. i don't know you.",
    text: "This cup recalls the day I saw my family after my grandfather died, a moment defined by gazes that wouldn't look away. The surface is covered in sculpted eyes, each one watching, each one heavy: the sense of being seen but not known.",
  },
  {
    slug: "the-moon",
    title: "do you remember the moon outside my window?",
    pairedWith: "memory-cups",
    image: cups[2],
    lines: "all i see is the moon. and she says: i'm here.",
    text: "Sitting alone at dusk, in the dull orange light of the room, not knowing where my mother was, she seemed to become the moon: distant, quiet, unchanging. The cauldron form holds the magic and trust I felt toward her, while a vine climbs the handle.",
  },
];

export const piecesIn = (section: string) => pieces.filter((p) => p.section === section);
export const pieceBy = (section: string, slug: string) =>
  pieces.find((p) => p.section === section && p.slug === slug);

export const links = {
  shop: "https://claybyona.com",
  instagram: "https://instagram.com/claybyona",
  email: "claybyona@gmail.com",
};
