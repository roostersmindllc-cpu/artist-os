import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock, refreshMock, completeOnboardingActionMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
  completeOnboardingActionMock: vi.fn()
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock
  })
}));

vi.mock("@/app/actions/onboarding-actions", () => ({
  completeOnboardingAction: completeOnboardingActionMock
}));

import { OnboardingForm } from "@/components/onboarding/onboarding-form";

describe("OnboardingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows inline validation errors for invalid input", async () => {
    render(<OnboardingForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create my workspace" }));

    expect(await screen.findByText("Artist name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Choose at least one social platform.")).toBeInTheDocument();
    expect(await screen.findByText("Next release date is required.")).toBeInTheDocument();
    expect(await screen.findByText("Audience size is required.")).toBeInTheDocument();
    expect(
      await screen.findByText("Choose at least one platform you use today.")
    ).toBeInTheDocument();
    expect(completeOnboardingActionMock).not.toHaveBeenCalled();
  });

  it("submits valid onboarding data and redirects to the dashboard", async () => {
    completeOnboardingActionMock.mockResolvedValueOnce({
      success: true,
      message: "Workspace created with a seeded release plan."
    });

    render(<OnboardingForm defaultArtistName="Demo Artist" />);

    const socialPlatformsGroup = screen.getByRole("group", {
      name: "Social platforms"
    });
    const platformsUsedGroup = screen.getByRole("group", {
      name: "Platforms used"
    });

    fireEvent.click(within(socialPlatformsGroup).getByRole("button", { name: "Instagram" }));
    fireEvent.click(within(socialPlatformsGroup).getByRole("button", { name: "TikTok" }));
    fireEvent.change(screen.getByLabelText("Next release date"), {
      target: { value: "2099-04-20" }
    });
    fireEvent.change(screen.getByLabelText("Audience size"), {
      target: { value: "5000" }
    });
    fireEvent.click(within(platformsUsedGroup).getByRole("button", { name: "Spotify" }));
    fireEvent.click(within(platformsUsedGroup).getByRole("button", { name: "Email list" }));

    fireEvent.click(screen.getByRole("button", { name: "Create my workspace" }));

    await waitFor(() => {
      expect(completeOnboardingActionMock).toHaveBeenCalledWith({
        artistName: "Demo Artist",
        socialPlatforms: ["INSTAGRAM", "TIKTOK"],
        nextReleaseDate: "2099-04-20",
        audienceSize: "5000",
        platformsUsed: ["SPOTIFY", "EMAIL"]
      });
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
