---
Task ID: 1
Agent: Main
Task: Implement mobile overlay menu, swap Sign In/Post Job, implement job detail page with URL sync

Work Log:
- Replaced static Navbar.tsx with client component featuring hamburger menu + full-screen right-drawer overlay
- Swapped button hierarchy: Sign In is now prominent (bg-ink white text), Post Job is subtle text link
- Added 7 nav links (Jobs, Government, Casual, Opportunities, Companies, Resources, Salary Guide) with Next.js Link routing
- Mobile menu includes all nav links + bottom CTA section with Sign In prominent + Post Job subtle
- Created /src/types/index.ts with Job, JobCard, Company, Article, JobFilters interfaces
- Created /src/components/fursa/JobModalContext.tsx with useJobModal hook, openJob/closeJob, history.pushState URL sync
- Created /src/components/fursa/JobDetailSheet.tsx sidesheet with full job detail layout, salary block, share button, apply CTA
- Created /src/app/jobs/[slug]/page.tsx with SSR, generateMetadata for SEO, Open Graph tags, structured HTML
- Created /src/app/jobs/page.tsx browse jobs stub with search bar and sample links
- Updated Footer.tsx to use Next.js Link with functional routes
- Updated layout.tsx to wrap app in JobModalProvider + render JobDetailSheet globally
- Build verified: all routes compile, /jobs/[slug] renders as dynamic server route

Stage Summary:
- Mobile overlay menu: DONE (hamburger + right-drawer with backdrop blur)
- Sign In/Post Job swap: DONE (Sign In prominent)
- Job detail page + sidesheet: DONE (SSR page + URL sync + shareable links)
- 3 sample job pages seeded for testing
