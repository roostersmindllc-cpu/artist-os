import { ArrowRight, Disc3, RadioTower, Sparkles } from "lucide-react";

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
      <div className="w-full max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(2,132,199,0.14),transparent_30%),rgba(255,255,255,0.55)] p-6 shadow-sm backdrop-blur lg:p-8 dark:bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%),rgba(9,20,34,0.72)]">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="size-4" />
                Magical onboarding
              </div>
              <div className="space-y-3">
                <h1 className="font-heading text-4xl font-semibold tracking-tight">
                  Build {user.name ?? "your"} workspace before the first dashboard load.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Instead of dropping you into an empty tool, Artist OS will create a
                  starter release system from your next date, social mix, and audience size.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-border/70 bg-background/55 p-4">
                  <Disc3 className="size-4 text-primary" />
                  <p className="mt-3 font-medium">First release entry</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Placeholder release created and ready to rename.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/55 p-4">
                  <RadioTower className="size-4 text-primary" />
                  <p className="mt-3 font-medium">Starter campaign</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    An active launch plan tied to your selected channels.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/55 p-4">
                  <ArrowRight className="size-4 text-primary" />
                  <p className="mt-3 font-medium">Immediate next steps</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Week-one content and tasks waiting on the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <OnboardingForm defaultArtistName={user.name ?? ""} />
      </div>
    </>
  );
}
