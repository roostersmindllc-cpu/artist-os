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
    <Card className="border-border/70 bg-card/85">
      <CardContent className="p-5">
        <form className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto]">
          <div className="space-y-2">
            <Label htmlFor="analytics-source">Source</Label>
            <Select id="analytics-source" name="source" defaultValue={filters.source}>
              {metricSourceValues.map((source) => (
                <option key={source} value={source}>
                  {metricSourceLabels[source]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="analytics-metric">Metric</Label>
            <Select id="analytics-metric" name="metricName" defaultValue={filters.metricName}>
              {metricNameValues.map((metricName) => (
                <option key={metricName} value={metricName}>
                  {getMetricDisplayLabel(filters.source, metricName)}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="analytics-from">From</Label>
            <Input id="analytics-from" name="from" type="date" defaultValue={filters.from} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="analytics-to">To</Label>
            <Input id="analytics-to" name="to" type="date" defaultValue={filters.to} />
          </div>
          <div className="flex items-end justify-start xl:justify-end">
            <button className={cn(buttonVariants(), "w-full rounded-xl sm:w-auto")} type="submit">
              <Filter className="size-4" />
              Apply
            </button>
          </div>
          <div className="flex flex-wrap gap-2 xl:col-span-5">
            <Link
              href="/analytics"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
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
