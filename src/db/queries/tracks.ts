import { TrackStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";

type CreateTrackInput = {
  title: string;
  durationSeconds: number | null;
  isrc: string | null;
  versionName: string | null;
  status: TrackStatus;
};

export async function listTracksByReleaseId(releaseId: string) {
  return prisma.track.findMany({
    where: { releaseId },
    orderBy: { createdAt: "asc" }
  });
}

export async function createTrack(releaseId: string, data: CreateTrackInput) {
  return prisma.track.create({
    data: {
      releaseId,
      ...data
    }
  });
}

export async function updateTrack(
  releaseId: string,
  trackId: string,
  data: CreateTrackInput
) {
  const result = await prisma.track.updateMany({
    where: {
      id: trackId,
      releaseId
    },
    data
  });

  return result.count;
}

export async function deleteTrack(releaseId: string, trackId: string) {
  const result = await prisma.track.deleteMany({
    where: {
      id: trackId,
      releaseId
    }
  });

  return result.count;
}
