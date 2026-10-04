import type { Bookmark, SavedView } from "@/lib/types";

export const BOOKMARKS_KEY = "aicc-bookmarks";
export const FOLLOWED_TOPICS_KEY = "aicc-followed-topics";
export const SAVED_VIEWS_KEY = "aicc-saved-views";

export const BOOKMARKS_EVENT = "aicc-bookmarks";
export const FOLLOWED_TOPICS_EVENT = "aicc-followed-topics";
export const SAVED_VIEWS_EVENT = "aicc-saved-views";

export type LocalWorkspace = {
  bookmarks: Bookmark[];
  followedTopics: string[];
  savedViews: SavedView[];
};

export function readBookmarks(): Bookmark[] {
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Bookmark[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeBookmarks(items: Bookmark[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(BOOKMARKS_EVENT));
}

export function readFollowedTopics(): string[] {
  const raw = localStorage.getItem(FOLLOWED_TOPICS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function writeFollowedTopics(items: string[]) {
  localStorage.setItem(FOLLOWED_TOPICS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(FOLLOWED_TOPICS_EVENT));
}

export function readSavedViews(): SavedView[] {
  const raw = localStorage.getItem(SAVED_VIEWS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedView =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as SavedView).id === "string" &&
        typeof (item as SavedView).label === "string" &&
        typeof (item as SavedView).href === "string",
    );
  } catch {
    return [];
  }
}

export function writeSavedViews(items: SavedView[]) {
  localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(SAVED_VIEWS_EVENT));
}

export function readLocalWorkspace(): LocalWorkspace {
  return {
    bookmarks: readBookmarks(),
    followedTopics: readFollowedTopics(),
    savedViews: readSavedViews(),
  };
}

export function writeLocalWorkspace(workspace: LocalWorkspace) {
  writeBookmarks(workspace.bookmarks);
  writeFollowedTopics(workspace.followedTopics);
  writeSavedViews(workspace.savedViews);
}

export function mergeWorkspaces(local: LocalWorkspace, remote: LocalWorkspace): LocalWorkspace {
  const bookmarkKey = (item: Bookmark) => `${item.kind}:${item.id}`;
  const bookmarkMap = new Map<string, Bookmark>();
  for (const item of [...remote.bookmarks, ...local.bookmarks]) {
    bookmarkMap.set(bookmarkKey(item), item);
  }

  const topics = [...new Set([...remote.followedTopics, ...local.followedTopics])];

  const viewMap = new Map<string, SavedView>();
  for (const view of [...remote.savedViews, ...local.savedViews]) {
    viewMap.set(view.href, view);
  }

  return {
    bookmarks: [...bookmarkMap.values()],
    followedTopics: topics,
    savedViews: [...viewMap.values()],
  };
}
