import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries } from "@/lib/data";

export const metadata: Metadata = { title: "AI Companies" };

export default function CompaniesPage() {
  return (
    <CollectionView
      title="AI Companies"
      description="Sample organizations and the models, papers, and repos linked to them."
      items={listEntries("company")}
    />
  );
}
