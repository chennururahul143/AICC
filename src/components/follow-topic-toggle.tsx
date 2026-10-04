"use client";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFollowedTopics } from "@/hooks/use-followed-topics";

export function FollowTopicToggle({ topicId, topicName }: { topicId: string; topicName: string }) {
  const { isFollowing, toggle } = useFollowedTopics();
  const following = isFollowing(topicId);

  return (
    <Button
      type="button"
      variant={following ? "secondary" : "outline"}
      size="sm"
      className="gap-1.5"
      onClick={() => toggle(topicId)}
    >
      <Star className={`size-3.5 ${following ? "fill-current" : ""}`} />
      {following ? "Following" : "Follow topic"}
      <span className="sr-only">{topicName}</span>
    </Button>
  );
}
