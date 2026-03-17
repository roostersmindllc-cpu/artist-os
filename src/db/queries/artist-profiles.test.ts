import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findUniqueMock = vi.fn();
const upsertMock = vi.fn();
const updateMock = vi.fn();

vi.mock("@/db/prisma", () => ({
  prisma: {
    artistProfile: {
      findUnique: findUniqueMock,
      upsert: upsertMock,
      update: updateMock
    }
  }
}));

describe("artist profile query compatibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("falls back to legacy artist profile fields when onboarding columns are missing", async () => {
    findUniqueMock
      .mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError("missing column", {
          code: "P2022",
          clientVersion: "7.5.0",
          meta: {
            column: "public.ArtistProfile.audienceSize"
          }
        })
      )
      .mockResolvedValueOnce({
        id: "profile_1",
        userId: "user_1",
        artistName: "Artist OS",
        genre: "Alt Pop",
        bio: null,
        goals: [],
        createdAt: new Date("2026-03-17T00:00:00.000Z"),
        updatedAt: new Date("2026-03-17T00:00:00.000Z")
      });

    const { getArtistProfileByUserId } = await import("@/db/queries/artist-profiles");
    const artistProfile = await getArtistProfileByUserId("user_1");

    expect(artistProfile).toMatchObject({
      artistName: "Artist OS",
      audienceSize: null,
      socialPlatforms: [],
      platformsUsed: []
    });
    expect(findUniqueMock).toHaveBeenCalledTimes(2);
  });

  it("retries writes without unsupported onboarding columns on older schemas", async () => {
    upsertMock
      .mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError("missing column", {
          code: "P2022",
          clientVersion: "7.5.0",
          meta: {
            column: "public.ArtistProfile.socialPlatforms"
          }
        })
      )
      .mockResolvedValueOnce({
        id: "profile_1"
      });

    const { upsertArtistProfileByUserId } = await import("@/db/queries/artist-profiles");

    await upsertArtistProfileByUserId("user_1", {
      artistName: "Artist OS",
      audienceSize: 1200,
      socialPlatforms: ["Instagram"],
      platformsUsed: ["Spotify"]
    });

    expect(upsertMock).toHaveBeenNthCalledWith(2, {
      where: { userId: "user_1" },
      update: {
        artistName: "Artist OS"
      },
      create: {
        userId: "user_1",
        artistName: "Artist OS"
      }
    });
  });
});
