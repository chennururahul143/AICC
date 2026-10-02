const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  const monthIndex = Number(month) - 1;
  if (!year || !day || monthIndex < 0 || monthIndex > 11) return iso;
  return `${Number(day)} ${MONTHS[monthIndex]} ${year}`;
}

export function kindLabel(kind: string): string {
  switch (kind) {
    case "article":
      return "News";
    case "paper":
      return "Paper";
    case "model":
      return "Model";
    case "repository":
      return "GitHub";
    case "benchmark":
      return "Benchmark";
    case "company":
      return "Company";
    case "topic":
      return "Topic";
    default:
      return kind;
  }
}
