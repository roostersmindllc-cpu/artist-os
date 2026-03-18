import type { Route } from "next";
import type {
  CampaignStatus,
  ContentStatus,
  ContentPlatform,
  MetricName,
  MetricSource,
  ReleaseType,
  ReleaseStatus,
  TaskStatus
} from "@prisma/client";
import {
  differenceInCalendarDays,
  endOfDay,
  format,
  startOfDay,
  subDays
} from "date-fns";

import {
  campaignStatusLabels,
  contentPlatformLabels,
  metricSourceLabels,
  releaseStatusLabels,
  taskStatusLabels
} from "@/lib/domain-config";
import { calculatePercentageChange } from "@/services/analytics-helpers";
import { getReleaseRoute } from "@/services/releases-helpers";

type DashboardActivityRecord =
  | {
      kind: "release";
      id: string;
      title: string;
      status: ReleaseStatus;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "campaign";
      id: string;
      title: string;
      status: CampaignStatus;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "content";
      id: string;
      title: string;
      platform: ContentPlatform;
      dueDate: Date;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "fan";
      id: string;
      title: string;
      handle: string | null;
      city: string | null;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "task";
      id: string;
      title: string;
      status: TaskStatus;
      dueDate: Date | null;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    };

export type DashboardActivityItem = {
  id: string;
  kind: DashboardActivityRecord["kind"];
  title: string;
  typeLabel: string;
  actionLabel: string;
  detail: string;
  occurredAt: Date;
  href: Route;
};

type DashboardMetricSnapshot = {
  source: MetricSource;
  metricName: MetricName;
  metricValue: number;
  recordedAt: Date;
};

type DashboardPerformanceMetricName = "STREAMS" | "FOLLOWERS" | "ENGAGEMENT_RATE";

export type DashboardPerformanceItem = {
  key: "streamsLast7Days" | "followerGrowth" | "campaignEngagement";
  label: string;
  metricName: DashboardPerformanceMetricName;
  value: number | null;
  change: number | null;
  source: MetricSource | null;
  sourceLabel: string | null;
  recordedAt: Date | null;
};

export type DashboardHeroChartPoint = {
  label: string;
  value: number;
  recordedAt: Date;
};

export type DashboardHeroChart = {
  label: string;
  metricName: DashboardPerformanceMetricName;
  source: MetricSource | null;
  sourceLabel: string | null;
  latestValue: number | null;
  change: number | null;
  recordedAt: Date | null;
  points: DashboardHeroChartPoint[];
};

type DashboardReleaseHealthSource = {
  id: string;
  title: string;
  slug: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: Date | null;
  distributor: string | null;
  coverArtUrl: string | null;
  campaigns: Array<{
    id: string;
    status: CampaignStatus;
  }>;
  contentItems: Array<{
    id: string;
    status: ContentStatus;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: TaskStatus;
  }>;
};

type DashboardReleaseHealthChecklistItemStatus = "complete" | "warning";

export type DashboardReleaseHealthChecklistItem = {
  key: "coverArt" | "campaign" | "playlist" | "scheduledPosts";
  label: string;
  detail: string;
  status: DashboardReleaseHealthChecklistItemStatus;
  href: Route;
};

export type DashboardReleaseHealthInsight = {
  releaseId: string;
  releaseTitle: string;
  releaseType: ReleaseType;
  releaseDate: Date | null;
  score: number;
  scoreLabel: string;
  summary: string;
  releaseHref: Route;
  primaryAction: {
    label: string;
    href: Route;
  } | null;
  checklist: DashboardReleaseHealthChecklistItem[];
};

const dashboardPerformanceConfigs = [
  {
    key: "streamsLast7Days",
    label: "Streams last 7 days",
    metricName: "STREAMS"
  },
  {
    key: "followerGrowth",
    label: "Follower growth",
    metricName: "FOLLOWERS"
  },
  {
    key: "campaignEngagement",
    label: "Campaign engagement",
    metricName: "ENGAGEMENT_RATE"
  }
] as const;

const releaseHealthWeights = {
  coverArt: 25,
  campaign: 20,
  playlist: 25,
  scheduledPosts: 30
} as const;

function sortSnapshotsAscending(snapshots: DashboardMetricSnapshot[]) {
  return [...snapshots].sort(
    (left, right) =>
      new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime()
  );
}

