"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl border-white/15 bg-white/8 text-white shadow-none hover:bg-white/12 xl:hidden"
        aria-expanded={isOpen}
        aria-controls="mobile-sidebar"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="size-4" />
        Menu
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-50 xl:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        <button
          className={cn(
            "absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          id="mobile-sidebar"
          className={cn(
            "absolute inset-y-2 left-2 flex w-[min(22rem,calc(100vw-1rem))] flex-col rounded-[1.6rem] border border-white/12 bg-[#0c0c0c]/96 p-4 text-white shadow-2xl transition-transform duration-200 sm:inset-y-3 sm:left-3 sm:w-[min(22rem,calc(100vw-1.5rem))] sm:rounded-[2rem] sm:p-5",
            isOpen ? "translate-x-0" : "-translate-x-[110%]"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <ArtistOsLogo
                compact
                withTagline
                className="items-start"
                markClassName="h-12 w-12"
                labelClassName="text-white [&_p]:text-white/62 [&_span:first-child]:text-white"
              />
              <h2 className="font-heading text-2xl font-semibold">
                Release ops, content, and insight in one place.
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="size-4" />
              Close
            </Button>
          </div>
          <div className="mt-8 flex-1 overflow-y-auto">
            <SidebarNav onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
