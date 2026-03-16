import { differenceInCalendarDays } from "date-fns";
import type { Route } from "next";

import {
  contentPlatformLabels,
  taskPriorityLabels,
  taskStatusLabels
} from "@/lib/domain-config";
import type {
  CampaignBudgetSummaryDto,
  CampaignTimelineEventDto
} from "@/services/campaigns-types";

type CampaignTimelineSource = {
  campaign: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
  };
  release: {
    id: string;
    title: string;
    releaseDate: Date | null;
  } | null;
  contentItems: Array<{
    id: string;
    title: string;
    platform: keyof typeof contentPlatformLabels;
    dueDate: Date;
    publishedAt: Date | null;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    dueDate: Date | null;
    priority: keyof typeof taskPriorityLabels;
    status: keyof typeof taskStatusLabels;
  }>;
};

export function getCampaignRoute(campaignId: string) {
  return `/campaigns/${campaignId}` as Route;
}

export function buildCampaignTimeline(
  source: CampaignTimelineSource
): CampaignTimelineEventDto[] {
  const events: CampaignTimelineEventDto[] = [
    {
      id: `campaign-start-${source.campaign.id}`,
      label: "Campaign start",
      detail: source.campaign.name,
      date: source.campaign.startDate,
      href: getCampaignRoute(source.campaign.id),
      kind: "campaign"
    }
  ];

  if (source.campaign.endDate) {
    events.push({
      id: `campaign-end-${source.campaign.id}`,
      label: "Campaign end",
      detail: source.campaign.name,
      date: source.campaign.endDate,
      href: getCampaignRoute(source.campaign.id),
      kind: "campaign"
    });
  }

  if (source.release?.releaseDate) {
    events.push({
      id: `release-${source.release.id}`,
      label: "Linked release date",
      detail: source.release.title,
      date: source.release.releaseDate,
      href: `/releases/${source.release.id}` as Route,
      kind: "release"
    });
  }

  for (const contentItem of source.contentItems) {
    events.push({
      id: `content-due-${contentItem.id}`,
      label: "Content due",
      detail: `${contentItem.title} - ${contentPlatformLabels[contentItem.platform]}`,
      date: contentItem.dueDate,
      href: "/content" as const,
      kind: "content"
    });

    if (contentItem.publishedAt) {
      events.push({
        id: `content-published-${contentItem.id}`,
        label: "Content published",
        detail: `${contentItem.title} - ${contentPlatformLabels[contentItem.platform]}`,
        date: contentItem.publishedAt,
        href: "/content" as const,
        kind: "content"
      });
    }
  }

  for (const task of source.tasks) {
    if (!task.dueDate) {
      continue;
    }

    events.push({
      id: `task-${task.id}`,
      label: "Task due",
      detail: `${task.title} - ${taskPriorityLabels[task.priority]} priority - ${taskStatusLabels[task.status]}`,
      date: task.dueDate,
      href: "/tasks" as const,
      kind: "task"
    });
  }

  return events.sort((left, right) => left.date.getTime() - right.date.getTime()).slice(0, 12);
}

export function buildCampaignBudgetSummary(source: {
  budget: number | null;
  startDate: Date;
  endDate: Date | null;
  contentItemsCount: number;
  openTasksCount: number;
}): CampaignBudgetSummaryDto {
  const endDate = source.endDate ?? source.startDate;

  return {
    budget: source.budget,
    scheduledDays: differenceInCalendarDays(endDate, source.startDate) + 1,
    contentItems: source.contentItemsCount,
    openTasks: source.openTasksCount
  };
}
