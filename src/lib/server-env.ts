import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  DIRECT_URL: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required."),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default("https://us.i.posthog.com"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0.1),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),
  PRISMA_POOL_MAX: z.coerce.number().int().positive().default(10),
  PRISMA_POOL_IDLE_TIMEOUT_MS: z.coerce.number().int().nonnegative().default(10_000),
  PRISMA_POOL_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  AUTH_SIGN_IN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  AUTH_SIGN_IN_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  AUTH_SIGN_UP_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(4),
  AUTH_SIGN_UP_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60 * 60 * 1000),
  ANALYTICS_IMPORT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(6),
  ANALYTICS_IMPORT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(10 * 60 * 1000)
});

export const serverEnv = serverEnvSchema.parse(process.env);