function getLastSnapshotOnOrBefore(
  snapshots: DashboardMetricSnapshot[],
  targetDate: Date
) {
  return [...snapshots]
    .filter(
      (snapshot) => new Date(snapshot.recordedAt).getTime() <= targetDate.getTime()
    )
    .at(-1) ?? null;
}

function getSnapshotsWithinRange(
  snapshots: DashboardMetricSnapshot[],
  startDate: Date,
  endDate: Date
) {
  return snapshots.filter((snapshot) => {
    const recordedAt = new Date(snapshot.recordedAt).getTime();

    return recordedAt >= startDate.getTime() && recordedAt <= endDate.getTime();
  });
}

function calculateAverageMetricValue(snapshots: DashboardMetricSnapshot[]) {
  if (snapshots.length === 0) {
    return null;
  }

  const total = snapshots.reduce((sum, snapshot) => sum + snapshot.metricValue, 0);

  return Number((total / snapshots.length).toFixed(1));
}

function calculateCumulativeWindowValue(
  snapshots: DashboardMetricSnapshot[],
  startDate: Date,
  endDate: Date
) {
  const orderedSnapshots = sortSnapshotsAscending(snapshots);
  const windowSnapshots = getSnapshotsWithinRange(orderedSnapshots, startDate, endDate);
  const latestWindowSnapshot =
    getLastSnapshotOnOrBefore(orderedSnapshots, endDate) ??
    windowSnapshots.at(-1) ??
    null;

  if (!latestWindowSnapshot) {
    return null;
  }

  const baselineSnapshot =
    getLastSnapshotOnOrBefore(orderedSnapshots, startDate) ??
    windowSnapshots[0] ??
    null;

  if (
    !baselineSnapshot ||
    latestWindowSnapshot.recordedAt.getTime() === baselineSnapshot.recordedAt.getTime()
  ) {
    return null;
  }

  return Number(
    (latestWindowSnapshot.metricValue - baselineSnapshot.metricValue).toFixed(1)
  );
}

function buildCumulativePerformanceItem(
  snapshots: DashboardMetricSnapshot[],
  config: (typeof dashboardPerformanceConfigs)[number]
) {
  const orderedSnapshots = sortSnapshotsAscending(snapshots);
  const latestSnapshot = orderedSnapshots.at(-1) ?? null;

  if (!latestSnapshot) {
    return {
      key: config.key,
      label: config.label,
      metricName: config.metricName,
      value: null,
      change: null,
      source: null,
      sourceLabel: null,
      recordedAt: null
    } satisfies DashboardPerformanceItem;
  }

  const windowEnd = endOfDay(new Date(latestSnapshot.recordedAt));
  const currentWindowStart = startOfDay(subDays(windowEnd, 6));
  const previousWindowEnd = new Date(currentWindowStart.getTime() - 1);
  const previousWindowStart = startOfDay(subDays(currentWindowStart, 7));
  const currentValue = calculateCumulativeWindowValue(
    orderedSnapshots,
    currentWindowStart,
    windowEnd
  );
  const previousValue = calculateCumulativeWindowValue(
    orderedSnapshots,
    previousWindowStart,
    previousWindowEnd
  );

  return {
    key: config.key,
    label: config.label,
    metricName: config.metricName,
    value: currentValue,
    change:
      currentValue !== null && previousValue !== null
        ? calculatePercentageChange(currentValue, previousValue)
        : null,
    source: latestSnapshot.source,
    sourceLabel: metricSourceLabels[latestSnapshot.source],
    recordedAt: latestSnapshot.recordedAt
  } satisfies DashboardPerformanceItem;
}

