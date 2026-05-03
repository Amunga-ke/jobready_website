// ─── JobReady Content Seed ───
// Populates: Companies, Listings (Jobs, Government, Casual, Opportunities)
// Dependencies: Run seed-lookup.ts first (categories, subcategories, counties, tags)
// Usage: DATABASE_URL="mysql://..." npx tsx prisma/seed-content.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ─── Helper ───
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function deadlineDaysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ══════════════════════════════════════════════════════════════
// 1. COMPANIES
// ══════════════════════════════════════════════════════════════

const COMPANIES = [
  { name: "Safaricom PLC", orgType: "PRIVATE", industry: "Telecommunications", verified: true, county: "Nairobi", description: "East Africa's leading telecommunications provider serving 30M+ customers with mobile, data, and financial services." },
  { name: "Equity Bank Kenya", orgType: "PRIVATE", industry: "Banking & Financial Services", verified: true, county: "Nairobi", description: "One of Kenya's largest banks with operations across East Africa, focused on financial inclusion." },
  { name: "KCB Group", orgType: "PRIVATE", industry: "Banking & Financial Services", verified: true, county: "Nairobi", description: "Kenya's largest commercial bank by assets, serving individuals, businesses, and institutions." },
  { name: "NCBA Group", orgType: "PRIVATE", industry: "Banking & Financial Services", verified: true, county: "Nairobi", description: "Created from the merger of NIC Group and CBA, offering retail and corporate banking." },
  { name: "Co-operative Bank", orgType: "PRIVATE", industry: "Banking & Financial Services", verified: true, county: "Nairobi", description: "A leading Kenyan bank with a strong cooperative movement heritage." },
  { name: "Kenya Revenue Authority", orgType: "STATE_CORPORATION", industry: "Government & Public Administration", verified: true, county: "Nairobi", description: "The principal revenue collection agency for the Government of Kenya." },
  { name: "Teachers Service Commission", orgType: "STATE_CORPORATION", industry: "Government & Public Administration", verified: true, county: "Nairobi", description: "Constitutional commission responsible for managing the teaching service in Kenya." },
  { name: "National Police Service", orgType: "STATE_CORPORATION", industry: "Government & Public Administration", verified: true, county: "Nairobi", description: "Kenya's national police force responsible for law enforcement and public safety." },
  { name: "County Government of Nairobi", orgType: "STATE_CORPORATION", industry: "Government & Public Administration", verified: true, county: "Nairobi", description: "The administrative government of Nairobi City County." },
  { name: "County Government of Nakuru", orgType: "STATE_CORPORATION", industry: "Government & Public Administration", verified: true, county: "Nakuru", description: "The administrative government of Nakuru County." },
  { name: "County Government of Mombasa", orgType: "STATE_CORPORATION", industry: "Government & Public Administration", verified: true, county: "Mombasa", description: "The administrative government of Mombasa County." },
  { name: "County Government of Kisumu", orgType: "STATE_CORPORATION", industry: "Government & Public Administration", verified: true, county: "Kisumu", description: "The administrative government of Kisumu County." },
  { name: "East African Breweries Limited", orgType: "PRIVATE", industry: "Food & Beverage Production", verified: true, county: "Nairobi", description: "Leading brewer in East Africa, producing iconic brands like Tusker and WhiteCap." },
  { name: "Kenya Airways", orgType: "STATE_CORPORATION", industry: "Aviation & Aerospace", verified: true, county: "Nairobi", description: "Kenya's national carrier, operating domestic and international flights." },
  { name: "University of Nairobi", orgType: "EDUCATION", industry: "Education & Training", verified: true, county: "Nairobi", description: "Kenya's oldest and largest public university." },
  { name: "Kenyatta University", orgType: "EDUCATION", industry: "Education & Training", verified: true, county: "Kiambu", description: "A leading public university located in Kiambu County." },
  { name: "Google Africa", orgType: "INTERNATIONAL_ORG", industry: "Information Technology & Software", verified: true, county: "Nairobi", description: "Google's operations in Africa, headquartered in Nairobi with a developer hub." },
  { name: "Microsoft East Africa", orgType: "INTERNATIONAL_ORG", industry: "Information Technology & Software", verified: true, county: "Nairobi", description: "Microsoft's East Africa regional office driving cloud and AI adoption." },
  { name: "Mastercard Foundation", orgType: "FOUNDATION", industry: "Non-Profit & Social Impact", verified: true, county: "Nairobi", description: "One of the largest foundations globally, focused on education and financial inclusion in Africa." },
  { name: "KCB Foundation", orgType: "FOUNDATION", industry: "Non-Profit & Social Impact", verified: true, county: "Nairobi", description: "The corporate social responsibility arm of KCB Group." },
  { name: "Kenya Electricity Generating Company", orgType: "STATE_CORPORATION", industry: "Energy, Power & Utilities", verified: true, county: "Nairobi", description: "KenGen is the leading electric power generation company in Kenya." },
  { name: "Kenya National Highways Authority", orgType: "STATE_CORPORATION", industry: "Construction & Civil Engineering", verified: true, county: "Nairobi", description: "Responsible for the management, development, rehabilitation, and maintenance of national trunk roads." },
  { name: "Kenya Medical Research Institute", orgType: "STATE_CORPORATION", industry: "Healthcare & Medical Services", verified: true, county: "Nairobi", description: "Kenya's premier health research institution." },
  { name: "Deloitte East Africa", orgType: "PRIVATE", industry: "Consulting & Professional Services", verified: true, county: "Nairobi", description: "One of the Big Four professional services firms, providing audit, tax, and consulting." },
  { name: "PwC Kenya", orgType: "PRIVATE", industry: "Consulting & Professional Services", verified: true, county: "Nairobi", description: "PricewaterhouseCoopers Kenya providing professional services across industries." },
  { name: "Airtel Kenya", orgType: "PRIVATE", industry: "Telecommunications", verified: true, county: "Nairobi", description: "A major mobile network operator in Kenya offering voice, data, and mobile money services." },
  { name: "Twiga Foods", orgType: "STARTUP", industry: "Agriculture, Forestry & Fishing", verified: true, county: "Nairobi", description: "Kenya's leading agricultural supply chain platform connecting farmers to vendors." },
  { name: "Cellulant", orgType: "STARTUP", industry: "Financial Technology (FinTech)", verified: true, county: "Nairobi", description: "A Pan-African fintech company providing digital payment solutions." },
  { name: "M-Pesa Foundation", orgType: "FOUNDATION", industry: "Non-Profit & Social Impact", verified: true, county: "Nairobi", description: "Safaricom's charitable foundation focused on education, health, and environmental conservation." },
  { name: "Bharti Airtel Money", orgType: "PRIVATE", industry: "Financial Technology (FinTech)", verified: false, county: "Nairobi", description: "Mobile financial services platform under Airtel Kenya." },
  { name: "Africa Logistics", orgType: "SMALL_BUSINESS", industry: "Logistics, Transport & Supply Chain", verified: false, county: "Nairobi", description: "A growing logistics company serving the Kenyan market with last-mile delivery." },
  { name: "Lake Flower Farms", orgType: "PRIVATE", industry: "Agriculture, Forestry & Fishing", verified: false, county: "Nakuru", description: "Flower farm operations in Naivasha, exporting cut flowers to European markets." },
  { name: "Hub Supermarkets", orgType: "SMALL_BUSINESS", industry: "Retail & E-Commerce", verified: false, county: "Nairobi", description: "A chain of supermarkets serving residential neighborhoods in Nairobi." },
];

