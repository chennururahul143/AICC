import Link from "next/link";

import { ProvenanceBadge } from "@/components/provenance-badge";
import { kindLabel } from "@/lib/format";
import { resolveRef } from "@/lib/data";
import type { CatalogLink } from "@/lib/types";

export async function ConnectedLinks({ links }: { links: CatalogLink[] }) {
  const items = (
    await Promise.all(
      links.map(async (link) => {
        const resolved = await resolveRef(link);
        if (!resolved) return null;
        return { ...link, href: resolved.href, title: resolved.title };
      }),
    )
  ).filter((item) => item !== null);

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={`${item.kind}:${item.id}`}>
          <ProvenanceBadge provenance={item.provenance} />
          <p className="mt-1">
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-muted-foreground">{kindLabel(item.kind)}</span>
              <span>{item.title}</span>
            </Link>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{item.reason}</p>
        </li>
      ))}
    </ul>
  );
}
