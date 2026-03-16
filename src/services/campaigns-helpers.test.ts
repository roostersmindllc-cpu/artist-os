import { describe, expect, it } from "vitest";

import { buildCampaignTimeline } from "@/services/campaigns-helpers";

describe("campaign helpers", () => {
  it("sorts campaign timeline events chronologically", () => {
    const timeline = buildCampaignTimeline({
      campaign: {
        id: "campaign-1",
        name: "Single rollout",
        startDate: new Date("2026-04-02T00:00:00Z"),
        endDate: new Date("2026-04-20T00:00:00Z")
      },
      release: {
        id: "release-1",
        title: "Midnight Broadcast",
        releaseDate: new Date("2026-04-18T00:00:00Z")
      },
      contentItems: [
        {
          id: "content-1",
          title: "Teaser edit",
          platform: "INSTAGRAM",
          dueDate: new Date("2026-04-05T00:00:00Z"),
          publishedAt: null
        }
      ],
      tasks: [
        {
          id: "task-1",
          title: "Approve ad creative",
          dueDate: new Date("2026-04-04T00:00:00Z"),
          priority: "HIGH",
          status: "TODO"
        }
      ]
    });

    expect(timeline[0]?.label).toBe("Campaign start");
    expect(timeline[1]?.label).toBe("Task due");
    expect(timeline.at(-1)?.label).toBe("Campaign end");
  });
});
