import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Rows3 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  buildContentPlannerHref,
  formatPlannerDateParam,
  getContentPlannerShiftedDate
} from "@/services/content-helpers";
import type { ContentPlannerRangeDto, ContentPlannerView } from "@/services/content-types";

type ContentPlannerToolbarProps = {
  view: ContentPlannerView;
  range: ContentPlannerRangeDto;
  filters: {
    platform?: string;
    status?: string;
    campaignId?: string;
    releaseId?: string;
  };
};

const viewItems = [
  { value: "month", label: "Month", icon: LayoutGrid },
  { value: "week", label: "Week", icon: Rows3 },
  { value: "list", label: "List", icon: List }
] as const;

export function ContentPlannerToolbar({
  view,
  range,
  filters
}: ContentPlannerToolbarProps) {
  const baseParams = {
    view,
    date: formatPlannerDateParam(range.anchorDate),
    ...filters
  };

  return (
    <Card className="border-border/70 bg-card/85">
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {range.subheading}
          </p>
          <h2 className="font-heading text-2xl font-semibold">{range.heading}</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex rounded-2xl border border-border/70 bg-background/60 p-1">
            {viewItems.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.value;

              return (
                <Link
                  key={item.value}
                  href={buildContentPlannerHref(baseParams, {
                    view: item.value,
                    date: formatPlannerDateParam(range.anchorDate)
                  })}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "rounded-xl",
                    isActive ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={buildContentPlannerHref(baseParams, {
                date: formatPlannerDateParam(
                  getContentPlannerShiftedDate(view, range.anchorDate, "previous")
                )
              })}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl")}
            >
              <ChevronLeft className="size-4" />
              Prev
            </Link>
            <Link
              href={buildContentPlannerHref(baseParams, {
                date: formatPlannerDateParam(new Date())
              })}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl")}
            >
              Today
            </Link>
            <Link
              href={buildContentPlannerHref(baseParams, {
                date: formatPlannerDateParam(
                  getContentPlannerShiftedDate(view, range.anchorDate, "next")
                )
              })}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl")}
            >
              Next
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
