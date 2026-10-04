"use client";

import { usePathname, useRouter } from "next/navigation";

import { SaveViewButton } from "@/components/save-view-button";
import { Button } from "@/components/ui/button";
import type { Provenance } from "@/lib/types";

const provenanceOptions: { value: Provenance; label: string }[] = [
  { value: "source", label: "Source" },
  { value: "interpretation", label: "AI interpretation" },
  { value: "unverified", label: "Unverified" },
];

export function CollectionFilters({
  collectionLabel,
  topics,
  topic,
  provenance,
}: {
  collectionLabel: string;
  topics: { id: string; name: string }[];
  topic: string;
  provenance: Provenance | "";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const active = Boolean(topic || provenance);

  function apply(next: { topic: string; provenance: Provenance | "" }) {
    const params = new URLSearchParams();
    if (next.topic) params.set("topic", next.topic);
    if (next.provenance) params.set("provenance", next.provenance);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="topic-filter" className="text-xs text-muted-foreground">
          Topic
        </label>
        <select
          id="topic-filter"
          value={topic}
          onChange={(event) => apply({ topic: event.target.value, provenance })}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <option value="">All topics</option>
          {topics.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="provenance-filter" className="text-xs text-muted-foreground">
          Provenance
        </label>
        <select
          id="provenance-filter"
          value={provenance}
          onChange={(event) =>
            apply({
              topic,
              provenance: event.target.value as Provenance | "",
            })
          }
          className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <option value="">Any</option>
          {provenanceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {active ? (
        <>
          <SaveViewButton collectionLabel={collectionLabel} topic={topic} provenance={provenance} />
          <Button type="button" variant="outline" size="sm" onClick={() => apply({ topic: "", provenance: "" })}>
            Clear filters
          </Button>
        </>
      ) : null}
    </div>
  );
}
