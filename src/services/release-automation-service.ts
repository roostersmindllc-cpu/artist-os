import { addDays, startOfDay, subDays } from "date-fns";
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

type CreateReleaseWithAutomationInput = {
  title: string;
  slug: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: Date | null;
  distributor: string | null;
  coverArtUrl: string | null;
  description: string | null;
};

type ReleaseAutomationPlanInput = {
  title: string;
  releaseDate: Date | null;
};

type ReleaseAutomationCampaign = {
  name: string;
  objective: string;
  budget: number | null;
  startDate: Date;
  endDate: Date | null;
  status: CampaignStatus;
  notes: string | null;
};

type ReleaseAutomationContentItem = {
  platform: ContentPlatform;
  format: ContentFormat;
  title: string;
  caption: string | null;
  dueDate: Date;
  publishedAt: Date | null;
  status: ContentStatus;
  assetUrl: string | null;
};

type ReleaseAutomationTask = {
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
};

export type ReleaseAutomationSummary = {
  campaignCount: number;
  contentItemCount: number;
  taskCount: number;
  anchorDate: Date;
  usesProvisionalDate: boolean;
};

export type ReleaseAutomationPlan = {
  campaign: ReleaseAutomationCampaign;
  contentItems: ReleaseAutomationContentItem[];
  tasks: ReleaseAutomationTask[];
  summary: ReleaseAutomationSummary;
};

function clampDateToToday(date: Date, today: Date) {
  return date.getTime() < today.getTime() ? today : date;
}

function resolveAutomationAnchorDate(
  releaseDate: Date | null,
  today: Date
) {
  const todayStart = startOfDay(today);

  if (!releaseDate) {
    return {
      anchorDate: addDays(todayStart, 21),
      usesProvisionalDate: true
    };
  }

  const releaseStart = startOfDay(releaseDate);

  return {
    anchorDate: releaseStart.getTime() < todayStart.getTime() ? todayStart : releaseStart,
    usesProvisionalDate: false
  };
}

export function buildReleaseAutomationPlan(
  input: ReleaseAutomationPlanInput,
  today = new Date()
): ReleaseAutomationPlan {
  const todayStart = startOfDay(today);
  const { anchorDate, usesProvisionalDate } = resolveAutomationAnchorDate(
    input.releaseDate,
    today
  );
  const campaignStart = clampDateToToday(subDays(anchorDate, 21), todayStart);
  const campaignEnd = addDays(anchorDate, 7);
  const campaignStatus: CampaignStatus =
    campaignStart.getTime() > todayStart.getTime() ? "DRAFT" : "ACTIVE";

  return {
    campaign: {
      name: `${input.title} rollout`,
      objective: `Build awareness and fan action around ${input.title} from announcement through release week.`,
      budget: null,
      startDate: campaignStart,
      endDate: campaignEnd,
      status: campaignStatus,
      notes:
        "Auto-generated from the release automation. Adjust timing, budget, and notes as the rollout sharpens."
    },
    contentItems: [
      {
        platform: "INSTAGRAM",
        format: "CAROUSEL",
        title: `Announce ${input.title}`,
        caption: `Introduce ${input.title} and open the rollout story for fans.`,
        dueDate: clampDateToToday(subDays(anchorDate, 14), todayStart),
        publishedAt: null,
        status: "DRAFT",
        assetUrl: null
      },
      {
        platform: "TIKTOK",
        format: "SHORT_VIDEO",
        title: `TikTok teaser for ${input.title}`,
        caption: `Post a short-form teaser that points fans toward ${input.title}.`,
        dueDate: clampDateToToday(subDays(anchorDate, 7), todayStart),
        publishedAt: null,
        status: "DRAFT",
        assetUrl: null
      },
      {
        platform: "EMAIL",
        format: "EMAIL_BLAST",
        title: `Release-day email for ${input.title}`,
        caption: `Send fans a release-day email with the key link and story behind ${input.title}.`,
        dueDate: anchorDate,
        publishedAt: null,
        status: "DRAFT",
        assetUrl: null
      }
    ],
    tasks: [
      {
        title: `Submit ${input.title} to playlists`,
        description: "Start playlist outreach and keep submission notes attached to the release.",
        dueDate: clampDateToToday(subDays(anchorDate, 21), todayStart),
        priority: "HIGH",
        status: "TODO"
      },
      {
        title: `Schedule TikTok posts for ${input.title}`,
        description: "Turn the release into a short-form posting plan and queue the first TikTok assets.",
        dueDate: clampDateToToday(subDays(anchorDate, 7), todayStart),
        priority: "HIGH",
        status: "TODO"
      },
      {
        title: `Send email to fans about ${input.title}`,
        description: "Prepare the release email and make sure the fan list gets the core message before or on launch day.",
        dueDate: clampDateToToday(subDays(anchorDate, 2), todayStart),
        priority: "MEDIUM",
        status: "TODO"
      }
    ],
    summary: {
      campaignCount: 1,
      contentItemCount: 3,
      taskCount: 3,
      anchorDate,
      usesProvisionalDate
    }
  };
}

export async function createReleaseWithAutomation(
  artistProfileId: string,
  data: CreateReleaseWithAutomationInput,
  today = new Date()
) {
  const { prisma } = await import("@/db/prisma");

  return prisma.$transaction(async (tx) => {
    const release = await tx.release.create({
      data: {
        artistProfileId,
        ...data
      }
    });
    const automationPlan = buildReleaseAutomationPlan(
      {
        title: release.title,
        releaseDate: release.releaseDate
      },
      today
    );
    const campaign = await tx.campaign.create({
      data: {
        artistProfileId,
        releaseId: release.id,
        ...automationPlan.campaign
      }
    });

    await tx.contentItem.createMany({
      data: automationPlan.contentItems.map((item) => ({
        artistProfileId,
        campaignId: campaign.id,
        releaseId: release.id,
        ...item
      }))
    });

    await tx.task.createMany({
      data: automationPlan.tasks.map((task) => ({
        artistProfileId,
        relatedType: "RELEASE" as const,
        relatedId: release.id,
        ...task
      }))
    });

    return {
      ...release,
      automationSummary: automationPlan.summary
    };
  });
}
