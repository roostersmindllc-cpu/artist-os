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
    <Card className="border-border/70 bg-card/85">
      <CardContent className="p-5">
        <form className="grid gap-4 lg:grid-cols-4">
          <input type="hidden" name="view" value={view} />
          <input type="hidden" name="date" value={date} />

          <div className="space-y-2">
            <Label htmlFor="content-filter-platform">Platform</Label>
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
            <Label htmlFor="content-filter-status">Status</Label>
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
            <Label htmlFor="content-filter-campaign">Campaign</Label>
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
            <Label htmlFor="content-filter-release">Release</Label>
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
            <button className={cn(buttonVariants(), "rounded-xl")} type="submit">
              Apply filters
            </button>
            <Link
              href={buildContentPlannerHref({
                view,
                date
              })}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
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
