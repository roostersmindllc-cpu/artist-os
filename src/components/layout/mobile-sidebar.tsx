"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

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
        className="xl:hidden"
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
            "absolute inset-y-3 left-3 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col rounded-[2rem] border border-border/70 bg-popover/95 p-5 shadow-2xl transition-transform duration-200",
            isOpen ? "translate-x-0" : "-translate-x-[110%]"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                Artist OS
              </p>
              <h2 className="font-heading text-2xl font-semibold">
                Release ops, content, and analytics in one place.
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
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
