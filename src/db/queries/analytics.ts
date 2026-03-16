import { Prisma, type MetricName, type MetricSource } from "@prisma/client";
import { endOfDay } from "date-fns";

import { prisma } from "@/db/prisma";

type SaveMetricSnapshotInput = {
  source: MetricSource;
  metricName: MetricName;
  metricValue: number;
  recordedAt: Date;
  metadata: Prisma.InputJsonValue | null;
};

type MetricSnapshotFilters = {
  source?: MetricSource;
  metricName?: MetricName;
  from?: Date;
  to?: Date;
  limit?: number;
};

function buildMetricSnapshotWhereClause(
  artistProfileId: string,
  filters: MetricSnapshotFilters = {}
) {
  return {
    artistProfileId,
    ...(filters.source ? { source: filters.source } : {}),
    ...(filters.metricName ? { metricName: filters.metricName } : {}),
    ...(filters.from || filters.to
      ? {
          recordedAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: endOfDay(filters.to) } : {})
          }
        }
      : {})
  };
}

export async function listMetricSnapshotsByArtistProfileId(
  artistProfileId: string,
  filters: MetricSnapshotFilters = {}
) {
  return prisma.metricSnapshot.findMany({
    where: buildMetricSnapshotWhereClause(artistProfileId, filters),
    orderBy: [{ recordedAt: "desc" }, { source: "asc" }, { metricName: "asc" }],
    ...(filters.limit ? { take: filters.limit } : {})
  });
}

export async function listRecentMetricSnapshotsByArtistProfileId(
  artistProfileId: string,
  limit = 48
) {
  return prisma.metricSnapshot.findMany({
    where: { artistProfileId },
    orderBy: [{ recordedAt: "desc" }, { source: "asc" }, { metricName: "asc" }],
    take: limit
  });
}

export async function createMetricSnapshot(
  artistProfileId: string,
  data: SaveMetricSnapshotInput
) {
  return prisma.metricSnapshot.upsert({
    where: {
      artistProfileId_source_metricName_recordedAt: {
        artistProfileId,
        source: data.source,
        metricName: data.metricName,
        recordedAt: data.recordedAt
      }
    },
    update: {
      metricValue: data.metricValue,
      metadata: data.metadata === null ? Prisma.JsonNull : data.metadata,
      updatedAt: new Date()
    },
    create: {
      artistProfileId,
      source: data.source,
      metricName: data.metricName,
      metricValue: data.metricValue,
      recordedAt: data.recordedAt,
      ...(data.metadata !== null ? { metadata: data.metadata } : {})
    }
  });
}

export async function saveMetricSnapshots(
  artistProfileId: string,
  rows: SaveMetricSnapshotInput[]
) {
  return prisma.$transaction(
    rows.map((row) =>
      prisma.metricSnapshot.upsert({
        where: {
          artistProfileId_source_metricName_recordedAt: {
            artistProfileId,
            source: row.source,
            metricName: row.metricName,
            recordedAt: row.recordedAt
          }
        },
        update: {
          metricValue: row.metricValue,
          metadata: row.metadata === null ? Prisma.JsonNull : row.metadata,
          updatedAt: new Date()
        },
        create: {
          artistProfileId,
          source: row.source,
          metricName: row.metricName,
          metricValue: row.metricValue,
          recordedAt: row.recordedAt,
          ...(row.metadata !== null ? { metadata: row.metadata } : {})
        }
      })
    )
  );
}