// ══════════════════════════════════════════════════════════════
// 2. LISTINGS
// ══════════════════════════════════════════════════════════════

interface ListingDef {
  title: string;
  companySlug: string;
  categorySlug: string;
  subcategorySlug?: string;
  listingType: "JOB" | "GOVERNMENT" | "CASUAL" | "OPPORTUNITY";
  governmentLevel?: "NATIONAL" | "COUNTY" | "STATE_CORPORATION";
  opportunityType?: string;
  employmentType: string;
  experienceLevel: string;
  workMode: string;
  town: string;
  county: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  description: string;
  requirements?: string;
  instructions?: string;
  deadlineDaysFromNow?: number;
  featured: boolean;
  tags: string[];
  daysAgo: number;
  applicationUrl?: string;
  applyEmail?: string;
}

const LISTINGS: ListingDef[] = [
  // ═══ FEATURED JOBS ═══
  {
    title: "Senior Product Manager — M-Pesa",
    companySlug: "safaricom-plc",
    categorySlug: "technology",
    subcategorySlug: "technical-project-management",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    workMode: "HYBRID",
    town: "Nairobi, Westlands",
    county: "Nairobi",
    salaryMin: 350000, salaryMax: 550000, salaryPeriod: "month",
    description: "<p>Lead product strategy for M-Pesa, serving 30M+ active users across East Africa. You will own the product roadmap, work closely with a cross-functional team of 12+ engineers and designers, and drive key initiatives in financial inclusion, lending, and merchant payments.</p><ul><li>Define and execute the M-Pesa product vision and roadmap</li><li>Analyze market trends, user behavior, and competitive landscape</li><li>Collaborate with engineering, design, and business teams</li><li>Drive A/B testing and data-informed product decisions</li><li>Present product strategy to C-suite stakeholders</li></ul>",
    requirements: "<ul><li>7+ years in product management, ideally in fintech or mobile payments</li><li>Experience leading products with 1M+ active users</li><li>Strong analytical skills and data-driven decision making</li><li>Excellent communication and stakeholder management</li><li>Degree in Business, Computer Science, or related field</li></ul>",
    instructions: "<p>Submit your CV and a brief product case study (max 3 pages) to <strong>careers@safaricom.co.ke</strong> with subject line <strong>SPM-MPesa-2025</strong>.</p>",
    deadlineDaysFromNow: 45,
    featured: true,
    tags: ["Product Management", "Fintech", "Senior", "Featured"],
    daysAgo: 1,
  },
  {
    title: "Financial Analyst — Strategic Planning",
    companySlug: "equity-bank-kenya",
    categorySlug: "finance-accounting",
    subcategorySlug: "financial-analysis",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Nairobi, Upper Hill",
    county: "Nairobi",
    salaryMin: 120000, salaryMax: 180000, salaryPeriod: "month",
    description: "<p>Join Equity Bank's Strategic Planning division as a Financial Analyst. You will support investment decisions, financial modeling, and reporting across the bank's East Africa operations spanning 6 countries and 40+ million customers.</p><ul><li>Build and maintain financial models for business planning</li><li>Prepare management reports and board presentations</li><li>Conduct market research and competitive analysis</li><li>Support budget forecasting and variance analysis</li><li>Monitor KPIs and prepare quarterly performance dashboards</li></ul>",
    requirements: "<ul><li>Bachelor's degree in Finance, Accounting, or related field</li><li>CPA or CFA qualification preferred</li><li>3+ years in financial analysis or corporate finance</li><li>Advanced Excel and financial modeling skills</li><li>Experience with ERP systems (SAP/Oracle) is a plus</li></ul>",
    featured: true,
    tags: ["Finance", "Banking", "Featured"],
    daysAgo: 3,
  },
  {
    title: "Software Engineer — Digital Banking Platform",
    companySlug: "kcb-group",
    categorySlug: "technology",
    subcategorySlug: "software-engineering",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "REMOTE",
    town: "Remote",
    county: "Nairobi",
    salaryMin: 200000, salaryMax: 350000, salaryPeriod: "month",
    description: "<p>Build the next generation of KCB's digital banking platform. Work with modern microservices architecture, cloud infrastructure, and agile delivery teams serving 15+ million customers.</p><ul><li>Design and develop RESTful APIs and microservices using Java and Spring Boot</li><li>Implement secure payment processing solutions</li><li>Write unit and integration tests with 80%+ coverage</li><li>Participate in code reviews and technical design discussions</li><li>Mentor junior developers</li></ul>",
    requirements: "<ul><li>4+ years of software development experience</li><li>Proficiency in Java, Python, or Node.js</li><li>Experience with cloud platforms (AWS/Azure)</li><li>Knowledge of microservices and containerization (Docker/K8s)</li><li>Understanding of banking or fintech domain is a plus</li></ul>",
    applicationUrl: "https://kcbgroup.com/careers",
    featured: true,
    tags: ["Backend", "Cloud", "Fintech", "Featured", "Technology"],
    daysAgo: 5,
  },
  {
    title: "Graduate Trainee — 12 Month Rotational Program",
    companySlug: "ncba-group",
    categorySlug: "finance-accounting",
    subcategorySlug: "financial-analysis",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi, CBD",
    county: "Nairobi",
    description: "<p>NCBA Group's 12-month Graduate Trainee Program offers recent graduates hands-on experience in banking operations, digital innovation, and leadership development. Successful candidates rotate across multiple departments including Retail Banking, Corporate Banking, Risk, and Operations.</p><ul><li>Rotate through Retail Banking, Corporate Banking, and Operations</li><li>Participate in leadership and professional development workshops</li><li>Contribute to digital transformation projects</li><li>Receive mentorship from senior executives</li><li>Present a capstone project to the executive team</li></ul>",
    requirements: "<ul><li>Bachelor's degree (minimum Second Class Upper)</li><li>Graduated in 2024 or 2025</li><li>Strong analytical and communication skills</li><li>Passionate about the financial services industry</li><li>No prior work experience required</li></ul>",
    deadlineDaysFromNow: 50,
    featured: true,
    tags: ["Graduate", "Banking", "Entry Level", "Featured"],
    daysAgo: 2,
  },

  // ═══ REGULAR JOBS ═══
  {
    title: "Backend Developer — Payment APIs",
    companySlug: "cellulant",
    categorySlug: "technology",
    subcategorySlug: "software-engineering",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "HYBRID",
    town: "Nairobi, Kilimani",
    county: "Nairobi",
    salaryMin: 180000, salaryMax: 300000, salaryPeriod: "month",
    description: "<p>Join Cellulant's engineering team to build and scale payment APIs serving 15+ African countries. Work with Node.js, Java, and cloud-native technologies to power digital payments across the continent.</p><ul><li>Build and maintain scalable payment gateway APIs</li><li>Integrate with mobile money providers (M-Pesa, Airtel Money)</li><li>Implement PCI-DSS compliant security measures</li><li>Optimize database queries for high-throughput transactions</li></ul>",
    requirements: "<ul><li>3+ years backend development experience</li><li>Proficiency in Node.js or Java</li><li>Experience with payment systems (Visa, Mastercard, M-Pesa APIs)</li><li>Understanding of PCI-DSS compliance</li></ul>",
    featured: false,
    tags: ["Backend", "Fintech", "Technology", "Mobile"],
    daysAgo: 0,
  },
  {
    title: "Digital Marketing Executive",
    companySlug: "airtel-kenya",
    categorySlug: "marketing-communications",
    subcategorySlug: "digital-marketing",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "HYBRID",
    town: "Nairobi, Enterprise Road",
    county: "Nairobi",
    salaryMin: 100000, salaryMax: 160000, salaryPeriod: "month",
    description: "<p>Drive digital marketing campaigns for Airtel Kenya, managing multi-channel campaigns across social media, search, and programmatic advertising to grow the subscriber base and drive brand awareness.</p><ul><li>Plan and execute digital marketing campaigns across channels</li><li>Manage social media accounts and content calendar</li><li>Analyze campaign performance and optimize ROI</li><li>Coordinate with creative agencies for campaign assets</li></ul>",
    requirements: "<ul><li>3+ years in digital marketing</li><li>Experience with Google Ads, Meta Ads, and analytics tools</li><li>Strong copywriting skills</li><li>Bachelor's degree in Marketing or related field</li></ul>",
    featured: false,
    tags: ["Marketing", "Technology", "Telecommunications"],
    daysAgo: 2,
  },
  {
    title: "Marketing Manager — Supply Chain",
    companySlug: "twiga-foods",
    categorySlug: "marketing-communications",
    subcategorySlug: "brand-management",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Nairobi, Industrial Area",
    county: "Nairobi",
    salaryMin: 150000, salaryMax: 220000, salaryPeriod: "month",
    description: "<p>Lead marketing strategy for Twiga Foods, Kenya's leading agricultural supply chain platform connecting 14,000+ farmers to 8,000+ vendors across the country.</p>",
    requirements: "<ul><li>5+ years in marketing, ideally in agribusiness or FMCG</li><li>B2B and B2C marketing experience</li><li>Degree in Marketing or Business</li></ul>",
    featured: false,
    tags: ["Marketing", "Management", "Agriculture"],
    daysAgo: 4,
  },
  {
    title: "Junior Accountant",
    companySlug: "co-operative-bank",
    categorySlug: "finance-accounting",
    subcategorySlug: "accounting",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi, CBD",
    county: "Nairobi",
    salaryMin: 60000, salaryMax: 90000, salaryPeriod: "month",
    description: "<p>Entry-level accounting position at Co-operative Bank. Handle day-to-day bookkeeping, reconciliation, financial reporting, and support the senior finance team with month-end close processes.</p>",
    requirements: "<ul><li>Bachelor's degree in Accounting or Finance</li><li>CPA Part II or equivalent</li><li>Proficiency in Excel and accounting software</li></ul>",
    deadlineDaysFromNow: 75,
    featured: false,
    tags: ["Entry Level", "Banking", "Accounting"],
    daysAgo: 3,
  },
  {
    title: "Customer Service Representative",
    companySlug: "safaricom-plc",
    categorySlug: "human-resources",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi, Westlands",
    county: "Nairobi",
    salaryMin: 40000, salaryMax: 60000, salaryPeriod: "month",
    description: "<p>Handle customer inquiries via phone, chat, and email. Resolve issues related to M-Pesa, data, and voice services for Safaricom's 30M+ subscriber base.</p>",
    requirements: "<ul><li>Diploma or degree in any field</li><li>Excellent communication skills</li><li>Problem-solving ability</li><li>Prior customer service experience is a plus</li></ul>",
    featured: false,
    tags: ["Customer Service", "Entry Level", "Technology"],
    daysAgo: 1,
  },
  {
    title: "Nurse — Medical Ward",
    companySlug: "county-government-of-kisumu",
    categorySlug: "healthcare-medical",
    subcategorySlug: "nursing",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Kisumu",
    county: "Kisumu",
    salaryMin: 50000, salaryMax: 75000, salaryPeriod: "month",
    description: "<p>Jomo Kenyatta Teaching and Referral Hospital is seeking registered nurses for its medical, surgical, and pediatric wards. Join a team of 200+ healthcare professionals serving the Lake Victoria region.</p>",
    requirements: "<ul><li>KRCHN or BSc Nursing</li><li>Valid Nursing Council of Kenya license</li><li>2+ years clinical experience</li></ul>",
    deadlineDaysFromNow: 60,
    featured: false,
    tags: ["Healthcare", "Government"],
    daysAgo: 5,
  },
  {
    title: "Civil Engineer — Highway Construction",
    companySlug: "kenya-national-highways-authority",
    categorySlug: "engineering",
    subcategorySlug: "civil-engineering",
    listingType: "JOB",
    employmentType: "Contract",
    experienceLevel: "Senior",
    workMode: "ONSITE",
    town: "Mombasa",
    county: "Mombasa",
    salaryMin: 180000, salaryMax: 300000, salaryPeriod: "month",
    description: "<p>Lead the civil engineering team for the Mombasa-Nairobi highway expansion project, a multi-billion shilling infrastructure initiative to dual the 484km carriageway.</p>",
    requirements: "<ul><li>BSc in Civil Engineering (Minimum Upper Second)</li><li>Registered with Engineers Board of Kenya</li><li>10+ years experience in highway construction</li><li>Project management certification (PMP preferred)</li></ul>",
    deadlineDaysFromNow: 40,
    featured: false,
    tags: ["Construction", "Senior", "Government"],
    daysAgo: 7,
  },
  {
    title: "Data Analyst — Revenue Intelligence",
    companySlug: "kenya-revenue-authority",
    categorySlug: "technology",
    subcategorySlug: "data-science",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Nairobi, Times Tower",
    county: "Nairobi",
    salaryMin: 100000, salaryMax: 160000, salaryPeriod: "month",
    description: "<p>KRA is seeking a Data Analyst to support revenue intelligence and compliance analytics. You will work with large datasets to identify tax compliance patterns and support policy decisions affecting KSh 2 trillion+ annual revenue collection.</p>",
    requirements: "<ul><li>Degree in Statistics, Mathematics, Data Science, or related field</li><li>3+ years in data analysis</li><li>Proficiency in Python/R and SQL</li><li>Experience with BI tools (Power BI/Tableau)</li></ul>",
    featured: false,
    tags: ["Data Science", "Government", "Technology"],
    daysAgo: 6,
  },
  {
    title: "HR Manager — Nairobi Region",
    companySlug: "equity-bank-kenya",
    categorySlug: "human-resources",
    subcategorySlug: "hr-generalist",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    workMode: "ONSITE",
    town: "Nairobi",
    county: "Nairobi",
    salaryMin: 200000, salaryMax: 320000, salaryPeriod: "month",
    description: "<p>Lead the HR function for Equity Bank's Nairobi region, managing talent acquisition, employee relations, performance management, and organizational development for 500+ staff across 15 branches.</p>",
    requirements: "<ul><li>8+ years in HR management</li><li>CHRP certification preferred</li><li>Experience in banking or financial services HR</li><li>Strong labor law knowledge</li></ul>",
    deadlineDaysFromNow: 30,
    featured: false,
    tags: ["HR", "Management", "Senior", "Banking"],
    daysAgo: 8,
  },
  {
    title: "Audit Associate — External Audit",
    companySlug: "deloitte-east-africa",
    categorySlug: "finance-accounting",
    subcategorySlug: "audit",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi, Riverside",
    county: "Nairobi",
    salaryMin: 80000, salaryMax: 120000, salaryPeriod: "month",
    description: "<p>Join Deloitte's External Audit practice and work with a diverse portfolio of clients across banking, manufacturing, and technology sectors. Gain exposure to IFRS reporting, risk assessment, and internal controls evaluation.</p>",
    requirements: "<ul><li>Bachelor's degree in Accounting, Finance, or related field</li><li>CPA Section 4 and above</li><li>Strong analytical and communication skills</li><li>Proficiency in MS Excel and audit software</li></ul>",
    featured: false,
    tags: ["Audit", "Consulting", "Entry Level"],
    daysAgo: 1,
  },
  {
    title: "DevOps Engineer — Cloud Infrastructure",
    companySlug: "microsoft-east-africa",
    categorySlug: "technology",
    subcategorySlug: "devops-cloud",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "REMOTE",
    town: "Remote",
    county: "Nairobi",
    salaryMin: 250000, salaryMax: 400000, salaryPeriod: "month",
    description: "<p>Manage and optimize cloud infrastructure for Microsoft's East Africa operations and partner ecosystem. Work with Azure, Kubernetes, and Terraform to ensure 99.99% uptime for mission-critical services.</p>",
    requirements: "<ul><li>5+ years in DevOps or SRE roles</li><li>Expert in Azure, Kubernetes, Docker, and Terraform</li><li>Experience with CI/CD pipelines (GitHub Actions, Azure DevOps)</li><li>Strong scripting skills (PowerShell, Bash, Python)</li></ul>",
    featured: true,
    tags: ["DevOps", "Cloud", "Technology", "Featured", "Remote"],
    daysAgo: 0,
  },

  // ═══ GOVERNMENT JOBS ═══
  {
    title: "KRA Graduate Trainee Program 2025",
    companySlug: "kenya-revenue-authority",
    categorySlug: "government-public-sector",
    subcategorySlug: "public-administration",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nationwide",
    county: "Nairobi",
    description: "<p>The Kenya Revenue Authority invites applications from qualified graduates for its 2025 Graduate Trainee Program. The program runs for 18 months and offers rotations across Customs, Domestic Taxes, and IT departments. Participants receive a monthly stipend and comprehensive training.</p><ul><li>Rotate through multiple KRA departments</li><li>Receive comprehensive training on tax administration</li><li>Work on real revenue collection projects</li><li>Get mentorship from senior officers</li></ul>",
    requirements: "<ul><li>Bachelor's degree (minimum Second Class Upper)</li><li>Graduated between 2023 and 2025</li><li>Must be a Kenyan citizen aged 35 and below</li><li>No criminal record</li></ul>",
    instructions: "<p>Apply online through the <strong>KRA recruitment portal</strong>. Attach certified copies of academic certificates, national ID, and a detailed CV.</p>",
    deadlineDaysFromNow: 60,
    featured: true,
    tags: ["Government", "Graduate", "National", "Featured"],
    daysAgo: 20,
  },
  {
    title: "TSC — 5,000 Teacher Recruitment 2025",
    companySlug: "teachers-service-commission",
    categorySlug: "government-public-sector",
    subcategorySlug: "civil-service",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nationwide",
    county: "Nairobi",
    description: "<p>The Teachers Service Commission has advertised 5,000 teaching positions for secondary schools across all 47 counties. Positions are available for various subject combinations including Sciences, Mathematics, Languages, and Humanities.</p>",
    requirements: "<ul><li>Bachelor of Education degree</li><li>TSC registration certificate</li><li>Diploma or degree in relevant subject combination</li><li>Must be a Kenyan citizen</li></ul>",
    deadlineDaysFromNow: 75,
    featured: false,
    tags: ["Government", "Education", "National"],
    daysAgo: 14,
  },
  {
    title: "Kenya Police Constable Recruitment 2025",
    companySlug: "national-police-service",
    categorySlug: "government-public-sector",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nationwide",
    county: "Nairobi",
    description: "<p>The National Police Service is recruiting 10,000 police constables across all 47 counties. Successful candidates will undergo 9 months of training at Kiganjo Police Training College. The recruitment exercise will be conducted at county level.</p>",
    requirements: "<ul><li>Kenyan citizen aged 18-28 years</li><li>Minimum KCSE mean grade D+ (plain)</li><li>Must be physically fit</li><li>No criminal record</li></ul>",
    deadlineDaysFromNow: 90,
    featured: false,
    tags: ["Government", "National"],
    daysAgo: 25,
  },
  {
    title: "Nakuru County — Various Positions 2025",
    companySlug: "county-government-of-nakuru",
    categorySlug: "government-public-sector",
    subcategorySlug: "public-administration",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Nakuru",
    county: "Nakuru",
    description: "<p>The County Government of Nakuru is recruiting for multiple positions across Health, Public Works, and Administration departments. Opportunities available for both degree and diploma holders.</p>",
    requirements: "<ul><li>Relevant diploma or degree</li><li>Must be a resident of Nakuru County (where applicable)</li><li>Valid professional certifications</li></ul>",
    deadlineDaysFromNow: 40,
    featured: false,
    tags: ["Government", "County"],
    daysAgo: 10,
  },
  {
    title: "Nairobi County — Clinical Officers & Nurses",
    companySlug: "county-government-of-nairobi",
    categorySlug: "healthcare-medical",
    subcategorySlug: "nursing",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Nairobi",
    county: "Nairobi",
    salaryMin: 60000, salaryMax: 90000, salaryPeriod: "month",
    description: "<p>Nairobi County is recruiting clinical officers, nurses, and public health officers for county health facilities including Mbagathi Hospital and 50+ dispensaries.</p>",
    requirements: "<ul><li>Diploma or degree in relevant health discipline</li><li>Valid license from relevant professional body</li><li>2+ years experience in a clinical setting</li></ul>",
    deadlineDaysFromNow: 35,
    featured: false,
    tags: ["Government", "Healthcare", "County"],
    daysAgo: 12,
  },
  {
    title: "Mombasa County — Engineers & Planners",
    companySlug: "county-government-of-mombasa",
    categorySlug: "engineering",
    subcategorySlug: "civil-engineering",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Mombasa",
    county: "Mombasa",
    salaryMin: 80000, salaryMax: 140000, salaryPeriod: "month",
    description: "<p>Mombasa County is seeking Civil and Structural Engineers for infrastructure development projects including roads, drainage, and public buildings as part of the county's 5-year development plan.</p>",
    requirements: "<ul><li>BSc in Civil/Structural Engineering</li><li>Registered with Engineers Board of Kenya</li><li>5+ years experience in construction projects</li></ul>",
    deadlineDaysFromNow: 45,
    featured: false,
    tags: ["Government", "Construction", "County"],
    daysAgo: 8,
  },

  // ═══ CASUAL & PART-TIME ═══
  {
    title: "Waitstaff — Westlands Restaurants",
    companySlug: "hub-supermarkets",
    categorySlug: "human-resources",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Westlands, Nairobi",
    county: "Nairobi",
    salaryMin: 500, salaryMax: 800, salaryPeriod: "day",
    description: "<p>Immediate openings for waitstaff at multiple restaurants in Westlands. No experience needed — training provided. Flexible hours available including evening and weekend shifts.</p>",
    featured: false,
    tags: ["Immediate Start", "No Experience Required"],
    daysAgo: 1,
  },
  {
    title: "Delivery Rider — CBD & Surrounding Areas",
    companySlug: "africa-logistics",
    categorySlug: "human-resources",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "CBD, Nairobi",
    county: "Nairobi",
    salaryMin: 1000, salaryMax: 2000, salaryPeriod: "day",
    description: "<p>Looking for motorcycle delivery riders for CBD and surrounding areas. Must own a motorcycle (Boda Boda) with valid license and insurance. Daily earnings potential of KSh 1,000-2,000.</p>",
    featured: false,
    tags: ["Immediate Start", "Logistics"],
    daysAgo: 2,
  },
  {
    title: "Farm Worker — Naivasha Flower Farms",
    companySlug: "lake-flower-farms",
    categorySlug: "human-resources",
    listingType: "CASUAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Naivasha",
    county: "Nakuru",
    salaryMin: 700, salaryMax: 700, salaryPeriod: "day",
    description: "<p>Farm workers needed for flower farm operations in Naivasha. Duties include planting, harvesting, grading, and packing roses for export. Accommodation and meals provided during work hours.</p>",
    featured: false,
    tags: ["Agriculture", "Immediate Start"],
    daysAgo: 4,
  },
  {
    title: "Shop Assistant — Thika Road Mall",
    companySlug: "hub-supermarkets",
    categorySlug: "human-resources",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Thika Road, Nairobi",
    county: "Nairobi",
    salaryMin: 15000, salaryMax: 15000, salaryPeriod: "month",
    description: "<p>Part-time shop assistant needed for a retail outlet along Thika Road. Morning or afternoon shifts available. Responsibilities include stocking shelves, customer assistance, and cash handling.</p>",
    featured: false,
    tags: ["Retail", "No Experience Required"],
    daysAgo: 3,
  },
  {
    title: "Event Ushers & Hosts — Conference Season",
    companySlug: "africa-logistics",
    categorySlug: "human-resources",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi, Various Venues",
    county: "Nairobi",
    salaryMin: 2000, salaryMax: 3000, salaryPeriod: "day",
    description: "<p>Looking for presentable ushers and hosts for the conference season at KICC, Sarit Center, and other Nairobi venues. Must be well-spoken and professional. Weekly events from May to July.</p>",
    featured: false,
    tags: ["Immediate Start", "Hospitality"],
    daysAgo: 0,
  },
  {
    title: "Loader — Industrial Area Warehouse",
    companySlug: "africa-logistics",
    categorySlug: "human-resources",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Industrial Area, Nairobi",
    county: "Nairobi",
    salaryMin: 800, salaryMax: 1200, salaryPeriod: "day",
    description: "<p>Morning shift loaders needed for a busy warehouse in Industrial Area. Must be physically fit. Duties include loading and offloading cargo trucks, inventory organization, and packaging.</p>",
    featured: false,
    tags: ["Logistics", "Immediate Start"],
    daysAgo: 0,
  },

  // ═══ OPPORTUNITIES — INTERNSHIPS ═══
  {
    title: "Finance Intern — Equity Bank (3 Months)",
    companySlug: "equity-bank-kenya",
    categorySlug: "finance-accounting",
    subcategorySlug: "financial-analysis",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi, Upper Hill",
    county: "Nairobi",
    salaryMin: 15000, salaryMax: 25000, salaryPeriod: "month",
    description: "<p>3-month internship in Equity Bank's Finance department. Gain hands-on experience in financial analysis, reporting, and planning. You will be mentored by senior analysts and work on real projects.</p>",
    deadlineDaysFromNow: 60,
    featured: false,
    tags: ["Internship", "Finance", "Banking"],
    daysAgo: 5,
  },
  {
    title: "Software Engineering Intern — Safaricom Innovation Lab",
    companySlug: "safaricom-plc",
    categorySlug: "technology",
    subcategorySlug: "software-engineering",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "HYBRID",
    town: "Nairobi, Westlands",
    county: "Nairobi",
    salaryMin: 20000, salaryMax: 30000, salaryPeriod: "month",
    description: "<p>6-month software engineering internship at Safaricom's Innovation Lab. Work on cutting-edge projects in mobile, cloud, and AI. Access to mentorship from senior engineers and free developer resources.</p>",
    deadlineDaysFromNow: 55,
    featured: false,
    tags: ["Internship", "Technology", "Mobile"],
    daysAgo: 8,
  },
  {
    title: "Data Science Intern — Google Africa",
    companySlug: "google-africa",
    categorySlug: "technology",
    subcategorySlug: "data-science",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "REMOTE",
    town: "Remote",
    county: "Nairobi",
    description: "<p>Google is offering a Data Science internship as part of the Africa Developer Program. Work with Google research teams on ML projects with African impact, including natural language processing for African languages.</p>",
    deadlineDaysFromNow: 120,
    featured: true,
    tags: ["Internship", "Data Science", "Remote", "Featured"],
    daysAgo: 2,
  },
  {
    title: "Marketing Intern — EABL Brand Team",
    companySlug: "east-african-breweries-limited",
    categorySlug: "marketing-communications",
    subcategorySlug: "brand-management",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi, Ruaraka",
    county: "Nairobi",
    description: "<p>Join EABL's marketing team for a 3-month internship. Work on brand campaigns, digital marketing, and consumer engagement for iconic brands like Tusker, WhiteCap, and Senator.</p>",
    deadlineDaysFromNow: 70,
    featured: false,
    tags: ["Internship", "Marketing", "Manufacturing"],
    daysAgo: 6,
  },

  // ═══ OPPORTUNITIES — SCHOLARSHIPS ═══
  {
    title: "Mastercard Foundation Scholars — University of Nairobi",
    companySlug: "mastercard-foundation",
    categorySlug: "education-training",
    subcategorySlug: "higher-education",
    listingType: "OPPORTUNITY",
    opportunityType: "SCHOLARSHIP",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi",
    county: "Nairobi",
    description: "<p>Full scholarship for undergraduate studies at the University of Nairobi. Covers tuition, accommodation, books, and a living stipend. Open to academically talented yet economically disadvantaged students from Kenya. The scholarship is worth KSh 4M+ over 4 years.</p>",
    requirements: "<ul><li>Strong academic record (mean grade A- or above in KCSE)</li><li>Demonstrated financial need</li><li>Leadership potential and community involvement</li><li>Applying for an undergraduate degree at UoN</li></ul>",
    deadlineDaysFromNow: 60,
    featured: true,
    tags: ["Scholarship", "Education", "Featured"],
    daysAgo: 10,
  },
  {
    title: "KCB Foundation Scholarship 2025",
    companySlug: "kcb-foundation",
    categorySlug: "education-training",
    subcategorySlug: "higher-education",
    listingType: "OPPORTUNITY",
    opportunityType: "SCHOLARSHIP",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    town: "Nairobi",
    county: "Nairobi",
    description: "<p>KCB Foundation offers tuition and stipend support for students pursuing diploma and degree programs in STEM, business, and agriculture at accredited Kenyan universities. Annual scholarship worth KSh 200,000-400,000.</p>",
    deadlineDaysFromNow: 75,
    featured: false,
    tags: ["Scholarship", "Education"],
    daysAgo: 7,
  },
  {
    title: "Google Africa Developer Scholarship 2025",
    companySlug: "google-africa",
    categorySlug: "technology",
    subcategorySlug: "software-engineering",
    listingType: "OPPORTUNITY",
    opportunityType: "SCHOLARSHIP",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "REMOTE",
    town: "Remote",
    county: "Nairobi",
    description: "<p>Google is offering the Africa Developer Scholarship program for 2025, providing free access to world-class training in Android, Web, and Google Cloud technologies. Top performers get a chance at the Google Professional Certification.</p>",
    applicationUrl: "https://grow.google/africa/dev-scholarship/",
    deadlineDaysFromNow: 150,
    featured: false,
    tags: ["Scholarship", "Technology", "Remote"],
    daysAgo: 4,
  },

  // ═══ OPPORTUNITIES — FELLOWSHIPS ═══
  {
    title: "Acumen East Africa Fellowship 2025",
    companySlug: "mastercard-foundation",
    categorySlug: "education-training",
    listingType: "OPPORTUNITY",
    opportunityType: "FELLOWSHIP",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "HYBRID",
    town: "Nairobi",
    county: "Nairobi",
    description: "<p>The Acumen East Africa Fellowship is a 1-year leadership development program for social entrepreneurs and change-makers working on poverty-alleviation initiatives in Kenya, Uganda, Rwanda, Tanzania, and Ethiopia.</p>",
    requirements: "<ul><li>3+ years of experience in social impact</li><li>Currently leading or working on a social enterprise</li><li>Strong commitment to addressing poverty</li></ul>",
    deadlineDaysFromNow: 90,
    featured: false,
    tags: ["Fellowship", "Leadership"],
    daysAgo: 15,
  },
  {
    title: "M-Pesa Foundation Academy — Teacher Training Fellowship",
    companySlug: "m-pesa-foundation",
    categorySlug: "education-training",
    subcategorySlug: "training",
    listingType: "OPPORTUNITY",
    opportunityType: "FELLOWSHIP",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    town: "Nairobi, Mang'u",
    county: "Nairobi",
    description: "<p>A 6-month residential teacher training fellowship at the M-Pesa Foundation Academy. Fellows receive advanced training in competency-based curriculum, leadership, and 21st-century pedagogy for learners from disadvantaged backgrounds.</p>",
    deadlineDaysFromNow: 50,
    featured: false,
    tags: ["Fellowship", "Education", "Training"],
    daysAgo: 9,
  },
];

