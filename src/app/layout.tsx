import type { Metadata } from "next";
import { Delius, Nothing_You_Could_Do } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: { default: "onA — Ona Cabedo Wells", template: "%s — onA" },
  description: "Ceramics, fashion, art and writing by Ona Cabedo Wells.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hand.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