function buildRatePerformanceItem(
  snapshots: DashboardMetricSnapshot[],
  config: (typeof dashboardPerformanceConfigs)[number]
) {
  const orderedSnapshots = sortSnapshotsAscending(snapshots);
  const latestSnapshot = orderedSnapshots.at(-1) ?? null;

  if (!latestSnapshot) {
    return {
      key: config.key,
      label: config.label,
      metricName: config.metricName,
      value: null,
      change: null,
      source: null,
      sourceLabel: null,
      recordedAt: null
    } satisfies DashboardPerformanceItem;
  }

  const windowEnd = endOfDay(new Date(latestSnapshot.recordedAt));
  const currentWindowStart = startOfDay(subDays(windowEnd, 6));
  const previousWindowEnd = new Date(currentWindowStart.getTime() - 1);
  const previousWindowStart = startOfDay(subDays(currentWindowStart, 7));
  const currentValue = calculateAverageMetricValue(
    getSnapshotsWithinRange(orderedSnapshots, currentWindowStart, windowEnd)
  );
  const previousValue = calculateAverageMetricValue(
    getSnapshotsWithinRange(orderedSnapshots, previousWindowStart, previousWindowEnd)
  );

  return {
    key: config.key,
    label: config.label,
    metricName: config.metricName,
    value: currentValue,
    change:
      currentValue !== null && previousValue !== null
        ? calculatePercentageChange(currentValue, previousValue)
        : null,
    source: latestSnapshot.source,
    sourceLabel: metricSourceLabels[latestSnapshot.source],
    recordedAt: latestSnapshot.recordedAt
  } satisfies DashboardPerformanceItem;
}

function selectPrimaryMetricSeries(
  snapshots: DashboardMetricSnapshot[],
  metricName: DashboardPerformanceMetricName
) {
  const seriesMap = new Map<MetricSource, DashboardMetricSnapshot[]>();

  for (const snapshot of snapshots) {
    if (snapshot.metricName !== metricName) {
      continue;
    }

    const sourceSnapshots = seriesMap.get(snapshot.source) ?? [];
    sourceSnapshots.push(snapshot);
    seriesMap.set(snapshot.source, sourceSnapshots);
  }

  return [...seriesMap.entries()]
    .map(([source, sourceSnapshots]) => ({
      source,
      snapshots: sortSnapshotsAscending(sourceSnapshots)
    }))
    .sort((left, right) => {
      const leftLatest = left.snapshots.at(-1)?.recordedAt.getTime() ?? 0;
      const rightLatest = right.snapshots.at(-1)?.recordedAt.getTime() ?? 0;

      if (rightLatest !== leftLatest) {
        return rightLatest - leftLatest;
      }

      return right.snapshots.length - left.snapshots.length;
    })[0] ?? null;
}

export function buildDashboardPerformanceSnapshot(
  snapshots: DashboardMetricSnapshot[]
) {
  return dashboardPerformanceConfigs.map((config) => {
    const primarySeries = selectPrimaryMetricSeries(snapshots, config.metricName);

    if (!primarySeries) {
      return {
        key: config.key,
        label: config.label,
        metricName: config.metricName,
        value: null,
        change: null,
        source: null,
        sourceLabel: null,
        recordedAt: null
      } satisfies DashboardPerformanceItem;
    }

    return config.metricName === "ENGAGEMENT_RATE"
      ? buildRatePerformanceItem(primarySeries.snapshots, config)
      : buildCumulativePerformanceItem(primarySeries.snapshots, config);
  });
}

const dashboardHeroMetricConfigs = [
  {
    metricName: "STREAMS",
    label: "Streams"
  },
  {
    metricName: "FOLLOWERS",
    label: "Followers"
  },
  {
    metricName: "ENGAGEMENT_RATE",
    label: "Engagement"
  }
] as const;

export function buildDashboardHeroChart(
  snapshots: DashboardMetricSnapshot[]
): DashboardHeroChart {
  for (const config of dashboardHeroMetricConfigs) {
    const primarySeries = selectPrimaryMetricSeries(snapshots, config.metricName);

    if (!primarySeries) {
      continue;
    }

    const latestSnapshot = primarySeries.snapshots.at(-1) ?? null;
    const previousSnapshot =
      primarySeries.snapshots.length > 1
        ? primarySeries.snapshots.at(-2) ?? null
        : null;

    return {
      label: config.label,
      metricName: config.metricName,
      source: primarySeries.source,
      sourceLabel: metricSourceLabels[primarySeries.source],
      latestValue: latestSnapshot?.metricValue ?? null,
      change:
        latestSnapshot && previousSnapshot
          ? calculatePercentageChange(
              latestSnapshot.metricValue,
              previousSnapshot.metricValue
            )
          : null,
      recordedAt: latestSnapshot?.recordedAt ?? null,
      points: primarySeries.snapshots.slice(-8).map((snapshot) => ({
        label: format(snapshot.recordedAt, "MMM d"),
        value: snapshot.metricValue,
        recordedAt: snapshot.recordedAt
      }))
    };
  }

  return {
    label: "Streams",
    metricName: "STREAMS",
    source: null,
    sourceLabel: null,
    latestValue: null,
    change: null,
    recordedAt: null,
    points: []
  };
}

