import Link from "next/link";
import { Activity, ArrowRight, CalendarClock, CheckCircle2, TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { releaseTypeLabels } from "@/lib/domain-config";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import type { DashboardReleaseHealthInsight } from "@/services/dashboard-helpers";

type ReleaseHealthScoreCardProps = {
  insight: DashboardReleaseHealthInsight | null;
};

function getScoreBadgeClasses(score: number) {
  if (score >= 85) {
    return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (score >= 70) {
    return "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  }

  if (score >= 50) {
    return "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300";
}

function getProgressBarClasses(score: number) {
  if (score >= 85) {
    return "bg-emerald-500";
  }

  if (score >= 70) {
    return "bg-sky-500";
  }

  if (score >= 50) {
    return "bg-amber-500";
  }

  return "bg-rose-500";
}

export function ReleaseHealthScoreCard({
  insight
}: ReleaseHealthScoreCardProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="border-b border-border/60">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Activity className="size-5" />
          </span>
          <div className="space-y-1">
            <CardTitle>Release health score</CardTitle>
            <CardDescription className="max-w-2xl leading-6">
              A readiness score for the next release, based on the launch signals
              already tracked in Artist OS.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {insight ? (
          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded-[28px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.12),transparent_40%),rgba(255,255,255,0.02)] p-5">
              <Badge
                variant="outline"
                className={cn("rounded-full px-3 py-1 font-semibold", getScoreBadgeClasses(insight.score))}
              >
                {insight.scoreLabel}
              </Badge>
              <p className="mt-4 font-heading text-5xl font-semibold tracking-tight">
                {insight.score}%
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Upcoming release readiness
              </p>
              <div className="mt-4 h-2 rounded-full bg-border/60">
                <div
                  className={cn("h-full rounded-full transition-[width]", getProgressBarClasses(insight.score))}
                  style={{ width: `${insight.score}%` }}
                />
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-2xl border border-border/60 bg-background/65 p-3">
                  <p className="font-medium">{insight.releaseTitle}</p>
                  <p className="mt-1 text-muted-foreground">
                    {releaseTypeLabels[insight.releaseType]}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/65 p-3 text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground">
                    <CalendarClock className="size-4 text-primary" />
                    <span className="font-medium">{formatDate(insight.releaseDate)}</span>
                  </div>
                  {insight.releaseDate ? (
                    <p className="mt-1">{formatRelativeTime(insight.releaseDate)}</p>
                  ) : (
                    <p className="mt-1">Release date not set</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-border/70 bg-background/45 p-4">
                <p className="text-sm leading-7 text-foreground">{insight.summary}</p>
              </div>

              <div className="space-y-3">
                {insight.checklist.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/45 p-4"
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-2xl border",
                        item.status === "complete"
                          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                          : "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                      )}
                    >
                      {item.status === "complete" ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <TriangleAlert className="size-4" />
                      )}
                    </span>
                    <div className="space-y-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={insight.releaseHref} className={cn(buttonVariants(), "rounded-2xl")}>
                  Open release workspace
                  <ArrowRight className="size-4" />
                </Link>
                {insight.primaryAction && insight.primaryAction.href !== insight.releaseHref ? (
                  <Link
                    href={insight.primaryAction.href}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                  >
                    {insight.primaryAction.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No upcoming release to score"
            description="Add a release date to get a readiness score, see launch gaps, and turn the dashboard into a stronger daily guide."
            icon={Activity}
            variant="card"
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
      </CardContent>
    </Card>
  );
}
