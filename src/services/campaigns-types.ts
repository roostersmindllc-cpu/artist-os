import type {
  CampaignStatus,
  ContentFormat,
  ContentPlatform,
  ContentStatus,
  ReleaseStatus,
  ReleaseType,
  TaskPriority,
  TaskStatus
} from "@prisma/client";
import type { Route } from "next";

export type CampaignReleaseLinkDto = {
  id: string;
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: Date | null;
};

export type CampaignReleaseOptionDto = CampaignReleaseLinkDto;

export type CampaignListItemDto = {
  id: string;
  name: string;
  objective: string;
  budget: number | null;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date | null;
  updatedAt: Date;
  release: CampaignReleaseLinkDto | null;
  contentItemsCount: number;
};

export type CampaignTaskDto = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignContentItemDto = {
  id: string;
  title: string;
  platform: ContentPlatform;
  format: ContentFormat;
  status: ContentStatus;
  dueDate: Date;
  publishedAt: Date | null;
  release: CampaignReleaseLinkDto | null;
};

export type CampaignTimelineEventDto = {
  id: string;
  label: string;
  detail: string;
  date: Date;
  href: Route;
  kind: "campaign" | "release" | "content" | "task";
};

export type CampaignBudgetSummaryDto = {
  budget: number | null;
  scheduledDays: number;
  contentItems: number;
  openTasks: number;
};

export type CampaignDetailDto = {
  id: string;
  releaseId: string | null;
  name: string;
  objective: string;
  budget: number | null;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  release: CampaignReleaseLinkDto | null;
  contentItems: CampaignContentItemDto[];
  tasks: CampaignTaskDto[];
  timeline: CampaignTimelineEventDto[];
  summary: CampaignBudgetSummaryDto;
};
