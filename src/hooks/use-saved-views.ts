"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  readSavedViews,
  SAVED_VIEWS_EVENT,
  writeSavedViews,
} from "@/lib/local-workspace";
import type { SavedView } from "@/lib/types";

export type { SavedView };

let cachedRaw: string | null = null;
let cachedItems: ReturnType<typeof readSavedViews> = [];
const serverItems: typeof cachedItems = [];

function readCached(): typeof cachedItems {
  if (typeof window === "undefined") return serverItems;
  const raw = localStorage.getItem("aicc-saved-views");
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  cachedItems = readSavedViews();
  return cachedItems;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(SAVED_VIEWS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(SAVED_VIEWS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useSavedViews() {
  const items = useSyncExternalStore(subscribe, readCached, () => serverItems);

  const save = useCallback((label: string, href: string) => {
    const current = readSavedViews();
    if (current.some((view) => view.href === href)) return;
    writeSavedViews([...current, { id: crypto.randomUUID(), label, href }]);
  }, []);

  const remove = useCallback((id: string) => {
    writeSavedViews(readSavedViews().filter((view) => view.id !== id));
  }, []);

  return { items, save, remove };
}
