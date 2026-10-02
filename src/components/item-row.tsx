import Link from "next/link";

import { BookmarkToggle } from "@/components/bookmark-toggle";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { formatDate } from "@/lib/format";
import { hrefFor } from "@/lib/data";
import type { CatalogEntry } from "@/lib/types";

export function ItemRow({
  entry,
  compact = false,
}: {
  entry: CatalogEntry;
  compact?: boolean;
}) {
  const href = hrefFor(entry.kind, entry.id);
  const meta = [entry.sourceName, entry.publishedAt ? formatDate(entry.publishedAt) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex items-start justify-between gap-3 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <ProvenanceBadge provenance={entry.provenance} />
          {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        <h3 className="text-sm font-medium">
          <Link href={href} className="hover:underline focus-visible:underline focus-visible:outline-none">
            {entry.title}
          </Link>
        </h3>
        {compact ? null : (
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{entry.excerpt}</p>
        )}
      </div>
      <BookmarkToggle kind={entry.kind} id={entry.id} title={entry.title} />
    </article>
  );
}
