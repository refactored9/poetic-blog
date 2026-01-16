import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface BlogData {
  slug: string;
  updatedAt?: string;
  publishedAt: string;
}

async function getBlogs(): Promise<BlogData[]> {
  try {
    const res = await fetch(`${API_URL}/blogs?published=true`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getBlogs();

  const blogEntries = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...blogEntries,
  ];
}
