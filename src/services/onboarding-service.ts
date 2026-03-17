import { slugify } from "@/lib/slug";
import { UserFacingError } from "@/lib/errors";
import {
  getNormalizedOnboardingReleaseDate,
  normalizeOnboardingInput,
  onboardingFormSchema,
  type OnboardingFormValues
} from "@/lib/validations/onboarding";
import { buildOnboardingWorkspacePlan } from "@/services/onboarding-helpers";

async function generateUniqueReleaseSlug(
  tx: {
    release: {
      findFirst: (args: {
        where: {
          artistProfileId: string;
          slug: string;
        };
        select: {
          id: true;
        };
      }) => Promise<{ id: string } | null>;
    };
  },
  artistProfileId: string,
  title: string
) {
  const baseSlug = slugify(title) || "untitled-release";
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (
    await tx.release.findFirst({
      where: {
        artistProfileId,
        slug: candidateSlug
      },
      select: {
        id: true
      }
    })
  ) {
    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidateSlug;
}

export async function completeOnboardingForUser(
  userId: string,
  values: OnboardingFormValues,
  today = new Date()
) {
  const parsed = onboardingFormSchema.parse(values);
  const profileInput = normalizeOnboardingInput(parsed);
  const nextReleaseDate = getNormalizedOnboardingReleaseDate(parsed);
  const plan = buildOnboardingWorkspacePlan(
    {
      ...profileInput,
      nextReleaseDate
    },
    today
  );
  const { prisma } = await import("@/db/prisma");

  return prisma.$transaction(async (tx) => {
    const existingArtistProfile = await tx.artistProfile.findUnique({
      where: {
        userId
      },
      select: {
        id: true
      }
    });

    if (existingArtistProfile) {
      throw new UserFacingError("Onboarding is already complete for this account.");
    }

    const artistProfile = await tx.artistProfile.create({
      data: {
        userId,
        ...plan.profile
      }
    });
    const releaseSlug = await generateUniqueReleaseSlug(
      tx,
      artistProfile.id,
      plan.release.title
    );
    const release = await tx.release.create({
      data: {
        artistProfileId: artistProfile.id,
        slug: releaseSlug,
        ...plan.release
      }
    });
    const campaign = await tx.campaign.create({
      data: {
        artistProfileId: artistProfile.id,
        releaseId: release.id,
        ...plan.campaign
      }
    });

    await tx.contentItem.createMany({
      data: plan.contentItems.map((item) => ({
        artistProfileId: artistProfile.id,
        campaignId: campaign.id,
        releaseId: release.id,
        ...item
      }))
    });

    await tx.task.createMany({
      data: plan.tasks.map((task) => ({
        artistProfileId: artistProfile.id,
        relatedType: task.relatedType,
        relatedId: task.relatedType === "RELEASE" ? release.id : campaign.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status
      }))
    });

    return {
      artistProfileId: artistProfile.id,
      releaseId: release.id,
      campaignId: campaign.id,
      summary: {
        contentItemCount: plan.contentItems.length,
        taskCount: plan.tasks.length
      }
    };
  });
}
