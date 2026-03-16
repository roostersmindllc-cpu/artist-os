import { describe, expect, it } from "vitest";

import { isValidDateInput } from "@/lib/validations/shared";

describe("shared validation helpers", () => {
  it("accepts real calendar dates and rejects impossible ones", () => {
    expect(isValidDateInput("2026-02-28")).toBe(true);
    expect(isValidDateInput("2026-02-31")).toBe(false);
    expect(isValidDateInput("2026-13-01")).toBe(false);
    expect(isValidDateInput("2026/02/28")).toBe(false);
  });
});
