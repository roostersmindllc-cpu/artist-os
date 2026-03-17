import Link from "next/link";
import type { Route } from "next";
import { Mail, MapPin, Tag, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { DeleteFanButton } from "@/components/fans/delete-fan-button";
import { FanForm } from "@/components/forms/fan-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOnboardedUser } from "@/lib/route-access";
import { getFanEngagementVariant } from "@/lib/presentation";
import { buildFanFormValues } from "@/lib/validations/fans";
import { cn, formatRelativeTime } from "@/lib/utils";
import { getFanDetailForUser } from "@/services/fans-service";

type FanDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function isMissingFanError(error: unknown) {
  return error instanceof Error && error.message === "Fan could not be found.";
}

export default async function FanDetailPage({ params }: FanDetailPageProps) {
  const { user } = await requireOnboardedUser();
  const { id } = await params;

  let fan: Awaited<ReturnType<typeof getFanDetailForUser>>;

  try {
    fan = await getFanDetailForUser(user.id, id);
  } catch (error) {
    if (isMissingFanError(error)) {
      notFound();
    }

    throw error;
  }

  const formValues = buildFanFormValues(fan);
  const contactPoints = [fan.email, fan.handle].filter(Boolean).length;

  return (
    <PageContainer
      title={fan.name}
      description="Keep relationship context, tags, and engagement scoring current so follow-up stays personal instead of scattered."
      eyebrow="Fan detail"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={"/fans" as Route}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-2xl"
            )}
          >
            Back to fans
          </Link>
          <DeleteFanButton fanId={fan.id} fanName={fan.name} />
        </div>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getFanEngagementVariant(fan.engagementScore)}>
                Engagement {fan.engagementScore}
              </Badge>
              {fan.city ? <Badge variant="outline">{fan.city}</Badge> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border-border/70 bg-background/45 rounded-2xl border p-4">
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                  Email
                </p>
                <p className="mt-2 font-medium break-all">
                  {fan.email ?? "Not set"}
                </p>
              </div>
              <div className="border-border/70 bg-background/45 rounded-2xl border p-4">
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                  Handle
                </p>
                <p className="mt-2 font-medium">{fan.handle ?? "Not set"}</p>
              </div>
              <div className="border-border/70 bg-background/45 rounded-2xl border p-4">
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                  Updated
                </p>
                <p className="mt-2 font-medium">
                  {formatRelativeTime(fan.updatedAt)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                Tags
              </p>
              {fan.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {fan.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No tags saved yet.
                </p>
              )}
            </div>

            <div className="border-border/70 bg-background/45 rounded-2xl border p-4">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                Relationship notes
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                {fan.notes ??
                  "No notes yet. Use this field to capture relationship context, outreach history, or why this person matters in the audience layer."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CRM snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatCard
              label="Engagement score"
              value={String(fan.engagementScore)}
              hint="A simple manual score you can tune over time as the relationship changes."
              icon={UserRound}
            />
            <StatCard
              label="Contact points"
              value={String(contactPoints)}
              hint="Email and handle together give you the current direct contact surface."
              icon={Mail}
            />
            <StatCard
              label="Saved tags"
              value={String(fan.tags.length)}
              hint="Tags keep the record filterable for future outreach and import workflows."
              icon={Tag}
            />
            <StatCard
              label="City set"
              value={fan.city ? "Yes" : "No"}
              hint="City becomes useful quickly once you start filtering by local market."
              icon={MapPin}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <FanForm mode="edit" fanId={fan.id} initialValues={formValues} />
        <Card>
          <CardHeader>
            <CardTitle>Import-ready CRM</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4 text-sm leading-6">
            <p>
              The fan record is intentionally lightweight so a CSV import can
              land in the same typed normalization path without forcing the UI
              to carry data-cleaning logic.
            </p>
            <p>
              Search and filters are already isolated outside the page
              component, which makes it easier to reuse them if the CRM grows
              into bulk actions or saved segments.
            </p>
          </CardContent>
        </Card>
      </section>

      {!fan.notes && fan.tags.length === 0 ? (
        <EmptyState
          title="This relationship record is still light"
          description="Adding a few tags or a note will make follow-up and future filtering much more useful."
          variant="card"
          actionLabel={null}
        />
      ) : null}
    </PageContainer>
  );
}
