import type { Metadata } from "next";

import { ItemRow } from "@/components/item-row";
import { SectionHeader } from "@/components/section-header";
import { searchEntries } from "@/lib/data";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const results = await searchEntries(query);

  return (
    <section>
      <SectionHeader
        heading="h1"
        title="Search"
        description="Search runs over the sample set from the API."
      />
      {query.trim() === "" ? (
        <p className="text-sm text-muted-foreground">Enter a term in the header search.</p>
      ) : (
        <>
          <p className="mb-2 text-xs text-muted-foreground">
            {results.length} sample {results.length === 1 ? "item" : "items"} for “{query.trim()}”
          </p>
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sample items match that query.</p>
          ) : (
            results.map((entry) => <ItemRow key={`${entry.kind}:${entry.id}`} entry={entry} />)
          )}
        </>
      )}
    </section>
  );
}
