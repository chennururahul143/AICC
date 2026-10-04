import Link from "next/link";

import { BookmarkToggle } from "@/components/bookmark-toggle";
import { ConnectedLinks } from "@/components/connected-links";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { RelationshipChips } from "@/components/relationship-chips";
import { SectionHeader } from "@/components/section-header";
import { formatDate, kindLabel } from "@/lib/format";
import { collectionFor, hrefFor, listTopics } from "@/lib/data";
import type { CatalogEntry } from "@/lib/types";

export async function EntityDetail({ entry }: { entry: CatalogEntry }) {
  const meta = [entry.sourceName, entry.publishedAt ? formatDate(entry.publishedAt) : null]
    .filter(Boolean)
    .join(" · ");
  const catalogTopics = await listTopics();
  const topics = entry.topicIds
    .map((id) => catalogTopics.find((topic) => topic.id === id))
    .filter((topic) => topic !== undefined);
  const interpretationTopics = (entry.interpretation?.topicIds ?? [])
    .filter((id) => !topics.some((topic) => topic.id === id))
    .map((id) => catalogTopics.find((topic) => topic.id === id))
    .filter((topic) => topic !== undefined);
  const collection = collectionFor(entry.kind);

  return (
    <article className="max-w-3xl">
      <p className="text-xs text-muted-foreground">
        <Link href={collection.href} className="underline-offset-4 hover:underline">
          {collection.label}
        </Link>
      </p>
      <p className="mt-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
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
        {entry.origin === "collected"
          ? "Short snippet from the source. Not the full text."
          : "Sample excerpt. Not a quotation from a real source."}
      </p>
      {entry.interpretation ? (
        <section className="mt-6">
          <SectionHeader title="Summary" />
          <ProvenanceBadge provenance={entry.interpretation.provenance} />
          <p className="mt-2 text-sm leading-6">{entry.interpretation.summary}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Written from the stored snippet. It is not a substitute for the source.
          </p>
          {entry.interpretation.claims.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-3">
              {entry.interpretation.claims.map((claim) => (
                <li key={claim.text}>
                  <ProvenanceBadge provenance={claim.provenance} />
                  <p className="mt-1 text-sm leading-6">{claim.text}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {entry.interpretation.entities.length > 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {entry.interpretation.entities.map((entity) => entity.name).join(" · ")}
            </p>
          ) : null}
        </section>
      ) : null}
      {entry.sourceUrl ? (
        <p className="mt-4 text-sm">
          <a
            href={entry.sourceUrl}
            className="underline-offset-4 hover:underline"
            rel="noreferrer"
          >
            {entry.origin === "collected" ? "Source" : "Sample source link"}
          </a>
          {entry.origin === "collected" ? null : (
            <span className="text-muted-foreground"> · example.com placeholder</span>
          )}
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

      {topics.length > 0 || interpretationTopics.length > 0 ? (
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
            {interpretationTopics.map((topic) => (
              <li key={topic.id} className="inline-flex items-center gap-1.5">
                <ProvenanceBadge provenance="interpretation" />
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

      {(entry.links ?? []).length > 0 ? (
        <section className="mt-8">
          <SectionHeader
            title="Connected"
            description="Shared topics or names from the collected text. These links are AI interpretation, not a statement from one source."
          />
          <ConnectedLinks links={entry.links ?? []} />
        </section>
      ) : null}

      {entry.related.length > 0 ? (
        <section className="mt-8">
          <SectionHeader
            title="Related"
            description={
              entry.origin === "collected"
                ? "Items linked to this one."
                : "Other sample items linked to this one."
            }
          />
          <RelationshipChips related={entry.related} />
        </section>
      ) : null}
    </article>
  );
}
