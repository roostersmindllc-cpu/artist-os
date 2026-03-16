import { listCampaignOptionsByArtistProfileId } from "@/db/queries/campaigns";
import {
  createContentItem,
  deleteContentItem,
  getContentItemById,
  getContentItemSummaryById,
  listContentItemsByArtistProfileId,
  updateContentItem
} from "@/db/queries/content";
import { getReleaseSummaryById, listReleaseOptionsByArtistProfileId } from "@/db/queries/releases";
import {
  buildContentFormValues,
  contentFormSchema,
  type ContentFormValues,
  type ContentPlannerFiltersValues,
  normalizeContentInput
} from "@/lib/validations/content";
import {
  buildContentPlannerRange,
  getContentRoute
} from "@/services/content-helpers";
import type {
  ContentCampaignOptionDto,
  ContentDetailDto,
  ContentPlannerItemDto,
  ContentPlannerOptionsDto,
  ContentPlannerView,
  ContentReleaseOptionDto
} from "@/services/content-types";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";

async function assertLinkedCampaignExists(
  artistProfileId: string,
  campaignId: string | null
) {
  if (!campaignId) {
    return null;
  }

  const campaigns = await listCampaignOptionsByArtistProfileId(artistProfileId);
  const campaign = campaigns.find((item) => item.id === campaignId);

  if (!campaign) {
    throw new Error("Linked campaign could not be found.");
  }

  return campaign;
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

function mapPlannerItem(
  item: Awaited<ReturnType<typeof listContentItemsByArtistProfileId>>[number]
): ContentPlannerItemDto {
  return {
    id: item.id,
    campaignId: item.campaignId,
    releaseId: item.releaseId,
    platform: item.platform,
    format: item.format,
    title: item.title,
    caption: item.caption,
    dueDate: item.dueDate,
    publishedAt: item.publishedAt,
    status: item.status,
    assetUrl: item.assetUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    href: getContentRoute(item.id),
    campaign: item.campaign
      ? {
          id: item.campaign.id,
          name: item.campaign.name,
          status: item.campaign.status,
          startDate: item.campaign.startDate,
          endDate: item.campaign.endDate
        }
      : null,
    release: item.release
      ? {
          id: item.release.id,
          title: item.release.title,
          type: item.release.type,
          status: item.release.status,
          releaseDate: item.release.releaseDate
        }
      : null
  };
}

function mapCampaignOption(
  option: Awaited<ReturnType<typeof listCampaignOptionsByArtistProfileId>>[number]
): ContentCampaignOptionDto {
  return {
    id: option.id,
    name: option.name,
    status: option.status,
    startDate: option.startDate,
    endDate: option.endDate,
    release: option.release
      ? {
          id: option.release.id,
          title: option.release.title
        }
      : null
  };
}

function mapReleaseOption(
  option: Awaited<ReturnType<typeof listReleaseOptionsByArtistProfileId>>[number]
): ContentReleaseOptionDto {
  return {
    id: option.id,
    title: option.title,
    type: option.type,
    status: option.status,
    releaseDate: option.releaseDate
  };
}

async function requireContentItemForUser(userId: string, contentItemId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const contentItem = await getContentItemById(artistProfile.id, contentItemId);

  if (!contentItem) {
    throw new Error("Content item could not be found.");
  }

  return {
    artistProfile,
    contentItem
  };
}

export async function getContentPlannerForUser(
  userId: string,
  view: ContentPlannerView,
  anchorDate: Date,
  filters: ContentPlannerFiltersValues = {}
) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const range = buildContentPlannerRange(view, anchorDate);
  const [items, campaigns, releases] = await Promise.all([
    listContentItemsByArtistProfileId(artistProfile.id, filters, {
      start: range.start,
      end: range.end
    }),
    listCampaignOptionsByArtistProfileId(artistProfile.id),
    listReleaseOptionsByArtistProfileId(artistProfile.id)
  ]);

  return {
    range,
    items: items.map(mapPlannerItem),
    options: {
      campaigns: campaigns.map(mapCampaignOption),
      releases: releases.map(mapReleaseOption)
    } satisfies ContentPlannerOptionsDto
  };
}

