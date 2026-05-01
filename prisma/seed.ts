import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// ──────────────────────────────────────────────
//  LOCATIONS
// ──────────────────────────────────────────────

const LOCATIONS = [
  // Counties
  { name: 'Nairobi', slug: 'nairobi', type: 'COUNTY' },
  { name: 'Mombasa', slug: 'mombasa', type: 'COUNTY' },
  { name: 'Nakuru', slug: 'nakuru', type: 'COUNTY' },
  { name: 'Kisumu', slug: 'kisumu', type: 'COUNTY' },
  { name: 'Eldoret', slug: 'eldoret', type: 'COUNTY' },
  { name: 'Thika', slug: 'thika', type: 'COUNTY' },
  { name: 'Naivasha', slug: 'naivasha', type: 'COUNTY' },
  { name: 'Nationwide', slug: 'nationwide', type: 'COUNTY' },
  // Nairobi areas
  { name: 'CBD', slug: 'nairobi-cbd', type: 'AREA' },
  { name: 'Westlands', slug: 'westlands', type: 'AREA' },
  { name: 'Kilimani', slug: 'kilimani', type: 'AREA' },
  { name: 'Industrial Area', slug: 'industrial-area', type: 'AREA' },
  // Mombasa areas
  { name: 'Nyali', slug: 'nyali', type: 'AREA' },
  { name: 'Changamwe', slug: 'changamwe', type: 'AREA' },
  // Thika
  { name: 'Thika Rd', slug: 'thika-rd', type: 'AREA' },
  // Special
  { name: 'Remote', slug: 'remote', type: 'REMOTE' },
];

// ──────────────────────────────────────────────
//  CATEGORIES
// ──────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Technology & IT', slug: 'technology-it', jobCount: 2300 },
  { name: 'Finance & Accounting', slug: 'finance-accounting', jobCount: 1800 },
  { name: 'Sales & Business Dev', slug: 'sales-business-dev', jobCount: 1200 },
  { name: 'Marketing & Comms', slug: 'marketing-comms', jobCount: 980 },
  { name: 'Human Resources', slug: 'human-resources', jobCount: 760 },
  { name: 'Engineering', slug: 'engineering', jobCount: 690 },
  { name: 'Healthcare & Medical', slug: 'healthcare-medical', jobCount: 540 },
  { name: 'Education & Training', slug: 'education-training', jobCount: 480 },
  { name: 'Operations & Admin', slug: 'operations-admin', jobCount: 420 },
  { name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain', jobCount: 310 },
  { name: 'Hospitality & Tourism', slug: 'hospitality-tourism', jobCount: 240 },
  { name: 'Legal & Compliance', slug: 'legal-compliance', jobCount: 210 },
  { name: 'Creative Arts & Design', slug: 'creative-arts-design', jobCount: 190 },
  { name: 'Government & Public', slug: 'government-public', jobCount: 180 },
];

// ──────────────────────────────────────────────
//  COMPANIES
// ──────────────────────────────────────────────

const COMPANIES = [
  { name: 'Safaricom', slug: 'safaricom', industry: 'Telecommunications', isVerified: true },
  { name: 'KCB Bank', slug: 'kcb-bank', industry: 'Banking', isVerified: true },
  { name: 'Equity Bank', slug: 'equity-bank', industry: 'Banking', isVerified: true },
  { name: 'NCBA Group', slug: 'ncba-group', industry: 'Banking', isVerified: true },
  { name: 'Co-operative Bank', slug: 'co-operative-bank', industry: 'Banking', isVerified: true },
  { name: 'KRA', slug: 'kra', industry: 'Government', isVerified: true, isGovernment: true },
  { name: 'EABL', slug: 'eabl', industry: 'FMCG', isVerified: true },
  { name: 'KeNHA', slug: 'kenha', industry: 'Government', isVerified: true, isGovernment: true },
  { name: 'Teachers Service Commission', slug: 'tsc', industry: 'Government', isVerified: true, isGovernment: true },
  { name: 'Kenya Police Service', slug: 'kenya-police', industry: 'Government', isVerified: true, isGovernment: true },
  { name: 'Nakuru County Government', slug: 'nakuru-county', industry: 'Government', isGovernment: true },
  { name: 'Nairobi County Government', slug: 'nairobi-county', industry: 'Government', isGovernment: true },
  { name: 'Mombasa County Government', slug: 'mombasa-county', industry: 'Government', isGovernment: true },
  { name: 'University of Nairobi', slug: 'university-of-nairobi', industry: 'Education', isVerified: true },
  { name: 'KCB Group', slug: 'kcb-group', industry: 'Finance', isVerified: true },
  { name: 'Various', slug: 'various', industry: 'Various', isVerified: false },
];

// ──────────────────────────────────────────────
//  JOBS
// ──────────────────────────────────────────────

