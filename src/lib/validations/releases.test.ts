import { describe, expect, it } from "vitest";

import {
  normalizeReleaseListFilters,
  releaseListFiltersSchema
} from "@/lib/validations/releases";

describe("release validation", () => {
  it("normalizes empty list filters to undefined values", () => {
    const parsed = releaseListFiltersSchema.parse({
      status: "",
      type: ""
    });

    expect(normalizeReleaseListFilters(parsed)).toEqual({
      status: undefined,
      type: undefined
    });
  });
});
