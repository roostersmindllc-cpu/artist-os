import { z } from "zod";

export const onboardingFormSchema = z.object({
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
    .max(160, "Primary goal must be 160 characters or fewer.")
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export function normalizeOnboardingInput(values: OnboardingFormValues) {
  return {
    artistName: values.artistName,
    genre: values.genre,
    bio: values.bio,
    goals: [values.primaryGoal]
  };
}
