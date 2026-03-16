import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  redirectMock,
  getServerAuthSessionMock,
  requireUserMock,
  getPostAuthRedirectPathMock,
  getArtistProfileForUserMock
} = vi.hoisted(() => ({
  redirectMock: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
  getServerAuthSessionMock: vi.fn(),
  requireUserMock: vi.fn(),
  getPostAuthRedirectPathMock: vi.fn(),
  getArtistProfileForUserMock: vi.fn()
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock
}));

vi.mock("@/lib/auth", () => ({
  getServerAuthSession: getServerAuthSessionMock,
  requireUser: requireUserMock
}));

vi.mock("@/services/auth-service", () => ({
  getPostAuthRedirectPath: getPostAuthRedirectPathMock
}));

vi.mock("@/services/artist-profiles-service", () => ({
  getArtistProfileForUser: getArtistProfileForUserMock
}));

import {
  redirectAuthenticatedUser,
  requireOnboardedUser,
  requirePendingOnboardingUser
} from "@/lib/route-access";

describe("route access guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when redirectAuthenticatedUser has no session", async () => {
    getServerAuthSessionMock.mockResolvedValueOnce(null);

    await expect(redirectAuthenticatedUser()).resolves.toBeUndefined();
    expect(getPostAuthRedirectPathMock).not.toHaveBeenCalled();
  });

  it("redirects authenticated users away from auth pages", async () => {
    getServerAuthSessionMock.mockResolvedValueOnce({
      user: { id: "user_1" }
    });
    getPostAuthRedirectPathMock.mockResolvedValueOnce("/onboarding");

    await expect(redirectAuthenticatedUser()).rejects.toThrow(
      "NEXT_REDIRECT:/onboarding"
    );
    expect(getPostAuthRedirectPathMock).toHaveBeenCalledWith("user_1");
  });

  it("redirects non-onboarded users into onboarding", async () => {
    requireUserMock.mockResolvedValueOnce({ id: "user_1" });
    getArtistProfileForUserMock.mockResolvedValueOnce(null);

    await expect(requireOnboardedUser()).rejects.toThrow(
      "NEXT_REDIRECT:/onboarding"
    );
  });

  it("returns the user and artist profile for onboarded sessions", async () => {
    const user = { id: "user_1" };
    const artistProfile = { id: "artist_1", artistName: "Demo Artist" };

    requireUserMock.mockResolvedValueOnce(user);
    getArtistProfileForUserMock.mockResolvedValueOnce(artistProfile);

    await expect(requireOnboardedUser()).resolves.toEqual({
      user,
      artistProfile
    });
  });

  it("redirects already-onboarded users away from onboarding", async () => {
    requireUserMock.mockResolvedValueOnce({ id: "user_1" });
    getArtistProfileForUserMock.mockResolvedValueOnce({ id: "artist_1" });

    await expect(requirePendingOnboardingUser()).rejects.toThrow(
      "NEXT_REDIRECT:/dashboard"
    );
  });
});
