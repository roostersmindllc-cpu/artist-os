import {
  CalendarDays,
  Clapperboard,
  Link2,
  Megaphone,
  Music4
} from "lucide-react";

import { ContentFilters } from "@/components/content/content-filters";
import { ContentListView } from "@/components/content/content-list-view";
import { ContentMonthView } from "@/components/content/content-month-view";
import { ContentPlannerToolbar } from "@/components/content/content-planner-toolbar";
import { ContentWeekView } from "@/components/content/content-week-view";
import { ContentForm } from "@/components/forms/content-form";
import { DataTableCard } from "@/components/shared/data-table-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOnboardedUser } from "@/lib/route-access";
import { hasActiveFilters } from "@/lib/filter-utils";
import {
  contentPlannerFiltersSchema,
  normalizeContentPlannerFilters
} from "@/lib/validations/content";
import { cn } from "@/lib/utils";
import {
  formatPlannerDateParam,
  normalizeContentPlannerView,
  parseContentAnchorDate
} from "@/services/content-helpers";
import { getContentPlannerForUser } from "@/services/content-service";

type ContentPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const { user } = await requireOnboardedUser();
  const params = await searchParams;
  const parsedFilters = contentPlannerFiltersSchema.safeParse({
    view: typeof params.view === "string" ? params.view : "",
    date: typeof params.date === "string" ? params.date : "",
    platform: typeof params.platform === "string" ? params.platform : "",
    status: typeof params.status === "string" ? params.status : "",
    campaignId: typeof params.campaignId === "string" ? params.campaignId : "",
    releaseId: typeof params.releaseId === "string" ? params.releaseId : ""
  });
  const filters = normalizeContentPlannerFilters(
    parsedFilters.success
      ? parsedFilters.data
      : {
          view: "",
          date: "",
          platform: "",
          status: "",
          campaignId: "",
          releaseId: ""
        }
  );
  const view = normalizeContentPlannerView(filters.view);
  const anchorDate = parseContentAnchorDate(filters.date);
  const planner = await getContentPlannerForUser(user.id, view, anchorDate, {
    platform: filters.platform,
    status: filters.status,
    campaignId: filters.campaignId,
    releaseId: filters.releaseId
  });
  const isFiltered = hasActiveFilters({
    platform: filters.platform,
    status: filters.status,
    campaignId: filters.campaignId,
    releaseId: filters.releaseId
  });
  const currentDateParam = formatPlannerDateParam(anchorDate);

  return (
    <PageContainer
      title="Content Planner"
      description="Plan monthly and weekly publishing rhythm across channels, with campaign and release links close to each item instead of buried in spreadsheets."
      eyebrow="Publishing rhythm"
      actions={
        <a
          href="#content-composer"
          className={cn(buttonVariants(), "rounded-2xl")}
        >
          New content item
        </a>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <ContentPlannerToolbar
            view={view}
            range={planner.range}
            filters={{
              platform: filters.platform,
              status: filters.status,
              campaignId: filters.campaignId,
              releaseId: filters.releaseId
            }}
          />

          <ContentFilters
            view={view}
            date={currentDateParam}
            filters={{
              platform: filters.platform,
              status: filters.status,
              campaignId: filters.campaignId,
              releaseId: filters.releaseId
            }}
            options={planner.options}
          />

          {planner.items.length === 0 ? (
            <EmptyState
              title={
                isFiltered
                  ? "No content matches these filters"
                  : "No content in this range"
              }
              description={
                isFiltered
                  ? "Clear one or more filters to widen the planner, or add a new content item for this campaign or release slice."
                  : "Add a content item or adjust the planner range to start filling the calendar with due dates, channels, and linked campaign context."
              }
              variant="card"
              action={
                <a
                  href={
                    isFiltered
                      ? `/content?view=${view}&date=${currentDateParam}`
                      : "#content-composer"
                  }
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-2xl"
                  )}
                >
                  {isFiltered ? "Clear filters" : "Create content item"}
                </a>
              }
            />
          ) : view === "month" ? (
            <ContentMonthView items={planner.items} range={planner.range} />
          ) : view === "week" ? (
            <ContentWeekView items={planner.items} range={planner.range} />
          ) : (
            <DataTableCard
              title="Agenda list"
              description="A linear fallback for the active month, with the same linked context as the calendar views."
              hasData
              emptyState={null}
            >
              <ContentListView items={planner.items} />
            </DataTableCard>
          )}
        </div>

        <div className="space-y-6">
          <div id="content-composer">
            <ContentForm options={planner.options} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Planner guidance</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-sm leading-6">
              <div className="flex items-start gap-3">
                <span className="border-primary/15 bg-primary/10 text-primary inline-flex size-9 items-center justify-center rounded-2xl border">
                  <CalendarDays className="size-4" />
                </span>
                <p>
                  Use month view to shape the release narrative, then switch to
                  week view when the team needs a tighter execution picture.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="border-primary/15 bg-primary/10 text-primary inline-flex size-9 items-center justify-center rounded-2xl border">
                  <Megaphone className="size-4" />
                </span>
                <p>
                  Linking a campaign keeps rollout work discoverable in both
                  directions without inventing ad-platform integrations early.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="border-primary/15 bg-primary/10 text-primary inline-flex size-9 items-center justify-center rounded-2xl border">
                  <Music4 className="size-4" />
                </span>
                <p>
                  Linking a release helps the dashboard and release detail page
                  reflect the real publishing cadence around a launch.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="border-primary/15 bg-primary/10 text-primary inline-flex size-9 items-center justify-center rounded-2xl border">
                  <Clapperboard className="size-4" />
                </span>
                <p>
                  Click any planned item to open its detail page for edits,
                  status changes, and deletion.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="border-primary/15 bg-primary/10 text-primary inline-flex size-9 items-center justify-center rounded-2xl border">
                  <Link2 className="size-4" />
                </span>
                <p>
                  Asset URLs stay lightweight for MVP use, which keeps the
                  planner ready for a future storage layer without blocking
                  current planning workflows.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
