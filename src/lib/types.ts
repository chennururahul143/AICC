export type Provenance = "source" | "interpretation" | "unverified";

export type EntityKind =
  | "article"
  | "paper"
  | "model"
  | "repository"
  | "benchmark"
  | "company"
  | "topic";

export type EntityRef = {
  kind: EntityKind;
  id: string;
};

export type DetailFact = {
  label: string;
  value: string;
};

export type CatalogLink = {
  kind: EntityKind;
  id: string;
  reason: string;
  provenance: Provenance;
};

export type CatalogEntry = {
  kind: EntityKind;
  id: string;
  title: string;
  excerpt: string;
  publishedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
  provenance: Provenance;
  origin?: "sample" | "collected";
  topicIds: string[];
  related: EntityRef[];
  links?: CatalogLink[];
  facts: DetailFact[];
  interpretation?: Interpretation | null;
};

export type Interpretation = {
  summary: string;
  provenance: Provenance;
  claims: InterpretationClaim[];
  entities: InterpretationEntity[];
  topicIds: string[];
};

export type InterpretationClaim = {
  text: string;
  provenance: Provenance;
};

export type InterpretationEntity = {
  name: string;
  kind: string;
  provenance: Provenance;
};

export type Topic = {
  id: string;
  name: string;
  signal: string;
};

export type Development = {
  id: string;
  title: string;
  whyItMatters: string;
  date: string;
  provenance: Provenance;
  related: EntityRef[];
};

export type BriefingPoint = {
  text: string;
  provenance: Provenance;
};

export type Briefing = {
  date: string;
  headline: string;
  summary: string;
  points: BriefingPoint[];
  provenance: Provenance;
};

export type ConnectionGroup = {
  id: string;
  title: string;
  note: string;
  provenance: Provenance;
  related: EntityRef[];
};

export type AssistantSource = {
  label: string;
  href: string;
};

export type AssistantSample = {
  id: string;
  question: string;
  answer: string;
  provenance: Provenance;
  insufficient: boolean;
  sources: AssistantSource[];
};

export type Bookmark = {
  kind: EntityKind;
  id: string;
};

export type SavedView = {
  id: string;
  label: string;
  href: string;
};

export type AuthSession = {
  token: string;
  email: string;
  userId: string;
};

export type WorkspaceState = {
  bookmarks: Bookmark[];
  followedTopics: string[];
  savedViews: SavedView[];
};

export type SearchSuggestion = {
  kind: EntityKind;
  id: string;
  title: string;
  href: string;
  meta: string;
};

export type AssistantAnswer = {
  answer: string;
  provenance: Provenance;
  insufficient: boolean;
  sources: AssistantSource[];
};
