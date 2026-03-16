import { describe, expect, it } from "vitest";

import {
  buildContentPlannerRange,
  normalizeContentPlannerView
} from "@/services/content-helpers";

describe("content helpers", () => {
  it("defaults unknown planner views to month", () => {
    expect(normalizeContentPlannerView("anything")).toBe("month");
  });

  it("builds a month range with the expected heading", () => {
    const range = buildContentPlannerRange("month", new Date("2026-05-18T00:00:00Z"));

    expect(range.heading).toBe("May 2026");
  });

  it("builds a week range with a week heading", () => {
    const range = buildContentPlannerRange("week", new Date("2026-05-18T00:00:00Z"));

    expect(range.subheading).toBe("Week view");
    expect(range.heading).toContain("2026");
  });
});
