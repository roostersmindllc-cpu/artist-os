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
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            {range.subheading}
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-none">{range.heading}</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex rounded-[1.4rem] border-2 border-black/12 bg-white p-1">
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
                    "rounded-xl px-4",
                    isActive ? "bg-[linear-gradient(180deg,#b360ff,#9a42de)] text-white hover:bg-[linear-gradient(180deg,#b360ff,#9a42de)] hover:text-white" : "text-muted-foreground"
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
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full border-black/12 bg-white px-4")}
            >
              <ChevronLeft className="size-4" />
              Prev
            </Link>
            <Link
              href={buildContentPlannerHref(baseParams, {
                date: formatPlannerDateParam(new Date())
              })}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full border-black/12 bg-white px-4")}
            >
              Today
            </Link>
            <Link
              href={buildContentPlannerHref(baseParams, {
                date: formatPlannerDateParam(
                  getContentPlannerShiftedDate(view, range.anchorDate, "next")
                )
              })}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full border-black/12 bg-white px-4")}
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
