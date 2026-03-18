"use client";

import { Keyboard, Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060606] text-white">
      <div className="mx-auto flex max-w-[1520px] flex-wrap items-center gap-3 px-3 py-3 sm:px-4 sm:py-4 xl:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MobileSidebar />
          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <ArtistOsLogo compact className="gap-3" markClassName="h-12 w-12" labelClassName="hidden" />
              <div className="hidden xl:block">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-heading text-3xl font-semibold text-white">Artist</span>
                  <span className="font-heading text-3xl font-semibold text-primary">.OS</span>
                </div>
              </div>
            </div>
          </div>
          <div className="min-w-0 lg:hidden">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              {navigationMeta.pageEyebrow}
            </p>
            <p className="truncate font-heading text-xl font-semibold text-white sm:text-2xl">
              {navigationMeta.pageTitle}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 xl:block">
          <SidebarNav orientation="horizontal" />
        </div>

        <div className="hidden min-w-[260px] max-w-sm flex-1 lg:block xl:flex-none">
          <button
            type="button"
            onClick={openShortcuts}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 w-full justify-between rounded-2xl border-white/15 bg-white/8 px-4 text-left font-medium text-white shadow-none hover:bg-white/12"
            )}
          >
            <span className="flex items-center gap-3 text-white/70">
              <Search className="size-4" />
              Shortcuts, quick add, and navigation
            </span>
            <span className="rounded-full border border-white/15 bg-white/6 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              ?
            </span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-white/15 bg-primary px-3 text-primary-foreground shadow-none hover:bg-primary/90 lg:hidden"
            onClick={() => openQuickAdd("release")}
            aria-label="Open quick add"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden rounded-2xl border-white/15 bg-primary px-4 text-primary-foreground shadow-none hover:bg-primary/90 lg:inline-flex"
            onClick={() => openQuickAdd("release")}
          >
            <Plus className="size-4" />
            Quick add
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden rounded-xl border-white/15 bg-white/8 text-white shadow-none hover:bg-white/12 sm:inline-flex lg:hidden"
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
