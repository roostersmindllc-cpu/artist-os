import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn()
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock
  }
}));

import { ConfirmActionButton } from "@/components/shared/confirm-action-button";

describe("ConfirmActionButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not run the action when the confirmation is canceled", async () => {
    const onConfirm = vi.fn().mockResolvedValue({
      success: true,
      message: "Deleted."
    });
    vi.spyOn(window, "confirm").mockReturnValueOnce(false);

    render(
      <ConfirmActionButton
        label="Delete release"
        confirmTitle="Delete release?"
        confirmMessage="This cannot be undone."
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete release" }));

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("runs the action and calls onSuccess after confirmation", async () => {
    const onConfirm = vi.fn().mockResolvedValue({
      success: true,
      message: "Deleted."
    });
    const onSuccess = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    render(
      <ConfirmActionButton
        label="Delete release"
        confirmTitle="Delete release?"
        confirmMessage="This cannot be undone."
        onConfirm={onConfirm}
        onSuccess={onSuccess}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete release" }));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(toastSuccessMock).toHaveBeenCalledWith("Deleted.");
    });
  });
});
