import { describe, expect, it } from "vitest";

import {
  analyticsFiltersSchema,
  getDefaultAnalyticsFilters,
  normalizeAnalyticsFilters
} from "@/lib/validations/analytics";

describe("analytics validation", () => {
  it("defaults empty filters to the standard source and 90 day window", () => {
    const filters = normalizeAnalyticsFilters({});
    const defaults = getDefaultAnalyticsFilters();

    expect(filters.source).toBe(defaults.source);
    expect(filters.metricName).toBe(defaults.metricName);
    expect(filters.from).toBe(defaults.from);
    expect(filters.to).toBe(defaults.to);
  });

  it("rejects an end date before the start date", () => {
    const result = analyticsFiltersSchema.safeParse({
      source: "SPOTIFY",
      metricName: "STREAMS",
      from: "2026-03-10",
      to: "2026-03-01"
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.to).toContain(
      "End date must be on or after the start date."
    );
  });
});
