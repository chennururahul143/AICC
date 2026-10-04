import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FollowTopicToggle } from "@/components/follow-topic-toggle";
import { ItemRow } from "@/components/item-row";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { SectionHeader } from "@/components/section-header";
import { getTopic, listByTopic } from "@/lib/data";
import { kindLabel } from "@/lib/format";
import type { CatalogEntry, EntityKind } from "@/lib/types";

const order: EntityKind[] = [
  "model",
  "paper",
  "company",
  "repository",
  "benchmark",
  "article",
];

function groupsFor(items: CatalogEntry[]) {
  return order
    .map((kind) => ({ kind, items: items.filter((item) => item.kind === kind) }))
    .filter((group) => group.items.length > 0);
}

export async function generateMetadata(
  props: PageProps<"/explore/[topic]">,
): Promise<Metadata> {
  const { topic } = await props.params;
  const record = await getTopic(topic);
  return { title: record?.name ?? "Explore" };
}

export default async function TopicPage(props: PageProps<"/explore/[topic]">) {
  const { topic } = await props.params;
  const record = await getTopic(topic);
  if (!record) notFound();
  const items = (await listByTopic(topic)) ?? [];
  const sampleGroups = groupsFor(items.filter((item) => item.origin !== "collected"));
  const collectedGroups = groupsFor(items.filter((item) => item.origin === "collected"));

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <SectionHeader heading="h1" title={record.name} description={record.signal} />
        <FollowTopicToggle topicId={record.id} topicName={record.name} />
      </div>
      <p className="mb-6 text-xs text-muted-foreground">
        Topic signal from the sample set. Collected items are listed when a summary assigned this topic.
      </p>
      {sampleGroups.length === 0 && collectedGroups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items use this topic yet.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {sampleGroups.length > 0 ? (
            <div className="flex flex-col gap-8">
              {sampleGroups.map((group) => (
                <div key={group.kind}>
                  <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {kindLabel(group.kind)}
                  </h2>
                  {group.items.map((entry) => (
                    <ItemRow key={entry.id} entry={entry} />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {collectedGroups.length > 0 ? (
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-medium">Collected</h2>
                <ProvenanceBadge provenance="interpretation" />
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Assigned from the stored snippet. This is not a source statement.
              </p>
              <div className="flex flex-col gap-8">
                {collectedGroups.map((group) => (
                  <div key={group.kind}>
                    <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {kindLabel(group.kind)}
                    </h3>
                    {group.items.map((entry) => (
                      <ItemRow key={entry.id} entry={entry} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
