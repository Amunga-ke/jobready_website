// ─── JobReady Lookup Tables Seed (Optimized) ───
// Populates: Categories, Subcategories, Counties, Tags
// Usage: DATABASE_URL="mysql://..." npx tsx prisma/seed-lookup.ts

import { PrismaClient } from "@prisma/client";
import { JOB_CATEGORIES, KE_COUNTIES } from "../src/lib/constants";

const prisma = new PrismaClient();

const CATEGORY_ICONS: Record<string, string> = {
  TECHNOLOGY: "laptop",
  FINANCE_ACCOUNTING: "banknote",
  SALES_BUSINESS: "trending-up",
  MARKETING_COMMUNICATIONS: "megaphone",
  HUMAN_RESOURCES: "users",
  ENGINEERING: "hard-hat",
  HEALTHCARE: "heart-pulse",
  EDUCATION: "book-open",
  GOVERNMENT_PUBLIC_SECTOR: "landmark",
};

const TAGS = [
  "Remote", "On-site", "Hybrid", "Work from Home",
  "Entry Level", "Mid Level", "Senior", "Executive", "No Experience Required",
  "Government", "Private Sector", "NGO", "State Corporation", "County Government",
  "Fintech", "Banking", "Technology", "Healthcare", "Education", "Agriculture",
  "Manufacturing", "Logistics", "Hospitality", "Retail", "FMCG", "Telecommunications",
  "Energy", "Construction", "Mining", "Pharmaceutical", "Insurance",
  "Backend", "Frontend", "Full Stack", "Mobile", "DevOps", "Cloud",
  "Cybersecurity", "Data Science", "Machine Learning", "AI", "Blockchain",
  "UI/UX Design", "Product Management", "QA Testing",
  "Sales", "Marketing", "Accounting", "Audit", "Consulting", "Legal",
  "HR", "Operations", "Supply Chain", "Procurement",
  "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
  "Software Engineering", "Chemical Engineering", "Biomedical Engineering",
  "Internship", "Scholarship", "Fellowship", "Grant", "Volunteer",
  "Mentorship", "Apprenticeship", "Training",
  "Immediate Start", "Featured", "Urgent", "Graduate",
  "Certification", "Leadership", "Management", "Research", "Creative",
  "Design", "Writing", "Customer Service", "Administration",
];

async function main() {
  console.log("JobReady Lookup Tables Seed");
  console.log("=".repeat(40));

  // ── 1. Categories ──
  console.log("Seeding categories...");
  const catMap = new Map<string, string>(); // slug -> id

  for (let i = 0; i < JOB_CATEGORIES.length; i++) {
    const cat = JOB_CATEGORIES[i];
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.label, icon: CATEGORY_ICONS[cat.value] || null, sortOrder: i, active: true },
      create: { slug: cat.slug, name: cat.label, icon: CATEGORY_ICONS[cat.value] || null, sortOrder: i, active: true },
    });
    catMap.set(cat.slug, record.id);
  }
  console.log(`  -> ${catMap.size} categories`);

  // ── 2. Subcategories (batch per category) ──
  console.log("Seeding subcategories...");
  let totalSubs = 0;

  for (const cat of JOB_CATEGORIES) {
    const catId = catMap.get(cat.slug)!;
    const data = cat.subcategories.map((sub, j) => ({
      slug: sub.slug,
      name: sub.label,
      categoryId: catId,
      sortOrder: j,
      active: true,
    }));

    // Use createMany with skipDuplicates for speed
    const result = await prisma.subcategory.createMany({ data, skipDuplicates: true });
    totalSubs += data.length;
  }
  console.log(`  -> ${totalSubs} subcategories`);

  // ── 3. Counties ──
  console.log("Seeding counties...");
  const COUNTY_CODES: Record<string, string> = {
    "Nairobi": "NB", "Mombasa": "MS", "Kisumu": "KS", "Nakuru": "NR",
    "Uasin Gishu": "UG", "Kiambu": "KB", "Machakos": "MK", "Meru": "MR",
    "Kakamega": "KG", "Nyandarua": "ND", "Nyeri": "NY", "Murang'a": "MG",
    "Kilifi": "KF", "Makueni": "MU", "Bungoma": "BG", "Embu": "EB",
    "Kitui": "KT", "Garissa": "GS", "Kajiado": "KJ", "Mandera": "MD",
    "Lamu": "LM", "Marsabit": "MB", "Trans Nzoia": "TZ", "Isiolo": "IS",
    "Homa Bay": "HB", "Kisii": "KI", "Kericho": "KR", "Laikipia": "LK",
    "Migori": "MI", "Narok": "NK", "Samburu": "SB", "Siaya": "SA",
    "Taita Taveta": "TT", "Tana River": "TR", "Tharaka Nithi": "TN",
    "Vihiga": "VH", "Wajir": "WJ", "West Pokot": "WP", "Baringo": "BR",
    "Busia": "BU", "Elgeyo Marakwet": "EM", "Nandi": "NI", "Nyamira": "NM",
    "Turkana": "TK", "Kwale": "KW",
  };

  const countyData = KE_COUNTIES.map((name) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    code: COUNTY_CODES[name] || null,
    active: true,
  }));

  await prisma.county.createMany({ data: countyData, skipDuplicates: true });
  console.log(`  -> ${countyData.length} counties`);

  // ── 4. Tags ──
  console.log("Seeding tags...");
  await prisma.tag.createMany({
    data: TAGS.map((name) => ({ name })),
    skipDuplicates: true,
  });
  console.log(`  -> ${TAGS.length} tags`);

  // ── Summary ──
  console.log("=".repeat(40));
  console.log("Summary:");
  console.log(`  Categories:    ${await prisma.category.count()}`);
  console.log(`  Subcategories: ${await prisma.subcategory.count()}`);
  console.log(`  Counties:      ${await prisma.county.count()}`);
  console.log(`  Tags:          ${await prisma.tag.count()}`);
  console.log("Done!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
