import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries, readListFilters } from "@/lib/data";

export const metadata: Metadata = { title: "GitHub Projects" };

export default async function GitHubPage(props: PageProps<"/github">) {
  const filters = readListFilters(await props.searchParams);
  return (
    <CollectionView
      title="GitHub Projects"
      description="Collected GitHub repositories and the sample repos."
      items={await listEntries("repository")}
      topic={filters.topic}
      provenance={filters.provenance}
    />
  );
}
