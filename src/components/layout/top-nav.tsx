"use client";

import { Keyboard, Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { useWorkspaceExperience } from "@/components/layout/workspace-experience";
import { UserMenu } from "@/components/layout/user-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { getNavigationMeta } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type TopNavProps = {
  name: string | null | undefined;
  email: string | null | undefined;
};

export function TopNav({ name, email }: TopNavProps) {
  const pathname = usePathname();
  const navigationMeta = getNavigationMeta(pathname);
  const { openQuickAdd, openShortcuts } = useWorkspaceExperience();

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1360px] items-center gap-3 px-4 py-4 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <MobileSidebar />
          <div className="hidden lg:block xl:hidden">
            <ArtistOsLogo compact markClassName="h-10 w-10" />
          </div>
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
          <button
            type="button"
            onClick={openShortcuts}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 w-full justify-between rounded-2xl border-border/70 bg-card/75 px-4 text-left font-medium shadow-sm"
            )}
          >
            <span className="flex items-center gap-3 text-muted-foreground">
              <Search className="size-4" />
              Shortcuts, quick add, and navigation
            </span>
            <span className="rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              ?
            </span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden rounded-2xl border-border/70 bg-card/80 shadow-sm lg:inline-flex"
            onClick={() => openQuickAdd("release")}
          >
            <Plus className="size-4" />
            Quick add
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border/70 bg-card/80 shadow-sm lg:hidden"
            onClick={openShortcuts}
            aria-label="Open keyboard shortcuts"
          >
            <Keyboard className="size-4" />
          </Button>
          <UserMenu name={name} email={email} />
        </div>
      </div>
    </header>
  );
}
