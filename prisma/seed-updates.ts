// ─── Job Updates Seed ───
// Official announcements from ministries, employers, shortlisting results, etc.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UPDATES = [
  {
    title: "Ministry of Education — 5,000 Teacher Recruitment for Junior Secondary Schools",
    body: "The Teachers Service Commission (TSC) has opened applications for 5,000 teaching positions in Junior Secondary Schools across all 47 counties. Deadline: 30 June 2026.",
    source: "Teachers Service Commission",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 0,
  },
  {
    title: "Kenya Revenue Authority — Shortlisting Results for Graduate Trainee Programme 2026",
    body: "KRA has published the shortlist for its Graduate Trainee Programme. Shortlisted candidates will receive email invitations for aptitude tests scheduled for May 2026.",
    source: "Kenya Revenue Authority",
    updateType: "SHORTLISTED",
    status: "PUBLISHED",
    daysAgo: 1,
  },
  {
    title: "Ministry of Health — 1,200 Nursing Positions Across County Hospitals",
    body: "The Ministry of Health, in partnership with county governments, is recruiting 1,200 registered nurses for deployment to level 4 and 5 hospitals countrywide.",
    source: "Ministry of Health",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 1,
  },
  {
    title: "National Police Service — Recruitment Exercise Closing in 3 Days",
    body: "The annual police constable recruitment exercise closes on 5 May 2026. Applicants must present original academic certificates at their nearest recruitment centre.",
    source: "National Police Service",
    updateType: "CLOSING_SOON",
    status: "PUBLISHED",
    daysAgo: 2,
  },
  {
    title: "Safaricom — 200 Internship Positions for STEM Students",
    body: "Safaricom's 2026 internship programme is now accepting applications from final-year university students pursuing degrees in Computer Science, Engineering, and Mathematics.",
    source: "Safaricom PLC",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 2,
  },
  {
    title: "County Government of Nairobi — Shortlisting for 300 County Jobs",
    body: "Nairobi City County has published the shortlist for various positions including engineers, accountants, health workers, and administrative staff. Interviews begin mid-May.",
    source: "Nairobi City County",
    updateType: "SHORTLISTED",
    status: "PUBLISHED",
    daysAgo: 3,
  },
  {
    title: "Mastercard Foundation — 500 Scholarships for Kenyan Youth 2026/2027",
    body: "The Mastercard Foundation Scholars Programme at the University of Nairobi is offering 500 full scholarships covering tuition, accommodation, and stipends for undergraduate and postgraduate studies.",
    source: "Mastercard Foundation",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 3,
  },
  {
    title: "Equity Bank — Graduate Management Trainee Programme Applications Open",
    body: "Equity Group is seeking fresh graduates for its 18-month rotational management trainee programme. Successful candidates will work across banking, fintech, and insurance divisions.",
    source: "Equity Group Holdings",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 4,
  },
  {
    title: "Ministry of ICT — Digital Literacy Programme 2026 Tenders",
    body: "The Ministry of ICT and Digital Economy has issued tenders for the Digital Literacy Programme targeting 500 public primary and secondary schools in 15 counties.",
    source: "Ministry of ICT",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 4,
  },
  {
    title: "Kenya Airways — Cabin Crew Recruitment — Deadline Extended",
    body: "Kenya Airways has extended the application deadline for cabin crew positions. New deadline is 15 May 2026. Minimum requirements: KCSE C+, fluent in English and Kiswahili.",
    source: "Kenya Airways",
    updateType: "CLOSING_SOON",
    status: "PUBLISHED",
    daysAgo: 5,
  },
  {
    title: "Google Africa — Developer Scholarship Programme 2026",
    body: "Google is offering 1,000 scholarships for African developers in Android, Web, and Cloud tracks. Kenyan developers can apply through the Google Africa Scholarship portal.",
    source: "Google Africa",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 5,
  },
  {
    title: "Public Service Commission — 200 Positions for Accountants and Auditors",
    body: "The Public Service Commission is recruiting 200 accountants (CPA K Section 4 minimum) and auditors for various government ministries and state corporations.",
    source: "Public Service Commission",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 6,
  },
  {
    title: "Deloitte East Africa — Shortlisting for Consulting Analyst Roles",
    body: "Deloitte has shortlisted candidates for its Consulting Analyst Programme. Assessment centres will be held in Nairobi on 10-12 May 2026.",
    source: "Deloitte East Africa",
    updateType: "SHORTLISTED",
    status: "PUBLISHED",
    daysAgo: 7,
  },
  {
    title: "Ministry of Roads — 500 Road Construction Worker Positions",
    body: "The Ministry of Transport and Infrastructure is recruiting 500 casual road construction workers for the ongoing rural roads programme across Rift Valley and Western Kenya regions.",
    source: "Ministry of Roads",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 8,
  },
  {
    title: "M-Pesa Foundation Academy — Teaching Fellowship Applications",
    body: "The M-Pesa Foundation Academy is accepting applications for its 2026 Teaching Fellowship. The 12-month programme covers leadership development and innovative teaching methodologies.",
    source: "M-Pesa Foundation",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 9,
  },
  {
    title: "County Government of Mombasa — Internship Programme 2026",
    body: "Mombasa County Government is offering 100 internship positions across health, engineering, ICT, and administration departments. Duration: 6 months with a monthly stipend.",
    source: "Mombasa County Government",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 10,
  },
  {
    title: "Microsoft ADC — Software Engineering Internship 2026",
    body: "Microsoft Africa Development Centre (Nairobi) is hiring software engineering interns for its cloud, AI, and security teams. Applicants should be in their final year of study.",
    source: "Microsoft Africa Development Centre",
    updateType: "POSTED",
    status: "PUBLISHED",
    daysAgo: 11,
  },
  {
    title: "TSC — Recruitment of 3,000 Primary School Teachers Closing Friday",
    body: "Applications for the 3,000 primary school teacher positions close this Friday. All applicants must have a P1 certificate and be registered with TSC.",
    source: "Teachers Service Commission",
    updateType: "CLOSING_SOON",
    status: "PUBLISHED",
    daysAgo: 12,
  },
];

async function main() {
  console.log("🌱 Seeding JobUpdates...\n");

  for (const update of UPDATES) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - update.daysAgo);

    await prisma.jobUpdate.upsert({
      where: { id: `${update.source.split(" ")[0].toLowerCase()}-${update.updateType.toLowerCase()}-${update.daysAgo}` },
      update: {
        title: update.title,
        body: update.body,
        source: update.source,
        updateType: update.updateType,
        status: update.status,
      },
      create: {
        id: `${update.source.split(" ")[0].toLowerCase()}-${update.updateType.toLowerCase()}-${update.daysAgo}`,
        title: update.title,
        body: update.body,
        source: update.source,
        updateType: update.updateType,
        status: update.status,
        createdAt,
      },
    });
    console.log(`  ✓ ${update.title.substring(0, 60)}...`);
  }

  const total = await prisma.jobUpdate.count();
  console.log(`\n✅ Seeded ${UPDATES.length} updates (${total} total in DB)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
