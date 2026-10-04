"use client";

import Link from "next/link";

import { FollowTopicToggle } from "@/components/follow-topic-toggle";

export function ExploreTopicRow({
  topicId,
  name,
  signal,
  sample,
  collected,
}: {
  topicId: string;
  name: string;
  signal: string;
  sample: number;
  collected: number;
}) {
  return (
    <li className="flex items-stretch gap-2 border border-border">
      <Link href={`/explore/${topicId}`} className="min-w-0 flex-1 px-3 py-3 hover:bg-muted">
        <span className="text-sm font-medium">{name}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{signal}</span>
        <span className="mt-2 block text-xs text-muted-foreground">
          {sample} sample · {collected} collected
        </span>
      </Link>
      <div className="flex shrink-0 items-center pr-2">
        <FollowTopicToggle topicId={topicId} topicName={name} />
      </div>
    </li>
  );
}
