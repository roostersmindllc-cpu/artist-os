"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

type UserMenuProps = {
  name: string | null | undefined;
  email: string | null | undefined;
};

export function UserMenu({ name, email }: UserMenuProps) {
  return (
    <details className="group relative">
      <summary className="flex list-none cursor-pointer items-center gap-2 rounded-[1rem] border border-border/70 bg-card/85 px-2.5 py-2 shadow-sm transition-colors hover:bg-card sm:gap-3 sm:rounded-2xl sm:px-3 [&::-webkit-details-marker]:hidden">
        <div className="flex size-9 items-center justify-center rounded-[1rem] bg-secondary text-secondary-foreground sm:size-10 sm:rounded-2xl">
          {getInitials(name)}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-none">{name ?? "Artist"}</p>
          <p className="mt-1 text-xs text-muted-foreground">{email ?? "Signed in"}</p>
        </div>
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute right-0 z-30 mt-3 w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-border/70 bg-popover/95 p-2 shadow-2xl backdrop-blur sm:w-72">
        <div className="rounded-2xl border border-border/60 bg-background/55 px-4 py-3">
          <p className="font-medium">{name ?? "Artist"}</p>
          <p className="text-sm text-muted-foreground">{email ?? "Signed in"}</p>
        </div>
        <div className="mt-2 grid gap-1">
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Settings className="size-4" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="justify-start rounded-xl px-3"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    </details>
  );
}
