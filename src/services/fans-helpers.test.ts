import { describe, expect, it } from "vitest";

import { collectFanFilterOptions } from "@/services/fans-helpers";

describe("fan helpers", () => {
  it("deduplicates and sorts tag and city filter options", () => {
    const options = collectFanFilterOptions([
      {
        city: "Austin",
        tags: ["superfan", "press"]
      },
      {
        city: "austin",
        tags: ["press", "vip"]
      },
      {
        city: "Brooklyn",
        tags: []
      },
      {
        city: null,
        tags: ["vip"]
      }
    ]);

    expect(options).toEqual({
      cities: ["Austin", "Brooklyn"],
      tags: ["press", "superfan", "vip"]
    });
  });
});
