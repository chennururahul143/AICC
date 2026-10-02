import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries } from "@/lib/data";

export const metadata: Metadata = { title: "GitHub Projects" };

export default function GitHubPage() {
  return (
    <CollectionView
      title="GitHub Projects"
      description="Sample repositories linked from model notes, papers, and benchmarks."
      items={listEntries("repository")}
    />
  );
}
