import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/post-job/", "/cv-database/", "/branding/", "/salary-guide/", "/pricing/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
