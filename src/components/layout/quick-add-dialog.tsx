"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, CalendarPlus, Disc3, Sparkles, Users2 } from "lucide-react";

import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { AnalyticsForm } from "@/components/forms/analytics-form";
import { ContentForm } from "@/components/forms/content-form";
import { FanForm } from "@/components/forms/fan-form";
import { ReleaseForm } from "@/components/forms/release-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { cn } from "@/lib/utils";
import type { ContentPlannerOptionsDto } from "@/services/content-types";

export type QuickAddView = "release" | "content" | "fan" | "analytics";

type QuickAddDialogProps = {
  open: boolean;
  activeView: QuickAddView;
  contentOptions: ContentPlannerOptionsDto;
  onViewChange: (view: QuickAddView) => void;
  onOpenChange: (open: boolean) => void;
};

const quickAddTabs: Array<{
  id: QuickAddView;
  label: string;
  shortcut: string;
  icon: LucideIcon;
  description: string;
}> = [
  {
    id: "release",
    label: "Add release",
    shortcut: "N R",
    icon: Disc3,
    description: "Create the next release and let automation build the first rollout layer."
  },
  {
    id: "content",
    label: "Schedule post",
    shortcut: "N P",
    icon: CalendarPlus,
    description: "Capture a new content item without leaving the page you are on."
  },
  {
    id: "fan",
    label: "Add fan",
    shortcut: "N F",
    icon: Users2,
    description: "Store an audience relationship while the context is still fresh."
  },
  {
    id: "analytics",
    label: "Log analytics",
    shortcut: "N A",
    icon: BarChart3,
    description: "Save a metric snapshot so charts and momentum views stay current."
  }
];

function ShortcutPill({ value }: { value: string }) {
  return (
    <span className="rounded-full border border-border/70 bg-background/70 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {value}
    </span>
  );
}

export function QuickAddDialog({
  open,
  activeView,
  contentOptions,
  onViewChange,
  onOpenChange
}: QuickAddDialogProps) {
  const activeTab = quickAddTabs.find((tab) => tab.id === activeView) ?? quickAddTabs[0];
  const ActiveIcon = activeTab.icon;

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={activeTab.label}
      description={activeTab.description}
      icon={ActiveIcon}
      size="xl"
    >
      <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="border-b border-border/60 bg-background/35 p-4 lg:border-b-0 lg:border-r">
          <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-4 shadow-sm">
            <ArtistOsLogo compact withTagline className="items-start" markClassName="h-10 w-10" />
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                Quick add
              </Badge>
              <ShortcutPill value="?" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Add the next record from anywhere, then jump back into the workspace with fresh data already in place.
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {quickAddTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeView;

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    "h-auto items-start justify-start rounded-2xl px-4 py-3 text-left",
                    !isActive && "border-border/70 bg-card/75"
                  )}
                  onClick={() => onViewChange(tab.id)}
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl border border-current/15 bg-current/10">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{tab.label}</span>
                    <span className="mt-1 block text-xs font-medium uppercase tracking-[0.18em] text-current/75">
                      {tab.shortcut}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0">
          {activeView === "release" ? (
            <ReleaseForm
              variant="plain"
              redirectOnCreate={false}
              onSuccess={() => onOpenChange(false)}
            />
          ) : activeView === "content" ? (
            <ContentForm
              options={contentOptions}
              variant="plain"
              redirectOnCreate={false}
              onSuccess={() => onOpenChange(false)}
            />
          ) : activeView === "fan" ? (
            <FanForm
              variant="plain"
              redirectOnCreate={false}
              onSuccess={() => onOpenChange(false)}
            />
          ) : (
            <AnalyticsForm variant="plain" onSuccess={() => onOpenChange(false)} />
          )}
        </div>
      </div>
      <div className="border-t border-border/60 bg-background/35 px-5 py-4 text-sm text-muted-foreground sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Quick add works from buttons, the mobile dock, or keyboard shortcuts.
          </span>
          <ShortcutPill value={activeTab.shortcut} />
        </div>
      </div>
    </DialogShell>
  );
}
