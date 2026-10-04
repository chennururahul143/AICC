"use client";

import { GripVertical } from "lucide-react";
import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";

const COLUMNS = 12;
const MIN_SPAN = 3;
const STACK_WIDTH = 720;
const STORAGE_KEY = "aicc-dashboard-layout";
const CHANGE_EVENT = "aicc-dashboard-layout";

const SECTION_IDS = ["briefing", "developments", "connections", "topics", "sources"] as const;

const DEFAULT_SPANS: Record<string, number> = {
  briefing: 12,
  developments: 7,
  connections: 5,
  topics: 6,
  sources: 6,
};

type Layout = {
  order: string[];
  spans: Record<string, number>;
};

const DEFAULT_LAYOUT: Layout = {
  order: [...SECTION_IDS],
  spans: { ...DEFAULT_SPANS },
};

type Gesture =
  | {
      kind: "resize";
      id: string;
      startX: number;
      colWidth: number;
      start: Record<string, number>;
    }
  | {
      kind: "drag";
      id: string;
      offsetX: number;
      offsetY: number;
      x: number;
      y: number;
    };

let cachedRaw: string | null = null;
let cachedLayout: Layout = DEFAULT_LAYOUT;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sanitize(raw: string): Layout {
  try {
    const parsed = JSON.parse(raw) as { order?: unknown; spans?: unknown };
    const incoming = Array.isArray(parsed.order)
      ? parsed.order.filter((id): id is string => typeof id === "string" && id in DEFAULT_SPANS)
      : [];
    const order = [...incoming];
    for (const id of SECTION_IDS) {
      if (!order.includes(id)) order.push(id);
    }
    const spans: Record<string, number> = {};
    const stored = parsed.spans && typeof parsed.spans === "object" ? (parsed.spans as Record<string, unknown>) : {};
    for (const id of order) {
      const value = stored[id];
      spans[id] =
        typeof value === "number" && value >= MIN_SPAN && value <= COLUMNS
          ? Math.round(value)
          : DEFAULT_SPANS[id];
    }
    return { order, spans };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

function readLayout(): Layout {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_LAYOUT;
  if (raw === cachedRaw) return cachedLayout;
  cachedRaw = raw;
  cachedLayout = sanitize(raw);
  return cachedLayout;
}

function writeLayout(layout: Layout) {
  const raw = JSON.stringify(layout);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedLayout = layout;
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

function groupRows(order: string[], spans: Record<string, number>) {
  const rows: { id: string }[][] = [];
  let row: { id: string }[] = [];
  let used = 0;
  for (const id of order) {
    const span = spans[id] ?? DEFAULT_SPANS[id] ?? 6;
    if (row.length > 0 && used + span > COLUMNS + 0.05) {
      rows.push(row);
      row = [];
      used = 0;
    }
    row.push({ id });
    used += span;
  }
  if (row.length > 0) rows.push(row);
  return rows;
}

function layoutRows(order: string[], spans: Record<string, number>, columns: number) {
  if (columns === 1) return order.map((id) => [{ id, span: 1 }]);
  return groupRows(order, spans).map((row) => {
    const sum = row.reduce((total, item) => total + (spans[item.id] ?? 6), 0);
    const scale = sum > 0 && sum < columns - 0.05 ? columns / sum : 1;
    return row.map((item) => ({ id: item.id, span: (spans[item.id] ?? 6) * scale }));
  });
}

function applyResize(order: string[], start: Record<string, number>, id: string, delta: number) {
  const spans = { ...start };
  const rows = groupRows(order, start);
  const row = rows.find((items) => items.some((item) => item.id === id));
  if (!row) return spans;
  const index = row.findIndex((item) => item.id === id);
  const selfStart = start[id] ?? 6;
  const right = row[index + 1];
  const left = index > 0 ? row[index - 1] : undefined;

  if (right) {
    const pair = selfStart + (start[right.id] ?? 6);
    const maxSelf = pair - MIN_SPAN;
    if (selfStart + delta > maxSelf + 0.4) {
      spans[id] = COLUMNS;
      spans[right.id] = start[right.id] ?? MIN_SPAN;
      return spans;
    }
    const self = clamp(selfStart + delta, MIN_SPAN, maxSelf);
    spans[id] = self;
    spans[right.id] = pair - self;
    return spans;
  }

  if (left && delta < 0) {
    const pair = selfStart + (start[left.id] ?? 6);
    const self = clamp(selfStart + delta, MIN_SPAN, pair - MIN_SPAN);
    spans[id] = self;
    spans[left.id] = pair - self;
    return spans;
  }

  if (delta < -0.35) {
    const following = order[order.indexOf(id) + 1];
    if (!following) {
      spans[id] = clamp(selfStart + delta, MIN_SPAN, COLUMNS);
      return spans;
    }
    const freed = clamp(-delta, MIN_SPAN, selfStart - MIN_SPAN);
    spans[id] = selfStart - freed;
    spans[following] = freed;
    return spans;
  }

  return spans;
}

function commitSpans(order: string[], spans: Record<string, number>) {
  const next: Record<string, number> = {};
  for (const row of groupRows(order, spans)) {
    const parts = row.map((item) => {
      const value = spans[item.id] ?? 6;
      return { id: item.id, base: Math.floor(value), frac: value - Math.floor(value) };
    });
    let remaining = COLUMNS - parts.reduce((sum, part) => sum + part.base, 0);
    const ranked = [...parts].sort((a, b) => b.frac - a.frac || a.id.localeCompare(b.id));
    for (const part of ranked) {
      if (remaining <= 0) break;
      part.base += 1;
      remaining -= 1;
    }
    for (const part of parts) next[part.id] = clamp(part.base, MIN_SPAN, COLUMNS);
    if (row.length === 1) next[row[0].id] = COLUMNS;
  }
  for (const id of order) {
    if (next[id] == null) next[id] = clamp(Math.round(spans[id] ?? 6), MIN_SPAN, COLUMNS);
  }
  return next;
}

function sameOrder(left: string[], right: string[]) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

export function DashboardLayout({
  items,
}: {
  items: { id: string; title: string; children: React.ReactNode }[];
}) {
  const stored = useSyncExternalStore(subscribe, readLayout, () => DEFAULT_LAYOUT);
  const storedRef = useRef(stored);
  storedRef.current = stored;
  const [live, setLive] = useState<Record<string, number> | null>(null);
  const [wide, setWide] = useState(true);
  const [drag, setDrag] = useState<Extract<Gesture, { kind: "drag" }> | null>(null);
  const [resizing, setResizing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef(new Map<string, HTMLDivElement>());
  const bodyRefs = useRef(new Map<string, HTMLDivElement>());
  const gesture = useRef<Gesture | null>(null);
  const liveRef = useRef<Record<string, number> | null>(null);
  const previousRects = useRef(new Map<string, DOMRect>());
  const flip = useRef(false);
  const byId = new Map(items.map((item) => [item.id, item]));
  const order = stored.order.filter((id) => byId.has(id));
  const spans = live ?? stored.spans;
  const rows = layoutRows(order, spans, wide ? COLUMNS : 1);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new ResizeObserver(([entry]) => {
      setWide(entry.contentRect.width >= STACK_WIDTH);
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (flip.current) {
      flip.current = false;
      for (const [id, element] of bodyRefs.current) {
        if (id === gesture.current?.id && gesture.current.kind === "drag") continue;
        const previous = previousRects.current.get(id);
        if (!previous) continue;
        element.getAnimations().forEach((animation) => animation.cancel());
        const next = element.getBoundingClientRect();
        const dx = previous.left - next.left;
        const dy = previous.top - next.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
        element.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
          { duration: 200, easing: "ease-out" },
        );
      }
    }

    const active = gesture.current;
    if (!active || active.kind !== "drag") return;
    const element = bodyRefs.current.get(active.id);
    if (!element) return;
    element.getAnimations().forEach((animation) => animation.cancel());
    element.style.transition = "none";
    element.style.transform = "none";
    const rect = element.getBoundingClientRect();
    const dx = active.x - active.offsetX - rect.left;
    const dy = active.y - active.offsetY - rect.top;
    element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  });

  function captureRects() {
    const rects = new Map<string, DOMRect>();
    for (const [id, element] of bodyRefs.current) rects.set(id, element.getBoundingClientRect());
    previousRects.current = rects;
  }

  function save(next: Layout) {
    captureRects();
    flip.current = true;
    writeLayout(next);
  }

  function dropIndex(activeId: string, point: { x: number; y: number }, currentOrder: string[]) {
    const others = currentOrder.filter((id) => id !== activeId);
    let index = others.length;
    for (let position = 0; position < others.length; position += 1) {
      const element = cellRefs.current.get(others[position]);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      const sameBand = point.y >= rect.top && point.y <= rect.bottom;
      if (sameBand && point.x < rect.left + rect.width / 2) {
        index = position;
        break;
      }
      if (!sameBand && point.y < rect.top + rect.height / 2) {
        index = position;
        break;
      }
    }
    return [...others.slice(0, index), activeId, ...others.slice(index)];
  }

  function move(id: string, direction: -1 | 1) {
    const index = order.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= order.length) return;
    const next = [...order];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    save({ order: next, spans: stored.spans });
  }

  function trackPointer(onMove: (event: PointerEvent) => void, onEnd: () => void) {
    const previousSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    const move = (event: PointerEvent) => onMove(event);
    const end = () => {
      document.body.style.userSelect = previousSelect;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      onEnd();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  function onGripDown(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (event.button !== 0) return;
    const body = bodyRefs.current.get(id);
    if (!body) return;
    event.preventDefault();
    const rect = body.getBoundingClientRect();
    const next: Gesture = {
      kind: "drag",
      id,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      x: event.clientX,
      y: event.clientY,
    };
    gesture.current = next;
    setDrag(next);
    trackPointer(
      (pointer) => {
        const active = gesture.current;
        if (!active || active.kind !== "drag") return;
        const nextGesture = { ...active, x: pointer.clientX, y: pointer.clientY };
        gesture.current = nextGesture;
        setDrag(nextGesture);
        const current = storedRef.current;
        const nextOrder = dropIndex(active.id, { x: pointer.clientX, y: pointer.clientY }, current.order);
        if (!sameOrder(nextOrder, current.order)) save({ order: nextOrder, spans: current.spans });
      },
      () => {
        const active = gesture.current;
        if (!active || active.kind !== "drag") return;
        const element = bodyRefs.current.get(active.id);
        if (element) element.style.transform = "";
        gesture.current = null;
        setDrag(null);
      },
    );
  }

  function onResizeDown(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (!wide || event.button !== 0) return;
    const grid = gridRef.current;
    if (!grid) return;
    event.preventDefault();
    event.stopPropagation();
    const current = storedRef.current;
    const displayed = Object.fromEntries(
      layoutRows(current.order, liveRef.current ?? current.spans, COLUMNS)
        .flat()
        .map((item) => [item.id, item.span]),
    );
    const next: Gesture = {
      kind: "resize",
      id,
      startX: event.clientX,
      colWidth: grid.getBoundingClientRect().width / COLUMNS,
      start: displayed,
    };
    gesture.current = next;
    liveRef.current = displayed;
    setResizing(true);
    trackPointer(
      (pointer) => {
        const active = gesture.current;
        if (!active || active.kind !== "resize") return;
        const delta = (pointer.clientX - active.startX) / active.colWidth;
        const resized = applyResize(storedRef.current.order, active.start, active.id, delta);
        liveRef.current = resized;
        setLive(resized);
      },
      () => {
        const active = gesture.current;
        if (!active || active.kind !== "resize") return;
        const nextSpans = commitSpans(storedRef.current.order, liveRef.current ?? active.start);
        gesture.current = null;
        liveRef.current = null;
        setLive(null);
        setResizing(false);
        save({ order: storedRef.current.order, spans: nextSpans });
      },
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Drag a section to move it. Drag its edge to resize.
        </p>
        <button
          type="button"
          className="shrink-0 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => save(DEFAULT_LAYOUT)}
        >
          Reset layout
        </button>
      </div>
      <div ref={gridRef} className="flex flex-col gap-10">
        {rows.map((row) => (
          <div key={row.map((item) => item.id).join(":")} className="flex items-stretch gap-6">
            {row.map((item) => {
              const section = byId.get(item.id);
              if (!section) return null;
              const dragging = drag?.id === item.id;
              return (
                <div
                  key={item.id}
                  ref={(node) => {
                    if (node) cellRefs.current.set(item.id, node);
                    else cellRefs.current.delete(item.id);
                  }}
                  className="@container relative min-w-0"
                  style={{
                    flexGrow: item.span,
                    flexShrink: 1,
                    flexBasis: 0,
                    transition: resizing || dragging ? "none" : "flex-grow 200ms ease-out",
                  }}
                >
                  {dragging ? (
                    <div className="pointer-events-none absolute inset-0 rounded-md border border-dashed border-border" />
                  ) : null}
                  <div
                    ref={(node) => {
                      if (node) bodyRefs.current.set(item.id, node);
                      else bodyRefs.current.delete(item.id);
                    }}
                    className={
                      dragging
                        ? "relative z-20 bg-background shadow-sm"
                        : "relative h-full"
                    }
                  >
                    <button
                      type="button"
                      aria-label={`Move ${section.title}`}
                      className="absolute top-0 left-0 z-10 inline-flex size-7 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                      onPointerDown={(event) => onGripDown(event, item.id)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                          event.preventDefault();
                          move(item.id, -1);
                        }
                        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                          event.preventDefault();
                          move(item.id, 1);
                        }
                      }}
                    >
                      <GripVertical className="size-4" />
                    </button>
                    {wide ? (
                      <button
                        type="button"
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize ${section.title}`}
                        aria-valuemin={MIN_SPAN}
                        aria-valuemax={COLUMNS}
                        aria-valuenow={Math.round(item.span)}
                        className="absolute top-0 -right-3 z-10 h-full w-3 cursor-col-resize touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:inset-y-2 after:left-1/2 after:w-px after:bg-border hover:after:w-0.5 hover:after:bg-foreground"
                        onPointerDown={(event) => onResizeDown(event, item.id)}
                      />
                    ) : null}
                    <div className="pl-7">{section.children}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
