import { CollectionFilters } from "@/components/collection-filters";
import { ItemRow } from "@/components/item-row";
import { SectionHeader } from "@/components/section-header";
import { filterEntries, listTopics } from "@/lib/data";
import type { CatalogEntry, Provenance } from "@/lib/types";

export async function CollectionView({
  title,
  description,
  items,
  topic = "",
  provenance = "",
}: {
  title: string;
  description: string;
  items: CatalogEntry[];
  topic?: string;
  provenance?: Provenance | "";
}) {
  const catalogTopics = await listTopics();
  const used = new Set(items.flatMap((item) => item.topicIds));
  const topics = catalogTopics
    .filter((item) => used.has(item.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  const activeTopic = topics.some((item) => item.id === topic) ? topic : "";
  const filtered = filterEntries(items, { topic: activeTopic, provenance });
  const filteredView = Boolean(activeTopic || provenance);

  return (
    <section>
      <SectionHeader heading="h1" title={title} description={description} />
      <CollectionFilters
        collectionLabel={title}
        topics={topics}
        topic={activeTopic}
        provenance={provenance}
      />
      <p className="mb-2 text-xs text-muted-foreground">
        {filteredView
          ? `${filtered.length} of ${items.length} items`
          : `${items.length} items`}
      </p>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items match these filters.</p>
      ) : (
        <div>
          {filtered.map((entry) => (
            <ItemRow key={`${entry.kind}:${entry.id}`} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
