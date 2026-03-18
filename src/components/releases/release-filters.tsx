import Link from "next/link";
import type { Route } from "next";
import { Filter, Plus } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  releaseStatusLabels,
  releaseStatusValues,
  releaseTypeLabels,
  releaseTypeValues
} from "@/lib/domain-config";
import type { ReleaseListFiltersValues } from "@/lib/validations/releases";
import { cn } from "@/lib/utils";

type ReleaseFiltersProps = {
  filters: ReleaseListFiltersValues;
  resultCount: number;
};

export function ReleaseFilters({ filters, resultCount }: ReleaseFiltersProps) {
  return (
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Catalog board
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-none">
              Slice the release lane
            </h2>
          </div>
          <span className="rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </span>
        </div>
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
          <div className="space-y-2">
            <Label htmlFor="release-filter-status" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </Label>
            <Select id="release-filter-status" name="status" defaultValue={filters.status ?? ""}>
              <option value="">All statuses</option>
              {releaseStatusValues.map((value) => (
                <option key={value} value={value}>
                  {releaseStatusLabels[value]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="release-filter-type" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Type
            </Label>
            <Select id="release-filter-type" name="type" defaultValue={filters.type ?? ""}>
              <option value="">All types</option>
              {releaseTypeValues.map((value) => (
                <option key={value} value={value}>
                  {releaseTypeLabels[value]}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="h-12 w-full rounded-full px-5 sm:w-auto">
              <Filter className="size-4" />
              Apply filters
            </Button>
            <Link
              href={"/releases" as Route}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 w-full rounded-full border-black/12 bg-white px-5 sm:w-auto"
              )}
            >
              Clear
            </Link>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Link
              href={"/releases/new" as Route}
              className={cn(buttonVariants(), "h-12 w-full rounded-full px-5 sm:w-auto")}
            >
              <Plus className="size-4" />
              New release
            </Link>
          </div>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {resultCount} release{resultCount === 1 ? "" : "s"} matched your current filters.
        </p>
      </CardContent>
    </Card>
  );
}
