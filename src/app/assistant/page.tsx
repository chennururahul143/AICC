import type { Metadata } from "next";

import { AssistantPanel } from "@/components/assistant-panel";

export const metadata: Metadata = { title: "AI Research Assistant" };

export default function AssistantPage() {
  return <AssistantPanel />;
}
