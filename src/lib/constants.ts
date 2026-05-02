// ─── Organization Types ───
export const ORG_TYPES = [
  { value: "PRIVATE", label: "Private Sector Companies" },
  { value: "SMALL_BUSINESS", label: "Small & Medium Businesses (SMEs)" },
  { value: "STARTUP", label: "Startups & Emerging Companies" },
  { value: "NGO", label: "Non-Governmental Organizations (NGOs)" },
  { value: "INTERNATIONAL_ORG", label: "International Organizations & UN Agencies" },
  { value: "NATIONAL_GOV", label: "National Government" },
  { value: "COUNTY_GOV", label: "County Governments" },
  { value: "STATE_CORPORATION", label: "State Corporations & Parastatals" },
  { value: "EDUCATION", label: "Universities & Academic Institutions" },
  { value: "FOUNDATION", label: "Foundations & Philanthropic Organizations" },
  { value: "RELIGIOUS_ORG", label: "Religious Organizations" },
] as const;

// ─── Organization Industries ───
export const ORG_INDUSTRIES = [
  { value: "AGRICULTURE", label: "Agriculture, Forestry & Fishing" },
  { value: "AUTOMOTIVE", label: "Automotive & Vehicle Manufacturing" },
  { value: "AVIATION", label: "Aviation & Aerospace" },
  { value: "BANKING", label: "Banking & Financial Services" },
  { value: "CONSTRUCTION", label: "Construction & Civil Engineering" },
  { value: "CONSULTING", label: "Consulting & Professional Services" },
  { value: "CONSUMER_GOODS", label: "Consumer Goods & Manufacturing" },
  { value: "EDUCATION", label: "Education & Training" },
  { value: "ENERGY", label: "Energy, Power & Utilities" },
  { value: "ENVIRONMENT", label: "Environment & Sustainability" },
  { value: "FINTECH", label: "Financial Technology (FinTech)" },
  { value: "FOOD_BEVERAGE", label: "Food & Beverage Production" },
  { value: "GOVERNMENT_PUBLIC_ADMIN", label: "Government & Public Administration" },
  { value: "HEALTHCARE", label: "Healthcare & Medical Services" },
  { value: "HOSPITALITY_TOURISM", label: "Hospitality, Travel & Tourism" },
  { value: "HUMAN_RESOURCES", label: "Human Resources & Recruitment" },
  { value: "INFORMATION_TECHNOLOGY", label: "Information Technology & Software" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "INTERNATIONAL_DEVELOPMENT", label: "International Development & Humanitarian Aid" },
  { value: "LEGAL", label: "Legal Services" },
  { value: "LOGISTICS_SUPPLY_CHAIN", label: "Logistics, Transport & Supply Chain" },
  { value: "MANUFACTURING", label: "Manufacturing & Industrial Production" },
  { value: "MARKETING_ADVERTISING", label: "Marketing, Advertising & Media" },
  { value: "MEDIA_ENTERTAINMENT", label: "Media, Entertainment & Broadcasting" },
  { value: "MINING", label: "Mining & Natural Resources" },
  { value: "NON_PROFIT", label: "Non-Profit & Social Impact" },
  { value: "PHARMACEUTICAL", label: "Pharmaceuticals & Biotechnology" },
  { value: "REAL_ESTATE", label: "Real Estate & Property Management" },
  { value: "RESEARCH", label: "Research & Scientific Institutions" },
  { value: "RETAIL", label: "Retail & E-Commerce" },
  { value: "SECURITY_DEFENSE", label: "Security & Defense" },
  { value: "SPORTS", label: "Sports & Recreation" },
  { value: "TELECOMMUNICATIONS", label: "Telecommunications" },
  { value: "TEXTILES_APPAREL", label: "Textiles, Apparel & Fashion" },
  { value: "WATER_SANITATION", label: "Water, Sanitation & Waste Management" },
] as const;

