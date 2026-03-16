import type { AnchorHTMLAttributes } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock, refreshMock, signInMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
  signInMock: vi.fn()
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock
  })
}));

vi.mock("next-auth/react", () => ({
  signIn: signInMock
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

import { SignInForm } from "@/components/auth/sign-in-form";

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows inline validation errors before calling sign in", async () => {
    render(<SignInForm />);

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(await screen.findByText("Password must be at least 8 characters.")).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("routes successful sign-ins through the server-decided post-auth redirect", async () => {
    signInMock.mockResolvedValueOnce({ ok: true });

    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "demo@artistos.app" }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "artistos-demo-password" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        email: "demo@artistos.app",
        password: "artistos-demo-password",
        redirect: false
      });
      expect(pushMock).toHaveBeenCalledWith("/");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
