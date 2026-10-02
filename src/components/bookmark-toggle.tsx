"use client";

import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import type { EntityKind } from "@/lib/types";

export function BookmarkToggle({
  kind,
  id,
  title,
}: {
  kind: EntityKind;
  id: string;
  title: string;
}) {
  const { has, toggle } = useBookmarks();
  const saved = has(kind, id);

  return (
    <Button
      type="button"
      variant={saved ? "secondary" : "outline"}
      size="sm"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from bookmarks` : `Save ${title}`}
      onClick={() => toggle(kind, id)}
    >
      <Bookmark className={saved ? "fill-current" : undefined} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
