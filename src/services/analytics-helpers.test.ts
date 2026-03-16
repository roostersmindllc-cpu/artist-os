import { describe, expect, it } from "vitest";

import {
  buildAnalyticsSummary,
  buildAnalyticsTimeline,
  calculatePercentageChange
} from "@/services/analytics-helpers";

describe("analytics helpers", () => {
  it("calculates percentage change using the previous value", () => {
    expect(calculatePercentageChange(120, 100)).toBe(20);
  });

  it("handles a zero previous value", () => {
    expect(calculatePercentageChange(8, 0)).toBe(100);
    expect(calculatePercentageChange(0, 0)).toBe(0);
  });

  it("builds a timeline from generic metric snapshots", () => {
    const timeline = buildAnalyticsTimeline([
      {
        source: "SPOTIFY",
        metricName: "STREAMS",
        metricValue: 1000,
        recordedAt: new Date("2026-03-01")
      },
      {
        source: "SPOTIFY",
        metricName: "FOLLOWERS",
        metricValue: 100,
        recordedAt: new Date("2026-03-01")
      },
      {
        source: "SPOTIFY",
        metricName: "STREAMS",
        metricValue: 1250,
        recordedAt: new Date("2026-03-08")
      },
      {
        source: "SPOTIFY",
        metricName: "FOLLOWERS",
        metricValue: 110,
        recordedAt: new Date("2026-03-08")
      }
    ]);

    expect(timeline).toHaveLength(2);
    expect(timeline[1]?.streams).toBe(1250);
    expect(timeline[1]?.followers).toBe(110);
  });

  it("builds analytics summary from the latest timeline points", () => {
    const summary = buildAnalyticsSummary([
      {
        source: "SPOTIFY",
        recordedAt: new Date("2026-03-01"),
        label: "Mar 1",
        streams: 1000,
        followers: 100,
        engagementRate: 4.5,
        revenueUsd: 100
      },
      {
        source: "SPOTIFY",
        recordedAt: new Date("2026-03-08"),
        label: "Mar 8",
        streams: 1250,
        followers: 110,
        engagementRate: 5,
        revenueUsd: 120
      }
    ]);

    expect(summary?.latest.streams).toBe(1250);
    expect(summary?.deltas.streams).toBe(25);
    expect(summary?.deltas.followers).toBe(10);
  });
});
