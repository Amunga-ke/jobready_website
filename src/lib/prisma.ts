import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function buildDatabaseUrl(): string {
  const base = process.env.DATABASE_URL || "";
  // Shared hosting has low max_user_connections — keep pool small
  if (base.includes("connection_limit")) return base;
  const sep = base.includes("?") ? "&" : "?";
  // Vercel serverless: keep pool small to avoid exhausting shared MySQL max_user_connections
  return `${base}${sep}connection_limit=3&pool_timeout=15`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: {
      db: {
        url: buildDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
