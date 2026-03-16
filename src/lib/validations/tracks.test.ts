import { describe, expect, it } from "vitest";

import { normalizeTrackInput, trackFormSchema } from "@/lib/validations/tracks";

describe("track validation", () => {
  it("normalizes duration and uppercases ISRC", () => {
    const parsed = trackFormSchema.parse({
      title: "Lead single",
      durationSeconds: "205",
      isrc: "usrc17607839",
      versionName: "Radio edit",
      status: "MASTERED"
    });

    expect(normalizeTrackInput(parsed)).toEqual({
      title: "Lead single",
      durationSeconds: 205,
      isrc: "USRC17607839",
      versionName: "Radio edit",
      status: "MASTERED"
    });
  });
});
