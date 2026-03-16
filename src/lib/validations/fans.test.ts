import { describe, expect, it } from "vitest";

import {
  fanListFiltersSchema,
  normalizeFanInput,
  normalizeFanListFilters
} from "@/lib/validations/fans";

describe("fan validation", () => {
  it("normalizes empty list filters to undefined", () => {
    const parsed = fanListFiltersSchema.parse({
      query: "",
      tag: "",
      city: ""
    });

    expect(normalizeFanListFilters(parsed)).toEqual({
      query: undefined,
      tag: undefined,
      city: undefined
    });
  });

  it("normalizes email and deduplicates tags", () => {
    const normalized = normalizeFanInput({
      name: "Maya Stone",
      email: "  MAYA@EXAMPLE.COM  ",
      handle: " @mayalistener ",
      city: " Nashville ",
      tags: ["Superfan", "superfan", " merch buyer ", " "],
      engagementScore: 78,
      notes: " Met after the release show. "
    });

    expect(normalized).toEqual({
      name: "Maya Stone",
      email: "maya@example.com",
      handle: "@mayalistener",
      city: "Nashville",
      tags: ["superfan", "merch buyer"],
      engagementScore: 78,
      notes: "Met after the release show."
    });
  });
});
