import Link from "next/link";
import { CalendarRange, Filter } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  metricNameValues,
  metricSourceLabels,
  metricSourceValues
} from "@/lib/domain-config";
import type { AnalyticsFiltersValues } from "@/lib/validations/analytics";
import { cn } from "@/lib/utils";
import { getMetricDisplayLabel } from "@/services/analytics-helpers";

type AnalyticsFiltersProps = {
  filters: AnalyticsFiltersValues;
};

export function AnalyticsFilters({ filters }: AnalyticsFiltersProps) {
  return (
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Filter board
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-none">
              Shape the metric lane
            </h2>
          </div>
          <span className="rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Source + date range
          </span>
        </div>
        <form className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto]">
          <div className="space-y-2">
            <Label htmlFor="analytics-source" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Source
            </Label>
            <Select id="analytics-source" name="source" defaultValue={filters.source}>
              {metricSourceValues.map((source) => (
                <option key={source} value={source}>
                  {metricSourceLabels[source]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="analytics-metric" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Metric
            </Label>
            <Select id="analytics-metric" name="metricName" defaultValue={filters.metricName}>
              {metricNameValues.map((metricName) => (
                <option key={metricName} value={metricName}>
                  {getMetricDisplayLabel(filters.source, metricName)}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="analytics-from" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              From
            </Label>
            <Input id="analytics-from" name="from" type="date" defaultValue={filters.from} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="analytics-to" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              To
            </Label>
            <Input id="analytics-to" name="to" type="date" defaultValue={filters.to} />
          </div>
          <div className="flex items-end justify-start xl:justify-end">
            <button className={cn(buttonVariants(), "h-12 w-full rounded-full px-5 sm:w-auto")} type="submit">
              <Filter className="size-4" />
              Apply
            </button>
          </div>
          <div className="flex flex-wrap gap-2 xl:col-span-5">
            <Link
              href="/analytics"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-black/12 bg-white px-5")}
            >
              <CalendarRange className="size-4" />
              Last 90 days
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
