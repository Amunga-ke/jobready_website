import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helper to slugify ───
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Categories ───
const CATEGORIES = [
  { name: "Technology & IT", icon: "laptop", order: 1 },
  { name: "Finance & Accounting", icon: "banknote", order: 2 },
  { name: "Sales & Business Development", icon: "trending-up", order: 3 },
  { name: "Marketing & Communications", icon: "megaphone", order: 4 },
  { name: "Human Resources", icon: "users", order: 5 },
  { name: "Engineering & Construction", icon: "hard-hat", order: 6 },
  { name: "Healthcare & Medical", icon: "heart-pulse", order: 7 },
  { name: "Education & Training", icon: "book-open", order: 8 },
  { name: "Government & Public Service", icon: "landmark", order: 9 },
  { name: "Administration & Office", icon: "clipboard-list", order: 10 },
  { name: "Logistics & Transport", icon: "truck", order: 11 },
  { name: "Hospitality & Tourism", icon: "bed", order: 12 },
  { name: "Legal & Compliance", icon: "scale", order: 13 },
  { name: "Creative Arts & Design", icon: "palette", order: 14 },
  { name: "Data Science & Analytics", icon: "bar-chart", order: 15 },
  { name: "Customer Service", icon: "headphones", order: 16 },
  { name: "Agriculture & Farming", icon: "wheat", order: 17 },
  { name: "Retail & Wholesale", icon: "shopping-cart", order: 18 },
  { name: "Security & Law Enforcement", icon: "shield", order: 19 },
  { name: "Cleaning & Maintenance", icon: "sparkles", order: 20 },
  { name: "Graduate Programs", icon: "graduation-cap", order: 21 },
  { name: "Research & Development", icon: "flask", order: 22 },
];

const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  "Technology & IT": ["Software Engineering", "Mobile Development", "Cloud & DevOps", "Data Engineering", "Cybersecurity", "UI/UX Design", "Product Management", "QA & Testing", "IT Support"],
  "Finance & Accounting": ["Financial Analysis", "Auditing", "Tax & Compliance", "Banking Operations", "Insurance", "Investment Management"],
  "Sales & Business Development": ["B2B Sales", "Retail Sales", "Business Development", "Account Management", "Partnerships"],
  "Marketing & Communications": ["Digital Marketing", "Brand Management", "Content & Social Media", "PR & Corporate Communications", "Event Marketing"],
  "Engineering & Construction": ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Project Management", "Quantity Surveying"],
  "Healthcare & Medical": ["Clinical Officers", "Nursing", "Pharmacy", "Public Health", "Medical Administration"],
  "Education & Training": ["Teaching", "Curriculum Development", "Academic Research", "E-Learning", "Vocational Training"],
  "Data Science & Analytics": ["Data Analysis", "Machine Learning", "Business Intelligence", "Research Analytics"],
};

// ─── Counties ───
const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu",
  "Kiambu", "Machakos", "Meru", "Kakamega", "Nyandarua",
  "Nyeri", "Murang'a", "Kilifi", "Makueni", "Bungoma",
  "Embu", "Kitui", "Garissa", "Kajiado", "Mandera",
  "Lamu", "Marsabit", "Trans Nzoia", "Isiolo", "Homa Bay",
  "Kisii", "Kericho", "Laikipia", "Migori", "Narok",
  "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi",
  "Vihiga", "Wajir", "West Pokot", "Baringo", "Busia",
  "Elgeyo Marakwet", "Nandi", "Nyamira", "Turkana", "Kwale",
];

