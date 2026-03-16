import { describe, expect, it } from "vitest";

import {
  normalizeOnboardingInput,
  onboardingFormSchema
} from "@/lib/validations/onboarding";

describe("onboarding validation", () => {
  it("normalizes onboarding values into artist profile data", () => {
    const parsed = onboardingFormSchema.parse({
      artistName: "The Midnight Run",
      genre: "Indie Pop",
      bio: "Independent pop project built around hooks and late-night synths.",
      primaryGoal: "Launch the next single and grow direct fan signups."
    });

    expect(normalizeOnboardingInput(parsed)).toEqual({
      artistName: "The Midnight Run",
      genre: "Indie Pop",
      bio: "Independent pop project built around hooks and late-night synths.",
      goals: ["Launch the next single and grow direct fan signups."]
    });
  });

  it("requires a primary goal", () => {
    const result = onboardingFormSchema.safeParse({
      artistName: "The Midnight Run",
      genre: "Indie Pop",
      bio: "Independent pop project built around hooks and late-night synths.",
      primaryGoal: ""
    });

    expect(result.success).toBe(false);
  });
});
