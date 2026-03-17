import { Activity, RadioTower, TrendingUp, Users2 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
    <Card className="overflow-hidden border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Activity className="size-5" />
          </span>
          <div className="space-y-1">
            <CardTitle>Performance snapshot</CardTitle>
            <CardDescription className="max-w-2xl leading-6">
              A seven-day read on momentum, built from the latest tracked series for
              streams, follower growth, and engagement.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasAnyData ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {items.map((item) => {
              const Icon = performanceIcons[item.key];

              return (
                <div
                  key={item.key}
                  className="rounded-3xl border border-border/70 bg-background/45 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-heading text-3xl font-semibold tracking-tight">
                        {item.value === null
                          ? "--"
                          : formatMetricValue(item.metricName, item.value)}
                      </p>
                    </div>
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
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
      </CardContent>
    </Card>
  );
}
