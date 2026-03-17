import "server-only";

import { createHash } from "node:crypto";

import { prisma } from "@/db/prisma";
import { RateLimitError } from "@/lib/errors";

type RateLimitOptions = {
  scope: string;
  maxHits: number;
  windowMs: number;
  identifiers: Array<string | null | undefined>;
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
}
