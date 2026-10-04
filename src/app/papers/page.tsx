import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries, readListFilters } from "@/lib/data";

export const metadata: Metadata = { title: "Research Papers" };

export default async function PapersPage(props: PageProps<"/papers">) {
  const filters = readListFilters(await props.searchParams);
  return (
    <CollectionView
      title="Research Papers"
      description="Collected papers from arXiv and the sample notes. Collected excerpts are short snippets, not the paper."
      items={await listEntries("paper")}
      topic={filters.topic}
      provenance={filters.provenance}
    />
  );
}
