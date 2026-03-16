import { redirect } from "next/navigation";

import { getServerAuthSession, requireUser } from "@/lib/auth";
import { getPostAuthRedirectPath } from "@/services/auth-service";
import { getArtistProfileForUser } from "@/services/artist-profiles-service";

export async function redirectAuthenticatedUser() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return;
  }

  redirect(await getPostAuthRedirectPath(session.user.id));
}

export async function requireOnboardedUser() {
  const user = await requireUser();
  const artistProfile = await getArtistProfileForUser(user.id);

  if (!artistProfile) {
    redirect("/onboarding");
  }

  return {
    user,
    artistProfile
  };
}

export async function requirePendingOnboardingUser() {
  const user = await requireUser();
  const artistProfile = await getArtistProfileForUser(user.id);

  if (artistProfile) {
    redirect("/dashboard");
  }

  return user;
}
