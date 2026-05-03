/**
 * Efficient seed: adds missing categories and subcategories.
 * Updates existing matching ones by slug.
 */
const { PrismaClient } = require("@prisma/client");

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL + (process.env.DATABASE_URL.includes("?") ? "&" : "?") + "connection_limit=1&pool_timeout=60" } },
});

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CATS = [
  { s: "technology", n: "Technology & IT", subs: ["Software Engineering","Web Development","Mobile Development","Data Science & Analytics","Cybersecurity","DevOps & Cloud Infrastructure","IT Support & Helpdesk","Network Administration","Quality Assurance & Testing","Database Administration","Systems Architecture","AI & Machine Learning","Blockchain Development","Game Development","Embedded Systems","Technical Project Management","IT Audit","Technical Support Engineering"] },
  { s: "finance-accounting", n: "Finance & Accounting", subs: ["Accounting","Financial Analysis","Audit","Taxation","Treasury Management","Risk & Compliance","Investment Banking","Wealth Management","Financial Planning","Payroll Management","Corporate Finance","Hedge Funds","Private Equity","Venture Capital","Financial Reporting","Credit Analysis","Merchant Banking"] },
  { s: "sales-business-development", n: "Sales & Business Development", subs: ["Business Development","Account Management","Sales Representative","Channel Sales","Customer Success","Corporate Sales","Retail Sales","Sales Operations","Sales Training","Key Account Management","Technical Sales","Sales Engineering","Inside Sales","Field Sales","B2B Sales","B2C Sales","Sales Management","Sales Enablement"] },
  { s: "marketing-communications", n: "Marketing & Communications", subs: ["Digital Marketing","Content Marketing","Brand Management","Public Relations","Social Media Management","SEO & Search Marketing","Market Research","Product Marketing","Event Marketing","Affiliate Marketing","Marketing Automation","Copywriting","Influencer Marketing","Email Marketing","Video Marketing","Guerrilla Marketing","Growth Marketing","Performance Marketing"] },
  { s: "human-resources", n: "Human Resources", subs: ["Recruitment & Talent Acquisition","HR Generalist","Payroll & Compensation","Learning & Development","HR Analytics","Employee Relations","HR Operations","Talent Management","Organizational Development","HR Information Systems","Compensation & Benefits","Diversity & Inclusion","Employer Branding","HR Consulting","Labor Relations","HR Compliance","Workplace Safety"] },
  { s: "engineering", n: "Engineering", subs: ["Civil Engineering","Mechanical Engineering","Electrical Engineering","Industrial Engineering","Project Engineering","Chemical Engineering","Aerospace Engineering","Biomedical Engineering","Environmental Engineering","Materials Engineering","Structural Engineering","Geotechnical Engineering","Petroleum Engineering","Marine Engineering","Automotive Engineering","Nuclear Engineering","Mechatronics"] },
  { s: "healthcare-medical", n: "Healthcare & Medical", subs: ["Nursing","Pharmacy","Medical Doctor","Laboratory Technology","Public Health","Healthcare Administration","Physiotherapy","Occupational Therapy","Radiology & Imaging","Medical Research","Health Informatics","Cardiology","Neurology","Pediatrics","Oncology","Emergency Medicine","Anesthesiology","Psychiatry"] },
  { s: "education-training", n: "Education & Training", subs: ["Teaching","Lecturing","Education Administration","Curriculum Development","Training & Facilitation","E-Learning & Instructional Design","Special Education","Educational Technology","Student Counseling","Academic Research","Early Childhood Education","Primary Education","Secondary Education","Higher Education","Vocational Training","Language Teaching","Educational Psychology"] },
  { s: "operations-administration", n: "Operations & Administration", subs: ["Office Administration","Operations Management","Project Management","Executive Assistant","Program Management","Business Operations","Facilities Management","Administrative Support","Data Entry","Process Improvement","Office Manager","Administrative Coordinator","Receptionist","Project Coordination","Business Support","Administrative Management"] },
  { s: "logistics-supply-chain", n: "Logistics & Supply Chain", subs: ["Procurement","Warehousing","Distribution & Logistics","Inventory Management","Transport Coordination","Supply Chain Planning","Freight Forwarding","Customs Brokerage","Demand Planning","Logistics Analytics","Fleet Management","Return Logistics","Warehouse Operations","Materials Management","Global Logistics","Shipping & Receiving"] },
  { s: "hospitality-tourism", n: "Hospitality & Tourism", subs: ["Hotel Management","Chef & Culinary","Tourism Operations","Front Office","Housekeeping","Food & Beverage","Event Planning","Travel Agency","Casino & Gaming","Resort Management","Concierge Services","Bartending","Restaurant Management","Catering","Spa Management","Cruise Ship Staff"] },
  { s: "specialised-services", n: "Specialised Services", subs: ["Project Management","Operations Manager","Technical Project Manager","Translation & Interpretation"] },
  { s: "agriculture", n: "Agriculture & Agribusiness", subs: ["Agronomy","Farm Management","Agricultural Extension","Livestock Management","Crop Science","Agricultural Engineering","Food Science","Agribusiness","Horticulture","Sustainable Agriculture","Precision Agriculture","Agricultural Economics","Pest Management","Soil Science","Forestry"] },
  { s: "legal-compliance", n: "Legal & Compliance", subs: ["Corporate Law","Legal Advisory","Contract Management","Compliance","Paralegal Services","Intellectual Property","Litigation","Labor Law","Tax Law","Real Estate Law","Regulatory Affairs","International Law","Environmental Law","Healthcare Law","Criminal Law","Family Law","Legal Research"] },
  { s: "creative-arts-design", n: "Creative Arts & Design", subs: ["Graphic Design","UX/UI Design","Multimedia Design","Photography","Video Editing & Production","Animation","Art Direction","Illustration","Interior Design","Fashion Design","Product Design","Motion Graphics","3D Modeling","Visual Arts","Industrial Design","Jewelry Design","Textile Design","Ceramic Design"] },
  { s: "architecture-construction", n: "Architecture & Construction", subs: ["Architecture","Construction Management","Quantity Surveying","Site Supervision","Urban Planning","Landscape Architecture","Building Surveying","Construction Safety","Estimating","Project Coordination","Interior Architecture","Structural Engineering","Construction Equipment Operation","Building Inspection","Green Building","Construction Estimating"] },
  { s: "science-research", n: "Science & Research", subs: ["Laboratory Research","Chemistry","Biology","Environmental Science","Physics","Research & Development","Biotechnology","Clinical Research","Geology","Forensic Science","Marine Biology","Astronomy","Neuroscience","Genetics","Microbiology","Biochemistry"] },
  { s: "customer-service", n: "Customer Service", subs: ["Call Center","Customer Support","Client Relations","Helpdesk","Customer Experience","Technical Support","Chat Support","Customer Service Management","Complaint Resolution","Omnichannel Support","Customer Success Specialist","Service Delivery","Customer Support Engineer","Call Center Manager","Client Services","Customer Care"] },
  { s: "skilled-trades", n: "Skilled Trades & Manual Work", subs: ["Electrical Installation","Plumbing","Welding & Fabrication","Carpentry","Maintenance & Repair","Machinery Operation","HVAC Installation & Repair","Painting & Finishing","Masonry","Automotive Mechanics","Tool Making","Cabinet Making","Flooring Installation","Roofing","Glazing","Locksmith","Boilermaking"] },
  { s: "media-publishing", n: "Media & Publishing", subs: ["Journalism","Editing & Proofreading","Publishing","Broadcasting","Content Creation","Copywriting","Technical Writing","Radio Production","Television Production","Digital Publishing","News Reporting","Magazine Publishing","Book Publishing","Copy Editing","Proofreading","Acquisitions Editor"] },
  { s: "nonprofit", n: "Nonprofit & Social Services", subs: ["Social Work","Community Outreach","Fundraising","Grant Writing","Volunteer Coordination","NGO Management","Program Development","Advocacy","Humanitarian Aid","Counseling","Case Management","Community Organizing","Philanthropy","Foundation Management","Social Enterprise","Disaster Relief"] },
  { s: "real-estate", n: "Real Estate", subs: ["Property Management","Real Estate Agent","Real Estate Development","Facilities Management","Valuation & Appraisal","Commercial Real Estate","Residential Real Estate","Real Estate Investment","Property Acquisition","Leasing","Real Estate Broker","Asset Management","Real Estate Marketing","Property Sales","Real Estate Consulting","Title Search"] },
  { s: "fitness-wellness", n: "Fitness & Wellness", subs: ["Personal Training","Gym Management","Nutrition & Dietetics","Yoga Instruction","Wellness Coaching","Group Fitness Instruction","Sports Coaching","Physical Therapy","Massage Therapy","Sports Medicine","Pilates Instruction","CrossFit Training","Wellness Programming","Health Coaching","Fitness Consulting"] },
  { s: "government-public-sector", n: "Government & Public Sector", subs: ["Public Administration","Policy Analysis","Government Relations","Public Affairs","Diplomacy","Public Policy","Civil Service","Urban Development","Public Safety","Emergency Management","Foreign Service","Legislative Affairs","Public Finance","Government Programs","Regulatory Enforcement"] },
  { s: "consulting", n: "Consulting", subs: ["Management Consulting","Strategy Consulting","IT Consulting","HR Consulting","Financial Consulting","Operations Consulting","Business Analysis","Organizational Consulting","Sustainability Consulting","Risk Consulting","Marketing Consulting","Sales Consulting","Supply Chain Consulting","Technology Consulting","Strategic Planning","Business Transformation"] },
  { s: "insurance", n: "Insurance", subs: ["Underwriting","Claims Adjustment","Insurance Sales","Risk Assessment","Insurance Broker","Actuarial Science","Policy Administration","Loss Control","Reinsurance","Insurance Analytics","Life Insurance","Health Insurance","Property Insurance","Casualty Insurance","Insurance Underwriting"] },
  { s: "transportation", n: "Transportation", subs: ["Truck Driving","Fleet Management","Dispatching","Pilot","Maritime","Railroad Operations","Delivery Services","Transportation Planning","Route Optimization","Logistics Coordination","Air Traffic Control","Shipping Coordination","Public Transportation","Freight Broker","Transportation Safety"] },
  { s: "security-services", n: "Security Services", subs: ["Physical Security","Surveillance","Loss Prevention","Executive Protection","Security Management","Access Control","Emergency Response","Security Systems","Investigations","Cyber-Physical Security","Armored Transport","K9 Units","Event Security","Corporate Security","Residential Security"] },
  { s: "environmental-sustainability", n: "Environmental & Sustainability", subs: ["Environmental Management","Sustainability","Environmental Compliance","Renewable Energy","Waste Management","Conservation","Environmental Impact Assessment","Carbon Management","Water Resources","Climate Change","Environmental Education","Green Technology","Sustainable Design","Environmental Policy","Ecology"] },
  { s: "international-development", n: "International Development", subs: ["Development Programs","Humanitarian Aid","Project Management","Monitoring & Evaluation","Community Development","Economic Development","Global Health","Food Security","Gender Equality","Capacity Building","Disaster Risk Reduction","Water & Sanitation","Livelihoods","Refugee Support","Microfinance"] },
  { s: "entertainment", n: "Entertainment & Arts", subs: ["Events Management","Music Production","Film Production","Theatre","Talent Management","Concert Promotion","Venue Management","Stage Production","Performing Arts","Entertainment Law","Casting","Sound Engineering","Lighting Design","Choreography","Circus Arts"] },
  { s: "veterinary", n: "Veterinary & Animal Care", subs: ["Veterinary Medicine","Veterinary Surgery","Animal Care","Veterinary Technician","Veterinary Research","Zoology","Wildlife Care","Veterinary Public Health","Animal Nutrition","Veterinary Pharmacology","Equine Medicine","Exotic Animal Care","Veterinary Dentistry","Animal Behavior"] },
  { s: "dental", n: "Dental & Oral Health", subs: ["Dentistry","Dental Hygiene","Dental Assisting","Orthodontics","Oral Surgery","Pediatric Dentistry","Periodontics","Endodontics","Dental Laboratory","Dental Research","Prosthodontics","Dental Radiology","Oral Pathology","Dental Public Health"] },
  { s: "sports-recreation", n: "Sports & Recreation", subs: ["Sports Coaching","Athletic Training","Sports Management","Recreation Management","Sports Medicine","Sports Psychology","Sports Broadcasting","Sports Journalism","Professional Athlete","Referee & Officiating","Outdoor Recreation","Camp Management","Sports Facility Management"] },
  { s: "telecommunications", n: "Telecommunications", subs: ["Network Engineering","Telecom Sales","Wireless Communications","Fiber Optics","Satellite Communications","VoIP Engineering","Telecom Infrastructure","Broadband Technology","Telecom Regulatory Affairs","5G Technology","Telecom Project Management","Radio Frequency Engineering"] },
  { s: "energy-utilities", n: "Energy & Utilities", subs: ["Power Generation","Renewable Energy","Nuclear Energy","Oil & Gas","Utility Management","Energy Trading","Power Distribution","Electric Grid Management","Water Utilities","Energy Efficiency","Smart Grid Technology","Environmental Compliance"] },
  { s: "mining-resources", n: "Mining & Natural Resources", subs: ["Mining Engineering","Geology","Mine Operations","Mineral Processing","Exploration Geology","Mine Safety","Quarry Management","Metallurgy","Resource Estimation","Environmental Reclamation","Mining Equipment Operation"] },
  { s: "manufacturing", n: "Manufacturing", subs: ["Production Management","Quality Control","Process Engineering","Assembly Line Work","Plant Management","Lean Manufacturing","Six Sigma","Industrial Automation","Product Assembly","Machine Operation","Printing Production","Packaging"] },
  { s: "retail", n: "Retail & E-Commerce", subs: ["Retail Management","Merchandising","Buying & Procurement","Visual Merchandising","Store Operations","Retail Sales","Inventory Control","Category Management","Retail Marketing","E-Commerce","Omnichannel Retail","Customer Service"] },
  { s: "aviation", n: "Aviation & Aerospace", subs: ["Commercial Pilot","Aircraft Maintenance","Aviation Management","Air Traffic Control","Flight Attendant","Aviation Safety","Aerospace Engineering","Avionics","Airport Operations","Ground Handling","Aviation Security"] },
  { s: "fashion-beauty", n: "Fashion & Beauty", subs: ["Fashion Design","Cosmetology","Beauty Therapy","Hair Styling","Makeup Artistry","Fashion Merchandising","Textile Design","Modeling","Personal Styling","Spa & Wellness","Nail Technology","Fragrance & Perfumery"] },
];

