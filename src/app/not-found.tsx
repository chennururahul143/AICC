import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <h1 className="text-xl font-semibold tracking-tight">Item not in the sample set</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That link does not match a sample item.
      </p>
      <Link href="/" className="mt-4 inline-block text-sm underline-offset-4 hover:underline">
        Back to overview
      </Link>
    </section>
  );
}
