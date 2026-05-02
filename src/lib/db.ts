// Re-export the singleton Prisma client from prisma.ts
// This prevents duplicate connections to the database.
export { prisma as db } from "./prisma";
