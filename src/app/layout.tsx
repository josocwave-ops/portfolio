import type { Metadata } from "next";
import { EB_Garamond, Nothing_You_Could_Do, Silkscreen, Sorts_Mill_Goudy } from "next/font/google";
import { getSite } from "@/content/load";

// storybook titles, bookish reading text, tiny pixel labels, and handwriting for notes
const display = Sorts_Mill_Goudy({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const body = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const pixel = Silkscreen({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const hand = Nothing_You_Could_Do({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

const site = getSite();

export const metadata: Metadata = {
  title: { default: `onA — ${site.name}`, template: "%s — onA" },
  description: site.description,
};

// site styles live in (site)/layout so they never leak into the editing room
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${pixel.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
