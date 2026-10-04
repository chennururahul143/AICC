import Link from "next/link";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ItemRow } from "@/components/item-row";
import { OverviewBriefing } from "@/components/overview-briefing";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { RelationshipChips } from "@/components/relationship-chips";
import { SectionHeader } from "@/components/section-header";
import {
  getBriefing,
  listConnections,
  listDevelopments,
  listEntries,
  listTopics,
  sourceSections,
} from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function OverviewPage() {
  const [briefing, developments, connections, topics, sourceLists] = await Promise.all([
    getBriefing(),
    listDevelopments(),
    listConnections(),
    listTopics(),
    Promise.all(
      sourceSections.map(async (section) => ({
        ...section,
        items: (await listEntries(section.kind)).slice(0, 2),
      })),
    ),
  ]);

  return (
    <DashboardLayout
      items={[
        {
          id: "briefing",
          title: "Intelligence briefing",
          children: (
      <section aria-labelledby="briefing-title" className="border border-border p-5 md:p-6">
        <OverviewBriefing defaultBriefing={briefing} />
      </section>
          ),
        },
        {
          id: "developments",
          title: "Important developments",
          children: (
      <section aria-labelledby="developments-title">
        <SectionHeader
          id="developments-title"
          eyebrow="02"
          title="Important developments"
          description="Why a sample item is worth opening, with the entities it connects to."
        />
        <div className="flex flex-col gap-5">
          {developments.map((item) => (
            <article key={item.id} className="border-b border-border pb-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <ProvenanceBadge provenance={item.provenance} />
                <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
              </div>
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                {item.whyItMatters}
              </p>
              <div className="mt-3">
                <RelationshipChips related={item.related} />
              </div>
            </article>
          ))}
        </div>
      </section>
          ),
        },
        {
          id: "connections",
          title: "Related entities",
          children: (
      <section aria-labelledby="connections-title">
        <SectionHeader
          id="connections-title"
          eyebrow="03"
          title="Related entities"
          description="Clusters you can walk through. Each chip opens a sample item."
        />
        <div className="grid gap-4 @min-[40rem]:grid-cols-3">
          {connections.map((group) => (
            <article key={group.id} className="border border-border p-3">
              <h3 className="text-sm font-medium">{group.title}</h3>
              <div className="mt-2">
                <ProvenanceBadge provenance={group.provenance} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{group.note}</p>
              <div className="mt-3">
                <RelationshipChips related={group.related} />
              </div>
            </article>
          ))}
        </div>
      </section>
          ),
        },
        {
          id: "topics",
          title: "Emerging topics",
          children: (
      <section aria-labelledby="topics-title">
        <SectionHeader
          id="topics-title"
          eyebrow="04"
          title="Emerging topics"
          description="One-line signals from this sample set. Explore also lists collected items assigned to the topic."
          href="/explore"
          action="Explore"
        />
        <ul className="grid gap-2 @min-[24rem]:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link
                href={`/explore/${topic.id}`}
                className="block border border-border px-3 py-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-sm font-medium">{topic.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{topic.signal}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
          ),
        },
        {
          id: "sources",
          title: "Source content",
          children: (
      <section aria-labelledby="sources-title" className="border-t border-border pt-6">
        <SectionHeader
          id="sources-title"
          eyebrow="05"
          title="Source content"
          description="Short pointers into the catalog. This is not the briefing."
        />
        <div className="grid gap-6 @min-[32rem]:grid-cols-2">
          {sourceLists.map((section) => (
            <div key={section.kind}>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {section.label}
                </h3>
                <Link
                  href={section.href}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  View all
                </Link>
              </div>
              {section.items.map((entry) => (
                <ItemRow key={entry.id} entry={entry} compact />
              ))}
            </div>
          ))}
        </div>
      </section>
          ),
        },
      ]}
    />
  );
}
