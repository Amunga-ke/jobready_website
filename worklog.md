---
Task ID: 1
Agent: Main
Task: Integrate all enum/reference data from org_data.js into the Jobnet project

Work Log:
- Read and parsed org_data.js (1319 lines, 9 enum datasets)
- Created `src/lib/enums.ts` with all enum constants (OrganizationType, Industry, Countries, JobCategories with subcategories, ExperienceLevel, EmploymentType, OpportunityType, Currencies, JobStatus, ApplicationStatus, UserRoles) plus helper functions (findLabel, buildEnumMap)
- Updated `src/types/index.ts` with corresponding TypeScript literal union types (OrganizationType, Industry, JobCategoryValue, JobCategory, ExperienceLevel, EmploymentType, OpportunityType, JobStatus, ApplicationStatus, Currency, UserRole)
- Rewrote `prisma/schema.prisma` with 13 proper Prisma enums: UserRole, OrganizationType, Industry, EmploymentType, ExperienceLevel, JobStatus, ApplicationStatus, Currency, OpportunityType, LocationType
- Added new `Subcategory` model to Prisma schema with relation to Category and Job
- Enhanced Company model with `orgType` (OrganizationType enum) and `industry` (Industry enum)
- Enhanced Job model with proper enum fields (type, level, salaryCurrency, status), added `subcategoryId` relation
- Enhanced Application model with ApplicationStatus enum
- Enhanced SalaryRecord model with ExperienceLevel and Currency enums
- Added LocationType enum (COUNTRY, COUNTY, AREA, REMOTE) to Location model with countryCode and dialCode fields

Stage Summary:
- 3 files created/updated: src/lib/enums.ts, src/types/index.ts, prisma/schema.prisma
- All 9 enum datasets from org_data.js are now typed and constantized
- Prisma schema is fully updated with native MySQL enums
- Pending: seed.ts needs update for new enum values (blocked by DB IP whitelist)
- Pending: `prisma db push` and `prisma generate` (blocked by DB IP whitelist)
