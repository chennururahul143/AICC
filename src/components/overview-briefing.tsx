"use client";

import { useEffect, useState } from "react";

import { ProvenanceBadge } from "@/components/provenance-badge";
import { useFollowedTopics } from "@/hooks/use-followed-topics";
import { getPersonalBriefing } from "@/lib/data";
import { formatDate } from "@/lib/format";
import type { Briefing } from "@/lib/types";

export function OverviewBriefing({ defaultBriefing }: { defaultBriefing: Briefing }) {
  const { items: followed } = useFollowedTopics();
  const [personal, setPersonal] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (followed.length === 0) {
      setPersonal(null);
      return;
    }
    let active = true;
    setLoading(true);
    getPersonalBriefing(followed)
      .then((briefing) => {
        if (active) setPersonal(briefing ?? null);
      })
      .catch(() => {
        if (active) setPersonal(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [followed]);

  const briefing = personal ?? defaultBriefing;
  const personalized = personal !== null;

  return (
    <>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {personalized ? "Personal briefing" : "Intelligence briefing"} · {formatDate(briefing.date)}
      </p>
      {personalized ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Built from topics you follow in this browser. Follow more on Explore.
        </p>
      ) : followed.length > 0 && loading ? (
        <p className="mt-2 text-xs text-muted-foreground">Updating your briefing…</p>
      ) : null}
      <div className="mt-3">
        <ProvenanceBadge provenance={briefing.provenance} />
      </div>
      <h1 id="briefing-title" className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight">
        {briefing.headline}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6">{briefing.summary}</p>
      <ol className="mt-5 flex max-w-3xl flex-col gap-3">
        {briefing.points.map((point) => (
          <li key={point.text} className="border-l-2 border-border pl-3">
            <ProvenanceBadge provenance={point.provenance} />
            <p className="mt-1 text-sm leading-6">{point.text}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
