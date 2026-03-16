import { describe, expect, it } from "vitest";

import { signUpSchema } from "@/lib/validations/auth";

describe("auth validation", () => {
  it("rejects sign-up when passwords do not match", () => {
    const result = signUpSchema.safeParse({
      name: "Taylor Artist",
      email: "taylor@example.com",
      password: "password123",
      confirmPassword: "password124"
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
      "Passwords do not match."
    );
  });
});
