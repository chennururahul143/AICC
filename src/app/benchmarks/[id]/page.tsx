import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityDetail } from "@/components/entity-detail";
import { getEntry } from "@/lib/data";

export async function generateMetadata(
  props: PageProps<"/benchmarks/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const entry = getEntry("benchmark", id);
  return { title: entry?.title ?? "Benchmarks" };
}

export default async function BenchmarkDetailPage(props: PageProps<"/benchmarks/[id]">) {
  const { id } = await props.params;
  const entry = getEntry("benchmark", id);
  if (!entry) notFound();
  return <EntityDetail entry={entry} />;
}
