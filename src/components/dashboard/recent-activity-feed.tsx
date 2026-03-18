import Link from "next/link";
import { CalendarDays, Disc3, FileStack, Megaphone, Users2 } from "lucide-react";

import { BlackHeaderCard } from "@/components/shared/artist-os-surfaces";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import type { DashboardActivityItem } from "@/services/dashboard-helpers";
import { cn, formatRelativeTime } from "@/lib/utils";

const activityIcons = {
  release: Disc3,
  campaign: Megaphone,
  content: CalendarDays,
  fan: Users2,
  task: FileStack
} as const;

type RecentActivityFeedProps = {
  items: DashboardActivityItem[];
};

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
  return (
    <BlackHeaderCard
      title="Recent activity"
      description="Latest creates and updates across the records driving the workspace."
      className="overflow-hidden"
      contentClassName="space-y-3"
    >
      {items.length > 0 ? (
        items.map((item) => {
          const Icon = activityIcons[item.kind];

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-start gap-3 rounded-[1.6rem] border-2 border-black/12 bg-white p-4 transition-colors hover:bg-primary/10"
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-black/12 bg-black text-white">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">
                    {item.actionLabel} {item.typeLabel.toLowerCase()}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(item.occurredAt)}
                  </span>
                </div>
                <p className="truncate font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </Link>
          );
        })
      ) : (
        <EmptyState
          title="No recent activity"
          description="Activity will appear here as releases, campaigns, content, fans, and tasks are created or updated."
          action={
            <Link
              href="/releases"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
            >
              Add your first release
            </Link>
          }
        />
      )}
    </BlackHeaderCard>
  );
}
