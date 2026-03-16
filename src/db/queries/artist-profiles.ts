import { prisma } from "@/db/prisma";

type UpsertArtistProfileInput = {
  artistName: string;
  genre: string;
  bio: string;
  goals: string[];
};

export async function getArtistProfileByUserId(userId: string) {
  return prisma.artistProfile.findUnique({
    where: { userId }
  });
}

export async function getArtistProfileDetailsByUserId(userId: string) {
  return prisma.artistProfile.findUnique({
    where: { userId },
    include: {
      _count: {
        select: {
          releases: true,
          campaigns: true,
          contentItems: true,
          fans: true,
          tasks: true,
          metricSnapshots: true
        }
      }
    }
  });
}

export async function upsertArtistProfileByUserId(
  userId: string,
  data: UpsertArtistProfileInput
) {
  return prisma.artistProfile.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data
    }
  });
}

export async function updateArtistProfileByUserId(
  userId: string,
  data: UpsertArtistProfileInput
) {
  return prisma.artistProfile.update({
    where: { userId },
    data
  });
}
