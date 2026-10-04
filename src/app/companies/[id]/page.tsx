import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityDetail } from "@/components/entity-detail";
import { getEntry } from "@/lib/data";

export async function generateMetadata(
  props: PageProps<"/companies/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const entry = await getEntry("company", id);
  return { title: entry?.title ?? "AI Companies" };
}

export default async function CompanyDetailPage(props: PageProps<"/companies/[id]">) {
  const { id } = await props.params;
  const entry = await getEntry("company", id);
  if (!entry) notFound();
  return <EntityDetail entry={entry} />;
}
