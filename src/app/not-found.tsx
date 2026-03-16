import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="font-heading text-4xl font-semibold">Page not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The route is missing, but the dashboard shell is intact. Head back to the app and
          keep building.
        </p>
        <Link href="/dashboard" className={cn(buttonVariants())}>
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
