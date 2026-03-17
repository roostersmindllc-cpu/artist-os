import { Prisma } from "@prisma/client";

import {
  getArtistProfileDetailsByUserId,
  updateArtistProfileByUserId
} from "@/db/queries/artist-profiles";
import {
  getUserById,
  isUserEmailTaken,
  updateUserById
} from "@/db/queries/users";
import {
  accountSettingsFormSchema,
  artistProfileSettingsFormSchema,
  normalizeAccountSettingsInput,
  normalizeArtistProfileSettingsInput,
  preferencesFormSchema,
  type AccountSettingsFormValues,
  type ArtistProfileSettingsFormValues,
  type PreferencesFormValues
} from "@/lib/validations/settings";
import { UserFacingError } from "@/lib/errors";
import { getIntegrationPlaceholdersForUser } from "@/services/integrations/registry";
import type { SettingsOverviewDto } from "@/services/settings-types";
import {
  getUserPreferences,
  saveUserPreferences
} from "@/services/user-preferences-service";

async function requireSettingsUser(userId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new UserFacingError("User could not be found.");
  }

  return user;
}

async function requireSettingsArtistProfile(userId: string) {
  const artistProfile = await getArtistProfileDetailsByUserId(userId);

  if (!artistProfile) {
    throw new UserFacingError("Artist profile could not be found.");
  }

  return artistProfile;
}

async function assertUserEmailAvailable(email: string, userId: string) {
  const emailTaken = await isUserEmailTaken(email, userId);

  if (emailTaken) {
    throw new UserFacingError("An account with this email already exists.");
  }
}

export async function getSettingsOverviewForUser(
  userId: string
): Promise<SettingsOverviewDto> {
  const [user, artistProfile, preferences, integrations] = await Promise.all([
    requireSettingsUser(userId),
    requireSettingsArtistProfile(userId),
    getUserPreferences(userId),
    getIntegrationPlaceholdersForUser(userId)
  ]);

  return {
    account: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    artistProfile: {
      id: artistProfile.id,
      artistName: artistProfile.artistName,
      genre: artistProfile.genre,
      bio: artistProfile.bio,
      goals: artistProfile.goals,
      audienceSize: artistProfile.audienceSize,
      socialPlatforms: artistProfile.socialPlatforms,
      platformsUsed: artistProfile.platformsUsed,
      counts: {
        releases: artistProfile._count.releases,
        campaigns: artistProfile._count.campaigns,
        contentItems: artistProfile._count.contentItems,
        fans: artistProfile._count.fans,
        tasks: artistProfile._count.tasks,
        metricSnapshots: artistProfile._count.metricSnapshots
      }
    },
    preferences,
    integrations,
    accountDeletion: {
      enabled: false,
      reason:
        "A secure account deletion workflow has not been implemented yet, so this action stays disabled until export, cleanup, and session invalidation exist.",
      confirmationLabel: "DELETE MY ACCOUNT"
    }
  };
}

export async function updateAccountSettingsForUser(
  userId: string,
  values: AccountSettingsFormValues
) {
  const parsed = accountSettingsFormSchema.parse(values);
  const normalizedInput = normalizeAccountSettingsInput(parsed);
  await requireSettingsUser(userId);
  await assertUserEmailAvailable(normalizedInput.email, userId);

  try {
    return await updateUserById(userId, normalizedInput);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new UserFacingError("An account with this email already exists.");
    }

    throw error;
  }
}

export async function updateArtistProfileSettingsForUser(
  userId: string,
  values: ArtistProfileSettingsFormValues
) {
  const parsed = artistProfileSettingsFormSchema.parse(values);
  await requireSettingsArtistProfile(userId);

  return updateArtistProfileByUserId(
    userId,
    normalizeArtistProfileSettingsInput(parsed)
  );
}

export async function updatePreferencesForUser(
  userId: string,
  values: PreferencesFormValues
) {
  const parsed = preferencesFormSchema.parse(values);
  return saveUserPreferences(userId, parsed);
}
