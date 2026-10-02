import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries } from "@/lib/data";

export const metadata: Metadata = { title: "Research Papers" };

export default function PapersPage() {
  return (
    <CollectionView
      title="Research Papers"
      description="Sample papers and notes, linked to the models and repos that cite them."
      items={listEntries("paper")}
    />
  );
}
