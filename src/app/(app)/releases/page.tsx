import Link from "next/link";
import type { Route } from "next";

import { ReleaseFilters } from "@/components/releases/release-filters";
import { ReleaseTable } from "@/components/releases/release-table";
import { DataTableCard } from "@/components/shared/data-table-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { requireOnboardedUser } from "@/lib/route-access";
import { hasActiveFilters } from "@/lib/filter-utils";
import {
  normalizeReleaseListFilters,
  releaseListFiltersSchema
} from "@/lib/validations/releases";
import { cn } from "@/lib/utils";
import { getReleasesForUser } from "@/services/releases-service";

type ReleasesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReleasesPage({
  searchParams
}: ReleasesPageProps) {
  const { user } = await requireOnboardedUser();
  const params = await searchParams;
  const parsedFilters = releaseListFiltersSchema.safeParse({
    status: typeof params.status === "string" ? params.status : "",
    type: typeof params.type === "string" ? params.type : ""
  });
  const filters = normalizeReleaseListFilters(
    parsedFilters.success ? parsedFilters.data : { status: "", type: "" }
  );
  const releases = await getReleasesForUser(user.id, filters);
  const isFiltered = hasActiveFilters(filters);

  return (
    <PageContainer
      title="Releases"
      description="Manage the catalog spine for launch planning, track delivery, and all the campaign and content work that hangs off each release."
      eyebrow="Catalog planning"
      actions={
        <Link
          href={"/releases/new" as Route}
          className={cn(buttonVariants(), "rounded-2xl")}
        >
          New release
        </Link>
      }
    >
      <ReleaseFilters filters={filters} resultCount={releases.length} />

      <DataTableCard
        title="Release list"
        description="Filter by lifecycle stage or format, then jump into the release workspace for tracks, milestones, and linked rollout records."
        hasData={releases.length > 0}
        emptyState={
          <EmptyState
            title={
              isFiltered ? "No releases match these filters" : "No releases yet"
            }
            description={
              isFiltered
                ? "Try clearing the current filters or create a new release if this catalog slice does not exist yet."
                : "Create your first release to anchor tracks, campaigns, and content in one operational record."
            }
            action={
              <Link
                href={(isFiltered ? "/releases" : "/releases/new") as Route}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-2xl"
                )}
              >
                {isFiltered ? "Clear filters" : "Create release"}
              </Link>
            }
          />
        }
      >
        <ReleaseTable releases={releases} />
      </DataTableCard>
    </PageContainer>
  );
}
