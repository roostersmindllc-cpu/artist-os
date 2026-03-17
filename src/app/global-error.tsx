"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center px-4 py-10 antialiased">
        <div className="w-full max-w-xl space-y-4 rounded-[2rem] border border-border/70 bg-card/85 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Artist OS
          </p>
          <h1 className="font-heading text-3xl font-semibold">
            The workspace hit an unexpected failure
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            We captured the issue for monitoring. Try again, or head back to your dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className={cn(buttonVariants(), "rounded-2xl")}
            >
              Reload app
            </button>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
