import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityDetail } from "@/components/entity-detail";
import { getEntry } from "@/lib/data";

export async function generateMetadata(props: PageProps<"/news/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const entry = await getEntry("article", id);
  return { title: entry?.title ?? "AI News" };
}

export default async function NewsDetailPage(props: PageProps<"/news/[id]">) {
  const { id } = await props.params;
  const entry = await getEntry("article", id);
  if (!entry) notFound();
  return <EntityDetail entry={entry} />;
}