function getReleaseHealthScoreLabel(score: number) {
  if (score >= 85) {
    return "Launch-ready";
  }

  if (score >= 70) {
    return "Healthy runway";
  }

  if (score >= 50) {
    return "Needs attention";
  }

  return "At risk";
}

function getScheduledPostsTarget(releaseDate: Date | null, today: Date) {
  if (!releaseDate) {
    return 3;
  }

  const daysUntilRelease = differenceInCalendarDays(
    startOfDay(releaseDate),
    startOfDay(today)
  );

  if (daysUntilRelease <= 14) {
    return 4;
  }

  if (daysUntilRelease <= 30) {
    return 3;
  }

  return 2;
}

function pluralizeReleaseHealthItem(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getPlaylistTask(tasks: DashboardReleaseHealthSource["tasks"]) {
  return tasks.find((task) => /playlist/i.test(task.title)) ?? null;
}

function buildReleaseHealthSummary(
  improvementLabels: string[]
) {
  if (improvementLabels.length === 0) {
    return "This release looks launch-ready. Keep executing the plan and monitor launch-week performance.";
  }

  if (improvementLabels.length === 1) {
    return `Raise this score by ${improvementLabels[0]}.`;
  }

  return `Raise this score by ${improvementLabels[0]} and ${improvementLabels[1]}.`;
}

export function buildDashboardReleaseHealthInsight(
  source: DashboardReleaseHealthSource,
  today = new Date()
): DashboardReleaseHealthInsight {
  const releaseHref = getReleaseRoute(source.id);
  const hasCoverArt = Boolean(source.coverArtUrl);
  const hasCampaign = source.campaigns.length > 0;
  const playlistTask = getPlaylistTask(source.tasks);
  const scheduledPostsCount = source.contentItems.filter(
    (item) => item.status === "SCHEDULED" || item.status === "PUBLISHED"
  ).length;
  const scheduledPostsTarget = getScheduledPostsTarget(source.releaseDate, today);
  const scheduledPostsPoints = Math.round(
    Math.min(scheduledPostsCount / scheduledPostsTarget, 1) *
      releaseHealthWeights.scheduledPosts
  );

  const playlistPoints =
    playlistTask?.status === "DONE"
      ? releaseHealthWeights.playlist
      : playlistTask?.status === "IN_PROGRESS"
        ? 16
        : playlistTask
          ? 8
          : 0;

  const checklist = [
    {
      key: "coverArt",
      label: hasCoverArt ? "Cover art uploaded" : "No cover art uploaded",
      detail: hasCoverArt
        ? "The release artwork is already attached to the catalog record."
        : "Upload artwork so the release looks real across the catalog and rollout surfaces.",
      status: hasCoverArt ? "complete" : "warning",
      href: releaseHref
    },
    {
      key: "campaign",
      label: hasCampaign ? "Campaign created" : "No campaign created yet",
      detail: hasCampaign
        ? `${pluralizeReleaseHealthItem(source.campaigns.length, "linked campaign")} already support this release.`
        : "Link a campaign so the release has an active rollout plan behind it.",
      status: hasCampaign ? "complete" : "warning",
      href: hasCampaign ? ("/campaigns" as const) : releaseHref
    },
    {
      key: "playlist",
      label:
        playlistTask?.status === "DONE"
          ? "Playlist submissions finished"
          : playlistTask?.status === "IN_PROGRESS"
            ? "Playlist submissions in progress"
            : playlistTask
              ? "Playlist submissions not finished"
              : "No playlist submission task yet",
      detail:
        playlistTask?.status === "DONE"
          ? "Playlist outreach is already marked complete for this release."
          : playlistTask?.status === "IN_PROGRESS"
            ? "Keep playlist outreach moving before release week closes in."
            : "Finish playlist outreach to improve launch-day discovery.",
      status: playlistTask?.status === "DONE" ? "complete" : "warning",
      href: "/tasks" as const
    },
    {
      key: "scheduledPosts",
      label:
        scheduledPostsCount >= scheduledPostsTarget
          ? `${pluralizeReleaseHealthItem(scheduledPostsCount, "post")} scheduled`
          : scheduledPostsCount === 0
            ? "No posts scheduled"
            : `Only ${pluralizeReleaseHealthItem(scheduledPostsCount, "post")} scheduled`,
      detail:
        scheduledPostsCount >= scheduledPostsTarget
          ? `The release already has enough scheduled posts for this stage of the runway.`
          : `Target ${scheduledPostsTarget} scheduled posts at this stage. Add ${scheduledPostsTarget - scheduledPostsCount} more ${scheduledPostsTarget - scheduledPostsCount === 1 ? "post" : "posts"} to strengthen the rollout.`,
      status: scheduledPostsCount >= scheduledPostsTarget ? "complete" : "warning",
      href: "/content" as const
    }
  ] satisfies DashboardReleaseHealthChecklistItem[];

  const improvementLabels = checklist
    .filter((item) => item.status === "warning")
    .map((item) => {
      switch (item.key) {
        case "coverArt":
          return "uploading cover art";
        case "campaign":
          return "linking a campaign";
        case "playlist":
          return "finishing playlist submissions";
        case "scheduledPosts":
          return `scheduling ${Math.max(scheduledPostsTarget - scheduledPostsCount, 1)} more ${Math.max(scheduledPostsTarget - scheduledPostsCount, 1) === 1 ? "post" : "posts"}`;
        default:
          return "closing the remaining gaps";
      }
    });

  const score =
    (hasCoverArt ? releaseHealthWeights.coverArt : 0) +
    (hasCampaign ? releaseHealthWeights.campaign : 0) +
    playlistPoints +
    scheduledPostsPoints;
  const primaryAction = checklist.find((item) => item.status === "warning");

  return {
    releaseId: source.id,
    releaseTitle: source.title,
    releaseType: source.type,
    releaseDate: source.releaseDate,
    score,
    scoreLabel: getReleaseHealthScoreLabel(score),
    summary: buildReleaseHealthSummary(improvementLabels),
    releaseHref,
    primaryAction: primaryAction
      ? {
          label:
            primaryAction.key === "scheduledPosts"
              ? "Schedule more posts"
              : primaryAction.key === "playlist"
                ? "Finish playlist submissions"
                : primaryAction.key === "campaign"
                  ? "Create or review campaign"
                  : "Upload cover art",
          href: primaryAction.href
        }
      : null,
    checklist
  };
}

export function getDashboardActivityActionLabel(
  createdAt: Date,
  updatedAt: Date
) {
  return updatedAt.getTime() > createdAt.getTime() ? "Updated" : "Created";
}

function getDashboardActivityDetail(record: DashboardActivityRecord) {
  switch (record.kind) {
    case "release":
      return releaseStatusLabels[record.status];
    case "campaign":
      return campaignStatusLabels[record.status];
    case "content":
      return `${contentPlatformLabels[record.platform]} scheduled`;
    case "fan":
      return record.city ?? record.handle ?? "Audience CRM";
    case "task":
      return record.dueDate
        ? `${taskStatusLabels[record.status]} - due soon`
        : taskStatusLabels[record.status];
    default:
      return "";
  }
}

function getDashboardActivityTypeLabel(kind: DashboardActivityRecord["kind"]) {
  switch (kind) {
    case "release":
      return "Release";
    case "campaign":
      return "Campaign";
    case "content":
      return "Content";
    case "fan":
      return "Fan";
    case "task":
      return "Task";
    default:
      return "Activity";
  }
}

export function buildDashboardActivityFeed(
  records: DashboardActivityRecord[],
  limit = 6
) {
  return records
    .map<DashboardActivityItem>((record) => ({
      id: record.id,
      kind: record.kind,
      title: record.title,
      typeLabel: getDashboardActivityTypeLabel(record.kind),
      actionLabel: getDashboardActivityActionLabel(record.createdAt, record.updatedAt),
      detail: getDashboardActivityDetail(record),
      occurredAt: record.updatedAt,
      href: record.href
    }))
    .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
    .slice(0, limit);
}