export async function getContentPlannerOptionsForUser(
  userId: string
): Promise<ContentPlannerOptionsDto> {
  const artistProfile = await requireArtistProfileForUser(userId);
  const [campaigns, releases] = await Promise.all([
    listCampaignOptionsByArtistProfileId(artistProfile.id),
    listReleaseOptionsByArtistProfileId(artistProfile.id)
  ]);

  return {
    campaigns: campaigns.map(mapCampaignOption),
    releases: releases.map(mapReleaseOption)
  };
}

export async function createContentItemForUser(userId: string, values: ContentFormValues) {
  const parsed = contentFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const normalizedInput = normalizeContentInput(parsed);

  await Promise.all([
    assertLinkedCampaignExists(artistProfile.id, normalizedInput.campaignId),
    assertLinkedReleaseExists(artistProfile.id, normalizedInput.releaseId)
  ]);

  return createContentItem(artistProfile.id, normalizedInput);
}

export async function updateContentItemForUser(
  userId: string,
  contentItemId: string,
  values: ContentFormValues
) {
  const parsed = contentFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const existingContentItem = await getContentItemSummaryById(artistProfile.id, contentItemId);

  if (!existingContentItem) {
    throw new Error("Content item could not be found.");
  }

  const normalizedInput = normalizeContentInput(parsed);

  await Promise.all([
    assertLinkedCampaignExists(artistProfile.id, normalizedInput.campaignId),
    assertLinkedReleaseExists(artistProfile.id, normalizedInput.releaseId)
  ]);

  const updatedCount = await updateContentItem(
    artistProfile.id,
    contentItemId,
    normalizedInput
  );

  if (updatedCount === 0) {
    throw new Error("Content item could not be updated.");
  }

  return {
    contentItemId,
    previousCampaignId: existingContentItem.campaignId,
    nextCampaignId: normalizedInput.campaignId,
    previousReleaseId: existingContentItem.releaseId,
    nextReleaseId: normalizedInput.releaseId,
    values: buildContentFormValues({
      ...existingContentItem,
      ...normalizedInput
    })
  };
}

export async function deleteContentItemForUser(userId: string, contentItemId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const existingContentItem = await getContentItemSummaryById(artistProfile.id, contentItemId);

  if (!existingContentItem) {
    throw new Error("Content item could not be found.");
  }

  const deletedCount = await deleteContentItem(artistProfile.id, contentItemId);

  if (deletedCount === 0) {
    throw new Error("Content item could not be deleted.");
  }

  return {
    contentItemId,
    campaignId: existingContentItem.campaignId,
    releaseId: existingContentItem.releaseId
  };
}

export async function getContentItemDetailForUser(
  userId: string,
  contentItemId: string
): Promise<ContentDetailDto> {
  const { contentItem } = await requireContentItemForUser(userId, contentItemId);

  return {
    id: contentItem.id,
    campaignId: contentItem.campaignId,
    releaseId: contentItem.releaseId,
    platform: contentItem.platform,
    format: contentItem.format,
    title: contentItem.title,
    caption: contentItem.caption,
    dueDate: contentItem.dueDate,
    publishedAt: contentItem.publishedAt,
    status: contentItem.status,
    assetUrl: contentItem.assetUrl,
    createdAt: contentItem.createdAt,
    updatedAt: contentItem.updatedAt,
    href: getContentRoute(contentItem.id),
    campaign: contentItem.campaign
      ? {
          id: contentItem.campaign.id,
          name: contentItem.campaign.name,
          status: contentItem.campaign.status,
          startDate: contentItem.campaign.startDate,
          endDate: contentItem.campaign.endDate
        }
      : null,
    release: contentItem.release
      ? {
          id: contentItem.release.id,
          title: contentItem.release.title,
          type: contentItem.release.type,
          status: contentItem.release.status,
          releaseDate: contentItem.release.releaseDate
        }
      : null
  };
}
