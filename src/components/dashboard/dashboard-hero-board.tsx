import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  AudioLines,
  Camera,
  Disc3,
  Mail,
  Music2,
  Music4,
  Play,
  RadioTower,
  Sparkles
} from "lucide-react";

import { DashboardHeroMetricChart } from "@/components/dashboard/dashboard-hero-metric-chart";
import {
  BlackHeaderCard,
  CyanOutlineShell,
  PurpleFeaturePanel,
  WhiteBoardCard
} from "@/components/shared/artist-os-surfaces";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { releaseTypeLabels } from "@/lib/domain-config";
import { cn, formatCompactNumber, formatDate, formatMetricValue, formatRelativeTime } from "@/lib/utils";
import type {
  DashboardHeroChart,
  DashboardPerformanceItem,
  DashboardReleaseHealthInsight
} from "@/services/dashboard-helpers";

type PlatformRailItem = {
  key: string;
  label: string;
  value: string;
  kind: "workspace" | "social";
};

type DashboardHeroBoardProps = {
  artistName: string;
  audienceSize: number | null;
  counts: {
    upcomingContent: number;
    tasksDueToday: number;
    campaignsRunningNow: number;
    releasesWithin30Days: number;
  };
  performanceSnapshot: DashboardPerformanceItem[];
  heroChart: DashboardHeroChart;
  nextRelease: {
    id: string;
    title: string;
    type: keyof typeof releaseTypeLabels;
    releaseDate: Date | null;
    distributor: string | null;
    tracks: Array<{
      id: string;
      title: string;
      status: string;
    }>;
    _count: {
      tracks: number;
      campaigns: number;
    };
  } | null;
  releaseHealthInsight: DashboardReleaseHealthInsight | null;
  platforms: PlatformRailItem[];
};

type HeroStatItem = {
  label: string;
  value: string;
  hint: string;
};

const platformVisuals: Record<
  string,
  {
    icon?: LucideIcon;
    monogram?: string;
    shellClassName: string;
  }
> = {
  SPOTIFY: {
    icon: Disc3,
    shellClassName: "border-emerald-300/60 bg-emerald-200/55 text-foreground"
  },
  APPLE_MUSIC: {
    icon: Music4,
    shellClassName: "border-fuchsia-300/60 bg-fuchsia-200/55 text-foreground"
  },
  YOUTUBE: {
    icon: Play,
    shellClassName: "border-rose-300/60 bg-rose-200/55 text-foreground"
  },
  TIKTOK: {
    icon: Music2,
    shellClassName: "border-primary/40 bg-primary/15 text-foreground"
  },
  INSTAGRAM: {
    icon: Camera,
    shellClassName: "border-orange-300/60 bg-orange-200/55 text-foreground"
  },
  EMAIL: {
    icon: Mail,
    shellClassName: "border-amber-300/60 bg-amber-200/55 text-foreground"
  },
  X: {
    monogram: "X",
    shellClassName: "border-black/12 bg-black/8 text-foreground"
  }
};

function buildHeroStats(
  audienceSize: number | null,
  performanceSnapshot: DashboardPerformanceItem[]
) {
  const streams = performanceSnapshot.find((item) => item.key === "streamsLast7Days");
  const engagement = performanceSnapshot.find((item) => item.key === "campaignEngagement");

  return [
    {
      label: "Audience size",
      value: audienceSize !== null ? formatCompactNumber(audienceSize) : "--",
      hint:
        audienceSize !== null
          ? "Profile baseline for planning"
          : "Add a baseline in settings"
    },
    {
      label: "Streams 7d",
      value:
        streams?.value !== null && streams?.value !== undefined
          ? formatMetricValue(streams.metricName, streams.value)
          : "--",
      hint: streams?.sourceLabel
        ? `${streams.sourceLabel} rolling window`
        : "Log analytics to unlock"
    },
    {
      label: "Campaign engagement",
      value:
        engagement?.value !== null && engagement?.value !== undefined
          ? formatMetricValue(engagement.metricName, engagement.value)
          : "--",
      hint: engagement?.sourceLabel
        ? `${engagement.sourceLabel} live series`
        : "Connect a tracked engagement source"
    }
  ] satisfies HeroStatItem[];
}

