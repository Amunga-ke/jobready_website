// =============================================================================
// Jobnet — Platform Enums & Reference Data
// =============================================================================
// Single source of truth for all dropdown / select / filter values used across
// the platform.  Each entry follows the `{ value, label }` shape so it can be
// fed directly into any select component.
// =============================================================================

// ---------------------------------------------------------------------------
// Option helper type
// ---------------------------------------------------------------------------

export interface EnumOption {
  value: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Organization Type
// ---------------------------------------------------------------------------

export const ORGANIZATION_TYPES: EnumOption[] = [
  { value: 'PRIVATE', label: 'Private Sector Companies' },
  { value: 'SMALL_BUSINESS', label: 'Small & Medium Businesses (SMEs)' },
  { value: 'STARTUP', label: 'Startups & Emerging Companies' },
  { value: 'NGO', label: 'Non-Governmental Organizations (NGOs)' },
  { value: 'INTERNATIONAL_ORG', label: 'International Organizations & UN Agencies' },
  { value: 'NATIONAL_GOV', label: 'National Government' },
  { value: 'COUNTY_GOV', label: 'County Governments' },
  { value: 'STATE_CORPORATION', label: 'State Corporations & Parastatals' },
  { value: 'EDUCATION', label: 'Universities & Academic Institutions' },
  { value: 'FOUNDATION', label: 'Foundations & Philanthropic Organizations' },
  { value: 'RELIGIOUS_ORG', label: 'Religious Organizations' },
];

// ---------------------------------------------------------------------------
// Organization Industry
// ---------------------------------------------------------------------------

export const ORGANIZATION_INDUSTRIES: EnumOption[] = [
  { value: 'AGRICULTURE', label: 'Agriculture, Forestry & Fishing' },
  { value: 'AUTOMOTIVE', label: 'Automotive & Vehicle Manufacturing' },
  { value: 'AVIATION', label: 'Aviation & Aerospace' },
  { value: 'BANKING', label: 'Banking & Financial Services' },
  { value: 'CONSTRUCTION', label: 'Construction & Civil Engineering' },
  { value: 'CONSULTING', label: 'Consulting & Professional Services' },
  { value: 'CONSUMER_GOODS', label: 'Consumer Goods & Manufacturing' },
  { value: 'EDUCATION', label: 'Education & Training' },
  { value: 'ENERGY', label: 'Energy, Power & Utilities' },
  { value: 'ENVIRONMENT', label: 'Environment & Sustainability' },
  { value: 'FINTECH', label: 'Financial Technology (FinTech)' },
  { value: 'FOOD_BEVERAGE', label: 'Food & Beverage Production' },
  { value: 'GOVERNMENT_PUBLIC_ADMIN', label: 'Government & Public Administration' },
  { value: 'HEALTHCARE', label: 'Healthcare & Medical Services' },
  { value: 'HOSPITALITY_TOURISM', label: 'Hospitality, Travel & Tourism' },
  { value: 'HUMAN_RESOURCES', label: 'Human Resources & Recruitment' },
  { value: 'INFORMATION_TECHNOLOGY', label: 'Information Technology & Software' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'INTERNATIONAL_DEVELOPMENT', label: 'International Development & Humanitarian Aid' },
  { value: 'LEGAL', label: 'Legal Services' },
  { value: 'LOGISTICS_SUPPLY_CHAIN', label: 'Logistics, Transport & Supply Chain' },
  { value: 'MANUFACTURING', label: 'Manufacturing & Industrial Production' },
  { value: 'MARKETING_ADVERTISING', label: 'Marketing, Advertising & Media' },
  { value: 'MEDIA_ENTERTAINMENT', label: 'Media, Entertainment & Broadcasting' },
  { value: 'MINING', label: 'Mining & Natural Resources' },
  { value: 'NON_PROFIT', label: 'Non-Profit & Social Impact' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceuticals & Biotechnology' },
  { value: 'REAL_ESTATE', label: 'Real Estate & Property Management' },
  { value: 'RESEARCH', label: 'Research & Scientific Institutions' },
  { value: 'RETAIL', label: 'Retail & E-Commerce' },
  { value: 'SECURITY_DEFENSE', label: 'Security & Defense' },
  { value: 'SPORTS', label: 'Sports & Recreation' },
  { value: 'TELECOMMUNICATIONS', label: 'Telecommunications' },
  { value: 'TEXTILES_APPAREL', label: 'Textiles, Apparel & Fashion' },
  { value: 'WATER_SANITATION', label: 'Water, Sanitation & Waste Management' },
];

// ---------------------------------------------------------------------------
// Countries & Regions
// ---------------------------------------------------------------------------

export interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  regions: string[];
}

export const COUNTRIES: CountryData[] = [
  {
    name: 'Kenya',
    code: 'KE',
    dialCode: '254',
    flag: 'KE',
    regions: [
      // Former Central Province
      'Kiambu', 'Kirinyaga', "Murang'a", 'Nyandarua', 'Nyeri',
      // Former Coast Province
      'Kilifi', 'Kwale', 'Lamu', 'Mombasa', 'Taita Taveta', 'Tana River',
      // Former Eastern Province
      'Embu', 'Isiolo', 'Kitui', 'Machakos', 'Makueni', 'Marsabit', 'Meru', 'Tharaka Nithi',
      // Former Nairobi Province
      'Nairobi',
      // Former North Eastern Province
      'Garissa', 'Mandera', 'Wajir',
      // Former Nyanza Province
      'Homa Bay', 'Kisii', 'Kisumu', 'Migori', 'Nyamira', 'Siaya',
      // Former Rift Valley Province
      'Baringo', 'Bomet', 'Elgeyo Marakwet', 'Kajiado', 'Kericho', 'Laikipia',
      'Nakuru', 'Nandi', 'Narok', 'Samburu', 'Trans Nzoia', 'Turkana',
      'Uasin Gishu', 'West Pokot',
      // Former Western Province
      'Bungoma', 'Busia', 'Kakamega', 'Vihiga',
    ],
  },
  {
    name: 'Uganda',
    code: 'UG',
    dialCode: '256',
    flag: 'UG',
    regions: ['Kampala', 'Entebbe', 'Jinja', 'Mbale', 'Gulu', 'Mbarara', 'Masaka', 'Fort Portal', 'Arua', 'Lira'],
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    dialCode: '255',
    flag: 'TZ',
    regions: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar City', 'Mbeya', 'Morogoro', 'Tanga', 'Kigoma', 'Mtwara'],
  },
  {
    name: 'Rwanda',
    code: 'RW',
    dialCode: '250',
    flag: 'RW',
    regions: ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri', 'Cyangugu', 'Byumba', 'Kibuye', 'Gitarama'],
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    dialCode: '251',
    flag: 'ET',
    regions: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Bahir Dar', 'Hawassa', 'Jimma', 'Adama', 'Harar'],
  },
  {
    name: 'Nigeria',
    code: 'NG',
    dialCode: '234',
    flag: 'NG',
    regions: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Zaria', 'Jos'],
  },
  {
    name: 'South Africa',
    code: 'ZA',
    dialCode: '27',
    flag: 'ZA',
    regions: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Pietermaritzburg', 'Kimberley', 'Nelspruit'],
  },
  {
    name: 'Ghana',
    code: 'GH',
    dialCode: '233',
    flag: 'GH',
    regions: ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Cape Coast', 'Tema', 'Sunyani', 'Wa', 'Bolgatanga'],
  },
  {
    name: 'United States',
    code: 'US',
    dialCode: '1',
    flag: 'US',
    regions: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '44',
    flag: 'GB',
    regions: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Edinburgh'],
  },
  {
    name: 'Canada',
    code: 'CA',
    dialCode: '1',
    flag: 'CA',
    regions: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax'],
  },
];

// ---------------------------------------------------------------------------
// Job Categories & Subcategories
// ---------------------------------------------------------------------------

export interface SubcategoryOption {
  value: string;
  label: string;
}

export interface JobCategoryOption {
  value: string;
  label: string;
  subcategories: SubcategoryOption[];
}

export const JOB_CATEGORIES: JobCategoryOption[] = [
  {
    value: 'TECHNOLOGY',
    label: 'Technology & IT',
    subcategories: [
      { value: 'SOFTWARE_ENGINEERING', label: 'Software Engineering' },
      { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
      { value: 'MOBILE_DEVELOPMENT', label: 'Mobile Development' },
      { value: 'DATA_SCIENCE', label: 'Data Science & Analytics' },
      { value: 'CYBER_SECURITY', label: 'Cybersecurity' },
      { value: 'DEVOPS_CLOUD', label: 'DevOps & Cloud Infrastructure' },
      { value: 'IT_SUPPORT', label: 'IT Support & Helpdesk' },
      { value: 'NETWORK_ADMIN', label: 'Network Administration' },
      { value: 'QA_TESTING', label: 'Quality Assurance & Testing' },
      { value: 'DATABASE_ADMIN', label: 'Database Administration' },
      { value: 'SYSTEMS_ARCHITECTURE', label: 'Systems Architecture' },
      { value: 'AI_MACHINE_LEARNING', label: 'AI & Machine Learning' },
      { value: 'BLOCKCHAIN', label: 'Blockchain Development' },
      { value: 'GAME_DEVELOPMENT', label: 'Game Development' },
      { value: 'EMBEDDED_SYSTEMS', label: 'Embedded Systems' },
      { value: 'TECH_PROJECT_MANAGEMENT', label: 'Technical Project Management' },
      { value: 'IT_AUDIT', label: 'IT Audit' },
      { value: 'TECH_SUPPORT_ENGINEER', label: 'Technical Support Engineering' },
    ],
  },
  {
    value: 'FINANCE_ACCOUNTING',
    label: 'Finance & Accounting',
    subcategories: [
      { value: 'ACCOUNTING', label: 'Accounting' },
      { value: 'FINANCIAL_ANALYSIS', label: 'Financial Analysis' },
      { value: 'AUDIT', label: 'Audit' },
      { value: 'TAX', label: 'Taxation' },
      { value: 'TREASURY', label: 'Treasury Management' },
      { value: 'RISK_COMPLIANCE', label: 'Risk & Compliance' },
      { value: 'INVESTMENT_BANKING', label: 'Investment Banking' },
      { value: 'WEALTH_MANAGEMENT', label: 'Wealth Management' },
      { value: 'FINANCIAL_PLANNING', label: 'Financial Planning' },
      { value: 'PAYROLL', label: 'Payroll Management' },
      { value: 'CORPORATE_FINANCE', label: 'Corporate Finance' },
      { value: 'HEDGE_FUNDS', label: 'Hedge Funds' },
      { value: 'PRIVATE_EQUITY', label: 'Private Equity' },
      { value: 'VENTURE_CAPITAL', label: 'Venture Capital' },
      { value: 'FINANCIAL_REPORTING', label: 'Financial Reporting' },
      { value: 'CREDIT_ANALYSIS', label: 'Credit Analysis' },
      { value: 'MERCHANT_BANKING', label: 'Merchant Banking' },
    ],
  },
  {
    value: 'SALES_BUSINESS',
    label: 'Sales & Business Development',
    subcategories: [
      { value: 'BUSINESS_DEVELOPMENT', label: 'Business Development' },
      { value: 'ACCOUNT_MANAGEMENT', label: 'Account Management' },
      { value: 'SALES_REPRESENTATIVE', label: 'Sales Representative' },
      { value: 'CHANNEL_SALES', label: 'Channel Sales' },
      { value: 'CUSTOMER_SUCCESS', label: 'Customer Success' },
      { value: 'CORPORATE_SALES', label: 'Corporate Sales' },
      { value: 'RETAIL_SALES', label: 'Retail Sales' },
      { value: 'SALES_OPERATIONS', label: 'Sales Operations' },
      { value: 'SALES_TRAINING', label: 'Sales Training' },
      { value: 'KEY_ACCOUNT_MANAGEMENT', label: 'Key Account Management' },
      { value: 'TECHNICAL_SALES', label: 'Technical Sales' },
      { value: 'SALES_ENGINEERING', label: 'Sales Engineering' },
      { value: 'INSIDE_SALES', label: 'Inside Sales' },
      { value: 'FIELD_SALES', label: 'Field Sales' },
      { value: 'B2B_SALES', label: 'B2B Sales' },
      { value: 'B2C_SALES', label: 'B2C Sales' },
      { value: 'SALES_MANAGEMENT', label: 'Sales Management' },
      { value: 'SALES_ENABLEMENT', label: 'Sales Enablement' },
    ],
  },
  {
    value: 'MARKETING_COMMUNICATIONS',
    label: 'Marketing & Communications',
    subcategories: [
      { value: 'DIGITAL_MARKETING', label: 'Digital Marketing' },
      { value: 'CONTENT_MARKETING', label: 'Content Marketing' },
      { value: 'BRAND_MANAGEMENT', label: 'Brand Management' },
      { value: 'PUBLIC_RELATIONS', label: 'Public Relations' },
      { value: 'SOCIAL_MEDIA', label: 'Social Media Management' },
      { value: 'SEO_SEM', label: 'SEO & Search Marketing' },
      { value: 'MARKET_RESEARCH', label: 'Market Research' },
      { value: 'PRODUCT_MARKETING', label: 'Product Marketing' },
      { value: 'EVENT_MARKETING', label: 'Event Marketing' },
      { value: 'AFFILIATE_MARKETING', label: 'Affiliate Marketing' },
      { value: 'MARKETING_AUTOMATION', label: 'Marketing Automation' },
      { value: 'COPYWRITING', label: 'Copywriting' },
      { value: 'INFLUENCER_MARKETING', label: 'Influencer Marketing' },
      { value: 'EMAIL_MARKETING', label: 'Email Marketing' },
      { value: 'VIDEO_MARKETING', label: 'Video Marketing' },
      { value: 'GUERRILLA_MARKETING', label: 'Guerrilla Marketing' },
      { value: 'GROWTH_MARKETING', label: 'Growth Marketing' },
      { value: 'PERFORMANCE_MARKETING', label: 'Performance Marketing' },
    ],
  },
  {
    value: 'HUMAN_RESOURCES',
    label: 'Human Resources',
    subcategories: [
      { value: 'RECRUITMENT', label: 'Recruitment & Talent Acquisition' },
      { value: 'HR_GENERALIST', label: 'HR Generalist' },
      { value: 'PAYROLL', label: 'Payroll & Compensation' },
      { value: 'LEARNING_DEVELOPMENT', label: 'Learning & Development' },
      { value: 'HR_ANALYTICS', label: 'HR Analytics' },
      { value: 'EMPLOYEE_RELATIONS', label: 'Employee Relations' },
      { value: 'HR_OPERATIONS', label: 'HR Operations' },
      { value: 'TALENT_MANAGEMENT', label: 'Talent Management' },
      { value: 'ORGANIZATIONAL_DEVELOPMENT', label: 'Organizational Development' },
      { value: 'HRIS', label: 'HR Information Systems' },
      { value: 'COMPENSATION_BENEFITS', label: 'Compensation & Benefits' },
      { value: 'DIVERSITY_INCLUSION', label: 'Diversity & Inclusion' },
      { value: 'EMPLOYER_BRANDING', label: 'Employer Branding' },
      { value: 'HR_CONSULTING', label: 'HR Consulting' },
      { value: 'LABOR_RELATIONS', label: 'Labor Relations' },
      { value: 'HR_COMPLIANCE', label: 'HR Compliance' },
      { value: 'WORKPLACE_SAFETY', label: 'Workplace Safety' },
    ],
  },
  {
    value: 'ENGINEERING',
    label: 'Engineering',
    subcategories: [
      { value: 'CIVIL_ENGINEERING', label: 'Civil Engineering' },
      { value: 'MECHANICAL_ENGINEERING', label: 'Mechanical Engineering' },
      { value: 'ELECTRICAL_ENGINEERING', label: 'Electrical Engineering' },
      { value: 'INDUSTRIAL_ENGINEERING', label: 'Industrial Engineering' },
      { value: 'PROJECT_ENGINEERING', label: 'Project Engineering' },
      { value: 'CHEMICAL_ENGINEERING', label: 'Chemical Engineering' },
      { value: 'AEROSPACE_ENGINEERING', label: 'Aerospace Engineering' },
      { value: 'BIOMEDICAL_ENGINEERING', label: 'Biomedical Engineering' },
      { value: 'ENVIRONMENTAL_ENGINEERING', label: 'Environmental Engineering' },
      { value: 'MATERIALS_ENGINEERING', label: 'Materials Engineering' },
      { value: 'STRUCTURAL_ENGINEERING', label: 'Structural Engineering' },
      { value: 'GEOTECHNICAL_ENGINEERING', label: 'Geotechnical Engineering' },
      { value: 'PETROLEUM_ENGINEERING', label: 'Petroleum Engineering' },
      { value: 'MARINE_ENGINEERING', label: 'Marine Engineering' },
      { value: 'AUTOMOTIVE_ENGINEERING', label: 'Automotive Engineering' },
      { value: 'NUCLEAR_ENGINEERING', label: 'Nuclear Engineering' },
      { value: 'MECHATRONICS', label: 'Mechatronics' },
    ],
  },
  {
    value: 'HEALTHCARE',
    label: 'Healthcare & Medical',
    subcategories: [
      { value: 'NURSING', label: 'Nursing' },
      { value: 'PHARMACY', label: 'Pharmacy' },
      { value: 'MEDICAL_DOCTOR', label: 'Medical Doctor' },
      { value: 'LAB_TECHNOLOGY', label: 'Laboratory Technology' },
      { value: 'PUBLIC_HEALTH', label: 'Public Health' },
      { value: 'HEALTH_ADMIN', label: 'Healthcare Administration' },
      { value: 'PHYSIOTHERAPY', label: 'Physiotherapy' },
      { value: 'OCCUPATIONAL_THERAPY', label: 'Occupational Therapy' },
      { value: 'RADIOLOGY', label: 'Radiology & Imaging' },
      { value: 'MEDICAL_RESEARCH', label: 'Medical Research' },
      { value: 'HEALTH_INFORMATICS', label: 'Health Informatics' },
      { value: 'CARDIOLOGY', label: 'Cardiology' },
      { value: 'NEUROLOGY', label: 'Neurology' },
      { value: 'PEDIATRICS', label: 'Pediatrics' },
      { value: 'ONCOLOGY', label: 'Oncology' },
      { value: 'EMERGENCY_MEDICINE', label: 'Emergency Medicine' },
      { value: 'ANESTHESIOLOGY', label: 'Anesthesiology' },
      { value: 'PSYCHIATRY', label: 'Psychiatry' },
    ],
  },
  {
    value: 'EDUCATION',
    label: 'Education & Training',
    subcategories: [
      { value: 'TEACHING', label: 'Teaching' },
      { value: 'LECTURING', label: 'Lecturing' },
      { value: 'EDUCATION_ADMIN', label: 'Education Administration' },
      { value: 'CURRICULUM_DEVELOPMENT', label: 'Curriculum Development' },
      { value: 'TRAINING', label: 'Training & Facilitation' },
      { value: 'E_LEARNING', label: 'E-Learning & Instructional Design' },
      { value: 'SPECIAL_EDUCATION', label: 'Special Education' },
      { value: 'EDUCATIONAL_TECHNOLOGY', label: 'Educational Technology' },
      { value: 'STUDENT_COUNSELING', label: 'Student Counseling' },
      { value: 'ACADEMIC_RESEARCH', label: 'Academic Research' },
      { value: 'EARLY_CHILDHOOD', label: 'Early Childhood Education' },
      { value: 'PRIMARY_EDUCATION', label: 'Primary Education' },
      { value: 'SECONDARY_EDUCATION', label: 'Secondary Education' },
      { value: 'HIGHER_EDUCATION', label: 'Higher Education' },
      { value: 'VOCATIONAL_TRAINING', label: 'Vocational Training' },
      { value: 'LANGUAGE_TEACHING', label: 'Language Teaching' },
      { value: 'EDUCATIONAL_PSYCHOLOGY', label: 'Educational Psychology' },
    ],
  },
  {
    value: 'OPERATIONS_ADMIN',
    label: 'Operations & Administration',
    subcategories: [
      { value: 'OFFICE_ADMIN', label: 'Office Administration' },
      { value: 'OPERATIONS_MANAGEMENT', label: 'Operations Management' },
      { value: 'PROJECT_MANAGEMENT', label: 'Project Management' },
      { value: 'EXECUTIVE_ASSISTANT', label: 'Executive Assistant' },
      { value: 'PROGRAM_MANAGEMENT', label: 'Program Management' },
      { value: 'BUSINESS_OPERATIONS', label: 'Business Operations' },
      { value: 'FACILITIES_MANAGEMENT', label: 'Facilities Management' },
      { value: 'ADMINISTRATIVE_SUPPORT', label: 'Administrative Support' },
      { value: 'DATA_ENTRY', label: 'Data Entry' },
      { value: 'PROCESS_IMPROVEMENT', label: 'Process Improvement' },
      { value: 'OFFICE_MANAGER', label: 'Office Manager' },
      { value: 'ADMINISTRATIVE_COORDINATOR', label: 'Administrative Coordinator' },
      { value: 'RECEPTIONIST', label: 'Receptionist' },
      { value: 'PROJECT_COORDINATION', label: 'Project Coordination' },
      { value: 'BUSINESS_SUPPORT', label: 'Business Support' },
      { value: 'ADMINISTRATIVE_MANAGEMENT', label: 'Administrative Management' },
    ],
  },
  {
    value: 'SUPPLY_CHAIN',
    label: 'Logistics & Supply Chain',
    subcategories: [
      { value: 'PROCUREMENT', label: 'Procurement' },
      { value: 'WAREHOUSING', label: 'Warehousing' },
      { value: 'DISTRIBUTION', label: 'Distribution & Logistics' },
      { value: 'INVENTORY_MANAGEMENT', label: 'Inventory Management' },
      { value: 'TRANSPORT_COORDINATION', label: 'Transport Coordination' },
      { value: 'SUPPLY_CHAIN_PLANNING', label: 'Supply Chain Planning' },
      { value: 'FREIGHT_FORWARDING', label: 'Freight Forwarding' },
      { value: 'CUSTOMS_BROKERAGE', label: 'Customs Brokerage' },
      { value: 'DEMAND_PLANNING', label: 'Demand Planning' },
      { value: 'LOGISTICS_ANALYTICS', label: 'Logistics Analytics' },
      { value: 'FLEET_MANAGEMENT', label: 'Fleet Management' },
      { value: 'RETURN_LOGISTICS', label: 'Return Logistics' },
      { value: 'WAREHOUSE_OPERATIONS', label: 'Warehouse Operations' },
      { value: 'MATERIALS_MANAGEMENT', label: 'Materials Management' },
      { value: 'GLOBAL_LOGISTICS', label: 'Global Logistics' },
      { value: 'SHIPPING_RECEIVING', label: 'Shipping & Receiving' },
    ],
  },
  {
    value: 'HOSPITALITY',
    label: 'Hospitality & Tourism',
    subcategories: [
      { value: 'HOTEL_MANAGEMENT', label: 'Hotel Management' },
      { value: 'CHEF_COOKING', label: 'Chef & Culinary' },
      { value: 'TOURISM_OPERATIONS', label: 'Tourism Operations' },
      { value: 'FRONT_OFFICE', label: 'Front Office' },
      { value: 'HOUSEKEEPING', label: 'Housekeeping' },
      { value: 'FOOD_BEVERAGE', label: 'Food & Beverage' },
      { value: 'EVENT_PLANNING', label: 'Event Planning' },
      { value: 'TRAVEL_AGENCY', label: 'Travel Agency' },
      { value: 'CASINO_GAMING', label: 'Casino & Gaming' },
      { value: 'RESORT_MANAGEMENT', label: 'Resort Management' },
      { value: 'CONCIERGE', label: 'Concierge Services' },
      { value: 'BARTENDING', label: 'Bartending' },
      { value: 'RESTAURANT_MANAGEMENT', label: 'Restaurant Management' },
      { value: 'CATERING', label: 'Catering' },
      { value: 'SPA_MANAGEMENT', label: 'Spa Management' },
      { value: 'CRUISE_SHIP_STAFF', label: 'Cruise Ship Staff' },
    ],
  },
  {
    value: 'SPECIALISED_SERVICES',
    label: 'Specialised Services',
    subcategories: [
      { value: 'PROJECT_MANAGEMENT', label: 'Project Management' },
      { value: 'OPERATIONS_MANAGER', label: 'Operations Manager' },
      { value: 'TECHNICAL_PROJECT_MANAGER', label: 'Technical Project Manager' },
      { value: 'TRANSLATION_INTERPRETATION', label: 'Translation & Interpretation' },
    ],
  },
  {
    value: 'AGRICULTURE',
    label: 'Agriculture & Agribusiness',
    subcategories: [
      { value: 'AGRONOMY', label: 'Agronomy' },
      { value: 'FARM_MANAGEMENT', label: 'Farm Management' },
      { value: 'AGRICULTURAL_EXTENSION', label: 'Agricultural Extension' },
      { value: 'LIVESTOCK_MANAGEMENT', label: 'Livestock Management' },
      { value: 'CROP_SCIENCE', label: 'Crop Science' },
      { value: 'AGRICULTURAL_ENGINEERING', label: 'Agricultural Engineering' },
      { value: 'FOOD_SCIENCE', label: 'Food Science' },
      { value: 'AGRIBUSINESS', label: 'Agribusiness' },
      { value: 'HORTICULTURE', label: 'Horticulture' },
      { value: 'SUSTAINABLE_AGRICULTURE', label: 'Sustainable Agriculture' },
      { value: 'PRECISION_AGRICULTURE', label: 'Precision Agriculture' },
      { value: 'AGRICULTURAL_ECONOMICS', label: 'Agricultural Economics' },
      { value: 'PEST_MANAGEMENT', label: 'Pest Management' },
      { value: 'SOIL_SCIENCE', label: 'Soil Science' },
      { value: 'FORESTRY', label: 'Forestry' },
    ],
  },
  {
    value: 'LEGAL',
    label: 'Legal & Compliance',
    subcategories: [
      { value: 'CORPORATE_LAW', label: 'Corporate Law' },
      { value: 'LEGAL_ADVISORY', label: 'Legal Advisory' },
      { value: 'CONTRACT_MANAGEMENT', label: 'Contract Management' },
      { value: 'COMPLIANCE_OFFICER', label: 'Compliance' },
      { value: 'PARALEGAL', label: 'Paralegal Services' },
      { value: 'INTELLECTUAL_PROPERTY', label: 'Intellectual Property' },
      { value: 'LITIGATION', label: 'Litigation' },
      { value: 'LABOR_LAW', label: 'Labor Law' },
      { value: 'TAX_LAW', label: 'Tax Law' },
      { value: 'REAL_ESTATE_LAW', label: 'Real Estate Law' },
      { value: 'REGULATORY_AFFAIRS', label: 'Regulatory Affairs' },
      { value: 'INTERNATIONAL_LAW', label: 'International Law' },
      { value: 'ENVIRONMENTAL_LAW', label: 'Environmental Law' },
      { value: 'HEALTHCARE_LAW', label: 'Healthcare Law' },
      { value: 'CRIMINAL_LAW', label: 'Criminal Law' },
      { value: 'FAMILY_LAW', label: 'Family Law' },
      { value: 'LEGAL_RESEARCH', label: 'Legal Research' },
    ],
  },
  {
    value: 'CREATIVE_DESIGN',
    label: 'Creative Arts & Design',
    subcategories: [
      { value: 'GRAPHIC_DESIGN', label: 'Graphic Design' },
      { value: 'UX_UI_DESIGN', label: 'UX/UI Design' },
      { value: 'MULTIMEDIA_DESIGN', label: 'Multimedia Design' },
      { value: 'PHOTOGRAPHY', label: 'Photography' },
      { value: 'VIDEO_EDITING', label: 'Video Editing & Production' },
      { value: 'ANIMATION', label: 'Animation' },
      { value: 'ART_DIRECTION', label: 'Art Direction' },
      { value: 'ILLUSTRATION', label: 'Illustration' },
      { value: 'INTERIOR_DESIGN', label: 'Interior Design' },
      { value: 'FASHION_DESIGN', label: 'Fashion Design' },
      { value: 'PRODUCT_DESIGN', label: 'Product Design' },
      { value: 'MOTION_GRAPHICS', label: 'Motion Graphics' },
      { value: '3D_MODELING', label: '3D Modeling' },
      { value: 'VISUAL_ARTS', label: 'Visual Arts' },
      { value: 'INDUSTRIAL_DESIGN', label: 'Industrial Design' },
      { value: 'JEWELRY_DESIGN', label: 'Jewelry Design' },
      { value: 'TEXTILE_DESIGN', label: 'Textile Design' },
      { value: 'CERAMIC_DESIGN', label: 'Ceramic Design' },
    ],
  },
  {
    value: 'ARCHITECTURE_CONSTRUCTION',
    label: 'Architecture & Construction',
    subcategories: [
      { value: 'ARCHITECTURE', label: 'Architecture' },
      { value: 'CONSTRUCTION_MANAGEMENT', label: 'Construction Management' },
      { value: 'QUANTITY_SURVEYING', label: 'Quantity Surveying' },
      { value: 'SITE_SUPERVISION', label: 'Site Supervision' },
      { value: 'URBAN_PLANNING', label: 'Urban Planning' },
      { value: 'LANDSCAPE_ARCHITECTURE', label: 'Landscape Architecture' },
      { value: 'BUILDING_SURVEYING', label: 'Building Surveying' },
      { value: 'CONSTRUCTION_SAFETY', label: 'Construction Safety' },
      { value: 'ESTIMATING', label: 'Estimating' },
      { value: 'PROJECT_COORDINATION', label: 'Project Coordination' },
      { value: 'INTERIOR_ARCHITECTURE', label: 'Interior Architecture' },
      { value: 'STRUCTURAL_ENGINEERING_CONSTRUCTION', label: 'Structural Engineering' },
      { value: 'CONSTRUCTION_EQUIPMENT', label: 'Construction Equipment Operation' },
      { value: 'BUILDING_INSPECTION', label: 'Building Inspection' },
      { value: 'GREEN_BUILDING', label: 'Green Building' },
      { value: 'CONSTRUCTION_ESTIMATING', label: 'Construction Estimating' },
    ],
  },
  {
    value: 'SCIENCE_RESEARCH',
    label: 'Science & Research',
    subcategories: [
      { value: 'LAB_RESEARCH', label: 'Laboratory Research' },
      { value: 'CHEMISTRY', label: 'Chemistry' },
      { value: 'BIOLOGY', label: 'Biology' },
      { value: 'ENVIRONMENTAL_SCIENCE', label: 'Environmental Science' },
      { value: 'PHYSICS', label: 'Physics' },
      { value: 'R_AND_D', label: 'Research & Development' },
      { value: 'BIOTECHNOLOGY', label: 'Biotechnology' },
      { value: 'CLINICAL_RESEARCH', label: 'Clinical Research' },
      { value: 'GEOLOGY', label: 'Geology' },
      { value: 'FORENSIC_SCIENCE', label: 'Forensic Science' },
      { value: 'MARINE_BIOLOGY', label: 'Marine Biology' },
      { value: 'ASTRONOMY', label: 'Astronomy' },
      { value: 'NEUROSCIENCE', label: 'Neuroscience' },
      { value: 'GENETICS', label: 'Genetics' },
      { value: 'MICROBIOLOGY', label: 'Microbiology' },
      { value: 'BIOCHEMISTRY', label: 'Biochemistry' },
    ],
  },
  {
    value: 'CUSTOMER_SERVICE',
    label: 'Customer Service',
    subcategories: [
      { value: 'CALL_CENTER', label: 'Call Center' },
      { value: 'CUSTOMER_SUPPORT', label: 'Customer Support' },
      { value: 'CLIENT_RELATIONS', label: 'Client Relations' },
      { value: 'HELPDESK', label: 'Helpdesk' },
      { value: 'CUSTOMER_EXPERIENCE', label: 'Customer Experience' },
      { value: 'TECHNICAL_SUPPORT', label: 'Technical Support' },
      { value: 'CHAT_SUPPORT', label: 'Chat Support' },
      { value: 'CUSTOMER_SERVICE_MANAGEMENT', label: 'Customer Service Management' },
      { value: 'COMPLAINT_RESOLUTION', label: 'Complaint Resolution' },
      { value: 'OMNICHANNEL_SUPPORT', label: 'Omnichannel Support' },
      { value: 'CUSTOMER_SUCCESS_SPECIALIST', label: 'Customer Success Specialist' },
      { value: 'SERVICE_DELIVERY', label: 'Service Delivery' },
      { value: 'CUSTOMER_SUPPORT_ENGINEER', label: 'Customer Support Engineer' },
      { value: 'CALL_CENTER_MANAGER', label: 'Call Center Manager' },
      { value: 'CLIENT_SERVICES', label: 'Client Services' },
      { value: 'CUSTOMER_CARE', label: 'Customer Care' },
    ],
  },
  {
    value: 'SKILLED_TRADES',
    label: 'Skilled Trades & Manual Work',
    subcategories: [
      { value: 'ELECTRICIAN', label: 'Electrical Installation' },
      { value: 'PLUMBING', label: 'Plumbing' },
      { value: 'WELDING', label: 'Welding & Fabrication' },
      { value: 'CARPENTRY', label: 'Carpentry' },
      { value: 'MAINTENANCE', label: 'Maintenance & Repair' },
      { value: 'MACHINERY_OPERATION', label: 'Machinery Operation' },
      { value: 'HVAC', label: 'HVAC Installation & Repair' },
      { value: 'PAINTING', label: 'Painting & Finishing' },
      { value: 'MASONRY', label: 'Masonry' },
      { value: 'AUTO_MECHANIC', label: 'Automotive Mechanics' },
      { value: 'TOOL_MAKING', label: 'Tool Making' },
      { value: 'CABINET_MAKING', label: 'Cabinet Making' },
      { value: 'FLOORING', label: 'Flooring Installation' },
      { value: 'ROOFING', label: 'Roofing' },
      { value: 'GLAZING', label: 'Glazing' },
      { value: 'LOCKSMITH', label: 'Locksmith' },
      { value: 'BOILERMAKER', label: 'Boilermaking' },
    ],
  },
  {
    value: 'MEDIA_PUBLISHING',
    label: 'Media & Publishing',
    subcategories: [
      { value: 'JOURNALISM', label: 'Journalism' },
      { value: 'EDITING', label: 'Editing & Proofreading' },
      { value: 'PUBLISHING', label: 'Publishing' },
      { value: 'BROADCASTING', label: 'Broadcasting' },
      { value: 'CONTENT_CREATION', label: 'Content Creation' },
      { value: 'COPYWRITING', label: 'Copywriting' },
      { value: 'TECHNICAL_WRITING', label: 'Technical Writing' },
      { value: 'RADIO_PRODUCTION', label: 'Radio Production' },
      { value: 'TV_PRODUCTION', label: 'Television Production' },
      { value: 'DIGITAL_PUBLISHING', label: 'Digital Publishing' },
      { value: 'NEWS_REPORTING', label: 'News Reporting' },
      { value: 'MAGAZINE_PUBLISHING', label: 'Magazine Publishing' },
      { value: 'BOOK_PUBLISHING', label: 'Book Publishing' },
      { value: 'COPY_EDITING', label: 'Copy Editing' },
      { value: 'PROOFREADING', label: 'Proofreading' },
      { value: 'ACQUISITIONS_EDITOR', label: 'Acquisitions Editor' },
    ],
  },
  {
    value: 'NONPROFIT',
    label: 'Nonprofit & Social Services',
    subcategories: [
      { value: 'SOCIAL_WORK', label: 'Social Work' },
      { value: 'COMMUNITY_OUTREACH', label: 'Community Outreach' },
      { value: 'FUNDRAISING', label: 'Fundraising' },
      { value: 'GRANT_WRITING', label: 'Grant Writing' },
      { value: 'VOLUNTEER_COORDINATION', label: 'Volunteer Coordination' },
      { value: 'NGO_MANAGEMENT', label: 'NGO Management' },
      { value: 'PROGRAM_DEVELOPMENT', label: 'Program Development' },
      { value: 'ADVOCACY', label: 'Advocacy' },
      { value: 'HUMANITARIAN_AID', label: 'Humanitarian Aid' },
      { value: 'COUNSELING', label: 'Counseling' },
      { value: 'CASE_MANAGEMENT', label: 'Case Management' },
      { value: 'COMMUNITY_ORGANIZING', label: 'Community Organizing' },
      { value: 'PHILANTHROPY', label: 'Philanthropy' },
      { value: 'FOUNDATION_MANAGEMENT', label: 'Foundation Management' },
      { value: 'SOCIAL_ENTERPRISE', label: 'Social Enterprise' },
      { value: 'DISASTER_RELIEF', label: 'Disaster Relief' },
    ],
  },
  {
    value: 'REAL_ESTATE',
    label: 'Real Estate',
    subcategories: [
      { value: 'PROPERTY_MANAGEMENT', label: 'Property Management' },
      { value: 'REAL_ESTATE_AGENT', label: 'Real Estate Agent' },
      { value: 'REAL_ESTATE_DEVELOPMENT', label: 'Real Estate Development' },
      { value: 'FACILITIES_MANAGEMENT', label: 'Facilities Management' },
      { value: 'VALUATION', label: 'Valuation & Appraisal' },
      { value: 'COMMERCIAL_REAL_ESTATE', label: 'Commercial Real Estate' },
      { value: 'RESIDENTIAL_REAL_ESTATE', label: 'Residential Real Estate' },
      { value: 'REAL_ESTATE_INVESTMENT', label: 'Real Estate Investment' },
      { value: 'PROPERTY_ACQUISITION', label: 'Property Acquisition' },
      { value: 'LEASING', label: 'Leasing' },
      { value: 'REAL_ESTATE_BROKER', label: 'Real Estate Broker' },
      { value: 'ASSET_MANAGEMENT_REAL_ESTATE', label: 'Asset Management' },
      { value: 'REAL_ESTATE_MARKETING', label: 'Real Estate Marketing' },
      { value: 'PROPERTY_SALES', label: 'Property Sales' },
      { value: 'REAL_ESTATE_CONSULTING', label: 'Real Estate Consulting' },
      { value: 'TITLE_SEARCH', label: 'Title Search' },
    ],
  },
  {
    value: 'FITNESS_WELLNESS',
    label: 'Fitness & Wellness',
    subcategories: [
      { value: 'PERSONAL_TRAINING', label: 'Personal Training' },
      { value: 'GYM_MANAGEMENT', label: 'Gym Management' },
      { value: 'NUTRITION', label: 'Nutrition & Dietetics' },
      { value: 'YOGA_INSTRUCTION', label: 'Yoga Instruction' },
      { value: 'WELLNESS_COACHING', label: 'Wellness Coaching' },
      { value: 'GROUP_FITNESS', label: 'Group Fitness Instruction' },
      { value: 'SPORTS_COACHING', label: 'Sports Coaching' },
      { value: 'PHYSICAL_THERAPY', label: 'Physical Therapy' },
      { value: 'MASSAGE_THERAPY', label: 'Massage Therapy' },
      { value: 'SPORTS_MEDICINE', label: 'Sports Medicine' },
      { value: 'PILATES_INSTRUCTION', label: 'Pilates Instruction' },
      { value: 'CROSSFIT_TRAINING', label: 'CrossFit Training' },
      { value: 'WELLNESS_PROGRAMMING', label: 'Wellness Programming' },
      { value: 'HEALTH_COACHING', label: 'Health Coaching' },
      { value: 'FITNESS_CONSULTING', label: 'Fitness Consulting' },
    ],
  },
  {
    value: 'GOVERNMENT_PUBLIC_SECTOR',
    label: 'Government & Public Sector',
    subcategories: [
      { value: 'PUBLIC_ADMINISTRATION', label: 'Public Administration' },
      { value: 'POLICY_ANALYSIS', label: 'Policy Analysis' },
      { value: 'GOVERNMENT_RELATIONS', label: 'Government Relations' },
      { value: 'PUBLIC_AFFAIRS', label: 'Public Affairs' },
      { value: 'DIPLOMACY', label: 'Diplomacy' },
      { value: 'PUBLIC_POLICY', label: 'Public Policy' },
      { value: 'CIVIL_SERVICE', label: 'Civil Service' },
      { value: 'URBAN_DEVELOPMENT', label: 'Urban Development' },
      { value: 'PUBLIC_SAFETY', label: 'Public Safety' },
      { value: 'EMERGENCY_MANAGEMENT', label: 'Emergency Management' },
      { value: 'FOREIGN_SERVICE', label: 'Foreign Service' },
      { value: 'LEGISLATIVE_AFFAIRS', label: 'Legislative Affairs' },
      { value: 'PUBLIC_FINANCE', label: 'Public Finance' },
      { value: 'GOVERNMENT_PROGRAMS', label: 'Government Programs' },
      { value: 'REGULATORY_ENFORCEMENT', label: 'Regulatory Enforcement' },
    ],
  },
  {
    value: 'CONSULTING',
    label: 'Consulting',
    subcategories: [
      { value: 'MANAGEMENT_CONSULTING', label: 'Management Consulting' },
      { value: 'STRATEGY_CONSULTING', label: 'Strategy Consulting' },
      { value: 'IT_CONSULTING', label: 'IT Consulting' },
      { value: 'HR_CONSULTING', label: 'HR Consulting' },
      { value: 'FINANCIAL_CONSULTING', label: 'Financial Consulting' },
      { value: 'OPERATIONS_CONSULTING', label: 'Operations Consulting' },
      { value: 'BUSINESS_ANALYSIS', label: 'Business Analysis' },
      { value: 'ORGANIZATIONAL_CONSULTING', label: 'Organizational Consulting' },
      { value: 'SUSTAINABILITY_CONSULTING', label: 'Sustainability Consulting' },
      { value: 'RISK_CONSULTING', label: 'Risk Consulting' },
      { value: 'MARKETING_CONSULTING', label: 'Marketing Consulting' },
      { value: 'SALES_CONSULTING', label: 'Sales Consulting' },
      { value: 'SUPPLY_CHAIN_CONSULTING', label: 'Supply Chain Consulting' },
      { value: 'TECHNOLOGY_CONSULTING', label: 'Technology Consulting' },
      { value: 'STRATEGIC_PLANNING', label: 'Strategic Planning' },
      { value: 'BUSINESS_TRANSFORMATION', label: 'Business Transformation' },
    ],
  },
  {
    value: 'INSURANCE',
    label: 'Insurance',
    subcategories: [
      { value: 'UNDERWRITING', label: 'Underwriting' },
      { value: 'CLAIMS_ADJUSTMENT', label: 'Claims Adjustment' },
      { value: 'INSURANCE_SALES', label: 'Insurance Sales' },
      { value: 'RISK_ASSESSMENT', label: 'Risk Assessment' },
      { value: 'INSURANCE_BROKER', label: 'Insurance Broker' },
      { value: 'ACTUARIAL_SCIENCE', label: 'Actuarial Science' },
      { value: 'POLICY_ADMINISTRATION', label: 'Policy Administration' },
      { value: 'LOSS_CONTROL', label: 'Loss Control' },
      { value: 'REINSURANCE', label: 'Reinsurance' },
      { value: 'INSURANCE_ANALYTICS', label: 'Insurance Analytics' },
      { value: 'LIFE_INSURANCE', label: 'Life Insurance' },
      { value: 'HEALTH_INSURANCE', label: 'Health Insurance' },
      { value: 'PROPERTY_INSURANCE', label: 'Property Insurance' },
      { value: 'CASUALTY_INSURANCE', label: 'Casualty Insurance' },
      { value: 'INSURANCE_UNDERWRITING', label: 'Insurance Underwriting' },
    ],
  },
  {
    value: 'TRANSPORTATION',
    label: 'Transportation',
    subcategories: [
      { value: 'TRUCK_DRIVING', label: 'Truck Driving' },
      { value: 'FLEET_MANAGEMENT', label: 'Fleet Management' },
      { value: 'DISPATCHING', label: 'Dispatching' },
      { value: 'PILOT', label: 'Pilot' },
      { value: 'MARITIME', label: 'Maritime' },
      { value: 'RAIL', label: 'Rail' },
      { value: 'AVIATION_OPS', label: 'Aviation Operations' },
      { value: 'PUBLIC_TRANSIT', label: 'Public Transit' },
      { value: 'LOGISTICS_COORDINATION', label: 'Logistics Coordination' },
      { value: 'SUPPLY_CHAIN_OPS', label: 'Supply Chain Operations' },
      { value: 'WAREHOUSE_MANAGEMENT', label: 'Warehouse Management' },
      { value: 'CUSTOMS', label: 'Customs & Border' },
      { value: 'PORT_OPERATIONS', label: 'Port Operations' },
    ],
  },
  {
    value: 'SECURITY_DEFENSE',
    label: 'Security & Defense',
    subcategories: [
      { value: 'CYBER_SECURITY_OPS', label: 'Cybersecurity Operations' },
      { value: 'PHYSICAL_SECURITY', label: 'Physical Security' },
      { value: 'INTELLIGENCE', label: 'Intelligence Analysis' },
      { value: 'MILITARY', label: 'Military & Defense' },
      { value: 'LAW_ENFORCEMENT', label: 'Law Enforcement' },
      { value: 'FIRE_SAFETY', label: 'Fire & Safety' },
      { value: 'PRIVATE_SECURITY', label: 'Private Security' },
      { value: 'RISK_MANAGEMENT', label: 'Risk Management' },
      { value: 'EMERGENCY_RESPONSE', label: 'Emergency Response' },
      { value: 'SURVEILLANCE', label: 'Surveillance & Monitoring' },
    ],
  },
  {
    value: 'ENTERTAINMENT',
    label: 'Entertainment & Gaming',
    subcategories: [
      { value: 'MUSIC', label: 'Music & Audio' },
      { value: 'FILM', label: 'Film & TV Production' },
      { value: 'GAMING', label: 'Gaming & Esports' },
      { value: 'EVENTS', label: 'Events & Live Entertainment' },
      { value: 'STREAMING', label: 'Streaming & Digital Media' },
      { value: 'THEATER', label: 'Theater & Performing Arts' },
      { value: 'COMEDY', label: 'Comedy & Stand-up' },
      { value: 'DANCE', label: 'Dance & Choreography' },
    ],
  },
  {
    value: 'ENERGY_UTILITIES',
    label: 'Energy & Utilities',
    subcategories: [
      { value: 'OIL_GAS', label: 'Oil & Gas' },
      { value: 'RENEWABLE_ENERGY', label: 'Renewable Energy' },
      { value: 'SOLAR', label: 'Solar Energy' },
      { value: 'WIND', label: 'Wind Energy' },
      { value: 'HYDRO', label: 'Hydroelectric Power' },
      { value: 'NUCLEAR_ENERGY', label: 'Nuclear Energy' },
      { value: 'WATER_UTILITIES', label: 'Water & Utilities' },
      { value: 'WASTE_MANAGEMENT', label: 'Waste Management' },
      { value: 'MINING_RESOURCES', label: 'Mining & Resources' },
      { value: 'ENVIRONMENTAL_SERVICES', label: 'Environmental Services' },
    ],
  },
  {
    value: 'SPORTS_RECREATION',
    label: 'Sports & Recreation',
    subcategories: [
      { value: 'SPORTS_MANAGEMENT', label: 'Sports Management' },
      { value: 'COACHING', label: 'Coaching & Training' },
      { value: 'SPORTS_MEDICINE', label: 'Sports Medicine' },
      { value: 'ATHLETICS', label: 'Athletics & Fitness' },
      { value: 'RECREATION', label: 'Recreation & Leisure' },
      { value: 'OUTDOOR', label: 'Outdoor & Adventure' },
      { value: 'ESPORTS', label: 'Esports' },
      { value: 'SPORTS_MARKETING', label: 'Sports Marketing' },
    ],
  },
  {
    value: 'TELECOMMUNICATIONS',
    label: 'Telecommunications',
    subcategories: [
      { value: 'NETWORK_ENGINEERING', label: 'Network Engineering' },
      { value: 'TELECOM_SALES', label: 'Telecom Sales' },
      { value: 'FIBER_OPTICS', label: 'Fiber Optics' },
      { value: 'MOBILE_NETWORKS', label: 'Mobile Networks' },
      { value: 'SATELLITE', label: 'Satellite Communications' },
      { value: 'VOIP', label: 'VoIP & Unified Communications' },
      { value: 'BROADCAST_ENGINEERING', label: 'Broadcast Engineering' },
      { value: 'TELECOM_INFRASTRUCTURE', label: 'Telecom Infrastructure' },
    ],
  },
  {
    value: 'AEROSPACE',
    label: 'Aerospace & Aviation',
    subcategories: [
      { value: 'AEROSPACE_ENGINEERING', label: 'Aerospace Engineering' },
      { value: 'AVIATION_MANAGEMENT', label: 'Aviation Management' },
      { value: 'FLIGHT_OPERATIONS', label: 'Flight Operations' },
      { value: 'AIR_TRAFFIC_CONTROL', label: 'Air Traffic Control' },
      { value: 'AIRCRAFT_MAINTENANCE', label: 'Aircraft Maintenance' },
      { value: 'SPACE_EXPLORATION', label: 'Space Exploration' },
      { value: 'SPACE_LAUNCH_OPERATIONS', label: 'Space Launch Operations' },
      { value: 'SPACE_COMMUNICATIONS', label: 'Space Communications' },
      { value: 'REMOTE_SENSING', label: 'Remote Sensing' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Experience Level
// ---------------------------------------------------------------------------

export const EXPERIENCE_LEVELS: EnumOption[] = [
  { value: 'ENTRY_LEVEL', label: 'Entry Level' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'MID_LEVEL', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'DIRECTOR', label: 'Director' },
  { value: 'EXECUTIVE', label: 'Executive' },
];

// ---------------------------------------------------------------------------
// Employment Type
// ---------------------------------------------------------------------------

export const EMPLOYMENT_TYPES: EnumOption[] = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'VOLUNTEER', label: 'Volunteer' },
];

// ---------------------------------------------------------------------------
// Opportunity Type
// ---------------------------------------------------------------------------

export const OPPORTUNITY_TYPES: EnumOption[] = [
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'SPONSORSHIP', label: 'Sponsorship' },
  { value: 'BURSARY', label: 'Bursary' },
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'UNIVERSITY_ADMISSION', label: 'University Admission' },
  { value: 'VOLUNTEER', label: 'Volunteer Opportunity' },
  { value: 'TRAINING', label: 'Training Program' },
  { value: 'GRANT', label: 'Grant' },
  { value: 'CERTIFICATION', label: 'Certification Program' },
  { value: 'FUNDING', label: 'Funding Opportunity' },
  { value: 'FELLOWSHIP', label: 'Fellowship' },
  { value: 'APPRENTICESHIP', label: 'Apprenticeship' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'COMPETITION', label: 'Competition' },
  { value: 'AWARD', label: 'Award' },
  { value: 'RESIDENCY', label: 'Residency' },
  { value: 'MENTORSHIP', label: 'Mentorship Program' },
  { value: 'ACCELERATOR', label: 'Accelerator Program' },
  { value: 'INCUBATOR', label: 'Incubator Program' },
  { value: 'BOOTCAMP', label: 'Bootcamp' },
  { value: 'EXCHANGE', label: 'Exchange Program' },
  { value: 'RESEARCH', label: 'Research Opportunity' },
];

// ---------------------------------------------------------------------------
// Currencies
// ---------------------------------------------------------------------------

export const CURRENCIES: EnumOption[] = [
  { value: 'KES', label: 'KES - Kenyan Shilling' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'UGX', label: 'UGX - Ugandan Shilling' },
  { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
  { value: 'RWF', label: 'RWF - Rwandan Franc' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
  { value: 'NGN', label: 'NGN - Nigerian Naira' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
];

// ---------------------------------------------------------------------------
// Job Status
// ---------------------------------------------------------------------------

export const JOB_STATUSES: EnumOption[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'ON_HOLD', label: 'On Hold' },
];

// ---------------------------------------------------------------------------
// Application Status
// ---------------------------------------------------------------------------

export const APPLICATION_STATUSES: EnumOption[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'REVIEWING', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { value: 'INTERVIEWED', label: 'Interviewed' },
  { value: 'OFFERED', label: 'Offer Extended' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

// ---------------------------------------------------------------------------
// User Roles
// ---------------------------------------------------------------------------

export const USER_ROLES: EnumOption[] = [
  { value: 'SEEKER', label: 'Job Seeker' },
  { value: 'EMPLOYER', label: 'Employer' },
  { value: 'ADMIN', label: 'Administrator' },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Find a label for a given enum value (e.g. findLabel(ORGANIZATION_TYPES, 'NGO') -> 'Non-Governmental Organizations (NGOs)') */
export function findLabel(options: EnumOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Build a { value -> label } map from any enum option array */
export function buildEnumMap(options: EnumOption[]): Record<string, string> {
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}