// ─── Kenya Counties (47) ───
export const KE_COUNTIES = [
  // Former Central Province
  "Kiambu", "Kirinyaga", "Murang'a", "Nyandarua", "Nyeri",
  // Former Coast Province
  "Kilifi", "Kwale", "Lamu", "Mombasa", "Taita Taveta", "Tana River",
  // Former Eastern Province
  "Embu", "Isiolo", "Kitui", "Machakos", "Makueni", "Marsabit", "Meru", "Tharaka Nithi",
  // Former Nairobi Province
  "Nairobi",
  // Former North Eastern Province
  "Garissa", "Mandera", "Wajir",
  // Former Nyanza Province
  "Homa Bay", "Kisii", "Kisumu", "Migori", "Nyamira", "Siaya",
  // Former Rift Valley Province
  "Baringo", "Bomet", "Elgeyo Marakwet", "Kajiado", "Kericho", "Laikipia",
  "Nakuru", "Nandi", "Narok", "Samburu", "Trans Nzoia", "Turkana",
  "Uasin Gishu", "West Pokot",
  // Former Western Province
  "Bungoma", "Busia", "Kakamega", "Vihiga",
] as const;

// ─── Province groupings (for SEO breadcrumbs) ───
export const PROVINCES: Record<string, readonly string[]> = {
  "Central": ["Kiambu", "Kirinyaga", "Murang'a", "Nyandarua", "Nyeri"],
  "Coast": ["Kilifi", "Kwale", "Lamu", "Mombasa", "Taita Taveta", "Tana River"],
  "Eastern": ["Embu", "Isiolo", "Kitui", "Machakos", "Makueni", "Marsabit", "Meru", "Tharaka Nithi"],
  "Nairobi": ["Nairobi"],
  "North Eastern": ["Garissa", "Mandera", "Wajir"],
  "Nyanza": ["Homa Bay", "Kisii", "Kisumu", "Migori", "Nyamira", "Siaya"],
  "Rift Valley": ["Baringo", "Bomet", "Elgeyo Marakwet", "Kajiado", "Kericho", "Laikipia", "Nakuru", "Nandi", "Narok", "Samburu", "Trans Nzoia", "Turkana", "Uasin Gishu", "West Pokot"],
  "Western": ["Bungoma", "Busia", "Kakamega", "Vihiga"],
};

// ─── All Locations (KE + International) ───
export interface CountryLocation {
  name: string;
  code: string;
  regions: string[];
}

