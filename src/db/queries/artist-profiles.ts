import { Prisma } from "@prisma/client";

import { prisma } from "@/db/prisma";

type UpsertArtistProfileInput = {
  artistName: string;
  genre?: string | null;
  bio?: string | null;
  goals?: string[];
  audienceSize?: number | null;
  socialPlatforms?: string[];
  platformsUsed?: string[];
};

const artistProfileCountSelect = {
  releases: true,
  campaigns: true,
  contentItems: true,
  fans: true,
  tasks: true,
  metricSnapshots: true
} as const;

const legacyArtistProfileSelect = {
  id: true,
  userId: true,
  artistName: true,
  genre: true,
  bio: true,
  goals: true,
  createdAt: true,
  updatedAt: true
} as const;

const fullArtistProfileSelect = {
  ...legacyArtistProfileSelect,
  audienceSize: true,
  socialPlatforms: true,
  platformsUsed: true
} as const;

function isMissingArtistProfileFieldError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2022") {
    return false;
  }

  const missingColumn = String(error.meta?.column ?? "");

  return ["audienceSize", "socialPlatforms", "platformsUsed"].some((field) =>
    missingColumn.includes(field)
  );
}

function withLegacyArtistProfileDefaults<
  T extends Record<string, unknown> | null
>(artistProfile: T): T extends null
  ? null
  : T & {
      audienceSize: number | null;
      socialPlatforms: string[];
      platformsUsed: string[];
    } {
  if (!artistProfile) {
    return artistProfile as T extends null
      ? null
      : T & {
          audienceSize: number | null;
          socialPlatforms: string[];
          platformsUsed: string[];
        };
  }

  return {
    ...artistProfile,
    audienceSize: artistProfile.audienceSize ?? null,
    socialPlatforms: artistProfile.socialPlatforms ?? [],
    platformsUsed: artistProfile.platformsUsed ?? []
  } as T extends null
    ? null
    : T & {
        audienceSize: number | null;
        socialPlatforms: string[];
        platformsUsed: string[];
      };
}

function stripExtendedArtistProfileFields(data: UpsertArtistProfileInput) {
  const legacyData = { ...data };
  delete legacyData.audienceSize;
  delete legacyData.socialPlatforms;
  delete legacyData.platformsUsed;
  return legacyData;
}

export async function getArtistProfileByUserId(userId: string) {
  try {
    return await prisma.artistProfile.findUnique({
      where: { userId },
      select: fullArtistProfileSelect
    });
  } catch (error) {
    if (!isMissingArtistProfileFieldError(error)) {
      throw error;
    }

    const legacyArtistProfile = await prisma.artistProfile.findUnique({
      where: { userId },
      select: legacyArtistProfileSelect
    });

    return withLegacyArtistProfileDefaults(legacyArtistProfile);
  }
}

export async function getArtistProfileDetailsByUserId(userId: string) {
  try {
    return await prisma.artistProfile.findUnique({
      where: { userId },
      select: {
        ...fullArtistProfileSelect,
        _count: {
          select: artistProfileCountSelect
        }
      }
    });
  } catch (error) {
    if (!isMissingArtistProfileFieldError(error)) {
      throw error;
    }

    const legacyArtistProfile = await prisma.artistProfile.findUnique({
      where: { userId },
      select: {
        ...legacyArtistProfileSelect,
        _count: {
          select: artistProfileCountSelect
        }
      }
    });

    return withLegacyArtistProfileDefaults(legacyArtistProfile);
  }
}

export async function upsertArtistProfileByUserId(
  userId: string,
  data: UpsertArtistProfileInput
) {
  try {
    return await prisma.artistProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data
      }
    });
  } catch (error) {
    if (!isMissingArtistProfileFieldError(error)) {
      throw error;
    }

    const legacyData = stripExtendedArtistProfileFields(data);

    return prisma.artistProfile.upsert({
      where: { userId },
      update: legacyData,
      create: {
        userId,
        ...legacyData
      }
    });
  }
}

export async function updateArtistProfileByUserId(
  userId: string,
  data: UpsertArtistProfileInput
) {
  try {
    return await prisma.artistProfile.update({
      where: { userId },
      data
    });
  } catch (error) {
    if (!isMissingArtistProfileFieldError(error)) {
      throw error;
    }

    return prisma.artistProfile.update({
      where: { userId },
      data: stripExtendedArtistProfileFields(data)
    });
  }
}
