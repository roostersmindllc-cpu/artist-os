// @ts-nocheck
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";;
import { addDays, subDays } from "date-fns";

import { hashPassword } from "../src/lib/password";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl
  })
});

type MetricSeedInput = {
  artistProfileId: string;
  source:
    | "SPOTIFY"
    | "APPLE_MUSIC"
    | "YOUTUBE"
    | "INSTAGRAM"
    | "TIKTOK"
    | "MAILING_LIST"
    | "MANUAL";
  metricName:
    | "STREAMS"
    | "FOLLOWERS"
    | "ENGAGEMENT_RATE"
    | "REVENUE_USD"
    | "PRE_SAVES"
    | "TICKET_SALES"
    | "EMAIL_SUBSCRIBERS";
  dates: Date[];
  values: number[];
  metadata?: Record<string, unknown>;
};

function buildMetricMetadata(
  metricName: MetricSeedInput["metricName"],
  metadata: Record<string, unknown> = {}
) {
  if (metricName === "ENGAGEMENT_RATE") {
    return { unit: "percent", ...metadata };
  }

  if (metricName === "REVENUE_USD") {
    return { unit: "usd", ...metadata };
  }

  return { unit: "count", ...metadata };
}

function buildMetricSnapshots({
  artistProfileId,
  source,
  metricName,
  dates,
  values,
  metadata
}: MetricSeedInput) {
  return values.map((metricValue, index) => ({
    artistProfileId,
    source,
    metricName,
    metricValue,
    recordedAt: dates[index],
    metadata: buildMetricMetadata(metricName, metadata)
  }));
}

