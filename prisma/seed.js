const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Explicitly set the DATABASE_URL to avoid system env override
process.env.DATABASE_URL = 'mysql://trustfit_jobready_database_admin:Admincyber@vda7300.is.cc:3306/trustfit_jobready_database';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Locations
  const locs = [
    {name:'Nairobi',slug:'nairobi',type:'COUNTY'},{name:'Mombasa',slug:'mombasa',type:'COUNTY'},
    {name:'Nakuru',slug:'nakuru',type:'COUNTY'},{name:'Kisumu',slug:'kisumu',type:'COUNTY'},
    {name:'Eldoret',slug:'eldoret',type:'COUNTY'},{name:'Thika',slug:'thika',type:'COUNTY'},
    {name:'Naivasha',slug:'naivasha',type:'COUNTY'},{name:'Nationwide',slug:'nationwide',type:'COUNTY'},
    {name:'CBD',slug:'nairobi-cbd',type:'AREA'},{name:'Westlands',slug:'westlands',type:'AREA'},
    {name:'Kilimani',slug:'kilimani',type:'AREA'},{name:'Industrial Area',slug:'industrial-area',type:'AREA'},
    {name:'Nyali',slug:'nyali',type:'AREA'},{name:'Changamwe',slug:'changamwe',type:'AREA'},
    {name:'Thika Rd',slug:'thika-rd',type:'AREA'},{name:'Remote',slug:'remote',type:'REMOTE'},
  ];
  const locMap = {};
  for (const l of locs) { const c = await prisma.location.create({data:l}); locMap[l.slug]=c.id; }
  console.log('Locations:', locs.length);

  // Categories
  const cats = [
    {name:'Technology & IT',slug:'technology-it',jobCount:2300},{name:'Finance & Accounting',slug:'finance-accounting',jobCount:1800},
    {name:'Sales & Business Dev',slug:'sales-business-dev',jobCount:1200},{name:'Marketing & Comms',slug:'marketing-comms',jobCount:980},
    {name:'Human Resources',slug:'human-resources',jobCount:760},{name:'Engineering',slug:'engineering',jobCount:690},
    {name:'Healthcare & Medical',slug:'healthcare-medical',jobCount:540},{name:'Education & Training',slug:'education-training',jobCount:480},
    {name:'Operations & Admin',slug:'operations-admin',jobCount:420},{name:'Logistics & Supply Chain',slug:'logistics-supply-chain',jobCount:310},
    {name:'Hospitality & Tourism',slug:'hospitality-tourism',jobCount:240},{name:'Legal & Compliance',slug:'legal-compliance',jobCount:210},
    {name:'Creative Arts & Design',slug:'creative-arts-design',jobCount:190},{name:'Government & Public',slug:'government-public',jobCount:180},
  ];
  const catMap = {};
  for (const c of cats) { const r = await prisma.category.create({data:c}); catMap[c.slug]=r.id; }
  console.log('Categories:', cats.length);

  // Companies
  const cos = [
    {name:'Safaricom',slug:'safaricom',industry:'Telecommunications',isVerified:true},
    {name:'KCB Bank',slug:'kcb-bank',industry:'Banking',isVerified:true},
    {name:'Equity Bank',slug:'equity-bank',industry:'Banking',isVerified:true},
    {name:'NCBA Group',slug:'ncba-group',industry:'Banking',isVerified:true},
    {name:'Co-operative Bank',slug:'co-operative-bank',industry:'Banking',isVerified:true},
    {name:'KRA',slug:'kra',industry:'Government',isVerified:true,isGovernment:true},
    {name:'EABL',slug:'eabl',industry:'FMCG',isVerified:true},
    {name:'KeNHA',slug:'kenha',industry:'Government',isVerified:true,isGovernment:true},
    {name:'Teachers Service Commission',slug:'tsc',industry:'Government',isVerified:true,isGovernment:true},
    {name:'Kenya Police Service',slug:'kenya-police',industry:'Government',isVerified:true,isGovernment:true},
    {name:'Nakuru County Government',slug:'nakuru-county',industry:'Government',isGovernment:true},
    {name:'Nairobi County Government',slug:'nairobi-county',industry:'Government',isGovernment:true},
    {name:'Mombasa County Government',slug:'mombasa-county',industry:'Government',isGovernment:true},
    {name:'University of Nairobi',slug:'university-of-nairobi',industry:'Education',isVerified:true},
    {name:'KCB Group',slug:'kcb-group',industry:'Finance',isVerified:true},
    {name:'Various',slug:'various',industry:'Various',isVerified:false},
  ];
  const coMap = {};
  for (const c of cos) { const r = await prisma.company.create({data:c}); coMap[c.slug]=r.id; }
  console.log('Companies:', cos.length);

  // Tags
  const allTags = new Set();
  const jobs = [
    {t:'Senior Accountant',s:'senior-accountant-safaricom',cs:'safaricom',cat:'finance-accounting',loc:'nairobi',type:'Full-time',lv:'Senior',d:'Join Safaricom Finance team. IFRS compliance, financial reporting, budgeting. Cross-functional collaboration.',r:['CPA(K) or ACCA','BSc Accounting/Finance','5+ years exp','IFRS knowledge','SAP preferred'],sMin:180000,sMax:250000,tg:['Accounting','Finance','CPA','IFRS'],p:Date.now()-120000,dl:Date.now()+172800000,u:false,g:false,rem:false},
    {t:'Backend Developer',s:'backend-developer-kcb',cs:'kcb-bank',cat:'technology-it',loc:'remote',type:'Full-time',lv:'Mid Level',d:'Build APIs and microservices for digital banking platform serving millions across East Africa.',r:['BSc Computer Science','3+ years Node.js/Python/Java','RESTful APIs','AWS/Azure experience','PostgreSQL/MongoDB'],sMin:150000,sMax:220000,tg:['Backend','API','Node.js','Python'],p:Date.now()-300000,dl:Date.now()+432000000,u:false,g:false,rem:true},
    {t:'Marketing Intern',s:'marketing-intern-ncba',cs:'ncba-group',cat:'marketing-comms',loc:'nairobi',type:'Internship',lv:'Intern',d:'6-month internship in Marketing. Digital marketing, brand management, content creation, market research.',r:['BSc Marketing/Comms','Strong communication','Social media tools','Creative mindset','Available 6 months'],sMin:25000,sMax:35000,tg:['Marketing','Internship','Digital Marketing'],p:Date.now()-480000,dl:Date.now()+86400000,u:true,g:false,rem:false},
    {t:'Civil Engineer',s:'civil-engineer-kenha',cs:'kenha',cat:'engineering',loc:'nakuru',type:'Full-time',lv:'Mid Level',d:'Oversee road construction and maintenance projects. Site inspections, compliance with engineering standards.',r:['BSc Civil Engineering','EBK registered','5+ years road construction','Project management'],sMin:120000,sMax:180000,tg:['Engineering','Infrastructure','Construction'],p:Date.now()-720000,dl:null,u:false,g:true,rem:false},
    {t:'Senior Product Manager - M-Pesa',s:'senior-pm-mpesa',cs:'safaricom',cat:'technology-it',loc:'nairobi',type:'Full-time',lv:'Senior',d:'Lead product strategy for 30M+ active users across East Africa. Cross-functional team of 12+.',r:['8+ years PM experience','Fintech/mobile payments','Data-driven decision making','MBA preferred','Led teams of 10+'],sMin:350000,sMax:500000,tg:['Product','Fintech','Mobile','Leadership'],p:Date.now()-86400000,dl:null,u:false,g:false,rem:false,f:true},
    {t:'Financial Analyst',s:'financial-analyst-equity',cs:'equity-bank',cat:'finance-accounting',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'Financial modeling, investment analysis reports, strategic decision-making support.',r:['BSc Finance/Economics','CFA Level 1+','1-2 years experience','Advanced Excel','Strong presentations'],sMin:80000,sMax:120000,tg:['Finance','Analysis','Modeling'],p:Date.now()-10800000,dl:null,u:false,g:false,rem:false,f:true},
    {t:'Software Engineer',s:'software-engineer-kcb',cs:'kcb-bank',cat:'technology-it',loc:'remote',type:'Full-time',lv:'Mid Level',d:'Build innovative banking solutions. Full-stack apps, code reviews, CI/CD pipeline.',r:['BSc Computer Science','3+ years dev','React/Next.js + Node.js','CI/CD DevOps'],sMin:140000,sMax:200000,tg:['Software','Full-stack','React','Node.js'],p:Date.now()-14400000,dl:null,u:false,g:false,rem:true,f:true},
    {t:'Graduate Trainee',s:'graduate-trainee-ncba',cs:'ncba-group',cat:'finance-accounting',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'12-month rotational program across Retail Banking, Corporate Banking, Risk Management, Operations.',r:['2nd Class Upper','<2 years graduated','Leadership potential','Communication skills'],sMin:60000,sMax:80000,tg:['Graduate','Training','Leadership'],p:Date.now()-21600000,dl:null,u:false,g:false,rem:false},
    {t:'HR Manager',s:'hr-manager-equity',cs:'equity-bank',cat:'human-resources',loc:'nairobi',type:'Full-time',lv:'Senior',d:'Lead HR operations: recruitment, employee relations, performance management, training for 500+ staff.',r:['BSc HR','7+ years HR management','CHRP certified','Kenyan labor laws','HRIS systems'],sMin:200000,sMax:300000,tg:['HR','Management','People'],p:Date.now()-172800000,dl:Date.now()+259200000,u:false,g:false,rem:false},
    {t:'Junior Developer',s:'junior-developer-kcb',cs:'kcb-bank',cat:'technology-it',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'Mobile banking apps, internal tools, customer-facing platforms. Mentorship provided.',r:['BSc Computer Science','0-1 year experience','Any programming language','Problem-solving skills'],sMin:70000,sMax:100000,tg:['Junior','Developer','Entry Level'],p:Date.now()-86400000,dl:Date.now()+432000000,u:false,g:false,rem:false},
    {t:'Data Analyst',s:'data-analyst-kra',cs:'kra',cat:'finance-accounting',loc:'nairobi',type:'Full-time',lv:'Mid Level',d:'Analyze tax compliance data, identify trends, provide insights for revenue collection.',r:['BSc Statistics/Math/Data Science','3+ years analysis','SQL, Python, visualization','Statistical modeling'],sMin:100000,sMax:160000,tg:['Data','Analytics','Statistics'],p:Date.now()-172800000,dl:Date.now()+432000000,u:false,g:true,rem:false},
    {t:'KRA Graduate Trainee 2025',s:'kra-graduate-trainee-2025',cs:'kra',cat:'government-public',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'18-month prestigious program in tax policy, revenue collection, public administration.',r:['2nd Class Upper','<28 years old','Analytical skills','Kenyan citizen'],sMin:70000,sMax:90000,tg:['Graduate','Government','Tax','Gazette'],p:Date.now()-432000000,dl:null,u:false,g:true,gz:true,rem:false},
    {t:'TSC - 5,000 Teacher Posts',s:'tsc-5000-teacher-posts',cs:'tsc',cat:'education-training',loc:'nationwide',type:'Full-time',lv:'Entry Level',d:'Recruiting 5,000 teachers for primary and secondary schools across all 47 counties.',r:['Diploma/Degree Education','TSC registered','Valid TSC certificate','Willing to relocate'],sMin:30000,sMax:50000,tg:['Teaching','Government','Education'],p:Date.now()-604800000,dl:null,u:false,g:true,rem:false},
    {t:'Kenya Police Constable',s:'kenya-police-constable',cs:'kenya-police',cat:'government-public',loc:'nationwide',type:'Full-time',lv:'Entry Level',d:'Police constable recruitment. 9-month training at Kenya Police College before deployment.',r:['Kenyan citizen 18-28','KCSE D+','Physically fit','No criminal record'],sMin:35000,sMax:45000,tg:['Police','Government','Security','Gazette'],p:Date.now()-259200000,dl:null,u:false,g:true,gz:true,rem:false},
    {t:'Nakuru County Positions',s:'nakuru-county-positions',cs:'nakuru-county',cat:'government-public',loc:'nakuru',type:'Full-time',lv:'Entry Level',d:'Multiple openings across Health, Education, Public Works, and Administration departments.',r:['Relevant diploma/degree','Nakuru resident (where applicable)','Computer literacy'],sMin:30000,sMax:60000,tg:['County','Government','Multiple Roles'],p:Date.now()-345600000,dl:null,u:false,g:true,rem:false},
    {t:'Nairobi Health Workers',s:'nairobi-health-workers',cs:'nairobi-county',cat:'healthcare-medical',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'Recruiting nurses, clinical officers, and public health officers for county health facilities.',r:['Valid professional license','Diploma/degree health field','Willing to work shifts'],sMin:40000,sMax:80000,tg:['Health','County','Government'],p:Date.now()-432000000,dl:null,u:false,g:true,rem:false},
    {t:'Mombasa Engineers',s:'mombasa-engineers',cs:'mombasa-county',cat:'engineering',loc:'mombasa',type:'Full-time',lv:'Mid Level',d:'Civil, Electrical, and Mechanical Engineers for infrastructure projects.',r:['BSc Engineering','EBK registered','3+ years experience','Project management'],sMin:80000,sMax:150000,tg:['Engineering','County','Government'],p:Date.now()-518400000,dl:null,u:false,g:true,rem:false},
    {t:'Junior Accountant',s:'junior-acct-coop',cs:'co-operative-bank',cat:'finance-accounting',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'Bookkeeping, financial reporting, bank reconciliations, tax returns preparation.',r:['BSc Accounting','CPA Section 2+','0-1 year exp','Microsoft Excel'],sMin:60000,sMax:90000,tg:['Accounting','Entry Level','Banking'],p:Date.now()-259200000,dl:null,u:false,g:false,rem:false},
    {t:'Customer Service Rep',s:'cs-rep-safaricom',cs:'safaricom',cat:'sales-business-dev',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'Handle customer inquiries, resolve complaints, provide product information.',r:['Diploma/degree','English + Kiswahili','Computer literacy','Shift work'],sMin:35000,sMax:50000,tg:['Customer Service','Entry Level','Telecom'],p:Date.now()-345600000,dl:null,u:false,g:false,rem:false},
    {t:'Data Entry Clerk',s:'data-entry-kra',cs:'kra',cat:'operations-admin',loc:'nairobi',type:'Contract',lv:'Entry Level',d:'6-month contract for digitization of tax records. Data input, verification, integrity.',r:['IT/Business Admin diploma','40+ WPM','MS Office','Confidentiality'],sMin:25000,sMax:35000,tg:['Data Entry','Contract','Government'],p:Date.now()-432000000,dl:null,u:false,g:true,rem:false},
    {t:'Marketing Assistant',s:'marketing-asst-eabl',cs:'eabl',cat:'marketing-comms',loc:'nairobi',type:'Full-time',lv:'Entry Level',d:'Support brand management: campaigns, social media, events, market trends analysis.',r:['BSc Marketing','1 year experience preferred','Social media savvy','Valid driving license'],sMin:45000,sMax:65000,tg:['Marketing','FMCG','Entry Level'],p:Date.now()-518400000,dl:null,u:false,g:false,rem:false},
    {t:'Finance Intern',s:'finance-intern-equity',cs:'equity-bank',cat:'finance-accounting',loc:'nairobi',type:'Internship',lv:'Intern',d:'3-month finance internship: analysis, budgeting, forecasting, reporting.',r:['Finance/Accounting degree','Analytical skills','Excel proficiency'],sMin:20000,sMax:30000,tg:['Finance','Internship','Banking'],p:Date.now()-604800000,dl:null,u:false,g:false,rem:false},
    {t:'Software Engineering Intern',s:'sw-eng-intern-safaricom',cs:'safaricom',cat:'technology-it',loc:'nairobi',type:'Internship',lv:'Intern',d:'6-month internship building mobile/web apps used by millions. Agile sprints, production code.',r:['CS degree','Any programming language','Web/mobile understanding','6 months available'],sMin:25000,sMax:40000,tg:['Software','Internship','Mobile'],p:Date.now()-604800000,dl:null,u:false,g:false,rem:false},
    {t:'Marketing Intern EABL',s:'marketing-intern-eabl',cs:'eabl',cat:'marketing-comms',loc:'nairobi',type:'Internship',lv:'Intern',d:'Structured FMCG marketing internship. Real campaigns, events, research.',r:['Marketing/Comms degree','Creative mindset','3-6 months available'],sMin:25000,sMax:35000,tg:['Marketing','FMCG','Internship'],p:Date.now()-604800000,dl:null,u:false,g:false,rem:false},
    {t:'Mastercard Foundation Scholars',s:'mastercard-scholars',cs:'university-of-nairobi',cat:'education-training',loc:'nairobi',type:'Full-time',lv:'Any',d:'Full scholarships for academically talented but economically disadvantaged young Africans.',r:['Strong academics','Financial need','Leadership potential','<30 years'],sMin:null,sMax:null,sn:'Full Scholarship',tg:['Scholarship','University','Full Sponsorship'],p:Date.now()-1209600000,dl:null,u:false,g:false,rem:false},
    {t:'KCB Foundation Scholarship',s:'kcb-foundation-scholarship',cs:'kcb-group',cat:'education-training',loc:'nationwide',type:'Full-time',lv:'Any',d:'Supports students from disadvantaged backgrounds. Covers tuition + monthly stipend.',r:['Kenyan citizen','Admitted to Kenyan university','<25 years','Strong academics'],sMin:null,sMax:null,sn:'Tuition + Stipend',tg:['Scholarship','Foundation','Tuition'],p:Date.now()-1814400000,dl:null,u:false,g:false,rem:false},
    {t:'Waitstaff',s:'waitstaff-various',cs:'various',cat:'hospitality-tourism',loc:'westlands',type:'Casual',lv:'Any',d:'Waitstaff at busy Westlands restaurant. No experience needed, training provided.',r:['No experience required','18+','Customer service attitude','Immediate start'],sMin:null,sMax:null,cr:'Ksh 500/day',cn:'Immediate start',cas:true,tg:['Casual','Hospitality','Waitstaff'],p:Date.now()-7200000,dl:null,u:false,g:false,rem:false},
    {t:'Delivery Rider',s:'delivery-rider-various',cs:'various',cat:'logistics-supply-chain',loc:'nairobi-cbd',type:'Casual',lv:'Any',d:'Delivery riders for growing logistics company. Own schedule, competitive daily rates.',r:['Own motorcycle','Valid riding license','Smartphone','Nairobi routes knowledge'],sMin:null,sMax:null,cr:'Ksh 1,200/day',cn:'Own bike required',cas:true,tg:['Casual','Delivery','Logistics'],p:Date.now()-14400000,dl:null,u:false,g:false,rem:false},
    {t:'Farm Worker',s:'farm-worker-naivasha',cs:'various',cat:'hospitality-tourism',loc:'naivasha',type:'Casual',lv:'Any',d:'Flower farm workers in Naivasha. On-site accommodation and meals included.',r:['No experience required','Physically fit','Willing to live on-site','18+'],sMin:null,sMax:null,cr:'Ksh 700/day',cn:'Accom. provided',cas:true,tg:['Casual','Agriculture','Farm'],p:Date.now()-86400000,dl:null,u:false,g:false,rem:false},
    {t:'Shop Assistant',s:'shop-assistant-thika',cs:'various',cat:'sales-business-dev',loc:'thika-rd',type:'Part-time',lv:'Entry Level',d:'Part-time retail store assistant. 3-4 days/week. Ideal for supplementary income.',r:['Computer literacy','Customer service','Honest and reliable','Weekends available'],sMin:null,sMax:null,cr:'Ksh 15k/mo',cn:'Part-time',cas:true,tg:['Part-time','Retail','Shop'],p:Date.now()-86400000,dl:null,u:false,g:false,rem:false},
    {t:'Cleaning Staff',s:'cleaning-staff-kilimani',cs:'various',cat:'operations-admin',loc:'kilimani',type:'Casual',lv:'Any',d:'Weekend office cleaning in Kilimani. Every Sat & Sun, 8am-2pm.',r:['No experience required','Physically able','Available weekends','18+'],sMin:null,sMax:null,cr:'Ksh 600/day',cn:'Weekends only',cas:true,tg:['Casual','Cleaning','Weekend'],p:Date.now()-172800000,dl:null,u:false,g:false,rem:false},
    {t:'Loader',s:'loader-industrial',cs:'various',cat:'logistics-supply-chain',loc:'industrial-area',type:'Casual',lv:'Any',d:'Warehouse loaders for morning shift. Loading, offloading, packaging, inventory.',r:['Physically strong','No experience required','Punctual for morning shifts','18+'],sMin:null,sMax:null,cr:'Ksh 800/day',cn:'Morning shift (6am-2pm)',cas:true,tg:['Casual','Warehouse','Loading'],p:Date.now()-259200000,dl:null,u:false,g:false,rem:false},
  ];

  for (const j of jobs) for (const t of j.tg) allTags.add(t);
  const tagMap = {};
  for (const t of allTags) {
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const r = await prisma.tag.create({data:{name:t,slug}});
    tagMap[t]=r.id;
  }
  console.log('Tags:', allTags.size);

  // Create jobs
  let jc = 0;
  for (const j of jobs) {
    const cid = coMap[j.cs]; const catid = catMap[j.cat]; const lid = locMap[j.loc];
    if (!cid||!catid||!lid) { console.log('SKIP:',j.t); continue; }
    await prisma.job.create({
      data: {
        title:j.t, slug:j.s, type:j.type, level:j.lv,
        description:j.d, requirements:JSON.stringify(j.r),
        salaryMin:j.sMin, salaryMax:j.sMax,
        salaryNote:j.sn||null,
        casualRate:j.cr||null, casualNote:j.cn||null,
        isCasual:j.cas||false,
        isGovernment:j.g, isGazette:j.gz||false,
        isFeatured:j.f||false, isRemote:j.rem,
        postedAt:new Date(j.p), deadlineAt:j.dl?new Date(j.dl):null,
        companyId:cid, categoryId:catid, locationId:lid,
        tags:{create:j.tg.map(t=>({tagId:tagMap[t]}))}
      }
    });
    jc++;
  }
  console.log('Jobs:', jc);

  // Job Updates
  const updates = [
    {s:'kra-graduate-trainee-2025',c:'42 candidates shortlisted - KRA Graduate Trainee',a:true},
    {s:'financial-analyst-equity',c:'Interview invites sent - Equity Graduate Program',a:true},
    {s:'senior-pm-mpesa',c:'Safaricom Senior PM applications now closed',a:false},
    {s:'marketing-intern-ncba',c:'NCBA extends Marketing Intern deadline to Feb 20',a:true},
    {s:'tsc-5000-teacher-posts',c:'TSC internship postings for Q2 2025 now open',a:true},
    {s:'backend-developer-kcb',c:'KCB final round interviews scheduled for next week',a:false},
  ];
  let uc = 0;
  for (const u of updates) {
    const job = await prisma.job.findFirst({where:{slug:u.s}});
    if (job) {
      await prisma.jobUpdate.create({data:{content:u.c,isActive:u.a,jobId:job.id,createdAt:new Date(Date.now()-Math.random()*21600000)}});
      uc++;
    }
  }
  console.log('Updates:', uc);

  // Admin user
  const hash = await bcrypt.hash('Admin123!',12);
  await prisma.user.create({data:{email:'admin@jobnet.co.ke',passwordHash:hash,name:'Jobnet Admin',role:'ADMIN'}});
  console.log('Admin: admin@jobnet.co.ke / Admin123!');

  // Newsletter
  await prisma.newsletterSubscription.create({data:{email:'demo@jobnet.co.ke'}});
  console.log('Newsletter: demo@jobnet.co.ke');

  console.log('\\nDONE! Database seeded successfully.');
}

main().catch(e=>{console.error('ERROR:',e.message);process.exit(1)}).finally(()=>prisma.$disconnect());
