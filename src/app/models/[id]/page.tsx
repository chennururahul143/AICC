import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityDetail } from "@/components/entity-detail";
import { getEntry } from "@/lib/data";

export async function generateMetadata(props: PageProps<"/models/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const entry = await getEntry("model", id);
  return { title: entry?.title ?? "Models" };
}

export default async function ModelDetailPage(props: PageProps<"/models/[id]">) {
  const { id } = await props.params;
  const entry = await getEntry("model", id);
  if (!entry) notFound();
  return <EntityDetail entry={entry} />;
}
