import type {
  AssistantSample,
  Briefing,
  CatalogEntry,
  ConnectionGroup,
  Development,
  Topic,
} from "@/lib/types";

const sampleUrl = (kind: string, id: string) =>
  `https://example.com/sample/${kind}/${id}`;

export const topics: Topic[] = [
  {
    id: "llms",
    name: "LLMs",
    signal:
      "Sample signal: releases in this set are tied to cost, context, and tool use rather than size alone.",
  },
  {
    id: "agents",
    name: "AI agents",
    signal:
      "Sample signal: tool-use reliability is the comparison point across the linked model, paper, and repo.",
  },
  {
    id: "open-source",
    name: "Open-source AI",
    signal:
      "Sample signal: one lab in this set posted weights and a reproduction repo together.",
  },
  {
    id: "benchmarks",
    name: "Benchmarks",
    signal:
      "Sample signal: an agent suite and a chat board rank different systems first.",
  },
  {
    id: "vision",
    name: "Computer vision",
    signal:
      "Sample signal: screen and document tasks show up inside a general model note.",
  },
  {
    id: "inference",
    name: "Inference",
    signal:
      "Sample signal: a smaller model is linked to serving notes and a latency board.",
  },
  {
    id: "evaluation",
    name: "Evaluation",
    signal:
      "Sample signal: the set has no shared protocol behind the reported comparisons.",
  },
  {
    id: "research",
    name: "AI research",
    signal:
      "Sample signal: a few papers are linked from model notes, repos, and articles at once.",
  },
];

