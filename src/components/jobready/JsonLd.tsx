/**
 * JSON-LD Structured Data Component
 *
 * Renders <script type="application/ld+json"> tags for Google rich snippets.
 * Covers: WebSite, Organization, BreadcrumbList, JobPosting, Article, Company, CollectionPage.
 */

export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** WebSite + SearchAction — for homepage */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "JobReady",
        url: "https://jobreadyke.co.ke",
        description:
          "Kenya's most trusted job board. Real jobs from verified employers across all 47 counties.",
        inLanguage: "en-KE",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://jobreadyke.co.ke/jobs?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

/** Organization — site-wide via root layout */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "JobReady",
        url: "https://jobreadyke.co.ke",
        logo: "https://jobreadyke.co.ke/logo.svg",
        description:
          "Kenya's most trusted job board connecting job seekers with verified employers across all 47 counties.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          url: "https://jobreadyke.co.ke/contact",
        },
      }}
    />
  );
}

/** BreadcrumbList */
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

/** JobPosting — for job detail pages */
export function JobPostingJsonLd({
  title,
  description,
  datePosted,
  validThrough,
  employmentType,
  hiringOrganization,
  companyLogo,
  jobLocation,
  salaryMin,
  salaryMax,
  salaryCurrency = "KES",
  salaryPeriod,
  url,
  workMode,
}: {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string | null;
  employmentType?: string | null;
  hiringOrganization: string;
  companyLogo?: string | null;
  jobLocation: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  salaryPeriod?: string | null;
  url: string;
  workMode?: string | null;
}) {
  const empMap: Record<string, string> = {
    FULL_TIME: "FULL_TIME", PART_TIME: "PART_TIME", CONTRACT: "CONTRACT",
    INTERNSHIP: "INTERNSHIP", TEMPORARY: "TEMPORARY", FREELANCE: "CONTRACT",
  };
  const baseSalary = salaryMin != null || salaryMax != null
    ? { "@type": "MonetaryAmount", currency: salaryCurrency, value: { "@type": "QuantitativeValue", minValue: salaryMin || undefined, maxValue: salaryMax || undefined, unitText: salaryPeriod || "MONTH" } }
    : undefined;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title,
        description: description.replace(/<[^>]*>/g, ""),
        datePosted,
        validThrough: validThrough || undefined,
        employmentType: employmentType ? empMap[employmentType] || "FULL_TIME" : "FULL_TIME",
        hiringOrganization: { "@type": "Organization", name: hiringOrganization, ...(companyLogo && { logo: companyLogo }) },
        jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: jobLocation, addressCountry: "KE" } },
        ...(baseSalary && { baseSalary }),
        url,
        ...(workMode && { jobLocationType: workMode === "REMOTE" ? "TELECOMMUTE" : undefined }),
      }}
    />
  );
}

/** Article — for article detail pages */
export function ArticleJsonLd({
  title, description, url, image, datePublished, dateModified, author, publisher,
}: {
  title: string; description?: string | null; url: string; image?: string | null;
  datePublished: string; dateModified?: string | null; author?: string | null; publisher?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description || undefined,
        url,
        image: image || "https://jobreadyke.co.ke/logo.svg",
        datePublished,
        dateModified: dateModified || datePublished,
        author: { "@type": "Organization", name: author || publisher || "JobReady" },
        publisher: { "@type": "Organization", name: publisher || "JobReady", logo: { "@type": "ImageObject", url: "https://jobreadyke.co.ke/logo.svg" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      }}
    />
  );
}

/** Organization — for company detail pages */
export function CompanyJsonLd({
  name, description, url, logo, location, industry, website,
}: {
  name: string; description?: string | null; url: string; logo?: string | null;
  location?: string | null; industry?: string | null; website?: string | null;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        description: description || undefined,
        url,
        logo: logo || "https://jobreadyke.co.ke/logo.svg",
        ...(location && { address: { "@type": "PostalAddress", addressLocality: location, addressCountry: "KE" } }),
        ...(industry && { industry }),
        ...(website && { sameAs: [website] }),
      }}
    />
  );
}

/** CollectionPage — for listing pages */
export function CollectionPageJsonLd({ name, description, url, numberOfItems }: {
  name: string; description?: string; url: string; numberOfItems?: number;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url,
        isPartOf: { "@type": "WebSite", name: "JobReady", url: "https://jobreadyke.co.ke" },
        ...(numberOfItems !== undefined && { numberOfItems }),
      }}
    />
  );
}

/** FAQPage — for pages with frequently asked questions */
export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}
