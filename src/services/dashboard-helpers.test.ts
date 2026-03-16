import { describe, expect, it } from "vitest";

import {
  buildDashboardActivityFeed,
  getDashboardActivityActionLabel
} from "@/services/dashboard-helpers";

describe("dashboard helpers", () => {
  it("detects whether activity is a create or update", () => {
    expect(
      getDashboardActivityActionLabel(
        new Date("2026-03-01T10:00:00Z"),
        new Date("2026-03-01T10:00:00Z")
      )
    ).toBe("Created");

    expect(
      getDashboardActivityActionLabel(
        new Date("2026-03-01T10:00:00Z"),
        new Date("2026-03-02T10:00:00Z")
      )
    ).toBe("Updated");
  });

  it("sorts mixed activity by most recent update", () => {
    const feed = buildDashboardActivityFeed([
      {
        kind: "release",
        id: "release-1",
        title: "Neon Skyline",
        status: "SCHEDULED",
        createdAt: new Date("2026-03-01T10:00:00Z"),
        updatedAt: new Date("2026-03-04T10:00:00Z"),
        href: "/releases"
      },
      {
        kind: "task",
        id: "task-1",
        title: "Approve teaser cut",
        status: "IN_PROGRESS",
        dueDate: new Date("2026-03-06T10:00:00Z"),
        createdAt: new Date("2026-03-05T10:00:00Z"),
        updatedAt: new Date("2026-03-05T10:00:00Z"),
        href: "/tasks"
      }
    ]);

    expect(feed[0]?.kind).toBe("task");
    expect(feed[1]?.kind).toBe("release");
  });
});
