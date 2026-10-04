import type { CatalogEntry, EntityKind, Provenance } from "@/lib/types";

export { hrefFor } from "@/lib/href";

export {
  askAssistant,
  getBriefing,
  getPersonalBriefing,
  getEntry,
  getTopic,
  listAssistantSamples,
  listByTopic,
  listConnections,
  listDevelopments,
  listEntries,
  listTopics,
  resolveRef,
  searchEntries,
  searchSuggestions,
} from "@/lib/api";

export type { SearchSuggestion } from "@/lib/types";

export function readListFilters(params: {
  topic?: string | string[];
  provenance?: string | string[];
}): { topic: string; provenance: Provenance | "" } {
  const topic = typeof params.topic === "string" ? params.topic : "";
  const provenance = typeof params.provenance === "string" ? params.provenance : "";
  const provenances: Provenance[] = ["source", "interpretation", "unverified"];
  return {
    topic,
    provenance: provenances.find((item) => item === provenance) ?? "",
  };
}

export function filterEntries(
  items: CatalogEntry[],
  filters: { topic?: string; provenance?: string },
): CatalogEntry[] {
  return items.filter((item) => {
    if (filters.topic && !item.topicIds.includes(filters.topic)) return false;
    if (filters.provenance && item.provenance !== filters.provenance) return false;
    return true;
  });
}

export function collectionFor(kind: EntityKind): { href: string; label: string } {
  switch (kind) {
    case "article":
      return { href: "/news", label: "AI News" };
    case "paper":
      return { href: "/papers", label: "Research Papers" };
    case "model":
      return { href: "/models", label: "Models" };
    case "repository":
      return { href: "/github", label: "GitHub Projects" };
    case "benchmark":
      return { href: "/benchmarks", label: "Benchmarks" };
    case "company":
      return { href: "/companies", label: "AI Companies" };
    case "topic":
      return { href: "/explore", label: "Explore" };
  }
}

export const sourceSections: { kind: EntityKind; href: string; label: string }[] = [
  { kind: "article", href: "/news", label: "News" },
  { kind: "paper", href: "/papers", label: "Papers" },
  { kind: "model", href: "/models", label: "Models" },
  { kind: "repository", href: "/github", label: "GitHub" },
  { kind: "benchmark", href: "/benchmarks", label: "Benchmarks" },
];
