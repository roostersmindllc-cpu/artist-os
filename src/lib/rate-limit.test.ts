import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RateLimitError } from "@/lib/errors";

const upsertMock = vi.fn();
const deleteManyMock = vi.fn();

vi.mock("@/db/prisma", () => ({
  prisma: {
    rateLimitBucket: {
      upsert: upsertMock,
      deleteMany: deleteManyMock
    }
  }
}));

describe("enforceRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (globalThis as typeof globalThis & {
      rateLimitMemoryStore?: unknown;
      hasWarnedAboutMissingRateLimitTable?: boolean;
    }).rateLimitMemoryStore;
    delete (globalThis as typeof globalThis & {
      rateLimitMemoryStore?: unknown;
      hasWarnedAboutMissingRateLimitTable?: boolean;
    }).hasWarnedAboutMissingRateLimitTable;
  });

  it("falls back to in-memory limiting when the rate-limit table is missing", async () => {
    upsertMock.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("missing table", {
        code: "P2021",
        clientVersion: "7.5.0"
      })
    );

    const { enforceRateLimit } = await import("@/lib/rate-limit");

    await expect(
      enforceRateLimit({
        scope: "auth.sign-in",
        maxHits: 1,
        windowMs: 60_000,
        identifiers: ["artist@example.com"]
      })
    ).resolves.toBeUndefined();

    await expect(
      enforceRateLimit({
        scope: "auth.sign-in",
        maxHits: 1,
        windowMs: 60_000,
        identifiers: ["artist@example.com"]
      })
    ).rejects.toBeInstanceOf(RateLimitError);
  });

  it("uses the database-backed bucket when the table exists", async () => {
    upsertMock.mockResolvedValueOnce({
      hitCount: 1
    });

    const { enforceRateLimit } = await import("@/lib/rate-limit");

    await expect(
      enforceRateLimit({
        scope: "auth.sign-in",
        maxHits: 2,
        windowMs: 60_000,
        identifiers: ["artist@example.com"]
      })
    ).resolves.toBeUndefined();

    expect(upsertMock).toHaveBeenCalledTimes(1);
  });
});
