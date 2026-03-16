import type { ReactNode } from "react";

import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DataTableCardProps = {
  title: string;
  description?: string;
  hasData: boolean;
  children: ReactNode;
  emptyState: ReactNode;
  className?: string;
};

export function DataTableCard({
  title,
  description,
  hasData,
  children,
  emptyState,
  className
}: DataTableCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/70 bg-card/90 shadow-sm", className)}>
      <CardHeader className="border-b border-border/60 pb-5">
        <SectionHeader title={title} description={description} />
      </CardHeader>
      <CardContent className={cn(hasData ? "p-0" : "p-6")}>
        {hasData ? children : emptyState}
      </CardContent>
    </Card>
  );
}
