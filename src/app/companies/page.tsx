import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries, readListFilters } from "@/lib/data";

export const metadata: Metadata = { title: "AI Companies" };

export default async function CompaniesPage(props: PageProps<"/companies">) {
  const filters = readListFilters(await props.searchParams);
  return (
    <CollectionView
      title="AI Companies"
      description="Sample organizations and the models, papers, and repos linked to them."
      items={await listEntries("company")}
      topic={filters.topic}
      provenance={filters.provenance}
    />
  );
}