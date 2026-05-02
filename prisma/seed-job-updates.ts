import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates = [
  {
    slug: "tsc-shortlist-secondary-school-principals-2026",
    title: "TSC Shortlist for Secondary School Principals — 2026 Recruitment Cycle",
    body: "The Teachers Service Commission has released the shortlist for the 2026 recruitment of secondary school principals across all 47 counties. Shortlisted candidates are required to present original academic and professional certificates at their respective county TSC offices.",
    source: "Teachers Service Commission",
    updateType: "SHORTLISTED",
    pdfUrl: "/uploads/updates/tsc-principal-shortlist-2026.pdf",
    postedBy: "admin",
  },
  {
    slug: "psc-interview-schedule-q2-2026",
    title: "Public Service Commission — Interview Schedule for Q2 2026",
    body: "The Public Service Commission has published the interview schedule for Q2 2026. Candidates who applied for various positions in government ministries, state departments, and state corporations should check the schedule for their respective dates and venues.",
    source: "Public Service Commission",
    updateType: "INTERVIEW_SCHEDULE",
    postedBy: "admin",
  },
  {
    slug: "county-engineer-closing-may-10",
    title: "County Government of Nairobi — County Engineer Position Closing in 3 Days",
    body: "The County Government of Nairobi has announced 5 positions for County Engineers. Applications close on 10th May 2026. Interested candidates with a degree in Civil Engineering and at least 5 years of experience are encouraged to apply.",
    source: "County Government of Nairobi",
    updateType: "CLOSING_SOON",
    listingSlug: "county-engineer-nairobi-2026",
    postedBy: "admin",
  },
  {
    slug: "kenya-revenue-authority-graduate-trainee-shortlist",
    title: "Kenya Revenue Authority — Graduate Trainee Programme Shortlist Released",
    body: "KRA has released the shortlist of candidates selected for the 2026 Graduate Trainee Programme. Successful candidates will receive notification via email and SMS with details on the next steps including aptitude tests and interviews.",
    source: "Kenya Revenue Authority",
    updateType: "SHORTLISTED",
    pdfUrl: "/uploads/updates/kra-graduate-trainee-shortlist-2026.pdf",
    postedBy: "admin",
  },
  {
    slug: "ministry-of-health-nursing-positions-2026",
    title: "Ministry of Health — 1,200 Nursing Positions Across County Referral Hospitals",
    body: "The Ministry of Health has announced 1,200 nursing positions across county referral hospitals in partnership with county governments. This is part of the Universal Health Coverage programme aimed at improving healthcare delivery at the county level.",
    source: "Ministry of Health",
    updateType: "ANNOUNCEMENT",
    pdfUrl: "/uploads/updates/moh-nursing-vacancies-2026.pdf",
    postedBy: "admin",
  },
  {
    slug: "safaricom-graduate-management-trainee-2026",
    title: "Safaricom — Graduate Management Trainee Programme 2026 Applications Open",
    body: "Safaricom PLC has opened applications for its annual Graduate Management Trainee Programme. The 18-month rotational programme is open to recent graduates with a minimum of a second-class upper division from a recognized university.",
    source: "Safaricom PLC",
    updateType: "ANNOUNCEMENT",
    listingSlug: "safaricom-graduate-trainee-2026",
    postedBy: "employer",
  },
  {
    slug: "national-police-recruitment-deadline-extended",
    title: "National Police Service — Recruitment Exercise Deadline Extended to 15th May",
    body: "The National Police Service Commission has extended the deadline for the ongoing police constable recruitment exercise to 15th May 2026. The extension applies to all counties. Candidates who missed the initial deadline are encouraged to submit their applications through the NPS portal.",
    source: "National Police Service Commission",
    updateType: "CLOSING_SOON",
    postedBy: "admin",
  },
  {
    slug: "mastercard-foundation-scholarships-2026-2027",
    title: "Mastercard Foundation — 500 Scholarships for Kenyan Youth 2026/2027",
    body: "The Mastercard Foundation has announced 500 fully-funded scholarships for Kenyan youth for the 2026/2027 academic year. The scholarship covers tuition, accommodation, books, and a living stipend. Applications are open to students from economically disadvantaged backgrounds who demonstrate academic excellence and leadership potential.",
    source: "Mastercard Foundation",
    updateType: "ANNOUNCEMENT",
    postedBy: "admin",
  },
  {
    slug: "equity-bank-graduate-programme-shortlist",
    title: "Equity Bank — Graduate Management Trainee Programme Shortlist",
    body: "Equity Bank has released the shortlist of candidates who have been selected for the second round of the Graduate Management Trainee Programme assessment. Shortlisted candidates should report to the Equity Leadership Centre on their scheduled dates.",
    source: "Equity Bank",
    updateType: "SHORTLISTED",
    pdfUrl: "/uploads/updates/equity-gmt-shortlist-2026.pdf",
    postedBy: "employer",
  },
  {
    slug: "kenya-airways-cabin-crew-recruitment-2026",
    title: "Kenya Airways — Cabin Crew Recruitment 2026 Now Open",
    body: "Kenya Airways is recruiting cabin crew members for its expanding fleet. Minimum requirements include a KCSE mean grade of C+, fluency in English and Kiswahili, and ability to swim 50 metres unaided. Training will be conducted at the KQ Aviation College.",
    source: "Kenya Airways",
    updateType: "ANNOUNCEMENT",
    listingSlug: "kenya-airways-cabin-crew-2026",
    postedBy: "employer",
  },
  {
    slug: "google-africa-developer-scholarship-2026",
    title: "Google Africa — Developer Scholarship Programme 2026 Now Accepting Applications",
    body: "Google Africa has opened applications for the 2026 Developer Scholarship Programme. The programme offers training in Android development, cloud computing, and machine learning. Selected participants will receive free access to Google career certificates and mentorship from Google engineers.",
    source: "Google Africa",
    updateType: "ANNOUNCEMENT",
    postedBy: "admin",
  },
  {
    slug: "psc-accountants-auditors-deadline-passed",
    title: "Public Service Commission — 200 Accountant & Auditor Positions — Deadline Passed",
    body: "The application window for 200 positions of Accountants and Auditors in various government ministries and state departments closed on 30th April 2026. Candidates who applied will be notified about the shortlisting status via the PSC recruitment portal.",
    source: "Public Service Commission",
    updateType: "DEADLINE_PASSED",
    postedBy: "admin",
  },
];

async function main() {
  console.log("Seeding JobUpdates...");

  for (const u of updates) {
    await prisma.jobUpdate.upsert({
      where: { slug: u.slug },
      update: u,
      create: u,
    });
  }

  const count = await prisma.jobUpdate.count();
  console.log(`Done! Total updates: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
