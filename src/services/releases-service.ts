import {
  createRelease,
  deleteRelease,
  getReleaseById,
  getReleaseSummaryById,
  isReleaseSlugTaken,
  listReleasesByArtistProfileId,
  updateRelease
} from "@/db/queries/releases";
import { createTrack, deleteTrack, updateTrack } from "@/db/queries/tracks";
import { listUpcomingTasksByRelatedReleaseId } from "@/db/queries/tasks";
import { slugify } from "@/lib/slug";
import {
  normalizeReleaseInput,
  releaseFormSchema,
  type ReleaseFormValues,
  type ReleaseListFiltersValues
} from "@/lib/validations/releases";
import {
  normalizeTrackInput,
  trackFormSchema,
  type TrackFormValues
} from "@/lib/validations/tracks";
import {
  buildUpcomingReleaseMilestones,
  getReleaseRoute
} from "@/services/releases-helpers";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";

async function generateUniqueReleaseSlug(
  artistProfileId: string,
  title: string,
  excludeReleaseId?: string
) {
  const baseSlug = slugify(title) || "untitled-release";
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (await isReleaseSlugTaken(artistProfileId, candidateSlug, excludeReleaseId)) {
    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidateSlug;
}

async function requireReleaseForUser(userId: string, releaseId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const release = await getReleaseById(artistProfile.id, releaseId);

  if (!release) {
    throw new Error("Release could not be found.");
  }

  return {
    artistProfile,
    release
  };
}

export async function getReleasesForUser(
  userId: string,
  filters: ReleaseListFiltersValues = {}
) {
  const artistProfile = await requireArtistProfileForUser(userId);
  return listReleasesByArtistProfileId(artistProfile.id, filters);
}

export async function createReleaseForUser(userId: string, values: ReleaseFormValues) {
  const parsed = releaseFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const normalizedInput = normalizeReleaseInput(parsed);
  const slug = await generateUniqueReleaseSlug(artistProfile.id, normalizedInput.title);

  return createRelease(artistProfile.id, {
    ...normalizedInput,
    slug
  });
}

export async function updateReleaseForUser(
  userId: string,
  releaseId: string,
  values: ReleaseFormValues
) {
  const parsed = releaseFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  const existingRelease = await getReleaseSummaryById(artistProfile.id, releaseId);

  if (!existingRelease) {
    throw new Error("Release could not be found.");
  }

  const normalizedInput = normalizeReleaseInput(parsed);
  const slug = await generateUniqueReleaseSlug(
    artistProfile.id,
    normalizedInput.title,
    existingRelease.id
  );

  const updatedCount = await updateRelease(artistProfile.id, releaseId, {
    ...normalizedInput,
    slug
  });

  if (updatedCount === 0) {
    throw new Error("Release could not be updated.");
  }

  return {
    ...existingRelease,
    ...normalizedInput,
    slug
  };
}

export async function deleteReleaseForUser(userId: string, releaseId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  const deletedCount = await deleteRelease(artistProfile.id, releaseId);

  if (deletedCount === 0) {
    throw new Error("Release could not be deleted.");
  }
}

export async function getReleaseDetailForUser(userId: string, releaseId: string) {
  const { artistProfile, release } = await requireReleaseForUser(userId, releaseId);
  const relatedTasks = await listUpcomingTasksByRelatedReleaseId(artistProfile.id, releaseId, 6);

  return {
    ...release,
    href: getReleaseRoute(release.id),
    upcomingMilestones: buildUpcomingReleaseMilestones({
      release: {
        id: release.id,
        title: release.title,
        releaseDate: release.releaseDate
      },
      campaigns: release.campaigns,
      contentItems: release.contentItems.map((item) => ({
        id: item.id,
        title: item.title,
        platform: item.platform,
        dueDate: item.dueDate
      })),
      tasks: relatedTasks.map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        status: task.status
      }))
    })
  };
}

export async function createTrackForRelease(
  userId: string,
  releaseId: string,
  values: TrackFormValues
) {
  const parsed = trackFormSchema.parse(values);
  const { release } = await requireReleaseForUser(userId, releaseId);
  return createTrack(release.id, normalizeTrackInput(parsed));
}

export async function updateTrackForRelease(
  userId: string,
  releaseId: string,
  trackId: string,
  values: TrackFormValues
) {
  const parsed = trackFormSchema.parse(values);
  const { release } = await requireReleaseForUser(userId, releaseId);
  const updatedCount = await updateTrack(release.id, trackId, normalizeTrackInput(parsed));

  if (updatedCount === 0) {
    throw new Error("Track could not be updated.");
  }
}

export async function deleteTrackForRelease(
  userId: string,
  releaseId: string,
  trackId: string
) {
  const { release } = await requireReleaseForUser(userId, releaseId);
  const deletedCount = await deleteTrack(release.id, trackId);

  if (deletedCount === 0) {
    throw new Error("Track could not be deleted.");
  }
}
