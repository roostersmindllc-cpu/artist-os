import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, Clapperboard, Link as LinkIcon, Megaphone, Music4 } from "lucide-react";
import { notFound } from "next/navigation";

import { DeleteContentButton } from "@/components/content/delete-content-button";
import { ContentForm } from "@/components/forms/content-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOnboardedUser } from "@/lib/route-access";
import {
  campaignStatusLabels,
  contentFormatLabels,
  contentPlatformLabels,
  contentStatusLabels,
  releaseStatusLabels,
  releaseTypeLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { buildContentFormValues } from "@/lib/validations/content";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  getContentItemDetailForUser,
  getContentPlannerOptionsForUser
} from "@/services/content-service";

type ContentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function isMissingContentError(error: unknown) {
  return error instanceof Error && error.message === "Content item could not be found.";
}

export default async function ContentDetailPage({
  params
}: ContentDetailPageProps) {
  const { user } = await requireOnboardedUser();
  const { id } = await params;

  let contentItem: Awaited<ReturnType<typeof getContentItemDetailForUser>>;

  try {
    contentItem = await getContentItemDetailForUser(user.id, id);
  } catch (error) {
    if (isMissingContentError(error)) {
      notFound();
    }

    throw error;
  }

  const options = await getContentPlannerOptionsForUser(user.id);
  const formValues = buildContentFormValues(contentItem);

  return (
    <PageContainer
      title={contentItem.title}
      description="Update publishing details, linked campaign and release context, and asset metadata from one content workspace."
      eyebrow="Content detail"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={"/content" as Route}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
          >
            Back to planner
          </Link>
          <DeleteContentButton contentItemId={contentItem.id} title={contentItem.title} />
        </div>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{contentPlatformLabels[contentItem.platform]}</Badge>
              <Badge variant="outline">{contentFormatLabels[contentItem.format]}</Badge>
              <Badge variant={getStatusVariant(contentItem.status)}>
                {contentStatusLabels[contentItem.status]}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Due date
                </p>
                <p className="mt-2 font-medium">{formatDate(contentItem.dueDate)}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Published
                </p>
                <p className="mt-2 font-medium">{formatDate(contentItem.publishedAt)}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Created
                </p>
                <p className="mt-2 font-medium">{formatDate(contentItem.createdAt)}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Updated
                </p>
                <p className="mt-2 font-medium">{formatRelativeTime(contentItem.updatedAt)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Caption
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {contentItem.caption ??
                  "No caption yet. Use the editor to capture copy, creative direction, or the publishing note you want attached to this item."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentItem.campaign ? (
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex items-center gap-2">
                  <Megaphone className="size-4 text-primary" />
                  <p className="font-medium">Campaign</p>
                </div>
                <p className="mt-3 font-medium text-foreground">{contentItem.campaign.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={getStatusVariant(contentItem.campaign.status)}>
                    {campaignStatusLabels[contentItem.campaign.status]}
                  </Badge>
                  <Badge variant="outline">
                    {formatDate(contentItem.campaign.startDate)}
                    {contentItem.campaign.endDate
                      ? ` - ${formatDate(contentItem.campaign.endDate)}`
                      : ""}
                  </Badge>
                </div>
                <Link
                  href={`/campaigns/${contentItem.campaign.id}` as Route}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "mt-3 rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/80"
                  )}
                >
                  Open campaign
                </Link>
              </div>
            ) : (
              <EmptyState
                title="No linked campaign"
                description="Link this item to a campaign if it belongs inside a larger rollout."
                icon={Megaphone}
                variant="card"
                actionLabel={null}
              />
            )}

            {contentItem.release ? (
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex items-center gap-2">
                  <Music4 className="size-4 text-primary" />
                  <p className="font-medium">Release</p>
                </div>
                <p className="mt-3 font-medium text-foreground">{contentItem.release.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">{releaseTypeLabels[contentItem.release.type]}</Badge>
                  <Badge variant={getStatusVariant(contentItem.release.status)}>
                    {releaseStatusLabels[contentItem.release.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Release date: {formatDate(contentItem.release.releaseDate)}
                </p>
                <Link
                  href={`/releases/${contentItem.release.id}` as Route}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "mt-3 rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/80"
                  )}
                >
                  Open release
                </Link>
              </div>
            ) : (
              <EmptyState
                title="No linked release"
                description="Link a release when this content item is part of a launch narrative."
                icon={Music4}
                variant="card"
                actionLabel={null}
              />
            )}

            {contentItem.assetUrl ? (
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex items-center gap-2">
                  <LinkIcon className="size-4 text-primary" />
                  <p className="font-medium">Asset link</p>
                </div>
                <a
                  href={contentItem.assetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block break-all text-sm text-primary underline-offset-4 hover:underline"
                >
                  {contentItem.assetUrl}
                </a>
              </div>
            ) : (
              <EmptyState
                title="No asset URL yet"
                description="Add an external asset link if you want the planner to point to creative files or delivery-ready media."
                icon={Clapperboard}
                variant="card"
                actionLabel={null}
              />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <ContentForm
          mode="edit"
          contentItemId={contentItem.id}
          initialValues={formValues}
          options={options}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              Planning notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Content lives as a scheduling record first, which keeps the planner stable even
              before there is a full media library or social publishing integration.
            </p>
            <p>
              The detail page is intentionally lightweight: it gives you a clean editing space
              while preserving the calendar page as the high-level planning surface.
            </p>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