async function run() {
  console.log(`Seeding ${CATS.length} categories...`);
  let newCats = 0, newSubs = 0;

  // Pre-load existing
  const existing = await p.category.findMany({ select: { id: true, slug: true } });
  const map = new Map(existing.map(c => [c.slug, c.id]));

  for (let i = 0; i < CATS.length; i++) {
    const c = CATS[i];
    let catId: string;

    if (map.has(c.s)) {
      await p.category.update({ where: { slug: c.s }, data: { name: c.n, sortOrder: i } });
      catId = map.get(c.s)!;
    } else {
      const created = await p.category.create({ data: { slug: c.s, name: c.n, sortOrder: i } });
      catId = created.id;
      newCats++;
      map.set(c.s, catId);
    }

    // Batch subcategories: find existing for this cat
    const existingSubs = await p.subcategory.findMany({ where: { categoryId: catId }, select: { slug: true } });
    const subSet = new Set(existingSubs.map(s => s.slug));

    const toCreate = c.subs.filter(n => !subSet.has(slugify(n)));
    if (toCreate.length > 0) {
      await p.subcategory.createMany({
        data: toCreate.map((name, j) => ({
          slug: slugify(name),
          name,
          categoryId: catId,
          sortOrder: existingSubs.length + j,
        })),
        skipDuplicates: true,
      });
      newSubs += toCreate.length;
    }

    process.stdout.write(`\r  ${i + 1}/${CATS.length} ${c.n} (+${toCreate.length} subs)`);
  }

  console.log(`\nDone! ${newCats} new categories, ${newSubs} new subcategories.`);
  await p.$disconnect();
}

run().catch(e => { console.error(e.message); process.exit(1); });
