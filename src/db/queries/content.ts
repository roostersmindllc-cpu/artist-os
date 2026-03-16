import { ContentFormat, ContentPlatform, ContentStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";

type ContentPlannerFilters = {
  platform?: ContentPlatform;
  status?: ContentStatus;
  campaignId?: string;
  releaseId?: string;
};

type ContentRange = {
  start: Date;
  end: Date;
};

type CreateContentItemInput = {
  campaignId: string | null;
  releaseId: string | null;
  platform: ContentPlatform;
  format: ContentFormat;
  title: string;
  caption: string | null;
  dueDate: Date;
  publishedAt: Date | null;
  status: ContentStatus;
  assetUrl: string | null;
};

type UpdateContentItemInput = CreateContentItemInput;

function buildContentWhereClause(
  artistProfileId: string,
  filters: ContentPlannerFilters = {},
  range?: ContentRange
) {
  return {
    artistProfileId,
    ...(filters.platform ? { platform: filters.platform } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.campaignId ? { campaignId: filters.campaignId } : {}),
    ...(filters.releaseId ? { releaseId: filters.releaseId } : {}),
    ...(range
      ? {
          dueDate: {
            gte: range.start,
            lte: range.end
          }
        }
      : {})
  };
}

export async function listContentItemsByArtistProfileId(
  artistProfileId: string,
  filters: ContentPlannerFilters = {},
  range?: ContentRange
) {
  return prisma.contentItem.findMany({
    where: buildContentWhereClause(artistProfileId, filters, range),
    select: {
      id: true,
      campaignId: true,
      releaseId: true,
      platform: true,
      format: true,
      title: true,
      caption: true,
      dueDate: true,
      publishedAt: true,
      status: true,
      assetUrl: true,
      createdAt: true,
      updatedAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          status: true,
          startDate: true,
          endDate: true
        }
      },
      release: {
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          releaseDate: true
        }
      }
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }]
  });
}

export async function createContentItem(
  artistProfileId: string,
  data: CreateContentItemInput
) {
  return prisma.contentItem.create({
    data: {
      artistProfileId,
      ...data
    }
  });
}

export async function updateContentItem(
  artistProfileId: string,
  contentItemId: string,
  data: UpdateContentItemInput
) {
  const result = await prisma.contentItem.updateMany({
    where: {
      artistProfileId,
      id: contentItemId
    },
    data
  });

  return result.count;
}

export async function deleteContentItem(
  artistProfileId: string,
  contentItemId: string
) {
  const result = await prisma.contentItem.deleteMany({
    where: {
      artistProfileId,
      id: contentItemId
    }
  });

  return result.count;
}

export async function getContentItemSummaryById(
  artistProfileId: string,
  contentItemId: string
) {
  return prisma.contentItem.findFirst({
    where: {
      artistProfileId,
      id: contentItemId
    },
    select: {
      id: true,
      campaignId: true,
      releaseId: true,
      platform: true,
      format: true,
      title: true,
      caption: true,
      dueDate: true,
      publishedAt: true,
      status: true,
      assetUrl: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function getContentItemById(
  artistProfileId: string,
  contentItemId: string
) {
  return prisma.contentItem.findFirst({
    where: {
      artistProfileId,
      id: contentItemId
    },
    select: {
      id: true,
      campaignId: true,
      releaseId: true,
      platform: true,
      format: true,
      title: true,
      caption: true,
      dueDate: true,
      publishedAt: true,
      status: true,
      assetUrl: true,
      createdAt: true,
      updatedAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          status: true,
          startDate: true,
          endDate: true,
          release: {
            select: {
              id: true,
              title: true
            }
          }
        }
      },
      release: {
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          releaseDate: true
        }
      }
    }
  });
}
