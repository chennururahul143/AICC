import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityDetail } from "@/components/entity-detail";
import { getEntry } from "@/lib/data";

export async function generateMetadata(props: PageProps<"/papers/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const entry = getEntry("paper", id);
  return { title: entry?.title ?? "Research Papers" };
}

export default async function PaperDetailPage(props: PageProps<"/papers/[id]">) {
  const { id } = await props.params;
  const entry = getEntry("paper", id);
  if (!entry) notFound();
  return <EntityDetail entry={entry} />;
}