async function main() {
  const now = new Date();
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set SEED_USER_EMAIL and SEED_USER_PASSWORD before running the seed script."
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Seed Artist",
      passwordHash
    },
    create: {
      email,
      name: "Seed Artist",
      passwordHash
    }
  });

  const artistProfile = await prisma.artistProfile.upsert({
    where: { userId: user.id },
    update: {
      artistName: "Seed Artist",
      genre: "Alternative Pop",
      bio: "Independent artist blending nocturnal synth textures, intimate writing, and a release strategy built around direct fan momentum.",
      goals: [
        "Grow Spotify monthly listeners by 20 percent",
        "Increase direct email subscribers ahead of the next EP",
        "Standardize launch planning across releases, content, and CRM"
      ]
    },
    create: {
      userId: user.id,
      artistName: "Seed Artist",
      genre: "Alternative Pop",
      bio: "Independent artist blending nocturnal synth textures, intimate writing, and a release strategy built around direct fan momentum.",
      goals: [
        "Grow Spotify monthly listeners by 20 percent",
        "Increase direct email subscribers ahead of the next EP",
        "Standardize launch planning across releases, content, and CRM"
      ]
    }
  });

  await prisma.$transaction([
    prisma.metricSnapshot.deleteMany({
      where: { artistProfileId: artistProfile.id }
    }),
    prisma.task.deleteMany({ where: { artistProfileId: artistProfile.id } }),
    prisma.fan.deleteMany({ where: { artistProfileId: artistProfile.id } }),
    prisma.contentItem.deleteMany({
      where: { artistProfileId: artistProfile.id }
    }),
    prisma.campaign.deleteMany({
      where: { artistProfileId: artistProfile.id }
    }),
    prisma.track.deleteMany({
      where: {
        release: {
          artistProfileId: artistProfile.id
        }
      }
    }),
    prisma.release.deleteMany({ where: { artistProfileId: artistProfile.id } })
  ]);

  const midnightMirrors = await prisma.release.create({
    data: {
      artistProfileId: artistProfile.id,
      title: "Midnight Mirrors",
      slug: "midnight-mirrors",
      type: "ALBUM",
      status: "RELEASED",
      releaseDate: subDays(now, 28),
      distributor: "DistroKid",
      coverArtUrl:
        "https://images.artistos.app/demo/midnight-mirrors-cover.jpg",
      description:
        "A finished album era used as the baseline for current analytics and fan growth."
    }
  });

  const neonSkyline = await prisma.release.create({
    data: {
      artistProfileId: artistProfile.id,
      title: "Neon Skyline",
      slug: "neon-skyline",
      type: "SINGLE",
      status: "SCHEDULED",
      releaseDate: addDays(now, 14),
      distributor: "DistroKid",
      coverArtUrl: "https://images.artistos.app/demo/neon-skyline-cover.jpg",
      description: "Lead single introducing the next release cycle."
    }
  });

  const afterglowSessions = await prisma.release.create({
    data: {
      artistProfileId: artistProfile.id,
      title: "Afterglow Sessions",
      slug: "afterglow-sessions",
      type: "EP",
      status: "IN_PROGRESS",
      releaseDate: addDays(now, 45),
      distributor: "CD Baby",
      coverArtUrl:
        "https://images.artistos.app/demo/afterglow-sessions-cover.jpg",
      description:
        "A stripped-back companion EP with acoustic reinterpretations and behind-the-scenes storytelling."
    }
  });

  const signalFlare = await prisma.release.create({
    data: {
      artistProfileId: artistProfile.id,
      title: "Signal Flare",
      slug: "signal-flare",
      type: "SINGLE",
      status: "IDEA",
      releaseDate: addDays(now, 90),
      distributor: null,
      coverArtUrl: null,
      description:
        "An early concept parked in the catalog to keep upcoming writing sessions visible."
    }
  });

  await prisma.track.createMany({
    data: [
      {
        releaseId: midnightMirrors.id,
        title: "Midnight Mirrors",
        durationSeconds: 234,
        isrc: "QZ1232600001",
        versionName: "Album version",
        status: "RELEASED"
      },
      {
        releaseId: midnightMirrors.id,
        title: "Static Bloom",
        durationSeconds: 218,
        isrc: "QZ1232600002",
        versionName: "Album version",
        status: "RELEASED"
      },
      {
        releaseId: midnightMirrors.id,
        title: "Northbound Lights",
        durationSeconds: 246,
        isrc: "QZ1232600003",
        versionName: "Album version",
        status: "RELEASED"
      },
      {
        releaseId: neonSkyline.id,
        title: "Neon Skyline",
        durationSeconds: 204,
        isrc: "QZ1232600004",
        versionName: "Original",
        status: "DISTRIBUTED"
      },
      {
        releaseId: afterglowSessions.id,
        title: "Streetlight Static",
        durationSeconds: 228,
        isrc: "QZ1232600005",
        versionName: "Acoustic",
        status: "MASTERED"
      },
      {
        releaseId: afterglowSessions.id,
        title: "Afterglow",
        durationSeconds: 241,
        isrc: "QZ1232600006",
        versionName: "Acoustic",
        status: "MASTERED"
      },
      {
        releaseId: afterglowSessions.id,
        title: "Daybreak Exit",
        durationSeconds: 198,
        isrc: "QZ1232600007",
        versionName: "Acoustic",
        status: "MIXING"
      },
      {
        releaseId: afterglowSessions.id,
        title: "Signal in Reverse",
        durationSeconds: 215,
        isrc: null,
        versionName: "Acoustic",
        status: "DRAFT"
      }
    ]
  });

  const midnightLaunchCampaign = await prisma.campaign.create({
    data: {
      artistProfileId: artistProfile.id,
      releaseId: midnightMirrors.id,
      name: "Midnight Mirrors Launch",
      objective:
        "Sustain album momentum with recap content and fan follow-up after release week.",
      budget: 1200,
      startDate: subDays(now, 40),
      endDate: subDays(now, 12),
      status: "COMPLETED",
      notes:
        "Focused on recap assets, playlist outreach, and direct fan thank-you messaging."
    }
  });

  const preSaveCampaign = await prisma.campaign.create({
    data: {
      artistProfileId: artistProfile.id,
      releaseId: neonSkyline.id,
      name: "Neon Skyline Pre-Save Push",
      objective:
        "Drive pre-saves and grow warm audience engagement before release day.",
      budget: 500,
      startDate: subDays(now, 5),
      endDate: addDays(now, 10),
      status: "ACTIVE",
      notes:
        "Short-form video, creator outreach, landing page optimization, and email reminders."
    }
  });

  const afterglowCampaign = await prisma.campaign.create({
    data: {
      artistProfileId: artistProfile.id,
      releaseId: afterglowSessions.id,
      name: "Afterglow Sessions Story Arc",
      objective:
        "Document the creative process and seed demand for the acoustic EP.",
      budget: 350,
      startDate: addDays(now, 7),
      endDate: addDays(now, 35),
      status: "DRAFT",
      notes:
        "Focus on studio clips, lyric snippets, and mailing-list conversion."
    }
  });

  const audienceCampaign = await prisma.campaign.create({
    data: {
      artistProfileId: artistProfile.id,
      releaseId: null,
      name: "Audience Re-Engagement Sprint",
      objective:
        "Wake up lapsed fans with direct communication and high-performing recap content.",
      budget: 180,
      startDate: addDays(now, 3),
      endDate: addDays(now, 21),
      status: "PAUSED",
      notes: "Will resume once the Neon Skyline visual assets are approved."
    }
  });

  await prisma.contentItem.createMany({
    data: [
      {
        artistProfileId: artistProfile.id,
        campaignId: midnightLaunchCampaign.id,
        releaseId: midnightMirrors.id,
        platform: "YOUTUBE",
        format: "PRESS_ASSET",
        title: "Album recap visualizer",
        caption:
          "Recap asset highlighting the strongest fan response moments from launch month.",
        dueDate: subDays(now, 18),
        publishedAt: subDays(now, 17),
        status: "PUBLISHED",
        assetUrl: "https://assets.artistos.app/demo/midnight-mirrors-recap.mp4"
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: midnightLaunchCampaign.id,
        releaseId: midnightMirrors.id,
        platform: "EMAIL",
        format: "EMAIL_BLAST",
        title: "Album thank-you email",
        caption: "Thank core supporters and direct them to the merch bundle.",
        dueDate: subDays(now, 24),
        publishedAt: subDays(now, 24),
        status: "PUBLISHED",
        assetUrl: null
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: preSaveCampaign.id,
        releaseId: neonSkyline.id,
        platform: "INSTAGRAM",
        format: "SHORT_VIDEO",
        title: "Studio teaser reel",
        caption: "A first glimpse at the chorus and the visual palette.",
        dueDate: addDays(now, 2),
        publishedAt: null,
        status: "SCHEDULED",
        assetUrl: "https://assets.artistos.app/demo/neon-skyline-teaser.mp4"
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: preSaveCampaign.id,
        releaseId: neonSkyline.id,
        platform: "TIKTOK",
        format: "SHORT_VIDEO",
        title: "Hook-first teaser cut",
        caption:
          "Faster hook edit designed for creator stitching and trend testing.",
        dueDate: addDays(now, 5),
        publishedAt: null,
        status: "DRAFT",
        assetUrl: "https://assets.artistos.app/demo/neon-skyline-hook-cut.mp4"
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: preSaveCampaign.id,
        releaseId: neonSkyline.id,
        platform: "EMAIL",
        format: "EMAIL_BLAST",
        title: "Pre-save reminder",
        caption:
          "Share the story behind the song and point fans to the pre-save link.",
        dueDate: addDays(now, 4),
        publishedAt: null,
        status: "DRAFT",
        assetUrl: null
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: afterglowCampaign.id,
        releaseId: afterglowSessions.id,
        platform: "YOUTUBE",
        format: "PRESS_ASSET",
        title: "Acoustic session trailer",
        caption: "Rough-cut trailer for the EP session videos.",
        dueDate: addDays(now, 18),
        publishedAt: null,
        status: "IN_REVIEW",
        assetUrl: "https://assets.artistos.app/demo/afterglow-trailer.mp4"
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: afterglowCampaign.id,
        releaseId: afterglowSessions.id,
        platform: "INSTAGRAM",
        format: "CAROUSEL",
        title: "Lyric card sequence",
        caption:
          "Carousel draft built from key lyric lines and handwritten notebook imagery.",
        dueDate: addDays(now, 21),
        publishedAt: null,
        status: "DRAFT",
        assetUrl: "https://assets.artistos.app/demo/afterglow-lyric-cards.zip"
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: audienceCampaign.id,
        releaseId: null,
        platform: "X",
        format: "STATIC_POST",
        title: "Audience check-in post",
        caption:
          "Short direct post asking fans which songs they want to hear live next.",
        dueDate: addDays(now, 9),
        publishedAt: null,
        status: "SCHEDULED",
        assetUrl: null
      },
      {
        artistProfileId: artistProfile.id,
        campaignId: null,
        releaseId: signalFlare.id,
        platform: "OTHER",
        format: "OTHER",
        title: "Moodboard reference drop",
        caption:
          "Early references for the next visual era kept visible before production starts.",
        dueDate: addDays(now, 55),
        publishedAt: null,
        status: "ARCHIVED",
        assetUrl: "https://assets.artistos.app/demo/signal-flare-moodboard.pdf"
      }
    ]
  });

  await prisma.fan.createMany({
    data: [
      {
        artistProfileId: artistProfile.id,
        name: "Maya Ellis",
        email: "maya@example.com",
        handle: "@mayaandmusic",
        city: "Brooklyn",
        tags: ["superfan", "shares-content", "merch-buyer"],
        engagementScore: 92,
        notes: "Often reposts release announcements within the first hour."
      },
      {
        artistProfileId: artistProfile.id,
        name: "Jordan Vega",
        email: "jordan@example.com",
        handle: "@jordansounds",
        city: "Austin",
        tags: ["vip", "house-show-interest"],
        engagementScore: 77,
        notes: "Responds well to direct pre-sale outreach."
      },
      {
        artistProfileId: artistProfile.id,
        name: "Riley Chen",
        email: null,
        handle: "@rileyloops",
        city: "Chicago",
        tags: ["producer-community", "playlist-curator"],
        engagementScore: 65,
        notes: "Strong collaborator and curator contact."
      },
      {
        artistProfileId: artistProfile.id,
        name: "Alex Harper",
        email: "alex@example.com",
        handle: "@alexharperlive",
        city: "Nashville",
        tags: ["photographer", "tour-contact"],
        engagementScore: 58,
        notes:
          "Reliable local photo contact for launch shows and studio sessions."
      },
      {
        artistProfileId: artistProfile.id,
        name: "Samira Patel",
        email: "samira@example.com",
        handle: "@samirapatelpr",
        city: "Los Angeles",
        tags: ["press", "newsletter-reader"],
        engagementScore: 48,
        notes:
          "Occasionally forwards strong press assets to indie media contacts."
      },
      {
        artistProfileId: artistProfile.id,
        name: "Noah Brooks",
        email: null,
        handle: "@noahonrepeat",
        city: "Seattle",
        tags: ["playlist-follower"],
        engagementScore: 31,
        notes:
          "Likes and saves most acoustic content but has not converted to email yet."
      }
    ]
  });

  await prisma.task.createMany({
    data: [
      {
        artistProfileId: artistProfile.id,
        relatedType: "RELEASE",
        relatedId: neonSkyline.id,
        title: "Finalize distributor metadata",
        description:
          "Double-check writer splits, ISRC, and Spotify pitch notes.",
        dueDate: addDays(now, 3),
        priority: "HIGH",
        status: "IN_PROGRESS"
      },
      {
        artistProfileId: artistProfile.id,
        relatedType: "CAMPAIGN",
        relatedId: preSaveCampaign.id,
        title: "Approve paid social cutdown",
        description: "Need 9:16 and 1:1 versions for the pre-save ads.",
        dueDate: addDays(now, 5),
        priority: "MEDIUM",
        status: "TODO"
      },
      {
        artistProfileId: artistProfile.id,
        relatedType: "CAMPAIGN",
        relatedId: afterglowCampaign.id,
        title: "Outline acoustic mini-doc arc",
        description:
          "Map three narrative beats and assign rough delivery dates.",
        dueDate: addDays(now, 11),
        priority: "MEDIUM",
        status: "TODO"
      },
      {
        artistProfileId: artistProfile.id,
        relatedType: "CAMPAIGN",
        relatedId: audienceCampaign.id,
        title: "Resume fan re-engagement sprint",
        description: "Unpause once Neon Skyline teaser assets are approved.",
        dueDate: addDays(now, 6),
        priority: "LOW",
        status: "TODO"
      },
      {
        artistProfileId: artistProfile.id,
        relatedType: "RELEASE",
        relatedId: midnightMirrors.id,
        title: "Archive album launch handoff docs",
        description:
          "Move final recap assets into the post-release archive folder.",
        dueDate: subDays(now, 7),
        priority: "LOW",
        status: "DONE"
      },
      {
        artistProfileId: artistProfile.id,
        relatedType: null,
        relatedId: null,
        title: "Clean up fan tag taxonomy",
        description:
          "Merge duplicate CRM tags before the first CSV import pass.",
        dueDate: addDays(now, 8),
        priority: "MEDIUM",
        status: "IN_PROGRESS"
      }
    ]
  });

  const metricDates = [
    subDays(now, 35),
    subDays(now, 28),
    subDays(now, 21),
    subDays(now, 14),
    subDays(now, 7),
    now
  ];

  const metricSnapshots = [
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "SPOTIFY",
      metricName: "STREAMS",
      dates: metricDates,
      values: [8300, 9100, 10450, 11820, 12690, 13520],
      metadata: { note: "Primary DSP weekly check-in" }
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "SPOTIFY",
      metricName: "FOLLOWERS",
      dates: metricDates,
      values: [1260, 1320, 1395, 1468, 1530, 1594]
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "SPOTIFY",
      metricName: "PRE_SAVES",
      dates: metricDates,
      values: [120, 168, 221, 289, 366, 448],
      metadata: { release: neonSkyline.title }
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "YOUTUBE",
      metricName: "STREAMS",
      dates: metricDates,
      values: [5400, 6100, 6900, 7600, 8450, 9210],
      metadata: { displayMetric: "views" }
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "TIKTOK",
      metricName: "STREAMS",
      dates: metricDates,
      values: [12000, 15100, 18450, 21100, 24800, 28900],
      metadata: { displayMetric: "views" }
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "INSTAGRAM",
      metricName: "FOLLOWERS",
      dates: metricDates,
      values: [3020, 3085, 3150, 3240, 3380, 3495]
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "INSTAGRAM",
      metricName: "ENGAGEMENT_RATE",
      dates: metricDates,
      values: [4.3, 4.6, 4.9, 5.1, 5.4, 5.7]
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "MAILING_LIST",
      metricName: "EMAIL_SUBSCRIBERS",
      dates: metricDates,
      values: [780, 792, 808, 826, 851, 878],
      metadata: { list: "main" }
    }),
    ...buildMetricSnapshots({
      artistProfileId: artistProfile.id,
      source: "MANUAL",
      metricName: "REVENUE_USD",
      dates: metricDates,
      values: [1523, 1654, 1782, 1919, 2068, 2244],
      metadata: { note: "Combined merch and digital revenue snapshot" }
    })
  ];

  await prisma.metricSnapshot.createMany({
    data: metricSnapshots
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
