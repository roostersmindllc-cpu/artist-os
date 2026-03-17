import * as Sentry from "@sentry/nextjs";

import { serverEnv } from "@/lib/server-env";

Sentry.init({
  dsn: serverEnv.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(serverEnv.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: serverEnv.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development"
});
