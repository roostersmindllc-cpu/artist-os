import { prisma } from "@/db/prisma";

type FanListFilters = {
  query?: string;
  tag?: string;
  city?: string;
};

type CreateFanInput = {
  name: string;
  email: string | null;
  handle: string | null;
  city: string | null;
  tags: string[];
  engagementScore: number;
  notes: string | null;
};

type UpdateFanInput = CreateFanInput;

function buildFanWhereClause(
  artistProfileId: string,
  filters: FanListFilters = {}
) {
  return {
    artistProfileId,
    ...(filters.query
      ? {
          OR: [
            { name: { contains: filters.query, mode: "insensitive" as const } },
            { email: { contains: filters.query, mode: "insensitive" as const } },
            { handle: { contains: filters.query, mode: "insensitive" as const } },
            { city: { contains: filters.query, mode: "insensitive" as const } }
          ]
        }
      : {}),
    ...(filters.tag ? { tags: { has: filters.tag.toLowerCase() } } : {}),
    ...(filters.city ? { city: { equals: filters.city, mode: "insensitive" as const } } : {})
  };
}

export async function listFansByArtistProfileId(
  artistProfileId: string,
  filters: FanListFilters = {}
) {
  return prisma.fan.findMany({
    where: buildFanWhereClause(artistProfileId, filters),
    select: {
      id: true,
      name: true,
      email: true,
      handle: true,
      city: true,
      tags: true,
      engagementScore: true,
      notes: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: [{ engagementScore: "desc" }, { createdAt: "desc" }]
  });
}

export async function listFanFilterOptionsByArtistProfileId(artistProfileId: string) {
  return prisma.fan.findMany({
    where: { artistProfileId },
    select: {
      city: true,
      tags: true
    }
  });
}

export async function createFan(artistProfileId: string, data: CreateFanInput) {
  return prisma.fan.create({
    data: {
      artistProfileId,
      ...data
    }
  });
}

export async function updateFan(
  artistProfileId: string,
  fanId: string,
  data: UpdateFanInput
) {
  const result = await prisma.fan.updateMany({
    where: {
      artistProfileId,
      id: fanId
    },
    data
  });

  return result.count;
}

export async function deleteFan(artistProfileId: string, fanId: string) {
  const result = await prisma.fan.deleteMany({
    where: {
      artistProfileId,
      id: fanId
    }
  });

  return result.count;
}

export async function getFanById(artistProfileId: string, fanId: string) {
  return prisma.fan.findFirst({
    where: {
      artistProfileId,
      id: fanId
    }
  });
}

export async function getFanSummaryById(artistProfileId: string, fanId: string) {
  return prisma.fan.findFirst({
    where: {
      artistProfileId,
      id: fanId
    },
    select: {
      id: true,
      email: true
    }
  });
}

export async function isFanEmailTaken(
  artistProfileId: string,
  email: string,
  excludeFanId?: string
) {
  const existingFan = await prisma.fan.findFirst({
    where: {
      artistProfileId,
      email,
      ...(excludeFanId ? { id: { not: excludeFanId } } : {})
    },
    select: { id: true }
  });

  return Boolean(existingFan);
}
