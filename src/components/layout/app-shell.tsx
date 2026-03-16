import type { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopNav } from "@/components/layout/top-nav";

type AppShellProps = {
  children: ReactNode;
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
  };
};

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1680px] xl:grid-cols-[300px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-border/70 bg-card/55 px-6 py-8 backdrop-blur-xl xl:flex xl:flex-col">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              Artist OS
            </p>
            <h2 className="font-heading text-3xl font-semibold leading-tight">
              Control tower for modern independent music operations.
            </h2>
            <p className="text-sm text-muted-foreground">
              Releases, content, fans, analytics, and daily execution in one restrained
              workspace.
            </p>
          </div>
          <div className="mt-10">
            <SidebarNav />
          </div>
          <div className="mt-auto rounded-[1.75rem] border border-border/70 bg-background/45 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              System note
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Keep releases linked to campaigns and content so the dashboard stays meaningful
              as the catalog grows.
            </p>
          </div>
        </aside>
        <div className="flex min-h-screen flex-col">
          <TopNav name={user.name} email={user.email} />
          <main className="flex-1 px-4 py-6 xl:px-8 xl:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
