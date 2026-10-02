"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { Bookmark, EntityKind } from "@/lib/types";

const STORAGE_KEY = "aicc-bookmarks";
const CHANGE_EVENT = "aicc-bookmarks";

let cachedRaw: string | null = null;
let cachedItems: Bookmark[] = [];
const serverItems: Bookmark[] = [];

function readBookmarks(): Bookmark[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  if (!raw) {
    cachedItems = [];
    return cachedItems;
  }
  try {
    const parsed = JSON.parse(raw) as Bookmark[];
    cachedItems = Array.isArray(parsed) ? parsed : [];
  } catch {
    cachedItems = [];
  }
  return cachedItems;
}

function writeBookmarks(items: Bookmark[]) {
  const raw = JSON.stringify(items);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedItems = items;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useBookmarks() {
  const items = useSyncExternalStore(subscribe, readBookmarks, () => serverItems);

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
