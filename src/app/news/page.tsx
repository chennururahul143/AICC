import type { Metadata } from "next";

import { CollectionView } from "@/components/collection-view";
import { listEntries } from "@/lib/data";

export const metadata: Metadata = { title: "AI News" };

export default function NewsPage() {
  return (
    <CollectionView
      title="AI News"
      description="Sample articles. Open one to follow the models, papers, and organizations it mentions."
      items={listEntries("article")}
    />
  );
}
