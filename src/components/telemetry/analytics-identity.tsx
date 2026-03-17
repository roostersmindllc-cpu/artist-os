"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import posthog from "posthog-js";

type AnalyticsIdentityProps = {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
};

export function AnalyticsIdentity({ user }: AnalyticsIdentityProps) {
  useEffect(() => {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name ?? undefined
    });

    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name ?? undefined
      });
    }

    return () => {
      Sentry.setUser(null);
    };
  }, [user.email, user.id, user.name]);

  return null;
}