// ─── Companies ───
const COMPANIES = [
  { name: "Safaricom PLC", orgType: "PARASTATAL", industry: "Telecommunications", verified: true, county: "Nairobi" },
  { name: "Equity Bank Kenya", orgType: "PARASTATAL", industry: "Banking & Finance", verified: true, county: "Nairobi" },
  { name: "KCB Group", orgType: "PARASTATAL", industry: "Banking & Finance", verified: true, county: "Nairobi" },
  { name: "NCBA Group", orgType: "PARASTATAL", industry: "Banking & Finance", verified: true, county: "Nairobi" },
  { name: "Co-operative Bank", orgType: "PARASTATAL", industry: "Banking & Finance", verified: true, county: "Nairobi" },
  { name: "Kenya Revenue Authority", orgType: "NATIONAL_GOV", industry: "Government", verified: true, county: "Nairobi" },
  { name: "Teachers Service Commission", orgType: "NATIONAL_GOV", industry: "Government", verified: true, county: "Nairobi" },
  { name: "National Police Service", orgType: "NATIONAL_GOV", industry: "Government", verified: true, county: "Nairobi" },
  { name: "County Government of Nairobi", orgType: "COUNTY_GOV", industry: "Government", verified: true, county: "Nairobi" },
  { name: "County Government of Nakuru", orgType: "COUNTY_GOV", industry: "Government", verified: true, county: "Nakuru" },
  { name: "County Government of Mombasa", orgType: "COUNTY_GOV", industry: "Government", verified: true, county: "Mombasa" },
  { name: "County Government of Kisumu", orgType: "COUNTY_GOV", industry: "Government", verified: true, county: "Kisumu" },
  { name: "East African Breweries", orgType: "PRIVATE", industry: "Manufacturing & FMCG", verified: true, county: "Nairobi" },
  { name: "Kenya Airways", orgType: "PARASTATAL", industry: "Aviation", verified: true, county: "Nairobi" },
  { name: "University of Nairobi", orgType: "ACADEMIC", industry: "Education", verified: true, county: "Nairobi" },
  { name: "Kenyatta University", orgType: "ACADEMIC", industry: "Education", verified: true, county: "Kiambu" },
  { name: "Google", orgType: "INTERNATIONAL", industry: "Technology", verified: true, county: "Nairobi" },
  { name: "Microsoft", orgType: "INTERNATIONAL", industry: "Technology", verified: true, county: "Nairobi" },
  { name: "Mastercard Foundation", orgType: "NGO", industry: "Development", verified: true, county: "Nairobi" },
  { name: "KCB Foundation", orgType: "NGO", industry: "Development", verified: true, county: "Nairobi" },
  { name: "Kenya Electricity Generating Company", orgType: "PARASTATAL", industry: "Energy", verified: true, county: "Nairobi" },
  { name: "Kenya National Highways Authority", orgType: "NATIONAL_GOV", industry: "Infrastructure", verified: true, county: "Nairobi" },
  { name: "Kenya Medical Research Institute", orgType: "NATIONAL_GOV", industry: "Health Research", verified: true, county: "Nairobi" },
  { name: "Deloitte East Africa", orgType: "PRIVATE", industry: "Consulting", verified: true, county: "Nairobi" },
  { name: "PwC Kenya", orgType: "PRIVATE", industry: "Consulting", verified: true, county: "Nairobi" },
  { name: "Bharti Airtel Kenya", orgType: "PRIVATE", industry: "Telecommunications", verified: true, county: "Nairobi" },
  { name: "Twiga Foods", orgType: "STARTUP", industry: "Agriculture Tech", verified: true, county: "Nairobi" },
  { name: "Cellulant", orgType: "STARTUP", industry: "Fintech", verified: true, county: "Nairobi" },
  { name: "Lateral Africa", orgType: "STARTUP", industry: "Technology", verified: false, county: "Nairobi" },
  { name: "Quick Deliveries Ltd", orgType: "SME", industry: "Logistics", verified: false, county: "Nairobi" },
  { name: "CleanPro Services", orgType: "SME", industry: "Cleaning", verified: false, county: "Nairobi" },
  { name: "Westlands Restaurants Association", orgType: "SME", industry: "Hospitality", verified: false, county: "Nairobi" },
  { name: "Naivasha Flower Farms", orgType: "PRIVATE", industry: "Agriculture", verified: false, county: "Nakuru" },
  { name: "Retail Solutions Kenya", orgType: "SME", industry: "Retail", verified: false, county: "Nairobi" },
  { name: "Logistics Hub Ltd", orgType: "SME", industry: "Logistics", verified: false, county: "Nairobi" },
];

// ─── Tags ───
const TAGS = [
  "Remote", "Entry Level", "Senior", "Government", "Fintech", "Banking", "Technology",
  "Healthcare", "Education", "Graduate", "Internship", "Scholarship", "County", "National",
  "Leadership", "Management", "Engineering", "Marketing", "Data", "Cloud", "Mobile",
  "Backend", "Frontend", "Full Stack", "DevOps", "Cybersecurity", "Product Management",
  "Consulting", "FMCG", "Manufacturing", "Agriculture", "Logistics", "Hospitality",
  "Retail", "Creative", "Design", "Research", "Training", "Certification",
  "Immediate Start", "No Experience", "Featured", "Urgent",
];

// ─── Listing templates ───
interface ListingTemplate {
  title: string;
  companyIdx: number;
  category: string;
  subcategory?: string;
  listingType: "JOB" | "GOVERNMENT" | "CASUAL" | "OPPORTUNITY";
  governmentLevel?: "NATIONAL" | "COUNTY" | "STATE_CORPORATION";
  opportunityType?: string;
  employmentType: string;
  experienceLevel: string;
  workMode: "ONSITE" | "REMOTE" | "HYBRID";
  location: string;
  countyName: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryPeriod?: string;
  description: string;
  requirements?: string;
  instructions?: string;
  deadline?: string; // DEPRECATED: use deadlineDaysFromNow instead
  deadlineDaysFromNow?: number; // days from now for deadline
  featured: boolean;
  tags: string[];
  applyEmail?: string;
  applicationUrl?: string;
  daysAgo?: number; // relative to now for createdAt
}

