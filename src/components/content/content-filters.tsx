import Link from "next/link";
import { FilterX } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  campaignStatusLabels,
  contentPlatformLabels,
  contentPlatformValues,
  contentStatusLabels,
  contentStatusValues
} from "@/lib/domain-config";
import { cn, formatDate } from "@/lib/utils";
import { buildContentPlannerHref } from "@/services/content-helpers";
import type { ContentPlannerOptionsDto, ContentPlannerView } from "@/services/content-types";

type ContentFiltersProps = {
  view: ContentPlannerView;
  date: string;
  filters: {
    platform?: string;
    status?: string;
    campaignId?: string;
    releaseId?: string;
  };
  options: ContentPlannerOptionsDto;
};

export function ContentFilters({
  view,
  date,
  filters,
  options
}: ContentFiltersProps) {
  return (
    <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Planner filters
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-none">
              Refine the publishing board
            </h2>
          </div>
          <span className="rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {view} view
          </span>
        </div>
        <form className="grid gap-4 lg:grid-cols-4">
          <input type="hidden" name="view" value={view} />
          <input type="hidden" name="date" value={date} />

          <div className="space-y-2">
            <Label htmlFor="content-filter-platform" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Platform
            </Label>
            <Select
              id="content-filter-platform"
              name="platform"
              defaultValue={filters.platform ?? ""}
            >
              <option value="">All platforms</option>
              {contentPlatformValues.map((value) => (
                <option key={value} value={value}>
                  {contentPlatformLabels[value]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-filter-status" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </Label>
            <Select
              id="content-filter-status"
              name="status"
              defaultValue={filters.status ?? ""}
            >
              <option value="">All statuses</option>
              {contentStatusValues.map((value) => (
                <option key={value} value={value}>
                  {contentStatusLabels[value]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-filter-campaign" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Campaign
            </Label>
            <Select
              id="content-filter-campaign"
              name="campaignId"
              defaultValue={filters.campaignId ?? ""}
            >
              <option value="">All campaigns</option>
              {options.campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name} - {campaignStatusLabels[campaign.status]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-filter-release" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Release
            </Label>
            <Select
              id="content-filter-release"
              name="releaseId"
              defaultValue={filters.releaseId ?? ""}
            >
              <option value="">All releases</option>
              {options.releases.map((release) => (
                <option key={release.id} value={release.id}>
                  {release.title} - {formatDate(release.releaseDate)}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 lg:col-span-4">
            <button className={cn(buttonVariants(), "h-12 rounded-full px-5")} type="submit">
              Apply filters
            </button>
            <Link
              href={buildContentPlannerHref({
                view,
                date
              })}
              className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-full border-black/12 bg-white px-5")}
            >
              <FilterX className="size-4" />
              Clear filters
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
