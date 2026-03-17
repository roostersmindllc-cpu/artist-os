import Link from "next/link";
import { ArrowRight, RadioTower } from "lucide-react";

import { DashboardWidgetShell } from "@/components/dashboard/dashboard-widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { campaignStatusLabels } from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { cn, formatDate } from "@/lib/utils";

type CampaignsRunningNowListProps = {
  totalCount: number;
  items: Array<{
    id: string;
    name: string;
    objective: string;
    startDate: Date;
    endDate: Date | null;
    status: keyof typeof campaignStatusLabels;
    release: {
      id: string;
      title: string;
    } | null;
  }>;
};

export function CampaignsRunningNowList({
  totalCount,
  items
}: CampaignsRunningNowListProps) {
  return (
    <DashboardWidgetShell
      title="Campaigns running now"
      description="The live pushes that need attention while they are still in market."
      icon={RadioTower}
      countLabel={`${totalCount} live`}
    >
      <div className="flex-1 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-background/45 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.objective}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.release ? `For ${item.release.title}` : "Brand / audience push"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.endDate
                      ? `Running ${formatDate(item.startDate)} to ${formatDate(item.endDate)}`
                      : `Running since ${formatDate(item.startDate)}`}
                  </p>
                </div>
                <Badge variant={getStatusVariant(item.status)}>
                  {campaignStatusLabels[item.status]}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No campaigns are live"
            description="Nothing is actively running right now. Launch or reactivate a campaign to keep promotion moving."
            action={
              <Link
                href="/campaigns/new"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
              >
                Add campaign
              </Link>
            }
          />
        )}
      </div>

      {items.length > 0 ? (
        <Link
          href="/campaigns"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-auto rounded-2xl border-border/70"
          )}
        >
          Open campaigns
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </DashboardWidgetShell>
  );
}
