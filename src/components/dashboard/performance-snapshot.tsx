import { Activity, RadioTower, TrendingUp, Users2 } from "lucide-react";

import { BlackHeaderCard } from "@/components/shared/artist-os-surfaces";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMetricValue } from "@/lib/utils";
import type { DashboardPerformanceItem } from "@/services/dashboard-helpers";

type PerformanceSnapshotProps = {
  items: DashboardPerformanceItem[];
};

const performanceIcons = {
  streamsLast7Days: TrendingUp,
  followerGrowth: Users2,
  campaignEngagement: RadioTower
} as const;

function getChangeVariant(change: number | null) {
  if (change === null) {
    return "outline" as const;
  }

  if (change > 0) {
    return "success" as const;
  }

  if (change < 0) {
    return "warning" as const;
  }

  return "outline" as const;
}

function formatSignedChange(change: number | null) {
  if (change === null) {
    return "Need a prior window";
  }

  const prefix = change > 0 ? "+" : "";

  return `${prefix}${change}% vs prior 7d`;
}

export function PerformanceSnapshot({ items }: PerformanceSnapshotProps) {
  const hasAnyData = items.some((item) => item.value !== null);

  return (
    <BlackHeaderCard
      title="Performance snapshot"
      description="A seven-day read on momentum, built from the latest tracked series for streams, follower growth, and engagement."
      className="overflow-hidden"
      headerClassName="pb-4"
      contentClassName="space-y-4"
      descriptionClassName="leading-6"
      icon={
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-primary text-primary-foreground shadow-sm">
          <Activity className="size-5" />
        </span>
      }
    >
      {hasAnyData ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {items.map((item) => {
            const Icon = performanceIcons[item.key];

            return (
              <div
                key={item.key}
                className="rounded-[1.8rem] border-2 border-black/12 bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                      {item.label}
                    </p>
                    <p className="font-heading text-5xl font-semibold leading-none tracking-tight">
                      {item.value === null
                        ? "--"
                        : formatMetricValue(item.metricName, item.value)}
                    </p>
                  </div>
                  <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-black/12 bg-black text-white">
                    <Icon className="size-4" />
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant={getChangeVariant(item.change)}>
                    {formatSignedChange(item.change)}
                  </Badge>
                  {item.sourceLabel ? (
                    <Badge variant="outline">{item.sourceLabel}</Badge>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {item.recordedAt
                    ? `Latest snapshot on ${formatDate(item.recordedAt)}.`
                    : "Add analytics snapshots to unlock this signal."}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No performance snapshot yet"
          description="Log analytics to start tracking seven-day momentum across streams, followers, and engagement."
          actionLabel={null}
        />
      )}
    </BlackHeaderCard>
  );
}
