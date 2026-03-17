"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { captureServerAnalyticsEvent } from "@/lib/posthog-server";
import type { OnboardingFormValues } from "@/lib/validations/onboarding";
import { completeOnboardingForUser } from "@/services/onboarding-service";
import { getErrorMessage } from "@/services/service-utils";

export async function completeOnboardingAction(
  values: OnboardingFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const result = await completeOnboardingForUser(user.id, values);
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    revalidatePath("/releases");
    revalidatePath("/campaigns");
    revalidatePath("/content");
    revalidatePath("/tasks");
    await captureServerAnalyticsEvent({
      distinctId: user.id,
      event: "onboarding completed",
      properties: {
        contentItemCount: result.summary.contentItemCount,
        taskCount: result.summary.taskCount
      }
    });

    return {
      success: true,
      message: "Workspace created with a seeded release plan."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
