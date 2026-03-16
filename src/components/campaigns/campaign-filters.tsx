import Link from "next/link";
import type { Route } from "next";
import { Filter, Plus } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { campaignStatusLabels, campaignStatusValues } from "@/lib/domain-config";
import type { CampaignListFiltersValues } from "@/lib/validations/campaigns";
import { cn } from "@/lib/utils";

type CampaignFiltersProps = {
  filters: CampaignListFiltersValues;
  resultCount: number;
};

export function CampaignFilters({ filters, resultCount }: CampaignFiltersProps) {
  return (
    <Card className="border-border/70 bg-card/85">
      <CardContent className="p-5">
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="space-y-2">
            <Label htmlFor="campaign-filter-status">Status</Label>
            <Select id="campaign-filter-status" name="status" defaultValue={filters.status ?? ""}>
              <option value="">All statuses</option>
              {campaignStatusValues.map((value) => (
                <option key={value} value={value}>
                  {campaignStatusLabels[value]}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="w-full sm:w-auto">
              <Filter className="size-4" />
              Apply filters
            </Button>
            <Link
              href={"/campaigns" as Route}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full rounded-xl sm:w-auto"
              )}
            >
              Clear
            </Link>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Link
              href={"/campaigns/new" as Route}
              className={cn(buttonVariants(), "w-full rounded-xl sm:w-auto")}
            >
              <Plus className="size-4" />
              New campaign
            </Link>
          </div>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {resultCount} campaign{resultCount === 1 ? "" : "s"} matched your current filters.
        </p>
      </CardContent>
    </Card>
  );
}
