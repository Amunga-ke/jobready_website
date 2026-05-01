// =============================================================================
// Jobnet — Optimised Seed (raw SQL bulk inserts)
// =============================================================================
import { PrismaClient } from '@prisma/client';

const DB_URL = 'mysql://trustfit_jobready_database_admin:Admincyber@vda7300.is.cc:3306/trustfit_jobready_database';
const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

const $raw = prisma.$executeRawUnsafe.bind(prisma);
const $query = prisma.$queryRawUnsafe.bind(prisma);

async function main() {
  console.log('=== Jobnet Optimised Seed ===\n');

  // ── 1. Organisation Types ──
  console.log('Seeding organisation types...');
  await $raw(`INSERT IGNORE INTO organization_types (id, code, name, slug, sort_order) VALUES
    ('ot_private','PRIVATE','Private Sector Companies','private-sector',1),
    ('ot_sme','SMALL_BUSINESS','Small & Medium Enterprises','small-business',2),
    ('ot_startup','STARTUP','Startup','startup',3),
    ('ot_ngo','NGO','Non-Governmental Organization','ngo',4),
    ('ot_intl','INTERNATIONAL','International Organization','international-org',5),
    ('ot_natgov','NATIONAL_GOV','National Government','national-government',6),
    ('ot_cntgov','COUNTY_GOV','County Government','county-government',7),
    ('ot_statecorp','STATE_CORP','State Corporation','state-corporation',8),
    ('ot_edu','EDUCATION','Education & Research','education',9),
    ('ot_found','FOUNDATION','Foundation','foundation',10),
    ('ot_relig','RELIGIOUS','Religious Organization','religious-org',11)`);
  console.log('  ✅ 11 org types');

  // ── 2. Industries ──
  console.log('Seeding industries...');
  await $raw(`INSERT IGNORE INTO industries (id,code,name,slug,sort_order) VALUES
('ind_agri','AGRICULTURE','Agriculture & Agribusiness','agriculture',1),
('ind_auto','AUTOMOTIVE','Automotive','automotive',2),
('ind_avia','AVIATION','Aviation & Aerospace','aviation',3),
('ind_bank','BANKING','Banking & Finance','banking',4),
('ind_cons','CONSTRUCTION','Construction','construction',5),
('ind_consult','CONSULTING','Consulting','consulting',6),
('ind_cpg','CONSUMER_GOODS','Consumer Goods','consumer-goods',7),
('ind_edu','EDUCATION','Education','education',8),
('ind_energy','ENERGY','Energy','energy',9),
('ind_env','ENVIRONMENT','Environment & Sustainability','environment',10),
('ind_fintech','FINTECH','Fintech','fintech',11),
('ind_fb','FOOD_BEVERAGE','Food & Beverage','food-beverage',12),
('ind_gov','GOVERNMENT','Government & Public Admin','government',13),
('ind_health','HEALTHCARE','Healthcare','healthcare',14),
('ind_hosp','HOSPITALITY','Hospitality & Tourism','hospitality',15),
('ind_hr','HUMAN_RESOURCES','Human Resources','human-resources',16),
('ind_it','INFORMATION_TECHNOLOGY','Information Technology','information-technology',17),
('ind_ins','INSURANCE','Insurance','insurance',18),
('ind_intldev','INTERNATIONAL_DEV','International Development','international-dev',19),
('ind_legal','LEGAL','Legal','legal',20),
('ind_log','LOGISTICS','Logistics & Supply Chain','logistics',21),
('ind_mfg','MANUFACTURING','Manufacturing','manufacturing',22),
('ind_mkt','MARKETING','Marketing & Advertising','marketing',23),
('ind_media','MEDIA','Media & Entertainment','media',24),
('ind_mining','MINING','Mining','mining',25),
('ind_np','NON_PROFIT','Non-Profit','non-profit',26),
('ind_pharma','PHARMACEUTICAL','Pharmaceutical','pharmaceutical',27),
('ind_re','REAL_ESTATE','Real Estate','real-estate',28),
('ind_res','RESEARCH','Research','research',29),
('ind_ret','RETAIL','Retail','retail',30),
('ind_sec','SECURITY','Security & Defense','security',31),
('ind_sport','SPORTS','Sports','sports',32),
('ind_tele','TELECOMMUNICATIONS','Telecommunications','telecommunications',33),
('ind_text','TEXTILES','Textiles & Apparel','textiles',34),
('ind_trade','TRADES','Skilled Trades','trades',35),
('ind_water','WATER','Water & Sanitation','water',36)`);
  console.log('  ✅ 36 industries');

  // ── 3. Currencies ──
  console.log('Seeding currencies...');
  await $raw(`INSERT IGNORE INTO currencies (id,code,name,symbol) VALUES
('cur_kes','KES','Kenyan Shilling','Ksh'),
('cur_usd','USD','US Dollar','$'),
('cur_eur','EUR','Euro','€'),
('cur_gbp','GBP','British Pound','£'),
('cur_ugx','UGX','Ugandan Shilling','UGX'),
('cur_tzs','TZS','Tanzanian Shilling','TZS'),
('cur_rwf','RWF','Rwandan Franc','RWF'),
('cur_zar','ZAR','South African Rand','ZAR'),
('cur_ngn','NGN','Nigerian Naira','NGN')`);
  console.log('  ✅ 9 currencies');

  // ── 4. Listing Types ──
  console.log('Seeding listing types...');
  await $raw(`INSERT IGNORE INTO listing_types (id,code,name,slug,sort_order) VALUES
('lt_job','JOB','Job','job',1),
('lt_intern','INTERNSHIP','Internship','internship',2),
('lt_schol','SCHOLARSHIP','Scholarship','scholarship',3),
('lt_burs','BURSARY','Bursary','bursary',4),
('lt_boot','BOOTCAMP','Bootcamp','bootcamp',5),
('lt_fell','FELLOWSHIP','Fellowship','fellowship',6),
('lt_appren','APPRENTICESHIP','Apprenticeship','apprenticeship',7),
('lt_uni','UNIVERSITY_ADMISSION','University Admission','university-admission',8),
('lt_vol','VOLUNTEER','Volunteer','volunteer',9),
('lt_train','TRAINING','Training','training',10),
('lt_grant','GRANT','Grant','grant',11),
('lt_cert','CERTIFICATION','Certification','certification',12),
('lt_comp','COMPETITION','Competition','competition',13),
('lt_ment','MENTORSHIP','Mentorship','mentorship',14),
('lt_accel','ACCELERATOR','Accelerator','accelerator',15),
('lt_incub','INCUBATOR','Incubator','incubator',16),
('lt_work','WORKSHOP','Workshop','workshop',17),
('lt_conf','CONFERENCE','Conference','conference',18),
('lt_research','RESEARCH','Research','research',19),
('lt_exch','EXCHANGE','Exchange Program','exchange',20),
('lt_casual','CASUAL','Casual Work','casual',21)`);
  console.log('  ✅ 21 listing types');

  // ── 5. Employment Types ──
  console.log('Seeding employment types...');
  await $raw(`INSERT IGNORE INTO employment_types (id,code,name,slug,sort_order) VALUES
('et_ft','FULL_TIME','Full-time','full-time',1),
('et_pt','PART_TIME','Part-time','part-time',2),
('et_ct','CONTRACT','Contract','contract',3),
('et_tmp','TEMPORARY','Temporary','temporary',4),
('et_int','INTERNSHIP','Internship','internship',5),
('et_cas','CASUAL','Casual','casual',6),
('et_vol','VOLUNTEER','Volunteer','volunteer',7)`);
  console.log('  ✅ 7 employment types');

  // ── 6. Experience Levels ──
  console.log('Seeding experience levels...');
  await $raw(`INSERT IGNORE INTO experience_levels (id,code,name,slug,sort_order) VALUES
('el_entry','ENTRY_LEVEL','Entry Level','entry-level',1),
('el_int','INTERNSHIP','Intern','intern',2),
('el_mid','MID_LEVEL','Mid Level','mid-level',3),
('el_sen','SENIOR','Senior','senior',4),
('el_lead','LEAD','Lead','lead',5),
('el_mgr','MANAGER','Manager','manager',6),
('el_dir','DIRECTOR','Director','director',7),
('el_exec','EXECUTIVE','Executive','executive',8)`);
  console.log('  ✅ 8 experience levels');

  // ── 7. Education Levels ──
  console.log('Seeding education levels...');
  await $raw(`INSERT IGNORE INTO education_levels (id,code,name,slug,sort_order) VALUES
('edl_hs','HIGH_SCHOOL','High School Certificate','high-school',1),
('edl_dip','DIPLOMA','Diploma','diploma',2),
('edl_bac','BACHELORS','Bachelor''s Degree','bachelors',3),
('edl_mas','MASTERS','Master''s Degree','masters',4),
('edl_doc','DOCTORATE','PhD / Doctorate','doctorate',5),
('edl_pro','PROFESSIONAL','Professional Certification','professional',6)`);
  console.log('  ✅ 6 education levels');

  // ── 8. Locations ──
  console.log('Seeding locations...');
  // Kenya country (idempotent)
  await $raw(`INSERT IGNORE INTO locations (id,name,slug,type,country_code,dial_code,flag,depth,sort_order) VALUES
('loc_ke','Kenya','kenya','COUNTRY','KE','+254','KE',0,1)`);

  // Counties
  await $raw(`INSERT IGNORE INTO locations (id,parent_id,name,slug,type,country_code,depth,sort_order) VALUES
('loc_nairobi','loc_ke','Nairobi','nairobi','COUNTY','KE',1,1),
('loc_mombasa','loc_ke','Mombasa','mombasa','COUNTY','KE',1,2),
('loc_nakuru','loc_ke','Nakuru','nakuru','COUNTY','KE',1,3),
('loc_kiambu','loc_ke','Kiambu','kiambu','COUNTY','KE',1,4),
('loc_uasin','loc_ke','Uasin Gishu','uasin-gishu','COUNTY','KE',1,5),
('loc_kisumu','loc_ke','Kisumu','kisumu','COUNTY','KE',1,6),
('loc_machakos','loc_ke','Machakos','machakos','COUNTY','KE',1,7),
('loc_kajiado','loc_ke','Kajiado','kajiado','COUNTY','KE',1,8),
('loc_kakamega','loc_ke','Kakamega','kakamega','COUNTY','KE',1,9),
('loc_meru','loc_ke','Meru','meru','COUNTY','KE',1,10),
('loc_embu','loc_ke','Embu','embu','COUNTY','KE',1,11),
('loc_nyeri','loc_ke','Nyeri','nyeri','COUNTY','KE',1,12),
('loc_laikipia','loc_ke','Laikipia','laikipia','COUNTY','KE',1,13),
('loc_muranga','loc_ke','Murang''a','muranga','COUNTY','KE',1,14),
('loc_kirinyaga','loc_ke','Kirinyaga','kirinyaga','COUNTY','KE',1,15),
('loc_nyandarua','loc_ke','Nyandarua','nyandarua','COUNTY','KE',1,16),
('loc_nandi','loc_ke','Nandi','nandi','COUNTY','KE',1,17),
('loc_bungoma','loc_ke','Bungoma','bungoma','COUNTY','KE',1,18),
('loc_transnzoia','loc_ke','Trans Nzoia','trans-nzoia','COUNTY','KE',1,19),
('loc_kisii','loc_ke','Kisii','kisii','COUNTY','KE',1,20),
('loc_migori','loc_ke','Migori','migori','COUNTY','KE',1,21),
('loc_homabay','loc_ke','Homa Bay','homa-bay','COUNTY','KE',1,22),
('loc_siaya','loc_ke','Siaya','siaya','COUNTY','KE',1,23),
('loc_busia','loc_ke','Busia','busia','COUNTY','KE',1,24),
('loc_bomet','loc_ke','Bomet','bomet','COUNTY','KE',1,25),
('loc_kericho','loc_ke','Kericho','kericho','COUNTY','KE',1,26),
('loc_narok','loc_ke','Narok','narok','COUNTY','KE',1,27),
('loc_turkana','loc_ke','Turkana','turkana','COUNTY','KE',1,28),
('loc_westpokot','loc_ke','West Pokot','west-pokot','COUNTY','KE',1,29),
('loc_isiolo','loc_ke','Isiolo','isiolo','COUNTY','KE',1,30),
('loc_samburu','loc_ke','Samburu','samburu','COUNTY','KE',1,31),
('loc_elgeyo','loc_ke','Elgeyo Marakwet','elgeyo-marakwet','COUNTY','KE',1,32),
('loc_baringo','loc_ke','Baringo','baringo','COUNTY','KE',1,33),
('loc_tanariver','loc_ke','Tana River','tana-river','COUNTY','KE',1,34),
('loc_kilifi','loc_ke','Kilifi','kilifi','COUNTY','KE',1,35),
('loc_kwale','loc_ke','Kwale','kwale','COUNTY','KE',1,36),
('loc_taita','loc_ke','Taita Taveta','taita-taveta','COUNTY','KE',1,37),
('loc_vihiga','loc_ke','Vihiga','vihiga','COUNTY','KE',1,38),
('loc_nyamira','loc_ke','Nyamira','nyamira','COUNTY','KE',1,39),
('loc_lamu','loc_ke','Lamu','lamu','COUNTY','KE',1,40),
('loc_garissa','loc_ke','Garissa','garissa','COUNTY','KE',1,41),
('loc_marsabit','loc_ke','Marsabit','marsabit','COUNTY','KE',1,42)`);
  console.log('  ✅ 42 counties');

  // Nairobi areas
  await $raw(`INSERT IGNORE INTO locations (id,parent_id,name,slug,type,country_code,depth,sort_order) VALUES
('loc_nai_cbd','loc_nairobi','CBD','cbd','AREA','KE',2,1),
('loc_nai_west','loc_nairobi','Westlands','westlands','AREA','KE',2,2),
('loc_nai_kili','loc_nairobi','Kilimani','kilimani','AREA','KE',2,3),
('loc_nai_ia','loc_nairobi','Industrial Area','industrial-area','AREA','KE',2,4),
('loc_nai_upper','loc_nairobi','Upper Hill','upper-hill','AREA','KE',2,5),
('loc_nai_park','loc_nairobi','Parklands','parklands','AREA','KE',2,6),
('loc_nai_east','loc_nairobi','Eastlands','eastlands','AREA','KE',2,7),
('loc_nai_thikard','loc_nairobi','Thika Rd','thika-rd','AREA','KE',2,8)`);
  console.log('  ✅ 8 Nairobi areas');

  // Mombasa areas
  await $raw(`INSERT IGNORE INTO locations (id,parent_id,name,slug,type,country_code,depth,sort_order) VALUES
('loc_mom_nyali','loc_mombasa','Nyali','nyali','AREA','KE',2,1),
('loc_mom_diani','loc_mombasa','Diani','diani','AREA','KE',2,2),
('loc_mom_lik','loc_mombasa','Likoni','likoni','AREA','KE',2,3)`);
  console.log('  ✅ 3 Mombasa areas');

  // Nakuru areas
  await $raw(`INSERT IGNORE INTO locations (id,parent_id,name,slug,type,country_code,depth,sort_order) VALUES
('loc_nak_naivasha','loc_nakuru','Naivasha','naivasha','AREA','KE',2,1),
('loc_nak_gilgil','loc_nakuru','Gilgil','gilgil','AREA','KE',2,2)`);
  console.log('  ✅ 2 Nakuru areas');

  // ── 9. Categories ──
  console.log('Seeding categories...');
  await $raw(`INSERT IGNORE INTO categories (id,name,slug,type,listing_count,sort_order,meta_title,meta_description) VALUES
('cat_tech','Technology & IT','technology-it','JOB',186,1,'Technology & IT Jobs in Kenya','Browse technology and IT job opportunities across Kenya.'),
('cat_finance','Finance & Accounting','finance-accounting','JOB',142,2,'Finance & Accounting Jobs in Kenya','Browse finance and accounting jobs across Kenya.'),
('cat_sales','Sales & Business Dev','sales-business-dev','JOB',97,3,'Sales Jobs in Kenya','Browse sales and business development jobs.'),
('cat_mkt','Marketing & Comms','marketing-comms','JOB',89,4,'Marketing Jobs in Kenya','Browse marketing and communications jobs.'),
('cat_hr','Human Resources','human-resources','JOB',67,5,'HR Jobs in Kenya','Browse human resources jobs.'),
('cat_eng','Engineering','engineering','JOB',78,6,'Engineering Jobs in Kenya','Browse engineering jobs across Kenya.'),
('cat_health','Healthcare & Medical','healthcare-medical','JOB',112,7,'Healthcare Jobs in Kenya','Browse healthcare and medical jobs.'),
('cat_edu','Education & Training','education-training','JOB',156,8,'Education Jobs in Kenya','Browse education and training jobs.'),
('cat_ops','Operations & Admin','operations-admin','JOB',54,9,'Operations Jobs in Kenya','Browse operations and admin jobs.'),
('cat_log','Logistics & Supply Chain','logistics-supply-chain','JOB',43,10,'Logistics Jobs in Kenya','Browse logistics and supply chain jobs.'),
('cat_hosp','Hospitality & Tourism','hospitality-tourism','JOB',71,11,'Hospitality Jobs in Kenya','Browse hospitality and tourism jobs.'),
('cat_gov','Government & Public','government-public','JOB',198,12,'Government Jobs in Kenya','Browse government job opportunities.'),
('cat_creative','Creative Arts & Design','creative-arts-design','JOB',38,13,'Creative Jobs in Kenya','Browse creative and design jobs.'),
('cat_agri','Agriculture & Agribusiness','agriculture','JOB',52,14,'Agriculture Jobs in Kenya','Browse agriculture jobs.'),
('cat_legal','Legal & Compliance','legal-compliance','JOB',29,15,'Legal Jobs in Kenya','Browse legal and compliance jobs.'),
('cat_cust','Customer Service','customer-service','JOB',48,16,'Customer Service Jobs in Kenya','Browse customer service jobs.'),
('cat_trades','Skilled Trades','skilled-trades','JOB',35,17,'Skilled Trade Jobs in Kenya','Browse skilled trade jobs.'),
('cat_media','Media & Publishing','media-publishing','JOB',27,18,'Media Jobs in Kenya','Browse media and publishing jobs.'),
('cat_np','Nonprofit & Social Services','nonprofit-social-services','JOB',41,19,'Nonprofit Jobs in Kenya','Browse nonprofit jobs.'),
('cat_re','Real Estate','real-estate','JOB',33,20,'Real Estate Jobs in Kenya','Browse real estate jobs.'),
('cat_sec','Security & Defense','security-defense','JOB',22,21,'Security Jobs in Kenya','Browse security and defense jobs.'),
('cat_tele','Telecommunications','telecommunications','JOB',18,22,'Telecom Jobs in Kenya','Browse telecommunications jobs.'),
('cat_energy','Energy & Utilities','energy-utilities','JOB',25,23,'Energy Jobs in Kenya','Browse energy and utility jobs.'),
('cat_sport','Sports & Recreation','sports-recreation','JOB',15,24,'Sports Jobs in Kenya','Browse sports and recreation jobs.'),
('cat_trans','Transport','transport','JOB',31,25,'Transport Jobs in Kenya','Browse transport jobs.'),
('cat_sci','Science & Research','science-research','JOB',19,26,'Research Jobs in Kenya','Browse science and research jobs.'),
('cat_consult','Consulting','consulting','JOB',44,27,'Consulting Jobs in Kenya','Browse consulting jobs.'),
('cat_ins','Insurance','insurance','JOB',21,28,'Insurance Jobs in Kenya','Browse insurance jobs.')`);
  console.log('  ✅ 28 root categories');

  // Subcategories
  await $raw(`INSERT IGNORE INTO categories (id,parent_id,name,slug,type,listing_count,sort_order) VALUES
('cat_tech_sw','cat_tech','Software Development','software-development','JOB',85,1),
('cat_tech_ds','cat_tech','Data Science & Analytics','data-science-analytics','JOB',32,2),
('cat_tech_it','cat_tech','IT Support','it-support','JOB',28,3),
('cat_tech_cyber','cat_tech','Cybersecurity','cybersecurity','JOB',14,4),
('cat_tech_pm','cat_tech','Product Management','product-management','JOB',15,5),
('cat_tech_devops','cat_tech','DevOps & Cloud','devops-cloud','JOB',12,6),
('cat_fin_acc','cat_finance','Accounting','accounting','JOB',48,1),
('cat_fin_fa','cat_finance','Financial Analysis','financial-analysis','JOB',22,2),
('cat_fin_bnk','cat_finance','Banking','banking','JOB',38,3),
('cat_fin_audit','cat_finance','Audit & Compliance','audit-compliance','JOB',18,4),
('cat_eng_civ','cat_eng','Civil Engineering','civil-engineering','JOB',35,1),
('cat_eng_elec','cat_eng','Electrical Engineering','electrical-engineering','JOB',18,2),
('cat_eng_mech','cat_eng','Mechanical Engineering','mechanical-engineering','JOB',15,3),
('cat_mkt_dig','cat_mkt','Digital Marketing','digital-marketing','JOB',38,1),
('cat_mkt_con','cat_mkt','Content & Social Media','content-social-media','JOB',22,2),
('cat_mkt_brand','cat_mkt','Brand Management','brand-management','JOB',14,3)`);
  console.log('  ✅ 18 subcategories');

  // ── 10. Organizations ──
  console.log('Seeding organizations...');
  await $raw(`INSERT IGNORE INTO organizations (id,name,slug,organization_type_id,industry_id,location_id,is_verified,verified_at,website_url,description) VALUES
('org_saf','Safaricom','safaricom','ot_private','ind_tele','loc_nairobi',1,NOW(),'https://www.safaricom.co.ke','Leading communications company in Kenya.'),
('org_kcb','KCB Bank','kcb-bank','ot_private','ind_bank','loc_nairobi',1,NOW(),'https://www.kcbgroup.com','One of the largest commercial banks in East Africa.'),
('org_ncba','NCBA Group','ncba-group','ot_private','ind_bank','loc_nairobi',1,NOW(),'https://www.ncbagroup.com','Financial services group formed from NIC and CBA merger.'),
('org_eq','Equity Bank','equity-bank','ot_private','ind_bank','loc_nairobi',1,NOW(),'https://www.equitybank.co.ke','Financial services group across East and Central Africa.'),
('org_kra','Kenya Revenue Authority','kra','ot_natgov','ind_gov','loc_nairobi',0,NULL,'https://www.kra.go.ke','Revenue collection for the Government of Kenya.'),
('org_tsc','Teachers Service Commission','tsc','ot_natgov','ind_edu','loc_nairobi',0,NULL,'https://www.tsc.go.ke','Constitutional commission for teacher management.'),
('org_kps','Kenya Police Service','kenya-police-service','ot_natgov','ind_sec','loc_nairobi',0,NULL,'https://www.kenyapolice.go.ke','National police service of Kenya.'),
('org_nak','Nakuru County Government','nakuru-county-gov','ot_cntgov','ind_gov','loc_nakuru',0,NULL,NULL,'Governance and service delivery in Nakuru County.'),
('org_ncg','Nairobi County Government','nairobi-county-gov','ot_cntgov','ind_gov','loc_nairobi',0,NULL,NULL,'Governance and service delivery in Nairobi County.'),
('org_mcg','Mombasa County Government','mombasa-county-gov','ot_cntgov','ind_gov','loc_mombasa',0,NULL,NULL,'Governance and service delivery in Mombasa County.'),
('org_eabl','East African Breweries Limited','eabl','ot_private','ind_mfg','loc_nairobi',1,NOW(),'https://www.eabl.com','Leading beverage manufacturer in East Africa.'),
('org_coop','Co-operative Bank','co-operative-bank','ot_private','ind_bank','loc_nairobi',1,NOW(),'https://www.co-opbank.co.ke','Leading commercial bank focused on cooperative societies.'),
('org_uon','University of Nairobi','university-of-nairobi','ot_edu','ind_edu','loc_nairobi',1,NOW(),'https://www.uonbi.ac.ke','Oldest and largest university in Kenya.'),
('org_kenha','Kenya National Highways Authority','kenha','ot_statecorp','ind_gov','loc_nairobi',0,NULL,'https://www.kenha.co.ke','State corp for national trunk roads.')`);
  console.log('  ✅ 14 organizations');

  // ── 11. Listings ──
  console.log('Seeding listings...');
  const now = new Date();
  const postedAt = (d: number) => new Date(now.getTime() - d * 86400000).toISOString().replace('T',' ').slice(0,19);
  const deadlineAt = (d: number) => new Date(now.getTime() + d * 86400000).toISOString().replace('T',' ').slice(0,19);

  // Helper for tags JSON
  const tags = (arr: string[]) => JSON.stringify(arr);

  await $raw(`INSERT IGNORE INTO listings (id,organization_id,category_id,location_id,listing_type_id,title,slug,summary,description,tags,status,is_verified,is_featured,posted_at,deadline_date) VALUES
-- 1. Senior Accountant at Safaricom
('l_01','org_saf','cat_finance','loc_nairobi','lt_job','Senior Accountant','safaricom-senior-accountant','Join Safaricom as a Senior Accountant','We are looking for an experienced Senior Accountant to join our Finance team at Safaricom PLC. The successful candidate will be responsible for financial reporting, budgeting, and ensuring compliance with IFRS standards.','${tags(["Accounting","Finance","CPA","IFRS"])}','PUBLISHED',1,1,'${postedAt(1)}','${deadlineAt(2)}'),
-- 2. Backend Developer at KCB
('l_02','org_kcb','cat_tech',NULL,'lt_job','Backend Developer','kcb-backend-developer','Build robust APIs for digital banking','KCB Bank is seeking a talented Backend Developer to build and maintain robust APIs and microservices that power our digital banking platform serving millions of customers.','${tags(["Backend","API","Node.js","Python"])}','PUBLISHED',1,0,'${postedAt(0)}',NULL),
-- 3. Marketing Intern at NCBA
('l_03','org_ncba','cat_mkt','loc_nairobi','lt_intern','Marketing Intern','ncba-marketing-intern','6-month marketing internship at NCBA Group','NCBA Group is offering an exciting 6-month internship in our Marketing department. Gain hands-on experience in digital marketing, brand management, and content creation.','${tags(["Marketing","Internship","Digital Marketing"])}','PUBLISHED',0,0,'${postedAt(1)}','${deadlineAt(1)}'),
-- 4. Civil Engineer at KeNHA
('l_04','org_kenha','cat_eng','loc_nakuru','lt_job','Civil Engineer','kenha-civil-engineer','Oversee road construction projects in Nakuru','The Kenya National Highways Authority is looking for a qualified Civil Engineer to oversee road construction and maintenance projects in the Nakuru region.','${tags(["Engineering","Infrastructure","Construction"])}','PUBLISHED',0,0,'${postedAt(1)}',NULL),
-- 5. Senior Product Manager M-Pesa at Safaricom
('l_05','org_saf','cat_tech','loc_nairobi','lt_job','Senior Product Manager — M-Pesa','safaricom-senior-pm','Lead product strategy for 30M+ active users','Lead product strategy for 30M+ active users across East Africa. Work with cross-functional teams of 12+ engineers and designers.','${tags(["Product","Fintech","Mobile","Leadership"])}','PUBLISHED',1,1,'${postedAt(1)}',NULL),
-- 6. Financial Analyst at Equity Bank
('l_06','org_eq','cat_finance','loc_nairobi','lt_job','Financial Analyst','equity-financial-analyst','Join Equity Bank as a Financial Analyst','Equity Bank is seeking a motivated Financial Analyst to join our Corporate Finance team for financial modeling and investment analysis.','${tags(["Finance","Analysis","Modeling"])}','PUBLISHED',1,0,'${postedAt(0)}',NULL),
-- 7. Software Engineer at KCB
('l_07','org_kcb','cat_tech',NULL,'lt_job','Software Engineer','kcb-software-engineer','Build innovative banking solutions','Join KCB Bank technology team to build innovative banking solutions using modern frameworks.','${tags(["Software","Full-stack","React","Node.js"])}','PUBLISHED',1,0,'${postedAt(0)}',NULL),
-- 8. Graduate Trainee at NCBA
('l_08','org_ncba','cat_finance','loc_nairobi','lt_job','Graduate Trainee','ncba-graduate-trainee','12-month rotational program','NCBA Group Graduate Trainee Program — a 12-month rotational program across different departments.','${tags(["Graduate","Training","Leadership"])}','PUBLISHED',0,0,'${postedAt(0)}',NULL),
-- 9. HR Manager at Equity Bank
('l_09','org_eq','cat_hr','loc_nairobi','lt_job','HR Manager','equity-hr-manager','Lead HR operations for 500+ employees','Equity Bank is seeking an experienced HR Manager to lead Human Resources operations including recruitment and performance management.','${tags(["HR","Management","People"])}','PUBLISHED',0,0,'${postedAt(2)}','${deadlineAt(3)}'),
-- 10. Junior Developer at KCB
('l_10','org_kcb','cat_tech','loc_nairobi','lt_job','Junior Developer','kcb-junior-developer','Start your dev career at KCB Bank','KCB Bank is looking for a Junior Developer to join our growing technology team. Mentorship provided.','${tags(["Junior","Developer","Entry Level"])}','PUBLISHED',0,0,'${postedAt(1)}','${deadlineAt(5)}'),
-- 11. Data Analyst at KRA
('l_11','org_kra','cat_finance','loc_nairobi','lt_job','Data Analyst','kra-data-analyst','Support data-driven decision making at KRA','The Kenya Revenue Authority is seeking a skilled Data Analyst to support data-driven decision making.','${tags(["Data","Analytics","Statistics"])}','PUBLISHED',0,0,'${postedAt(2)}','${deadlineAt(5)}'),
-- 12. KRA Graduate Trainee
('l_12','org_kra','cat_gov','loc_nairobi','lt_job','KRA Graduate Trainee Program 2025','kra-graduate-trainee','Prestigious 18-month graduate program','The KRA Graduate Trainee Program is a prestigious 18-month program for developing tax administration professionals.','${tags(["Graduate","Government","Tax","Gazette"])}','PUBLISHED',0,0,'${postedAt(5)}','${deadlineAt(14)}'),
-- 13. TSC 5000 Teacher Posts
('l_13','org_tsc','cat_edu','loc_ke','lt_job','TSC — 5,000 Teacher Posts','tsc-5000-teacher-posts','Recruiting 5,000 teachers across all 47 counties','The Teachers Service Commission is recruiting 5,000 teachers for primary and secondary schools across all 47 counties.','${tags(["Teaching","Government","Education"])}','PUBLISHED',0,0,'${postedAt(7)}','${deadlineAt(21)}'),
-- 14. Kenya Police Recruitment
('l_14','org_kps','cat_gov','loc_ke','lt_job','Kenya Police Constable Recruitment','kenya-police-recruitment','Police constable recruitment nationwide','The Kenya Police Service is recruiting police constables for a rigorous 9-month training program.','${tags(["Police","Government","Security","Gazette"])}','PUBLISHED',0,0,'${postedAt(3)}','${deadlineAt(7)}'),
-- 15. Nakuru County Positions
('l_15','org_nak','cat_gov','loc_nakuru','lt_job','Various Positions — Nakuru County','nakuru-county-various','Multiple openings across departments','Nakuru County Government has multiple openings across Health, Education, Public Works, and Administration.','${tags(["County","Government","Multiple Roles"])}','PUBLISHED',0,0,'${postedAt(4)}','${deadlineAt(14)}'),
-- 16. Health Workers Nairobi County
('l_16','org_ncg','cat_health','loc_nairobi','lt_job','Health Workers — Nairobi County','nairobi-county-health','Recruiting nurses, clinical officers, public health officers','Nairobi County Government is recruiting health workers to strengthen healthcare service delivery.','${tags(["Health","County","Government"])}','PUBLISHED',0,0,'${postedAt(5)}','${deadlineAt(18)}'),
-- 17. Engineers Mombasa County
('l_17','org_mcg','cat_eng','loc_mombasa','lt_job','Engineers — Mombasa County','mombasa-county-engineers','Civil, Electrical, Mechanical Engineers needed','Mombasa County Government is seeking qualified Engineers to oversee infrastructure projects.','${tags(["Engineering","County","Government"])}','PUBLISHED',0,0,'${postedAt(6)}','${deadlineAt(7)}'),
-- 18. Junior Accountant at Co-op Bank
('l_18','org_coop','cat_finance','loc_nairobi','lt_job','Junior Accountant','co-op-junior-accountant','Support the Finance team at Co-operative Bank','Co-operative Bank is looking for a Junior Accountant to support bookkeeping, financial reporting, and tax returns.','${tags(["Accounting","Entry Level","Banking"])}','PUBLISHED',0,0,'${postedAt(3)}',NULL),
-- 19. Customer Service at Safaricom
('l_19','org_saf','cat_cust','loc_nairobi','lt_job','Customer Service Representative','safaricom-customer-service','Handle customer inquiries at Safaricom','Safaricom is hiring Customer Service Representatives to handle inquiries, resolve complaints, and provide product information.','${tags(["Customer Service","Entry Level","Telecom"])}','PUBLISHED',0,0,'${postedAt(4)}',NULL),
-- 20. Data Entry at KRA
('l_20','org_kra','cat_ops','loc_nairobi','lt_job','Data Entry Clerk','kra-data-entry','6-month contract for digitization','KRA needs a Data Entry Clerk on a 6-month contract to support digitization of tax records.','${tags(["Data Entry","Contract","Government"])}','PUBLISHED',0,0,'${postedAt(5)}',NULL),
-- 21. Marketing Assistant at EABL
('l_21','org_eabl','cat_mkt','loc_nairobi','lt_job','Marketing Assistant','eabl-marketing-assistant','Support brand management at EABL','East African Breweries Limited is looking for a Marketing Assistant to support brand management.','${tags(["Marketing","FMCG","Entry Level"])}','PUBLISHED',0,0,'${postedAt(6)}',NULL),
-- 22. Finance Intern at Equity
('l_22','org_eq','cat_finance','loc_nairobi','lt_intern','Finance Intern','equity-finance-intern','3-month Finance Internship program','Equity Bank is offering a 3-month Finance Internship for financial analysis and reporting exposure.','${tags(["Finance","Internship","Banking"])}','PUBLISHED',0,0,'${postedAt(7)}',NULL),
-- 23. Software Engineering Intern at Safaricom
('l_23','org_saf','cat_tech','loc_nairobi','lt_intern','Software Engineering Intern','safaricom-software-intern','6-month hands-on engineering internship','Safaricom 6-month Software Engineering Internship offers hands-on experience building mobile and web applications.','${tags(["Software","Internship","Mobile"])}','PUBLISHED',0,0,'${postedAt(7)}',NULL),
-- 24. Mastercard Foundation Scholars
('l_24','org_uon','cat_edu','loc_nairobi','lt_schol','Mastercard Foundation Scholars','mastercard-foundation-scholars','Full scholarship at University of Nairobi','The Mastercard Foundation Scholars Program provides full scholarships covering tuition, accommodation, and stipend.','${tags(["Scholarship","University","Full Sponsorship"])}','PUBLISHED',0,1,'${postedAt(14)}',NULL),
-- 25. KCB Foundation Scholarship
('l_25','org_kcb','cat_edu','loc_ke','lt_schol','KCB Foundation Scholarship','kcb-foundation-scholarship','Tuition + stipend for disadvantaged students','The KCB Foundation Scholarship supports students from disadvantaged backgrounds pursuing tertiary education.','${tags(["Scholarship","Foundation","Tuition"])}','PUBLISHED',0,0,'${postedAt(21)}',NULL),
-- 26. Casual Waitstaff
('l_26',NULL,'cat_hosp','loc_nai_west','lt_casual','Waitstaff','casual-waitstaff','Immediate opening for waitstaff in Westlands','Immediate opening for waitstaff at a busy restaurant in Westlands. No experience needed — training provided.','${tags(["Casual","Hospitality","Waitstaff"])}','PUBLISHED',0,0,'${postedAt(0)}',NULL),
-- 27. Delivery Rider
('l_27',NULL,'cat_log','loc_nai_cbd','lt_casual','Delivery Rider','casual-delivery-rider','Delivery riders needed in Nairobi CBD','Delivery riders needed for a growing logistics company in Nairobi CBD. Must own a motorcycle.','${tags(["Casual","Delivery","Logistics"])}','PUBLISHED',0,0,'${postedAt(0)}',NULL),
-- 28. Farm Worker
('l_28',NULL,'cat_hosp','loc_nak_naivasha','lt_casual','Farm Worker','casual-farm-worker','Farm workers needed at Naivasha flower farm','Farm workers needed at a flower farm in Naivasha. Accommodation and meals provided on-site.','${tags(["Casual","Agriculture","Farm"])}','PUBLISHED',0,0,'${postedAt(1)}',NULL),
-- 29. Shop Assistant
('l_29',NULL,'cat_sales','loc_nai_thikard','lt_casual','Shop Assistant','casual-shop-assistant','Part-time shop assistant along Thika Road','Part-time shop assistant needed at a retail store along Thika Road. Flexible schedule.','${tags(["Part-time","Retail","Shop"])}','PUBLISHED',0,0,'${postedAt(1)}',NULL),
-- 30. Cleaning Staff
('l_30',NULL,'cat_ops','loc_nai_kili','lt_casual','Cleaning Staff','casual-cleaning-staff','Weekend cleaning staff in Kilimani','Weekend cleaning staff needed for office spaces in Kilimani. Work every Saturday and Sunday.','${tags(["Casual","Cleaning","Weekend"])}','PUBLISHED',0,0,'${postedAt(2)}',NULL),
-- 31. Loader
('l_31',NULL,'cat_log','loc_nai_ia','lt_casual','Loader','casual-loader','Warehouse loader needed in Industrial Area','Loaders needed at a warehouse in Industrial Area for the morning shift.','${tags(["Casual","Warehouse","Loading"])}','PUBLISHED',0,0,'${postedAt(3)}',NULL),
-- 32. Marketing Intern at EABL
('l_32','org_eabl','cat_mkt','loc_nairobi','lt_intern','Marketing Intern','eabl-marketing-intern','Structured internship in Marketing at EABL','EABL offers a structured internship program in the Marketing department.','${tags(["Marketing","FMCG","Internship"])}','PUBLISHED',0,0,'${postedAt(7)}',NULL)`);
  console.log('  ✅ 32 listings');

  // ── 12. Listing Job Details ──
  console.log('Seeding listing job details...');
  await $raw(`INSERT IGNORE INTO listing_job_details (id,listing_id,employment_type_id,experience_level_id,education_level_id,workMode,salaryMin,salaryMax,currency_id,salaryDisplay,salaryPeriod) VALUES
('jd_01','l_01','et_ft','el_sen','edl_mas','ONSITE',180000,250000,'cur_kes','RANGE','MONTHLY'),
('jd_02','l_02','et_ft','el_mid','edl_bac','REMOTE',150000,220000,'cur_kes','RANGE','MONTHLY'),
('jd_04','l_04','et_ft','el_mid','edl_bac','ONSITE',120000,180000,'cur_kes','RANGE','MONTHLY'),
('jd_05','l_05','et_ft','el_sen','edl_mas','ONSITE',350000,500000,'cur_kes','RANGE','MONTHLY'),
('jd_06','l_06','et_ft','el_entry','edl_bac','ONSITE',80000,120000,'cur_kes','RANGE','MONTHLY'),
('jd_07','l_07','et_ft','el_mid','edl_bac','REMOTE',140000,200000,'cur_kes','RANGE','MONTHLY'),
('jd_08','l_08','et_ft','el_entry','edl_bac','ONSITE',60000,80000,'cur_kes','RANGE','MONTHLY'),
('jd_09','l_09','et_ft','el_sen','edl_mas','ONSITE',200000,300000,'cur_kes','RANGE','MONTHLY'),
('jd_10','l_10','et_ft','el_entry','edl_bac','ONSITE',70000,100000,'cur_kes','RANGE','MONTHLY'),
('jd_11','l_11','et_ft','el_mid','edl_bac','ONSITE',100000,160000,'cur_kes','RANGE','MONTHLY'),
('jd_12','l_12','et_ft','el_entry','edl_bac','ONSITE',70000,90000,'cur_kes','RANGE','MONTHLY'),
('jd_13','l_13','et_ft','el_entry','edl_dip','ONSITE',30000,50000,'cur_kes','RANGE','MONTHLY'),
('jd_14','l_14','et_ft','el_entry','edl_hs','ONSITE',35000,45000,'cur_kes','RANGE','MONTHLY'),
('jd_15','l_15','et_ft','el_entry','edl_dip','ONSITE',30000,60000,'cur_kes','RANGE','MONTHLY'),
('jd_16','l_16','et_ft','el_entry','edl_dip','ONSITE',40000,80000,'cur_kes','RANGE','MONTHLY'),
('jd_17','l_17','et_ft','el_mid','edl_bac','ONSITE',80000,150000,'cur_kes','RANGE','MONTHLY'),
('jd_18','l_18','et_ft','el_entry','edl_dip','ONSITE',60000,90000,'cur_kes','RANGE','MONTHLY'),
('jd_19','l_19','et_ft','el_entry','edl_dip','ONSITE',35000,50000,'cur_kes','RANGE','MONTHLY'),
('jd_20','l_20','et_ct','el_entry','edl_dip','ONSITE',25000,35000,'cur_kes','RANGE','MONTHLY'),
('jd_21','l_21','et_ft','el_entry','edl_bac','ONSITE',45000,65000,'cur_kes','RANGE','MONTHLY')`);
  console.log('  ✅ 21 job details');

  // ── Summary ──
  console.log('\n=== Seed Complete ===');
  const tables = ['organization_types','industries','currencies','listing_types','employment_types','experience_levels','education_levels','locations','categories','organizations','listings','listing_job_details'];
  for (const t of tables) {
    const r: any[] = await $query(`SELECT COUNT(*) as c FROM ${t}`);
    console.log(`  ${t}: ${r[0].c}`);
  }
}

main()
  .catch((e) => { console.error('SEED ERROR:', e.message?.slice(0, 300)); process.exit(1); })
  .finally(() => prisma.$disconnect());