// ══════════════════════════════════════════════════════════════
// SEED FUNCTIONS
// ══════════════════════════════════════════════════════════════

async function seedCompanies() {
  console.log("Seeding companies...");

  const companyMap = new Map<string, string>(); // slug -> id

  for (const comp of COMPANIES) {
    const slug = slugify(comp.name);

    const record = await prisma.company.upsert({
      where: { slug },
      update: {
        name: comp.name,
        verified: comp.verified,
        orgType: comp.orgType,
        industry: comp.industry,
        description: comp.description,
        county: comp.county,
      },
      create: {
        slug,
        name: comp.name,
        verified: comp.verified,
        orgType: comp.orgType,
        industry: comp.industry,
        description: comp.description,
        county: comp.county,
      },
    });
    companyMap.set(slug, record.id);
  }

  console.log(`  -> ${companyMap.size} companies`);
  return companyMap;
}

async function seedListings(companyMap: Map<string, string>) {
  console.log("Seeding listings...");

  // Build lookup maps
  const categoryMap = new Map<string, string>();
  const subcategoryMap = new Map<string, string>();
  const countyMap = new Map<string, string>();
  const tagMap = new Map<string, string>();

  for (const c of await prisma.category.findMany()) categoryMap.set(c.slug, c.id);
  for (const s of await prisma.subcategory.findMany()) subcategoryMap.set(s.slug, s.id);
  for (const c of await prisma.county.findMany()) countyMap.set(c.name, c.id);
  for (const t of await prisma.tag.findMany()) tagMap.set(t.name, t.id);

  // Ensure all needed tags exist
  const allTagNames = new Set<string>();
  for (const l of LISTINGS) for (const t of l.tags) allTagNames.add(t);
  const missingTags: string[] = [];
  for (const t of allTagNames) if (!tagMap.has(t)) missingTags.push(t);
  if (missingTags.length > 0) {
    await prisma.tag.createMany({ data: missingTags.map((n) => ({ name: n })), skipDuplicates: true });
    for (const t of await prisma.tag.findMany()) tagMap.set(t.name, t.id);
  }

  let created = 0;

  for (const listing of LISTINGS) {
    const companyId = companyMap.get(listing.companySlug);
    if (!companyId) {
      console.warn(`  SKIP: Company "${listing.companySlug}" not found for "${listing.title}"`);
      continue;
    }

    const categoryId = categoryMap.get(listing.categorySlug);
    if (!categoryId) {
      console.warn(`  SKIP: Category "${listing.categorySlug}" not found for "${listing.title}"`);
      continue;
    }

    const subcategoryId = listing.subcategorySlug ? (subcategoryMap.get(listing.subcategorySlug) || null) : null;

    // Build listing tag connections
    const listingTags = listing.tags
      .map((tagName) => tagMap.get(tagName))
      .filter(Boolean) as string[];

    // Create listing
    const record = await prisma.listing.create({
      data: {
        slug: slugify(listing.title) + "-" + Math.random().toString(36).slice(2, 6),
        title: listing.title,
        description: listing.description,
        requirements: listing.requirements || null,
        instructions: listing.instructions || null,
        listingType: listing.listingType,
        governmentLevel: listing.governmentLevel || null,
        opportunityType: listing.opportunityType || null,
        companyId,
        categoryId,
        subcategoryId,
        town: listing.town,
        county: listing.county,
        employmentType: listing.employmentType,
        experienceLevel: listing.experienceLevel,
        workMode: listing.workMode,
        salaryMin: listing.salaryMin ?? null,
        salaryMax: listing.salaryMax ?? null,
        salaryPeriod: listing.salaryPeriod || null,
        status: "ACTIVE",
        featured: listing.featured,
        deadline: listing.deadlineDaysFromNow ? deadlineDaysFromNow(listing.deadlineDaysFromNow) : null,
        applicationUrl: listing.applicationUrl || null,
        applyEmail: listing.applyEmail || null,
        createdAt: daysAgo(listing.daysAgo),
        tags: {
          create: listingTags.map((tagId) => ({ tagId })),
        },
      },
    });
    created++;
  }

  console.log(`  -> ${created} listings created`);
}

async function main() {
  console.log("JobReady Content Seed");
  console.log("=".repeat(40));

  // Verify lookup tables exist
  const catCount = await prisma.category.count();
  if (catCount === 0) {
    console.error("ERROR: No categories found. Run seed-lookup.ts first!");
    process.exit(1);
  }

  const companyMap = await seedCompanies();
  await seedListings(companyMap);

  // Summary
  console.log("=".repeat(40));
  console.log("Summary:");
  console.log(`  Companies:  ${await prisma.company.count()}`);
  console.log(`  Listings:   ${await prisma.listing.count()}`);
  const byType = await prisma.listing.groupBy({ by: ["listingType"], _count: true });
  for (const row of byType) console.log(`    ${row.listingType}: ${row._count}`);
  console.log(`  Tags used:  ${await prisma.listingTag.count()}`);
  console.log("Done!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
