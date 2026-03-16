import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  Disc3,
  FileStack,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users2
} from "lucide-react";

export type AppNavigationItem = {
  href: Route;
  label: string;
  pageTitle: string;
  pageEyebrow: string;
  icon: LucideIcon;
};

export const appNavigation: AppNavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    pageTitle: "Dashboard",
    pageEyebrow: "Artist workspace",
    icon: LayoutDashboard
  },
  {
    href: "/releases",
    label: "Releases",
    pageTitle: "Releases",
    pageEyebrow: "Catalog planning",
    icon: Disc3
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    pageTitle: "Campaigns",
    pageEyebrow: "Launch planning",
    icon: Megaphone
  },
  {
    href: "/content",
    label: "Content",
    pageTitle: "Content Calendar",
    pageEyebrow: "Publishing rhythm",
    icon: CalendarDays
  },
  {
    href: "/fans",
    label: "Fans",
    pageTitle: "Fans CRM",
    pageEyebrow: "Audience relationships",
    icon: Users2
  },
  {
    href: "/tasks",
    label: "Tasks",
    pageTitle: "Tasks",
    pageEyebrow: "Execution flow",
    icon: FileStack
  },
  {
    href: "/analytics",
    label: "Analytics",
    pageTitle: "Analytics",
    pageEyebrow: "Performance tracking",
    icon: BarChart3
  },
  {
    href: "/settings",
    label: "Settings",
    pageTitle: "Settings",
    pageEyebrow: "Workspace setup",
    icon: Settings
  }
];

const fallbackNavigationMeta = {
  pageTitle: "Artist OS",
  pageEyebrow: "Authenticated workspace"
};

export function isNavigationItemActive(pathname: string, href: Route) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavigationItemByPathname(pathname: string) {
  return appNavigation.find((item) => isNavigationItemActive(pathname, item.href));
}

export function getNavigationMeta(pathname: string) {
  const matchedItem = getNavigationItemByPathname(pathname);

  if (!matchedItem) {
    return fallbackNavigationMeta;
  }

  return {
    pageTitle: matchedItem.pageTitle,
    pageEyebrow: matchedItem.pageEyebrow
  };
}
