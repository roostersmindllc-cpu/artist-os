import { addDays, startOfDay } from "date-fns";
import type { ContentFormat, ContentPlatform } from "@prisma/client";

import {
  onboardingPlatformValues,
  onboardingPlatformLabels,
  socialPlatformLabels,
  socialPlatformValues
} from "@/lib/domain-config";

export type OnboardingSocialPlatform = (typeof socialPlatformValues)[number];
export type OnboardingWorkspacePlatform = (typeof onboardingPlatformValues)[number];

export type OnboardingWorkspaceSeedInput = {
  artistName: string;
  socialPlatforms: OnboardingSocialPlatform[];
  nextReleaseDate: Date;
  audienceSize: number;
  platformsUsed: OnboardingWorkspacePlatform[];
};

export type OnboardingWorkspacePlan = {
  profile: {
    artistName: string;
    audienceSize: number;
    socialPlatforms: OnboardingSocialPlatform[];
    platformsUsed: OnboardingWorkspacePlatform[];
  };
  release: {
    title: string;
    type: "SINGLE";
    status: "SCHEDULED";
    releaseDate: Date;
    distributor: string | null;
    coverArtUrl: null;
    description: string;
  };
  campaign: {
    name: string;
    objective: string;
    budget: null;
    startDate: Date;
    endDate: Date;
    status: "ACTIVE";
    notes: string;
  };
  contentItems: Array<{
    platform: ContentPlatform;
    format: ContentFormat;
    title: string;
    caption: string;
    dueDate: Date;
    publishedAt: null;
    status: "DRAFT";
    assetUrl: null;
  }>;
  tasks: Array<{
    relatedType: "RELEASE" | "CAMPAIGN";
    title: string;
    description: string;
    dueDate: Date;
    priority: "HIGH" | "MEDIUM";
    status: "TODO";
  }>;
};

const contentOffsets = [0, 2, 5] as const;
const starterReleaseTitle = "Next Release";

function cyclePlatforms(platforms: OnboardingSocialPlatform[], count: number) {
  const uniquePlatforms = [...new Set(platforms)];
  const selectedPlatforms = uniquePlatforms.length > 0 ? uniquePlatforms : ["INSTAGRAM"];

  return Array.from({ length: count }, (_, index) => {
    return selectedPlatforms[index % selectedPlatforms.length] as OnboardingSocialPlatform;
  });
}

function getContentTemplate(
  platform: OnboardingSocialPlatform,
  releaseTitle: string,
  itemIndex: number
) {
  switch (platform) {
    case "INSTAGRAM":
      return {
        format: itemIndex === 0 ? "CAROUSEL" : "STORY",
        title:
          itemIndex === 0
            ? `Announcement carousel for ${releaseTitle}`
            : `Countdown stories for ${releaseTitle}`,
        caption:
          itemIndex === 0
            ? `Introduce ${releaseTitle} and invite fans into the rollout from day one.`
            : `Turn the release runway into a quick countdown sequence for fans already paying attention.`
      } as const;
    case "TIKTOK":
      return {
        format: "SHORT_VIDEO",
        title: `Teaser cut for ${releaseTitle}`,
        caption: `Post a hook-first TikTok teaser that gives ${releaseTitle} a clear week-one signal.`
      } as const;
    case "YOUTUBE":
      return {
        format: "SHORT_VIDEO",
        title: `YouTube Short for ${releaseTitle}`,
        caption: `Use a short-form YouTube cut to frame ${releaseTitle} for fans outside the main socials.`
      } as const;
    case "X":
      return {
        format: "STATIC_POST",
        title: `Launch thread opener for ${releaseTitle}`,
        caption: `Write the first thread or post that explains why ${releaseTitle} matters right now.`
      } as const;
    default:
      return {
        format: "STATIC_POST",
        title: `Week-one post for ${releaseTitle}`,
        caption: `Create the first rollout post for ${releaseTitle}.`
      } as const;
  }
}

function getDistributorGuess(platformsUsed: OnboardingWorkspacePlatform[]) {
  if (platformsUsed.includes("SPOTIFY") || platformsUsed.includes("APPLE_MUSIC")) {
    return "Distributor TBD";
  }

  return null;
}

function getPlatformsSummary(platforms: string[], labels: Record<string, string>) {
  if (platforms.length === 0) {
    return "your selected channels";
  }

  return platforms.map((platform) => labels[platform] ?? platform).join(", ");
}

export function buildOnboardingWorkspacePlan(
  input: OnboardingWorkspaceSeedInput,
  today = new Date()
): OnboardingWorkspacePlan {
  const todayStart = startOfDay(today);
  const contentPlatforms = cyclePlatforms(input.socialPlatforms, contentOffsets.length);

  return {
    profile: {
      artistName: input.artistName,
      audienceSize: input.audienceSize,
      socialPlatforms: input.socialPlatforms,
      platformsUsed: input.platformsUsed
    },
    release: {
      title: starterReleaseTitle,
      type: "SINGLE",
      status: "SCHEDULED",
      releaseDate: input.nextReleaseDate,
      distributor: getDistributorGuess(input.platformsUsed),
      coverArtUrl: null,
      description:
        "Starter release created during onboarding. Rename it, refine the date, and turn the seeded plan into the real rollout."
    },
    campaign: {
      name: `${starterReleaseTitle} starter campaign`,
      objective: `Turn the next release into a focused first-week rollout across ${getPlatformsSummary(
        input.socialPlatforms,
        socialPlatformLabels
      )}.`,
      budget: null,
      startDate: todayStart,
      endDate: addDays(input.nextReleaseDate, 7),
      status: "ACTIVE",
      notes: `Built for an audience of about ${input.audienceSize.toLocaleString()} fans across ${getPlatformsSummary(
        input.platformsUsed,
        onboardingPlatformLabels
      )}.`
    },
    contentItems: contentPlatforms.map((platform, index) => {
      const template = getContentTemplate(platform, starterReleaseTitle, index);

      return {
        platform,
        format: template.format,
        title: template.title,
        caption: template.caption,
        dueDate: addDays(todayStart, contentOffsets[index] ?? index),
        publishedAt: null,
        status: "DRAFT",
        assetUrl: null
      };
    }),
    tasks: [
      {
        relatedType: "RELEASE",
        title: `Rename ${starterReleaseTitle} and confirm the date`,
        description:
          "Replace the placeholder release title with the real one and make sure the launch date is correct before the plan hardens.",
        dueDate: todayStart,
        priority: "HIGH",
        status: "TODO"
      },
      {
        relatedType: "CAMPAIGN",
        title: "Review the starter campaign audience and message",
        description:
          "Tighten the campaign objective, audience assumptions, and core hook so the seeded plan matches the actual release.",
        dueDate: addDays(todayStart, 1),
        priority: "HIGH",
        status: "TODO"
      },
      {
        relatedType: "CAMPAIGN",
        title: "Finish the first week of content assets",
        description:
          "Turn the draft week-one content plan into real posts, captions, and scheduled publishing work.",
        dueDate: addDays(todayStart, 2),
        priority: "MEDIUM",
        status: "TODO"
      },
      {
        relatedType: "CAMPAIGN",
        title: "Log baseline analytics from your active platforms",
        description: `Bring in a first snapshot from ${getPlatformsSummary(
          input.platformsUsed,
          onboardingPlatformLabels
        )} so the dashboard can start tracking real movement.`,
        dueDate: addDays(todayStart, 3),
        priority: "MEDIUM",
        status: "TODO"
      }
    ]
  };
}