const LISTINGS: ListingTemplate[] = [
  // ═══ FEATURED ═══
  {
    title: "Senior Product Manager — M-Pesa",
    companyIdx: 0,
    category: "Technology & IT",
    subcategory: "Product Management",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    workMode: "HYBRID",
    location: "Nairobi",
    countyName: "Nairobi",
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
    companyIdx: 1,
    category: "Finance & Accounting",
    subcategory: "Financial Analysis",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 120000, salaryMax: 180000, salaryPeriod: "month",
    description: "<p>Join Equity Bank's Strategic Planning division as a Financial Analyst. You will support investment decisions, financial modeling, and reporting across the bank's East Africa operations.</p><ul><li>Build and maintain financial models for business planning</li><li>Prepare management reports and board presentations</li><li>Conduct market research and competitive analysis</li><li>Support budget forecasting and variance analysis</li></ul>",
    requirements: "<ul><li>Bachelor's degree in Finance, Accounting, or related field</li><li>CPA or CFA qualification preferred</li><li>3+ years in financial analysis or corporate finance</li><li>Advanced Excel and financial modeling skills</li><li>Experience with ERP systems (SAP/Oracle)</li></ul>",
    featured: true,
    deadlineDaysFromNow: 60,
    tags: ["Finance", "Banking", "Featured"],
    daysAgo: 3,
  },
  {
    title: "Software Engineer — Digital Banking",
    companyIdx: 2,
    category: "Technology & IT",
    subcategory: "Software Engineering",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "REMOTE",
    location: "Remote",
    countyName: "Nairobi",
    salaryMin: 200000, salaryMax: 350000, salaryPeriod: "month",
    description: "<p>Build the next generation of KCB's digital banking platform. Work with modern microservices architecture, cloud infrastructure, and agile delivery teams.</p><ul><li>Design and develop RESTful APIs and microservices</li><li>Implement secure payment processing solutions</li><li>Write unit and integration tests</li><li>Participate in code reviews and technical design discussions</li></ul>",
    requirements: "<ul><li>4+ years of software development experience</li><li>Proficiency in Java, Python, or Node.js</li><li>Experience with cloud platforms (AWS/Azure)</li><li>Knowledge of microservices and containerization (Docker/K8s)</li><li>Understanding of banking or fintech domain is a plus</li></ul>",
    applicationUrl: "https://kcbgroup.com/careers",
    featured: true,
    deadlineDaysFromNow: 45,
    tags: ["Backend", "Cloud", "Fintech", "Featured"],
    daysAgo: 5,
  },
  {
    title: "Graduate Trainee — 12 Month Program",
    companyIdx: 3,
    category: "Graduate Programs",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    description: "<p>NCBA Group's 12-month Graduate Trainee Program offers recent graduates hands-on experience in banking operations, digital innovation, and leadership development. Successful candidates rotate across multiple departments.</p><ul><li>Rotate through Retail Banking, Corporate Banking, and Operations</li><li>Participate in leadership and professional development workshops</li><li>Contribute to digital transformation projects</li><li>Receive mentorship from senior executives</li></ul>",
    requirements: "<ul><li>Bachelor's degree (minimum Second Class Upper)</li><li>Graduated in 2024 or 2025</li><li>Strong analytical and communication skills</li><li>Passionate about the financial services industry</li><li>No prior work experience required</li></ul>",
    deadlineDaysFromNow: 50,
    featured: true,
    tags: ["Graduate", "Banking", "Entry Level", "Featured"],
    daysAgo: 2,
  },

  // ═══ CLOSING SOON ═══
  {
    title: "Marketing Intern — Brand & Digital",
    companyIdx: 3,
    category: "Marketing & Communications",
    subcategory: "Digital Marketing",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 15000, salaryMax: 25000, salaryPeriod: "month",
    description: "<p>Join NCBA's Marketing department for a 3-month internship. Gain exposure to brand management, digital marketing campaigns, and corporate communications.</p><ul><li>Assist in planning and executing marketing campaigns</li><li>Create content for social media platforms</li><li>Support market research and competitor analysis</li><li>Help organize corporate events and sponsorships</li></ul>",
    deadlineDaysFromNow: 2,
    featured: false,
    tags: ["Marketing", "Internship", "Entry Level"],
    daysAgo: 10,
  },
  {
    title: "Senior Accountant — Finance Division",
    companyIdx: 0,
    category: "Finance & Accounting",
    subcategory: "Auditing",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    workMode: "HYBRID",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 180000, salaryMax: 280000, salaryPeriod: "month",
    description: "<p>Join Safaricom's Finance division as a Senior Accountant. Oversee financial reporting, tax compliance, and internal audit processes for one of East Africa's largest companies.</p>",
    requirements: "<ul><li>CPA(K) qualification mandatory</li><li>7+ years in accounting or auditing</li><li>IFRS knowledge and experience</li><li>Strong SAP or ERP experience</li></ul>",
    deadlineDaysFromNow: 1,
    featured: false,
    tags: ["Accounting", "Senior", "Banking"],
    daysAgo: 12,
  },
  {
    title: "HR Manager — Nairobi Region",
    companyIdx: 1,
    category: "Human Resources",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 200000, salaryMax: 320000, salaryPeriod: "month",
    description: "<p>Lead the HR function for Equity Bank's Nairobi region, managing talent acquisition, employee relations, performance management, and organizational development for 500+ staff.</p>",
    requirements: "<ul><li>8+ years in HR management</li><li>CHRP certification preferred</li><li>Experience in banking or financial services HR</li><li>Strong labor law knowledge</li></ul>",
    deadlineDaysFromNow: 3,
    featured: false,
    tags: ["HR", "Management", "Senior"],
    daysAgo: 8,
  },
  {
    title: "Junior Developer — Technology Team",
    companyIdx: 2,
    category: "Technology & IT",
    subcategory: "Software Engineering",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 80000, salaryMax: 120000, salaryPeriod: "month",
    description: "<p>KCB Bank is looking for enthusiastic Junior Developers to join our technology team. You will work on internal tools, customer-facing applications, and gain exposure to enterprise software development.</p>",
    requirements: "<ul><li>Degree in Computer Science, IT, or related field</li><li>Proficiency in at least one programming language</li><li>Understanding of databases (SQL)</li><li>Problem-solving mindset</li></ul>",
    deadlineDaysFromNow: 2,
    featured: false,
    tags: ["Backend", "Entry Level", "Banking"],
    daysAgo: 15,
  },
  {
    title: "Data Analyst — Revenue Intelligence",
    companyIdx: 5,
    category: "Data Science & Analytics",
    subcategory: "Data Analysis",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 100000, salaryMax: 160000, salaryPeriod: "month",
    description: "<p>KRA is seeking a Data Analyst to support revenue intelligence and compliance analytics. You will work with large datasets to identify tax compliance patterns and support policy decisions.</p>",
    requirements: "<ul><li>Degree in Statistics, Mathematics, Data Science, or related field</li><li>3+ years in data analysis</li><li>Proficiency in Python/R and SQL</li><li>Experience with BI tools (Power BI/Tableau)</li></ul>",
    deadlineDaysFromNow: 3,
    featured: false,
    tags: ["Data", "Government", "National"],
    daysAgo: 18,
  },

  // ═══ NATIONAL GOVERNMENT ═══
  {
    title: "KRA Graduate Trainee Program 2025",
    companyIdx: 5,
    category: "Government & Public Service",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nationwide",
    countyName: "Nairobi",
    description: "<p>The Kenya Revenue Authority invites applications from qualified graduates for its 2025 Graduate Trainee Program. The program runs for 18 months and offers rotations across Customs, Domestic Taxes, and IT departments.</p><ul><li>Rotate through multiple KRA departments</li><li>Receive comprehensive training on tax administration</li><li>Work on real revenue collection projects</li><li>Get mentorship from senior officers</li></ul>",
    requirements: "<ul><li>Bachelor's degree (minimum Second Class Upper)</li><li>Graduated between 2023 and 2025</li><li>Must be a Kenyan citizen aged 35 and below</li><li>No criminal record</li></ul>",
    instructions: "<p>Apply online through the <strong>KRA recruitment portal</strong>. Attach certified copies of academic certificates, national ID, and a detailed CV.</p>",
    deadlineDaysFromNow: 60,
    featured: false,
    tags: ["Government", "Graduate", "National"],
    daysAgo: 20,
  },
  {
    title: "TSC — 5,000 Teacher Posts 2025",
    companyIdx: 6,
    category: "Education & Training",
    subcategory: "Teaching",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nationwide",
    countyName: "Nairobi",
    description: "<p>The Teachers Service Commission has advertised 5,000 teaching positions for secondary schools across all 47 counties. Positions are available for various subject combinations.</p>",
    requirements: "<ul><li>Bachelor of Education degree</li><li>TSC registration certificate</li><li>Diploma or degree in relevant subject combination</li><li>Must be a Kenyan citizen</li></ul>",
    deadlineDaysFromNow: 75,
    featured: false,
    tags: ["Government", "Education", "National"],
    daysAgo: 14,
  },
  {
    title: "Kenya Police Constable Recruitment 2025",
    companyIdx: 7,
    category: "Security & Law Enforcement",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nationwide",
    countyName: "Nairobi",
    description: "<p>The National Police Service is recruiting 10,000 police constables across all 47 counties. Successful candidates will undergo 9 months of training at Kiganjo Police Training College.</p>",
    requirements: "<ul><li>Kenyan citizen aged 18-28 years</li><li>Minimum KCSE mean grade D+ (plain)</li><li>Must be physically fit</li><li>No criminal record</li></ul>",
    deadlineDaysFromNow: 90,
    featured: false,
    tags: ["Government", "Security", "National"],
    daysAgo: 25,
  },
  {
    title: "KeNHA — Senior Civil Engineer",
    companyIdx: 21,
    category: "Engineering & Construction",
    subcategory: "Civil Engineering",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 150000, salaryMax: 250000, salaryPeriod: "month",
    description: "<p>The Kenya National Highways Authority is recruiting a Senior Civil Engineer for the Nairobi-Mombasa highway expansion project.</p>",
    requirements: "<ul><li>BSc in Civil Engineering (Minimum Upper Second)</li><li>Registered with Engineers Board of Kenya</li><li>10+ years experience in highway construction</li><li>Project management certification (PMP preferred)</li></ul>",
    deadlineDaysFromNow: 50,
    featured: false,
    tags: ["Government", "Engineering", "Senior", "National"],
    daysAgo: 7,
  },
  {
    title: "KEMRI — Research Scientist (Epidemiology)",
    companyIdx: 22,
    category: "Research & Development",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Kisumu",
    countyName: "Kisumu",
    salaryMin: 130000, salaryMax: 200000, salaryPeriod: "month",
    description: "<p>KEMRI is looking for a Research Scientist to lead epidemiological studies on malaria and vector-borne diseases in Western Kenya.</p>",
    requirements: "<ul><li>MSc or PhD in Epidemiology, Public Health, or related field</li><li>3+ years research experience</li><li>Publications in peer-reviewed journals</li><li>Experience with statistical software (Stata, R, SAS)</li></ul>",
    deadlineDaysFromNow: 45,
    featured: false,
    tags: ["Government", "Research", "Healthcare", "National"],
    daysAgo: 5,
  },

  // ═══ COUNTY GOVERNMENT ═══
  {
    title: "Nakuru County — Various Positions 2025",
    companyIdx: 9,
    category: "Government & Public Service",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Nakuru",
    countyName: "Nakuru",
    description: "<p>The County Government of Nakuru is recruiting for multiple positions across Health, Public Works, and Administration departments.</p>",
    requirements: "<ul><li>Relevant diploma or degree</li><li>Must be a resident of Nakuru County (where applicable)</li><li>Valid professional certifications</li></ul>",
    deadlineDaysFromNow: 40,
    featured: false,
    tags: ["Government", "County"],
    daysAgo: 10,
  },
  {
    title: "Nairobi County — Clinical Officers & Nurses",
    companyIdx: 8,
    category: "Healthcare & Medical",
    subcategory: "Nursing",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 60000, salaryMax: 90000, salaryPeriod: "month",
    description: "<p>Nairobi County is recruiting clinical officers, nurses, and public health officers for county health facilities.</p>",
    requirements: "<ul><li>Diploma or degree in relevant health discipline</li><li>Valid license from relevant professional body</li><li>2+ years experience in a clinical setting</li></ul>",
    deadlineDaysFromNow: 35,
    featured: false,
    tags: ["Government", "Healthcare", "County"],
    daysAgo: 12,
  },
  {
    title: "Mombasa County — Civil & Structural Engineers",
    companyIdx: 10,
    category: "Engineering & Construction",
    subcategory: "Civil Engineering",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Mombasa",
    countyName: "Mombasa",
    salaryMin: 80000, salaryMax: 140000, salaryPeriod: "month",
    description: "<p>Mombasa County is seeking Civil and Structural Engineers for infrastructure development projects including roads, drainage, and public buildings.</p>",
    requirements: "<ul><li>BSc in Civil/Structural Engineering</li><li>Registered with Engineers Board of Kenya</li><li>5+ years experience in construction projects</li></ul>",
    deadlineDaysFromNow: 45,
    featured: false,
    tags: ["Government", "Engineering", "County"],
    daysAgo: 8,
  },
  {
    title: "Kisumu County — County Director of Health",
    companyIdx: 11,
    category: "Healthcare & Medical",
    subcategory: "Medical Administration",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "Full-time",
    experienceLevel: "Director",
    workMode: "ONSITE",
    location: "Kisumu",
    countyName: "Kisumu",
    description: "<p>The County Government of Kisumu invites applications for County Director of Health Services — a senior leadership role responsible for planning and implementing county health policies.</p>",
    requirements: "<ul><li>Master's degree in Public Health, Medicine, or related field</li><li>10+ years in health services management</li><li>Registration with relevant professional body</li></ul>",
    deadlineDaysFromNow: 55,
    featured: false,
    tags: ["Government", "Healthcare", "Leadership", "County"],
    daysAgo: 3,
  },

  // ═══ CASUAL & PART-TIME ═══
  {
    title: "Waitstaff — Westlands Restaurants",
    companyIdx: 31,
    category: "Hospitality & Tourism",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Westlands, Nairobi",
    countyName: "Nairobi",
    salaryMin: 500, salaryMax: 500, salaryPeriod: "day",
    description: "<p>Immediate opening for waitstaff at multiple restaurants in Westlands. No experience needed — training provided. Flexible hours available.</p>",
    featured: false,
    tags: ["Immediate Start", "No Experience"],
    daysAgo: 1,
  },
  {
    title: "Delivery Rider — CBD & Surrounding Areas",
    companyIdx: 30,
    category: "Logistics & Transport",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "CBD, Nairobi",
    countyName: "Nairobi",
    salaryMin: 1200, salaryMax: 1200, salaryPeriod: "day",
    description: "<p>Looking for motorcycle delivery riders for CBD and surrounding areas. Must own a motorcycle (Boda Boda) with valid license. Daily earnings potential.</p>",
    featured: false,
    tags: ["Immediate Start", "Logistics"],
    daysAgo: 2,
  },
  {
    title: "Farm Worker — Naivasha Flower Farms",
    companyIdx: 32,
    category: "Agriculture & Farming",
    listingType: "CASUAL",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Naivasha",
    countyName: "Nakuru",
    salaryMin: 700, salaryMax: 700, salaryPeriod: "day",
    description: "<p>Farm workers needed for flower farm operations in Naivasha. Accommodation provided. Meals included during work hours.</p>",
    featured: false,
    tags: ["Agriculture", "Immediate Start"],
    daysAgo: 4,
  },
  {
    title: "Shop Assistant — Thika Road Mall",
    companyIdx: 33,
    category: "Retail & Wholesale",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Thika Road, Nairobi",
    countyName: "Nairobi",
    salaryMin: 15000, salaryMax: 15000, salaryPeriod: "month",
    description: "<p>Part-time shop assistant needed for a retail outlet along Thika Road. Morning or afternoon shifts available.</p>",
    featured: false,
    tags: ["Retail", "No Experience"],
    daysAgo: 3,
  },
  {
    title: "Cleaning Staff — Kilimani Offices",
    companyIdx: 31,
    category: "Cleaning & Maintenance",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Kilimani, Nairobi",
    countyName: "Nairobi",
    salaryMin: 600, salaryMax: 600, salaryPeriod: "day",
    description: "<p>Weekend cleaning staff needed for offices and apartments in Kilimani area. Experience preferred but not required.</p>",
    featured: false,
    tags: ["No Experience"],
    daysAgo: 1,
  },
  {
    title: "Loader — Industrial Area Warehouse",
    companyIdx: 34,
    category: "Logistics & Transport",
    listingType: "CASUAL",
    employmentType: "Part-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Industrial Area, Nairobi",
    countyName: "Nairobi",
    salaryMin: 800, salaryMax: 800, salaryPeriod: "day",
    description: "<p>Morning shift loaders needed for a busy warehouse in Industrial Area. Must be physically fit.</p>",
    featured: false,
    tags: ["Logistics", "Immediate Start"],
    daysAgo: 0,
  },

  // ═══ OPPORTUNITIES — INTERNSHIPS ═══
  {
    title: "Finance Intern — Equity Bank",
    companyIdx: 1,
    category: "Finance & Accounting",
    subcategory: "Financial Analysis",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    description: "<p>3-month internship in Equity Bank's Finance department. Gain hands-on experience in financial analysis, reporting, and planning.</p>",
    deadlineDaysFromNow: 60,
    featured: false,
    tags: ["Internship", "Finance", "Banking"],
    daysAgo: 5,
  },
  {
    title: "Software Engineering Intern — Safaricom Innovation Lab",
    companyIdx: 0,
    category: "Technology & IT",
    subcategory: "Software Engineering",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "HYBRID",
    location: "Nairobi",
    countyName: "Nairobi",
    description: "<p>6-month software engineering internship at Safaricom's Innovation Lab. Work on cutting-edge projects in mobile, cloud, and AI.</p>",
    deadlineDaysFromNow: 55,
    featured: false,
    tags: ["Internship", "Technology", "Mobile"],
    daysAgo: 8,
  },
  {
    title: "Marketing Intern — EABL Brand Team",
    companyIdx: 12,
    category: "Marketing & Communications",
    subcategory: "Brand Management",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    description: "<p>Join EABL's marketing team for a 3-month internship. Work on brand campaigns, digital marketing, and consumer engagement.</p>",
    deadlineDaysFromNow: 70,
    featured: false,
    tags: ["Internship", "Marketing", "FMCG"],
    daysAgo: 6,
  },
  {
    title: "Data Science Intern — Google Africa",
    companyIdx: 16,
    category: "Data Science & Analytics",
    subcategory: "Machine Learning",
    listingType: "OPPORTUNITY",
    opportunityType: "INTERNSHIP",
    employmentType: "Internship",
    experienceLevel: "Entry-level",
    workMode: "REMOTE",
    location: "Remote",
    countyName: "Nairobi",
    description: "<p>Google is offering a Data Science internship as part of the Africa Developer Program. Work with Google research teams on ML projects with African impact.</p>",
    deadlineDaysFromNow: 120,
    featured: false,
    tags: ["Internship", "Data", "Remote"],
    daysAgo: 2,
  },

  // ═══ OPPORTUNITIES — SCHOLARSHIPS ═══
  {
    title: "Mastercard Foundation Scholars — UoN",
    companyIdx: 14,
    category: "Education & Training",
    listingType: "OPPORTUNITY",
    opportunityType: "SCHOLARSHIP",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 0, salaryMax: 0,
    description: "<p>Full scholarship for undergraduate studies at the University of Nairobi. Covers tuition, accommodation, books, and a living stipend. Open to academically talented yet economically disadvantaged students from Kenya.</p>",
    requirements: "<ul><li>Strong academic record (mean grade A- or above in KCSE)</li><li>Demonstrated financial need</li><li>Leadership potential and community involvement</li><li>Applying for an undergraduate degree at UoN</li></ul>",
    deadlineDaysFromNow: 60,
    featured: false,
    tags: ["Scholarship", "Education"],
    daysAgo: 10,
  },
  {
    title: "KCB Foundation Scholarship 2025",
    companyIdx: 19,
    category: "Education & Training",
    listingType: "OPPORTUNITY",
    opportunityType: "SCHOLARSHIP",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    description: "<p>KCB Foundation offers tuition and stipend support for students pursuing diploma and degree programs in STEM, business, and agriculture at accredited Kenyan universities.</p>",
    deadlineDaysFromNow: 75,
    featured: false,
    tags: ["Scholarship", "Education"],
    daysAgo: 7,
  },
  {
    title: "Google Africa Developer Scholarship 2025",
    companyIdx: 16,
    category: "Technology & IT",
    listingType: "OPPORTUNITY",
    opportunityType: "SCHOLARSHIP",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "REMOTE",
    location: "Remote",
    countyName: "Nairobi",
    description: "<p>Google is offering the Africa Developer Scholarship program for 2025, providing free access to world-class training in Android, Web, and Google Cloud technologies.</p>",
    applicationUrl: "https://grow.google/africa/dev-scholarship/",
    deadlineDaysFromNow: 150,
    featured: true,
    tags: ["Scholarship", "Technology", "Remote"],
    daysAgo: 4,
  },

  // ═══ MORE REGULAR JOBS — to fill out listings ═══
  {
    title: "Junior Accountant — Co-operative Bank",
    companyIdx: 4,
    category: "Finance & Accounting",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 60000, salaryMax: 90000, salaryPeriod: "month",
    description: "<p>Entry-level accounting position at Co-operative Bank. Handle day-to-day bookkeeping, reconciliation, and financial reporting.</p>",
    deadlineDaysFromNow: 75,
    featured: false,
    tags: ["Entry Level", "Banking"],
    daysAgo: 3,
  },
  {
    title: "Customer Service Representative — Safaricom",
    companyIdx: 0,
    category: "Customer Service",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 40000, salaryMax: 60000, salaryPeriod: "month",
    description: "<p>Handle customer inquiries via phone, chat, and email. Resolve issues related to M-Pesa, data, and voice services.</p>",
    deadlineDaysFromNow: 80,
    featured: false,
    tags: ["Entry Level", "Technology"],
    daysAgo: 1,
  },
  {
    title: "Backend Developer — Cellulant",
    companyIdx: 27,
    category: "Technology & IT",
    subcategory: "Software Engineering",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "HYBRID",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 180000, salaryMax: 300000, salaryPeriod: "month",
    description: "<p>Join Cellulant's engineering team to build and scale payment APIs serving 15+ African countries. Work with Node.js, Java, and cloud-native technologies.</p>",
    requirements: "<ul><li>3+ years backend development experience</li><li>Proficiency in Node.js or Java</li><li>Experience with payment systems (Visa, Mastercard, M-Pesa APIs)</li><li>Understanding of PCI-DSS compliance</li></ul>",
    featured: false,
    deadlineDaysFromNow: 30,
    tags: ["Backend", "Fintech", "Technology"],
    daysAgo: 0,
  },
  {
    title: "Marketing Manager — Twiga Foods",
    companyIdx: 26,
    category: "Marketing & Communications",
    subcategory: "Brand Management",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 150000, salaryMax: 220000, salaryPeriod: "month",
    description: "<p>Lead marketing strategy for Twiga Foods, Kenya's leading agricultural supply chain platform connecting farmers to vendors.</p>",
    featured: false,
    deadlineDaysFromNow: 40,
    tags: ["Marketing", "Management", "Agriculture"],
    daysAgo: 2,
  },
  {
    title: "Nurse — Kisumu County Hospital",
    companyIdx: 11,
    category: "Healthcare & Medical",
    subcategory: "Nursing",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Kisumu",
    countyName: "Kisumu",
    salaryMin: 50000, salaryMax: 75000, salaryPeriod: "month",
    description: "<p>Kisumu County Hospital is seeking registered nurses for its medical, surgical, and pediatric wards.</p>",
    requirements: "<ul><li>KRCHN or BSc Nursing</li><li>Valid Nursing Council of Kenya license</li><li>2+ years clinical experience</li></ul>",
    deadlineDaysFromNow: 60,
    featured: false,
    tags: ["Healthcare", "Entry Level"],
    daysAgo: 5,
  },
  {
    title: "Digital Marketing Executive — Airtel Kenya",
    companyIdx: 25,
    category: "Marketing & Communications",
    subcategory: "Digital Marketing",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "HYBRID",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 100000, salaryMax: 160000, salaryPeriod: "month",
    description: "<p>Drive digital marketing campaigns for Airtel Money and data products. Manage social media, paid ads, and performance analytics.</p>",
    featured: false,
    tags: ["Marketing", "Technology"],
    daysAgo: 0,
  },
  {
    title: "Civil Engineer — Nakuru-Mai Mahiu Road Project",
    companyIdx: 21,
    category: "Engineering & Construction",
    subcategory: "Civil Engineering",
    listingType: "GOVERNMENT",
    governmentLevel: "NATIONAL",
    employmentType: "Contract",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Nakuru",
    countyName: "Nakuru",
    salaryMin: 120000, salaryMax: 180000, salaryPeriod: "month",
    description: "<p>KeNHA needs Civil Engineers for the Nakuru-Mai Mahiu road expansion project. 18-month contract.</p>",
    deadlineDaysFromNow: 50,
    featured: false,
    tags: ["Government", "Engineering", "National"],
    daysAgo: 6,
  },
  {
    title: "UI/UX Designer — Microsoft ADC",
    companyIdx: 17,
    category: "Technology & IT",
    subcategory: "UI/UX Design",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "HYBRID",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 200000, salaryMax: 350000, salaryPeriod: "month",
    description: "<p>Join Microsoft's Africa Development Centre as a UI/UX Designer. Design experiences for Azure, Teams, and other enterprise products used by millions globally.</p>",
    requirements: "<ul><li>4+ years product design experience</li><li>Proficiency in Figma, Adobe XD, or Sketch</li><li>Portfolio demonstrating complex enterprise UX</li><li>Understanding of design systems and accessibility</li></ul>",
    applicationUrl: "https://careers.microsoft.com",
    deadlineDaysFromNow: 120,
    featured: true,
    tags: ["Design", "Technology", "Remote"],
    daysAgo: 1,
  },
  {
    title: "Audit Associate — Deloitte East Africa",
    companyIdx: 23,
    category: "Finance & Accounting",
    subcategory: "Auditing",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Entry-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 90000, salaryMax: 130000, salaryPeriod: "month",
    description: "<p>Join Deloitte's Audit & Assurance practice. Work with top-tier clients across banking, telecommunications, manufacturing, and government sectors.</p>",
    requirements: "<ul><li>Bachelor's degree in Accounting, Finance, or related</li><li>CPA Section 4 and above</li><li>Strong analytical and communication skills</li><li>Proficiency in Excel and audit software</li></ul>",
    featured: false,
    tags: ["Consulting", "Finance", "Entry Level"],
    daysAgo: 2,
  },
  {
    title: "DevOps Engineer — Kenya Airways",
    companyIdx: 13,
    category: "Technology & IT",
    subcategory: "Cloud & DevOps",
    listingType: "JOB",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    location: "Nairobi",
    countyName: "Nairobi",
    salaryMin: 180000, salaryMax: 280000, salaryPeriod: "month",
    description: "<p>Kenya Airways is modernizing its tech stack. As DevOps Engineer, you'll build CI/CD pipelines, manage cloud infrastructure on AWS, and ensure 99.9% uptime for mission-critical systems.</p>",
    requirements: "<ul><li>3+ years DevOps experience</li><li>AWS/Azure certifications preferred</li><li>Experience with Terraform, Docker, Kubernetes</li><li>Strong Linux administration skills</li></ul>",
    featured: false,
    tags: ["DevOps", "Cloud", "Technology"],
    daysAgo: 3,
  },
];

