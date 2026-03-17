import { describe, expect, it } from "vitest";

import {
  normalizeOnboardingInput,
  onboardingFormSchema
} from "@/lib/validations/onboarding";

describe("onboarding validation", () => {
  it("normalizes onboarding values into artist profile data", () => {
    const parsed = onboardingFormSchema.parse({
      artistName: "The Midnight Run",
      socialPlatforms: ["INSTAGRAM", "TIKTOK"],
      nextReleaseDate: "2099-05-14",
      audienceSize: "4200",
      platformsUsed: ["SPOTIFY", "EMAIL"]
    });

    expect(normalizeOnboardingInput(parsed)).toEqual({
      artistName: "The Midnight Run",
      audienceSize: 4200,
      socialPlatforms: ["INSTAGRAM", "TIKTOK"],
      platformsUsed: ["SPOTIFY", "EMAIL"]
    });
  });

  it("requires at least one social platform", () => {
    const result = onboardingFormSchema.safeParse({
      artistName: "The Midnight Run",
      socialPlatforms: [],
      nextReleaseDate: "2099-05-14",
      audienceSize: "4200",
      platformsUsed: ["SPOTIFY"]
    });

    expect(result.success).toBe(false);
  });
});
