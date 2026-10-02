import Link from "next/link";

import { BookmarkToggle } from "@/components/bookmark-toggle";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { RelationshipChips } from "@/components/relationship-chips";
import { SectionHeader } from "@/components/section-header";
import { formatDate, kindLabel } from "@/lib/format";
import { getTopic, hrefFor } from "@/lib/data";
import type { CatalogEntry } from "@/lib/types";

export function EntityDetail({ entry }: { entry: CatalogEntry }) {
  const meta = [entry.sourceName, entry.publishedAt ? formatDate(entry.publishedAt) : null]
    .filter(Boolean)
    .join(" · ");
  const topics = entry.topicIds
    .map((id) => getTopic(id))
    .filter((topic) => topic !== undefined);

  return (
    <article className="max-w-3xl">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {kindLabel(entry.kind)}
      </p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{entry.title}</h1>
        <BookmarkToggle kind={entry.kind} id={entry.id} title={entry.title} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ProvenanceBadge provenance={entry.provenance} />
        {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
      </div>
      <p className="mt-4 text-sm leading-6">{entry.excerpt}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Sample excerpt. Not a quotation from a real source.
      </p>
      {entry.sourceUrl ? (
        <p className="mt-4 text-sm">
          <a
            href={entry.sourceUrl}
            className="underline-offset-4 hover:underline"
            rel="noreferrer"
          >
            Sample source link
          </a>
          <span className="text-muted-foreground"> · example.com placeholder</span>
        </p>
      ) : null}

      {entry.facts.length > 0 ? (
        <section className="mt-8">
          <SectionHeader title="Details" />
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {entry.facts.map((fact) => (
              <div key={fact.label} className="border-b border-border py-2">
                <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {topics.length > 0 ? (
        <section className="mt-8">
          <SectionHeader title="Topics" />
          <ul className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={hrefFor("topic", topic.id)}
                  className="inline-flex rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                >
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <SectionHeader
          title="Related"
          description="Other sample items linked to this one."
        />
        <RelationshipChips related={entry.related} />
      </section>
    </article>
  );
}
