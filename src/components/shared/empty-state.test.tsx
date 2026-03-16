import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("renders the title, description, and action label", () => {
    render(
      createElement(EmptyState, {
        title: "No releases yet",
        description: "Create your first release to populate this area.",
        actionLabel: "Create release"
      })
    );

    expect(screen.getByText("No releases yet")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first release to populate this area.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create release" })).toBeDisabled();
  });

  it("hides the action button when no action label is provided", () => {
    render(
      createElement(EmptyState, {
        title: "No artist profile yet",
        description: "Finish onboarding to create your workspace.",
        actionLabel: null
      })
    );

    expect(screen.getByText("No artist profile yet")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /create|add|profile/i })
    ).not.toBeInTheDocument();
  });

  it("renders the card variant when requested", () => {
    render(
      createElement(EmptyState, {
        title: "No content yet",
        description: "Add your first content item.",
        variant: "card"
      })
    );

    expect(screen.getByText("No content yet")).toBeInTheDocument();
  });
});
