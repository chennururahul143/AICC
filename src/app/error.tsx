"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section>
      <h1 className="text-xl font-semibold tracking-tight">This page could not be shown</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while loading this view.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 text-sm underline-offset-4 hover:underline"
      >
        Try again
      </button>
    </section>
  );
}
