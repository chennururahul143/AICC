import {
  assistantSamples,
  briefing,
  connections,
  developments,
  entries,
  topics,
} from "@/lib/mock/catalog";
import type {
  AssistantSample,
  CatalogEntry,
  EntityKind,
  EntityRef,
  Topic,
} from "@/lib/types";

const byKey = new Map(entries.map((entry) => [`${entry.kind}:${entry.id}`, entry]));

export function hrefFor(kind: EntityKind, id: string): string {
  switch (kind) {
    case "article":
      return `/news/${id}`;
    case "paper":
      return `/papers/${id}`;
    case "model":
      return `/models/${id}`;
    case "repository":
      return `/github/${id}`;
    case "benchmark":
      return `/benchmarks/${id}`;
    case "company":
      return `/companies/${id}`;
    case "topic":
      return `/explore/${id}`;
  }
}

export function getBriefing() {
  return briefing;
}

export function listDevelopments() {
  return developments;
}

export function listConnections() {
  return connections;
}

export function listTopics(): Topic[] {
  return topics;
}

export function getTopic(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}

export function listEntries(kind?: EntityKind): CatalogEntry[] {
  const items = kind ? entries.filter((entry) => entry.kind === kind) : entries;
  return [...items].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export function getEntry(kind: EntityKind, id: string): CatalogEntry | undefined {
  return byKey.get(`${kind}:${id}`);
}

export function listByTopic(topicId: string): CatalogEntry[] {
  return listEntries().filter((entry) => entry.topicIds.includes(topicId));
}

export function resolveRef(ref: EntityRef): { title: string; href: string } | null {
  if (ref.kind === "topic") {
    const topic = getTopic(ref.id);
    if (!topic) return null;
    return { title: topic.name, href: hrefFor("topic", topic.id) };
  }
  const entry = getEntry(ref.kind, ref.id);
  if (!entry) return null;
  return { title: entry.title, href: hrefFor(entry.kind, entry.id) };
}

export function searchEntries(query: string): CatalogEntry[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return entries.filter((entry) => {
    const topicNames = entry.topicIds
      .map((id) => getTopic(id)?.name ?? "")
      .join(" ");
    const haystack = [entry.title, entry.excerpt, entry.sourceName ?? "", topicNames]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function listAssistantSamples(): AssistantSample[] {
  return assistantSamples;
}

export function findAssistantSample(question: string): AssistantSample | undefined {
  const normalized = question.trim().toLowerCase().replace(/\?+$/, "");
  return assistantSamples.find(
    (sample) => sample.question.trim().toLowerCase().replace(/\?+$/, "") === normalized,
  );
}

function assertCatalog() {
  const check = (label: string, refs: { kind: EntityKind; id: string }[]) => {
    for (const ref of refs) {
      if (!resolveRef(ref)) {
        throw new Error(`Missing sample link from ${label} to ${ref.kind}:${ref.id}`);
      }
    }
  };

  for (const entry of entries) {
    check(`${entry.kind}:${entry.id}`, entry.related);
    for (const topicId of entry.topicIds) {
      if (!getTopic(topicId)) {
        throw new Error(`Missing topic ${topicId} on ${entry.kind}:${entry.id}`);
      }
    }
  }
  for (const item of developments) check(item.id, item.related);
  for (const group of connections) check(group.id, group.related);
}

assertCatalog();

export const sourceSections: { kind: EntityKind; href: string; label: string }[] = [
  { kind: "article", href: "/news", label: "News" },
  { kind: "paper", href: "/papers", label: "Papers" },
  { kind: "model", href: "/models", label: "Models" },
  { kind: "repository", href: "/github", label: "GitHub" },
  { kind: "benchmark", href: "/benchmarks", label: "Benchmarks" },
];
