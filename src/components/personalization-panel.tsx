"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FollowTopicToggle } from "@/components/follow-topic-toggle";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { useFollowedTopics } from "@/hooks/use-followed-topics";
import { useSavedViews } from "@/hooks/use-saved-views";
import { listTopics } from "@/lib/data";
import type { Topic } from "@/lib/types";

export function PersonalizationPanel() {
  const { items: followedIds } = useFollowedTopics();
  const { items: views, remove } = useSavedViews();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    let active = true;
    listTopics()
      .then((items) => {
        if (active) setTopics(items);
      })
      .catch(() => {
        if (active) setTopics([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const followed = followedIds
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is Topic => topic !== undefined);

  return (
    <div className="mb-10 flex flex-col gap-8 border-b border-border pb-10">
      <section>
        <SectionHeader
          title="Followed topics"
          description="Local by default; syncs when you sign in. Overview uses these for your personal briefing."
        />
        {followed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No followed topics yet. Follow topics on{" "}
            <Link href="/explore" className="underline-offset-4 hover:underline">
              Explore
            </Link>
            .
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {followed.map((topic) => (
              <li
                key={topic.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-border px-3 py-2"
              >
                <Link href={`/explore/${topic.id}`} className="text-sm font-medium hover:underline">
                  {topic.name}
                </Link>
                <FollowTopicToggle topicId={topic.id} topicName={topic.name} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <SectionHeader
          title="Saved views"
          description="Filtered collection pages you saved from AI News, Papers, Models, and the other lists."
        />
        {views.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No saved views yet. Set filters on a collection page and choose Save view.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {views.map((view) => (
              <li
                key={view.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-border px-3 py-2"
              >
                <Link href={view.href} className="text-sm hover:underline">
                  {view.label}
                </Link>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(view.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
