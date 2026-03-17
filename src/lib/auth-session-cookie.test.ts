import { describe, expect, it } from "vitest";

import { hasAuthSessionCookie } from "@/lib/auth-session-cookie";

describe("hasAuthSessionCookie", () => {
  it("detects the secure production session cookie", () => {
    expect(
      hasAuthSessionCookie([
        "__Host-next-auth.csrf-token",
        "__Secure-next-auth.session-token"
      ])
    ).toBe(true);
  });

  it("detects chunked session cookies", () => {
    expect(
      hasAuthSessionCookie([
        "__Secure-next-auth.session-token.0",
        "__Secure-next-auth.session-token.1"
      ])
    ).toBe(true);
  });

  it("returns false when no session cookie is present", () => {
    expect(
      hasAuthSessionCookie([
        "__Host-next-auth.csrf-token",
        "next-auth.callback-url"
      ])
    ).toBe(false);
  });
});
