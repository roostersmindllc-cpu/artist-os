import { addDays, endOfDay, startOfDay } from "date-fns";

import { prisma } from "@/db/prisma";

export async function getDashboardCounts(
  artistProfileId: string,
  today = new Date()
) {
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const releaseWindowEnd = endOfDay(addDays(today, 30));

  const [upcomingContent, tasksDueToday, campaignsRunningNow, releasesWithin30Days] =
    await prisma.$transaction([
      prisma.contentItem.count({
        where: {
          artistProfileId,
          dueDate: {
            gte: startOfToday
          },
          status: {
            notIn: ["PUBLISHED", "ARCHIVED"]
          }
        }
      }),
      prisma.task.count({
        where: {
          artistProfileId,
          dueDate: {
            gte: startOfToday,
            lte: endOfToday
          },
          status: {
            notIn: ["DONE", "CANCELED"]
          }
        }
      }),
      prisma.campaign.count({
        where: {
          artistProfileId,
          status: "ACTIVE",
          startDate: {
            lte: endOfToday
          },
          OR: [
            {
              endDate: null
            },
            {
              endDate: {
                gte: startOfToday
              }
            }
          ]
        }
      }),
      prisma.release.count({
        where: {
          artistProfileId,
          releaseDate: {
            gte: startOfToday,
            lte: releaseWindowEnd
          },
          status: {
            not: "ARCHIVED"
          }
        }
      })
    ]);

  return {
    upcomingContent,
    tasksDueToday,
    campaignsRunningNow,
    releasesWithin30Days
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

export async function getNextUpcomingReleaseHealthSourceByArtistProfileId(
  artistProfileId: string,
  today = new Date()
) {
  const release = await prisma.release.findFirst({
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
      coverArtUrl: true,
      campaigns: {
        where: {
          status: {
            not: "ARCHIVED"
          }
        },
        select: {
          id: true,
          status: true
        }
      },
      contentItems: {
        where: {
          status: {
            not: "ARCHIVED"
          }
        },
        select: {
          id: true,
          status: true
        }
      }
    },
    orderBy: [{ releaseDate: "asc" }, { createdAt: "asc" }]
  });

  if (!release) {
    return null;
  }

  const tasks = await prisma.task.findMany({
    where: {
      artistProfileId,
      relatedType: "RELEASE",
      relatedId: release.id,
      status: {
        not: "CANCELED"
      }
    },
    select: {
      id: true,
      title: true,
      status: true
    },
    orderBy: [{ createdAt: "asc" }]
  });

  return {
    ...release,
    tasks
  };
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

export async function listTasksDueTodayForDashboardByArtistProfileId(
  artistProfileId: string,
  limit = 4,
  today = new Date()
) {
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  return prisma.task.findMany({
    where: {
      artistProfileId,
      dueDate: {
        gte: startOfToday,
        lte: endOfToday
      },
      status: {
        notIn: ["DONE", "CANCELED"]
      }
    },
    select: {
      id: true,
      title: true,
      priority: true,
      status: true,
      dueDate: true,
      relatedType: true
    },
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
      { createdAt: "asc" }
    ],
    take: limit
  });
}

export async function listCampaignsRunningNowForDashboardByArtistProfileId(
  artistProfileId: string,
  limit = 4,
  today = new Date()
) {
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  return prisma.campaign.findMany({
    where: {
      artistProfileId,
      status: "ACTIVE",
      startDate: {
        lte: endOfToday
      },
      OR: [
        {
          endDate: null
        },
        {
          endDate: {
            gte: startOfToday
          }
        }
      ]
    },
    select: {
      id: true,
      name: true,
      objective: true,
      startDate: true,
      endDate: true,
      status: true,
      release: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: [
      { startDate: "asc" },
      { createdAt: "asc" }
    ],
    take: limit
  });
}

export async function listReleasesWithinDaysForDashboardByArtistProfileId(
  artistProfileId: string,
  days = 30,
  limit = 4,
  today = new Date()
) {
  return prisma.release.findMany({
    where: {
      artistProfileId,
      releaseDate: {
        gte: startOfDay(today),
        lte: endOfDay(addDays(today, days))
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
          campaigns: true,
          tracks: true
        }
      }
    },
    orderBy: [
      { releaseDate: "asc" },
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
