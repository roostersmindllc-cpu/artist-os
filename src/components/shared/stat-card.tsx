import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon?: LucideIcon;
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon = ArrowUpRight
}: StatCardProps) {
  return (
    <Card className="overflow-hidden border-2 border-black/10 bg-card shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
      <CardContent className="relative space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
              {label}
            </p>
            <p className="font-heading text-4xl font-semibold tracking-tight">{value}</p>
          </div>
          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-black/10 bg-black text-white shadow-sm">
            <Icon className="size-5" />
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
