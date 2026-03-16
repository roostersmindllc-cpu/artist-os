import type { Route } from "next";

import { contentPlatformLabels, taskStatusLabels } from "@/lib/domain-config";

type ReleaseMilestone = {
  id: string;
  label: string;
  detail: string;
  date: Date;
  href: Route;
  kind: "release" | "campaign" | "content" | "task";
};

type ReleaseMilestoneSource = {
  release: {
    id: string;
    title: string;
    releaseDate: Date | null;
  };
  campaigns: Array<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
  }>;
  contentItems: Array<{
    id: string;
    title: string;
    platform: keyof typeof contentPlatformLabels;
    dueDate: Date;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    dueDate: Date | null;
    status: keyof typeof taskStatusLabels;
  }>;
};

export type UpcomingReleaseMilestone = ReleaseMilestone;

export function getReleaseRoute(releaseId: string) {
  return `/releases/${releaseId}` as Route;
}

export function buildUpcomingReleaseMilestones(
  source: ReleaseMilestoneSource,
  today = new Date()
) {
  const threshold = today.getTime();
  const milestones: ReleaseMilestone[] = [];

  if (source.release.releaseDate && source.release.releaseDate.getTime() >= threshold) {
    milestones.push({
      id: `release-${source.release.id}`,
      label: "Release date",
      detail: source.release.title,
      date: source.release.releaseDate,
      href: getReleaseRoute(source.release.id),
      kind: "release"
    });
  }

  for (const campaign of source.campaigns) {
    if (campaign.startDate.getTime() >= threshold) {
      milestones.push({
        id: `campaign-start-${campaign.id}`,
        label: "Campaign start",
        detail: campaign.name,
        date: campaign.startDate,
        href: "/campaigns" as const,
        kind: "campaign"
      });
    }

    if (campaign.endDate && campaign.endDate.getTime() >= threshold) {
      milestones.push({
        id: `campaign-end-${campaign.id}`,
        label: "Campaign end",
        detail: campaign.name,
        date: campaign.endDate,
        href: "/campaigns" as const,
        kind: "campaign"
      });
    }
  }

  for (const contentItem of source.contentItems) {
    if (contentItem.dueDate.getTime() >= threshold) {
      milestones.push({
        id: `content-${contentItem.id}`,
        label: "Content due",
        detail: `${contentItem.title} - ${contentPlatformLabels[contentItem.platform]}`,
        date: contentItem.dueDate,
        href: "/content" as const,
        kind: "content"
      });
    }
  }

  for (const task of source.tasks) {
    if (task.dueDate && task.dueDate.getTime() >= threshold) {
      milestones.push({
        id: `task-${task.id}`,
        label: "Task due",
        detail: `${task.title} - ${taskStatusLabels[task.status]}`,
        date: task.dueDate,
        href: "/tasks" as const,
        kind: "task"
      });
    }
  }

  return milestones
    .sort((left, right) => left.date.getTime() - right.date.getTime())
    .slice(0, 8);
}
