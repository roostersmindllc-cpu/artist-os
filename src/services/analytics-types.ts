import type { MetricImportColumnMapping } from "@/services/analytics-import";
import type {
  MetricNameValue,
  MetricSourceValue
} from "@/services/analytics-import";

export type AnalyticsMetricCardDto = {
  source: MetricSourceValue;
  metricName: MetricNameValue;
  label: string;
  value: number | null;
  recordedAt: Date | null;
  change: number | null;
};

export type AnalyticsSeriesSummaryDto = {
  latestValue: number | null;
  previousValue: number | null;
  change: number | null;
  highestValue: number | null;
  snapshotCount: number;
  lastRecordedAt: Date | null;
};

export type AnalyticsChartPointDto = {
  label: string;
  value: number;
  recordedAt: Date;
};

export type AnalyticsSnapshotRowDto = {
  id: string;
  source: MetricSourceValue;
  metricName: MetricNameValue;
  metricLabel: string;
  metricValue: number;
  recordedAt: Date;
  metadataPreview: string;
};

export type AnalyticsDashboardDto = {
  artistName: string;
  selectedSeriesLabel: string;
  selectedSeriesSummary: AnalyticsSeriesSummaryDto;
  selectedSeriesChart: AnalyticsChartPointDto[];
  selectedSeriesSnapshots: AnalyticsSnapshotRowDto[];
  trackedMetricCards: AnalyticsMetricCardDto[];
  csvTemplate: string;
};

export type MetricImportResultDto = {
  importedCount: number;
  mapping: MetricImportColumnMapping;
};
