import type { EntityKind } from "@/lib/types";

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
