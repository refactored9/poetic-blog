import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/studio/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/studio/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
