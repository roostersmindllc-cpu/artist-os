import Link from "next/link";
import type { Route } from "next";

import { FanFilters } from "@/components/fans/fan-filters";
import { FanTable } from "@/components/fans/fan-table";
import { DataTableCard } from "@/components/shared/data-table-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { requireOnboardedUser } from "@/lib/route-access";
import { hasActiveFilters } from "@/lib/filter-utils";
import {
  fanListFiltersSchema,
  normalizeFanListFilters
} from "@/lib/validations/fans";
import { cn } from "@/lib/utils";
import {
  getFanFilterOptionsForUser,
  getFansForUser
} from "@/services/fans-service";

type FansPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FansPage({ searchParams }: FansPageProps) {
  const { user } = await requireOnboardedUser();
  const params = await searchParams;
  const parsedFilters = fanListFiltersSchema.safeParse({
    query: typeof params.query === "string" ? params.query : "",
    tag: typeof params.tag === "string" ? params.tag : "",
    city: typeof params.city === "string" ? params.city : ""
  });
  const filters = normalizeFanListFilters(
    parsedFilters.success
      ? parsedFilters.data
      : {
          query: "",
          tag: "",
          city: ""
        }
  );
  const [fans, options] = await Promise.all([
    getFansForUser(user.id, filters),
    getFanFilterOptionsForUser(user.id)
  ]);
  const isFiltered = hasActiveFilters(filters);

  return (
    <PageContainer
      title="Fans CRM"
      description="Search supporters quickly, keep relationship notes close, and organize the audience layer for future CSV import and segmentation work."
      eyebrow="Audience relationships"
      actions={
        <Link
          href={"/fans/new" as Route}
          className={cn(buttonVariants(), "rounded-2xl")}
        >
          New fan
        </Link>
      }
    >
      <FanFilters
        filters={filters}
        options={options}
        resultCount={fans.length}
      />

      <DataTableCard
        title="Fan list"
        description="Search across names, contact details, and cities, then filter by tag or city to find the right people quickly."
        hasData={fans.length > 0}
        emptyState={
          <EmptyState
            title={isFiltered ? "No fans match this search" : "No fans yet"}
            description={
              isFiltered
                ? "Try broadening the search or clear the filters to see the full CRM list."
                : "Add a fan to start building a reusable CRM layer for outreach, follow-up, and future imports."
            }
            action={
              <Link
                href={(isFiltered ? "/fans" : "/fans/new") as Route}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-2xl"
                )}
              >
                {isFiltered ? "Clear filters" : "Add first fan"}
              </Link>
            }
          />
        }
      >
        <FanTable fans={fans} />
      </DataTableCard>
    </PageContainer>
  );
}
