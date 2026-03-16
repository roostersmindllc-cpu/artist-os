import { describe, expect, it } from "vitest";

import { buildUpcomingReleaseMilestones } from "@/services/releases-helpers";

describe("releases helpers", () => {
  it("sorts release milestones by earliest upcoming date", () => {
    const milestones = buildUpcomingReleaseMilestones(
      {
        release: {
          id: "release-1",
          title: "Neon Skyline",
          releaseDate: new Date("2026-04-20T00:00:00Z")
        },
        campaigns: [
          {
            id: "campaign-1",
            name: "Pre-save push",
            startDate: new Date("2026-04-10T00:00:00Z"),
            endDate: new Date("2026-04-18T00:00:00Z")
          }
        ],
        contentItems: [
          {
            id: "content-1",
            title: "Teaser reel",
            platform: "INSTAGRAM",
            dueDate: new Date("2026-04-08T00:00:00Z")
          }
        ],
        tasks: [
          {
            id: "task-1",
            title: "Approve master",
            dueDate: new Date("2026-04-05T00:00:00Z"),
            status: "TODO"
          }
        ]
      },
      new Date("2026-04-01T00:00:00Z")
    );

    expect(milestones[0]?.label).toBe("Task due");
    expect(milestones[1]?.label).toBe("Content due");
    expect(milestones.at(-1)?.label).toBe("Release date");
  });
});
