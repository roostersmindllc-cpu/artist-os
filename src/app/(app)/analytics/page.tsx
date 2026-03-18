import { BarChart3, CalendarClock, LineChart, Waves } from "lucide-react";

import { AnalyticsFilters } from "@/components/analytics/analytics-filters";
import { AnalyticsImportPanel } from "@/components/analytics/analytics-import-panel";
import { MetricLineChart } from "@/components/charts/metric-line-chart";
import { AnalyticsForm } from "@/components/forms/analytics-form";
import { DataTableCard } from "@/components/shared/data-table-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { StatCard } from "@/components/shared/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { requireOnboardedUser } from "@/lib/route-access";
import { metricSourceLabels } from "@/lib/domain-config";
import {
  analyticsFiltersSchema,
  normalizeAnalyticsFilters
} from "@/lib/validations/analytics";
import { cn, formatDate, formatMetricValue } from "@/lib/utils";
import {
  formatTrackedMetricHint,
  getMetricDisplayLabel
} from "@/services/analytics-helpers";
import { getAnalyticsDashboardForUser } from "@/services/analytics-service";

type AnalyticsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const { user } = await requireOnboardedUser();
  const params = await searchParams;
  const parsedFilters = analyticsFiltersSchema.safeParse({
    source: typeof params.source === "string" ? params.source : undefined,
    metricName: typeof params.metricName === "string" ? params.metricName : undefined,
    from: typeof params.from === "string" ? params.from : "",
    to: typeof params.to === "string" ? params.to : ""
  });
  const filters = normalizeAnalyticsFilters(
    parsedFilters.success ? parsedFilters.data : {}
  );
  const overview = await getAnalyticsDashboardForUser(user.id, filters);
  const selectedMetricLabel = getMetricDisplayLabel(filters.source, filters.metricName);

  return (
    <PageContainer
      title="Analytics"
      description="Track normalized metric snapshots over time, import CSV exports from Spotify for Artists, YouTube, and TikTok, and keep charts current automatically."
      eyebrow="Performance tracking"
      actions={
        <a href="#analytics-entry" className={cn(buttonVariants(), "rounded-full px-5")}>
          Log analytics
        </a>
      }
    >
      <AnalyticsFilters filters={filters} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {overview.trackedMetricCards.map((card) => (
          <StatCard
            key={`${card.source}-${card.metricName}`}
            label={card.label}
            value={
              card.value === null ? "--" : formatMetricValue(card.metricName, card.value)
            }
            hint={
              card.recordedAt
                ? `${formatTrackedMetricHint(
                    card.source,
                    card.metricName,
                    card.value
                  )} as of ${formatDate(card.recordedAt)}`
                : formatTrackedMetricHint(card.source, card.metricName, card.value)
            }
          />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={`Latest ${selectedMetricLabel.toLowerCase()}`}
          value={
            overview.selectedSeriesSummary.latestValue === null
              ? "--"
              : formatMetricValue(
                  filters.metricName,
                  overview.selectedSeriesSummary.latestValue
                )
          }
          hint={
            overview.selectedSeriesSummary.lastRecordedAt
              ? `Most recent snapshot on ${formatDate(
                  overview.selectedSeriesSummary.lastRecordedAt
                )}.`
              : "No snapshots matched the current filter range."
          }
          icon={LineChart}
        />
        <StatCard
          label="Change vs previous"
          value={
            overview.selectedSeriesSummary.change === null ? "--" : `${overview.selectedSeriesSummary.change}%`
          }
          hint={
            overview.selectedSeriesSummary.change === null
              ? "Add at least two snapshots in the filtered series to calculate change."
              : "Compares the latest filtered snapshot to the prior one in the same series."
          }
          icon={Waves}
        />
        <StatCard
          label="Peak in range"
          value={
            overview.selectedSeriesSummary.highestValue === null
              ? "--"
              : formatMetricValue(
                  filters.metricName,
                  overview.selectedSeriesSummary.highestValue
                )
          }
          hint="Highest snapshot value in the current filtered time window."
          icon={BarChart3}
        />
        <StatCard
          label="Snapshots in range"
          value={String(overview.selectedSeriesSummary.snapshotCount)}
          hint="Validated metric rows available for this filtered chart and history view."
          icon={CalendarClock}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div id="analytics-entry">
          <AnalyticsForm
            defaultSource={filters.source}
            defaultMetricName={filters.metricName}
          />
        </div>
        <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
          <CardHeader className="border-b border-black/12 bg-black text-white">
            <CardTitle className="text-4xl text-white">{overview.selectedSeriesLabel}</CardTitle>
          </CardHeader>
          <CardContent className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
            {overview.selectedSeriesChart.length > 0 ? (
              <MetricLineChart data={overview.selectedSeriesChart} metricName={filters.metricName} />
            ) : (
              <EmptyState
                title="No chart data yet"
                description="Add manual snapshots or import a CSV for this source and metric to generate a line chart."
                actionLabel={null}
              />
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <AnalyticsImportPanel template={overview.csvTemplate} />
      </section>

      <section>
        <DataTableCard
          title="Metric snapshot history"
          description="The history table reflects the current filter set so imported and manual rows stay auditable."
          hasData={overview.selectedSeriesSnapshots.length > 0}
          emptyState={
            <EmptyState
              title="No metric snapshots in this range"
              description="Widen the date range or import snapshots for this source and metric to populate the chart and history table."
              actionLabel={null}
            />
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overview.selectedSeriesSnapshots.map((snapshot) => (
                <TableRow key={snapshot.id}>
                  <TableCell>{formatDate(snapshot.recordedAt)}</TableCell>
                  <TableCell>{metricSourceLabels[snapshot.source]}</TableCell>
                  <TableCell>{snapshot.metricLabel}</TableCell>
                  <TableCell>
                    {formatMetricValue(snapshot.metricName, snapshot.metricValue)}
                  </TableCell>
                  <TableCell>{snapshot.metadataPreview}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableCard>
      </section>
    </PageContainer>
  );
}
