"use client";

import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import posthog from "posthog-js";

let hasInitializedPostHog = false;

function initializePostHog() {
  if (hasInitializedPostHog || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false,
    person_profiles: "identified_only"
  });

  hasInitializedPostHog = true;
}

function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hasInitializedPostHog || !pathname) {
      return;
    }

    const queryString = searchParams?.toString();
    const pathWithQuery = queryString ? `${pathname}?${queryString}` : pathname;

    posthog.capture("$pageview", {
      $current_url: window.location.href,
      path: pathWithQuery
    });
  }, [pathname, searchParams]);

  return null;
}

export function AppAnalyticsProvider({ children }: { children: ReactNode }) {
  initializePostHog();

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogPageTracker />
      {children}
    </PostHogProvider>
  );
}
