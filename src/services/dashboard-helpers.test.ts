import { describe, expect, it } from "vitest";

import {
  buildDashboardActivityFeed,
  buildDashboardReleaseHealthInsight,
  buildDashboardPerformanceSnapshot,
  getDashboardActivityActionLabel
} from "@/services/dashboard-helpers";

describe("dashboard helpers", () => {
  it("detects whether activity is a create or update", () => {
    expect(
      getDashboardActivityActionLabel(
        new Date("2026-03-01T10:00:00Z"),
        new Date("2026-03-01T10:00:00Z")
      )
    ).toBe("Created");

    expect(
      getDashboardActivityActionLabel(
        new Date("2026-03-01T10:00:00Z"),
        new Date("2026-03-02T10:00:00Z")
      )
    ).toBe("Updated");
  });

  it("sorts mixed activity by most recent update", () => {
    const feed = buildDashboardActivityFeed([
      {
        kind: "release",
        id: "release-1",
        title: "Neon Skyline",
        status: "SCHEDULED",
        createdAt: new Date("2026-03-01T10:00:00Z"),
        updatedAt: new Date("2026-03-04T10:00:00Z"),
        href: "/releases"
      },
      {
        kind: "task",
        id: "task-1",
        title: "Approve teaser cut",
        status: "IN_PROGRESS",
        dueDate: new Date("2026-03-06T10:00:00Z"),
        createdAt: new Date("2026-03-05T10:00:00Z"),
        updatedAt: new Date("2026-03-05T10:00:00Z"),
        href: "/tasks"
      }
    ]);

    expect(feed[0]?.kind).toBe("task");
    expect(feed[1]?.kind).toBe("release");
  });

  it("builds a seven-day performance snapshot from tracked metric series", () => {
    const snapshot = buildDashboardPerformanceSnapshot([
      {
        source: "SPOTIFY",
        metricName: "STREAMS",
        metricValue: 1000,
        recordedAt: new Date("2026-03-01T12:00:00Z")
      },
      {
        source: "SPOTIFY",
        metricName: "STREAMS",
        metricValue: 1600,
        recordedAt: new Date("2026-03-08T12:00:00Z")
      },
      {
        source: "SPOTIFY",
        metricName: "STREAMS",
        metricValue: 2500,
        recordedAt: new Date("2026-03-15T12:00:00Z")
      },
      {
        source: "INSTAGRAM",
        metricName: "FOLLOWERS",
        metricValue: 10000,
        recordedAt: new Date("2026-03-01T12:00:00Z")
      },
      {
        source: "INSTAGRAM",
        metricName: "FOLLOWERS",
        metricValue: 10200,
        recordedAt: new Date("2026-03-08T12:00:00Z")
      },
      {
        source: "INSTAGRAM",
        metricName: "FOLLOWERS",
        metricValue: 10550,
        recordedAt: new Date("2026-03-15T12:00:00Z")
      },
      {
        source: "INSTAGRAM",
        metricName: "ENGAGEMENT_RATE",
        metricValue: 4,
        recordedAt: new Date("2026-03-02T12:00:00Z")
      },
      {
        source: "INSTAGRAM",
        metricName: "ENGAGEMENT_RATE",
        metricValue: 4,
        recordedAt: new Date("2026-03-06T12:00:00Z")
      },
      {
        source: "INSTAGRAM",
        metricName: "ENGAGEMENT_RATE",
        metricValue: 6,
        recordedAt: new Date("2026-03-10T12:00:00Z")
      },
      {
        source: "INSTAGRAM",
        metricName: "ENGAGEMENT_RATE",
        metricValue: 6,
        recordedAt: new Date("2026-03-15T12:00:00Z")
      }
    ]);

    expect(snapshot[0]).toMatchObject({
      key: "streamsLast7Days",
      value: 900,
      change: 50,
      sourceLabel: "Spotify"
    });
    expect(snapshot[1]).toMatchObject({
      key: "followerGrowth",
      value: 350,
      change: 75,
      sourceLabel: "Instagram"
    });
    expect(snapshot[2]).toMatchObject({
      key: "campaignEngagement",
      value: 6,
      change: 50,
      sourceLabel: "Instagram"
    });
  });

  it("returns empty performance items when metrics are missing", () => {
    const snapshot = buildDashboardPerformanceSnapshot([]);

    expect(snapshot).toEqual([
      {
        key: "streamsLast7Days",
        label: "Streams last 7 days",
        metricName: "STREAMS",
        value: null,
        change: null,
        source: null,
        sourceLabel: null,
        recordedAt: null
      },
      {
        key: "followerGrowth",
        label: "Follower growth",
        metricName: "FOLLOWERS",
        value: null,
        change: null,
        source: null,
        sourceLabel: null,
        recordedAt: null
      },
      {
        key: "campaignEngagement",
        label: "Campaign engagement",
        metricName: "ENGAGEMENT_RATE",
        value: null,
        change: null,
        source: null,
        sourceLabel: null,
        recordedAt: null
      }
    ]);
  });

  it("builds an actionable release health score for the next launch", () => {
    const insight = buildDashboardReleaseHealthInsight(
      {
        id: "release-1",
        title: "Neon Skyline",
        slug: "neon-skyline",
        type: "SINGLE",
        status: "SCHEDULED",
        releaseDate: new Date("2026-03-20T12:00:00Z"),
        distributor: "DistroKid",
        coverArtUrl: "https://example.com/cover.jpg",
        campaigns: [
          {
            id: "campaign-1",
            status: "ACTIVE"
          }
        ],
        contentItems: [
          {
            id: "content-1",
            status: "SCHEDULED"
          },
          {
            id: "content-2",
            status: "PUBLISHED"
          }
        ],
        tasks: [
          {
            id: "task-1",
            title: "Submit Neon Skyline to playlists",
            status: "TODO"
          }
        ]
      },
      new Date("2026-03-10T09:00:00Z")
    );

    expect(insight.score).toBe(68);
    expect(insight.scoreLabel).toBe("Needs attention");
    expect(insight.summary).toBe(
      "Raise this score by finishing playlist submissions and scheduling 2 more posts."
    );
    expect(insight.checklist).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "coverArt",
          label: "Cover art uploaded",
          status: "complete"
        }),
        expect.objectContaining({
          key: "campaign",
          label: "Campaign created",
          status: "complete"
        }),
        expect.objectContaining({
          key: "playlist",
          label: "Playlist submissions not finished",
          status: "warning"
        }),
        expect.objectContaining({
          key: "scheduledPosts",
          label: "Only 2 posts scheduled",
          status: "warning"
        })
      ])
    );
    expect(insight.primaryAction).toEqual({
      label: "Finish playlist submissions",
      href: "/tasks"
    });
  });
});
