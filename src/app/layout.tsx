import type { Metadata } from "next";
import { Delius, Nothing_You_Could_Do } from "next/font/google";
import { getSite } from "@/content/load";

const hand = Nothing_You_Could_Do({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

const body = Delius({
  variable: "--font-body",
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
    <html lang="en" className={`${hand.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
