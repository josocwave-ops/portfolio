import type { Metadata } from "next";
import WritingBoard from "./WritingBoard";

export const metadata: Metadata = { title: "poetry" };

export default function WritingPage() {
  return <WritingBoard />;
}
