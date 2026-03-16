import Link from "next/link";
import { CalendarClock, Disc3, RadioTower, Users2 } from "lucide-react";

import { AnalyticsChart } from "@/components/charts/analytics-chart";
import { QuickAddActions } from "@/components/dashboard/quick-add-actions";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { UpcomingContentList } from "@/components/dashboard/upcoming-content-list";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { releaseStatusLabels, releaseTypeLabels } from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import {
  cn,
  formatCompactNumber,
  formatDate,
  formatMetricValue,
  formatRelativeTime
} from "@/lib/utils";
import { getDashboardOverview } from "@/services/dashboard-service";

export default async function DashboardPage() {
  const user = await requireUser();
  const overview = await getDashboardOverview(user.id);

  return (
    <PageContainer
      title={`Welcome back, ${overview.artistProfile.artistName}`}
      description="Your release control tower for the week ahead, with the next launch moment, audience signals, and recent operational movement."
      eyebrow="Artist workspace"
      actions={<QuickAddActions />}
    >
      <section className="grid gap-4 xl:grid-cols-[1.45fr_repeat(3,minmax(0,0.72fr))]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle>Next upcoming release</CardTitle>
            <CardDescription>
              The next release date anchoring campaigns, content, and task planning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overview.nextRelease ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
                        <Disc3 className="size-5" />
                      </span>
                      <div>
                        <p className="font-heading text-2xl font-semibold">
                          {overview.nextRelease.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {releaseTypeLabels[overview.nextRelease.type]} -{" "}
                          {formatDate(overview.nextRelease.releaseDate)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeTime(overview.nextRelease.releaseDate ?? new Date())}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(overview.nextRelease.status)}>
                    {releaseStatusLabels[overview.nextRelease.status]}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Distributor
                    </p>
                    <p className="mt-2 font-medium">
                      {overview.nextRelease.distributor ?? "Not set"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Tracks
                    </p>
                    <p className="mt-2 font-medium">{overview.nextRelease._count.tracks}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Campaigns
                    </p>
                    <p className="mt-2 font-medium">
                      {overview.nextRelease._count.campaigns}
                    </p>
                  </div>
                </div>
                <Link
                  href="/releases"
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                >
                  View releases
                </Link>
              </div>
            ) : (
              <EmptyState
                title="No upcoming release"
                description="Create a release with a date to anchor the rest of the dashboard around the next launch."
                action={
                  <Link
                    href="/releases/new"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                  >
                    New Release
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
        <StatCard
          label="Active campaigns"
          value={String(overview.counts.activeCampaigns)}
          hint="Campaigns currently in motion across the release cycle."
          icon={RadioTower}
        />
        <StatCard
          label="Tasks due this week"
          value={String(overview.counts.tasksDueThisWeek)}
          hint="Open tasks with deadlines coming up before week close."
          icon={CalendarClock}
        />
        <StatCard
          label="Total fans"
          value={String(overview.counts.fans)}
          hint="Audience records currently saved in the CRM layer."
          icon={Users2}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent metric summary</CardTitle>
            <CardDescription>
              Snapshot trends are built from real metric rows and grouped into dashboard-ready signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview.chartData.length > 0 ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="Streams"
                    value={formatMetricValue(
                      "STREAMS",
                      overview.analyticsSummary?.latest.streams ?? 0
                    )}
                    hint={`${overview.analyticsSummary?.deltas.streams ?? 0}% vs prior snapshot`}
                  />
                  <StatCard
                    label="Followers"
                    value={formatMetricValue(
                      "FOLLOWERS",
                      overview.analyticsSummary?.latest.followers ?? 0
                    )}
                    hint={`${overview.analyticsSummary?.deltas.followers ?? 0}% vs prior snapshot`}
                  />
                  <StatCard
                    label="Engagement rate"
                    value={formatMetricValue(
                      "ENGAGEMENT_RATE",
                      overview.analyticsSummary?.latest.engagementRate ?? 0
                    )}
                    hint={`${overview.analyticsSummary?.deltas.engagementRate ?? 0}% vs prior snapshot`}
                  />
                  <StatCard
                    label="Revenue"
                    value={formatMetricValue(
                      "REVENUE_USD",
                      overview.analyticsSummary?.latest.revenueUsd ?? 0
                    )}
                    hint={`${overview.analyticsSummary?.deltas.revenueUsd ?? 0}% vs prior snapshot`}
                  />
                </div>
                <AnalyticsChart data={overview.chartData} />
              </>
            ) : (
              <EmptyState
                title="No metric snapshots yet"
                description="Add metric rows to start turning generic analytics into a dashboard timeline."
                action={
                  <Link
                    href="/analytics"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                  >
                    Open analytics
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        <UpcomingContentList items={overview.upcomingContentItems} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <RecentActivityFeed items={overview.recentActivity} />
        <Card>
          <CardHeader>
            <CardTitle>At a glance</CardTitle>
            <CardDescription>
              A compact view of the moving pieces most likely to affect the next release window.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Catalog records
              </p>
              <p className="mt-2 font-heading text-3xl font-semibold">
                {overview.counts.releases}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Non-archived releases currently shaping the workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Latest stream count
              </p>
              <p className="mt-2 font-heading text-3xl font-semibold">
                {formatCompactNumber(overview.analyticsSummary?.latest.streams ?? 0)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Most recent timeline point from your current primary analytics source.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Dashboard focus
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Keep the next release dated, the campaign active, the content queue visible,
                and this dashboard will stay honest about what matters most this week.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
