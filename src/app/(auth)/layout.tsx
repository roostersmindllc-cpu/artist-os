import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { LegalFooterNav } from "@/components/legal/legal-footer-nav";
import type { ReactNode } from "react";

export default function AuthLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-transparent px-4 py-6 text-white lg:px-6 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1550px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden rounded-[2.25rem] border border-primary/35 bg-[radial-gradient(circle_at_top_left,rgba(28,216,242,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(175,82,222,0.22),transparent_28%),rgba(255,255,255,0.04)] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur lg:flex lg:flex-col">
          <div className="flex items-center gap-4">
            <ArtistOsLogo
              compact
              className="gap-3"
              markClassName="h-20 w-20"
              labelClassName="hidden"
            />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-5xl font-semibold text-white">Artist</span>
                <span className="font-heading text-5xl font-semibold text-primary">.OS</span>
              </div>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/62">
                Artist growth system
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-5">
            <div className="inline-flex rounded-full border border-primary/35 bg-primary/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary">
              Music career control panel
            </div>
            <h1 className="max-w-2xl font-heading text-7xl font-semibold leading-[0.92] text-white">
              Build releases, campaigns, analytics, and fan systems in one board.
            </h1>
            <p className="max-w-xl text-base leading-8 text-white/74">
              Artist.OS should feel less like admin software and more like a bold
              command deck for momentum. These screens keep the app logic intact while
              pushing the presentation closer to your sketches.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.8rem] border border-primary/35 bg-white/8 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                What stays
              </p>
              <p className="mt-3 font-heading text-3xl font-semibold text-white">
                Real workflows, existing routes, existing data.
              </p>
            </div>
            <div className="rounded-[1.8rem] border border-white/12 bg-white/6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                What shifts
              </p>
              <p className="mt-3 font-heading text-3xl font-semibold text-white">
                Heavier contrast, louder hierarchy, more artist-board energy.
              </p>
            </div>
          </div>

        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-2xl">{children}</div>
        </section>
      </div>

      <div className="mx-auto mt-4 w-full max-w-[1550px] rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur sm:px-5">
        <LegalFooterNav className="justify-center" />
      </div>
    </div>
  );
}
