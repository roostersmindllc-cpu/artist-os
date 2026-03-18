import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { BlackHeaderCard } from "@/components/shared/artist-os-surfaces";
import { Badge } from "@/components/ui/badge";

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
    <BlackHeaderCard
      title={title}
      description={description}
      className="flex h-full flex-col overflow-hidden"
      headerClassName="pb-4"
      contentClassName="flex flex-1 flex-col gap-4"
      titleClassName="text-3xl"
      descriptionClassName="max-w-md leading-6"
      icon={
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-primary text-primary-foreground shadow-sm">
          <Icon className="size-5" />
        </span>
      }
      action={
        <Badge
          variant="outline"
          className="rounded-full border-white/16 bg-white/8 px-3 py-1 font-semibold text-white"
        >
          {countLabel}
        </Badge>
      }
    >
      {children}
    </BlackHeaderCard>
  );
}
