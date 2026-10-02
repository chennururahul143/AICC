import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  action = "View all",
  heading = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  action?: string;
  heading?: "h1" | "h2";
  id?: string;
}) {
  const Heading = heading;
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Heading
          id={id}
          className={heading === "h1" ? "text-xl font-semibold tracking-tight" : "text-base font-semibold tracking-tight"}
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}
