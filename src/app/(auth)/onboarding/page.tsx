import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { Disc3, RadioTower, Sparkles } from "lucide-react";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { AnalyticsIdentity } from "@/components/telemetry/analytics-identity";
import { requirePendingOnboardingUser } from "@/lib/route-access";

export default async function OnboardingPage() {
  const user = await requirePendingOnboardingUser();

  return (
    <>
      <AnalyticsIdentity
        user={{
          id: user.id,
          email: user.email,
          name: user.name
        }}
      />
      <div className="w-full max-w-[1100px]">
        <section className="rounded-[2.5rem] border-[5px] border-primary bg-card p-6 text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.3)] lg:p-8">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <ArtistOsLogo compact className="gap-3" markClassName="h-16 w-16" />
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                  Create your Artist.OS profile
                </p>
                <h1 className="font-heading text-5xl font-semibold leading-none text-foreground lg:text-6xl">
                  Build {user.name ?? "your"} workspace before the first dashboard load.
                </h1>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/12 bg-background px-6 py-5">
              <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
                Set up the artist profile, growth context, and release runway once. Artist.OS
                will use it to generate the first release entry, starter campaign, week-one
                content plan, and operational tasks so the dashboard never opens empty.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.8rem] border border-black/12 bg-[linear-gradient(180deg,rgba(190,89,255,0.82),rgba(162,73,224,0.92))] p-5 text-white">
                <Disc3 className="size-5 text-primary" />
                <p className="mt-4 font-heading text-3xl font-semibold">Starter release</p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Create the first catalog anchor so campaigns and content have a real release to orbit.
                </p>
              </div>
              <div className="rounded-[1.8rem] border border-black/12 bg-[linear-gradient(180deg,rgba(190,89,255,0.82),rgba(162,73,224,0.92))] p-5 text-white">
                <RadioTower className="size-5 text-primary" />
                <p className="mt-4 font-heading text-3xl font-semibold">Campaign lane</p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Give the app enough context to build the first promotion rhythm and growth tasks.
                </p>
              </div>
              <div className="rounded-[1.8rem] border border-black/12 bg-[linear-gradient(180deg,rgba(190,89,255,0.82),rgba(162,73,224,0.92))] p-5 text-white">
                <Sparkles className="size-5 text-primary" />
                <p className="mt-4 font-heading text-3xl font-semibold">Immediate action</p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Land on a populated dashboard with next steps instead of an empty admin shell.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/12 bg-background p-4 lg:p-6">
              <OnboardingForm defaultArtistName={user.name ?? ""} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
