import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries } from "@/lib/data";

export const metadata: Metadata = { title: "Models" };

export default function ModelsPage() {
  return (
    <CollectionView
      title="Models"
      description="Sample model notes. Follow a release into its lab, paper, repo, or benchmark."
      items={listEntries("model")}
    />
  );
}
