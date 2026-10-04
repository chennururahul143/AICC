import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityDetail } from "@/components/entity-detail";
import { getEntry } from "@/lib/data";

export async function generateMetadata(props: PageProps<"/github/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const entry = await getEntry("repository", id);
  return { title: entry?.title ?? "GitHub Projects" };
}

export default async function RepositoryDetailPage(props: PageProps<"/github/[id]">) {
  const { id } = await props.params;
  const entry = await getEntry("repository", id);
  if (!entry) notFound();
  return <EntityDetail entry={entry} />;
}
