"use client";

import { ItemRow } from "@/components/item-row";
import { SectionHeader } from "@/components/section-header";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { getEntry } from "@/lib/data";

export function BookmarksView() {
  const { items } = useBookmarks();
  const saved = items
    .map((item) => getEntry(item.kind, item.id))
    .filter((entry) => entry !== undefined);

  return (
    <section>
      <SectionHeader
        heading="h1"
        title="Bookmarks"
        description="Items you save in this browser. Nothing is sent to a server."
      />
      {saved.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No saved items yet. Use Save on any sample item.
        </p>
      ) : null}
      {saved.map((entry) => (
        <ItemRow key={`${entry.kind}:${entry.id}`} entry={entry} />
      ))}
    </section>
  );
}
