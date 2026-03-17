import { format } from "date-fns";
import { describe, expect, it } from "vitest";

import { buildOnboardingWorkspacePlan } from "@/services/onboarding-helpers";

describe("onboarding helpers", () => {
  it("builds a seeded workspace plan from onboarding inputs", () => {
    const plan = buildOnboardingWorkspacePlan(
      {
        artistName: "North Avenue",
        socialPlatforms: ["INSTAGRAM", "TIKTOK"],
        nextReleaseDate: new Date("2026-04-20T12:00:00Z"),
        audienceSize: 5200,
        platformsUsed: ["SPOTIFY", "EMAIL"]
      },
      new Date("2026-03-16T12:00:00Z")
    );

    expect(plan.profile).toMatchObject({
      artistName: "North Avenue",
      audienceSize: 5200,
      socialPlatforms: ["INSTAGRAM", "TIKTOK"],
      platformsUsed: ["SPOTIFY", "EMAIL"]
    });
    expect(plan.release).toMatchObject({
      title: "Next Release",
      type: "SINGLE",
      status: "SCHEDULED",
      distributor: "Distributor TBD"
    });
    expect(plan.campaign).toMatchObject({
      name: "Next Release starter campaign",
      status: "ACTIVE"
    });
    expect(plan.contentItems.map((item) => item.platform)).toEqual([
      "INSTAGRAM",
      "TIKTOK",
      "INSTAGRAM"
    ]);
    expect(plan.contentItems.map((item) => format(item.dueDate, "yyyy-MM-dd"))).toEqual([
      "2026-03-16",
      "2026-03-18",
      "2026-03-21"
    ]);
    expect(plan.tasks[0]?.title).toBe("Rename Next Release and confirm the date");
    expect(format(plan.tasks[0]?.dueDate ?? new Date(), "yyyy-MM-dd")).toBe(
      "2026-03-16"
    );
  });
});
