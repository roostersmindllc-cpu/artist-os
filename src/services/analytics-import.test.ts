import { describe, expect, it } from "vitest";

import {
  previewMetricCsvImport,
  type MetricImportColumnMapping
} from "@/services/analytics-import";

const defaultMapping: MetricImportColumnMapping = {
  source: "source",
  metricName: "metric",
  metricValue: "value",
  recordedAt: "date",
  metadata: "metadata"
};

describe("analytics import", () => {
  it("normalizes a CSV preview into validated metric rows", () => {
    const preview = previewMetricCsvImport(
      [
        "source,metric,value,date,metadata",
        'YouTube,Views,"8,420",2026-03-01,"{""video"":""Midnight Broadcast""}"',
        "Instagram,Followers,2490,2026-03-01,"
      ].join("\n"),
      defaultMapping
    );

    expect(preview.validRowCount).toBe(2);
    expect(preview.invalidRowCount).toBe(0);
    expect(preview.validRows[0]).toMatchObject({
      source: "YOUTUBE",
      metricName: "STREAMS",
      metricValue: 8420
    });
    expect(preview.validRows[1]).toMatchObject({
      source: "INSTAGRAM",
      metricName: "FOLLOWERS",
      metricValue: 2490
    });
  });

  it("reports row-level CSV import errors", () => {
    const preview = previewMetricCsvImport(
      [
        "source,metric,value,date,metadata",
        "Spotify,Streams,-20,2026-03-01,",
        "Unknown,Views,200,2026-03-02,"
      ].join("\n"),
      defaultMapping
    );

    expect(preview.validRowCount).toBe(0);
    expect(preview.invalidRowCount).toBe(2);
    expect(preview.errors[0]?.message).toContain("must be a non-negative number");
    expect(preview.errors[1]?.message).toContain('Unknown source "Unknown"');
  });

  it("accepts platform export source aliases", () => {
    const preview = previewMetricCsvImport(
      [
        "source,metric,value,date,metadata",
        "Spotify for Artists,Streams,12450,2026-03-01,",
        "TikTok Analytics,Views,15300,2026-03-01,"
      ].join("\n"),
      defaultMapping
    );

    expect(preview.validRowCount).toBe(2);
    expect(preview.validRows[0]).toMatchObject({
      source: "SPOTIFY",
      metricName: "STREAMS"
    });
    expect(preview.validRows[1]).toMatchObject({
      source: "TIKTOK",
      metricName: "STREAMS"
    });
  });
});
