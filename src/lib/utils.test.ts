import { describe, expect, it } from "vitest";

import { formatDate } from "@/lib/utils";

describe("date formatting helpers", () => {
  it("formats date-only strings without timezone drift", () => {
    expect(formatDate("2026-03-01")).toBe("Mar 1, 2026");
  });
});
