import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries, readListFilters } from "@/lib/data";

export const metadata: Metadata = { title: "Benchmarks" };

export default async function BenchmarksPage(props: PageProps<"/benchmarks">) {
  const filters = readListFilters(await props.searchParams);
  return (
    <CollectionView
      title="Benchmarks"
      description="Sample boards. Scores are not reproduced, and unverified items say so."
      items={await listEntries("benchmark")}
      topic={filters.topic}
      provenance={filters.provenance}
    />
  );
}
