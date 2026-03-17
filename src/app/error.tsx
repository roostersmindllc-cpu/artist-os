"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="border-border/70 bg-card/85 w-full max-w-xl space-y-4 rounded-[2rem] border p-8 text-center shadow-sm">
        <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
          Artist OS
        </p>
        <h1 className="font-heading text-3xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-muted-foreground text-sm leading-6">
          The app hit an unexpected error. Try the current page again, or return
          to the dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className={cn(buttonVariants(), "rounded-2xl")}
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-2xl"
            )}
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
