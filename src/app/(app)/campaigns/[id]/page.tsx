import Link from "next/link";
import type { Route } from "next";
import {
  CalendarRange,
  CheckSquare,
  Clapperboard,
  DollarSign,
  Megaphone,
  Music4
} from "lucide-react";
import { notFound } from "next/navigation";

import { DeleteCampaignButton } from "@/components/campaigns/delete-campaign-button";
import { CampaignForm } from "@/components/forms/campaign-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { StatCard } from "@/components/shared/stat-card";
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
  releaseTypeLabels,
  taskPriorityLabels,
  taskStatusLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { buildCampaignFormValues } from "@/lib/validations/campaigns";
import { cn, formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  getCampaignDetailForUser,
  getCampaignReleaseOptionsForUser
} from "@/services/campaigns-service";

type CampaignDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function isMissingCampaignError(error: unknown) {
  return error instanceof Error && error.message === "Campaign could not be found.";
}

export default async function CampaignDetailPage({
  params
}: CampaignDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;

  let campaign: Awaited<ReturnType<typeof getCampaignDetailForUser>>;

  try {
    campaign = await getCampaignDetailForUser(user.id, id);
  } catch (error) {
    if (isMissingCampaignError(error)) {
      notFound();
    }

    throw error;
  }

  const releaseOptions = await getCampaignReleaseOptionsForUser(user.id);
  const formValues = buildCampaignFormValues(campaign);

  return (
    <PageContainer
      title={campaign.name}
      description="Keep campaign strategy, timing, budget, linked release context, and associated execution work together in one operator view."
      eyebrow="Campaign detail"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={"/campaigns" as Route}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
          >
            Back to campaigns
          </Link>
          <DeleteCampaignButton campaignId={campaign.id} campaignName={campaign.name} />
        </div>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusVariant(campaign.status)}>
                    {campaignStatusLabels[campaign.status]}
                  </Badge>
                  {campaign.release ? (
                    <Badge variant="outline">Linked to {campaign.release.title}</Badge>
                  ) : null}
                </div>
                <div>
                  <h2 className="font-heading text-3xl font-semibold tracking-tight">
                    {campaign.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{campaign.objective}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4 text-sm text-muted-foreground">
                <p>Updated {formatRelativeTime(campaign.updatedAt)}</p>
                <p className="mt-1">
                  Window: {formatDate(campaign.startDate)}
                  {campaign.endDate ? ` - ${formatDate(campaign.endDate)}` : ""}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Notes
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {campaign.notes ??
                    "No notes yet. Use this area to capture messaging, audience focus, budget rationale, or partner context."}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Linked release
                </p>
                {campaign.release ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{releaseTypeLabels[campaign.release.type]}</Badge>
                      <Badge variant={getStatusVariant(campaign.release.status)}>
                        {releaseStatusLabels[campaign.release.status]}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground">{campaign.release.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Release date: {formatDate(campaign.release.releaseDate)}
                    </p>
                    <Link
                      href={`/releases/${campaign.release.id}` as Route}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/80"
                      )}
                    >
                      Open release
                    </Link>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No release linked yet. This campaign can stay independent until the
                    release record is ready.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline summary</CardTitle>
            <CardDescription>
              A chronological view of the campaign window, linked release date, associated
              content, and related tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {campaign.timeline.length > 0 ? (
              <div className="space-y-3">
                {campaign.timeline.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-border/70 bg-background/45 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium">{event.label}</p>
                        <p className="text-sm text-muted-foreground">{event.detail}</p>
                      </div>
                      <Badge variant="outline">{formatDate(event.date)}</Badge>
                    </div>
                    <Link
                      href={event.href}
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
                title="No timeline events yet"
                description="Add content items, related tasks, or a linked release to make the campaign timeline more useful."
                icon={CalendarRange}
                variant="card"
                action={
                  <Link
                    href={"/content" as Route}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                  >
                    Open content
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard
          label="Budget"
          value={formatCurrency(campaign.summary.budget)}
          hint="Current planned spend for this campaign record."
          icon={DollarSign}
        />
        <StatCard
          label="Scheduled days"
          value={String(campaign.summary.scheduledDays)}
          hint="Calendar length from campaign start through end date."
          icon={CalendarRange}
        />
        <StatCard
          label="Content items"
          value={String(campaign.summary.contentItems)}
          hint="Content records currently linked to this campaign."
          icon={Clapperboard}
        />
        <StatCard
          label="Open tasks"
          value={String(campaign.summary.openTasks)}
          hint="Related tasks that still need action before closeout."
          icon={CheckSquare}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <CampaignForm
          mode="edit"
          campaignId={campaign.id}
          initialValues={formValues}
          releaseOptions={releaseOptions}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              Integration-ready structure
            </CardTitle>
            <CardDescription>
              The campaign record is intentionally simple today, while still leaving clear
              room for future ad-platform entities, performance rollups, and spend sync.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Strategy fields stay on the campaign itself, while execution work remains
              linked through content and tasks. That keeps the core entity stable as future
              integrations grow around it.
            </p>
            <p>
              When ad-platform support arrives, it can slot into the service layer without
              forcing route components to absorb API-specific branching.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music4 className="size-4 text-primary" />
              Associated content items
            </CardTitle>
            <CardDescription>
              Content records linked to this campaign across the rollout timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {campaign.contentItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Release</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.contentItems.map((item) => (
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
                      <TableCell>{item.release?.title ?? "Not linked"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6">
                <EmptyState
                  title="No content linked yet"
                  description="Associate content items from the Content module to show rollout execution in campaign context."
                  icon={Clapperboard}
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="size-4 text-primary" />
              Associated tasks
            </CardTitle>
            <CardDescription>
              Tasks already related to this campaign through the operational task system.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {campaign.tasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{task.title}</p>
                          {task.description ? (
                            <p className="text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(task.status)}>
                          {taskStatusLabels[task.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{taskPriorityLabels[task.priority]}</TableCell>
                      <TableCell>{formatDate(task.dueDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6">
                <EmptyState
                  title="No tasks linked yet"
                  description="Link tasks to this campaign from the Tasks module to turn strategy into an actionable execution queue."
                  icon={CheckSquare}
                  variant="card"
                  action={
                    <Link
                      href={"/tasks" as Route}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "rounded-2xl"
                      )}
                    >
                      Open tasks
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
