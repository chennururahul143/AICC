import type {
  AssistantAnswer,
  AssistantSample,
  Briefing,
  CatalogEntry,
  ConnectionGroup,
  Development,
  EntityKind,
  EntityRef,
  SearchSuggestion,
  Topic,
} from "@/lib/types";
import { hrefFor } from "@/lib/href";

export function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001";
}

async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, { cache: "no-store", signal });
  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

async function apiGetOptional<T>(path: string): Promise<T | undefined> {
  const response = await fetch(`${apiBase()}${path}`, { cache: "no-store" });
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function getBriefing(): Promise<Briefing> {
  return apiGet("/api/v1/briefing");
}

export function getPersonalBriefing(topicIds: string[]): Promise<Briefing | undefined> {
  if (topicIds.length === 0) return Promise.resolve(undefined);
  const params = new URLSearchParams({ topics: topicIds.join(",") });
  return apiGetOptional(`/api/v1/briefing/personal?${params}`);
}

export function listDevelopments(): Promise<Development[]> {
  return apiGet("/api/v1/developments");
}

export function listConnections(): Promise<ConnectionGroup[]> {
  return apiGet("/api/v1/connections");
}

export function listTopics(): Promise<Topic[]> {
  return apiGet("/api/v1/topics");
}

export function getTopic(id: string): Promise<Topic | undefined> {
  return apiGetOptional(`/api/v1/topics/${encodeURIComponent(id)}`);
}

export function listEntries(kind?: EntityKind): Promise<CatalogEntry[]> {
  const params = new URLSearchParams();
  if (kind) params.set("kind", kind);
  const query = params.toString();
  return apiGet(`/api/v1/entries${query ? `?${query}` : ""}`);
}

export function getEntry(kind: EntityKind, id: string): Promise<CatalogEntry | undefined> {
  return apiGetOptional(`/api/v1/entries/${kind}/${encodeURIComponent(id)}`);
}

export function listByTopic(topicId: string): Promise<CatalogEntry[] | undefined> {
  return apiGetOptional(`/api/v1/topics/${encodeURIComponent(topicId)}/entries`);
}

export function searchEntries(query: string): Promise<CatalogEntry[]> {
  const params = new URLSearchParams({ q: query });
  return apiGet(`/api/v1/search?${params}`);
}

export function searchSuggestions(query: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
  const params = new URLSearchParams({ q: query });
  return apiGet(`/api/v1/suggestions?${params}`, signal);
}

export function listAssistantSamples(): Promise<AssistantSample[]> {
  return apiGet("/api/v1/assistant/samples");
}

export function askAssistant(question: string): Promise<AssistantAnswer> {
  const params = new URLSearchParams({ question });
  return apiGet(`/api/v1/assistant/answer?${params}`);
}

export async function resolveRef(ref: EntityRef): Promise<{ title: string; href: string } | null> {
  if (ref.kind === "topic") {
    const topic = await getTopic(ref.id);
    if (!topic) return null;
    return { title: topic.name, href: hrefFor("topic", topic.id) };
  }
  const entry = await getEntry(ref.kind, ref.id);
  if (!entry) return null;
  return { title: entry.title, href: hrefFor(entry.kind, entry.id) };
}
