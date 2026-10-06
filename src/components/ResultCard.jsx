import { ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";

// A key-result card: label on top, the big number pinned to the bottom so numbers line up across cards.
export default function ResultCard({ label, value, note }) {
  const pct = value.endsWith("%");
  const main = pct ? value.slice(0, -1) : value;
  return (
    <Card className="justify-between gap-4 rounded-2xl p-4">
      <div className="t-small text-foreground/75">
        {label}
        {note && <span className="mt-1 block text-xs leading-4 text-muted-foreground">{note}</span>}
      </div>
      <div className="flex items-center gap-1">
        <ArrowUp className="size-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-label="Increase" />
        <span className="text-[2rem] leading-8 tracking-[-0.04em]">
          {main}
          {pct && <span className="ml-1 text-[0.55em] text-muted-foreground">%</span>}
        </span>
      </div>
    </Card>
  );
}
