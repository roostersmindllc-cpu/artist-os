import { CampaignsRunningNowList } from "@/components/dashboard/campaigns-running-now-list";
import { PerformanceSnapshot } from "@/components/dashboard/performance-snapshot";
import { QuickAddActions } from "@/components/dashboard/quick-add-actions";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { ReleaseHealthScoreCard } from "@/components/dashboard/release-health-score-card";
import { ReleasesWithinWindowList } from "@/components/dashboard/releases-within-window-list";
import { TasksDueTodayList } from "@/components/dashboard/tasks-due-today-list";
import { TodayHeartbeat } from "@/components/dashboard/today-heartbeat";
import { UpcomingContentList } from "@/components/dashboard/upcoming-content-list";
import { PageContainer } from "@/components/shared/page-container";
import { requireUser } from "@/lib/auth";
import { getDashboardOverview } from "@/services/dashboard-service";

export default async function DashboardPage() {
  const user = await requireUser();
  const overview = await getDashboardOverview(user.id);

  return (
    <PageContainer
      title={`Welcome back, ${overview.artistProfile.artistName}`}
      description="The product heartbeat for today: what needs attention across content, campaigns, releases, and performance."
      eyebrow="Artist workspace"
      actions={<QuickAddActions />}
    >
      <TodayHeartbeat
        artistName={overview.artistProfile.artistName}
        counts={overview.counts}
        nextRelease={overview.nextRelease}
      />

      <section>
        <ReleaseHealthScoreCard insight={overview.releaseHealthInsight} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <UpcomingContentList
          totalCount={overview.counts.upcomingContent}
          items={overview.upcomingContentItems}
        />
        <TasksDueTodayList
          totalCount={overview.counts.tasksDueToday}
          items={overview.tasksDueToday}
        />
        <CampaignsRunningNowList
          totalCount={overview.counts.campaignsRunningNow}
          items={overview.campaignsRunningNow}
        />
        <ReleasesWithinWindowList
          totalCount={overview.counts.releasesWithin30Days}
          items={overview.releasesWithin30Days}
        />
      </section>

      <PerformanceSnapshot items={overview.performanceSnapshot} />

      <section>
        <RecentActivityFeed items={overview.recentActivity} />
      </section>
    </PageContainer>
  );
}
