"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, CalendarPlus, Disc3, Users2 } from "lucide-react";

import {
  useWorkspaceExperience,
  type QuickAddView
} from "@/components/layout/workspace-experience";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const quickAddItems: {
  view: QuickAddView;
  label: string;
  shortcut: string;
  icon: LucideIcon;
}[] = [
  {
    view: "release",
    label: "Add release",
    shortcut: "N R",
    icon: Disc3
  },
  {
    view: "content",
    label: "Schedule post",
    shortcut: "N P",
    icon: CalendarPlus
  },
  {
    view: "fan",
    label: "Add fan",
    shortcut: "N F",
    icon: Users2
  },
  {
    view: "analytics",
    label: "Log analytics",
    shortcut: "N A",
    icon: BarChart3
  }
];

export function QuickAddActions() {
  const { openQuickAdd } = useWorkspaceExperience();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {quickAddItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.view}
            type="button"
            onClick={() => openQuickAdd(item.view)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto shrink-0 rounded-2xl border-border/70 bg-card/85 px-3 py-2 shadow-sm"
            )}
          >
            <span className="inline-flex size-8 items-center justify-center rounded-xl border border-border/70 bg-background/65">
              <Icon className="size-4" />
            </span>
            <span className="flex flex-col items-start">
              <span>{item.label}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {item.shortcut}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
