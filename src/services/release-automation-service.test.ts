import { format } from "date-fns";
import { describe, expect, it } from "vitest";

import { buildReleaseAutomationPlan } from "@/services/release-automation-service";

describe("release automation service", () => {
  it("builds a future-dated rollout plan around the release date", () => {
    const plan = buildReleaseAutomationPlan(
      {
        title: "Neon Skyline",
        releaseDate: new Date("2026-04-18T12:00:00Z")
      },
      new Date("2026-03-16T12:00:00Z")
    );

    expect(plan.summary).toMatchObject({
      campaignCount: 1,
      contentItemCount: 3,
      taskCount: 3,
      usesProvisionalDate: false
    });
    expect(plan.campaign).toMatchObject({
      name: "Neon Skyline rollout",
      status: "DRAFT"
    });
    expect(format(plan.campaign.startDate, "yyyy-MM-dd")).toBe("2026-03-28");
    expect(plan.contentItems.map((item) => item.title)).toEqual([
      "Announce Neon Skyline",
      "TikTok teaser for Neon Skyline",
      "Release-day email for Neon Skyline"
    ]);
    expect(plan.tasks.map((task) => task.title)).toEqual([
      "Submit Neon Skyline to playlists",
      "Schedule TikTok posts for Neon Skyline",
      "Send email to fans about Neon Skyline"
    ]);
    expect(plan.tasks[0]?.dueDate && format(plan.tasks[0].dueDate, "yyyy-MM-dd")).toBe(
      "2026-03-28"
    );
  });

  it("uses a provisional 21-day runway and clamps overdue work to today", () => {
    const plan = buildReleaseAutomationPlan(
      {
        title: "Signal Bloom",
        releaseDate: null
      },
      new Date("2026-03-16T12:00:00Z")
    );

    expect(plan.summary).toMatchObject({
      usesProvisionalDate: true,
      campaignCount: 1,
      contentItemCount: 3,
      taskCount: 3
    });
    expect(format(plan.summary.anchorDate, "yyyy-MM-dd")).toBe("2026-04-06");
    expect(plan.campaign).toMatchObject({
      status: "ACTIVE"
    });
    expect(format(plan.campaign.startDate, "yyyy-MM-dd")).toBe("2026-03-16");
    expect(plan.contentItems.map((item) => format(item.dueDate, "yyyy-MM-dd"))).toEqual([
      "2026-03-23",
      "2026-03-30",
      "2026-04-06"
    ]);
    expect(plan.tasks[0]?.dueDate && format(plan.tasks[0].dueDate, "yyyy-MM-dd")).toBe(
      "2026-03-16"
    );
  });
});
