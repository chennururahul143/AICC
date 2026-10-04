import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries, readListFilters } from "@/lib/data";

export const metadata: Metadata = { title: "Models" };

export default async function ModelsPage(props: PageProps<"/models">) {
  const filters = readListFilters(await props.searchParams);
  return (
    <CollectionView
      title="Models"
      description="Collected Hugging Face models and the sample notes."
      items={await listEntries("model")}
      topic={filters.topic}
      provenance={filters.provenance}
    />
  );
}
