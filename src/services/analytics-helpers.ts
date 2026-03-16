import { format } from "date-fns";

import { metricSourceLabels } from "@/lib/domain-config";
import { formatMetricValue } from "@/lib/utils";
import type {
  MetricNameValue,
  MetricSourceValue
} from "@/services/analytics-import";

export type MetricSnapshotRecord = {
  id?: string;
  source: MetricSourceValue;
  metricName: MetricNameValue;
  metricValue: number;
  recordedAt: Date;
  metadata?: unknown;
};

export type AnalyticsTimelinePoint = {
  source: MetricSourceValue;
  recordedAt: Date;
  label: string;
  streams: number;
  followers: number;
  engagementRate: number;
  revenueUsd: number;
};

const trackedMetricCombos = [
  { source: "SPOTIFY" as const, metricName: "STREAMS" as const },
  { source: "YOUTUBE" as const, metricName: "STREAMS" as const },
  { source: "TIKTOK" as const, metricName: "STREAMS" as const },
  { source: "INSTAGRAM" as const, metricName: "FOLLOWERS" as const },
  { source: "MAILING_LIST" as const, metricName: "EMAIL_SUBSCRIBERS" as const }
] as const;

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function getMetricDisplayLabel(
  source: MetricSourceValue,
  metricName: MetricNameValue
) {
  if ((source === "YOUTUBE" || source === "TIKTOK") && metricName === "STREAMS") {
    return "Views";
  }

  switch (metricName) {
    case "STREAMS":
      return "Streams";
    case "FOLLOWERS":
      return "Followers";
    case "ENGAGEMENT_RATE":
      return "Engagement rate";
    case "REVENUE_USD":
      return "Revenue (USD)";
    case "PRE_SAVES":
      return "Pre-saves";
    case "TICKET_SALES":
      return "Ticket sales";
    case "EMAIL_SUBSCRIBERS":
      return "Email subscribers";
    default:
      return metricName;
  }
}

export function getMetricSeriesLabel(
  source: MetricSourceValue,
  metricName: MetricNameValue
) {
  return `${metricSourceLabels[source]} ${getMetricDisplayLabel(source, metricName).toLowerCase()}`;
}

export function buildMetricSeriesChartData(snapshots: MetricSnapshotRecord[]) {
  return [...snapshots]
    .sort(
      (left, right) =>
        new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime()
    )
    .map((snapshot) => ({
      label: format(new Date(snapshot.recordedAt), "MMM d"),
      value: snapshot.metricValue,
      recordedAt: new Date(snapshot.recordedAt)
    }));
}

export function buildMetricSeriesSummary(snapshots: MetricSnapshotRecord[]) {
  if (snapshots.length === 0) {
    return {
      latestValue: null,
      previousValue: null,
      change: null,
      highestValue: null,
      snapshotCount: 0,
      lastRecordedAt: null
    };
  }

  const orderedSnapshots = [...snapshots].sort(
    (left, right) =>
      new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime()
  );
  const latest = orderedSnapshots.at(-1) ?? null;
  const previous = orderedSnapshots.at(-2) ?? null;

  return {
    latestValue: latest?.metricValue ?? null,
    previousValue: previous?.metricValue ?? null,
    change:
      latest && previous
        ? calculatePercentageChange(latest.metricValue, previous.metricValue)
        : null,
    highestValue: Math.max(...orderedSnapshots.map((snapshot) => snapshot.metricValue)),
    snapshotCount: orderedSnapshots.length,
    lastRecordedAt: latest?.recordedAt ?? null
  };
}

export function summarizeMetricMetadata(metadata: unknown) {
  if (!metadata) {
    return "None";
  }

  if (typeof metadata === "string") {
    return metadata;
  }

  if (typeof metadata === "object") {
    const entries = Object.entries(metadata as Record<string, unknown>).slice(0, 2);

    if (entries.length === 0) {
      return "None";
    }

    return entries
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(" | ");
  }

  return String(metadata);
}

