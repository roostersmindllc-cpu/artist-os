import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import { Disc3, FileStack, Megaphone, Users2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const quickAddItems: {
  href: Route;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/releases/new" as Route,
    label: "New Release",
    icon: Disc3
  },
  {
    href: "/campaigns/new" as Route,
    label: "New Campaign",
    icon: Megaphone
  },
  {
    href: "/tasks",
    label: "New Task",
    icon: FileStack
  },
  {
    href: "/fans/new" as Route,
    label: "New Fan",
    icon: Users2
  }
];

export function QuickAddActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {quickAddItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-2xl border-border/70 bg-card/80 shadow-sm"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
