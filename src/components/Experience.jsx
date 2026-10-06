import { Badge } from "@/components/ui/badge";

// A white tile, so logos with their own white corners look right in the dark theme too.
function Logo({ item }) {
  const base =
    "grid size-11 flex-none place-items-center overflow-hidden rounded-xl border border-border bg-white";
  if (item.logo) {
    return (
      <span className={base}>
        <img src={item.logo} alt="" className="size-full object-contain p-1.5" />
      </span>
    );
  }
  return <span className={`${base} t-body text-neutral-500`}>{item.company.charAt(0)}</span>;
}

// One row per job: company first, then the role and dates, then a one-line summary.
export default function Experience({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-4 border-b py-6 last:border-b-0">
          <Logo item={item} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="t-body font-medium leading-6">{item.company}</span>
              <span className="t-small text-muted-foreground">{item.role}</span>
              <Badge
                variant="secondary"
                className="rounded-md px-2 py-1 text-xs leading-4 font-normal text-muted-foreground"
              >
                {item.period}
              </Badge>
            </div>
            <p className="t-small mt-2 text-muted-foreground">{item.summary}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
