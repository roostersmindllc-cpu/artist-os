import { z } from "zod";

import {
  metricSourceValues,
  onboardingPlatformValues,
  socialPlatformValues
} from "@/lib/domain-config";
import { emptyToNull, optionalUrl } from "@/lib/validations/shared";

const audienceSizeInput = z
  .string()
  .trim()
  .min(1, "Audience size is required.")
  .refine((value) => /^\d+$/.test(value), "Audience size must be a whole number.")
  .refine(
    (value) => Number(value) <= 100000000,
    "Audience size must be 100000000 or fewer."
  );

export const contentCalendarViewValues = ["MONTH", "WEEK", "LIST"] as const;
export const weekStartsOnValues = ["SUNDAY", "MONDAY"] as const;

export const accountSettingsFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address."),
  image: optionalUrl
});

export type AccountSettingsFormValues = z.infer<typeof accountSettingsFormSchema>;

export function normalizeAccountSettingsInput(values: AccountSettingsFormValues) {
  return {
    name: values.name,
    email: values.email.trim().toLowerCase(),
    image: emptyToNull(values.image)
  };
}

export const artistProfileSettingsFormSchema = z.object({
  artistName: z
    .string()
    .trim()
    .min(2, "Artist name is required.")
    .max(120, "Artist name must be 120 characters or fewer."),
  genre: z
    .string()
    .trim()
    .min(2, "Genre is required.")
    .max(80, "Genre must be 80 characters or fewer."),
  bio: z
    .string()
    .trim()
    .min(12, "Short bio is required.")
    .max(280, "Bio must be 280 characters or fewer."),
  primaryGoal: z
    .string()
    .trim()
    .min(10, "Primary goal is required.")
    .max(160, "Primary goal must be 160 characters or fewer."),
  audienceSize: audienceSizeInput,
  socialPlatforms: z
    .array(z.enum(socialPlatformValues))
    .min(1, "Choose at least one social platform."),
  platformsUsed: z
    .array(z.enum(onboardingPlatformValues))
    .min(1, "Choose at least one platform you use today.")
});

export type ArtistProfileSettingsFormValues = z.infer<
  typeof artistProfileSettingsFormSchema
>;

export function normalizeArtistProfileSettingsInput(
  values: ArtistProfileSettingsFormValues
) {
  return {
    artistName: values.artistName,
    genre: values.genre,
    bio: values.bio,
    goals: [values.primaryGoal],
    audienceSize: Number(values.audienceSize),
    socialPlatforms: values.socialPlatforms,
    platformsUsed: values.platformsUsed
  };
}

export function buildArtistProfileSettingsFormValues(values: {
  artistName: string;
  genre: string | null;
  bio: string | null;
  goals: string[];
  audienceSize: number | null;
  socialPlatforms: string[];
  platformsUsed: string[];
}): ArtistProfileSettingsFormValues {
  return {
    artistName: values.artistName,
    genre: values.genre ?? "",
    bio: values.bio ?? "",
    primaryGoal: values.goals[0] ?? "",
    audienceSize: values.audienceSize !== null ? String(values.audienceSize) : "",
    socialPlatforms: values.socialPlatforms.filter((value): value is (typeof socialPlatformValues)[number] =>
      (socialPlatformValues as readonly string[]).includes(value)
    ),
    platformsUsed: values.platformsUsed.filter((value): value is (typeof onboardingPlatformValues)[number] =>
      (onboardingPlatformValues as readonly string[]).includes(value)
    )
  };
}

export const preferencesFormSchema = z.object({
  defaultAnalyticsSource: z.enum(metricSourceValues),
  defaultContentView: z.enum(contentCalendarViewValues),
  weekStartsOn: z.enum(weekStartsOnValues)
});

export type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export const defaultPreferences: PreferencesFormValues = {
  defaultAnalyticsSource: "SPOTIFY",
  defaultContentView: "MONTH",
  weekStartsOn: "MONDAY"
};
