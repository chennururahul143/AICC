"use client";

import { useEffect, useState } from "react";

import { ProvenanceBadge } from "@/components/provenance-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAssistant, listAssistantSamples } from "@/lib/data";
import type { AssistantSample, AssistantSource, Provenance } from "@/lib/types";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  provenance?: Provenance;
  sources?: AssistantSource[];
  insufficient?: boolean;
};

const fallback = {
  text: "The API could not be reached.",
  provenance: "unverified" as const,
  insufficient: true,
  sources: [] as AssistantSource[],
};

export function AssistantPanel() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [samples, setSamples] = useState<AssistantSample[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    listAssistantSamples()
      .then((items) => {
        if (active) setSamples(items);
      })
      .catch(() => {
        if (active) setSamples([]);
      });
    return () => {
      active = false;
    };
  }, []);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    const answer = await askAssistant(trimmed).then(
      (sample) => ({
        text: sample.answer,
        provenance: sample.provenance,
        sources: sample.sources,
        insufficient: sample.insufficient,
      }),
      () => fallback,
    );
    setLoading(false);

    setMessages((current) => [
      ...current,
      { id: `${current.length}-user`, role: "user", text: trimmed },
      {
        id: `${current.length}-assistant`,
        role: "assistant",
        text: answer.text,
        provenance: answer.provenance,
        sources: answer.sources,
        insufficient: answer.insufficient,
      },
    ]);
    setDraft("");
  }

  return (
    <section className="max-w-3xl">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Research assistant
      </p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">AI Research Assistant</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Answers use snippets and summaries stored in the catalog. Suggested questions keep their
        prepared sample replies. Other questions retrieve matching items and cite them. If evidence
        is thin, the reply says so.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {samples.map((sample) => (
          <Button
            key={sample.id}
            type="button"
            variant="outline"
            className="h-auto justify-start px-3 py-2 text-left whitespace-normal"
            onClick={() => ask(sample.question)}
          >
            {sample.question}
          </Button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4" aria-live="polite">
        {messages.map((message) => (
          <article key={message.id} className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground">
              {message.role === "user" ? "You" : "Assistant"}
            </p>
            <p className="mt-1 text-sm leading-6">{message.text}</p>
            {message.role === "assistant" && message.provenance ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ProvenanceBadge provenance={message.provenance} />
                {message.insufficient ? (
                  <span className="text-xs text-muted-foreground">Not enough evidence</span>
                ) : null}
              </div>
            ) : null}
            {message.sources && message.sources.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {message.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} className="underline-offset-4 hover:underline">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <form
        className="mt-6 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
        }}
      >
        <label htmlFor="assistant-question" className="sr-only">
          Ask a question about the catalog
        </label>
        <Input
          id="assistant-question"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about items in the catalog"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Thinking…" : "Ask"}
        </Button>
      </form>
    </section>
  );
}
