import { EmptyState } from "@/components/shared/empty-state";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { requirePendingOnboardingUser } from "@/lib/route-access";

export default async function OnboardingPage() {
  const user = await requirePendingOnboardingUser();

  return (
    <div className="w-full max-w-3xl space-y-6">
      <EmptyState
        title="No artist profile yet"
        description="Finish onboarding to create your artist workspace and unlock the dashboard."
        actionLabel={null}
      />
      <OnboardingForm defaultArtistName={user.name ?? ""} />
    </div>
  );
}
