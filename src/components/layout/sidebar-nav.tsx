"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavigation, isNavigationItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-1.5">
      {appNavigation.map((item) => {
        const isActive = isNavigationItemActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
              isActive
                ? "border-primary/30 bg-primary text-primary-foreground shadow-sm"
                : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-background/60 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-2xl border text-current transition-colors",
                isActive
                  ? "border-primary-foreground/15 bg-primary-foreground/10"
                  : "border-border/70 bg-card/70"
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate">{item.label}</p>
              <p
                className={cn(
                  "truncate text-xs",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {item.pageEyebrow}
              </p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
