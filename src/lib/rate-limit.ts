import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";

import { prisma } from "@/db/prisma";
import { RateLimitError } from "@/lib/errors";

type RateLimitOptions = {
  scope: string;
  maxHits: number;
  windowMs: number;
  identifiers: Array<string | null | undefined>;
};

type MemoryRateLimitBucket = {
  hitCount: number;
  expiresAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  rateLimitMemoryStore?: Map<string, MemoryRateLimitBucket>;
  hasWarnedAboutMissingRateLimitTable?: boolean;
};

function hashIdentifiers(scope: string, identifiers: Array<string | null | undefined>) {
  const normalizedIdentifiers = identifiers
    .map((value) => value?.trim().toLowerCase())
    .filter(Boolean);

  if (normalizedIdentifiers.length === 0) {
    return createHash("sha256").update(`${scope}:anonymous`).digest("hex");
  }

  return createHash("sha256")
    .update(`${scope}:${normalizedIdentifiers.join("|")}`)
    .digest("hex");
}

function getWindowStart(now: Date, windowMs: number) {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

function getMemoryStore() {
  globalForRateLimit.rateLimitMemoryStore ??= new Map();
  return globalForRateLimit.rateLimitMemoryStore;
}

function cleanupExpiredMemoryBuckets(store: Map<string, MemoryRateLimitBucket>, now: Date) {
  const nowMs = now.getTime();

  for (const [bucketKey, bucket] of store.entries()) {
    if (bucket.expiresAt < nowMs) {
      store.delete(bucketKey);
    }
  }
}

function warnAboutMissingRateLimitTable() {
  if (globalForRateLimit.hasWarnedAboutMissingRateLimitTable) {
    return;
  }

  globalForRateLimit.hasWarnedAboutMissingRateLimitTable = true;
  console.warn(
    "RateLimitBucket table is missing. Falling back to in-memory rate limiting until migrations are applied."
  );
}

function isMissingRateLimitTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

function enforceInMemoryRateLimit({
  scope,
  maxHits,
  windowMs,
  identifiers
}: RateLimitOptions) {
  const now = new Date();
  const windowStart = getWindowStart(now, windowMs);
  const store = getMemoryStore();
  const key = `${scope}:${hashIdentifiers(scope, identifiers)}:${windowStart.toISOString()}`;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((windowStart.getTime() + windowMs - now.getTime()) / 1000)
  );

  cleanupExpiredMemoryBuckets(store, now);

  const bucket = store.get(key);

  if (bucket) {
    bucket.hitCount += 1;
    bucket.expiresAt = windowStart.getTime() + windowMs * 2;
  } else {
    store.set(key, {
      hitCount: 1,
      expiresAt: windowStart.getTime() + windowMs * 2
    });
  }

  if ((store.get(key)?.hitCount ?? 0) > maxHits) {
    throw new RateLimitError(
      "Too many requests right now. Please wait a moment and try again.",
      retryAfterSeconds
    );
  }
}

export async function enforceRateLimit({
  scope,
  maxHits,
  windowMs,
  identifiers
}: RateLimitOptions) {
  const now = new Date();
  const windowStart = getWindowStart(now, windowMs);
  const key = hashIdentifiers(scope, identifiers);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((windowStart.getTime() + windowMs - now.getTime()) / 1000)
  );

  try {
    const bucket = await prisma.rateLimitBucket.upsert({
      where: {
        scope_key_windowStart: {
          scope,
          key,
          windowStart
        }
      },
      create: {
        scope,
        key,
        windowStart,
        hitCount: 1,
        expiresAt: new Date(windowStart.getTime() + windowMs * 2)
      },
      update: {
        hitCount: {
          increment: 1
        },
        expiresAt: new Date(windowStart.getTime() + windowMs * 2)
      }
    });

    if (Math.random() < 0.02) {
      void prisma.rateLimitBucket.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      });
    }

    if (bucket.hitCount > maxHits) {
      throw new RateLimitError(
        "Too many requests right now. Please wait a moment and try again.",
        retryAfterSeconds
      );
    }
  } catch (error) {
    if (!isMissingRateLimitTableError(error)) {
      throw error;
    }

    warnAboutMissingRateLimitTable();
    enforceInMemoryRateLimit({
      scope,
      maxHits,
      windowMs,
      identifiers
    });
  }
}
