import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Force the correct DATABASE_URL in case system env overrides
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'mysql://trustfit_jobready_database_admin:Admincyber@vda7300.is.cc:3306/trustfit_jobready_database'

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
