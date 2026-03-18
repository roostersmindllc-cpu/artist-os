import type { ReactNode } from "react";

import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
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
      <div className="min-h-screen bg-transparent text-white">
        <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col px-2 py-2 sm:px-4 sm:py-3 xl:px-6">
          <div className="hidden items-center justify-between px-2 pb-4 xl:flex">
            <div className="flex items-center gap-4">
              <ArtistOsLogo
                withTagline
                compact
                className="items-start gap-3"
                markClassName="h-16 w-16"
                labelClassName="hidden"
              />
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-semibold text-white">Artist</span>
                  <span className="font-heading text-4xl font-semibold text-primary">.OS</span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/64">
                  Release ops, content, fans, and insight in one system
                </p>
              </div>
            </div>

            <div className="max-w-sm rounded-[1.6rem] border border-primary/45 bg-white/8 px-5 py-4 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Artist command layer
              </p>
              <p className="mt-2 text-sm leading-6 text-white/76">
                Keep the routes and workflow you already built, but frame them like a
                focused release board with stronger contrast and louder hierarchy.
              </p>
            </div>
          </div>

          <div className="flex min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-[1.5rem] border border-primary/70 bg-card/98 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:min-h-[calc(100vh-1.5rem)] sm:rounded-[2rem]">
            <TopNav name={user.name} email={user.email} />
            <main className="flex-1 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,245,238,0.97))] px-3 py-4 pb-24 text-foreground sm:px-4 sm:py-6 lg:pb-8 xl:px-8 xl:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </WorkspaceExperienceProvider>
  );
}