export const entries: CatalogEntry[] = [
  {
    kind: "company",
    id: "northwind",
    title: "Northwind AI",
    excerpt:
      "Sample organization focused on tool-using language models and the eval harness shipped with them.",
    provenance: "source",
    topicIds: ["llms", "agents"],
    related: [
      { kind: "model", id: "northstar-2" },
      { kind: "paper", id: "tool-routing" },
      { kind: "repository", id: "northstar-eval" },
    ],
    facts: [{ label: "Focus", value: "Tool-using language models" }],
    sourceName: "Sample organization note",
    sourceUrl: sampleUrl("company", "northwind"),
  },
  {
    kind: "company",
    id: "harbor",
    title: "Harbor Research",
    excerpt:
      "Sample lab that publishes an agent model and a small kit for comparing agent scores.",
    provenance: "source",
    topicIds: ["agents"],
    related: [
      { kind: "model", id: "harbor-agent-1" },
      { kind: "repository", id: "agent-score-kit" },
      { kind: "benchmark", id: "agent-suite" },
    ],
    facts: [{ label: "Focus", value: "Agent evaluation" }],
    sourceName: "Sample organization note",
    sourceUrl: sampleUrl("company", "harbor"),
  },
  {
    kind: "company",
    id: "lumen",
    title: "Lumen Systems",
    excerpt:
      "Sample company connecting a vision-capable model to screen and document tasks.",
    provenance: "source",
    topicIds: ["vision"],
    related: [
      { kind: "model", id: "lumen-vision-s" },
      { kind: "paper", id: "screen-reading" },
      { kind: "repository", id: "lumen-screens" },
    ],
    facts: [{ label: "Focus", value: "Document and screen understanding" }],
    sourceName: "Sample organization note",
    sourceUrl: sampleUrl("company", "lumen"),
  },
  {
    kind: "company",
    id: "fieldnote",
    title: "Fieldnote Labs",
    excerpt:
      "Sample lab that posted open weights together with a short report and a reproduction repo.",
    provenance: "source",
    topicIds: ["open-source", "llms"],
    related: [
      { kind: "model", id: "fieldnote-70b" },
      { kind: "paper", id: "fieldnote-report" },
      { kind: "repository", id: "fieldnote-weights" },
    ],
    facts: [{ label: "Focus", value: "Open-weight language models" }],
    sourceName: "Sample organization note",
    sourceUrl: sampleUrl("company", "fieldnote"),
  },
  {
    kind: "company",
    id: "copperline",
    title: "Copperline",
    excerpt:
      "Sample company shipping a small model with serving notes and a latency check.",
    provenance: "source",
    topicIds: ["inference"],
    related: [
      { kind: "model", id: "copperline-mini" },
      { kind: "paper", id: "serving-notes" },
      { kind: "repository", id: "copperline-serve" },
    ],
    facts: [{ label: "Focus", value: "Small models and serving" }],
    sourceName: "Sample organization note",
    sourceUrl: sampleUrl("company", "copperline"),
  },
  {
    kind: "model",
    id: "northstar-2",
    title: "Northstar 2",
    excerpt:
      "Sample model note: Northwind describes Northstar 2 as a tool-routing model and points at a paper and an eval repo.",
    publishedAt: "2026-10-01",
    sourceName: "Sample model note",
    sourceUrl: sampleUrl("model", "northstar-2"),
    provenance: "source",
    topicIds: ["llms", "agents"],
    related: [
      { kind: "company", id: "northwind" },
      { kind: "paper", id: "tool-routing" },
      { kind: "repository", id: "northstar-eval" },
      { kind: "benchmark", id: "agent-suite" },
      { kind: "article", id: "northstar-ships" },
    ],
    facts: [
      { label: "Developer", value: "Northwind AI" },
      { label: "Note", value: "Linked to tool routing, not a general chat claim" },
    ],
  },
  {
    kind: "model",
    id: "harbor-agent-1",
    title: "Harbor Agent 1",
    excerpt:
      "Sample model note: Harbor Research positions this release around tool use and links it to an agent suite.",
    publishedAt: "2026-09-27",
    sourceName: "Sample model note",
    sourceUrl: sampleUrl("model", "harbor-agent-1"),
    provenance: "source",
    topicIds: ["agents"],
    related: [
      { kind: "company", id: "harbor" },
      { kind: "benchmark", id: "agent-suite" },
      { kind: "repository", id: "agent-score-kit" },
      { kind: "article", id: "scores-diverge" },
    ],
    facts: [
      { label: "Developer", value: "Harbor Research" },
      { label: "Note", value: "Compared on the sample agent suite" },
    ],
  },
  {
    kind: "model",
    id: "lumen-vision-s",
    title: "Lumen Vision S",
    excerpt:
      "Sample model note: Lumen says this model handles screen and document tasks and links a short paper.",
    publishedAt: "2026-09-24",
    sourceName: "Sample model note",
    sourceUrl: sampleUrl("model", "lumen-vision-s"),
    provenance: "source",
    topicIds: ["vision", "llms"],
    related: [
      { kind: "company", id: "lumen" },
      { kind: "paper", id: "screen-reading" },
      { kind: "repository", id: "lumen-screens" },
      { kind: "benchmark", id: "doc-vision" },
      { kind: "article", id: "lumen-demo" },
    ],
    facts: [
      { label: "Developer", value: "Lumen Systems" },
      { label: "Note", value: "Document and screen tasks" },
    ],
  },
  {
    kind: "model",
    id: "fieldnote-70b",
    title: "Fieldnote 70B",
    excerpt:
      "Sample model note: Fieldnote Labs posted weights, a short report, and a repo that tries to reproduce the setup.",
    publishedAt: "2026-09-26",
    sourceName: "Sample model note",
    sourceUrl: sampleUrl("model", "fieldnote-70b"),
    provenance: "source",
    topicIds: ["open-source", "llms"],
    related: [
      { kind: "company", id: "fieldnote" },
      { kind: "paper", id: "fieldnote-report" },
      { kind: "repository", id: "fieldnote-weights" },
      { kind: "article", id: "fieldnote-posted" },
    ],
    facts: [
      { label: "Developer", value: "Fieldnote Labs" },
      { label: "Note", value: "Open weights with a reproduction repo" },
    ],
  },
  {
    kind: "model",
    id: "copperline-mini",
    title: "Copperline Mini",
    excerpt:
      "Sample model note: Copperline describes a small model and points at serving notes plus a latency check.",
    publishedAt: "2026-09-22",
    sourceName: "Sample model note",
    sourceUrl: sampleUrl("model", "copperline-mini"),
    provenance: "source",
    topicIds: ["inference", "llms"],
    related: [
      { kind: "company", id: "copperline" },
      { kind: "paper", id: "serving-notes" },
      { kind: "repository", id: "copperline-serve" },
      { kind: "benchmark", id: "serve-latency" },
      { kind: "article", id: "copperline-note" },
    ],
    facts: [
      { label: "Developer", value: "Copperline" },
      { label: "Note", value: "Sized for serving, not a leaderboard claim" },
    ],
  },
  {
    kind: "paper",
    id: "tool-routing",
    title: "Routing work across tool calls",
    excerpt:
      "Sample paper: a short note on choosing the next tool call, cited from the Northstar 2 model card and eval repo.",
    publishedAt: "2026-09-20",
    sourceName: "Sample paper",
    sourceUrl: sampleUrl("paper", "tool-routing"),
    provenance: "source",
    topicIds: ["agents", "research"],
    related: [
      { kind: "model", id: "northstar-2" },
      { kind: "company", id: "northwind" },
      { kind: "repository", id: "northstar-eval" },
    ],
    facts: [
      { label: "Authors", value: "A. Okonkwo, L. Berger" },
      { label: "Venue", value: "Sample workshop note" },
    ],
  },
  {
    kind: "paper",
    id: "score-gap",
    title: "When agent scores and chat scores disagree",
    excerpt:
      "Sample paper: argues that a chat board and an agent suite can rank systems differently, without publishing raw tables.",
    publishedAt: "2026-09-18",
    sourceName: "Sample paper",
    sourceUrl: sampleUrl("paper", "score-gap"),
    provenance: "unverified",
    topicIds: ["benchmarks", "evaluation", "research"],
    related: [
      { kind: "benchmark", id: "agent-suite" },
      { kind: "benchmark", id: "chat-board" },
      { kind: "article", id: "scores-diverge" },
      { kind: "article", id: "protocol-gap" },
    ],
    facts: [
      { label: "Authors", value: "M. Ibarra, S. Chen" },
      { label: "Venue", value: "Sample preprint" },
    ],
  },
  {
    kind: "paper",
    id: "fieldnote-report",
    title: "Fieldnote 70B training note",
    excerpt:
      "Sample report: describes the data mix at a high level and points readers to the weights repo.",
    publishedAt: "2026-09-25",
    sourceName: "Sample paper",
    sourceUrl: sampleUrl("paper", "fieldnote-report"),
    provenance: "source",
    topicIds: ["open-source", "research"],
    related: [
      { kind: "model", id: "fieldnote-70b" },
      { kind: "company", id: "fieldnote" },
      { kind: "repository", id: "fieldnote-weights" },
    ],
    facts: [
      { label: "Authors", value: "Fieldnote Labs" },
      { label: "Venue", value: "Sample technical report" },
    ],
  },
  {
    kind: "paper",
    id: "screen-reading",
    title: "Reading screens as documents",
    excerpt:
      "Sample paper: treats UI screenshots as documents and is linked from the Lumen Vision S note.",
    publishedAt: "2026-09-16",
    sourceName: "Sample paper",
    sourceUrl: sampleUrl("paper", "screen-reading"),
    provenance: "source",
    topicIds: ["vision", "research"],
    related: [
      { kind: "model", id: "lumen-vision-s" },
      { kind: "company", id: "lumen" },
      { kind: "benchmark", id: "doc-vision" },
      { kind: "repository", id: "lumen-screens" },
    ],
    facts: [
      { label: "Authors", value: "R. Patel, J. Moreau" },
      { label: "Venue", value: "Sample workshop note" },
    ],
  },
  {
    kind: "paper",
    id: "serving-notes",
    title: "Serving notes for a small model",
    excerpt:
      "Sample note: records batching choices for Copperline Mini and links a latency check rather than a quality board.",
    publishedAt: "2026-09-19",
    sourceName: "Sample paper",
    sourceUrl: sampleUrl("paper", "serving-notes"),
    provenance: "source",
    topicIds: ["inference", "research"],
    related: [
      { kind: "model", id: "copperline-mini" },
      { kind: "company", id: "copperline" },
      { kind: "benchmark", id: "serve-latency" },
      { kind: "repository", id: "copperline-serve" },
    ],
    facts: [
      { label: "Authors", value: "Copperline systems group" },
      { label: "Venue", value: "Sample engineering note" },
    ],
  },
  {
    kind: "repository",
    id: "northstar-eval",
    title: "northstar-eval",
    excerpt:
      "Sample repo: a harness for the tool-routing setup described with Northstar 2.",
    publishedAt: "2026-10-01",
    sourceName: "Sample repository",
    sourceUrl: sampleUrl("repository", "northstar-eval"),
    provenance: "source",
    topicIds: ["agents", "evaluation"],
    related: [
      { kind: "model", id: "northstar-2" },
      { kind: "paper", id: "tool-routing" },
      { kind: "benchmark", id: "agent-suite" },
      { kind: "company", id: "northwind" },
    ],
    facts: [
      { label: "Language", value: "Python" },
      { label: "Activity", value: "Eval harness published with the model note" },
    ],
  },
  {
    kind: "repository",
    id: "fieldnote-weights",
    title: "fieldnote-weights",
    excerpt:
      "Sample repo: hosts the Fieldnote 70B weights and a short script that follows the training note.",
    publishedAt: "2026-09-26",
    sourceName: "Sample repository",
    sourceUrl: sampleUrl("repository", "fieldnote-weights"),
    provenance: "source",
    topicIds: ["open-source"],
    related: [
      { kind: "model", id: "fieldnote-70b" },
      { kind: "paper", id: "fieldnote-report" },
      { kind: "company", id: "fieldnote" },
    ],
    facts: [
      { label: "Language", value: "Python" },
      { label: "Activity", value: "Weights and a reproduction script" },
    ],
  },
  {
    kind: "repository",
    id: "lumen-screens",
    title: "lumen-screens",
    excerpt:
      "Sample repo: example screen-reading tasks linked from Lumen Vision S.",
    publishedAt: "2026-09-24",
    sourceName: "Sample repository",
    sourceUrl: sampleUrl("repository", "lumen-screens"),
    provenance: "source",
    topicIds: ["vision"],
    related: [
      { kind: "model", id: "lumen-vision-s" },
      { kind: "paper", id: "screen-reading" },
      { kind: "benchmark", id: "doc-vision" },
    ],
    facts: [
      { label: "Language", value: "Python" },
      { label: "Activity", value: "Task examples for screen reading" },
    ],
  },
  {
    kind: "repository",
    id: "agent-score-kit",
    title: "agent-score-kit",
    excerpt:
      "Sample repo: Harbor's kit for placing a model on the sample agent suite and the chat board.",
    publishedAt: "2026-09-27",
    sourceName: "Sample repository",
    sourceUrl: sampleUrl("repository", "agent-score-kit"),
    provenance: "source",
    topicIds: ["benchmarks", "evaluation"],
    related: [
      { kind: "model", id: "harbor-agent-1" },
      { kind: "benchmark", id: "agent-suite" },
      { kind: "benchmark", id: "chat-board" },
      { kind: "company", id: "harbor" },
    ],
    facts: [
      { label: "Language", value: "Python" },
      { label: "Activity", value: "Score comparison helpers" },
    ],
  },
  {
    kind: "repository",
    id: "copperline-serve",
    title: "copperline-serve",
    excerpt:
      "Sample repo: serving config that accompanies the Copperline Mini notes.",
    publishedAt: "2026-09-22",
    sourceName: "Sample repository",
    sourceUrl: sampleUrl("repository", "copperline-serve"),
    provenance: "source",
    topicIds: ["inference"],
    related: [
      { kind: "model", id: "copperline-mini" },
      { kind: "paper", id: "serving-notes" },
      { kind: "benchmark", id: "serve-latency" },
    ],
    facts: [
      { label: "Language", value: "Python" },
      { label: "Activity", value: "Serving config for the small model" },
    ],
  },
  {
    kind: "benchmark",
    id: "agent-suite",
    title: "Sample Agent Suite",
    excerpt:
      "Sample board: ranks tool-use tasks. It does not match the order on the sample chat board.",
    publishedAt: "2026-09-28",
    sourceName: "Sample board",
    sourceUrl: sampleUrl("benchmark", "agent-suite"),
    provenance: "unverified",
    topicIds: ["agents", "benchmarks"],
    related: [
      { kind: "model", id: "northstar-2" },
      { kind: "model", id: "harbor-agent-1" },
      { kind: "benchmark", id: "chat-board" },
      { kind: "paper", id: "score-gap" },
      { kind: "article", id: "scores-diverge" },
    ],
    facts: [
      { label: "Metric", value: "Tool-use tasks" },
      { label: "Result note", value: "Raw tables are not in this sample set" },
    ],
  },
  {
    kind: "benchmark",
    id: "chat-board",
    title: "Sample Chat Board",
    excerpt:
      "Sample board: a chat ranking that disagrees with the agent suite. Scores are not reproduced here.",
    publishedAt: "2026-09-28",
    sourceName: "Sample board",
    sourceUrl: sampleUrl("benchmark", "chat-board"),
    provenance: "unverified",
    topicIds: ["benchmarks", "llms"],
    related: [
      { kind: "benchmark", id: "agent-suite" },
      { kind: "paper", id: "score-gap" },
      { kind: "repository", id: "agent-score-kit" },
    ],
    facts: [
      { label: "Metric", value: "Chat tasks" },
      { label: "Result note", value: "Order differs from the agent suite; figures omitted" },
    ],
  },
  {
    kind: "benchmark",
    id: "doc-vision",
    title: "Sample Doc Vision",
    excerpt:
      "Sample board: document and screen tasks linked from Lumen Vision S. No score table is included.",
    publishedAt: "2026-09-24",
    sourceName: "Sample board",
    sourceUrl: sampleUrl("benchmark", "doc-vision"),
    provenance: "unverified",
    topicIds: ["vision", "benchmarks"],
    related: [
      { kind: "model", id: "lumen-vision-s" },
      { kind: "paper", id: "screen-reading" },
      { kind: "repository", id: "lumen-screens" },
    ],
    facts: [
      { label: "Metric", value: "Document and screen tasks" },
      { label: "Result note", value: "Presence of a link only; scores not stored" },
    ],
  },
  {
    kind: "benchmark",
    id: "serve-latency",
    title: "Sample Serve Latency",
    excerpt:
      "Sample check: latency notes for Copperline Mini. The set does not include measured numbers.",
    publishedAt: "2026-09-22",
    sourceName: "Sample board",
    sourceUrl: sampleUrl("benchmark", "serve-latency"),
    provenance: "unverified",
    topicIds: ["inference", "benchmarks"],
    related: [
      { kind: "model", id: "copperline-mini" },
      { kind: "repository", id: "copperline-serve" },
      { kind: "paper", id: "serving-notes" },
    ],
    facts: [
      { label: "Metric", value: "Serving latency" },
      { label: "Result note", value: "No measured figures in the sample set" },
    ],
  },
  {
    kind: "article",
    id: "northstar-ships",
    title: "Northstar 2 ships with an eval harness",
    excerpt:
      "Sample article: says Northwind published the model, a tool-routing note, and the northstar-eval repo on the same day.",
    publishedAt: "2026-10-01",
    sourceName: "Sample desk",
    sourceUrl: sampleUrl("article", "northstar-ships"),
    provenance: "source",
    topicIds: ["llms", "agents"],
    related: [
      { kind: "model", id: "northstar-2" },
      { kind: "company", id: "northwind" },
      { kind: "paper", id: "tool-routing" },
      { kind: "repository", id: "northstar-eval" },
    ],
    facts: [{ label: "Outlet", value: "Sample desk" }],
  },
  {
    kind: "article",
    id: "scores-diverge",
    title: "Agent suite and chat board disagree",
    excerpt:
      "Sample article: reports that the two boards name different leaders. It does not include the underlying scores.",
    publishedAt: "2026-09-28",
    sourceName: "Sample desk",
    sourceUrl: sampleUrl("article", "scores-diverge"),
    provenance: "unverified",
    topicIds: ["benchmarks", "agents", "evaluation"],
    related: [
      { kind: "benchmark", id: "agent-suite" },
      { kind: "benchmark", id: "chat-board" },
      { kind: "paper", id: "score-gap" },
      { kind: "model", id: "harbor-agent-1" },
    ],
    facts: [{ label: "Outlet", value: "Sample desk" }],
  },
  {
    kind: "article",
    id: "fieldnote-posted",
    title: "Fieldnote posts weights and a repo",
    excerpt:
      "Sample article: notes that the weights, the training note, and fieldnote-weights appeared together.",
    publishedAt: "2026-09-26",
    sourceName: "Sample desk",
    sourceUrl: sampleUrl("article", "fieldnote-posted"),
    provenance: "source",
    topicIds: ["open-source", "llms"],
    related: [
      { kind: "model", id: "fieldnote-70b" },
      { kind: "repository", id: "fieldnote-weights" },
      { kind: "company", id: "fieldnote" },
      { kind: "paper", id: "fieldnote-report" },
    ],
    facts: [{ label: "Outlet", value: "Sample desk" }],
  },
  {
    kind: "article",
    id: "lumen-demo",
    title: "Lumen shows screen reading in a general model",
    excerpt:
      "Sample article: describes a demo of Lumen Vision S on screenshots and links the doc-vision board.",
    publishedAt: "2026-09-24",
    sourceName: "Sample desk",
    sourceUrl: sampleUrl("article", "lumen-demo"),
    provenance: "source",
    topicIds: ["vision"],
    related: [
      { kind: "model", id: "lumen-vision-s" },
      { kind: "benchmark", id: "doc-vision" },
      { kind: "company", id: "lumen" },
    ],
    facts: [{ label: "Outlet", value: "Sample desk" }],
  },
  {
    kind: "article",
    id: "copperline-note",
    title: "Copperline Mini arrives with serving notes",
    excerpt:
      "Sample article: covers the small model, the serving repo, and a latency check that has no published numbers.",
    publishedAt: "2026-09-22",
    sourceName: "Sample desk",
    sourceUrl: sampleUrl("article", "copperline-note"),
    provenance: "source",
    topicIds: ["inference"],
    related: [
      { kind: "model", id: "copperline-mini" },
      { kind: "benchmark", id: "serve-latency" },
      { kind: "company", id: "copperline" },
    ],
    facts: [{ label: "Outlet", value: "Sample desk" }],
  },
  {
    kind: "article",
    id: "protocol-gap",
    title: "No shared eval protocol in this set",
    excerpt:
      "Sample article: points out that the boards and papers do not describe one protocol, so comparisons stay provisional.",
    publishedAt: "2026-09-18",
    sourceName: "Sample desk",
    sourceUrl: sampleUrl("article", "protocol-gap"),
    provenance: "interpretation",
    topicIds: ["evaluation", "benchmarks"],
    related: [
      { kind: "paper", id: "score-gap" },
      { kind: "benchmark", id: "agent-suite" },
      { kind: "topic", id: "evaluation" },
    ],
    facts: [{ label: "Outlet", value: "Sample desk" }],
  },
];

