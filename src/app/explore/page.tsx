import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeader } from "@/components/section-header";
import { listTopics } from "@/lib/data";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  const topics = listTopics();

  return (
    <section>
      <SectionHeader
        heading="h1"
        title="Explore"
        description="Topics in the sample set. Open one to see the items connected to it."
      />
      <ul className="flex flex-col gap-2">
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              href={`/explore/${topic.id}`}
              className="block border border-border px-3 py-3 hover:bg-muted"
            >
              <span className="text-sm font-medium">{topic.name}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{topic.signal}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
