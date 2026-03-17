import Link from "next/link";
import type { Route } from "next";

import { CampaignFilters } from "@/components/campaigns/campaign-filters";
import { CampaignTable } from "@/components/campaigns/campaign-table";
import { DataTableCard } from "@/components/shared/data-table-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { requireOnboardedUser } from "@/lib/route-access";
import { hasActiveFilters } from "@/lib/filter-utils";
import {
  campaignListFiltersSchema,
  normalizeCampaignListFilters
} from "@/lib/validations/campaigns";
import { cn } from "@/lib/utils";
import { getCampaignsForUser } from "@/services/campaigns-service";

type CampaignsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CampaignsPage({
  searchParams
}: CampaignsPageProps) {
  const { user } = await requireOnboardedUser();
  const params = await searchParams;
  const parsedFilters = campaignListFiltersSchema.safeParse({
    status: typeof params.status === "string" ? params.status : ""
  });
  const filters = normalizeCampaignListFilters(
    parsedFilters.success ? parsedFilters.data : { status: "" }
  );
  const campaigns = await getCampaignsForUser(user.id, filters);
  const isFiltered = hasActiveFilters(filters);

  return (
    <PageContainer
      title="Campaigns"
      description="Manage launch windows, budgets, objectives, and release links from one planning layer built for future channel integrations."
      eyebrow="Launch planning"
      actions={
        <Link
          href={"/campaigns/new" as Route}
          className={cn(buttonVariants(), "rounded-2xl")}
        >
          New campaign
        </Link>
      }
    >
      <CampaignFilters filters={filters} resultCount={campaigns.length} />

      <DataTableCard
        title="Campaign list"
        description="Filter by status, review timing and budget, and jump into the campaign workspace for linked content, tasks, and release context."
        hasData={campaigns.length > 0}
        emptyState={
          <EmptyState
            title={
              isFiltered ? "No campaigns match this status" : "No campaigns yet"
            }
            description={
              isFiltered
                ? "Try clearing the filter or create a new campaign if this status column should have activity."
                : "Create your first campaign to give rollout work a dedicated operational home, even before ad-platform integrations exist."
            }
            action={
              <Link
                href={(isFiltered ? "/campaigns" : "/campaigns/new") as Route}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-2xl"
                )}
              >
                {isFiltered ? "Clear filters" : "Create campaign"}
              </Link>
            }
          />
        }
      >
        <CampaignTable campaigns={campaigns} />
      </DataTableCard>
    </PageContainer>
  );
}
