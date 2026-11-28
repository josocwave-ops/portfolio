import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { writingBy, writings } from "@/content/work";
import Background from "../../components/Background";
import WritingBoard from "../WritingBoard";

export function generateStaticParams() {
  return writings.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: writingBy(slug)?.title ?? "poetry" };
}

// a poem's own address: the writing desktop, with this poem already open
// (params are read inside Suspense so navigation can show the shell instantly)
export default function PoemPage({ params }: PageProps<"/writing/[slug]">) {
  return (
    <Suspense fallback={<Background />}>
      <PoemBody params={params} />
    </Suspense>
  );
}

async function PoemBody({ params }: { params: PageProps<"/writing/[slug]">["params"] }) {
  const { slug } = await params;
  if (!writingBy(slug)) notFound();
  return <WritingBoard open={slug} />;
}
