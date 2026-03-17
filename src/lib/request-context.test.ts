import { describe, expect, it } from "vitest";

import { getClientIp } from "@/lib/request-context";

describe("getClientIp", () => {
  it("returns the first forwarded IP when multiple proxies are present", () => {
    expect(
      getClientIp({
        "x-forwarded-for": "198.51.100.4, 203.0.113.10"
      })
    ).toBe("198.51.100.4");
  });

  it("falls back to single-IP proxy headers", () => {
    expect(
      getClientIp({
        "cf-connecting-ip": "203.0.113.22"
      })
    ).toBe("203.0.113.22");
  });

  it("returns undefined when no client headers are present", () => {
    expect(getClientIp({})).toBeUndefined();
  });
});
