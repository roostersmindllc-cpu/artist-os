import { endOfWeek, startOfDay } from "date-fns";

import { prisma } from "@/db/prisma";

export async function getDashboardCounts(
  artistProfileId: string,
  today = new Date()
) {
  const startOfToday = startOfDay(today);
  const endOfCurrentWeek = endOfWeek(today);

  const [releases, campaigns, fans, tasksDueThisWeek] = await prisma.$transaction([
    prisma.release.count({
      where: {
        artistProfileId,
        status: {
          not: "ARCHIVED"
        }
      }
    }),
    prisma.campaign.count({
      where: {
        artistProfileId,
        status: "ACTIVE"
      }
    }),
    prisma.fan.count({ where: { artistProfileId } }),
    prisma.task.count({
      where: {
        artistProfileId,
        dueDate: {
          gte: startOfToday,
          lte: endOfCurrentWeek
        },
        status: {
          notIn: ["DONE", "CANCELED"]
        }
      }
    })
  ]);

  return {
    releases,
    activeCampaigns: campaigns,
    fans,
    tasksDueThisWeek
  };
}

export async function getNextUpcomingReleaseByArtistProfileId(
  artistProfileId: string,
  today = new Date()
) {
  return prisma.release.findFirst({
    where: {
      artistProfileId,
      releaseDate: {
        gte: startOfDay(today)
      },
      status: {
        not: "ARCHIVED"
      }
    },
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      status: true,
      releaseDate: true,
      distributor: true,
      _count: {
        select: {
          tracks: true,
          campaigns: true
        }
      }
    },
    orderBy: [{ releaseDate: "asc" }, { createdAt: "asc" }]
  });
}

export async function listUpcomingContentItemsForDashboardByArtistProfileId(
  artistProfileId: string,
  limit = 4,
  today = new Date()
) {
  return prisma.contentItem.findMany({
    where: {
      artistProfileId,
      dueDate: {
        gte: startOfDay(today)
      },
      status: {
        notIn: ["PUBLISHED", "ARCHIVED"]
      }
    },
    select: {
      id: true,
      title: true,
      platform: true,
      format: true,
      status: true,
      dueDate: true,
      campaign: {
        select: {
          id: true,
          name: true
        }
      },
      release: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: [
      { dueDate: "asc" },
      { createdAt: "asc" }
    ],
    take: limit
  });
}

export async function listRecentDashboardActivityRecordsByArtistProfileId(
  artistProfileId: string,
  limitPerModel = 4
) {
  const [releases, campaigns, contentItems, fans, tasks] = await prisma.$transaction([
    prisma.release.findMany({
      where: { artistProfileId },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: "desc" },
      take: limitPerModel
    }),
    prisma.campaign.findMany({
      where: { artistProfileId },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: "desc" },
      take: limitPerModel
    }),
    prisma.contentItem.findMany({
      where: { artistProfileId },
      select: {
        id: true,
        title: true,
        platform: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: "desc" },
      take: limitPerModel
    }),
    prisma.fan.findMany({
      where: { artistProfileId },
      select: {
        id: true,
        name: true,
        handle: true,
        city: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: "desc" },
      take: limitPerModel
    }),
    prisma.task.findMany({
      where: { artistProfileId },
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: "desc" },
      take: limitPerModel
    })
  ]);

  return {
    releases,
    campaigns,
    contentItems,
    fans,
    tasks
  };
}
