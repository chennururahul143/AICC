import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries } from "@/lib/data";

export const metadata: Metadata = { title: "Benchmarks" };

export default function BenchmarksPage() {
  return (
    <CollectionView
      title="Benchmarks"
      description="Sample boards. Scores are not reproduced, and unverified items say so."
      items={listEntries("benchmark")}
    />
  );
}
