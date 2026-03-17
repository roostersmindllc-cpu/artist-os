import { type Prisma } from "@prisma/client";

import {
  createMetricSnapshot,
  listMetricSnapshotsByArtistProfileId,
  listRecentMetricSnapshotsByArtistProfileId,
  saveMetricSnapshots
} from "@/db/queries/analytics";
import {
  analyticsFiltersSchema,
  analyticsFormSchema,
  normalizeAnalyticsFilters,
  normalizeAnalyticsInput,
  type AnalyticsFormValues
} from "@/lib/validations/analytics";
import { UserFacingError } from "@/lib/errors";
import {
  buildAnalyticsChartData,
  buildAnalyticsSummary,
  buildAnalyticsTimeline,
  buildMetricSeriesChartData,
  buildMetricSeriesSummary,
  buildTrackedMetricCards,
  getMetricDisplayLabel,
  getMetricSeriesLabel,
  summarizeMetricMetadata
} from "@/services/analytics-helpers";
import {
  analyticsCsvTemplateExample,
  metricImportSubmissionSchema,
  previewMetricCsvImport
} from "@/services/analytics-import";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";
import type {
  AnalyticsDashboardDto,
  MetricImportResultDto
} from "@/services/analytics-types";

export async function getMetricSnapshotsForUser(userId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  return listMetricSnapshotsByArtistProfileId(artistProfile.id);
}

export async function getAnalyticsDashboardForUser(
  userId: string,
  filters: Parameters<typeof normalizeAnalyticsFilters>[0]
): Promise<AnalyticsDashboardDto> {
  const parsedFilters = analyticsFiltersSchema.parse(filters);
  const normalizedFilters = normalizeAnalyticsFilters(parsedFilters);
  const artistProfile = await requireArtistProfileForUser(userId);
  const [selectedSeriesSnapshots, recentSnapshots] = await Promise.all([
    listMetricSnapshotsByArtistProfileId(artistProfile.id, {
      source: normalizedFilters.source,
      metricName: normalizedFilters.metricName,
      from: normalizedFilters.fromDate,
      to: normalizedFilters.toDate,
      limit: 400
    }),
    listRecentMetricSnapshotsByArtistProfileId(artistProfile.id, 300)
  ]);

  return {
    artistName: artistProfile.artistName,
    selectedSeriesLabel: getMetricSeriesLabel(
      normalizedFilters.source,
      normalizedFilters.metricName
    ),
    selectedSeriesSummary: buildMetricSeriesSummary(selectedSeriesSnapshots),
    selectedSeriesChart: buildMetricSeriesChartData(selectedSeriesSnapshots),
    selectedSeriesSnapshots: selectedSeriesSnapshots.map((snapshot) => ({
      id: snapshot.id,
      source: snapshot.source,
      metricName: snapshot.metricName,
      metricLabel: getMetricDisplayLabel(snapshot.source, snapshot.metricName),
      metricValue: snapshot.metricValue,
      recordedAt: snapshot.recordedAt,
      metadataPreview: summarizeMetricMetadata(snapshot.metadata)
    })),
    trackedMetricCards: buildTrackedMetricCards(recentSnapshots),
    csvTemplate: analyticsCsvTemplateExample
  };
}

export async function getAnalyticsOverviewForUser(userId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const metricSnapshots = await listRecentMetricSnapshotsByArtistProfileId(
    artistProfile.id,
    80
  );
  const orderedMetricSnapshots = [...metricSnapshots].reverse();
  const timeline = buildAnalyticsTimeline(orderedMetricSnapshots);

  return {
    metricSnapshots,
    timeline,
    summary: buildAnalyticsSummary(timeline),
    chartData: buildAnalyticsChartData(timeline)
  };
}

export async function createMetricSnapshotForUser(
  userId: string,
  values: AnalyticsFormValues
) {
  const parsed = analyticsFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  return createMetricSnapshot(
    artistProfile.id,
    normalizeAnalyticsInput(parsed) as Parameters<typeof createMetricSnapshot>[1]
  );
}

export async function importMetricSnapshotsForUser(
  userId: string,
  input: unknown
): Promise<MetricImportResultDto> {
  const parsed = metricImportSubmissionSchema.parse(input);
  const preview = previewMetricCsvImport(parsed.csvText, parsed.mapping);

  if (preview.errors.length > 0) {
    const firstErrors = preview.errors
      .slice(0, 3)
      .map((error) => `Row ${error.rowNumber}: ${error.message}`)
      .join(" ");

    throw new UserFacingError(`CSV import failed. ${firstErrors}`);
  }

  if (preview.validRows.length === 0) {
    throw new UserFacingError("CSV import failed. No valid metric rows were found.");
  }

  const artistProfile = await requireArtistProfileForUser(userId);
  await saveMetricSnapshots(
    artistProfile.id,
    preview.validRows.map((row) => ({
      source: row.source,
      metricName: row.metricName,
      metricValue: row.metricValue,
      recordedAt: row.recordedAt,
      metadata: row.metadata as Prisma.InputJsonValue | null
    }))
  );

  return {
    importedCount: preview.validRows.length,
    mapping: preview.mapping
  };
}