// ─── Main seed function ───

// ─── Main seed function (optimized for slow remote MySQL) ───

const DAY_MS = 86_400_000;

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── 0. Clean existing data (FK order) ───
  console.log("  Clearing existing data...");
  await prisma.listingTag.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.county.deleteMany();
  await prisma.category.deleteMany();
  await prisma.company.deleteMany();
  console.log("  ✅ Existing data cleared\n");

  // ─── 1. Categories (bulk insert) ───
  console.log("  Creating categories...");
  await prisma.category.createMany({
    data: CATEGORIES.map((cat) => ({
      slug: slugify(cat.name),
      name: cat.name,
      icon: cat.icon,
      sortOrder: cat.order,
      active: true,
    })),
  });
  const dbCategories = await prisma.category.findMany();
  const categoryMap = new Map(dbCategories.map((c) => [c.name, c.id]));
  console.log(`  ✅ ${dbCategories.length} categories created`);

  // ─── 2. Subcategories (bulk insert) ───
  console.log("  Creating subcategories...");
  const subcategoryRows: { slug: string; name: string; categoryId: string; sortOrder: number; active: boolean }[] = [];
  let subcatOrder = 0;
  for (const [catName, subs] of Object.entries(SUBCATEGORIES_BY_CATEGORY)) {
    const catId = categoryMap.get(catName)!;
    for (const subName of subs) {
      subcatOrder++;
      subcategoryRows.push({
        slug: slugify(subName),
        name: subName,
        categoryId: catId,
        sortOrder: subcatOrder,
        active: true,
      });
    }
  }
  if (subcategoryRows.length > 0) {
    // MySQL limit for bulk insert — batch if needed
    const BATCH_SIZE = 500;
    for (let i = 0; i < subcategoryRows.length; i += BATCH_SIZE) {
      await prisma.subcategory.createMany({
        data: subcategoryRows.slice(i, i + BATCH_SIZE),
      });
    }
  }
  const dbSubcategories = await prisma.subcategory.findMany();
  const subcategoryMap = new Map(dbSubcategories.map((s) => [s.name, s.id]));
  console.log(`  ✅ ${dbSubcategories.length} subcategories created`);

  // ─── 3. Counties (bulk insert) ───
  console.log("  Creating counties...");
  await prisma.county.createMany({
    data: COUNTIES.map((name, idx) => ({
      slug: slugify(name),
      name,
      code: String(idx + 1).padStart(3, "0"),
      active: true,
    })),
  });
  const dbCounties = await prisma.county.findMany();
  const countyMap = new Map(dbCounties.map((c) => [c.name, c.id]));
  console.log(`  ✅ ${dbCounties.length} counties created`);

  // ─── 4. Companies (bulk insert) ───
  console.log("  Creating companies...");
  await prisma.company.createMany({
    data: COMPANIES.map((c) => ({
      slug: slugify(c.name),
      name: c.name,
      orgType: c.orgType,
      industry: c.industry,
      verified: c.verified,
      county: c.county,
      country: "Kenya",
    })),
  });
  const dbCompanies = await prisma.company.findMany();
  const companyMap = new Map(dbCompanies.map((c) => [c.slug, c.id]));
  console.log(`  ✅ ${dbCompanies.length} companies created`);

  // ─── 5. Tags (bulk insert) ───
  console.log("  Creating tags...");
  await prisma.tag.createMany({
    data: TAGS.map((name) => ({ name })),
  });
  const dbTags = await prisma.tag.findMany();
  const tagMap = new Map(dbTags.map((t) => [t.name, t.id]));
  console.log(`  ✅ ${dbTags.length} tags created`);

  // ─── 6. Listings (bulk insert) ───
  console.log("  Creating listings...");
  const listingRows: any[] = [];

  for (let li = 0; li < LISTINGS.length; li++) {
    const t = LISTINGS[li];
    const company = COMPANIES[t.companyIdx];
    const companyId = companyMap.get(slugify(company.name))!;
    const categoryId = categoryMap.get(t.category) || null;
    const subcategoryId = t.subcategory ? (subcategoryMap.get(t.subcategory) || null) : null;
    const countyId = countyMap.get(t.countyName) || null;

    const createdAt = new Date(Date.now() - (t.daysAgo ?? 0) * DAY_MS);
    // Add random hours 7-18 for realistic timestamps
    createdAt.setHours(Math.floor(Math.random() * 12) + 7, Math.floor(Math.random() * 60), 0, 0);

    const slug = slugify(t.title) + (t.countyName !== "Nairobi" ? `-${slugify(t.countyName)}` : "");

    let deadline: Date | null = null;
    if (t.deadlineDaysFromNow !== undefined) {
      deadline = new Date(Date.now() + t.deadlineDaysFromNow * DAY_MS);
      deadline.setHours(23, 59, 0, 0);
    } else if (t.deadline) {
      deadline = new Date(t.deadline);
    }

    const isUrgent = deadline ? (deadline.getTime() - Date.now()) < 48 * 60 * 60 * 1000 : false;

    listingRows.push({
      slug,
      title: t.title,
      description: t.description,
      requirements: t.requirements || null,
      instructions: t.instructions || null,
      listingType: t.listingType,
      governmentLevel: t.governmentLevel || null,
      opportunityType: t.opportunityType || null,
      companyId,
      categoryId,
      subcategoryId,
      location: t.location,
      countyId,
      countyName: t.countyName,
      country: "Kenya",
      employmentType: t.employmentType,
      experienceLevel: t.experienceLevel,
      workMode: t.workMode,
      salaryMin: t.salaryMin,
      salaryMax: t.salaryMax,
      salaryCurrency: "KES",
      salaryPeriod: t.salaryPeriod || null,
      status: "ACTIVE",
      featured: t.featured,
      isUrgent,
      applicationUrl: t.applicationUrl || null,
      applyEmail: t.applyEmail || null,
      deadline,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Bulk insert listings in batches
  const LISTING_BATCH = 100;
  for (let i = 0; i < listingRows.length; i += LISTING_BATCH) {
    await prisma.listing.createMany({
      data: listingRows.slice(i, i + LISTING_BATCH),
    });
  }
  console.log(`  ✅ ${listingRows.length} listings created`);

  // ─── 7. ListingTag junction (bulk insert) ───
  console.log("  Creating listing-tag relations...");
  const dbListings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true },
  });
  const listingIdBySlug = new Map(dbListings.map((l) => [l.slug, l.id]));

  const listingTagRows: { listingId: string; tagId: string }[] = [];
  for (const t of LISTINGS) {
    const slug = slugify(t.title) + (t.countyName !== "Nairobi" ? `-${slugify(t.countyName)}` : "");
    const listingId = listingIdBySlug.get(slug);
    if (!listingId) continue;
    for (const tagName of t.tags) {
      const tagId = tagMap.get(tagName);
      if (tagId) {
        listingTagRows.push({ listingId, tagId });
      }
    }
  }

  if (listingTagRows.length > 0) {
    const TAG_BATCH = 1000;
    for (let i = 0; i < listingTagRows.length; i += TAG_BATCH) {
      await prisma.listingTag.createMany({
        data: listingTagRows.slice(i, i + TAG_BATCH),
      });
    }
  }
  console.log(`  ✅ ${listingTagRows.length} listing-tag relations created`);

  // ─── Summary ───
  const totalListings = await prisma.listing.count();
  const totalFeatured = await prisma.listing.count({ where: { featured: true } });
  const totalGovt = await prisma.listing.count({ where: { listingType: "GOVERNMENT" } });
  const totalCasual = await prisma.listing.count({ where: { listingType: "CASUAL" } });
  const totalOpps = await prisma.listing.count({ where: { listingType: "OPPORTUNITY" } });

  console.log("\n📊 Database Summary:");
  console.log(`   Total listings: ${totalListings}`);
  console.log(`   Featured: ${totalFeatured}`);
  console.log(`   Government: ${totalGovt}`);
  console.log(`   Casual: ${totalCasual}`);
  console.log(`   Opportunities: ${totalOpps}`);
  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
