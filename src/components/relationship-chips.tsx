import Link from "next/link";

import { kindLabel } from "@/lib/format";
import { resolveRef } from "@/lib/data";
import type { EntityRef } from "@/lib/types";

export async function RelationshipChips({ related }: { related: EntityRef[] }) {
  const items = (
    await Promise.all(
      related.map(async (ref) => {
        const resolved = await resolveRef(ref);
        if (!resolved) return null;
        return { ...resolved, kind: ref.kind, id: ref.id };
      }),
    )
  ).filter((item) => item !== null);

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={`${item.kind}:${item.id}`}>
          <Link
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-muted-foreground">{kindLabel(item.kind)}</span>
            <span>{item.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
