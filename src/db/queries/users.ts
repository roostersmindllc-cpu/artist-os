import { prisma } from "@/db/prisma";

type CreateUserInput = {
  email: string;
  name: string | null;
  passwordHash: string;
};

type UpdateUserInput = {
  email: string;
  name: string | null;
  image: string | null;
};

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId }
  });
}

export async function createUser(data: CreateUserInput) {
  return prisma.user.create({
    data
  });
}

export async function updateUserById(userId: string, data: UpdateUserInput) {
  return prisma.user.update({
    where: { id: userId },
    data
  });
}

export async function isUserEmailTaken(email: string, excludeUserId?: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      ...(excludeUserId ? { id: { not: excludeUserId } } : {})
    },
    select: { id: true }
  });

  return Boolean(existingUser);
}
