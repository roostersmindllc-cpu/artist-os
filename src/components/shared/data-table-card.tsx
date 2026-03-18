import type { ReactNode } from "react";

import { BlackHeaderCard } from "@/components/shared/artist-os-surfaces";
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
    <BlackHeaderCard
      title={title}
      description={description}
      titleClassName="text-2xl"
      headerClassName="pb-5"
      contentPadding={hasData ? "flush" : "default"}
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      {hasData ? children : emptyState}
    </BlackHeaderCard>
  );
}
