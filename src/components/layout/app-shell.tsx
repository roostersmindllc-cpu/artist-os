import type { ReactNode } from "react";

import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopNav } from "@/components/layout/top-nav";
import { WorkspaceExperienceProvider } from "@/components/layout/workspace-experience";
import type { ContentPlannerOptionsDto } from "@/services/content-types";

type AppShellProps = {
  children: ReactNode;
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
  };
  quickAddContentOptions: ContentPlannerOptionsDto;
};

export function AppShell({
  children,
  user,
  quickAddContentOptions
}: AppShellProps) {
  return (
    <WorkspaceExperienceProvider contentOptions={quickAddContentOptions}>
      <div className="min-h-screen">
        <div className="mx-auto grid min-h-screen max-w-[1680px] xl:grid-cols-[320px_1fr]">
          <aside className="sticky top-0 hidden h-screen border-r border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(233,76,255,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_26%),rgba(255,255,255,0.5)] px-6 py-8 backdrop-blur-xl xl:flex xl:flex-col dark:bg-[radial-gradient(circle_at_top_left,rgba(233,76,255,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.1),transparent_26%),rgba(9,20,34,0.72)]">
            <div className="space-y-5">
              <ArtistOsLogo withTagline className="items-start" markClassName="h-16 w-16" />
              <div className="space-y-3">
                <h2 className="font-heading text-3xl font-semibold leading-tight">
                  The operating system for release moments that need real follow-through.
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Plan releases, content, fans, analytics, and daily execution in one
                  command layer, then keep the dashboard focused on what matters next.
                </p>
              </div>
            </div>
            <div className="mt-10">
              <SidebarNav />
            </div>
            <div className="mt-auto space-y-4">
              <div className="rounded-[1.75rem] border border-border/70 bg-background/55 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                  Workspace rhythm
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Use quick add to capture new work fast, then let the dashboard turn it into a daily priority view.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-border/70 bg-background/45 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                  Keyboard
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Press <span className="font-semibold text-foreground">?</span> for shortcuts, <span className="font-semibold text-foreground">G</span> to navigate, and <span className="font-semibold text-foreground">N</span> to quick add.
                </p>
              </div>
            </div>
          </aside>
          <div className="flex min-h-screen flex-col">
            <TopNav name={user.name} email={user.email} />
            <main className="flex-1 px-4 py-6 pb-24 lg:pb-8 xl:px-8 xl:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </WorkspaceExperienceProvider>
  );
}
