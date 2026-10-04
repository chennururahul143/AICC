import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries, readListFilters } from "@/lib/data";

export const metadata: Metadata = { title: "AI News" };

export default async function NewsPage(props: PageProps<"/news">) {
  const filters = readListFilters(await props.searchParams);
  return (
    <CollectionView
      title="AI News"
      description="Collected articles and the sample set. Each collected item keeps its original source link."
      items={await listEntries("article")}
      topic={filters.topic}
      provenance={filters.provenance}
    />
  );
}
