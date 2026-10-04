"use client";

import { useEffect, useState } from "react";

import { ItemRow } from "@/components/item-row";
import { PersonalizationPanel } from "@/components/personalization-panel";
import { SectionHeader } from "@/components/section-header";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { listEntries } from "@/lib/data";
import type { CatalogEntry } from "@/lib/types";

export function BookmarksView() {
  const { items } = useBookmarks();
  const [entries, setEntries] = useState<CatalogEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    listEntries()
      .then((next) => {
        if (active) setEntries(next);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const saved =
    entries === null
      ? []
      : items.flatMap((item) => {
          const entry = entries.find((candidate) => candidate.kind === item.kind && candidate.id === item.id);
          return entry ? [entry] : [];
        });

  return (
    <section>
      <SectionHeader
        heading="h1"
        title="Bookmarks"
        description="Saved items, followed topics, and saved views. Sign in to sync across devices."
      />
      <PersonalizationPanel />
      <h2 className="mb-3 text-base font-semibold tracking-tight">Saved items</h2>
      {failed ? (
        <p className="text-sm text-muted-foreground">The API could not be reached.</p>
      ) : entries === null ? (
        <p className="text-sm text-muted-foreground">Loading saved items.</p>
      ) : saved.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No saved items yet. Use Save on any sample item.
        </p>
      ) : (
        saved.map((entry) => <ItemRow key={`${entry.kind}:${entry.id}`} entry={entry} />)
      )}
    </section>
  );
}
