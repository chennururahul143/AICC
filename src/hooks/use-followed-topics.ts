"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  FOLLOWED_TOPICS_EVENT,
  readFollowedTopics,
  writeFollowedTopics,
} from "@/lib/local-workspace";

let cachedRaw: string | null = null;
let cachedItems: ReturnType<typeof readFollowedTopics> = [];
const serverItems: typeof cachedItems = [];

function readCached(): typeof cachedItems {
  if (typeof window === "undefined") return serverItems;
  const raw = localStorage.getItem("aicc-followed-topics");
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  cachedItems = readFollowedTopics();
  return cachedItems;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(FOLLOWED_TOPICS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(FOLLOWED_TOPICS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useFollowedTopics() {
  const items = useSyncExternalStore(subscribe, readCached, () => serverItems);

  const isFollowing = useCallback((topicId: string) => items.includes(topicId), [items]);

  const toggle = useCallback((topicId: string) => {
    const current = readFollowedTopics();
    const next = current.includes(topicId)
      ? current.filter((id) => id !== topicId)
      : [...current, topicId];
    writeFollowedTopics(next);
  }, []);

  return { items, isFollowing, toggle };
}
