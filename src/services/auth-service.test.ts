import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getArtistProfileByUserIdMock,
  createUserMock,
  getUserByEmailMock,
  hashPasswordMock
} = vi.hoisted(() => ({
  getArtistProfileByUserIdMock: vi.fn(),
  createUserMock: vi.fn(),
  getUserByEmailMock: vi.fn(),
  hashPasswordMock: vi.fn()
}));

vi.mock("@/db/queries/artist-profiles", () => ({
  getArtistProfileByUserId: getArtistProfileByUserIdMock
}));

vi.mock("@/db/queries/users", () => ({
  createUser: createUserMock,
  getUserByEmail: getUserByEmailMock
}));

vi.mock("@/lib/password", () => ({
  hashPassword: hashPasswordMock
}));

import {
  createUserAccount,
  getPostAuthRedirectPath,
  resolvePostAuthRedirectPath
} from "@/services/auth-service";

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves the post-auth redirect path from profile state", () => {
    expect(resolvePostAuthRedirectPath(true)).toBe("/dashboard");
    expect(resolvePostAuthRedirectPath(false)).toBe("/onboarding");
  });

  it("looks up the artist profile before choosing a post-auth redirect", async () => {
    getArtistProfileByUserIdMock.mockResolvedValueOnce({ id: "artist_1" });

    await expect(getPostAuthRedirectPath("user_1")).resolves.toBe("/dashboard");
    expect(getArtistProfileByUserIdMock).toHaveBeenCalledWith("user_1");
  });

  it("creates a new user account with validated and normalized values", async () => {
    getUserByEmailMock.mockResolvedValueOnce(null);
    hashPasswordMock.mockResolvedValueOnce("hashed-password");
    createUserMock.mockResolvedValueOnce({ id: "user_1" });

    await createUserAccount({
      name: "  Demo Artist  ",
      email: " demo@example.com ",
      password: "password123",
      confirmPassword: "password123"
    });

    expect(hashPasswordMock).toHaveBeenCalledWith("password123");
    expect(createUserMock).toHaveBeenCalledWith({
      email: "demo@example.com",
      name: "Demo Artist",
      passwordHash: "hashed-password"
    });
  });

  it("rejects duplicate email sign-up attempts before creation", async () => {
    getUserByEmailMock.mockResolvedValueOnce({ id: "existing_user" });

    await expect(
      createUserAccount({
        name: "Demo Artist",
        email: "demo@example.com",
        password: "password123",
        confirmPassword: "password123"
      })
    ).rejects.toThrow("An account with this email already exists.");

    expect(createUserMock).not.toHaveBeenCalled();
  });
});
