"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import type {
  AccountSettingsFormValues,
  ArtistProfileSettingsFormValues,
  PreferencesFormValues
} from "@/lib/validations/settings";
import {
  updateAccountSettingsForUser,
  updateArtistProfileSettingsForUser,
  updatePreferencesForUser
} from "@/services/settings-service";
import { getErrorMessage } from "@/services/service-utils";

function revalidateSettingsPaths() {
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function updateAccountSettingsAction(
  values: AccountSettingsFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await updateAccountSettingsForUser(user.id, values);
    revalidateSettingsPaths();

    return {
      success: true,
      message: "Profile settings updated."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function updateArtistProfileSettingsAction(
  values: ArtistProfileSettingsFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await updateArtistProfileSettingsForUser(user.id, values);
    revalidateSettingsPaths();

    return {
      success: true,
      message: "Artist profile updated."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export async function updatePreferencesAction(
  values: PreferencesFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await updatePreferencesForUser(user.id, values);
    revalidateSettingsPaths();

    return {
      success: true,
      message: "Preferences saved."
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}
