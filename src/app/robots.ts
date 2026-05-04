import type { MetadataRoute } from "next";

const SITE_URL = "https://jobreadyke.co.ke";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/post-job/", "/cv-database/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
