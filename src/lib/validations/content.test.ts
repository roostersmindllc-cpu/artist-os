import { describe, expect, it } from "vitest";

import {
  contentPlannerFiltersSchema,
  normalizeContentPlannerFilters
} from "@/lib/validations/content";

describe("content validation", () => {
  it("normalizes empty planner filters to undefined values", () => {
    const parsed = contentPlannerFiltersSchema.parse({
      view: "",
      date: "",
      platform: "",
      status: "",
      campaignId: "",
      releaseId: ""
    });

    expect(normalizeContentPlannerFilters(parsed)).toEqual({
      view: undefined,
      date: undefined,
      platform: undefined,
      status: undefined,
      campaignId: undefined,
      releaseId: undefined
    });
  });
});
