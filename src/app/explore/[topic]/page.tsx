import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ItemRow } from "@/components/item-row";
import { SectionHeader } from "@/components/section-header";
import { getTopic, listByTopic } from "@/lib/data";
import { kindLabel } from "@/lib/format";
import type { EntityKind } from "@/lib/types";

const order: EntityKind[] = [
  "model",
  "paper",
  "company",
  "repository",
  "benchmark",
  "article",
];

export async function generateMetadata(
  props: PageProps<"/explore/[topic]">,
): Promise<Metadata> {
  const { topic } = await props.params;
  const record = getTopic(topic);
  return { title: record?.name ?? "Explore" };
}

export default async function TopicPage(props: PageProps<"/explore/[topic]">) {
  const { topic } = await props.params;
  const record = getTopic(topic);
  if (!record) notFound();
  const items = listByTopic(topic);
  const groups = order
    .map((kind) => ({ kind, items: items.filter((item) => item.kind === kind) }))
    .filter((group) => group.items.length > 0);

  return (
    <section>
      <SectionHeader heading="h1" title={record.name} description={record.signal} />
      <p className="mb-6 text-xs text-muted-foreground">
        Sample topic. Signals are synthetic.
      </p>
      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sample items use this topic yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
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
      )}
    </section>
  );
}