export const briefing: Briefing = {
  date: "2026-10-02",
  headline: "Tool use, open weights, and split scores",
  summary:
    "Sample briefing. Three threads run through this set: a tool-routing release, an open-weight drop with a repo, and agent scores that do not match a chat board.",
  provenance: "interpretation",
  points: [
    {
      text: "Northstar 2, its paper, and northstar-eval describe the same tool-routing setup.",
      provenance: "source",
    },
    {
      text: "That cluster is the first place to look if agents matter more than chat quality.",
      provenance: "interpretation",
    },
    {
      text: "Score claims stay unverified because this set has no raw tables or shared protocol.",
      provenance: "unverified",
    },
  ],
};

export const developments: Development[] = [
  {
    id: "dev-northstar",
    title: "Northstar 2 links a model, a paper, and a harness",
    whyItMatters:
      "Sample reading: the release is useful to inspect because three item types describe one tool-routing setup, so you can move from the model to the method and the code.",
    date: "2026-10-01",
    provenance: "interpretation",
    related: [
      { kind: "model", id: "northstar-2" },
      { kind: "paper", id: "tool-routing" },
      { kind: "repository", id: "northstar-eval" },
      { kind: "company", id: "northwind" },
    ],
  },
  {
    id: "dev-scores",
    title: "Agent scores and chat scores name different leaders",
    whyItMatters:
      "Sample reading: a chat ranking would send you to a different system than the agent suite. The gap is a lead, not a verified result.",
    date: "2026-09-28",
    provenance: "unverified",
    related: [
      { kind: "benchmark", id: "agent-suite" },
      { kind: "benchmark", id: "chat-board" },
      { kind: "paper", id: "score-gap" },
    ],
  },
  {
    id: "dev-fieldnote",
    title: "Fieldnote published weights with a reproduction repo",
    whyItMatters:
      "Sample reading: open weights plus a repo make this easier to inspect than a model note alone.",
    date: "2026-09-26",
    provenance: "interpretation",
    related: [
      { kind: "model", id: "fieldnote-70b" },
      { kind: "repository", id: "fieldnote-weights" },
      { kind: "company", id: "fieldnote" },
    ],
  },
];

