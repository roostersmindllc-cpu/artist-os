import { ArrowRight, CalendarClock, Disc3, RadioTower, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { releaseTypeLabels } from "@/lib/domain-config";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";

type TodayHeartbeatProps = {
  artistName: string;
  counts: {
    upcomingContent: number;
    tasksDueToday: number;
    campaignsRunningNow: number;
    releasesWithin30Days: number;
  };
  nextRelease: {
    title: string;
    type: keyof typeof releaseTypeLabels;
    releaseDate: Date | null;
    distributor: string | null;
  } | null;
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getFocusItems({
  counts,
  nextRelease
}: Pick<TodayHeartbeatProps, "counts" | "nextRelease">) {
  const items: { label: string; href: string }[] = [];

  if (counts.tasksDueToday > 0) {
    items.push({
      label: `Clear ${pluralize(counts.tasksDueToday, "task")} due today.`,
      href: "/tasks"
    });
  }

  if (counts.upcomingContent > 0) {
    items.push({
      label: `Schedule or review ${pluralize(counts.upcomingContent, "post")} in the queue.`,
      href: "/content"
    });
  }

  if (counts.campaignsRunningNow > 0) {
    items.push({
      label: `Check ${pluralize(counts.campaignsRunningNow, "campaign")} running now.`,
      href: "/campaigns"
    });
  }

  if (nextRelease?.releaseDate) {
    items.push({
      label: `Prep ${nextRelease.title} (${releaseTypeLabels[nextRelease.type]}) releasing ${formatRelativeTime(nextRelease.releaseDate)}.`,
      href: "/releases"
    });
  } else if (counts.releasesWithin30Days > 0) {
    items.push({
      label: `Tighten the runway for ${pluralize(counts.releasesWithin30Days, "release")} landing in the next 30 days.`,
      href: "/releases"
    });
  }

  if (items.length === 0) {
    items.push({
      label: "No urgent deadlines are stacked today. Use the space to schedule content or log fresh analytics.",
      href: "/content#content-composer"
    });
  }

  return items.slice(0, 4);
}

function getPrimaryFocusHref({
  counts,
  nextRelease
}: Pick<TodayHeartbeatProps, "counts" | "nextRelease">) {
  if (counts.tasksDueToday > 0) {
    return "/tasks";
  }

  if (counts.upcomingContent > 0) {
    return "/content";
  }

  if (counts.campaignsRunningNow > 0) {
    return "/campaigns";
  }

  if (nextRelease) {
    return "/releases";
  }

  return "/analytics#analytics-entry";
}

export function TodayHeartbeat({
  artistName,
  counts,
  nextRelease
}: TodayHeartbeatProps) {
  const focusItems = getFocusItems({ counts, nextRelease });
  const primaryFocusHref = getPrimaryFocusHref({ counts, nextRelease });

  return (
    <Card className="overflow-hidden border-2 border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,239,231,0.92))] shadow-[0_18px_34px_rgba(0,0,0,0.08)]">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="rounded-full border-primary/35 bg-primary/12 px-3 py-1 text-foreground"
              >
                Today&apos;s heartbeat
              </Badge>
              <div className="space-y-3">
                <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-6xl">
                  What should {artistName} do today?
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Start with {pluralize(counts.tasksDueToday, "task")} due today, keep{" "}
                  {pluralize(counts.campaignsRunningNow, "campaign")} live, and move{" "}
                  {pluralize(counts.upcomingContent, "piece", "pieces")} of upcoming content
                  closer to publish.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <div className="rounded-[1.35rem] border border-black/12 bg-white p-4 sm:rounded-[1.7rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Tasks today
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
                  {counts.tasksDueToday}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-black/12 bg-white p-4 sm:rounded-[1.7rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Upcoming content
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
                  {counts.upcomingContent}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-black/12 bg-white p-4 sm:rounded-[1.7rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Campaigns live
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
                  {counts.campaignsRunningNow}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-black/12 bg-white p-4 sm:rounded-[1.7rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Releases in 30d
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
                  {counts.releasesWithin30Days}
                </p>
              </div>
            </div>

            {nextRelease?.releaseDate ? (
              <div className="grid gap-2 rounded-[1.45rem] border border-black/12 bg-white p-4 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:rounded-[1.8rem]">
                <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <Disc3 className="size-4" />
                </span>
                <span className="font-medium text-foreground">{nextRelease.title}</span>
                <span>{releaseTypeLabels[nextRelease.type]}</span>
                <span>{formatDate(nextRelease.releaseDate)}</span>
                <span>{formatRelativeTime(nextRelease.releaseDate)}</span>
                <span>{nextRelease.distributor ?? "Distributor not set"}</span>
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.55rem] border border-black/12 bg-[linear-gradient(180deg,rgba(28,216,242,0.12),rgba(255,255,255,0.98))] p-4 shadow-sm sm:rounded-[1.9rem] sm:p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Today&apos;s focus
                </p>
                <p className="text-sm text-muted-foreground">
                  The highest-leverage moves based on what is already in the workspace.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {focusItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 transition-colors hover:bg-accent/60"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                    {item.href.startsWith("/tasks") ? (
                      <CalendarClock className="size-4" />
                    ) : item.href.startsWith("/campaigns") ? (
                      <RadioTower className="size-4" />
                    ) : (
                      <Disc3 className="size-4" />
                    )}
                  </span>
                  <span className="text-sm leading-6 text-foreground">{item.label}</span>
                </a>
              ))}
            </div>

            <a
              href={primaryFocusHref}
              className={cn(buttonVariants(), "mt-5 w-full rounded-2xl")}
            >
              Open primary focus
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
