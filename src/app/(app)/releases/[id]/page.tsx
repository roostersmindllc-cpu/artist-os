import Link from "next/link";
import type { Route } from "next";
import { CalendarClock, Disc3, Megaphone, Package2, PencilLine } from "lucide-react";
import { notFound } from "next/navigation";

import { ReleaseForm } from "@/components/forms/release-form";
import { DeleteReleaseButton } from "@/components/releases/delete-release-button";
import { ReleaseTracksManager } from "@/components/releases/release-tracks-manager";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import {
  campaignStatusLabels,
  contentPlatformLabels,
  contentStatusLabels,
  releaseStatusLabels,
  releaseTypeLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { buildReleaseFormValues } from "@/lib/validations/releases";
import {
  cn,
  formatCurrency,
  formatDate,
  formatRelativeTime
} from "@/lib/utils";
import { getReleaseDetailForUser } from "@/services/releases-service";

type ReleaseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function isMissingReleaseError(error: unknown) {
  return error instanceof Error && error.message === "Release could not be found.";
}

export default async function ReleaseDetailPage({
  params
}: ReleaseDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;

  let release: Awaited<ReturnType<typeof getReleaseDetailForUser>>;

  try {
    release = await getReleaseDetailForUser(user.id, id);
  } catch (error) {
    if (isMissingReleaseError(error)) {
      notFound();
    }

    throw error;
  }

  const formValues = buildReleaseFormValues(release);

  return (
    <PageContainer
      title={release.title}
      description="Use the release workspace to keep metadata, tracks, milestones, and linked rollout records in sync."
      eyebrow="Release detail"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={"/releases" as Route}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
          >
            Back to releases
          </Link>
          <DeleteReleaseButton releaseId={release.id} releaseTitle={release.title} />
        </div>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-primary/15 via-background to-background">
              {release.coverArtUrl ? (
                <div
                  role="img"
                  aria-label={`${release.title} cover art`}
                  className="aspect-square h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${release.coverArtUrl})` }}
                />
              ) : (
                <div className="flex aspect-square items-center justify-center">
                  <span className="inline-flex size-16 items-center justify-center rounded-[1.5rem] border border-primary/15 bg-primary/10 text-primary shadow-sm">
                    <Disc3 className="size-8" />
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{releaseTypeLabels[release.type]}</Badge>
                  <Badge variant={getStatusVariant(release.status)}>
                    {releaseStatusLabels[release.status]}
                  </Badge>
                </div>
                <div>
                  <h2 className="font-heading text-3xl font-semibold tracking-tight">
                    {release.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {release.description ??
                      "No description yet. Use the editor below to capture the narrative, positioning, or release notes for the rollout."}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Release date
                  </p>
                  <p className="mt-2 font-medium">{formatDate(release.releaseDate)}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Distributor
                  </p>
                  <p className="mt-2 font-medium">{release.distributor ?? "Not set"}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Tracks
                  </p>
                  <p className="mt-2 font-medium">{release.tracks.length}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Updated
                  </p>
                  <p className="mt-2 font-medium">{formatRelativeTime(release.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming milestones</CardTitle>
            <CardDescription>
              Timeline checkpoints pulled from the release date, linked campaigns, content,
              and upcoming release tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {release.upcomingMilestones.length > 0 ? (
              <div className="space-y-3">
                {release.upcomingMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="rounded-2xl border border-border/70 bg-background/45 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">{milestone.label}</p>
                        <p className="text-sm text-muted-foreground">{milestone.detail}</p>
                      </div>
                      <Badge variant="outline">{formatDate(milestone.date)}</Badge>
                    </div>
                    <Link
                      href={milestone.href}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "mt-3 rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/80"
                      )}
                    >
                      Open related page
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No upcoming milestones"
                description="Add a release date, link campaigns, or attach dated tasks and content to build the launch timeline."
                icon={CalendarClock}
                variant="card"
                action={
                  <Link
                    href={"/tasks" as Route}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                  >
                    Open tasks
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <ReleaseForm mode="edit" releaseId={release.id} initialValues={formValues} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PencilLine className="size-4 text-primary" />
              Release notes
            </CardTitle>
            <CardDescription>
              Keep the metadata accurate here so linked planning records have a dependable
              source of truth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              The release detail page is designed to keep planning and execution close to the
              catalog record itself. Update metadata here, then manage tracks and linked
              rollout work below.
            </p>
            <p>
              Campaigns and content are read-only in this view for the MVP, so those records
              still live in their own dedicated modules while remaining visible in context.
            </p>
          </CardContent>
        </Card>
      </section>

      <ReleaseTracksManager releaseId={release.id} tracks={release.tracks} />

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              Linked campaigns
            </CardTitle>
            <CardDescription>
              Campaigns already connected to this release, ordered by start date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {release.campaigns.length > 0 ? (
              <div className="space-y-3">
                {release.campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-2xl border border-border/70 bg-background/45 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.objective}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(campaign.status)}>
                        {campaignStatusLabels[campaign.status]}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span>Starts: {formatDate(campaign.startDate)}</span>
                      <span>Ends: {formatDate(campaign.endDate)}</span>
                      <span>Budget: {formatCurrency(campaign.budget)}</span>
                    </div>
                    {campaign.notes ? (
                      <p className="mt-3 text-sm text-muted-foreground">{campaign.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No linked campaigns"
                description="Attach a campaign to this release from the Campaigns module once rollout planning starts."
                icon={Megaphone}
                variant="card"
                action={
                  <Link
                    href={"/campaigns" as Route}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                  >
                    Open campaigns
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package2 className="size-4 text-primary" />
              Related content items
            </CardTitle>
            <CardDescription>
              Scheduled or published content connected to this release across channels.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {release.contentItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Campaign</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {release.contentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.format.replaceAll("_", " ").toLowerCase()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{contentPlatformLabels[item.platform]}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status)}>
                          {contentStatusLabels[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.publishedAt
                          ? `Published ${formatDate(item.publishedAt)}`
                          : formatDate(item.dueDate)}
                      </TableCell>
                      <TableCell>{item.campaign?.name ?? "Not linked"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6">
                <EmptyState
                  title="No related content"
                  description="Link content items to this release from the Content module to keep rollout visibility close to the catalog record."
                  icon={Package2}
                  variant="card"
                  action={
                    <Link
                      href={"/content" as Route}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "rounded-2xl"
                      )}
                    >
                      Open content
                    </Link>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
