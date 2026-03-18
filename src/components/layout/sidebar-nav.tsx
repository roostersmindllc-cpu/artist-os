"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavigation, isNavigationItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  onNavigate?: () => void;
  orientation?: "vertical" | "horizontal";
};

export function SidebarNav({
  onNavigate,
  orientation = "vertical"
}: SidebarNavProps) {
  const pathname = usePathname();
  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex gap-1.5",
        isHorizontal ? "flex-wrap items-center justify-center" : "flex-col"
      )}
    >
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
              "flex items-center gap-3 border text-sm font-medium transition-all",
              isActive
                ? "border-black bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                : "border-black/18 bg-white text-muted-foreground hover:border-primary/55 hover:bg-primary/8 hover:text-foreground",
              isHorizontal
                ? "min-w-[9.25rem] justify-center rounded-none px-4 py-3 shadow-sm"
                : "rounded-[1.2rem] px-4 py-3"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center border text-current transition-colors",
                isActive
                  ? "border-white/18 bg-white/10"
                  : "border-black/10 bg-background/75",
                isHorizontal ? "size-8 rounded-md" : "size-10 rounded-2xl"
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className={cn("min-w-0", isHorizontal && "text-center")}>
              <p className="truncate">{item.label}</p>
              {isHorizontal ? null : (
                <p
                  className={cn(
                    "truncate text-xs",
                    isActive ? "text-white/74" : "text-muted-foreground"
                  )}
                >
                  {item.pageEyebrow}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
