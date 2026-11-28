// The little pixel file icons on the writing desktop, drawn as text grids
// like the sprites in Pixel.tsx. Every colour comes from the site palette:
//   n navy (outlines)   w paper   m mist (the text lines)   p pink   . see-through
export const ICON_COLOURS: Record<string, string> = {
  n: "var(--navy)",
  w: "var(--paper)",
  m: "var(--mist)",
  p: "var(--pink)",
};

export const ICONS = {
  // a page with a folded pink corner and a few lines of text: every poem
  txt: [
    "nnnnnnn...",
    "nwwwwwnn..",
    "nwwwwwnpn.",
    "nwmmmwnnnn",
    "nwwwwwwwwn",
    "nwmmmmmmwn",
    "nwwwwwwwwn",
    "nwmmmmmmwn",
    "nwwwwwwwwn",
    "nwmmmmwwwn",
    "nwwwwwwwwn",
    "nnnnnnnnnn",
  ],
  // the same page with a little pink heart: readme.txt
  readme: [
    "nnnnnnn...",
    "nwwwwwnn..",
    "nwwwwwnpn.",
    "nwmmmwnnnn",
    "nwwwwwwwwn",
    "nwmmmmmmwn",
    "nwwwwwwwwn",
    "nwwpwpwwwn",
    "nwpppppwwn",
    "nwwpppwwwn",
    "nwwwpwwwwn",
    "nnnnnnnnnn",
  ],
} as const;

export type IconName = keyof typeof ICONS;
