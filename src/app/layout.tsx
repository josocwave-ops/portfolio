import type { Metadata } from "next";
import BeatMaker from "./components/BeatMaker";
import SoundEffects from "./components/Sounds";
import Toasts from "./components/Toasts";
import Visit from "./components/Visit";
import { body, mono, pixel, serif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "onA — Ona Cabedo Wells", template: "%s — onA" },
  description: "Ceramics, art & drawing, fashion & textiles and writing by Ona Cabedo Wells.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        {children}
        <SoundEffects />
        <BeatMaker />
        <Toasts />
        <Visit />
      </body>
    </html>
  );
}
