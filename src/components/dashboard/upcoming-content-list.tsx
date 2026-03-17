import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { DashboardWidgetShell } from "@/components/dashboard/dashboard-widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  contentFormatLabels,
  contentPlatformLabels,
  contentStatusLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { cn, formatDate } from "@/lib/utils";

type UpcomingContentListProps = {
  totalCount: number;
  items: Array<{
    id: string;
    title: string;
    platform: keyof typeof contentPlatformLabels;
    format: keyof typeof contentFormatLabels;
    status: keyof typeof contentStatusLabels;
    dueDate: Date;
    campaign: {
      id: string;
      name: string;
    } | null;
    release: {
      id: string;
      title: string;
    } | null;
  }>;
};

export function UpcomingContentList({
  totalCount,
  items
}: UpcomingContentListProps) {
  return (
    <DashboardWidgetShell
      title="Upcoming content"
      description="The next posts and assets that need to move from idea into the calendar."
      icon={CalendarDays}
      countLabel={`${totalCount} queued`}
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
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {contentPlatformLabels[item.platform]} - {contentFormatLabels[item.format]}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due {formatDate(item.dueDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.campaign?.name ?? item.release?.title ?? "Standalone content"}
                  </p>
                </div>
                <Badge variant={getStatusVariant(item.status)}>
                  {contentStatusLabels[item.status]}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No upcoming content"
            description="Nothing is queued right now. Schedule a post to keep the release calendar moving."
            action={
              <Link
                href="/content#content-composer"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
              >
                Schedule post
              </Link>
            }
          />
        )}
      </div>

      {items.length > 0 ? (
        <Link
          href="/content"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-auto rounded-2xl border-border/70"
          )}
        >
          Open content calendar
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </DashboardWidgetShell>
  );
}
