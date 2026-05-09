import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "mysql://trustfit_jobready_database_admin:Admincyber@vda7300.is.cc:3306/trustfit_jobready_database",
    },
  },
});

async function main() {
  console.log("Seeding test users...");

  const seekerHash = await bcrypt.hash("password123", 12);
  const employerHash = await bcrypt.hash("password123", 12);

  const seeker = await prisma.user.upsert({
    where: { email: "seeker@test.com" },
    update: {},
    create: {
      email: "seeker@test.com",
      passwordHash: seekerHash,
      name: "Test Job Seeker",
      phone: "+254 712 345 678",
      county: "Nairobi",
      bio: "A motivated professional looking for new opportunities in the tech industry.",
      role: "SEEKER",
      emailVerified: true,
      isActive: true,
    },
  });

  const employer = await prisma.user.upsert({
    where: { email: "employer@test.com" },
    update: {},
    create: {
      email: "employer@test.com",
      passwordHash: employerHash,
      name: "Test Employer",
      phone: "+254 723 456 789",
      county: "Nairobi",
      bio: "HR manager at a growing tech company in Nairobi.",
      role: "EMPLOYER",
      emailVerified: true,
      isActive: true,
    },
  });

  console.log("Test users seeded:");
  console.log(`  Seeker: seeker@test.com / password123 (ID: ${seeker.id})`);
  console.log(`  Employer: employer@test.com / password123 (ID: ${employer.id})`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
