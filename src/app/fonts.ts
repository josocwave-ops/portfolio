import { Bodoni_Moda, Courier_Prime, Karla, Pixelify_Sans } from "next/font/google";

// All the site's fonts, set up once.

// headings, navigation, labels: never more than a line
export const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

// everything you read
export const body = Karla({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// poems and editorial details; its heavy italic is what the ASCII onA is drawn from
export const serif = Bodoni_Moda({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "800"],
});

// ASCII art, little labels and file names: typewriter / early-internet
export const mono = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});