export const connections: ConnectionGroup[] = [
  {
    id: "cluster-northstar",
    title: "Northstar tool routing",
    note: "Model, company, paper, repo, and agent suite point at one setup.",
    provenance: "source",
    related: [
      { kind: "model", id: "northstar-2" },
      { kind: "company", id: "northwind" },
      { kind: "paper", id: "tool-routing" },
      { kind: "repository", id: "northstar-eval" },
      { kind: "benchmark", id: "agent-suite" },
    ],
  },
  {
    id: "cluster-fieldnote",
    title: "Fieldnote open weights",
    note: "Weights, report, and repo are the inspectable path.",
    provenance: "source",
    related: [
      { kind: "model", id: "fieldnote-70b" },
      { kind: "company", id: "fieldnote" },
      { kind: "paper", id: "fieldnote-report" },
      { kind: "repository", id: "fieldnote-weights" },
    ],
  },
  {
    id: "cluster-scores",
    title: "Split leaderboards",
    note: "The boards disagree. Treat the ranking as unverified.",
    provenance: "unverified",
    related: [
      { kind: "benchmark", id: "agent-suite" },
      { kind: "benchmark", id: "chat-board" },
      { kind: "paper", id: "score-gap" },
      { kind: "model", id: "harbor-agent-1" },
    ],
  },
];