export const ALL_LOCATIONS: CountryLocation[] = [
  { name: "Kenya", code: "KE", regions: [...KE_COUNTIES] },
  { name: "Uganda", code: "UG", regions: ["Kampala", "Entebbe", "Jinja", "Mbale", "Gulu", "Mbarara", "Masaka", "Fort Portal", "Arua", "Lira"] },
  { name: "Tanzania", code: "TZ", regions: ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar City", "Mbeya", "Morogoro", "Tanga", "Kigoma", "Mtwara"] },
  { name: "Rwanda", code: "RW", regions: ["Kigali", "Butare", "Gisenyi", "Ruhengeri", "Cyangugu", "Byumba", "Kibuye", "Gitarama"] },
  { name: "Ethiopia", code: "ET", regions: ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar", "Hawassa", "Jimma", "Adama", "Harar"] },
  { name: "Nigeria", code: "NG", regions: ["Lagos", "Abuja", "Kano", "Ibadan", "Kaduna", "Port Harcourt", "Benin City", "Maiduguri", "Zaria", "Jos"] },
  { name: "South Africa", code: "ZA", regions: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Pietermaritzburg", "Kimberley", "Nelspruit"] },
  { name: "Ghana", code: "GH", regions: ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Cape Coast", "Tema", "Sunyari", "Wa", "Bolgatanga"] },
  { name: "United States", code: "US", regions: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"] },
  { name: "United Kingdom", code: "GB", regions: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Newcastle", "Sheffield", "Bristol", "Edinburgh"] },
  { name: "Canada", code: "CA", regions: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Halifax"] },
];

// ─── Job Categories (49 top-level with subcategories) ───
export interface JobCategory {
  value: string;
  label: string;
  slug: string;
  subcategories: { value: string; label: string; slug: string }[];
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const JOB_CATEGORIES: JobCategory[] = [
  { value: "TECHNOLOGY", label: "Technology & IT", slug: "technology",
    subcategories: [
      { value: "SOFTWARE_ENGINEERING", label: "Software Engineering", slug: "software-engineering" },
      { value: "WEB_DEVELOPMENT", label: "Web Development", slug: "web-development" },
      { value: "MOBILE_DEVELOPMENT", label: "Mobile Development", slug: "mobile-development" },
      { value: "DATA_SCIENCE", label: "Data Science & Analytics", slug: "data-science" },
      { value: "CYBER_SECURITY", label: "Cybersecurity", slug: "cybersecurity" },
      { value: "DEVOPS_CLOUD", label: "DevOps & Cloud Infrastructure", slug: "devops-cloud" },
      { value: "IT_SUPPORT", label: "IT Support & Helpdesk", slug: "it-support" },
      { value: "NETWORK_ADMIN", label: "Network Administration", slug: "network-administration" },
      { value: "QA_TESTING", label: "Quality Assurance & Testing", slug: "qa-testing" },
      { value: "DATABASE_ADMIN", label: "Database Administration", slug: "database-administration" },
      { value: "SYSTEMS_ARCHITECTURE", label: "Systems Architecture", slug: "systems-architecture" },
      { value: "AI_MACHINE_LEARNING", label: "AI & Machine Learning", slug: "ai-machine-learning" },
      { value: "BLOCKCHAIN", label: "Blockchain Development", slug: "blockchain" },
      { value: "GAME_DEVELOPMENT", label: "Game Development", slug: "game-development" },
      { value: "EMBEDDED_SYSTEMS", label: "Embedded Systems", slug: "embedded-systems" },
      { value: "TECH_PROJECT_MANAGEMENT", label: "Technical Project Management", slug: "technical-project-management" },
      { value: "IT_AUDIT", label: "IT Audit", slug: "it-audit" },
      { value: "TECH_SUPPORT_ENGINEER", label: "Technical Support Engineering", slug: "technical-support-engineering" },
    ]},
  { value: "FINANCE_ACCOUNTING", label: "Finance & Accounting", slug: "finance-accounting",
    subcategories: [
      { value: "ACCOUNTING", label: "Accounting", slug: "accounting" },
      { value: "FINANCIAL_ANALYSIS", label: "Financial Analysis", slug: "financial-analysis" },
      { value: "AUDIT", label: "Audit", slug: "audit" },
      { value: "TAX", label: "Taxation", slug: "taxation" },
      { value: "TREASURY", label: "Treasury Management", slug: "treasury-management" },
      { value: "RISK_COMPLIANCE", label: "Risk & Compliance", slug: "risk-compliance" },
      { value: "INVESTMENT_BANKING", label: "Investment Banking", slug: "investment-banking" },
      { value: "WEALTH_MANAGEMENT", label: "Wealth Management", slug: "wealth-management" },
      { value: "FINANCIAL_PLANNING", label: "Financial Planning", slug: "financial-planning" },
      { value: "PAYROLL", label: "Payroll Management", slug: "payroll-management" },
      { value: "CORPORATE_FINANCE", label: "Corporate Finance", slug: "corporate-finance" },
      { value: "HEDGE_FUNDS", label: "Hedge Funds", slug: "hedge-funds" },
      { value: "PRIVATE_EQUITY", label: "Private Equity", slug: "private-equity" },
      { value: "VENTURE_CAPITAL", label: "Venture Capital", slug: "venture-capital" },
      { value: "FINANCIAL_REPORTING", label: "Financial Reporting", slug: "financial-reporting" },
      { value: "CREDIT_ANALYSIS", label: "Credit Analysis", slug: "credit-analysis" },
      { value: "MERCHANT_BANKING", label: "Merchant Banking", slug: "merchant-banking" },
    ]},
  { value: "SALES_BUSINESS", label: "Sales & Business Development", slug: "sales-business-development",
    subcategories: [
      { value: "BUSINESS_DEVELOPMENT", label: "Business Development", slug: "business-development" },
      { value: "ACCOUNT_MANAGEMENT", label: "Account Management", slug: "account-management" },
      { value: "SALES_REPRESENTATIVE", label: "Sales Representative", slug: "sales-representative" },
      { value: "CHANNEL_SALES", label: "Channel Sales", slug: "channel-sales" },
      { value: "CUSTOMER_SUCCESS", label: "Customer Success", slug: "customer-success" },
      { value: "CORPORATE_SALES", label: "Corporate Sales", slug: "corporate-sales" },
      { value: "RETAIL_SALES", label: "Retail Sales", slug: "retail-sales" },
      { value: "SALES_OPERATIONS", label: "Sales Operations", slug: "sales-operations" },
      { value: "SALES_TRAINING", label: "Sales Training", slug: "sales-training" },
      { value: "KEY_ACCOUNT_MANAGEMENT", label: "Key Account Management", slug: "key-account-management" },
      { value: "TECHNICAL_SALES", label: "Technical Sales", slug: "technical-sales" },
      { value: "SALES_ENGINEERING", label: "Sales Engineering", slug: "sales-engineering" },
      { value: "INSIDE_SALES", label: "Inside Sales", slug: "inside-sales" },
      { value: "FIELD_SALES", label: "Field Sales", slug: "field-sales" },
      { value: "B2B_SALES", label: "B2B Sales", slug: "b2b-sales" },
      { value: "B2C_SALES", label: "B2C Sales", slug: "b2c-sales" },
      { value: "SALES_MANAGEMENT", label: "Sales Management", slug: "sales-management" },
      { value: "SALES_ENABLEMENT", label: "Sales Enablement", slug: "sales-enablement" },
    ]},
  { value: "MARKETING_COMMUNICATIONS", label: "Marketing & Communications", slug: "marketing-communications",
    subcategories: [
      { value: "DIGITAL_MARKETING", label: "Digital Marketing", slug: "digital-marketing" },
      { value: "CONTENT_MARKETING", label: "Content Marketing", slug: "content-marketing" },
      { value: "BRAND_MANAGEMENT", label: "Brand Management", slug: "brand-management" },
      { value: "PUBLIC_RELATIONS", label: "Public Relations", slug: "public-relations" },
      { value: "SOCIAL_MEDIA", label: "Social Media Management", slug: "social-media" },
      { value: "SEO_SEM", label: "SEO & Search Marketing", slug: "seo-sem" },
      { value: "MARKET_RESEARCH", label: "Market Research", slug: "market-research" },
      { value: "PRODUCT_MARKETING", label: "Product Marketing", slug: "product-marketing" },
      { value: "EVENT_MARKETING", label: "Event Marketing", slug: "event-marketing" },
      { value: "AFFILIATE_MARKETING", label: "Affiliate Marketing", slug: "affiliate-marketing" },
      { value: "MARKETING_AUTOMATION", label: "Marketing Automation", slug: "marketing-automation" },
      { value: "COPYWRITING", label: "Copywriting", slug: "copywriting" },
      { value: "INFLUENCER_MARKETING", label: "Influencer Marketing", slug: "influencer-marketing" },
      { value: "EMAIL_MARKETING", label: "Email Marketing", slug: "email-marketing" },
      { value: "VIDEO_MARKETING", label: "Video Marketing", slug: "video-marketing" },
      { value: "GUERRILLA_MARKETING", label: "Guerrilla Marketing", slug: "guerrilla-marketing" },
      { value: "GROWTH_MARKETING", label: "Growth Marketing", slug: "growth-marketing" },
      { value: "PERFORMANCE_MARKETING", label: "Performance Marketing", slug: "performance-marketing" },
    ]},
  { value: "HUMAN_RESOURCES", label: "Human Resources", slug: "human-resources",
    subcategories: [
      { value: "RECRUITMENT", label: "Recruitment & Talent Acquisition", slug: "recruitment" },
      { value: "HR_GENERALIST", label: "HR Generalist", slug: "hr-generalist" },
      { value: "PAYROLL", label: "Payroll & Compensation", slug: "payroll" },
      { value: "LEARNING_DEVELOPMENT", label: "Learning & Development", slug: "learning-development" },
      { value: "HR_ANALYTICS", label: "HR Analytics", slug: "hr-analytics" },
      { value: "EMPLOYEE_RELATIONS", label: "Employee Relations", slug: "employee-relations" },
      { value: "HR_OPERATIONS", label: "HR Operations", slug: "hr-operations" },
      { value: "TALENT_MANAGEMENT", label: "Talent Management", slug: "talent-management" },
      { value: "ORGANIZATIONAL_DEVELOPMENT", label: "Organizational Development", slug: "organizational-development" },
      { value: "HRIS", label: "HR Information Systems", slug: "hris" },
      { value: "COMPENSATION_BENEFITS", label: "Compensation & Benefits", slug: "compensation-benefits" },
      { value: "DIVERSITY_INCLUSION", label: "Diversity & Inclusion", slug: "diversity-inclusion" },
      { value: "EMPLOYER_BRANDING", label: "Employer Branding", slug: "employer-branding" },
      { value: "HR_CONSULTING", label: "HR Consulting", slug: "hr-consulting" },
      { value: "LABOR_RELATIONS", label: "Labor Relations", slug: "labor-relations" },
      { value: "HR_COMPLIANCE", label: "HR Compliance", slug: "hr-compliance" },
      { value: "WORKPLACE_SAFETY", label: "Workplace Safety", slug: "workplace-safety" },
    ]},
  { value: "ENGINEERING", label: "Engineering", slug: "engineering",
    subcategories: [
      { value: "CIVIL_ENGINEERING", label: "Civil Engineering", slug: "civil-engineering" },
      { value: "MECHANICAL_ENGINEERING", label: "Mechanical Engineering", slug: "mechanical-engineering" },
      { value: "ELECTRICAL_ENGINEERING", label: "Electrical Engineering", slug: "electrical-engineering" },
      { value: "INDUSTRIAL_ENGINEERING", label: "Industrial Engineering", slug: "industrial-engineering" },
      { value: "PROJECT_ENGINEERING", label: "Project Engineering", slug: "project-engineering" },
      { value: "CHEMICAL_ENGINEERING", label: "Chemical Engineering", slug: "chemical-engineering" },
      { value: "AEROSPACE_ENGINEERING", label: "Aerospace Engineering", slug: "aerospace-engineering" },
      { value: "BIOMEDICAL_ENGINEERING", label: "Biomedical Engineering", slug: "biomedical-engineering" },
      { value: "ENVIRONMENTAL_ENGINEERING", label: "Environmental Engineering", slug: "environmental-engineering" },
      { value: "MATERIALS_ENGINEERING", label: "Materials Engineering", slug: "materials-engineering" },
      { value: "STRUCTURAL_ENGINEERING", label: "Structural Engineering", slug: "structural-engineering" },
      { value: "GEOTECHNICAL_ENGINEERING", label: "Geotechnical Engineering", slug: "geotechnical-engineering" },
      { value: "PETROLEUM_ENGINEERING", label: "Petroleum Engineering", slug: "petroleum-engineering" },
      { value: "MARINE_ENGINEERING", label: "Marine Engineering", slug: "marine-engineering" },
      { value: "AUTOMOTIVE_ENGINEERING", label: "Automotive Engineering", slug: "automotive-engineering" },
      { value: "NUCLEAR_ENGINEERING", label: "Nuclear Engineering", slug: "nuclear-engineering" },
      { value: "MECHATRONICS", label: "Mechatronics", slug: "mechatronics" },
    ]},
  { value: "HEALTHCARE", label: "Healthcare & Medical", slug: "healthcare-medical",
    subcategories: [
      { value: "NURSING", label: "Nursing", slug: "nursing" },
      { value: "PHARMACY", label: "Pharmacy", slug: "pharmacy" },
      { value: "MEDICAL_DOCTOR", label: "Medical Doctor", slug: "medical-doctor" },
      { value: "LAB_TECHNOLOGY", label: "Laboratory Technology", slug: "laboratory-technology" },
      { value: "PUBLIC_HEALTH", label: "Public Health", slug: "public-health" },
      { value: "HEALTH_ADMIN", label: "Healthcare Administration", slug: "healthcare-administration" },
      { value: "PHYSIOTHERAPY", label: "Physiotherapy", slug: "physiotherapy" },
      { value: "OCCUPATIONAL_THERAPY", label: "Occupational Therapy", slug: "occupational-therapy" },
      { value: "RADIOLOGY", label: "Radiology & Imaging", slug: "radiology" },
      { value: "MEDICAL_RESEARCH", label: "Medical Research", slug: "medical-research" },
      { value: "HEALTH_INFORMATICS", label: "Health Informatics", slug: "health-informatics" },
      { value: "CARDIOLOGY", label: "Cardiology", slug: "cardiology" },
      { value: "NEUROLOGY", label: "Neurology", slug: "neurology" },
      { value: "PEDIATRICS", label: "Pediatrics", slug: "pediatrics" },
      { value: "ONCOLOGY", label: "Oncology", slug: "oncology" },
      { value: "EMERGENCY_MEDICINE", label: "Emergency Medicine", slug: "emergency-medicine" },
      { value: "ANESTHESIOLOGY", label: "Anesthesiology", slug: "anesthesiology" },
      { value: "PSYCHIATRY", label: "Psychiatry", slug: "psychiatry" },
    ]},
  { value: "EDUCATION", label: "Education & Training", slug: "education-training",
    subcategories: [
      { value: "TEACHING", label: "Teaching", slug: "teaching" },
      { value: "LECTURING", label: "Lecturing", slug: "lecturing" },
      { value: "EDUCATION_ADMIN", label: "Education Administration", slug: "education-administration" },
      { value: "CURRICULUM_DEVELOPMENT", label: "Curriculum Development", slug: "curriculum-development" },
      { value: "TRAINING", label: "Training & Facilitation", slug: "training" },
      { value: "E_LEARNING", label: "E-Learning & Instructional Design", slug: "e-learning" },
      { value: "SPECIAL_EDUCATION", label: "Special Education", slug: "special-education" },
      { value: "EDUCATIONAL_TECHNOLOGY", label: "Educational Technology", slug: "educational-technology" },
      { value: "STUDENT_COUNSELING", label: "Student Counseling", slug: "student-counseling" },
      { value: "ACADEMIC_RESEARCH", label: "Academic Research", slug: "academic-research" },
      { value: "EARLY_CHILDHOOD", label: "Early Childhood Education", slug: "early-childhood" },
      { value: "PRIMARY_EDUCATION", label: "Primary Education", slug: "primary-education" },
      { value: "SECONDARY_EDUCATION", label: "Secondary Education", slug: "secondary-education" },
      { value: "HIGHER_EDUCATION", label: "Higher Education", slug: "higher-education" },
      { value: "VOCATIONAL_TRAINING", label: "Vocational Training", slug: "vocational-training" },
      { value: "LANGUAGE_TEACHING", label: "Language Teaching", slug: "language-teaching" },
      { value: "EDUCATIONAL_PSYCHOLOGY", label: "Educational Psychology", slug: "educational-psychology" },
    ]},
  { value: "GOVERNMENT_PUBLIC_SECTOR", label: "Government & Public Sector", slug: "government-public-sector",
    subcategories: [
      { value: "PUBLIC_ADMINISTRATION", label: "Public Administration", slug: "public-administration" },
      { value: "POLICY_ANALYSIS", label: "Policy Analysis", slug: "policy-analysis" },
      { value: "GOVERNMENT_RELATIONS", label: "Government Relations", slug: "government-relations" },
      { value: "PUBLIC_AFFAIRS", label: "Public Affairs", slug: "public-affairs" },
      { value: "DIPLOMACY", label: "Diplomacy", slug: "diplomacy" },
      { value: "PUBLIC_POLICY", label: "Public Policy", slug: "public-policy" },
      { value: "CIVIL_SERVICE", label: "Civil Service", slug: "civil-service" },
      { value: "URBAN_DEVELOPMENT", label: "Urban Development", slug: "urban-development" },
      { value: "PUBLIC_SAFETY", label: "Public Safety", slug: "public-safety" },
      { value: "EMERGENCY_MANAGEMENT", label: "Emergency Management", slug: "emergency-management" },
      { value: "FOREIGN_SERVICE", label: "Foreign Service", slug: "foreign-service" },
      { value: "LEGISLATIVE_AFFAIRS", label: "Legislative Affairs", slug: "legislative-affairs" },
      { value: "PUBLIC_FINANCE", label: "Public Finance", slug: "public-finance" },
      { value: "GOVERNMENT_PROGRAMS", label: "Government Programs", slug: "government-programs" },
      { value: "REGULATORY_ENFORCEMENT", label: "Regulatory Enforcement", slug: "regulatory-enforcement" },
    ]},
];

// ─── Key categories for the homepage grid (top 12 most popular) ───
export const POPULAR_CATEGORIES = JOB_CATEGORIES.slice(0, 8);

// ─── Employment Types ───
export const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full Time", slug: "full-time" },
  { value: "PART_TIME", label: "Part Time", slug: "part-time" },
  { value: "CONTRACT", label: "Contract", slug: "contract" },
  { value: "TEMPORARY", label: "Temporary", slug: "temporary" },
  { value: "INTERNSHIP", label: "Internship", slug: "internship" },
  { value: "VOLUNTEER", label: "Volunteer", slug: "volunteer" },
] as const;

// ─── Experience Levels ───
export const EXPERIENCE_LEVELS = [
  { value: "ENTRY_LEVEL", label: "Entry Level", slug: "entry-level" },
  { value: "INTERNSHIP", label: "Internship", slug: "internship" },
  { value: "MID_LEVEL", label: "Mid Level", slug: "mid-level" },
  { value: "SENIOR", label: "Senior", slug: "senior" },
  { value: "LEAD", label: "Lead", slug: "lead" },
  { value: "MANAGER", label: "Manager", slug: "manager" },
  { value: "DIRECTOR", label: "Director", slug: "director" },
  { value: "EXECUTIVE", label: "Executive", slug: "executive" },
] as const;

// ─── Opportunity Types ───
export const OPPORTUNITY_TYPES = [
  { value: "INTERNSHIP", label: "Internship", slug: "internship" },
  { value: "SPONSORSHIP", label: "Sponsorship", slug: "sponsorship" },
  { value: "BURSARY", label: "Bursary", slug: "bursary" },
  { value: "SCHOLARSHIP", label: "Scholarship", slug: "scholarship" },
  { value: "UNIVERSITY_ADMISSION", label: "University Admission", slug: "university-admission" },
  { value: "VOLUNTEER", label: "Volunteer Opportunity", slug: "volunteer" },
  { value: "TRAINING", label: "Training Program", slug: "training" },
  { value: "GRANT", label: "Grant", slug: "grant" },
  { value: "CERTIFICATION", label: "Certification Program", slug: "certification" },
  { value: "FUNDING", label: "Funding Opportunity", slug: "funding" },
  { value: "FELLOWSHIP", label: "Fellowship", slug: "fellowship" },
  { value: "APPRENTICESHIP", label: "Apprenticeship", slug: "apprenticeship" },
  { value: "WORKSHOP", label: "Workshop", slug: "workshop" },
  { value: "CONFERENCE", label: "Conference", slug: "conference" },
  { value: "COMPETITION", label: "Competition", slug: "competition" },
  { value: "AWARD", label: "Award", slug: "award" },
  { value: "RESIDENCY", label: "Residency", slug: "residency" },
  { value: "MENTORSHIP", label: "Mentorship Program", slug: "mentorship" },
  { value: "ACCELERATOR", label: "Accelerator Program", slug: "accelerator" },
  { value: "INCUBATOR", label: "Incubator Program", slug: "incubator" },
  { value: "BOOTCAMP", label: "Bootcamp", slug: "bootcamp" },
  { value: "EXCHANGE", label: "Exchange Program", slug: "exchange" },
  { value: "RESEARCH", label: "Research Opportunity", slug: "research" },
] as const;

// ─── Currencies ───
export const CURRENCIES = [
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "UGX", label: "UGX - Ugandan Shilling" },
  { value: "TZS", label: "TZS - Tanzanian Shilling" },
  { value: "RWF", label: "RWF - Rwandan Franc" },
  { value: "ZAR", label: "ZAR - South African Rand" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
] as const;

// ─── Lookup helpers ───
export function getCategoryBySlug(slug: string) {
  return JOB_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.subcategories.find((s) => s.slug === subcategorySlug) || null;
}

export function getCountyBySlug(slug: string) {
  return KE_COUNTIES.find((c) => slugify(c) === slug) || null;
}

export function slugifyCounty(county: string) {
  return county.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export { slugify };
