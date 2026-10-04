"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  BOOKMARKS_EVENT,
  readBookmarks,
  writeBookmarks,
} from "@/lib/local-workspace";
import type { EntityKind } from "@/lib/types";

let cachedRaw: string | null = null;
let cachedItems: ReturnType<typeof readBookmarks> = [];
const serverItems: typeof cachedItems = [];

function readCached(): typeof cachedItems {
  if (typeof window === "undefined") return serverItems;
  const raw = localStorage.getItem("aicc-bookmarks");
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  cachedItems = readBookmarks();
  return cachedItems;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(BOOKMARKS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(BOOKMARKS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useBookmarks() {
  const items = useSyncExternalStore(subscribe, readCached, () => serverItems);

  const has = useCallback(
    (kind: EntityKind, id: string) => items.some((item) => item.kind === kind && item.id === id),
    [items],
  );

  const toggle = useCallback((kind: EntityKind, id: string) => {
    const current = readBookmarks();
    const exists = current.some((item) => item.kind === kind && item.id === id);
    const next = exists
      ? current.filter((item) => item.kind !== kind || item.id !== id)
      : [...current, { kind, id }];
    writeBookmarks(next);
  }, []);

  return { items, has, toggle };
}
