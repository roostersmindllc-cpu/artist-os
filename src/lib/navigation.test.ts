import path from "node:path";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  appNavigation,
  getNavigationMeta,
  isNavigationItemActive
} from "@/lib/navigation";

describe("navigation helpers", () => {
  it("matches nested routes for non-dashboard pages", () => {
    expect(isNavigationItemActive("/releases/neon-skyline", "/releases")).toBe(true);
    expect(isNavigationItemActive("/dashboard/overview", "/dashboard")).toBe(false);
  });

  it("returns page metadata for the current pathname", () => {
    expect(getNavigationMeta("/content")).toEqual({
      pageTitle: "Content Calendar",
      pageEyebrow: "Publishing rhythm"
    });
  });

  it("maps every app navigation item to a real route file", () => {
    const appRoutesDirectory = path.resolve(process.cwd(), "src/app/(app)");

    for (const item of appNavigation) {
      const routeDirectory = path.join(
        appRoutesDirectory,
        item.href.replace(/^\//, "")
      );

      expect(existsSync(path.join(routeDirectory, "page.tsx"))).toBe(true);
    }
  });
});
