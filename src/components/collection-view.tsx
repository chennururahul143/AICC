import { ItemRow } from "@/components/item-row";
import { SectionHeader } from "@/components/section-header";
import type { CatalogEntry } from "@/lib/types";

export function CollectionView({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: CatalogEntry[];
}) {
  return (
    <section>
      <SectionHeader heading="h1" title={title} description={description} />
      <p className="mb-2 text-xs text-muted-foreground">{items.length} sample items</p>
      <div>
        {items.map((entry) => (
          <ItemRow key={`${entry.kind}:${entry.id}`} entry={entry} />
        ))}
      </div>
    </section>
  );
}
