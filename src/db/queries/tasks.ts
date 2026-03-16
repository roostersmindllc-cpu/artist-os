import { startOfDay } from "date-fns";
import { TaskPriority, TaskRelatedType, TaskStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";

type CreateTaskInput = {
  relatedType: TaskRelatedType | null;
  relatedId: string | null;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
};

export async function listTasksByArtistProfileId(artistProfileId: string) {
  return prisma.task.findMany({
    where: { artistProfileId },
    orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }]
  });
}

export async function listUpcomingTasksByArtistProfileId(
  artistProfileId: string,
  limit = 5
) {
  return prisma.task.findMany({
    where: {
      artistProfileId,
      status: {
        notIn: ["DONE", "CANCELED"]
      }
    },
    orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
    take: limit
  });
}

export async function createTask(artistProfileId: string, data: CreateTaskInput) {
  return prisma.task.create({
    data: {
      artistProfileId,
      ...data
    }
  });
}

export async function listUpcomingTasksByRelatedReleaseId(
  artistProfileId: string,
  releaseId: string,
  limit = 6,
  today = new Date()
) {
  return prisma.task.findMany({
    where: {
      artistProfileId,
      relatedType: "RELEASE",
      relatedId: releaseId,
      dueDate: {
        gte: startOfDay(today)
      },
      status: {
        notIn: ["DONE", "CANCELED"]
      }
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
    take: limit
  });
}

export async function listTasksByRelatedCampaignId(
  artistProfileId: string,
  campaignId: string
) {
  return prisma.task.findMany({
    where: {
      artistProfileId,
      relatedType: "CAMPAIGN",
      relatedId: campaignId
    },
    orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }]
  });
}
