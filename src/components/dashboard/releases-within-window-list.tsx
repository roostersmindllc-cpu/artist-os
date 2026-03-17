import Link from "next/link";
import { ArrowRight, Disc3 } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";

import { DashboardWidgetShell } from "@/components/dashboard/dashboard-widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { releaseStatusLabels, releaseTypeLabels } from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { cn, formatDate } from "@/lib/utils";

type ReleasesWithinWindowListProps = {
  totalCount: number;
  items: Array<{
    id: string;
    title: string;
    type: keyof typeof releaseTypeLabels;
    status: keyof typeof releaseStatusLabels;
    releaseDate: Date | null;
    distributor: string | null;
    _count: {
      campaigns: number;
      tracks: number;
    };
  }>;
};

function getReleaseCountdownLabel(releaseDate: Date | null) {
  if (!releaseDate) {
    return "Date not set";
  }

  const daysUntilRelease = differenceInCalendarDays(releaseDate, new Date());

  if (daysUntilRelease <= 0) {
    return "Releases today";
  }

  if (daysUntilRelease === 1) {
    return "1 day away";
  }

  return `${daysUntilRelease} days away`;
}

export function ReleasesWithinWindowList({
  totalCount,
  items
}: ReleasesWithinWindowListProps) {
  return (
    <DashboardWidgetShell
      title="Releases within 30 days"
      description="The launch runway that should shape content, assets, and campaign timing right now."
      icon={Disc3}
      countLabel={`${totalCount} upcoming`}
    >
      <div className="flex-1 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-background/45 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {releaseTypeLabels[item.type]} - {formatDate(item.releaseDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.distributor ?? "Distributor not set"} - {item._count.tracks} tracks
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item._count.campaigns} linked campaign
                    {item._count.campaigns === 1 ? "" : "s"} - {getReleaseCountdownLabel(item.releaseDate)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(item.status)}>
                  {releaseStatusLabels[item.status]}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No releases in the next 30 days"
            description="The runway is clear right now. Add a release date to anchor planning around a real launch."
            action={
              <Link
                href="/releases/new"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
              >
                Add release
              </Link>
            }
          />
        )}
      </div>

      {items.length > 0 ? (
        <Link
          href="/releases"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-auto rounded-2xl border-border/70"
          )}
        >
          Open releases
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </DashboardWidgetShell>
  );
}
