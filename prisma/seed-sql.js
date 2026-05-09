const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection({
    host: 'vda7300.is.cc', port: 3306,
    user: 'trustfit_jobready_database_admin', password: 'Admincyber',
    database: 'trustfit_jobready_database', namedPlaceholders: true,
  });
  console.log('Connected. Seeding...');

  // Clear
  for (const t of ['job_updates','job_tags','jobs','tags','users','locations','categories','companies','newsletter_subscriptions']) await conn.execute('DELETE FROM '+t);

  // 1-3: Locations, Categories, Companies
  await conn.execute(`INSERT INTO locations (id,name,slug,type,created_at,updated_at) VALUES
    ('loc-nai','Nairobi','nairobi','COUNTY',NOW(),NOW()), ('loc-mom','Mombasa','mombasa','COUNTY',NOW(),NOW()),
    ('loc-nak','Nakuru','nakuru','COUNTY',NOW(),NOW()), ('loc-kis','Kisumu','kisumu','COUNTY',NOW(),NOW()),
    ('loc-eld','Eldoret','eldoret','COUNTY',NOW(),NOW()), ('loc-thi','Thika','thika','COUNTY',NOW(),NOW()),
    ('loc-naiv','Naivasha','naivasha','COUNTY',NOW(),NOW()), ('loc-nation','Nationwide','nationwide','COUNTY',NOW(),NOW()),
    ('loc-cbd','CBD','nairobi-cbd','AREA',NOW(),NOW()), ('loc-wl','Westlands','westlands','AREA',NOW(),NOW()),
    ('loc-kil','Kilimani','kilimani','AREA',NOW(),NOW()), ('loc-ia','Industrial Area','industrial-area','AREA',NOW(),NOW()),
    ('loc-nyali','Nyali','nyali','AREA',NOW(),NOW()), ('loc-chang','Changamwe','changamwe','AREA',NOW(),NOW()),
    ('loc-trd','Thika Rd','thika-rd','AREA',NOW(),NOW()), ('loc-rem','Remote','remote','REMOTE',NOW(),NOW())`);

  await conn.execute(`INSERT INTO categories (id,name,slug,job_count,created_at,updated_at) VALUES
    ('cat-tech','Technology & IT','technology-it',2300,NOW(),NOW()), ('cat-fin','Finance & Accounting','finance-accounting',1800,NOW(),NOW()),
    ('cat-sales','Sales & Business Dev','sales-business-dev',1200,NOW(),NOW()), ('cat-mkt','Marketing & Comms','marketing-comms',980,NOW(),NOW()),
    ('cat-hr','Human Resources','human-resources',760,NOW(),NOW()), ('cat-eng','Engineering','engineering',690,NOW(),NOW()),
    ('cat-health','Healthcare & Medical','healthcare-medical',540,NOW(),NOW()), ('cat-edu','Education & Training','education-training',480,NOW(),NOW()),
    ('cat-ops','Operations & Admin','operations-admin',420,NOW(),NOW()), ('cat-log','Logistics & Supply Chain','logistics-supply-chain',310,NOW(),NOW()),
    ('cat-hosp','Hospitality & Tourism','hospitality-tourism',240,NOW(),NOW()), ('cat-legal','Legal & Compliance','legal-compliance',210,NOW(),NOW()),
    ('cat-creative','Creative Arts & Design','creative-arts-design',190,NOW(),NOW()), ('cat-gov','Government & Public','government-public',180,NOW(),NOW())`);

  await conn.execute(`INSERT INTO companies (id,name,slug,industry,is_verified,is_government,created_at,updated_at) VALUES
    ('co-saf','Safaricom','safaricom','Telecommunications',1,0,NOW(),NOW()), ('co-kcb','KCB Bank','kcb-bank','Banking',1,0,NOW(),NOW()),
    ('co-eq','Equity Bank','equity-bank','Banking',1,0,NOW(),NOW()), ('co-ncba','NCBA Group','ncba-group','Banking',1,0,NOW(),NOW()),
    ('co-coop','Co-operative Bank','co-operative-bank','Banking',1,0,NOW(),NOW()), ('co-kra','KRA','kra','Government',1,1,NOW(),NOW()),
    ('co-eabl','EABL','eabl','FMCG',1,0,NOW(),NOW()), ('co-kenha','KeNHA','kenha','Government',1,1,NOW(),NOW()),
    ('co-tsc','Teachers Service Commission','tsc','Government',1,1,NOW(),NOW()), ('co-police','Kenya Police Service','kenya-police','Government',1,1,NOW(),NOW()),
    ('co-nakuru','Nakuru County Government','nakuru-county','Government',0,1,NOW(),NOW()), ('co-nairobi','Nairobi County Government','nairobi-county','Government',0,1,NOW(),NOW()),
    ('co-mombasa','Mombasa County Government','mombasa-county','Government',0,1,NOW(),NOW()), ('co-uon','University of Nairobi','university-of-nairobi','Education',1,0,NOW(),NOW()),
    ('co-kcbg','KCB Group','kcb-group','Finance',1,0,NOW(),NOW()), ('co-var','Various','various','Various',0,0,NOW(),NOW())`);
  console.log('Locations:16, Categories:14, Companies:16');

  // 4. Tags
  const tags = ['Accounting','Finance','CPA','IFRS','Backend','API','Node.js','Python','Marketing','Internship','Digital Marketing','Engineering','Infrastructure','Construction','Product','Fintech','Mobile','Leadership','Analysis','Modeling','Software','Full-stack','React','Graduate','Training','HR','Management','People','Data','Analytics','Statistics','Government','Tax','Gazette','Teaching','Education','County','Health','Entry Level','Customer Service','Telecom','Data Entry','Contract','FMCG','Banking','Scholarship','University','Full Sponsorship','Foundation','Tuition','Casual','Hospitality','Waitstaff','Delivery','Logistics','Agriculture','Farm','Part-time','Retail','Shop','Cleaning','Weekend','Warehouse','Loading','Security','Junior','Developer','Remote'];
  for (const t of tags) { const s=t.toLowerCase().replace(/[^a-z0-9]+/g,'-'); await conn.execute('INSERT IGNORE INTO tags (id,name,slug,created_at) VALUES (?,?,?,NOW())',['tag-'+s,t,s]); }
  console.log('Tags:', tags.length);

  // 5. Jobs
  const N=Date.now();
  const J = [
    {id:'job-sa',s:'senior-accountant-safaricom',t:'Senior Accountant',c:'co-saf',cat:'cat-fin',l:'loc-nai',ty:'Full-time',lv:'Senior',d:'Join Safaricom Finance. IFRS, reporting, budgeting.',r:'["CPA(K)","BSc Accounting","5+ years"]',min:180000,max:250000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-120000,dl:N+172800000},
    {id:'job-bd',s:'backend-developer-kcb',t:'Backend Developer',c:'co-kcb',cat:'cat-tech',l:'loc-rem',ty:'Full-time',lv:'Mid Level',d:'Build APIs for digital banking.',r:'["BSc CS","3+ years Node.js"]',min:150000,max:220000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:1,p:N-300000,dl:N+432000000},
    {id:'job-mi',s:'marketing-intern-ncba',t:'Marketing Intern',c:'co-ncba',cat:'cat-mkt',l:'loc-nai',ty:'Internship',lv:'Intern',d:'6-month marketing internship.',r:'["BSc Marketing","6 months"]',min:25000,max:35000,gov:0,gaz:0,cas:0,urg:1,feat:0,rem:0,p:N-480000,dl:N+86400000},
    {id:'job-ce',s:'civil-engineer-kenha',t:'Civil Engineer',c:'co-kenha',cat:'cat-eng',l:'loc-nak',ty:'Full-time',lv:'Mid Level',d:'Road construction oversight.',r:'["BSc Civil Eng","EBK registered"]',min:120000,max:180000,gov:1,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-720000,dl:null},
    {id:'job-pm',s:'senior-pm-mpesa',t:'Senior Product Manager - M-Pesa',c:'co-saf',cat:'cat-tech',l:'loc-nai',ty:'Full-time',lv:'Senior',d:'Lead M-Pesa for 30M+ users.',r:'["8+ years PM","Fintech","MBA"]',min:350000,max:500000,gov:0,gaz:0,cas:0,urg:0,feat:1,rem:0,p:N-86400000,dl:null},
    {id:'job-fa',s:'financial-analyst-equity',t:'Financial Analyst',c:'co-eq',cat:'cat-fin',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'Financial modeling and analysis.',r:'["BSc Finance","CFA Level 1+"]',min:80000,max:120000,gov:0,gaz:0,cas:0,urg:0,feat:1,rem:0,p:N-10800000,dl:null},
    {id:'job-se',s:'software-engineer-kcb',t:'Software Engineer',c:'co-kcb',cat:'cat-tech',l:'loc-rem',ty:'Full-time',lv:'Mid Level',d:'Full-stack banking solutions.',r:'["BSc CS","React+Node.js"]',min:140000,max:200000,gov:0,gaz:0,cas:0,urg:0,feat:1,rem:1,p:N-14400000,dl:null},
    {id:'job-gt',s:'graduate-trainee-ncba',t:'Graduate Trainee',c:'co-ncba',cat:'cat-fin',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'12-month rotational program.',r:'["2nd Class Upper"]',min:60000,max:80000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-21600000,dl:null},
    {id:'job-hrm',s:'hr-manager-equity',t:'HR Manager',c:'co-eq',cat:'cat-hr',l:'loc-nai',ty:'Full-time',lv:'Senior',d:'Lead HR for 500+ staff.',r:'["BSc HR","7+ years","CHRP"]',min:200000,max:300000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-172800000,dl:N+259200000},
    {id:'job-jd',s:'junior-developer-kcb',t:'Junior Developer',c:'co-kcb',cat:'cat-tech',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'Junior dev with mentorship.',r:'["BSc CS","0-1 year exp"]',min:70000,max:100000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-86400000,dl:N+432000000},
    {id:'job-da',s:'data-analyst-kra',t:'Data Analyst',c:'co-kra',cat:'cat-fin',l:'loc-nai',ty:'Full-time',lv:'Mid Level',d:'Tax compliance data analysis.',r:'["BSc Statistics","SQL Python"]',min:100000,max:160000,gov:1,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-172800000,dl:N+432000000},
    {id:'job-kra',s:'kra-graduate-trainee-2025',t:'KRA Graduate Trainee 2025',c:'co-kra',cat:'cat-gov',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'18-month government training.',r:'["2nd Class Upper","<28 years"]',min:70000,max:90000,gov:1,gaz:1,cas:0,urg:0,feat:0,rem:0,p:N-432000000,dl:null},
    {id:'job-tsc',s:'tsc-5000-teacher-posts',t:'TSC - 5,000 Teacher Posts',c:'co-tsc',cat:'cat-edu',l:'loc-nation',ty:'Full-time',lv:'Entry Level',d:'5,000 teachers for 47 counties.',r:'["Diploma/Degree Education"]',min:30000,max:50000,gov:1,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-604800000,dl:null},
    {id:'job-kp',s:'kenya-police-constable',t:'Kenya Police Constable',c:'co-police',cat:'cat-gov',l:'loc-nation',ty:'Full-time',lv:'Entry Level',d:'Police constable recruitment.',r:'["18-28 years","KCSE D+"]',min:35000,max:45000,gov:1,gaz:1,cas:0,urg:0,feat:0,rem:0,p:N-259200000,dl:null},
    {id:'job-nak',s:'nakuru-county-positions',t:'Nakuru County Positions',c:'co-nakuru',cat:'cat-gov',l:'loc-nak',ty:'Full-time',lv:'Entry Level',d:'Multiple department openings.',r:'["Relevant diploma/degree"]',min:30000,max:60000,gov:1,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-345600000,dl:null},
    {id:'job-nhlth',s:'nairobi-health-workers',t:'Nairobi Health Workers',c:'co-nairobi',cat:'cat-health',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'Nurses, clinical officers.',r:'["Valid license","Health degree"]',min:40000,max:80000,gov:1,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-432000000,dl:null},
    {id:'job-meng',s:'mombasa-engineers',t:'Mombasa Engineers',c:'co-mombasa',cat:'cat-eng',l:'loc-mom',ty:'Full-time',lv:'Mid Level',d:'Infrastructure project engineers.',r:'["BSc Engineering","EBK"]',min:80000,max:150000,gov:1,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-518400000,dl:null},
    {id:'job-ja',s:'junior-acct-coop',t:'Junior Accountant',c:'co-coop',cat:'cat-fin',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'Bookkeeping, reporting, tax.',r:'["BSc Accounting","CPA Sec 2+"]',min:60000,max:90000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-259200000,dl:null},
    {id:'job-cs',s:'cs-rep-safaricom',t:'Customer Service Rep',c:'co-saf',cat:'cat-sales',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'Customer inquiries and support.',r:'["Diploma","English+Kiswahili"]',min:35000,max:50000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-345600000,dl:null},
    {id:'job-de',s:'data-entry-kra',t:'Data Entry Clerk',c:'co-kra',cat:'cat-ops',l:'loc-nai',ty:'Contract',lv:'Entry Level',d:'6-month data entry contract.',r:'["IT diploma","40+ WPM"]',min:25000,max:35000,gov:1,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-432000000,dl:null},
    {id:'job-ma',s:'marketing-asst-eabl',t:'Marketing Assistant',c:'co-eabl',cat:'cat-mkt',l:'loc-nai',ty:'Full-time',lv:'Entry Level',d:'Brand management support.',r:'["BSc Marketing","1 year exp"]',min:45000,max:65000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-518400000,dl:null},
    {id:'job-fi',s:'finance-intern-equity',t:'Finance Intern',c:'co-eq',cat:'cat-fin',l:'loc-nai',ty:'Internship',lv:'Intern',d:'3-month finance internship.',r:'["Finance degree","Excel"]',min:20000,max:30000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-604800000,dl:null},
    {id:'job-si',s:'sw-eng-intern-safaricom',t:'Software Engineering Intern',c:'co-saf',cat:'cat-tech',l:'loc-nai',ty:'Internship',lv:'Intern',d:'6-month software internship.',r:'["CS degree","6 months"]',min:25000,max:40000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-604800000,dl:null},
    {id:'job-me',s:'marketing-intern-eabl',t:'Marketing Intern EABL',c:'co-eabl',cat:'cat-mkt',l:'loc-nai',ty:'Internship',lv:'Intern',d:'FMCG marketing internship.',r:'["Marketing degree"]',min:25000,max:35000,gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-604800000,dl:null},
    {id:'job-mcs',s:'mastercard-scholars',t:'Mastercard Foundation Scholars',c:'co-uon',cat:'cat-edu',l:'loc-nai',ty:'Full-time',lv:'Any',d:'Full scholarships for talented students.',r:'["Strong academics","Financial need"]',min:null,max:null,sn:'Full Scholarship',gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-1209600000,dl:null},
    {id:'job-kcbs',s:'kcb-foundation-scholarship',t:'KCB Foundation Scholarship',c:'co-kcbg',cat:'cat-edu',l:'loc-nation',ty:'Full-time',lv:'Any',d:'Tuition + stipend scholarship.',r:'["Kenyan citizen","<25 years"]',min:null,max:null,sn:'Tuition + Stipend',gov:0,gaz:0,cas:0,urg:0,feat:0,rem:0,p:N-1814400000,dl:null},
    {id:'job-wait',s:'waitstaff-various',t:'Waitstaff',c:'co-var',cat:'cat-hosp',l:'loc-wl',ty:'Casual',lv:'Any',d:'Restaurant waitstaff.',r:'["No experience","18+"]',min:null,max:null,gov:0,gaz:0,cas:1,urg:0,feat:0,rem:0,p:N-7200000,dl:null,cr:'Ksh 500/day',cn:'Immediate start'},
    {id:'job-del',s:'delivery-rider-various',t:'Delivery Rider',c:'co-var',cat:'cat-log',l:'loc-cbd',ty:'Casual',lv:'Any',d:'Delivery riders, own bikes.',r:'["Own motorcycle","License"]',min:null,max:null,gov:0,gaz:0,cas:1,urg:0,feat:0,rem:0,p:N-14400000,dl:null,cr:'Ksh 1,200/day',cn:'Own bike required'},
    {id:'job-farm',s:'farm-worker-naivasha',t:'Farm Worker',c:'co-var',cat:'cat-hosp',l:'loc-naiv',ty:'Casual',lv:'Any',d:'Flower farm workers.',r:'["No experience","18+"]',min:null,max:null,gov:0,gaz:0,cas:1,urg:0,feat:0,rem:0,p:N-86400000,dl:null,cr:'Ksh 700/day',cn:'Accom. provided'},
    {id:'job-shop',s:'shop-assistant-thika',t:'Shop Assistant',c:'co-var',cat:'cat-sales',l:'loc-trd',ty:'Part-time',lv:'Entry Level',d:'Part-time retail.',r:'["Computer literacy"]',min:null,max:null,gov:0,gaz:0,cas:1,urg:0,feat:0,rem:0,p:N-86400000,dl:null,cr:'Ksh 15k/mo',cn:'Part-time'},
    {id:'job-clean',s:'cleaning-staff-kilimani',t:'Cleaning Staff',c:'co-var',cat:'cat-ops',l:'loc-kil',ty:'Casual',lv:'Any',d:'Weekend office cleaning.',r:'["No experience"]',min:null,max:null,gov:0,gaz:0,cas:1,urg:0,feat:0,rem:0,p:N-172800000,dl:null,cr:'Ksh 600/day',cn:'Weekends only'},
    {id:'job-load',s:'loader-industrial',t:'Loader',c:'co-var',cat:'cat-log',l:'loc-ia',ty:'Casual',lv:'Any',d:'Warehouse loader.',r:'["Physically strong"]',min:null,max:null,gov:0,gaz:0,cas:1,urg:0,feat:0,rem:0,p:N-259200000,dl:null,cr:'Ksh 800/day',cn:'Morning shift'},
  ];

  for (const j of J) {
    await conn.execute(
      `INSERT INTO jobs (id,slug,title,description,requirements,type,level,salaryMin,salaryMax,salary_currency,salary_note,casual_rate,casual_note,is_casual,is_government,is_gazette,is_urgent,is_featured,is_remote,posted_at,deadline_at,companyId,categoryId,locationId,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [j.id,j.s,j.t,j.d,j.r,j.ty,j.lv,j.min,j.max,j.min?'Ksh':'',j.sn||null,j.cr||null,j.cn||null,j.cas,j.gov,j.gaz,j.urg,j.feat,j.rem,new Date(j.p),j.dl?new Date(j.dl):null,j.c,j.cat,j.l,'ACTIVE',new Date(),new Date()]
    );
  }
  console.log('Jobs:', J.length);

  // 6. Job tags
  const JT = {
    'job-sa':['tag-accounting','tag-finance','tag-cpa','tag-ifrs'],
    'job-bd':['tag-backend','tag-api','tag-node-js','tag-python'],
    'job-mi':['tag-marketing','tag-internship','tag-digital-marketing'],
    'job-ce':['tag-engineering','tag-infrastructure','tag-construction'],
    'job-pm':['tag-product','tag-fintech','tag-mobile','tag-leadership'],
    'job-fa':['tag-finance','tag-analysis','tag-modeling'],
    'job-se':['tag-software','tag-full-stack','tag-react','tag-node-js'],
    'job-gt':['tag-graduate','tag-training','tag-leadership'],
    'job-hrm':['tag-hr','tag-management','tag-people'],
    'job-jd':['tag-junior','tag-developer','tag-entry-level'],
    'job-da':['tag-data','tag-analytics','tag-statistics'],
    'job-kra':['tag-graduate','tag-government','tag-tax','tag-gazette'],
    'job-tsc':['tag-teaching','tag-government','tag-education'],
    'job-kp':['tag-police','tag-government','tag-security','tag-gazette'],
    'job-nak':['tag-county','tag-government'],
    'job-nhlth':['tag-health','tag-county','tag-government'],
    'job-meng':['tag-engineering','tag-county','tag-government'],
    'job-ja':['tag-accounting','tag-entry-level','tag-banking'],
    'job-cs':['tag-customer-service','tag-entry-level','tag-telecom'],
    'job-de':['tag-data-entry','tag-contract','tag-government'],
    'job-ma':['tag-marketing','tag-fmcg','tag-entry-level'],
    'job-fi':['tag-finance','tag-internship','tag-banking'],
    'job-si':['tag-software','tag-internship','tag-mobile'],
    'job-me':['tag-marketing','tag-fmcg','tag-internship'],
    'job-mcs':['tag-scholarship','tag-university','tag-full-sponsorship'],
    'job-kcbs':['tag-scholarship','tag-foundation','tag-tuition'],
    'job-wait':['tag-casual','tag-hospitality','tag-waitstaff'],
    'job-del':['tag-casual','tag-delivery','tag-logistics'],
    'job-farm':['tag-casual','tag-agriculture','tag-farm'],
    'job-shop':['tag-part-time','tag-retail','tag-shop'],
    'job-clean':['tag-casual','tag-cleaning','tag-weekend'],
    'job-load':['tag-casual','tag-warehouse','tag-loading'],
  };
  let tc=0;
  for (const [jid,tagIds] of Object.entries(JT)) for (const tid of tagIds) { await conn.execute('INSERT IGNORE INTO job_tags (jobId,tagId) VALUES (?,?)',[jid,tid]); tc++; }
  console.log('Job-Tag links:', tc);

  // 7. Job Updates
  await conn.execute(`INSERT INTO job_updates (id,content,is_active,job_id,created_at) VALUES ('ju-1','42 candidates shortlisted - KRA Graduate Trainee',1,'job-kra',DATE_SUB(NOW(),INTERVAL 12 MINUTE)), ('ju-2','Interview invites sent - Equity',1,'job-fa',DATE_SUB(NOW(),INTERVAL 1 HOUR)), ('ju-3','Safaricom Senior PM closed',0,'job-pm',DATE_SUB(NOW(),INTERVAL 3 HOUR)), ('ju-4','NCBA extends deadline',1,'job-mi',DATE_SUB(NOW(),INTERVAL 2 HOUR)), ('ju-5','TSC Q2 postings open',1,'job-tsc',DATE_SUB(NOW(),INTERVAL 5 HOUR)), ('ju-6','KCB interviews next week',0,'job-bd',DATE_SUB(NOW(),INTERVAL 6 HOUR))`);
  console.log('Updates: 6');

  // 8. Admin
  await conn.execute(`INSERT INTO users (id,email,password_hash,name,role,is_active,skills,created_at,updated_at) VALUES ('usr-admin','admin@jobnet.co.ke','$2a$12$LJ3m4ys3Hz0JeVN9xX5YbOiGzTZw7kF6e3Qi0dQ6w6K0g0T0eY9pG','Jobnet Admin','ADMIN',1,'[]',NOW(),NOW())`);
  console.log('Admin: admin@jobnet.co.ke / Admin123!');

  // 9. Newsletter
  await conn.execute(`INSERT INTO newsletter_subscriptions (id,email,is_active,subscribed_at) VALUES ('nl-1','demo@jobnet.co.ke',1,NOW())`);

  await conn.end();
  console.log('\nDONE! Database seeded successfully.');
}
main().catch(e=>{console.error('ERROR:',e.message);process.exit(1)});
