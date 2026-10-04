import type { Metadata } from "next";
import { ExploreTopicRow } from "@/components/explore-topic-row";
import { SectionHeader } from "@/components/section-header";
import { listByTopic, listTopics } from "@/lib/data";

export const metadata: Metadata = { title: "Explore" };

export default async function ExplorePage() {
  const topics = await listTopics();
  const groups = await Promise.all(
    topics.map(async (topic) => {
      const items = (await listByTopic(topic.id)) ?? [];
      return {
        topic,
        sample: items.filter((item) => item.origin !== "collected").length,
        collected: items.filter((item) => item.origin === "collected").length,
      };
    }),
  );

  return (
    <section>
      <SectionHeader
        heading="h1"
        title="Explore"
        description="Topics in the catalog. Follow topics for a personal briefing on Overview. Collected items use AI interpretation."
      />
      <ul className="flex flex-col gap-2">
        {groups.map(({ topic, sample, collected }) => (
          <ExploreTopicRow
            key={topic.id}
            topicId={topic.id}
            name={topic.name}
            signal={topic.signal}
            sample={sample}
            collected={collected}
          />
        ))}
      </ul>
    </section>
  );
}
