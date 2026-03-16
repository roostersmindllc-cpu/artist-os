import { describe, expect, it } from "vitest";

import {
  campaignFormSchema,
  campaignListFiltersSchema,
  normalizeCampaignListFilters
} from "@/lib/validations/campaigns";

describe("campaign validation", () => {
  it("rejects an end date before the start date", () => {
    const result = campaignFormSchema.safeParse({
      releaseId: "",
      name: "Launch sprint",
      objective: "Drive pre-saves for the new single",
      budget: "500",
      startDate: "2026-04-12",
      endDate: "2026-04-10",
      status: "ACTIVE",
      notes: ""
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.endDate).toContain(
      "End date must be on or after the start date."
    );
  });

  it("normalizes empty status filters to undefined", () => {
    const parsed = campaignListFiltersSchema.parse({
      status: ""
    });

    expect(normalizeCampaignListFilters(parsed)).toEqual({
      status: undefined
    });
  });
});
