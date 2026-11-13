import type { Metadata } from "next";
import { Cormorant_Garamond, Newsreader, Nothing_You_Could_Do } from "next/font/google";
import { getSite } from "@/content/load";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const body = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
