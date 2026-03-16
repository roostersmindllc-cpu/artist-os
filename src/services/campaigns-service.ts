import {
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaignSummaryById,
  listCampaignsByArtistProfileId,
  updateCampaign
} from "@/db/queries/campaigns";
import { getReleaseSummaryById, listReleaseOptionsByArtistProfileId } from "@/db/queries/releases";
import { listTasksByRelatedCampaignId } from "@/db/queries/tasks";
import {
  buildCampaignFormValues,
  campaignFormSchema,
  type CampaignFormValues,
  type CampaignListFiltersValues,
  normalizeCampaignInput
} from "@/lib/validations/campaigns";
import {
  buildCampaignBudgetSummary,
  buildCampaignTimeline
} from "@/services/campaigns-helpers";
import type {
  CampaignDetailDto,
  CampaignListItemDto,
  CampaignReleaseOptionDto
} from "@/services/campaigns-types";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";

async function requireCampaignForUser(userId: string, campaignId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const campaign = await getCampaignById(artistProfile.id, campaignId);

  if (!campaign) {
    throw new Error("Campaign could not be found.");
  }

  return {
    artistProfile,
    campaign
  };
}

async function assertLinkedReleaseExists(
  artistProfileId: string,
  releaseId: string | null
) {
  if (!releaseId) {
    return null;
  }

  const release = await getReleaseSummaryById(artistProfileId, releaseId);

  if (!release) {
    throw new Error("Linked release could not be found.");
  }

  return release;
}

function mapReleaseOption(
  release: Awaited<ReturnType<typeof listReleaseOptionsByArtistProfileId>>[number]
): CampaignReleaseOptionDto {
  return {
    id: release.id,
    title: release.title,
    type: release.type,
    status: release.status,
    releaseDate: release.releaseDate
  };
}

function mapCampaignListItem(
  campaign: Awaited<ReturnType<typeof listCampaignsByArtistProfileId>>[number]
): CampaignListItemDto {
  return {
    id: campaign.id,
    name: campaign.name,
    objective: campaign.objective,
    budget: campaign.budget,
    status: campaign.status,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    updatedAt: campaign.updatedAt,
    release: campaign.release
      ? {
          id: campaign.release.id,
          title: campaign.release.title,
          type: campaign.release.type,
          status: campaign.release.status,
          releaseDate: campaign.release.releaseDate
        }
      : null,
    contentItemsCount: campaign._count.contentItems
  };
}

export async function getCampaignsForUser(
  userId: string,
  filters: CampaignListFiltersValues = {}
): Promise<CampaignListItemDto[]> {
  const artistProfile = await requireArtistProfileForUser(userId);
  const campaigns = await listCampaignsByArtistProfileId(artistProfile.id, filters);
  return campaigns.map(mapCampaignListItem);
}

export async function getCampaignReleaseOptionsForUser(
  userId: string
): Promise<CampaignReleaseOptionDto[]> {
  const artistProfile = await requireArtistProfileForUser(userId);
  const releases = await listReleaseOptionsByArtistProfileId(artistProfile.id);
  return releases.map(mapReleaseOption);
}

export async function createCampaignForUser(
  userId: string,
  values: CampaignFormValues
) {
  const parsed = campaignFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const normalizedInput = normalizeCampaignInput(parsed);
  await assertLinkedReleaseExists(artistProfile.id, normalizedInput.releaseId);

  return createCampaign(artistProfile.id, normalizedInput);
}

export async function updateCampaignForUser(
  userId: string,
  campaignId: string,
  values: CampaignFormValues
) {
  const parsed = campaignFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const existingCampaign = await getCampaignSummaryById(artistProfile.id, campaignId);

  if (!existingCampaign) {
    throw new Error("Campaign could not be found.");
  }

  const normalizedInput = normalizeCampaignInput(parsed);
  await assertLinkedReleaseExists(artistProfile.id, normalizedInput.releaseId);

  const updatedCount = await updateCampaign(artistProfile.id, campaignId, normalizedInput);

  if (updatedCount === 0) {
    throw new Error("Campaign could not be updated.");
  }

  return {
    campaignId,
    previousReleaseId: existingCampaign.releaseId,
    nextReleaseId: normalizedInput.releaseId,
    values: buildCampaignFormValues({
      ...existingCampaign,
      ...normalizedInput
    })
  };
}

export async function deleteCampaignForUser(userId: string, campaignId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const existingCampaign = await getCampaignSummaryById(artistProfile.id, campaignId);

  if (!existingCampaign) {
    throw new Error("Campaign could not be found.");
  }

  const deletedCount = await deleteCampaign(artistProfile.id, campaignId);

  if (deletedCount === 0) {
    throw new Error("Campaign could not be deleted.");
  }

  return {
    campaignId,
    releaseId: existingCampaign.releaseId
  };
}

export async function getCampaignDetailForUser(
  userId: string,
  campaignId: string
): Promise<CampaignDetailDto> {
  const { artistProfile, campaign } = await requireCampaignForUser(userId, campaignId);
  const tasks = await listTasksByRelatedCampaignId(artistProfile.id, campaignId);
  const openTasksCount = tasks.filter(
    (task) => task.status !== "DONE" && task.status !== "CANCELED"
  ).length;

  return {
    id: campaign.id,
    releaseId: campaign.releaseId,
    name: campaign.name,
    objective: campaign.objective,
    budget: campaign.budget,
    status: campaign.status,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    notes: campaign.notes,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    release: campaign.release
      ? {
          id: campaign.release.id,
          title: campaign.release.title,
          type: campaign.release.type,
          status: campaign.release.status,
          releaseDate: campaign.release.releaseDate
        }
      : null,
    contentItems: campaign.contentItems.map((item) => ({
      id: item.id,
      title: item.title,
      platform: item.platform,
      format: item.format,
      status: item.status,
      dueDate: item.dueDate,
      publishedAt: item.publishedAt,
      release: item.release
        ? {
            id: item.release.id,
            title: item.release.title,
            type: item.release.type,
            status: item.release.status,
            releaseDate: item.release.releaseDate
          }
        : null
    })),
    tasks: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    })),
    timeline: buildCampaignTimeline({
      campaign: {
        id: campaign.id,
        name: campaign.name,
        startDate: campaign.startDate,
        endDate: campaign.endDate
      },
      release: campaign.release
        ? {
            id: campaign.release.id,
            title: campaign.release.title,
            releaseDate: campaign.release.releaseDate
          }
        : null,
      contentItems: campaign.contentItems.map((item) => ({
        id: item.id,
        title: item.title,
        platform: item.platform,
        dueDate: item.dueDate,
        publishedAt: item.publishedAt
      })),
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status
      }))
    }),
    summary: buildCampaignBudgetSummary({
      budget: campaign.budget,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      contentItemsCount: campaign.contentItems.length,
      openTasksCount
    })
  };
}
