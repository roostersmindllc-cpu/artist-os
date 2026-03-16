import { cookies } from "next/headers";

import {
  defaultPreferences,
  preferencesFormSchema,
  type PreferencesFormValues
} from "@/lib/validations/settings";

function getPreferencesCookieName(userId: string) {
  return `artist-os-preferences-${userId}`;
}

export async function getUserPreferences(userId: string): Promise<PreferencesFormValues> {
  const cookieStore = await cookies();
  const storedPreferences = cookieStore.get(getPreferencesCookieName(userId))?.value;

  if (!storedPreferences) {
    return defaultPreferences;
  }

  try {
    return preferencesFormSchema.parse(JSON.parse(storedPreferences));
  } catch {
    return defaultPreferences;
  }
}

export async function saveUserPreferences(
  userId: string,
  values: PreferencesFormValues
): Promise<PreferencesFormValues> {
  const parsed = preferencesFormSchema.parse(values);
  const cookieStore = await cookies();

  cookieStore.set(getPreferencesCookieName(userId), JSON.stringify(parsed), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return parsed;
}
