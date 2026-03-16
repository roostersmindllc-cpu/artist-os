import { CampaignStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";

type CampaignListFilters = {
  status?: CampaignStatus;
};

type CreateCampaignInput = {
  releaseId: string | null;
  name: string;
  objective: string;
  budget: number | null;
  startDate: Date;
  endDate: Date | null;
  status: CampaignStatus;
  notes: string | null;
};

type UpdateCampaignInput = CreateCampaignInput;

function buildCampaignWhereClause(
  artistProfileId: string,
  filters: CampaignListFilters = {}
) {
  return {
    artistProfileId,
    ...(filters.status ? { status: filters.status } : {})
  };
}

export async function listCampaignsByArtistProfileId(
  artistProfileId: string,
  filters: CampaignListFilters = {}
) {
  return prisma.campaign.findMany({
    where: buildCampaignWhereClause(artistProfileId, filters),
    select: {
      id: true,
      name: true,
      objective: true,
      budget: true,
      status: true,
      startDate: true,
      endDate: true,
      updatedAt: true,
      release: {
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          releaseDate: true
        }
      },
      _count: {
        select: {
          contentItems: true
        }
      }
    },
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }]
  });
}

export async function listCampaignOptionsByArtistProfileId(artistProfileId: string) {
  return prisma.campaign.findMany({
    where: { artistProfileId },
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
    },
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }]
  });
}

export async function createCampaign(
  artistProfileId: string,
  data: CreateCampaignInput
) {
  return prisma.campaign.create({
    data: {
      artistProfileId,
      ...data
    }
  });
}

export async function updateCampaign(
  artistProfileId: string,
  campaignId: string,
  data: UpdateCampaignInput
) {
  const result = await prisma.campaign.updateMany({
    where: {
      artistProfileId,
      id: campaignId
    },
    data
  });

  return result.count;
}

export async function deleteCampaign(artistProfileId: string, campaignId: string) {
  const result = await prisma.campaign.deleteMany({
    where: {
      artistProfileId,
      id: campaignId
    }
  });

  return result.count;
}

export async function getCampaignSummaryById(
  artistProfileId: string,
  campaignId: string
) {
  return prisma.campaign.findFirst({
    where: {
      artistProfileId,
      id: campaignId
    },
    select: {
      id: true,
      releaseId: true,
      name: true,
      objective: true,
      budget: true,
      status: true,
      startDate: true,
      endDate: true,
      notes: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function getCampaignById(
  artistProfileId: string,
  campaignId: string
) {
  return prisma.campaign.findFirst({
    where: {
      artistProfileId,
      id: campaignId
    },
    select: {
      id: true,
      releaseId: true,
      name: true,
      objective: true,
      budget: true,
      status: true,
      startDate: true,
      endDate: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      release: {
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          releaseDate: true
        }
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
      }
    }
  });
}
