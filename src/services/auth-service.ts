import { Prisma } from "@prisma/client";

import { getArtistProfileByUserId } from "@/db/queries/artist-profiles";
import { createUser, getUserByEmail } from "@/db/queries/users";
import { hashPassword } from "@/lib/password";
import { signUpSchema, type SignUpFormValues } from "@/lib/validations/auth";

export function resolvePostAuthRedirectPath(hasArtistProfile: boolean) {
  return hasArtistProfile ? "/dashboard" : "/onboarding";
}

export async function getPostAuthRedirectPath(userId: string) {
  const artistProfile = await getArtistProfileByUserId(userId);
  return resolvePostAuthRedirectPath(Boolean(artistProfile));
}

export async function createUserAccount(values: SignUpFormValues) {
  const parsed = signUpSchema.parse(values);
  const existingUser = await getUserByEmail(parsed.email);

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  try {
    return await createUser({
      email: parsed.email,
      name: parsed.name,
      passwordHash: await hashPassword(parsed.password)
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("An account with this email already exists.");
    }

    throw error;
  }
}
