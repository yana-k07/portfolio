import { Card } from "@/components/ui/card";

// Small label + value card, built to match the project cards on the home page.
export default function FactCard({ label, value }) {
  return (
    <Card className="gap-2 rounded-2xl p-4">
      <div className="t-small font-medium text-foreground">{label}</div>
      <div className="t-small text-foreground/75">{value}</div>
    </Card>
  );
}
