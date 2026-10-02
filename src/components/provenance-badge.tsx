import { Badge } from "@/components/ui/badge";
import type { Provenance } from "@/lib/types";

const label: Record<Provenance, string> = {
  source: "Source",
  interpretation: "AI interpretation",
  unverified: "Unverified",
};

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  return (
    <Badge variant={provenance === "unverified" ? "outline" : "secondary"}>
      {label[provenance]}
    </Badge>
  );
}