export const assistantSamples: AssistantSample[] = [
  {
    id: "northstar",
    question: "What does this sample set say about Northstar 2?",
    answer:
      "Northstar 2 is a sample model from Northwind AI. The model note, the paper “Routing work across tool calls,” and the northstar-eval repo describe the same tool-routing setup. The sample agent suite is linked, but this set does not include raw scores. This is a prepared sample answer, not a live model response.",
    provenance: "interpretation",
    insufficient: false,
    sources: [
      { label: "Northstar 2", href: "/models/northstar-2" },
      { label: "Routing work across tool calls", href: "/papers/tool-routing" },
      { label: "northstar-eval", href: "/github/northstar-eval" },
    ],
  },
  {
    id: "fieldnote",
    question: "How is Fieldnote 70B connected to other items?",
    answer:
      "Fieldnote 70B connects to Fieldnote Labs, the training note, and the fieldnote-weights repo. The sample article says those three appeared together. Nothing else in this set claims a benchmark result for it.",
    provenance: "source",
    insufficient: false,
    sources: [
      { label: "Fieldnote 70B", href: "/models/fieldnote-70b" },
      { label: "Fieldnote Labs", href: "/companies/fieldnote" },
      { label: "fieldnote-weights", href: "/github/fieldnote-weights" },
    ],
  },
  {
    id: "worth",
    question: "Which sample developments are worth a closer look?",
    answer:
      "Start with the Northstar cluster if you want a model, a method, and code in one place. Look at Fieldnote next if you want weights you can follow into a repo. Treat the leaderboard split as a question to investigate, not a result.",
    provenance: "interpretation",
    insufficient: false,
    sources: [
      { label: "Overview briefing", href: "/" },
      { label: "Sample Agent Suite", href: "/benchmarks/agent-suite" },
      { label: "Fieldnote 70B", href: "/models/fieldnote-70b" },
    ],
  },
  {
    id: "revenue",
    question: "What did Harbor Research announce about revenue?",
    answer:
      "This sample set does not have enough evidence to answer that. There is no revenue figure, filing, or announcement linked to Harbor Research.",
    provenance: "unverified",
    insufficient: true,
    sources: [{ label: "Harbor Research", href: "/companies/harbor" }],
  },
];
