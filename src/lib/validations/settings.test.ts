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

  it("requires a valid artist profile goal", () => {
    const result = artistProfileSettingsFormSchema.safeParse({
      artistName: "North Avenue",
      genre: "Indie Pop",
      bio: "Tight melodies and cinematic hooks for late-night drives.",
      primaryGoal: "short"
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
