import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  pushMock,
  refreshMock,
  createTaskActionMock,
  toastSuccessMock,
  toastErrorMock
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
  createTaskActionMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn()
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock
  })
}));

vi.mock("@/app/actions/task-actions", () => ({
  createTaskAction: createTaskActionMock
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock
  }
}));

import { TaskForm } from "@/components/forms/task-form";

describe("TaskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors and blocks invalid submission", async () => {
    render(<TaskForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByText("Task title is required.")).toBeInTheDocument();
    expect(createTaskActionMock).not.toHaveBeenCalled();
  });

  it("submits a valid create flow and refreshes the workspace", async () => {
    createTaskActionMock.mockResolvedValueOnce({
      success: true,
      message: "Task created."
    });

    render(<TaskForm />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Finalize distributor metadata" }
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Double-check writer splits and pitch notes." }
    });
    fireEvent.change(screen.getByLabelText("Due date"), {
      target: { value: "2026-04-10" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => {
      expect(createTaskActionMock).toHaveBeenCalledWith({
        title: "Finalize distributor metadata",
        description: "Double-check writer splits and pitch notes.",
        dueDate: "2026-04-10",
        priority: "MEDIUM",
        status: "TODO",
        relatedType: "",
        relatedId: ""
      });
      expect(toastSuccessMock).toHaveBeenCalledWith("Task created.");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
