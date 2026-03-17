import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type DashboardWidgetShellProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  countLabel: string;
  children: ReactNode;
};

export function DashboardWidgetShell({
  title,
  description,
  icon: Icon,
  countLabel,
  children
}: DashboardWidgetShellProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
              <Icon className="size-5" />
            </span>
            <div className="space-y-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription className="max-w-md leading-6">
                {description}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-border/70 bg-background/80 px-3 py-1 font-semibold"
          >
            {countLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">{children}</CardContent>
    </Card>
  );
}
