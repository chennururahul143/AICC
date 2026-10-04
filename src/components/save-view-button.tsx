"use client";

import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSavedViews } from "@/hooks/use-saved-views";

export function SaveViewButton({
  collectionLabel,
  topic,
  provenance,
}: {
  collectionLabel: string;
  topic: string;
  provenance: string;
}) {
  const pathname = usePathname();
  const { items, save } = useSavedViews();

  if (!topic && !provenance) return null;

  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (provenance) params.set("provenance", provenance);
  const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
  const exists = items.some((view) => view.href === href);

  const parts = [collectionLabel];
  if (topic) parts.push(`topic ${topic}`);
  if (provenance) parts.push(provenance);
  const label = parts.join(" · ");

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={exists}
      onClick={() => save(label, href)}
    >
      {exists ? "View saved" : "Save view"}
    </Button>
  );
}
