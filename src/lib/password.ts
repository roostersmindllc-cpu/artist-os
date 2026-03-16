import { compare, hash } from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(value: string) {
  return hash(value, SALT_ROUNDS);
}

export async function verifyPassword(value: string, hashedValue: string) {
  return compare(value, hashedValue);
}

