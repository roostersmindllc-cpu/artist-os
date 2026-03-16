"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import type { OnboardingFormValues } from "@/lib/validations/onboarding";
import { completeArtistOnboardingForUser } from "@/services/artist-profiles-service";
import { getErrorMessage } from "@/services/service-utils";

export async function completeOnboardingAction(
  values: OnboardingFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await completeArtistOnboardingForUser(user.id, values);
    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return {
      success: true,
      message: "Artist profile created."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
