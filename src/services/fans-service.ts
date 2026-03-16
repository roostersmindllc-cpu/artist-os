import {
  createFan,
  deleteFan,
  getFanById,
  getFanSummaryById,
  isFanEmailTaken,
  listFanFilterOptionsByArtistProfileId,
  listFansByArtistProfileId,
  updateFan
} from "@/db/queries/fans";
import {
  buildFanFormValues,
  fanFormSchema,
  type FanFormValues,
  type FanListFiltersValues,
  normalizeFanInput
} from "@/lib/validations/fans";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";
import { collectFanFilterOptions, getFanRoute } from "@/services/fans-helpers";
import type {
  FanDetailDto,
  FanFilterOptionsDto,
  FanListItemDto
} from "@/services/fans-types";

function mapFan(
  fan: Awaited<ReturnType<typeof listFansByArtistProfileId>>[number]
): FanListItemDto {
  return {
    id: fan.id,
    name: fan.name,
    email: fan.email,
    handle: fan.handle,
    city: fan.city,
    tags: fan.tags,
    engagementScore: fan.engagementScore,
    notes: fan.notes,
    createdAt: fan.createdAt,
    updatedAt: fan.updatedAt,
    href: getFanRoute(fan.id)
  };
}

async function assertFanEmailAvailable(
  artistProfileId: string,
  email: string | null,
  excludeFanId?: string
) {
  if (!email) {
    return;
  }

  const emailTaken = await isFanEmailTaken(artistProfileId, email, excludeFanId);

  if (emailTaken) {
    throw new Error("A fan with this email already exists.");
  }
}

async function requireFanForUser(userId: string, fanId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const fan = await getFanById(artistProfile.id, fanId);

  if (!fan) {
    throw new Error("Fan could not be found.");
  }

  return {
    artistProfile,
    fan
  };
}

export async function getFansForUser(
  userId: string,
  filters: FanListFiltersValues = {}
): Promise<FanListItemDto[]> {
  const artistProfile = await requireArtistProfileForUser(userId);
  const fans = await listFansByArtistProfileId(artistProfile.id, filters);
  return fans.map(mapFan);
}

export async function getFanFilterOptionsForUser(
  userId: string
): Promise<FanFilterOptionsDto> {
  const artistProfile = await requireArtistProfileForUser(userId);
  const rows = await listFanFilterOptionsByArtistProfileId(artistProfile.id);
  return collectFanFilterOptions(rows);
}

export async function createFanForUser(userId: string, values: FanFormValues) {
  const parsed = fanFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const normalizedInput = normalizeFanInput(parsed);
  await assertFanEmailAvailable(artistProfile.id, normalizedInput.email);
  return createFan(artistProfile.id, normalizedInput);
}

export async function updateFanForUser(
  userId: string,
  fanId: string,
  values: FanFormValues
) {
  const parsed = fanFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const existingFan = await getFanSummaryById(artistProfile.id, fanId);

  if (!existingFan) {
    throw new Error("Fan could not be found.");
  }

  const normalizedInput = normalizeFanInput(parsed);
  await assertFanEmailAvailable(artistProfile.id, normalizedInput.email, fanId);

  const updatedCount = await updateFan(artistProfile.id, fanId, normalizedInput);

  if (updatedCount === 0) {
    throw new Error("Fan could not be updated.");
  }

  return {
    fanId,
    values: buildFanFormValues(normalizedInput)
  };
}

export async function deleteFanForUser(userId: string, fanId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const deletedCount = await deleteFan(artistProfile.id, fanId);

  if (deletedCount === 0) {
    throw new Error("Fan could not be deleted.");
  }

  return {
    fanId
  };
}

export async function getFanDetailForUser(
  userId: string,
  fanId: string
): Promise<FanDetailDto> {
  const { fan } = await requireFanForUser(userId, fanId);
  return mapFan(fan);
}
