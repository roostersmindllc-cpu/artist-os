import type { Route } from "next";
import type {
  CampaignStatus,
  ContentPlatform,
  ReleaseStatus,
  TaskStatus
} from "@prisma/client";

import {
  campaignStatusLabels,
  contentPlatformLabels,
  releaseStatusLabels,
  taskStatusLabels
} from "@/lib/domain-config";

type DashboardActivityRecord =
  | {
      kind: "release";
      id: string;
      title: string;
      status: ReleaseStatus;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "campaign";
      id: string;
      title: string;
      status: CampaignStatus;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "content";
      id: string;
      title: string;
      platform: ContentPlatform;
      dueDate: Date;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "fan";
      id: string;
      title: string;
      handle: string | null;
      city: string | null;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    }
  | {
      kind: "task";
      id: string;
      title: string;
      status: TaskStatus;
      dueDate: Date | null;
      createdAt: Date;
      updatedAt: Date;
      href: Route;
    };

export type DashboardActivityItem = {
  id: string;
  kind: DashboardActivityRecord["kind"];
  title: string;
  typeLabel: string;
  actionLabel: string;
  detail: string;
  occurredAt: Date;
  href: Route;
};

export function getDashboardActivityActionLabel(
  createdAt: Date,
  updatedAt: Date
) {
  return updatedAt.getTime() > createdAt.getTime() ? "Updated" : "Created";
}

function getDashboardActivityDetail(record: DashboardActivityRecord) {
  switch (record.kind) {
    case "release":
      return releaseStatusLabels[record.status];
    case "campaign":
      return campaignStatusLabels[record.status];
    case "content":
      return `${contentPlatformLabels[record.platform]} scheduled`;
    case "fan":
      return record.city ?? record.handle ?? "Audience CRM";
    case "task":
      return record.dueDate
        ? `${taskStatusLabels[record.status]} - due soon`
        : taskStatusLabels[record.status];
    default:
      return "";
  }
}

function getDashboardActivityTypeLabel(kind: DashboardActivityRecord["kind"]) {
  switch (kind) {
    case "release":
      return "Release";
    case "campaign":
      return "Campaign";
    case "content":
      return "Content";
    case "fan":
      return "Fan";
    case "task":
      return "Task";
    default:
      return "Activity";
  }
}

export function buildDashboardActivityFeed(
  records: DashboardActivityRecord[],
  limit = 6
) {
  return records
    .map<DashboardActivityItem>((record) => ({
      id: record.id,
      kind: record.kind,
      title: record.title,
      typeLabel: getDashboardActivityTypeLabel(record.kind),
      actionLabel: getDashboardActivityActionLabel(record.createdAt, record.updatedAt),
      detail: getDashboardActivityDetail(record),
      occurredAt: record.updatedAt,
      href: record.href
    }))
    .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
    .slice(0, limit);
}
