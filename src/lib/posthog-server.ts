import "server-only";

import { PostHog } from "posthog-node";

import { serverEnv } from "@/lib/server-env";

const globalForPostHog = globalThis as typeof globalThis & {
  posthogClient?: PostHog;
};

function createPostHogClient() {
  if (!serverEnv.NEXT_PUBLIC_POSTHOG_KEY) {
    return undefined;
  }

  return new PostHog(serverEnv.NEXT_PUBLIC_POSTHOG_KEY, {
    host: serverEnv.NEXT_PUBLIC_POSTHOG_HOST
  });
}

function getPostHogClient() {
  if (globalForPostHog.posthogClient) {
    return globalForPostHog.posthogClient;
  }

  const client = createPostHogClient();

  if (!client) {
    return undefined;
  }

  if (process.env.NODE_ENV !== "production") {
    globalForPostHog.posthogClient = client;
  }

  return client;
}

export async function captureServerAnalyticsEvent(input: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}) {
  const client = getPostHogClient();

  if (!client) {
    return;
  }

  try {
    await client.captureImmediate({
      distinctId: input.distinctId,
      event: input.event,
      properties: input.properties
    });
  } catch {
    // Analytics failures should never block product flows.
  }
}
