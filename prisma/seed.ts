import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Jobnet database...\n');

  // ─── CATEGORIES ──────────────────────────────
  const categories = await Promise.all([
    db.category.upsert({ where: { slug: 'technology-it' }, update: {}, create: { name: 'Technology & IT', slug: 'technology-it', description: 'Software, hardware, IT support and all tech roles', icon: '💻' } }),
    db.category.upsert({ where: { slug: 'finance-accounting' }, update: {}, create: { name: 'Finance & Accounting', slug: 'finance-accounting', description: 'Banking, accounting, auditing and financial services', icon: '💰' } }),
    db.category.upsert({ where: { slug: 'sales-business-dev' }, update: {}, create: { name: 'Sales & Business Dev', slug: 'sales-business-dev', description: 'Sales, business development, partnerships and account management', icon: '📈' } }),
    db.category.upsert({ where: { slug: 'marketing-comms' }, update: {}, create: { name: 'Marketing & Comms', slug: 'marketing-comms', description: 'Digital marketing, PR, content creation and brand management', icon: '📣' } }),
    db.category.upsert({ where: { slug: 'human-resources' }, update: {}, create: { name: 'Human Resources', slug: 'human-resources', description: 'HR management, recruitment, training and development', icon: '👥' } }),
    db.category.upsert({ where: { slug: 'engineering' }, update: {}, create: { name: 'Engineering', slug: 'engineering', description: 'Civil, mechanical, electrical and all engineering disciplines', icon: '🏗️' } }),
    db.category.upsert({ where: { slug: 'healthcare-medical' }, update: {}, create: { name: 'Healthcare & Medical', slug: 'healthcare-medical', description: 'Doctors, nurses, clinical officers and allied health', icon: '🏥' } }),
    db.category.upsert({ where: { slug: 'education-training' }, update: {}, create: { name: 'Education & Training', slug: 'education-training', description: 'Teaching, lecturing, curriculum development and training', icon: '📚' } }),
    db.category.upsert({ where: { slug: 'operations-admin' }, update: {}, create: { name: 'Operations & Admin', slug: 'operations-admin', description: 'Administration, operations, data entry and office support', icon: '📋' } }),
    db.category.upsert({ where: { slug: 'logistics-supply-chain' }, update: {}, create: { name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain', description: 'Supply chain, warehousing, transport and procurement', icon: '🚚' } }),
    db.category.upsert({ where: { slug: 'hospitality-tourism' }, update: {}, create: { name: 'Hospitality & Tourism', slug: 'hospitality-tourism', description: 'Hotels, restaurants, travel and tourism', icon: '🏨' } }),
    db.category.upsert({ where: { slug: 'legal-compliance' }, update: {}, create: { name: 'Legal & Compliance', slug: 'legal-compliance', description: 'Legal counsel, compliance, corporate law and governance', icon: '⚖️' } }),
    db.category.upsert({ where: { slug: 'government-public' }, update: {}, create: { name: 'Government & Public', slug: 'government-public', description: 'County and national government positions', icon: '🏛️' } }),
    db.category.upsert({ where: { slug: 'creative-arts-design' }, update: {}, create: { name: 'Creative Arts & Design', slug: 'creative-arts-design', description: 'Graphic design, writing, photography and creative roles', icon: '🎨' } }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // ─── LOCATIONS ───────────────────────────────
  // Counties
  const counties = await Promise.all([
    db.location.upsert({ where: { slug: 'nairobi' }, update: {}, create: { name: 'Nairobi', slug: 'nairobi', type: 'COUNTY' } }),
    db.location.upsert({ where: { slug: 'mombasa' }, update: {}, create: { name: 'Mombasa', slug: 'mombasa', type: 'COUNTY' } }),
    db.location.upsert({ where: { slug: 'nakuru' }, update: {}, create: { name: 'Nakuru', slug: 'nakuru', type: 'COUNTY' } }),
    db.location.upsert({ where: { slug: 'kisumu' }, update: {}, create: { name: 'Kisumu', slug: 'kisumu', type: 'COUNTY' } }),
    db.location.upsert({ where: { slug: 'eldoret' }, update: {}, create: { name: 'Eldoret', slug: 'eldoret', type: 'COUNTY' } }),
    db.location.upsert({ where: { slug: 'naivasha' }, update: {}, create: { name: 'Naivasha', slug: 'naivasha', type: 'COUNTY' } }),
  ]);
  // Areas within Nairobi
  const areas = await Promise.all([
    db.location.upsert({ where: { slug: 'cbd' }, update: {}, create: { name: 'CBD', slug: 'cbd', type: 'AREA', parentLocationId: counties[0].id } }),
    db.location.upsert({ where: { slug: 'westlands' }, update: {}, create: { name: 'Westlands', slug: 'westlands', type: 'AREA', parentLocationId: counties[0].id } }),
    db.location.upsert({ where: { slug: 'kilimani' }, update: {}, create: { name: 'Kilimani', slug: 'kilimani', type: 'AREA', parentLocationId: counties[0].id } }),
    db.location.upsert({ where: { slug: 'industrial-area' }, update: {}, create: { name: 'Industrial Area', slug: 'industrial-area', type: 'AREA', parentLocationId: counties[0].id } }),
    db.location.upsert({ where: { slug: 'thika-rd' }, update: {}, create: { name: 'Thika Rd', slug: 'thika-rd', type: 'AREA', parentLocationId: counties[0].id } }),
    db.location.upsert({ where: { slug: 'remote' }, update: {}, create: { name: 'Remote', slug: 'remote', type: 'REMOTE' } }),
  ]);
  console.log(`✅ Created ${counties.length} counties and ${areas.length} areas`);

  // ─── COMPANIES ──────────────────────────────
  const techCat = categories.find(c => c.slug === 'technology-it')!;
  const financeCat = categories.find(c => c.slug === 'finance-accounting')!;
  const marketingCat = categories.find(c => c.slug === 'marketing-comms')!;
  const govCat = categories.find(c => c.slug === 'government-public')!;
  const engCat = categories.find(c => c.slug === 'engineering')!;
  const healthCat = categories.find(c => c.slug === 'healthcare-medical')!;
  const eduCat = categories.find(c => c.slug === 'education-training')!;
  const opsCat = categories.find(c => c.slug === 'operations-admin')!;
  const salesCat = categories.find(c => c.slug === 'sales-business-dev')!;
  const hospitalityCat = categories.find(c => c.slug === 'hospitality-tourism')!;
  const logisticsCat = categories.find(c => c.slug === 'logistics-supply-chain')!;

  const nairobiLoc = counties[0];
  const mombasaLoc = counties[1];
  const nakuruLoc = counties[2];
  const remoteLoc = areas.find(a => a.slug === 'remote')!;
  const nationwideLoc = await db.location.upsert({ where: { slug: 'nationwide' }, update: {}, create: { name: 'Nationwide', slug: 'nationwide', type: 'COUNTY' } });

  const companies = await Promise.all([
    db.company.upsert({ where: { slug: 'safaricom' }, update: {}, create: { name: 'Safaricom', slug: 'safaricom', description: 'Leading telecommunications provider in Kenya', industry: 'Telecommunications', employeeCount: '5000+', hqLocation: 'Nairobi', isVerified: true } }),
    db.company.upsert({ where: { slug: 'kcb-bank' }, update: {}, create: { name: 'KCB Bank', slug: 'kcb-bank', description: 'Kenya Commercial Bank Group', industry: 'Banking', employeeCount: '5000+', hqLocation: 'Nairobi', isVerified: true } }),
    db.company.upsert({ where: { slug: 'ncba-group' }, update: {}, create: { name: 'NCBA Group', slug: 'ncba-group', description: 'NCBA Group is a financial services provider', industry: 'Banking', employeeCount: '1000-5000', hqLocation: 'Nairobi', isVerified: true } }),
    db.company.upsert({ where: { slug: 'equity-bank' }, update: {}, create: { name: 'Equity Bank', slug: 'equity-bank', description: 'Equity Group Holdings PLC', industry: 'Banking', employeeCount: '5000+', hqLocation: 'Nairobi', isVerified: true } }),
    db.company.upsert({ where: { slug: 'eabl' }, update: {}, create: { name: 'EABL', slug: 'eabl', description: 'East African Breweries Limited', industry: 'Manufacturing', employeeCount: '1000-5000', hqLocation: 'Nairobi', isVerified: true } }),
    db.company.upsert({ where: { slug: 'kra' }, update: {}, create: { name: 'KRA', slug: 'kra', description: 'Kenya Revenue Authority', industry: 'Government', employeeCount: '5000+', hqLocation: 'Nairobi', isVerified: true, isGovernment: true } }),
    db.company.upsert({ where: { slug: 'kenha' }, update: {}, create: { name: 'KeNHA', slug: 'kenha', description: 'Kenya National Highways Authority', industry: 'Government', employeeCount: '1000-5000', hqLocation: 'Nairobi', isVerified: true, isGovernment: true } }),
    db.company.upsert({ where: { slug: 'co-operative-bank' }, update: {}, create: { name: 'Co-operative Bank', slug: 'co-operative-bank', description: 'Co-operative Bank of Kenya', industry: 'Banking', employeeCount: '1000-5000', hqLocation: 'Nairobi', isVerified: true } }),
    db.company.upsert({ where: { slug: 'kenya-police' }, update: {}, create: { name: 'Kenya Police Service', slug: 'kenya-police', description: 'National Police Service of Kenya', industry: 'Government', employeeCount: '100000+', hqLocation: 'Nairobi', isVerified: true, isGovernment: true } }),
    db.company.upsert({ where: { slug: 'tsc' }, update: {}, create: { name: 'Teachers Service Commission', slug: 'tsc', description: 'TSC — responsible for teacher management', industry: 'Government', employeeCount: '10000+', hqLocation: 'Nairobi', isVerified: true, isGovernment: true } }),
    db.company.upsert({ where: { slug: 'nakuru-county' }, update: {}, create: { name: 'Nakuru County Government', slug: 'nakuru-county', description: 'County Government of Nakuru', industry: 'Government', hqLocation: 'Nakuru', isVerified: true, isGovernment: true } }),
    db.company.upsert({ where: { slug: 'nairobi-county' }, update: {}, create: { name: 'Nairobi County Government', slug: 'nairobi-county', description: 'County Government of Nairobi', industry: 'Government', hqLocation: 'Nairobi', isVerified: true, isGovernment: true } }),
    db.company.upsert({ where: { slug: 'mombasa-county' }, update: {}, create: { name: 'Mombasa County Government', slug: 'mombasa-county', description: 'County Government of Mombasa', industry: 'Government', hqLocation: 'Mombasa', isVerified: true, isGovernment: true } }),
    db.company.upsert({ where: { slug: 'university-of-nairobi' }, update: {}, create: { name: 'University of Nairobi', slug: 'university-of-nairobi', description: "Kenya's premier university", industry: 'Education', employeeCount: '5000+', hqLocation: 'Nairobi', isVerified: true } }),
    db.company.upsert({ where: { slug: 'kcb-foundation' }, update: {}, create: { name: 'KCB Foundation', slug: 'kcb-foundation', description: 'KCB Group corporate social responsibility arm', industry: 'NGO', hqLocation: 'Nairobi', isVerified: true } }),
  ]);
  console.log(`✅ Created ${companies.length} companies`);

  // ─── TAGS ───────────────────────────────────
  const tagNames = ['Python', 'JavaScript', 'React', 'Node.js', 'Java', 'Accounting', 'CPA', 'IFRS', 'Marketing', 'Digital Marketing', 'SEO', 'Social Media', 'Internship', 'Remote', 'Government', 'Gazette', 'Graduate', 'Entry Level', 'Full-time', 'Banking', 'Fintech', 'Mobile', 'Data', 'Analytics', 'Engineering', 'Infrastructure', 'Construction', 'Teaching', 'Health', 'Hospitality', 'Casual', 'Warehouse', 'Delivery'];
  const tagRecords: { id: string; name: string; slug: string }[] = [];
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tag = await db.tag.upsert({ where: { slug }, update: {}, create: { name, slug } });
    tagRecords.push({ id: tag.id, name: tag.name, slug: tag.slug });
  }
  console.log(`✅ Created ${tagRecords.length} tags`);

  // ─── JOBS ────────────────────────────────────
  function getTagIds(names: string[]): string[] {
    return names.map(n => tagRecords.find(t => t.name === n)?.id).filter(Boolean) as string[];
  }

  async function createJob(data: {
    title: string; slug: string; companyId: string; categoryId: string; locationId: string;
    type?: string; level?: string; description: string; requirements: string[];
    salaryMin?: number; salaryMax?: number; isRemote?: boolean; isFeatured?: boolean;
    isUrgent?: boolean; isGovernment?: boolean; isGazette?: boolean; isCasual?: boolean;
    casualRate?: string; casualNote?: string; deadlineAt?: Date;
    tags: string[];
  }) {
    const job = await db.job.create({
      data: {
        title: data.title,
        slug: data.slug,
        companyId: data.companyId,
        categoryId: data.categoryId,
        locationId: data.locationId,
        type: data.type || 'Full-time',
        level: data.level || 'Entry Level',
        description: data.description,
        requirements: JSON.stringify(data.requirements),
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        isRemote: data.isRemote || false,
        isFeatured: data.isFeatured || false,
        isUrgent: data.isUrgent || false,
        isGovernment: data.isGovernment || false,
        isGazette: data.isGazette || false,
        isCasual: data.isCasual || false,
        casualRate: data.casualRate,
        casualNote: data.casualNote,
        deadlineAt: data.deadlineAt,
      },
    });

    // Link tags
    const tagIds = getTagIds(data.tags);
    for (const tagId of tagIds) {
      await db.jobTag.create({ data: { jobId: job.id, tagId } });
    }

    return job;
  }

  const safaricom = companies.find(c => c.slug === 'safaricom')!;
  const kcb = companies.find(c => c.slug === 'kcb-bank')!;
  const ncba = companies.find(c => c.slug === 'ncba-group')!;
  const equity = companies.find(c => c.slug === 'equity-bank')!;
  const eabl = companies.find(c => c.slug === 'eabl')!;
  const kra = companies.find(c => c.slug === 'kra')!;
  const kenha = companies.find(c => c.slug === 'kenha')!;
  const coop = companies.find(c => c.slug === 'co-operative-bank')!;
  const police = companies.find(c => c.slug === 'kenya-police')!;
  const tsc = companies.find(c => c.slug === 'tsc')!;
  const nakuruCo = companies.find(c => c.slug === 'nakuru-county')!;
  const nairobiCo = companies.find(c => c.slug === 'nairobi-county')!;
  const mombasaCo = companies.find(c => c.slug === 'mombasa-county')!;
  const uon = companies.find(c => c.slug === 'university-of-nairobi')!;
  const kcbFdn = companies.find(c => c.slug === 'kcb-foundation')!;

  await createJob({
    title: 'Senior Product Manager — M-Pesa',
    slug: 'senior-pm-mpesa-safaricom',
    companyId: safaricom.id, categoryId: techCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Senior', isFeatured: true,
    salaryMin: 350000, salaryMax: 500000,
    description: 'Lead product strategy for 30M+ active users across East Africa. Work with a cross-functional team of 12+ engineers and designers.',
    requirements: ['8+ years of product management experience', 'Experience with fintech or mobile payments', 'Strong analytical and data-driven decision making', 'MBA or equivalent preferred', 'Experience leading cross-functional teams of 10+'],
    tags: ['Product', 'Fintech', 'Mobile', 'Graduate'],
  });

  await createJob({
    title: 'Senior Accountant',
    slug: 'senior-accountant-safaricom',
    companyId: safaricom.id, categoryId: financeCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Senior',
    salaryMin: 180000, salaryMax: 250000,
    deadlineAt: new Date('2025-02-15'),
    description: 'Responsible for financial reporting, budgeting, and ensuring compliance with IFRS standards.',
    requirements: ['CPA(K) or ACCA qualification', "Bachelor's degree in Accounting or Finance", '5+ years of accounting experience', 'Strong knowledge of IFRS and Kenyan tax regulations', 'Proficiency in ERP systems (SAP preferred)'],
    tags: ['Accounting', 'CPA', 'IFRS', 'Banking'],
  });

  await createJob({
    title: 'Customer Service Representative',
    slug: 'customer-service-safaricom',
    companyId: safaricom.id, categoryId: salesCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level',
    salaryMin: 35000, salaryMax: 50000,
    description: 'Handle customer inquiries, resolve complaints, and provide information about products and services.',
    requirements: ['Diploma or degree in any field', 'Excellent communication skills in English and Kiswahili', 'Previous customer service experience preferred', 'Computer literacy', 'Ability to work in shifts'],
    tags: ['Entry Level', 'Full-time'],
  });

  await createJob({
    title: 'Software Engineering Intern',
    slug: 'software-intern-safaricom',
    companyId: safaricom.id, categoryId: techCat.id, locationId: nairobiLoc.id,
    type: 'Internship', level: 'Intern',
    salaryMin: 25000, salaryMax: 40000,
    description: "6-month Software Engineering Internship offers hands-on experience building mobile and web applications used by millions.",
    requirements: ["Pursuing or completed a degree in Computer Science", 'Knowledge of at least one programming language', 'Understanding of web or mobile development', 'Strong problem-solving abilities', 'Available for 6 months'],
    tags: ['Internship', 'Mobile', 'Remote'],
  });

  await createJob({
    title: 'Backend Developer',
    slug: 'backend-developer-kcb',
    companyId: kcb.id, categoryId: techCat.id, locationId: remoteLoc.id,
    type: 'Full-time', level: 'Mid Level', isRemote: true,
    salaryMin: 150000, salaryMax: 220000,
    deadlineAt: new Date('2025-02-20'),
    description: 'Build and maintain robust APIs and microservices that power our digital banking platform.',
    requirements: ["Bachelor's degree in Computer Science", '3+ years experience with Node.js, Python, or Java', 'Strong knowledge of RESTful APIs and microservices', 'Experience with cloud platforms (AWS/Azure)', 'Knowledge of database systems (PostgreSQL, MongoDB)'],
    tags: ['Python', 'Node.js', 'Remote', 'Fintech'],
  });

  await createJob({
    title: 'Software Engineer',
    slug: 'software-engineer-kcb',
    companyId: kcb.id, categoryId: techCat.id, locationId: remoteLoc.id,
    type: 'Full-time', level: 'Mid Level', isRemote: true,
    salaryMin: 140000, salaryMax: 200000,
    description: 'Develop full-stack applications using modern frameworks and participate in code reviews.',
    requirements: ["Bachelor's degree in Computer Science", '3+ years of software development experience', 'Proficiency in React/Next.js and Node.js', 'Experience with CI/CD pipelines', 'Understanding of banking or fintech systems'],
    tags: ['React', 'JavaScript', 'Node.js', 'Remote'],
  });

  await createJob({
    title: 'Junior Developer',
    slug: 'junior-developer-kcb',
    companyId: kcb.id, categoryId: techCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level',
    salaryMin: 70000, salaryMax: 100000,
    deadlineAt: new Date('2025-02-25'),
    description: 'Work on exciting projects including mobile banking apps, internal tools, and customer-facing platforms.',
    requirements: ["Bachelor's degree in Computer Science", '0-1 year of development experience', 'Basic knowledge of any programming language', 'Eager to learn in a fast-paced environment'],
    tags: ['Entry Level', 'JavaScript', 'Graduate'],
  });

  await createJob({
    title: 'Marketing Intern',
    slug: 'marketing-intern-ncba',
    companyId: ncba.id, categoryId: marketingCat.id, locationId: nairobiLoc.id,
    type: 'Internship', level: 'Intern', isUrgent: true,
    salaryMin: 25000, salaryMax: 35000,
    deadlineAt: new Date('2025-02-05'),
    description: '6-month internship in our Marketing department. Gain hands-on experience in digital marketing and brand management.',
    requirements: ["Bachelor's degree in Marketing or Communications", 'Strong written and verbal communication skills', 'Familiarity with social media platforms', 'Creative mindset with attention to detail'],
    tags: ['Internship', 'Digital Marketing', 'Social Media'],
  });

  await createJob({
    title: 'Graduate Trainee',
    slug: 'graduate-trainee-ncba',
    companyId: ncba.id, categoryId: financeCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level',
    salaryMin: 60000, salaryMax: 80000,
    description: "12-month rotational program designed to develop future leaders across different departments.",
    requirements: ["Bachelor's degree with Second Class Upper", 'Graduated within the last 2 years', 'Strong leadership potential', 'Flexibility to rotate across departments'],
    tags: ['Graduate', 'Banking', 'Entry Level'],
  });

  await createJob({
    title: 'Financial Analyst',
    slug: 'financial-analyst-equity',
    companyId: equity.id, categoryId: financeCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level', isFeatured: true,
    salaryMin: 80000, salaryMax: 120000,
    description: 'Responsible for financial modeling, investment analysis reports, and strategic decision-making support.',
    requirements: ["Bachelor's degree in Finance or Economics", 'CFA Level 1 or higher preferred', '1-2 years of financial analysis experience', 'Advanced Excel and financial modeling skills'],
    tags: ['Accounting', 'Entry Level', 'Banking'],
  });

  await createJob({
    title: 'HR Manager',
    slug: 'hr-manager-equity',
    companyId: equity.id, categoryId: categories.find(c => c.slug === 'human-resources')!.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Senior',
    salaryMin: 200000, salaryMax: 300000,
    deadlineAt: new Date('2025-02-10'),
    description: 'Lead HR operations including recruitment, employee relations, performance management, and training.',
    requirements: ["Bachelor's degree in Human Resources", '7+ years of HR management experience', 'Professional HR certification (CHRP or equivalent)', 'Strong knowledge of Kenyan labor laws'],
    tags: ['Full-time', 'Graduate'],
  });

  await createJob({
    title: 'Finance Intern',
    slug: 'finance-intern-equity',
    companyId: equity.id, categoryId: financeCat.id, locationId: nairobiLoc.id,
    type: 'Internship', level: 'Intern',
    salaryMin: 20000, salaryMax: 30000,
    description: '3-month Finance Internship with exposure to financial analysis, budgeting, and reporting.',
    requirements: ["Pursuing or completed a degree in Finance/Accounting", 'Strong analytical skills', 'Proficiency in Excel', 'Available for 3 months'],
    tags: ['Internship', 'Accounting', 'Banking'],
  });

  await createJob({
    title: 'Data Analyst',
    slug: 'data-analyst-kra',
    companyId: kra.id, categoryId: techCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Mid Level', isGovernment: true,
    salaryMin: 100000, salaryMax: 160000,
    deadlineAt: new Date('2025-02-20'),
    description: 'Analyze tax compliance data, identify trends, and provide actionable insights for revenue collection strategies.',
    requirements: ["Bachelor's degree in Statistics or Data Science", '3+ years of data analysis experience', 'Proficiency in SQL, Python, and data visualization', 'Experience with statistical modeling'],
    tags: ['Data', 'Analytics', 'Government'],
  });

  await createJob({
    title: 'KRA Graduate Trainee Program 2025',
    slug: 'kra-graduate-trainee-2025',
    companyId: kra.id, categoryId: govCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level', isGovernment: true, isGazette: true,
    salaryMin: 70000, salaryMax: 90000,
    deadlineAt: new Date('2025-02-15'),
    description: 'Prestigious 18-month program developing the next generation of tax administration professionals.',
    requirements: ["Bachelor's degree with Second Class Upper", 'Graduated within the last 2 years', 'Age limit: 28 years and below', 'Must be a Kenyan citizen'],
    tags: ['Graduate', 'Government', 'Gazette'],
  });

  await createJob({
    title: 'Data Entry Clerk',
    slug: 'data-entry-clerk-kra',
    companyId: kra.id, categoryId: opsCat.id, locationId: nairobiLoc.id,
    type: 'Contract', level: 'Entry Level', isGovernment: true,
    salaryMin: 25000, salaryMax: 35000,
    description: '6-month contract to support digitization of tax records. Accurately input, verify, and maintain data.',
    requirements: ['Diploma in IT or Business Administration', 'Typing speed of 40+ WPM', 'Proficiency in Microsoft Office', 'High attention to detail'],
    tags: ['Government', 'Entry Level'],
  });

  await createJob({
    title: 'Civil Engineer',
    slug: 'civil-engineer-kenha',
    companyId: kenha.id, categoryId: engCat.id, locationId: nakuruLoc.id,
    type: 'Full-time', level: 'Mid Level',
    salaryMin: 120000, salaryMax: 180000,
    description: 'Oversee road construction and maintenance projects in the Nakuru region.',
    requirements: ["Bachelor's degree in Civil Engineering", 'Registered with Engineers Board of Kenya (EBK)', '5+ years experience in road construction', 'Strong project management skills'],
    tags: ['Engineering', 'Infrastructure', 'Construction'],
  });

  await createJob({
    title: 'TSC — 5,000 Teacher Posts',
    slug: 'tsc-5000-teacher-posts',
    companyId: tsc.id, categoryId: eduCat.id, locationId: nationwideLoc.id,
    type: 'Full-time', level: 'Entry Level', isGovernment: true,
    salaryMin: 30000, salaryMax: 50000,
    deadlineAt: new Date('2025-02-28'),
    description: 'Recruiting 5,000 teachers for primary and secondary schools across all 47 counties.',
    requirements: ['Diploma or Degree in Education', 'Registered with TSC', 'Must have valid TSC certificate', 'Willing to be posted to any county'],
    tags: ['Teaching', 'Government', 'Graduate'],
  });

  await createJob({
    title: 'Kenya Police Constable Recruitment',
    slug: 'police-constable-recruitment',
    companyId: police.id, categoryId: govCat.id, locationId: nationwideLoc.id,
    type: 'Full-time', level: 'Entry Level', isGovernment: true, isGazette: true,
    salaryMin: 35000, salaryMax: 45000,
    deadlineAt: new Date('2025-03-10'),
    description: 'Recruiting police constables. Successful candidates undergo a 9-month training program.',
    requirements: ['Kenyan citizen aged 18-28 years', 'Minimum KCSE grade D+', 'Must be physically fit', 'No criminal record'],
    tags: ['Government', 'Gazette'],
  });

  await createJob({
    title: 'Various Positions — Nakuru County',
    slug: 'nakuru-county-various',
    companyId: nakuruCo.id, categoryId: govCat.id, locationId: nakuruLoc.id,
    type: 'Full-time', level: 'Entry Level', isGovernment: true,
    salaryMin: 30000, salaryMax: 60000,
    deadlineAt: new Date('2025-02-20'),
    description: 'Multiple openings across Health, Education, Public Works, and Administration departments.',
    requirements: ['Relevant diploma or degree', 'Must be a resident of Nakuru County (where applicable)', 'Valid certificates', 'Computer literacy'],
    tags: ['Government'],
  });

  await createJob({
    title: 'Health Workers — Nairobi County',
    slug: 'health-workers-nairobi-county',
    companyId: nairobiCo.id, categoryId: healthCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level', isGovernment: true,
    salaryMin: 40000, salaryMax: 80000,
    deadlineAt: new Date('2025-02-25'),
    description: 'Recruiting nurses, clinical officers, and public health officers for county health facilities.',
    requirements: ['Valid professional license', 'Diploma or degree in relevant health field', 'Experience in a clinical setting preferred', 'Willingness to work in shifts'],
    tags: ['Health', 'Government'],
  });

  await createJob({
    title: 'Engineers — Mombasa County',
    slug: 'engineers-mombasa-county',
    companyId: mombasaCo.id, categoryId: engCat.id, locationId: mombasaLoc.id,
    type: 'Full-time', level: 'Mid Level', isGovernment: true,
    salaryMin: 80000, salaryMax: 150000,
    deadlineAt: new Date('2025-03-05'),
    description: 'Civil, Electrical, and Mechanical Engineers needed for infrastructure projects.',
    requirements: ["Bachelor's degree in relevant engineering field", 'Registered with Engineers Board of Kenya', '3+ years of relevant experience', 'Project management skills'],
    tags: ['Engineering', 'Government', 'Infrastructure'],
  });

  await createJob({
    title: 'Junior Accountant',
    slug: 'junior-accountant-coop',
    companyId: coop.id, categoryId: financeCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level',
    salaryMin: 60000, salaryMax: 90000,
    description: 'Support the Finance team with bookkeeping, financial reporting, and tax returns.',
    requirements: ["Bachelor's degree in Accounting", 'CPA Section 2 and above', '0-1 year accounting experience', 'Proficiency in Microsoft Excel'],
    tags: ['Accounting', 'Entry Level', 'Banking'],
  });

  await createJob({
    title: 'Marketing Assistant',
    slug: 'marketing-assistant-eabl',
    companyId: eabl.id, categoryId: marketingCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Entry Level',
    salaryMin: 45000, salaryMax: 65000,
    description: 'Support our brand management team with marketing campaigns, social media, and market research.',
    requirements: ["Bachelor's degree in Marketing", '1 year of marketing experience preferred', 'Creative with strong organizational skills', 'Social media savvy'],
    tags: ['Marketing', 'Digital Marketing', 'Entry Level'],
  });

  await createJob({
    title: 'Marketing Intern',
    slug: 'marketing-intern-eabl',
    companyId: eabl.id, categoryId: marketingCat.id, locationId: nairobiLoc.id,
    type: 'Internship', level: 'Intern',
    salaryMin: 25000, salaryMax: 35000,
    description: "Structured internship program in the Marketing department at East Africa's largest FMCG company.",
    requirements: ["Pursuing or completed a degree in Marketing", 'Creative mindset', 'Strong communication skills', 'Available for 3-6 months'],
    tags: ['Internship', 'Social Media', 'Marketing'],
  });

  await createJob({
    title: 'Mastercard Foundation Scholars',
    slug: 'mastercard-foundation-scholars',
    companyId: uon.id, categoryId: eduCat.id, locationId: nairobiLoc.id,
    type: 'Full-time', level: 'Any', isFeatured: true,
    description: 'Full scholarships for academically talented yet economically disadvantaged young Africans. Covers tuition, accommodation, books, and stipend.',
    requirements: ['Strong academic performance', 'Demonstrated financial need', 'Leadership potential', 'Under 30 years of age', 'Commitment to giving back'],
    tags: ['Graduate', 'Government'],
  });

  await createJob({
    title: 'KCB Foundation Scholarship',
    slug: 'kcb-foundation-scholarship',
    companyId: kcbFdn.id, categoryId: eduCat.id, locationId: nationwideLoc.id,
    type: 'Full-time', level: 'Any',
    deadlineAt: new Date('2025-03-15'),
    description: 'Supports students from disadvantaged backgrounds pursuing tertiary education in Kenya. Covers tuition fees and provides a monthly stipend.',
    requirements: ['Kenyan citizen from economically disadvantaged background', 'Admitted to a recognized Kenyan university', 'Strong academic record', 'Not older than 25 years'],
    tags: ['Graduate'],
  });

  // ─── CASUAL JOBS ─────────────────────────────
  const cbdLoc = areas.find(a => a.slug === 'cbd')!;
  const westlandsLoc = areas.find(a => a.slug === 'westlands')!;
  const kilimaniLoc = areas.find(a => a.slug === 'kilimani')!;
  const industrialLoc = areas.find(a => a.slug === 'industrial-area')!;
  const thikaRdLoc = areas.find(a => a.slug === 'thika-rd')!;
  const naivashaLoc = counties.find(c => c.slug === 'naivasha')!;
  const variousCo = await db.company.upsert({ where: { slug: 'various-employers' }, update: {}, create: { name: 'Various', slug: 'various-employers', description: 'Multiple employers' } });

  await createJob({
    title: 'Waitstaff', slug: 'waitstaff-westlands',
    companyId: variousCo.id, categoryId: hospitalityCat.id, locationId: westlandsLoc.id,
    type: 'Casual', level: 'Any', isCasual: true, casualRate: 'Ksh 500/day', casualNote: 'Immediate',
    description: 'Immediate opening for waitstaff at a busy restaurant in Westlands. No experience needed.',
    requirements: ['No experience required', 'Must be 18+', 'Good customer service attitude', 'Neat appearance'],
    tags: ['Casual', 'Hospitality'],
  });

  await createJob({
    title: 'Delivery Rider', slug: 'delivery-rider-cbd',
    companyId: variousCo.id, categoryId: logisticsCat.id, locationId: cbdLoc.id,
    type: 'Casual', level: 'Any', isCasual: true, casualRate: 'Ksh 1,200/day', casualNote: 'Own bike required',
    description: 'Delivery riders needed for a growing logistics company in Nairobi CBD. Must own a motorcycle.',
    requirements: ['Must own a motorcycle', 'Valid riding license', 'Smartphone for navigation', '18+ years old'],
    tags: ['Casual', 'Delivery'],
  });

  await createJob({
    title: 'Farm Worker', slug: 'farm-worker-naivasha',
    companyId: variousCo.id, categoryId: hospitalityCat.id, locationId: naivashaLoc.id,
    type: 'Casual', level: 'Any', isCasual: true, casualRate: 'Ksh 700/day', casualNote: 'Accommodation provided',
    description: 'Farm workers needed at a flower farm in Naivasha. Accommodation and meals provided on-site.',
    requirements: ['No experience required', 'Physically fit', 'Willing to live on-site', '18+ years old'],
    tags: ['Casual', 'Hospitality'],
  });

  await createJob({
    title: 'Shop Assistant', slug: 'shop-assistant-thika-rd',
    companyId: variousCo.id, categoryId: salesCat.id, locationId: thikaRdLoc.id,
    type: 'Part-time', level: 'Entry Level', isCasual: true, casualRate: 'Ksh 15k/mo', casualNote: 'Part-time',
    description: 'Part-time shop assistant at a retail store along Thika Road. 3-4 days per week.',
    requirements: ['Basic computer literacy', 'Good customer service skills', 'Honest and reliable', 'Available on weekends'],
    tags: ['Casual', 'Entry Level'],
  });

  await createJob({
    title: 'Cleaning Staff', slug: 'cleaning-staff-kilimani',
    companyId: variousCo.id, categoryId: opsCat.id, locationId: kilimaniLoc.id,
    type: 'Casual', level: 'Any', isCasual: true, casualRate: 'Ksh 600/day', casualNote: 'Weekends only',
    description: 'Weekend cleaning staff for office spaces in Kilimani. Saturdays and Sundays 8am-2pm.',
    requirements: ['No experience required', 'Physically able', 'Punctual and reliable', 'Available on weekends'],
    tags: ['Casual'],
  });

  await createJob({
    title: 'Loader', slug: 'loader-industrial-area',
    companyId: variousCo.id, categoryId: logisticsCat.id, locationId: industrialLoc.id,
    type: 'Casual', level: 'Any', isCasual: true, casualRate: 'Ksh 800/day', casualNote: 'Morning shift',
    description: 'Loaders needed at a warehouse in Industrial Area for the morning shift (6am-2pm).',
    requirements: ['Physically strong and fit', 'No experience required', 'Punctual for morning shifts', '18+ years old'],
    tags: ['Casual', 'Warehouse'],
  });

  const jobCount = await db.job.count();
  console.log(`✅ Created ${jobCount} jobs`);

  // ─── JOB UPDATES ─────────────────────────────
  const kraTrainee = await db.job.findFirst({ where: { slug: 'kra-graduate-trainee-2025' } });
  const equityGrad = await db.job.findFirst({ where: { slug: 'finance-intern-equity' } });
  const safaricomPM = await db.job.findFirst({ where: { slug: 'senior-pm-mpesa-safaricom' } });
  const ncbaIntern = await db.job.findFirst({ where: { slug: 'marketing-intern-ncba' } });
  const tscPosts = await db.job.findFirst({ where: { slug: 'tsc-5000-teacher-posts' } });
  const kcbBackend = await db.job.findFirst({ where: { slug: 'backend-developer-kcb' } });

  if (kraTrainee) {
    await db.jobUpdate.create({ data: { content: '42 candidates shortlisted — KRA Graduate Trainee', isActive: true, jobId: kraTrainee.id } });
  }
  if (equityGrad) {
    await db.jobUpdate.create({ data: { content: 'Interview invites sent — Equity Graduate Program', isActive: true, jobId: equityGrad.id } });
  }
  if (safaricomPM) {
    await db.jobUpdate.create({ data: { content: 'Safaricom Senior PM applications now closed', isActive: false, jobId: safaricomPM.id } });
  }
  if (ncbaIntern) {
    await db.jobUpdate.create({ data: { content: 'NCBA extends Marketing Intern deadline to Feb 20', isActive: true, jobId: ncbaIntern.id } });
  }
  if (tscPosts) {
    await db.jobUpdate.create({ data: { content: 'TSC internship postings for Q2 2025 now open', isActive: true, jobId: tscPosts.id } });
  }
  if (kcbBackend) {
    await db.jobUpdate.create({ data: { content: 'KCB final round interviews scheduled for next week', isActive: false, jobId: kcbBackend.id } });
  }
  console.log('✅ Created job updates');

  // ─── ARTICLES ───────────────────────────────
  await Promise.all([
    db.article.upsert({ where: { slug: 'how-to-pass-kra-assessment' }, update: {}, create: {
      title: 'How to Pass the KRA Graduate Trainee Assessment',
      slug: 'how-to-pass-kra-assessment',
      excerpt: 'A complete guide to the KRA recruitment process, including sample questions and tips from successful candidates.',
      content: 'Full article content here...',
      coverUrl: 'https://picsum.photos/seed/kra-career-final/800/450.jpg',
      category: 'Interview Tips',
      readTime: '6 min read',
      isPublished: true,
      publishedAt: new Date('2025-01-28'),
      viewCount: 1240,
    } }),
    db.article.upsert({ where: { slug: 'first-county-interview-tips' }, update: {}, create: {
      title: '5 Tips for Your First County Government Interview',
      slug: 'first-county-interview-tips',
      excerpt: 'Navigating your first government interview can be daunting. Here are practical tips.',
      category: 'Interview Tips',
      readTime: '3 min read',
      isPublished: true,
      publishedAt: new Date('2025-01-25'),
      viewCount: 890,
    } }),
    db.article.upsert({ where: { slug: 'salary-negotiation-kenya' }, update: {}, create: {
      title: 'Salary Negotiation in Kenya\'s Job Market',
      slug: 'salary-negotiation-kenya',
      excerpt: 'Understanding how to negotiate your salary in the Kenyan context.',
      category: 'Salary Guide',
      readTime: '5 min read',
      isPublished: true,
      publishedAt: new Date('2025-01-20'),
      viewCount: 2100,
    } }),
    db.article.upsert({ where: { slug: 'cv-mistakes-rejection' }, update: {}, create: {
      title: 'CV Mistakes That Get Your Application Rejected',
      slug: 'cv-mistakes-rejection',
      excerpt: 'Avoid these common CV mistakes that Kenyan recruiters say are instant dealbreakers.',
      category: 'CV Writing',
      readTime: '4 min read',
      isPublished: true,
      publishedAt: new Date('2025-01-15'),
      viewCount: 3400,
    } }),
    db.article.upsert({ where: { slug: 'remote-work-scams-kenya' }, update: {}, create: {
      title: 'Remote Work: Legitimate Opportunities vs. Scams',
      slug: 'remote-work-scams-kenya',
      excerpt: 'How to spot fake remote job listings and find genuine work-from-home opportunities.',
      category: 'Remote Work',
      readTime: '6 min read',
      isPublished: true,
      publishedAt: new Date('2025-01-10'),
      viewCount: 1800,
    } }),
    db.article.upsert({ where: { slug: 'internship-to-fulltime-guide' }, update: {}, create: {
      title: 'From Internship to Full-Time: A Transition Guide',
      slug: 'internship-to-fulltime-guide',
      excerpt: 'Strategies to convert your internship into a permanent position at top Kenyan companies.',
      category: 'Career Growth',
      readTime: '4 min read',
      isPublished: true,
      publishedAt: new Date('2025-01-05'),
      viewCount: 1560,
    } }),
  ]);
  console.log('✅ Created articles');

  // ─── SALARY RECORDS ─────────────────────────
  await Promise.all([
    db.salaryRecord.upsert({ where: { id: 'sal-1' }, update: {}, create: { id: 'sal-1', title: 'Software Engineer', level: 'Mid Level', location: 'Nairobi', salaryMin: 140000, salaryMax: 220000, source: 'Employer', reportCount: 45, categoryId: techCat.id } }),
    db.salaryRecord.upsert({ where: { id: 'sal-2' }, update: {}, create: { id: 'sal-2', title: 'Accountant', level: 'Senior', location: 'Nairobi', salaryMin: 150000, salaryMax: 250000, source: 'Employer', reportCount: 32, categoryId: financeCat.id } }),
    db.salaryRecord.upsert({ where: { id: 'sal-3' }, update: {}, create: { id: 'sal-3', title: 'Marketing Manager', level: 'Mid Level', location: 'Nairobi', salaryMin: 120000, salaryMax: 180000, source: 'User Report', reportCount: 28, categoryId: marketingCat.id } }),
    db.salaryRecord.upsert({ where: { id: 'sal-4' }, update: {}, create: { id: 'sal-4', title: 'Civil Engineer', level: 'Mid Level', location: 'Nairobi', salaryMin: 100000, salaryMax: 180000, source: 'Employer', reportCount: 22, categoryId: engCat.id } }),
    db.salaryRecord.upsert({ where: { id: 'sal-5' }, update: {}, create: { id: 'sal-5', title: 'Data Analyst', level: 'Mid Level', location: 'Nairobi', salaryMin: 100000, salaryMax: 160000, source: 'User Report', reportCount: 18, categoryId: techCat.id } }),
  ]);
  console.log('✅ Created salary records');

  console.log('\n🎉 Seed complete! Database is ready.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
