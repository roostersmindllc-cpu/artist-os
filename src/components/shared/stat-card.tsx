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
    <Card className="overflow-hidden border-border/70 bg-card/90 shadow-sm">
      <CardContent className="relative space-y-4 p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {label}
            </p>
            <p className="font-heading text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Icon className="size-5" />
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
