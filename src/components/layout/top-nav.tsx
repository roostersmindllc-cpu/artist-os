"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { Input } from "@/components/ui/input";
import { getNavigationMeta } from "@/lib/navigation";

type TopNavProps = {
  name: string | null | undefined;
  email: string | null | undefined;
};

export function TopNav({ name, email }: TopNavProps) {
  const pathname = usePathname();
  const navigationMeta = getNavigationMeta(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1360px] items-center gap-4 px-4 py-4 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <MobileSidebar />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">
              {navigationMeta.pageEyebrow}
            </p>
            <p className="truncate font-heading text-xl font-semibold">
              {navigationMeta.pageTitle}
            </p>
          </div>
        </div>
        <div className="hidden min-w-[280px] flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search artist workspace"
              readOnly
              placeholder="Search releases, campaigns, fans, or tasks"
              className="h-11 rounded-2xl border-border/70 bg-card/75 pl-11 shadow-sm"
            />
          </div>
        </div>
        <div className="ml-auto">
          <UserMenu name={name} email={email} />
        </div>
      </div>
    </header>
  );
}
