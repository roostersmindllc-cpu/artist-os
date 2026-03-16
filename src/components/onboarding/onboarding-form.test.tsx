import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

    fireEvent.click(screen.getByRole("button", { name: "Complete onboarding" }));

    expect(await screen.findByText("Artist name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Genre is required.")).toBeInTheDocument();
    expect(await screen.findByText("Short bio is required.")).toBeInTheDocument();
    expect(await screen.findByText("Primary goal is required.")).toBeInTheDocument();
    expect(completeOnboardingActionMock).not.toHaveBeenCalled();
  });

  it("submits valid onboarding data and redirects to the dashboard", async () => {
    completeOnboardingActionMock.mockResolvedValueOnce({
      success: true,
      message: "Artist profile created."
    });

    render(<OnboardingForm defaultArtistName="Demo Artist" />);

    fireEvent.change(screen.getByLabelText("Genre"), {
      target: { value: "Alternative Pop" }
    });
    fireEvent.change(screen.getByLabelText("Short bio"), {
      target: {
        value:
          "Independent artist blending nocturnal synth textures with direct fan-first release planning."
      }
    });
    fireEvent.change(screen.getByLabelText("Primary goal for the next 90 days"), {
      target: {
        value: "Launch the next single and grow direct fan signups."
      }
    });

    fireEvent.click(screen.getByRole("button", { name: "Complete onboarding" }));

    await waitFor(() => {
      expect(completeOnboardingActionMock).toHaveBeenCalledWith({
        artistName: "Demo Artist",
        genre: "Alternative Pop",
        bio: "Independent artist blending nocturnal synth textures with direct fan-first release planning.",
        primaryGoal: "Launch the next single and grow direct fan signups."
      });
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
