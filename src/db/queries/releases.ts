import { ReleaseStatus, ReleaseType } from "@prisma/client";

import { prisma } from "@/db/prisma";

type ReleaseListFilters = {
  status?: ReleaseStatus;
  type?: ReleaseType;
};

type CreateReleaseInput = {
  title: string;
  slug: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: Date | null;
  distributor: string | null;
  coverArtUrl: string | null;
  description: string | null;
};

type UpdateReleaseInput = CreateReleaseInput;

function buildReleaseWhereClause(
  artistProfileId: string,
  filters: ReleaseListFilters = {}
) {
  return {
    artistProfileId,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.type ? { type: filters.type } : {})
  };
}

export async function listReleasesByArtistProfileId(
  artistProfileId: string,
  filters: ReleaseListFilters = {}
) {
  return prisma.release.findMany({
    where: buildReleaseWhereClause(artistProfileId, filters),
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      status: true,
      releaseDate: true,
      distributor: true,
      updatedAt: true,
      _count: {
        select: {
          tracks: true,
          campaigns: true,
          contentItems: true
        }
      }
    },
    orderBy: [
      { releaseDate: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" }
    ]
  });
}

export async function listReleaseOptionsByArtistProfileId(artistProfileId: string) {
  return prisma.release.findMany({
    where: { artistProfileId },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      releaseDate: true
    },
    orderBy: [
      { releaseDate: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" }
    ]
  });
}

export async function createRelease(
  artistProfileId: string,
  data: CreateReleaseInput
) {
  return prisma.release.create({
    data: {
      artistProfileId,
      ...data
    }
  });
}

export async function updateRelease(
  artistProfileId: string,
  releaseId: string,
  data: UpdateReleaseInput
) {
  const result = await prisma.release.updateMany({
    where: {
      artistProfileId,
      id: releaseId
    },
    data
  });

  return result.count;
}

export async function deleteRelease(artistProfileId: string, releaseId: string) {
  const result = await prisma.release.deleteMany({
    where: {
      artistProfileId,
      id: releaseId
    }
  });

  return result.count;
}

export async function isReleaseSlugTaken(
  artistProfileId: string,
  slug: string,
  excludeReleaseId?: string
) {
  const existingRelease = await prisma.release.findFirst({
    where: {
      artistProfileId,
      slug,
      ...(excludeReleaseId ? { id: { not: excludeReleaseId } } : {})
    },
    select: { id: true }
  });

  return Boolean(existingRelease);
}

export async function getReleaseSummaryById(
  artistProfileId: string,
  releaseId: string
) {
  return prisma.release.findFirst({
    where: {
      artistProfileId,
      id: releaseId
    },
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      status: true,
      releaseDate: true,
      distributor: true,
      coverArtUrl: true,
      description: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function getReleaseById(
  artistProfileId: string,
  releaseId: string
) {
  return prisma.release.findFirst({
    where: {
      artistProfileId,
      id: releaseId
    },
    include: {
      tracks: {
        orderBy: [{ createdAt: "asc" }]
      },
      campaigns: {
        select: {
          id: true,
          name: true,
          objective: true,
          status: true,
          startDate: true,
          endDate: true,
          budget: true,
          notes: true
        },
        orderBy: [{ startDate: "asc" }]
      },
      contentItems: {
        select: {
          id: true,
          title: true,
          platform: true,
          format: true,
          status: true,
          dueDate: true,
          publishedAt: true,
          campaign: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }]
      }
    }
  });
}
