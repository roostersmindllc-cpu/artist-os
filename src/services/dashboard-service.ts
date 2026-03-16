import { listRecentMetricSnapshotsByArtistProfileId } from "@/db/queries/analytics";
import {
  getDashboardCounts,
  getNextUpcomingReleaseByArtistProfileId,
  listRecentDashboardActivityRecordsByArtistProfileId,
  listUpcomingContentItemsForDashboardByArtistProfileId
} from "@/db/queries/dashboard";
import {
  buildAnalyticsChartData,
  buildAnalyticsSummary,
  buildAnalyticsTimeline
} from "@/services/analytics-helpers";
import { buildDashboardActivityFeed } from "@/services/dashboard-helpers";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";

export async function getDashboardOverview(userId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);

  const [counts, nextRelease, upcomingContentItems, metricSnapshots, activityRecords] =
    await Promise.all([
      getDashboardCounts(artistProfile.id),
      getNextUpcomingReleaseByArtistProfileId(artistProfile.id),
      listUpcomingContentItemsForDashboardByArtistProfileId(artistProfile.id, 5),
      listRecentMetricSnapshotsByArtistProfileId(artistProfile.id, 80),
      listRecentDashboardActivityRecordsByArtistProfileId(artistProfile.id, 4)
    ]);

  const timeline = buildAnalyticsTimeline([...metricSnapshots].reverse());
  const analyticsSummary = buildAnalyticsSummary(timeline);

  return {
    artistProfile,
    counts,
    nextRelease,
    upcomingContentItems,
    analyticsSummary,
    chartData: buildAnalyticsChartData(timeline),
    recentActivity: buildDashboardActivityFeed(
      [
        ...activityRecords.releases.map((release) => ({
          kind: "release" as const,
          id: release.id,
          title: release.title,
          status: release.status,
          createdAt: release.createdAt,
          updatedAt: release.updatedAt,
          href: "/releases" as const
        })),
        ...activityRecords.campaigns.map((campaign) => ({
          kind: "campaign" as const,
          id: campaign.id,
          title: campaign.name,
          status: campaign.status,
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
          href: "/campaigns" as const
        })),
        ...activityRecords.contentItems.map((contentItem) => ({
          kind: "content" as const,
          id: contentItem.id,
          title: contentItem.title,
          platform: contentItem.platform,
          dueDate: contentItem.dueDate,
          createdAt: contentItem.createdAt,
          updatedAt: contentItem.updatedAt,
          href: "/content" as const
        })),
        ...activityRecords.fans.map((fan) => ({
          kind: "fan" as const,
          id: fan.id,
          title: fan.name,
          handle: fan.handle,
          city: fan.city,
          createdAt: fan.createdAt,
          updatedAt: fan.updatedAt,
          href: "/fans" as const
        })),
        ...activityRecords.tasks.map((task) => ({
          kind: "task" as const,
          id: task.id,
          title: task.title,
          status: task.status,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          href: "/tasks" as const
        }))
      ],
      6
    )
  };
}