function getHighlightCopy({
  counts,
  nextRelease,
  releaseHealthInsight
}: Pick<
  DashboardHeroBoardProps,
  "counts" | "nextRelease" | "releaseHealthInsight"
>) {
  if (!nextRelease) {
    return {
      eyebrow: "Highlight block",
      title: "Build the next release runway",
      description:
        "Add a release to pin a launch target, chart momentum, and route the daily work around something real.",
      value: `${counts.tasksDueToday} tasks due`,
      details: [
        `${counts.upcomingContent} content items queued`,
        `${counts.campaignsRunningNow} campaigns live`,
        `${counts.releasesWithin30Days} releases in 30 days`
      ],
      href: "/releases/new" as Route,
      actionLabel: "Add release"
    };
  }

  const primaryTrack = nextRelease.tracks[0] ?? null;
  const hasMatchingHealthInsight =
    releaseHealthInsight?.releaseId === nextRelease.id ? releaseHealthInsight : null;

  return {
    eyebrow: primaryTrack ? "Top song / highlight" : "Release highlight",
    title: primaryTrack?.title ?? nextRelease.title,
    description: primaryTrack
      ? `From ${nextRelease.title}, your next ${releaseTypeLabels[nextRelease.type].toLowerCase()} move.`
      : `${releaseTypeLabels[nextRelease.type]} release lined up for ${formatDate(nextRelease.releaseDate)}.`,
    value: hasMatchingHealthInsight
      ? `${hasMatchingHealthInsight.score}% ready`
      : `${nextRelease._count.tracks} track${nextRelease._count.tracks === 1 ? "" : "s"}`,
    details: [
      nextRelease.releaseDate
        ? `${formatDate(nextRelease.releaseDate)} - ${formatRelativeTime(nextRelease.releaseDate)}`
        : "Release date not set",
      nextRelease.distributor ?? "Distributor not set",
      `${nextRelease._count.campaigns} linked campaign${nextRelease._count.campaigns === 1 ? "" : "s"}`
    ],
    href: `/releases/${nextRelease.id}` as Route,
    actionLabel: "Open release lane"
  };
}

function getMetricChangeLabel(change: number | null) {
  if (change === null) {
    return "No prior point";
  }

  return `${change > 0 ? "+" : ""}${change}%`;
}