export function buildTrackedMetricCards(snapshots: MetricSnapshotRecord[]) {
  const orderedSnapshots = [...snapshots].sort(
    (left, right) =>
      new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime()
  );

  return trackedMetricCombos.map(({ source, metricName }) => {
    const matchingSnapshots = orderedSnapshots.filter(
      (snapshot) => snapshot.source === source && snapshot.metricName === metricName
    );
    const latest = matchingSnapshots[0] ?? null;
    const previous = matchingSnapshots[1] ?? null;

    return {
      source,
      metricName,
      label: getMetricSeriesLabel(source, metricName),
      value: latest?.metricValue ?? null,
      recordedAt: latest?.recordedAt ?? null,
      change:
        latest && previous
          ? calculatePercentageChange(latest.metricValue, previous.metricValue)
          : null
    };
  });
}

export function formatTrackedMetricHint(
  source: MetricSourceValue,
  metricName: MetricNameValue,
  value: number | null
) {
  if (value === null) {
    return `No ${getMetricDisplayLabel(source, metricName).toLowerCase()} snapshots tracked yet.`;
  }

  return formatMetricValue(metricName, value);
}

export function buildAnalyticsTimeline(
  snapshots: MetricSnapshotRecord[],
  preferredSource: MetricSourceValue = "SPOTIFY"
) {
  if (snapshots.length === 0) {
    return [];
  }

  const availableSources = [...new Set(snapshots.map((snapshot) => snapshot.source))];
  const selectedSource = availableSources.includes(preferredSource)
    ? preferredSource
    : availableSources[0];

  const timelineMap = new Map<string, AnalyticsTimelinePoint>();

  for (const snapshot of snapshots) {
    if (snapshot.source !== selectedSource) {
      continue;
    }

    const dateKey = new Date(snapshot.recordedAt).toISOString();
    const existingPoint = timelineMap.get(dateKey) ?? {
      source: snapshot.source,
      recordedAt: new Date(snapshot.recordedAt),
      label: format(new Date(snapshot.recordedAt), "MMM d"),
      streams: 0,
      followers: 0,
      engagementRate: 0,
      revenueUsd: 0
    };

    switch (snapshot.metricName) {
      case "STREAMS":
        existingPoint.streams = snapshot.metricValue;
        break;
      case "FOLLOWERS":
        existingPoint.followers = snapshot.metricValue;
        break;
      case "ENGAGEMENT_RATE":
        existingPoint.engagementRate = snapshot.metricValue;
        break;
      case "REVENUE_USD":
        existingPoint.revenueUsd = snapshot.metricValue;
        break;
      default:
        break;
    }

    timelineMap.set(dateKey, existingPoint);
  }

  return [...timelineMap.values()].sort(
    (left, right) =>
      new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime()
  );
}

export function buildAnalyticsSummary(points: AnalyticsTimelinePoint[]) {
  if (points.length === 0) {
    return null;
  }

  const latest = points.at(-1);
  const previous = points.at(-2);

  if (!latest) {
    return null;
  }

  return {
    latest,
    deltas: {
      streams: calculatePercentageChange(latest.streams, previous?.streams ?? 0),
      followers: calculatePercentageChange(latest.followers, previous?.followers ?? 0),
      engagementRate: calculatePercentageChange(
        latest.engagementRate,
        previous?.engagementRate ?? 0
      ),
      revenueUsd: calculatePercentageChange(
        latest.revenueUsd,
        previous?.revenueUsd ?? 0
      )
    }
  };
}

export function buildAnalyticsChartData(points: AnalyticsTimelinePoint[]) {
  return points.map((point) => ({
    label: point.label,
    streams: point.streams,
    followers: point.followers,
    engagementRate: point.engagementRate,
    revenueUsd: point.revenueUsd
  }));
}
