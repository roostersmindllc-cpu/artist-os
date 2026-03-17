import { z } from "zod";
import { startOfDay } from "date-fns";

import {
  onboardingPlatformValues,
  socialPlatformValues
} from "@/lib/domain-config";
import { isValidDateInput, stringToDate } from "@/lib/validations/shared";

const audienceSizeInput = z
  .string()
  .trim()
  .min(1, "Audience size is required.")
  .refine((value) => /^\d+$/.test(value), "Audience size must be a whole number.")
  .refine(
    (value) => Number(value) <= 100000000,
    "Audience size must be 100000000 or fewer."
  );

export const onboardingFormSchema = z.object({
  artistName: z
    .string()
    .trim()
    .min(2, "Artist name is required.")
    .max(120, "Artist name must be 120 characters or fewer."),
  socialPlatforms: z
    .array(z.enum(socialPlatformValues))
    .min(1, "Choose at least one social platform."),
  nextReleaseDate: z
    .string()
    .min(1, "Next release date is required.")
    .refine(isValidDateInput, "Enter a valid release date.")
    .refine(
      (value) => stringToDate(value).getTime() >= startOfDay(new Date()).getTime(),
      "Next release date must be today or later."
    ),
  audienceSize: audienceSizeInput,
  platformsUsed: z
    .array(z.enum(onboardingPlatformValues))
    .min(1, "Choose at least one platform you use today.")
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export function normalizeOnboardingInput(values: OnboardingFormValues) {
  return {
    artistName: values.artistName,
    audienceSize: Number(values.audienceSize),
    socialPlatforms: values.socialPlatforms,
    platformsUsed: values.platformsUsed
  };
}

export function getNormalizedOnboardingReleaseDate(values: OnboardingFormValues) {
  return stringToDate(values.nextReleaseDate);
}
