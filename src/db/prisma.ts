import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/lib/server-env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: serverEnv.DATABASE_URL,
  max: serverEnv.PRISMA_POOL_MAX,
  idleTimeoutMillis: serverEnv.PRISMA_POOL_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: serverEnv.PRISMA_POOL_CONNECTION_TIMEOUT_MS
}, {
  onPoolError(error) {
    console.error("Prisma adapter pool error", error);
  }
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