export function DashboardHeroBoard({
  artistName,
  audienceSize,
  counts,
  performanceSnapshot,
  heroChart,
  nextRelease,
  releaseHealthInsight,
  platforms
}: DashboardHeroBoardProps) {
  const heroStats = buildHeroStats(audienceSize, performanceSnapshot);
  const highlight = getHighlightCopy({ counts, nextRelease, releaseHealthInsight });

  return (
    <CyanOutlineShell className="p-3 sm:p-4 lg:p-5">
      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_320px] xl:gap-5">
        <div className="order-2 grid gap-3 sm:grid-cols-3 xl:order-1 xl:grid-cols-1 xl:gap-4">
          {heroStats.map((item) => (
            <WhiteBoardCard
              key={item.label}
              padding="compact"
              contentClassName="space-y-2 sm:space-y-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                {item.label}
              </p>
              <p className="font-heading text-4xl font-semibold leading-none sm:text-5xl">
                {item.value}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{item.hint}</p>
            </WhiteBoardCard>
          ))}
        </div>

        <BlackHeaderCard
          className="order-1 xl:order-2"
          title="Hero chart"
          description={`The main signal moving ${artistName}'s board right now.`}
          icon={
            <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-primary text-primary-foreground">
              <AudioLines className="size-5" />
            </span>
          }
          action={
            <Link
              href="/analytics"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-center rounded-full border-white/16 bg-white/8 text-white hover:bg-white/12 hover:text-white sm:w-auto"
              )}
            >
              Open analytics
            </Link>
          }
          contentClassName="space-y-4 sm:space-y-5"
        >
          {heroChart.latestValue !== null && heroChart.points.length > 0 ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-black/12 bg-white px-3 py-1 font-semibold"
                    >
                      {heroChart.label}
                    </Badge>
                    {heroChart.sourceLabel ? (
                      <Badge
                        variant="outline"
                        className="rounded-full border-black/12 bg-white px-3 py-1 font-semibold"
                      >
                        {heroChart.sourceLabel}
                      </Badge>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                      Current board signal
                    </p>
                    <p className="mt-2 font-heading text-4xl font-semibold leading-none sm:text-6xl">
                      {formatMetricValue(heroChart.metricName, heroChart.latestValue)}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 sm:text-right">
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-3 py-2 text-sm font-semibold">
                    <RadioTower className="size-4 text-primary" />
                    {getMetricChangeLabel(heroChart.change)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {heroChart.recordedAt
                      ? `Updated ${formatRelativeTime(heroChart.recordedAt)}`
                      : "No update time yet"}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border-2 border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,247,249,0.96))] p-3 sm:rounded-[1.9rem] sm:p-4">
                <DashboardHeroMetricChart chart={heroChart} />
              </div>

              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <div className="rounded-[1.25rem] border border-black/12 bg-white px-4 py-3 sm:rounded-[1.4rem]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Tasks today
                  </p>
                  <p className="mt-1 font-heading text-2xl font-semibold leading-none sm:text-3xl">
                    {counts.tasksDueToday}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-black/12 bg-white px-4 py-3 sm:rounded-[1.4rem]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Campaigns live
                  </p>
                  <p className="mt-1 font-heading text-2xl font-semibold leading-none sm:text-3xl">
                    {counts.campaignsRunningNow}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-black/12 bg-white px-4 py-3 sm:rounded-[1.4rem]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Upcoming content
                  </p>
                  <p className="mt-1 font-heading text-2xl font-semibold leading-none sm:text-3xl">
                    {counts.upcomingContent}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-black/12 bg-white px-4 py-3 sm:rounded-[1.4rem]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Releases in 30d
                  </p>
                  <p className="mt-1 font-heading text-2xl font-semibold leading-none sm:text-3xl">
                    {counts.releasesWithin30Days}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="No hero chart yet"
              description="Log analytics and the center board will start plotting your live stream, follower, or engagement signal."
              variant="card"
              action={
                <Link
                  href="/analytics#analytics-entry"
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-black/12 bg-white px-5")}
                >
                  Log analytics
                </Link>
              }
            />
          )}
        </BlackHeaderCard>

        <BlackHeaderCard
          className="order-3"
          title={highlight.eyebrow}
          description="A featured release or track anchor for the current planning lane."
          icon={
            <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
          }
          contentClassName="space-y-4 sm:space-y-5"
        >
          <PurpleFeaturePanel
            title={highlight.title}
            description={highlight.description}
            icon={nextRelease?.tracks[0] ? Music4 : Sparkles}
            className="p-4 sm:p-5"
            titleClassName="text-2xl sm:text-3xl"
          />

          <div className="grid gap-3">
            <div className="rounded-[1.4rem] border-2 border-black/12 bg-white p-4 sm:rounded-[1.6rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                Board highlight
              </p>
              <p className="mt-2 font-heading text-4xl font-semibold leading-none sm:text-5xl">
                {highlight.value}
              </p>
            </div>

            {highlight.details.map((detail) => (
              <div
                key={detail}
                className="rounded-[1.2rem] border border-black/12 bg-white px-4 py-3 text-sm leading-6 text-muted-foreground sm:rounded-[1.4rem]"
              >
                {detail}
              </div>
            ))}
          </div>

          <Link href={highlight.href} className={cn(buttonVariants(), "w-full rounded-full")}>
            {highlight.actionLabel}
            <ArrowUpRight className="size-4" />
          </Link>
        </BlackHeaderCard>
      </div>

      <WhiteBoardCard
        className="mt-4 sm:mt-5"
        padding="compact"
        contentClassName="space-y-4 sm:space-y-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Platform rail
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-none sm:text-4xl">
              Branded channels across the stack
            </h2>
          </div>
          <Link
            href="/settings"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-center rounded-full border-black/12 bg-white px-5 sm:w-auto"
            )}
          >
            Update stack
          </Link>
        </div>

        {platforms.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            {platforms.map((platform) => {
              const visual = platformVisuals[platform.value] ?? {
                monogram: platform.label.slice(0, 2).toUpperCase(),
                shellClassName: "border-black/12 bg-white text-foreground"
              };
              const Icon = visual.icon;

              return (
                <div
                  key={platform.key}
                  className={cn(
                    "flex min-h-[104px] flex-col items-start gap-2 rounded-[1.2rem] border px-3 py-3 sm:min-h-0 sm:flex-row sm:items-center sm:gap-3 sm:rounded-[1.5rem] sm:px-4",
                    visual.shellClassName
                  )}
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-[1.05rem] border border-black/12 bg-white text-foreground sm:size-11 sm:rounded-2xl">
                    {Icon ? (
                      <Icon className="size-5" />
                    ) : (
                      <span className="font-heading text-xl font-semibold">
                        {visual.monogram}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold sm:text-base">
                      {platform.label}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {platform.kind === "workspace" ? "workspace" : "social"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No platform rail yet"
            description="Add platforms in onboarding or settings and the dashboard will turn them into a branded channel rail."
            variant="card"
            action={
              <Link
                href="/settings"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-black/12 bg-white px-5")}
              >
                Open settings
              </Link>
            }
          />
        )}
      </WhiteBoardCard>
    </CyanOutlineShell>
  );
}
