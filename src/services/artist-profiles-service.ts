import {
  getArtistProfileByUserId,
  getArtistProfileDetailsByUserId,
  upsertArtistProfileByUserId
} from "@/db/queries/artist-profiles";
import {
  normalizeOnboardingInput,
  onboardingFormSchema,
  type OnboardingFormValues
} from "@/lib/validations/onboarding";

export class ArtistProfileRequiredError extends Error {
  constructor() {
    super("Complete onboarding to continue.");
  }
}

export async function getArtistProfileForUser(userId: string) {
  return getArtistProfileByUserId(userId);
}

export async function requireArtistProfileForUser(userId: string) {
  const artistProfile = await getArtistProfileForUser(userId);

  if (!artistProfile) {
    throw new ArtistProfileRequiredError();
  }

  return artistProfile;
}

export async function hasArtistProfileForUser(userId: string) {
  return Boolean(await getArtistProfileForUser(userId));
}

export async function completeArtistOnboardingForUser(
  userId: string,
  values: OnboardingFormValues
) {
  const parsed = onboardingFormSchema.parse(values);
  return upsertArtistProfileByUserId(userId, normalizeOnboardingInput(parsed));
}

export async function getArtistProfileOverviewForUser(userId: string) {
  return getArtistProfileDetailsByUserId(userId);
}
