import { describe, expect, it } from "vitest";

import {
  accountSettingsFormSchema,
  artistProfileSettingsFormSchema,
  normalizeAccountSettingsInput
} from "@/lib/validations/settings";

describe("settings validation", () => {
  it("normalizes account email and image url", () => {
    const normalized = normalizeAccountSettingsInput({
      name: "Avery Lane",
      email: "  AVERY@EXAMPLE.COM ",
      image: ""
    });

    expect(normalized).toEqual({
      name: "Avery Lane",
      email: "avery@example.com",
      image: null
    });
  });

  it("requires at least one social platform in artist profile settings", () => {
    const result = artistProfileSettingsFormSchema.safeParse({
      artistName: "North Avenue",
      genre: "Indie pop",
      bio: "An independent pop project building a bigger live audience.",
      primaryGoal: "Launch the next single with a clearer weekly content system.",
      audienceSize: "5000",
      socialPlatforms: [],
      platformsUsed: ["SPOTIFY"]
    });

    expect(result.success).toBe(false);
  });

  it("requires a valid account email", () => {
    const result = accountSettingsFormSchema.safeParse({
      name: "Avery Lane",
      email: "not-an-email",
      image: ""
    });

    expect(result.success).toBe(false);
  });
});
