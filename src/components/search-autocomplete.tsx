"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { searchSuggestions } from "@/lib/data";
import type { EntityKind, SearchSuggestion } from "@/lib/types";
import { cn } from "@/lib/utils";

const kindLabel: Record<EntityKind, string> = {
  article: "News",
  paper: "Paper",
  model: "Model",
  repository: "Repository",
  benchmark: "Benchmark",
  company: "Company",
  topic: "Topic",
};

export function SearchAutocomplete() {
  const pathname = usePathname();
  const router = useRouter();
  const listId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [settledQuery, setSettledQuery] = useState("");

  const open = query.trim().length > 0 && openPath === pathname;
  const boundedIndex =
    activeIndex >= 0 && activeIndex < suggestions.length ? activeIndex : -1;
  const showEmpty = open && settledQuery === query.trim() && suggestions.length === 0;

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setSuggestions([]);
      setSettledQuery("");
      return;
    }
    const controller = new AbortController();
    searchSuggestions(term, controller.signal)
      .then((items) => {
        setSuggestions(items);
        setSettledQuery(term);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setSuggestions([]);
        setSettledQuery(term);
      });
    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenPath(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function close() {
    setOpenPath(null);
    setActiveIndex(-1);
  }

  return (
    <div className="min-w-0 flex-1">
      <div ref={containerRef} className="relative max-w-md">
      <form action="/search" role="search">
        <label htmlFor="q" className="sr-only">
          Search sample intelligence
        </label>
        <Input
          id="q"
          name="q"
          type="search"
          value={query}
          placeholder="Search sample data"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={boundedIndex >= 0 ? `${listId}-option-${boundedIndex}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpenPath(pathname);
            setActiveIndex(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              close();
              return;
            }
            if (event.key === "Enter" && query.trim()) {
              event.preventDefault();
              if (open && boundedIndex >= 0) {
                const selected = suggestions[boundedIndex];
                close();
                router.push(selected.href);
                return;
              }
              const term = query.trim();
              close();
              router.push(`/search?q=${encodeURIComponent(term)}`);
              return;
            }
            if (!open) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (suggestions.length === 0) return;
              setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, -1));
            }
          }}
        />
      </form>
      {open ? (
        <div className="absolute top-full z-40 mt-1 w-full max-w-md border border-border bg-popover text-popover-foreground shadow-md">
          {showEmpty ? (
            <p className="px-3 py-2 text-sm text-muted-foreground" role="status">
              No matching results
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search suggestions" className="max-h-80 overflow-auto py-1">
              {suggestions.map((suggestion, index) => {
                const selected = index === boundedIndex;
                return (
                  <li key={`${suggestion.kind}:${suggestion.id}`}>
                    <Link
                      id={`${listId}-option-${index}`}
                      role="option"
                      aria-selected={selected}
                      href={suggestion.href}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={close}
                      className={cn(
                        "grid grid-cols-[5.25rem_minmax(0,1fr)] items-start gap-2 px-2 py-1.5",
                        selected ? "bg-muted" : "hover:bg-muted",
                      )}
                    >
                      <span className="pt-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                        {kindLabel[suggestion.kind]}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{suggestion.title}</span>
                        {suggestion.meta ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {suggestion.meta}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
      </div>
    </div>
  );
}