const JOBS = [
  {
    title: 'Senior Accountant', slug: 'senior-accountant-safaricom',
    companySlug: 'safaricom', categorySlug: 'finance-accounting', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Senior',
    description: 'We are looking for an experienced Senior Accountant to join our Finance team at Safaricom PLC. The successful candidate will be responsible for financial reporting, budgeting, and ensuring compliance with IFRS standards. You will work closely with cross-functional teams and report directly to the Chief Accountant.',
    requirements: JSON.stringify(["CPA(K) or ACCA qualification", "Bachelor's degree in Accounting or Finance", "5+ years of accounting experience in a large organization", "Strong knowledge of IFRS and Kenyan tax regulations", "Proficiency in ERP systems (SAP preferred)"]),
    salaryMin: 180000, salaryMax: 250000, salaryCurrency: 'Ksh',
    tags: ['Accounting', 'Finance', 'CPA', 'IFRS'],
    postedAt: new Date(Date.now() - 2 * 60000),
    deadlineAt: new Date(Date.now() + 2 * 86400000),
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Backend Developer', slug: 'backend-developer-kcb',
    companySlug: 'kcb-bank', categorySlug: 'technology-it', locationSlug: 'remote',
    type: 'Full-time', level: 'Mid Level',
    description: 'KCB Bank is seeking a talented Backend Developer to build and maintain robust APIs and microservices that power our digital banking platform. You will collaborate with frontend developers, product managers, and DevOps engineers to deliver scalable solutions serving millions of customers across East Africa.',
    requirements: JSON.stringify(["Bachelor's degree in Computer Science or related field", "3+ years experience with Node.js, Python, or Java", "Strong knowledge of RESTful APIs and microservices architecture", "Experience with cloud platforms (AWS/Azure)", "Knowledge of database systems (PostgreSQL, MongoDB)"]),
    salaryMin: 150000, salaryMax: 220000, salaryCurrency: 'Ksh',
    tags: ['Backend', 'API', 'Node.js', 'Python'],
    postedAt: new Date(Date.now() - 5 * 60000),
    deadlineAt: new Date(Date.now() + 5 * 86400000),
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: true,
  },
  {
    title: 'Marketing Intern', slug: 'marketing-intern-ncba',
    companySlug: 'ncba-group', categorySlug: 'marketing-comms', locationSlug: 'nairobi',
    type: 'Internship', level: 'Intern',
    description: "NCBA Group is offering an exciting 6-month internship opportunity in our Marketing department. You will gain hands-on experience in digital marketing, brand management, content creation, and market research. This is a perfect opportunity for recent graduates looking to kickstart their career in marketing.",
    requirements: JSON.stringify(["Bachelor's degree in Marketing, Communications, or related field", "Strong written and verbal communication skills", "Familiarity with social media platforms and digital marketing tools", "Creative mindset with attention to detail", "Available immediately for 6 months"]),
    salaryMin: 25000, salaryMax: 35000, salaryCurrency: 'Ksh',
    tags: ['Marketing', 'Internship', 'Digital Marketing'],
    postedAt: new Date(Date.now() - 8 * 60000),
    deadlineAt: new Date(Date.now() + 1 * 86400000),
    isUrgent: true, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Civil Engineer', slug: 'civil-engineer-kenha',
    companySlug: 'kenha', categorySlug: 'engineering', locationSlug: 'nakuru',
    type: 'Full-time', level: 'Mid Level',
    description: 'The Kenya National Highways Authority is looking for a qualified Civil Engineer to oversee road construction and maintenance projects in the Nakuru region. You will manage project timelines, conduct site inspections, and ensure compliance with engineering standards and safety regulations.',
    requirements: JSON.stringify(["Bachelor's degree in Civil Engineering", "Registered with Engineers Board of Kenya (EBK)", "5+ years experience in road construction projects", "Strong project management skills", "Knowledge of relevant Kenyan standards and regulations"]),
    salaryMin: 120000, salaryMax: 180000, salaryCurrency: 'Ksh',
    tags: ['Engineering', 'Infrastructure', 'Construction'],
    postedAt: new Date(Date.now() - 12 * 60000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: true, isRemote: false,
  },
  {
    title: 'Senior Product Manager — M-Pesa', slug: 'senior-pm-m-pesa-safaricom',
    companySlug: 'safaricom', categorySlug: 'technology-it', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Senior',
    description: "Lead product strategy for 30M+ active users across East Africa. Work with a cross-functional team of 12+ engineers and designers. Define the product roadmap, conduct market analysis, and drive key metrics for M-Pesa's growth and user engagement across multiple markets.",
    requirements: JSON.stringify(["8+ years of product management experience", "Experience with fintech or mobile payments", "Strong analytical and data-driven decision making", "MBA or equivalent preferred", "Experience leading cross-functional teams of 10+"]),
    salaryMin: 350000, salaryMax: 500000, salaryCurrency: 'Ksh',
    tags: ['Product', 'Fintech', 'Mobile', 'Leadership'],
    postedAt: new Date(Date.now() - 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: true, isGovernment: false, isRemote: false,
  },
  {
    title: 'Financial Analyst', slug: 'financial-analyst-equity',
    companySlug: 'equity-bank', categorySlug: 'finance-accounting', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: 'Equity Bank is seeking a motivated Financial Analyst to join our Corporate Finance team. You will be responsible for financial modeling, preparing investment analysis reports, and supporting strategic decision-making processes across the group.',
    requirements: JSON.stringify(["Bachelor's degree in Finance, Economics, or related field", "CFA Level 1 or higher preferred", "1-2 years of financial analysis experience", "Advanced Excel and financial modeling skills", "Strong analytical and presentation abilities"]),
    salaryMin: 80000, salaryMax: 120000, salaryCurrency: 'Ksh',
    tags: ['Finance', 'Analysis', 'Modeling'],
    postedAt: new Date(Date.now() - 3 * 3600000),
    deadlineAt: null,
    isUrgent: false, isFeatured: true, isGovernment: false, isRemote: false,
  },
  {
    title: 'Software Engineer', slug: 'software-engineer-kcb',
    companySlug: 'kcb-bank', categorySlug: 'technology-it', locationSlug: 'remote',
    type: 'Full-time', level: 'Mid Level',
    description: "Join KCB Bank's technology team to build innovative banking solutions. You will develop full-stack applications using modern frameworks, participate in code reviews, and contribute to our continuous integration and delivery pipeline.",
    requirements: JSON.stringify(["Bachelor's degree in Computer Science or equivalent", "3+ years of software development experience", "Proficiency in React/Next.js and Node.js", "Experience with CI/CD pipelines and DevOps practices", "Understanding of banking or fintech systems"]),
    salaryMin: 140000, salaryMax: 200000, salaryCurrency: 'Ksh',
    tags: ['Software', 'Full-stack', 'React', 'Node.js'],
    postedAt: new Date(Date.now() - 4 * 3600000),
    deadlineAt: null,
    isUrgent: false, isFeatured: true, isGovernment: false, isRemote: true,
  },
  {
    title: 'Graduate Trainee', slug: 'graduate-trainee-ncba',
    companySlug: 'ncba-group', categorySlug: 'finance-accounting', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: "NCBA Group's Graduate Trainee Program is a 12-month rotational program designed to develop future leaders. You will rotate across different departments including Retail Banking, Corporate Banking, Risk Management, and Operations, gaining a comprehensive understanding of the banking industry.",
    requirements: JSON.stringify(["Bachelor's degree with Second Class Upper or equivalent", "Graduated within the last 2 years", "Strong leadership potential and interpersonal skills", "Excellent written and verbal communication", "Flexibility to rotate across departments and locations"]),
    salaryMin: 60000, salaryMax: 80000, salaryCurrency: 'Ksh',
    tags: ['Graduate', 'Training', 'Leadership'],
    postedAt: new Date(Date.now() - 6 * 3600000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'HR Manager', slug: 'hr-manager-equity',
    companySlug: 'equity-bank', categorySlug: 'human-resources', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Senior',
    description: 'Equity Bank is seeking an experienced HR Manager to lead our Human Resources operations. You will oversee recruitment, employee relations, performance management, and training & development programs for a team of 500+ employees.',
    requirements: JSON.stringify(["Bachelor's degree in Human Resources or related field", "7+ years of HR management experience", "Professional HR certification (CHRP or equivalent)", "Strong knowledge of Kenyan labor laws", "Experience with HRIS systems"]),
    salaryMin: 200000, salaryMax: 300000, salaryCurrency: 'Ksh',
    tags: ['HR', 'Management', 'People'],
    postedAt: new Date(Date.now() - 2 * 86400000),
    deadlineAt: new Date(Date.now() + 3 * 86400000),
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Junior Developer', slug: 'junior-developer-kcb',
    companySlug: 'kcb-bank', categorySlug: 'technology-it', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: 'KCB Bank is looking for a Junior Developer to join our growing technology team. You will work on exciting projects including mobile banking apps, internal tools, and customer-facing platforms. Mentorship and training will be provided to help you grow your career.',
    requirements: JSON.stringify(["Bachelor's degree in Computer Science or related field", "0-1 year of development experience", "Basic knowledge of any programming language", "Eager to learn and grow in a fast-paced environment", "Good problem-solving skills"]),
    salaryMin: 70000, salaryMax: 100000, salaryCurrency: 'Ksh',
    tags: ['Junior', 'Developer', 'Entry Level'],
    postedAt: new Date(Date.now() - 86400000),
    deadlineAt: new Date(Date.now() + 5 * 86400000),
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Data Analyst', slug: 'data-analyst-kra',
    companySlug: 'kra', categorySlug: 'finance-accounting', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Mid Level',
    description: 'The Kenya Revenue Authority is seeking a skilled Data Analyst to support data-driven decision making. You will analyze tax compliance data, identify trends and patterns, and provide actionable insights to support revenue collection strategies.',
    requirements: JSON.stringify(["Bachelor's degree in Statistics, Mathematics, or Data Science", "3+ years of data analysis experience", "Proficiency in SQL, Python, and data visualization tools", "Experience with statistical modeling and forecasting", "Knowledge of tax systems is an added advantage"]),
    salaryMin: 100000, salaryMax: 160000, salaryCurrency: 'Ksh',
    tags: ['Data', 'Analytics', 'Statistics'],
    postedAt: new Date(Date.now() - 2 * 86400000),
    deadlineAt: new Date(Date.now() + 5 * 86400000),
    isUrgent: false, isFeatured: false, isGovernment: true, isRemote: false,
  },
  {
    title: 'KRA Graduate Trainee Program 2025', slug: 'kra-graduate-trainee-2025',
    companySlug: 'kra', categorySlug: 'government-public', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: 'The Kenya Revenue Authority Graduate Trainee Program is a prestigious 18-month program designed to develop the next generation of tax administration professionals. Trainees will undergo intensive training in tax policy, revenue collection, and public administration.',
    requirements: JSON.stringify(["Bachelor's degree with Second Class Upper or equivalent", "Graduated within the last 2 years", "Age limit: 28 years and below", "Strong analytical and communication skills", "Must be a Kenyan citizen"]),
    salaryMin: 70000, salaryMax: 90000, salaryCurrency: 'Ksh',
    tags: ['Graduate', 'Government', 'Tax', 'Gazette'],
    postedAt: new Date(Date.now() - 5 * 86400000),
    deadlineAt: new Date('2025-02-15'),
    isUrgent: false, isFeatured: false, isGovernment: true, isGazette: true, isRemote: false,
  },
  {
    title: 'TSC — 5,000 Teacher Posts', slug: 'tsc-5000-teacher-posts',
    companySlug: 'tsc', categorySlug: 'education-training', locationSlug: 'nationwide',
    type: 'Full-time', level: 'Entry Level',
    description: 'The Teachers Service Commission is recruiting 5,000 teachers for primary and secondary schools across all 47 counties. Successful candidates will be deployed to schools with the highest staffing needs, particularly in arid and semi-arid regions.',
    requirements: JSON.stringify(["Diploma or Degree in Education", "Registered with TSC", "Must have valid TSC certificate", "Willing to be posted to any county", "Must be a Kenyan citizen"]),
    salaryMin: 30000, salaryMax: 50000, salaryCurrency: 'Ksh',
    tags: ['Teaching', 'Government', 'Education'],
    postedAt: new Date(Date.now() - 7 * 86400000),
    deadlineAt: new Date('2025-02-28'),
    isUrgent: false, isFeatured: false, isGovernment: true, isRemote: false,
  },
  {
    title: 'Kenya Police Constable Recruitment', slug: 'kenya-police-constable-recruitment',
    companySlug: 'kenya-police', categorySlug: 'government-public', locationSlug: 'nationwide',
    type: 'Full-time', level: 'Entry Level',
    description: 'The Kenya Police Service is recruiting police constables to serve in various capacities across the country. Successful candidates will undergo a rigorous 9-month training program at the Kenya Police College before deployment.',
    requirements: JSON.stringify(["Kenyan citizen aged 18-28 years", "Minimum KCSE grade D+", "Must be physically fit", "No criminal record", "Valid national identity card"]),
    salaryMin: 35000, salaryMax: 45000, salaryCurrency: 'Ksh',
    tags: ['Police', 'Government', 'Security', 'Gazette'],
    postedAt: new Date(Date.now() - 3 * 86400000),
    deadlineAt: new Date('2025-03-10'),
    isUrgent: false, isFeatured: false, isGovernment: true, isGazette: true, isRemote: false,
  },
  {
    title: 'Various Positions — Nakuru County', slug: 'various-positions-nakuru-county',
    companySlug: 'nakuru-county', categorySlug: 'government-public', locationSlug: 'nakuru',
    type: 'Full-time', level: 'Entry Level',
    description: 'Nakuru County Government has multiple openings across various departments including Health, Education, Public Works, and Administration. These positions offer competitive salaries and the opportunity to serve the local community.',
    requirements: JSON.stringify(["Relevant diploma or degree based on position", "Must be a resident of Nakuru County (where applicable)", "Valid certificates and qualifications", "Computer literacy", "No criminal record"]),
    salaryMin: 30000, salaryMax: 60000, salaryCurrency: 'Ksh',
    tags: ['County', 'Government', 'Multiple Roles'],
    postedAt: new Date(Date.now() - 4 * 86400000),
    deadlineAt: new Date('2025-02-20'),
    isUrgent: false, isFeatured: false, isGovernment: true, isRemote: false,
  },
  {
    title: 'Health Workers — Nairobi County', slug: 'health-workers-nairobi-county',
    companySlug: 'nairobi-county', categorySlug: 'healthcare-medical', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: 'Nairobi County Government is recruiting health workers including nurses, clinical officers, and public health officers to strengthen healthcare service delivery in county health facilities.',
    requirements: JSON.stringify(["Valid professional license from relevant body", "Diploma or degree in relevant health field", "Experience in a clinical setting preferred", "Good communication and interpersonal skills", "Willingness to work in shifts"]),
    salaryMin: 40000, salaryMax: 80000, salaryCurrency: 'Ksh',
    tags: ['Health', 'County', 'Government'],
    postedAt: new Date(Date.now() - 5 * 86400000),
    deadlineAt: new Date('2025-02-25'),
    isUrgent: false, isFeatured: false, isGovernment: true, isRemote: false,
  },
  {
    title: 'Engineers — Mombasa County', slug: 'engineers-mombasa-county',
    companySlug: 'mombasa-county', categorySlug: 'engineering', locationSlug: 'mombasa',
    type: 'Full-time', level: 'Mid Level',
    description: 'Mombasa County Government is seeking qualified Civil, Electrical, and Mechanical Engineers to oversee infrastructure projects including road construction, water supply systems, and public buildings.',
    requirements: JSON.stringify(["Bachelor's degree in relevant engineering field", "Registered with Engineers Board of Kenya", "3+ years of relevant experience", "Project management skills", "Knowledge of county government operations"]),
    salaryMin: 80000, salaryMax: 150000, salaryCurrency: 'Ksh',
    tags: ['Engineering', 'County', 'Government'],
    postedAt: new Date(Date.now() - 6 * 86400000),
    deadlineAt: new Date('2025-03-05'),
    isUrgent: false, isFeatured: false, isGovernment: true, isRemote: false,
  },
  {
    title: 'Junior Accountant', slug: 'junior-accountant-coop-bank',
    companySlug: 'co-operative-bank', categorySlug: 'finance-accounting', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: 'Co-operative Bank is looking for a Junior Accountant to support our Finance team. You will assist with bookkeeping, financial reporting, bank reconciliations, and preparing tax returns. Great opportunity for a recent graduate starting their accounting career.',
    requirements: JSON.stringify(["Bachelor's degree in Accounting or Finance", "CPA Section 2 and above", "0-1 year accounting experience", "Proficiency in Microsoft Excel", "Attention to detail and high integrity"]),
    salaryMin: 60000, salaryMax: 90000, salaryCurrency: 'Ksh',
    tags: ['Accounting', 'Entry Level', 'Banking'],
    postedAt: new Date(Date.now() - 3 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Customer Service Representative', slug: 'customer-service-safaricom',
    companySlug: 'safaricom', categorySlug: 'sales-business-dev', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: 'Safaricom is hiring Customer Service Representatives to handle customer inquiries, resolve complaints, and provide information about our products and services. You will be the face of Safaricom to our millions of customers.',
    requirements: JSON.stringify(["Diploma or degree in any field", "Excellent communication skills in English and Kiswahili", "Previous customer service experience preferred", "Computer literacy", "Ability to work in shifts"]),
    salaryMin: 35000, salaryMax: 50000, salaryCurrency: 'Ksh',
    tags: ['Customer Service', 'Entry Level', 'Telecom'],
    postedAt: new Date(Date.now() - 4 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Data Entry Clerk', slug: 'data-entry-clerk-kra',
    companySlug: 'kra', categorySlug: 'operations-admin', locationSlug: 'nairobi',
    type: 'Contract', level: 'Entry Level',
    description: 'KRA needs a Data Entry Clerk on a 6-month contract to support digitization of tax records. You will accurately input, verify, and maintain data in our systems while ensuring data integrity and confidentiality.',
    requirements: JSON.stringify(["Diploma in IT, Business Administration, or related field", "Typing speed of 40+ WPM", "Proficiency in Microsoft Office Suite", "High attention to detail", "Ability to maintain confidentiality"]),
    salaryMin: 25000, salaryMax: 35000, salaryCurrency: 'Ksh',
    tags: ['Data Entry', 'Contract', 'Government'],
    postedAt: new Date(Date.now() - 5 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: true, isRemote: false,
  },
  {
    title: 'Marketing Assistant', slug: 'marketing-assistant-eabl',
    companySlug: 'eabl', categorySlug: 'marketing-comms', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Entry Level',
    description: 'East African Breweries Limited is looking for a Marketing Assistant to support our brand management team. You will assist in executing marketing campaigns, managing social media accounts, coordinating events, and analyzing market trends.',
    requirements: JSON.stringify(["Bachelor's degree in Marketing or related field", "1 year of marketing experience preferred", "Creative with strong organizational skills", "Social media savvy", "Valid driving license preferred"]),
    salaryMin: 45000, salaryMax: 65000, salaryCurrency: 'Ksh',
    tags: ['Marketing', 'FMCG', 'Entry Level'],
    postedAt: new Date(Date.now() - 6 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Finance Intern', slug: 'finance-intern-equity',
    companySlug: 'equity-bank', categorySlug: 'finance-accounting', locationSlug: 'nairobi',
    type: 'Internship', level: 'Intern',
    description: 'Equity Bank is offering a 3-month Finance Internship program. You will gain exposure to financial analysis, budgeting, forecasting, and reporting. Ideal for students in their final year or recent graduates.',
    requirements: JSON.stringify(["Pursuing or completed a degree in Finance/Accounting", "Strong analytical skills", "Proficiency in Excel", "Eager to learn in a fast-paced environment", "Available for 3 months starting immediately"]),
    salaryMin: 20000, salaryMax: 30000, salaryCurrency: 'Ksh',
    tags: ['Finance', 'Internship', 'Banking'],
    postedAt: new Date(Date.now() - 7 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Software Engineering Intern', slug: 'software-engineering-intern-safaricom',
    companySlug: 'safaricom', categorySlug: 'technology-it', locationSlug: 'nairobi',
    type: 'Internship', level: 'Intern',
    description: "Safaricom's 6-month Software Engineering Internship offers hands-on experience in building mobile and web applications used by millions. You will work alongside senior engineers, participate in agile sprints, and contribute to production code.",
    requirements: JSON.stringify(["Pursuing or completed a degree in Computer Science", "Knowledge of at least one programming language", "Understanding of web or mobile development", "Strong problem-solving abilities", "Available for 6 months"]),
    salaryMin: 25000, salaryMax: 40000, salaryCurrency: 'Ksh',
    tags: ['Software', 'Internship', 'Mobile'],
    postedAt: new Date(Date.now() - 7 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Mastercard Foundation Scholars', slug: 'mastercard-foundation-scholars',
    companySlug: 'university-of-nairobi', categorySlug: 'education-training', locationSlug: 'nairobi',
    type: 'Full-time', level: 'Any',
    description: 'The Mastercard Foundation Scholars Program at the University of Nairobi provides full scholarships to academically talented yet economically disadvantaged young Africans. The scholarship covers tuition, accommodation, books, stipend, and mentorship support.',
    requirements: JSON.stringify(["Strong academic performance", "Demonstrated financial need", "Leadership potential and community involvement", "Under 30 years of age", "Commitment to giving back to the community"]),
    salaryMin: null, salaryMax: null, salaryCurrency: '',
    salaryNote: 'Full Scholarship',
    tags: ['Scholarship', 'University', 'Full Sponsorship'],
    postedAt: new Date(Date.now() - 14 * 86400000),
    deadlineAt: new Date('2025-02-28'),
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'KCB Foundation Scholarship', slug: 'kcb-foundation-scholarship',
    companySlug: 'kcb-group', categorySlug: 'education-training', locationSlug: 'nationwide',
    type: 'Full-time', level: 'Any',
    description: 'The KCB Foundation Scholarship supports students from disadvantaged backgrounds pursuing tertiary education in Kenya. The scholarship covers tuition fees and provides a monthly stipend for living expenses.',
    requirements: JSON.stringify(["Kenyan citizen from an economically disadvantaged background", "Admitted to a recognized Kenyan university or college", "Strong academic record", "Demonstrated leadership and community service", "Not older than 25 years"]),
    salaryMin: null, salaryMax: null, salaryCurrency: '',
    salaryNote: 'Tuition + Stipend',
    tags: ['Scholarship', 'Foundation', 'Tuition'],
    postedAt: new Date(Date.now() - 21 * 86400000),
    deadlineAt: new Date('2025-03-15'),
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Waitstaff', slug: 'waitstaff-various',
    companySlug: 'various', categorySlug: 'hospitality-tourism', locationSlug: 'westlands',
    type: 'Casual', level: 'Any',
    description: 'Immediate opening for waitstaff at a busy restaurant in Westlands. No experience needed — training provided on the job. Flexible hours available.',
    requirements: JSON.stringify(["No experience required", "Must be 18+ years old", "Good customer service attitude", "Available for immediate start", "Neat personal appearance"]),
    salaryMin: null, salaryMax: null, salaryCurrency: 'Ksh',
    casualRate: 'Ksh 500/day', casualNote: 'Immediate start', isCasual: true,
    tags: ['Casual', 'Hospitality', 'Waitstaff'],
    postedAt: new Date(Date.now() - 2 * 3600000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Delivery Rider', slug: 'delivery-rider-various',
    companySlug: 'various', categorySlug: 'logistics-supply-chain', locationSlug: 'nairobi-cbd',
    type: 'Casual', level: 'Any',
    description: 'Delivery riders needed for a growing logistics company based in Nairobi CBD. Earn competitive daily rates with the flexibility to choose your own schedule. Must own a motorcycle.',
    requirements: JSON.stringify(["Must own a motorcycle (bodaboda)", "Valid riding license", "Smartphone for navigation", "Knowledge of Nairobi routes", "18+ years old"]),
    salaryMin: null, salaryMax: null, salaryCurrency: 'Ksh',
    casualRate: 'Ksh 1,200/day', casualNote: 'Own bike required', isCasual: true,
    tags: ['Casual', 'Delivery', 'Logistics'],
    postedAt: new Date(Date.now() - 4 * 3600000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Farm Worker', slug: 'farm-worker-various',
    companySlug: 'various', categorySlug: 'hospitality-tourism', locationSlug: 'naivasha',
    type: 'Casual', level: 'Any',
    description: 'Farm workers needed at a flower farm in Naivasha. Accommodation is provided on-site. Meals are also included. Great opportunity for those looking for steady work in a beautiful location.',
    requirements: JSON.stringify(["No experience required", "Physically fit", "Willing to live on-site", "Hardworking and reliable", "18+ years old"]),
    salaryMin: null, salaryMax: null, salaryCurrency: 'Ksh',
    casualRate: 'Ksh 700/day', casualNote: 'Accommodation provided', isCasual: true,
    tags: ['Casual', 'Agriculture', 'Farm'],
    postedAt: new Date(Date.now() - 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Shop Assistant', slug: 'shop-assistant-various',
    companySlug: 'various', categorySlug: 'sales-business-dev', locationSlug: 'thika-rd',
    type: 'Part-time', level: 'Entry Level',
    description: 'Part-time shop assistant needed at a retail store along Thika Road. Flexible schedule — work 3-4 days per week. Ideal for students or those looking for supplementary income.',
    requirements: JSON.stringify(["Basic computer literacy", "Good customer service skills", "Honest and reliable", "Available on weekends", "18+ years old"]),
    salaryMin: null, salaryMax: null, salaryCurrency: 'Ksh',
    casualRate: 'Ksh 15k/mo', casualNote: 'Part-time', isCasual: true,
    tags: ['Part-time', 'Retail', 'Shop'],
    postedAt: new Date(Date.now() - 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Cleaning Staff', slug: 'cleaning-staff-various',
    companySlug: 'various', categorySlug: 'operations-admin', locationSlug: 'kilimani',
    type: 'Casual', level: 'Any',
    description: 'Weekend cleaning staff needed for office spaces in Kilimani. Work every Saturday and Sunday from 8am to 2pm. Perfect for those with weekday commitments looking for weekend work.',
    requirements: JSON.stringify(["No experience required", "Physically able", "Punctual and reliable", "Available on weekends", "18+ years old"]),
    salaryMin: null, salaryMax: null, salaryCurrency: 'Ksh',
    casualRate: 'Ksh 600/day', casualNote: 'Weekends only', isCasual: true,
    tags: ['Casual', 'Cleaning', 'Weekend'],
    postedAt: new Date(Date.now() - 2 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Loader', slug: 'loader-various',
    companySlug: 'various', categorySlug: 'logistics-supply-chain', locationSlug: 'industrial-area',
    type: 'Casual', level: 'Any',
    description: 'Loaders needed at a warehouse in Industrial Area for the morning shift. You will handle loading and offloading of goods, packaging, and inventory management.',
    requirements: JSON.stringify(["Physically strong and fit", "No experience required", "Punctual for morning shifts", "Reliable and hardworking", "18+ years old"]),
    salaryMin: null, salaryMax: null, salaryCurrency: 'Ksh',
    casualRate: 'Ksh 800/day', casualNote: 'Morning shift (6am-2pm)', isCasual: true,
    tags: ['Casual', 'Warehouse', 'Loading'],
    postedAt: new Date(Date.now() - 3 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
  {
    title: 'Marketing Intern', slug: 'marketing-intern-eabl',
    companySlug: 'eabl', categorySlug: 'marketing-comms', locationSlug: 'nairobi',
    type: 'Internship', level: 'Intern',
    description: "EABL offers a structured internship program in the Marketing department. You will work on real brand campaigns, support event planning, conduct market research, and gain exposure to one of East Africa's largest FMCG companies.",
    requirements: JSON.stringify(["Pursuing or completed a degree in Marketing/Communications", "Creative mindset", "Strong communication skills", "Knowledge of social media platforms", "Available for 3-6 months"]),
    salaryMin: 25000, salaryMax: 35000, salaryCurrency: 'Ksh',
    tags: ['Marketing', 'FMCG', 'Internship'],
    postedAt: new Date(Date.now() - 7 * 86400000),
    deadlineAt: null,
    isUrgent: false, isFeatured: false, isGovernment: false, isRemote: false,
  },
];

// ──────────────────────────────────────────────
//  ARTICLES
// ──────────────────────────────────────────────

const ARTICLES = [
  {
    title: 'How to Pass the KRA Graduate Trainee Assessment',
    slug: 'kra-graduate-trainee-assessment-guide',
    category: 'Interview Tips',
    excerpt: 'A complete guide to the KRA recruitment process, including sample questions, tips from successful candidates, and what evaluators look for.',
    content: 'Full article content here...',
    coverUrl: 'https://picsum.photos/seed/kra-career-final/800/450.jpg',
    readTime: '6 min read',
    isPublished: true,
    publishedAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    title: '5 Tips for Your First County Government Interview',
    slug: 'county-government-interview-tips',
    category: 'Interview Tips',
    excerpt: 'Practical advice for acing county government job interviews in Kenya.',
    content: 'Full article content here...',
    readTime: '3 min read',
    isPublished: true,
    publishedAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    title: "Salary Negotiation in Kenya's Job Market",
    slug: 'salary-negotiation-kenya',
    category: 'Salary Guide',
    excerpt: 'Understanding salary ranges and negotiation strategies for the Kenyan job market.',
    content: 'Full article content here...',
    readTime: '5 min read',
    isPublished: true,
    publishedAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    title: 'CV Mistakes That Get Your Application Rejected',
    slug: 'cv-mistakes-rejected',
    category: 'CV Writing',
    excerpt: 'Common CV mistakes that recruiters say are instant dealbreakers.',
    content: 'Full article content here...',
    readTime: '4 min read',
    isPublished: true,
    publishedAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    title: 'Remote Work: Legitimate Opportunities vs. Scams',
    slug: 'remote-work-legitimate-vs-scams',
    category: 'Remote Work',
    excerpt: 'How to tell legitimate remote job opportunities from scams targeting Kenyan jobseekers.',
    content: 'Full article content here...',
    readTime: '6 min read',
    isPublished: true,
    publishedAt: new Date(Date.now() - 10 * 86400000),
  },
  {
    title: 'From Internship to Full-Time: A Transition Guide',
    slug: 'internship-to-fulltime-guide',
    category: 'Career Growth',
    excerpt: 'A step-by-step guide to converting your internship into a full-time position.',
    content: 'Full article content here...',
    readTime: '4 min read',
    isPublished: true,
    publishedAt: new Date(Date.now() - 12 * 86400000),
  },
];

// ──────────────────────────────────────────────
//  JOB UPDATES
// ──────────────────────────────────────────────

const JOB_UPDATES = [
  { jobSlug: 'kra-graduate-trainee-2025', content: '42 candidates shortlisted — KRA Graduate Trainee', isActive: true },
  { jobSlug: 'financial-analyst-equity', content: 'Interview invites sent — Equity Graduate Program', isActive: true },
  { jobSlug: 'senior-pm-m-pesa-safaricom', content: 'Safaricom Senior PM applications now closed', isActive: false },
  { jobSlug: 'marketing-intern-ncba', content: 'NCBA extends Marketing Intern deadline to Feb 20', isActive: true },
  { jobSlug: 'tsc-5000-teacher-posts', content: 'TSC internship postings for Q2 2025 now open', isActive: true },
  { jobSlug: 'backend-developer-kcb', content: 'KCB final round interviews scheduled for next week', isActive: false },
];

async function main() {
  console.log('🌱 Seeding Jobnet database...\n');

  // 1. Locations
  console.log('📍 Creating locations...');
  const locationMap: Record<string, string> = {};
  for (const loc of LOCATIONS) {
    const created = await prisma.location.create({ data: loc });
    locationMap[loc.slug] = created.id;
  }
  console.log(`   ✅ ${LOCATIONS.length} locations created`);

  // 2. Categories
  console.log('📂 Creating categories...');
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`   ✅ ${CATEGORIES.length} categories created`);

  // 3. Companies
  console.log('🏢 Creating companies...');
  const companyMap: Record<string, string> = {};
  for (const co of COMPANIES) {
    const created = await prisma.company.create({ data: co });
    companyMap[co.slug] = created.id;
  }
  console.log(`   ✅ ${COMPANIES.length} companies created`);

  // 4. Tags (deduplicated)
  console.log('🏷️  Creating tags...');
  const allTags = new Set<string>();
  for (const job of JOBS) {
    for (const tag of (job as any).tags || []) {
      allTags.add(tag);
    }
  }
  const tagMap: Record<string, string> = {};
  for (const tagName of allTags) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await prisma.tag.create({ data: { name: tagName, slug } });
    tagMap[tagName] = created.id;
  }
  console.log(`   ✅ ${allTags.size} tags created`);

  // 5. Jobs
  console.log('💼 Creating jobs...');
  let createdJobs = 0;
  for (const job of JOBS) {
    const companyId = companyMap[job.companySlug];
    const categoryId = categoryMap[job.categorySlug];
    const locationId = locationMap[job.locationSlug];

    if (!companyId || !categoryId || !locationId) {
      console.log(`   ⚠️  Skipping "${job.title}" — missing FK (company:${!!companyId}, cat:${!!categoryId}, loc:${!!locationId})`);
      continue;
    }

    const tags = (job as any).tags || [];
    const { tags: _tags, companySlug: _cs, categorySlug: _cats, locationSlug: _ls, ...jobData } = job as any;

    const created = await prisma.job.create({
      data: {
        ...jobData,
        companyId,
        categoryId,
        locationId,
        tags: {
          create: tags.map((t: string) => ({ tagId: tagMap[t] })),
        },
      },
    });

    createdJobs++;
  }
  console.log(`   ✅ ${createdJobs} jobs created`);

  // 6. Job Updates
  console.log('📢 Creating job updates...');
  let updateCount = 0;
  for (const update of JOB_UPDATES) {
    const job = await prisma.job.findFirst({ where: { slug: update.jobSlug } });
    if (job) {
      await prisma.jobUpdate.create({
        data: {
          content: update.content,
          isActive: update.isActive,
          jobId: job.id,
          createdAt: new Date(Date.now() - Math.random() * 6 * 3600000), // Spread over last 6 hours
        },
      });
      updateCount++;
    }
  }
  console.log(`   ✅ ${updateCount} job updates created`);

  // 7. Articles
  console.log('📰 Creating articles...');
  let articleCount = 0;
  for (const article of ARTICLES) {
    await prisma.article.create({ data: article });
    articleCount++;
  }
  console.log(`   ✅ ${articleCount} articles created`);

  // 8. Admin user
  console.log('👤 Creating admin user...');
  const passwordHash = await hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jobnet.co.ke' },
    update: {},
    create: {
      email: 'admin@jobnet.co.ke',
      passwordHash,
      name: 'Jobnet Admin',
      role: 'ADMIN',
    },
  });
  console.log(`   ✅ Admin user created (${admin.email})`);

  // 9. Sample newsletter subscription
  console.log('📧 Creating sample newsletter subscription...');
  await prisma.newsletterSubscription.upsert({
    where: { email: 'demo@jobnet.co.ke' },
    update: {},
    create: { email: 'demo@jobnet.co.ke' },
  });
  console.log('   ✅ Newsletter subscription created');

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
