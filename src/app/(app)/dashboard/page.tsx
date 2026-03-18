import Link from "next/link";
import type { Route } from "next";
import {
  BarChart3,
  CalendarDays,
  Disc3,
  FileStack,
  Megaphone,
  Users2
} from "lucide-react";

import { CampaignsRunningNowList } from "@/components/dashboard/campaigns-running-now-list";
import { DashboardHeroBoard } from "@/components/dashboard/dashboard-hero-board";
import { PerformanceSnapshot } from "@/components/dashboard/performance-snapshot";
import { QuickAddActions } from "@/components/dashboard/quick-add-actions";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { ReleaseHealthScoreCard } from "@/components/dashboard/release-health-score-card";
import { ReleasesWithinWindowList } from "@/components/dashboard/releases-within-window-list";
import { TasksDueTodayList } from "@/components/dashboard/tasks-due-today-list";
import { TodayHeartbeat } from "@/components/dashboard/today-heartbeat";
import { UpcomingContentList } from "@/components/dashboard/upcoming-content-list";
import { PageContainer } from "@/components/shared/page-container";
import {
  onboardingPlatformLabels,
  socialPlatformLabels
} from "@/lib/domain-config";
import { requireOnboardedUser } from "@/lib/route-access";
import { cn } from "@/lib/utils";
import { getDashboardOverview } from "@/services/dashboard-service";

function formatPlatformLabel(
  value: string,
  labels: Record<string, string>
) {
  if (value in labels) {
    return labels[value];
  }

  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default async function DashboardPage() {
  const { user } = await requireOnboardedUser();
  const overview = await getDashboardOverview(user.id);
  const platformStack = [
    ...overview.artistProfile.platformsUsed.map((platform) => ({
      key: `workspace-${platform}`,
      label: formatPlatformLabel(platform, onboardingPlatformLabels),
      value: platform,
      kind: "workspace" as const
    })),
    ...overview.artistProfile.socialPlatforms.map((platform) => ({
      key: `social-${platform}`,
      label: formatPlatformLabel(platform, socialPlatformLabels),
      value: platform,
      kind: "social" as const
    }))
  ].filter(
    (item, index, items) => items.findIndex((candidate) => candidate.label === item.label) === index
  );
  const managerCards: Array<{
    title: string;
    description: string;
    href: Route;
    icon: typeof Disc3;
  }> = [
    {
      title: "Full Analytics",
      description: "Open charts, imports, and the deeper trend board for real movement.",
      href: "/analytics",
      icon: BarChart3
    },
    {
      title: "Campaign Manager",
      description: `${overview.counts.campaignsRunningNow} campaign${overview.counts.campaignsRunningNow === 1 ? "" : "s"} running now.`,
      href: "/campaigns",
      icon: Megaphone
    },
    {
      title: "Content Manager",
      description: `${overview.counts.upcomingContent} content item${overview.counts.upcomingContent === 1 ? "" : "s"} waiting in the queue.`,
      href: "/content",
      icon: CalendarDays
    },
    {
      title: "Upcoming Releases",
      description: `${overview.counts.releasesWithin30Days} release${overview.counts.releasesWithin30Days === 1 ? "" : "s"} inside the next 30 days.`,
      href: "/releases",
      icon: Disc3
    },
    {
      title: "Tasks",
      description: `${overview.counts.tasksDueToday} task${overview.counts.tasksDueToday === 1 ? "" : "s"} due today.`,
      href: "/tasks",
      icon: FileStack
    },
    {
      title: "Fan CRM",
      description: "Review fan notes, audience touchpoints, and growth context in one place.",
      href: "/fans",
      icon: Users2
    }
  ];

  return (
    <PageContainer
      title={`Welcome back, ${overview.artistProfile.artistName}`}
      description="The product heartbeat for today: a bolder release board for content, campaigns, fans, analytics, and next actions."
      eyebrow="Artist workspace"
      actions={<QuickAddActions />}
    >
      <DashboardHeroBoard
        artistName={overview.artistProfile.artistName}
        audienceSize={overview.artistProfile.audienceSize}
        counts={overview.counts}
        performanceSnapshot={overview.performanceSnapshot}
        heroChart={overview.heroChart}
        nextRelease={overview.nextRelease}
        releaseHealthInsight={overview.releaseHealthInsight}
        platforms={platformStack}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {managerCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className={cn(
                "group rounded-[1.45rem] border-2 px-5 py-5 transition-transform hover:-translate-y-0.5 sm:rounded-[1.9rem] sm:px-6 sm:py-6",
                index % 3 === 0
                  ? "border-black bg-white"
                  : index % 3 === 1
                    ? "border-primary/55 bg-[linear-gradient(180deg,rgba(28,216,242,0.16),rgba(255,255,255,0.96))]"
                    : "border-fuchsia-400/45 bg-[linear-gradient(180deg,rgba(190,89,255,0.14),rgba(255,255,255,0.96))]"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="font-heading text-3xl font-semibold leading-none sm:text-4xl">
                    {card.title}
                  </p>
                  <p className="max-w-sm text-sm leading-7 text-muted-foreground">
                    {card.description}
                  </p>
                </div>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-black/12 bg-black text-white">
                  <Icon className="size-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <TodayHeartbeat
          artistName={overview.artistProfile.artistName}
          counts={overview.counts}
          nextRelease={overview.nextRelease}
        />

        <ReleaseHealthScoreCard insight={overview.releaseHealthInsight} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <UpcomingContentList
          totalCount={overview.counts.upcomingContent}
          items={overview.upcomingContentItems}
        />
        <TasksDueTodayList
          totalCount={overview.counts.tasksDueToday}
          items={overview.tasksDueToday}
        />
        <CampaignsRunningNowList
          totalCount={overview.counts.campaignsRunningNow}
          items={overview.campaignsRunningNow}
        />
        <ReleasesWithinWindowList
          totalCount={overview.counts.releasesWithin30Days}
          items={overview.releasesWithin30Days}
        />
      </section>

      <PerformanceSnapshot items={overview.performanceSnapshot} />

      <section>
        <RecentActivityFeed items={overview.recentActivity} />
      </section>
    </PageContainer>
  );
}
