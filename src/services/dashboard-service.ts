import { listRecentMetricSnapshotsByArtistProfileId } from "@/db/queries/analytics";
import {
  getDashboardCounts,
  getNextUpcomingReleaseByArtistProfileId,
  getNextUpcomingReleaseHealthSourceByArtistProfileId,
  listCampaignsRunningNowForDashboardByArtistProfileId,
  listRecentDashboardActivityRecordsByArtistProfileId,
  listReleasesWithinDaysForDashboardByArtistProfileId,
  listTasksDueTodayForDashboardByArtistProfileId,
  listUpcomingContentItemsForDashboardByArtistProfileId
} from "@/db/queries/dashboard";
import {
  buildDashboardActivityFeed,
  buildDashboardHeroChart,
  buildDashboardReleaseHealthInsight,
  buildDashboardPerformanceSnapshot
} from "@/services/dashboard-helpers";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";

export async function getDashboardOverview(userId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);

  const [
    counts,
    nextRelease,
    nextReleaseHealthSource,
    upcomingContentItems,
    tasksDueToday,
    campaignsRunningNow,
    releasesWithin30Days,
    metricSnapshots,
    activityRecords
  ] = await Promise.all([
    getDashboardCounts(artistProfile.id),
    getNextUpcomingReleaseByArtistProfileId(artistProfile.id),
    getNextUpcomingReleaseHealthSourceByArtistProfileId(artistProfile.id),
    listUpcomingContentItemsForDashboardByArtistProfileId(artistProfile.id, 4),
    listTasksDueTodayForDashboardByArtistProfileId(artistProfile.id, 4),
    listCampaignsRunningNowForDashboardByArtistProfileId(artistProfile.id, 4),
    listReleasesWithinDaysForDashboardByArtistProfileId(artistProfile.id, 30, 4),
    listRecentMetricSnapshotsByArtistProfileId(artistProfile.id, 200),
    listRecentDashboardActivityRecordsByArtistProfileId(artistProfile.id, 4)
  ]);

  return {
    artistProfile,
    counts,
    nextRelease,
    releaseHealthInsight: nextReleaseHealthSource
      ? buildDashboardReleaseHealthInsight(nextReleaseHealthSource)
      : null,
    upcomingContentItems,
    tasksDueToday,
    campaignsRunningNow,
    releasesWithin30Days,
    heroChart: buildDashboardHeroChart(metricSnapshots),
    performanceSnapshot: buildDashboardPerformanceSnapshot(metricSnapshots),
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
