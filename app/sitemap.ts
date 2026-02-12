import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface BlogData {
  slug: string;
  updatedAt?: string;
  publishedAt: string;
}

interface JourneyData {
  id: string;
  updatedAt?: string;
  date: string;
}

interface GuideData {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
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

async function getJourneys(): Promise<JourneyData[]> {
  try {
    const res = await fetch(`${API_URL}/journeys?published=true`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getGuides(): Promise<GuideData[]> {
  try {
    const res = await fetch(`${API_URL}/guides?published=true`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, journeys, guides] = await Promise.all([
    getBlogs(),
    getJourneys(),
    getGuides(),
  ]);

  const blogEntries = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const journeyEntries = journeys.map((journey) => ({
    url: `${SITE_URL}/journeys/${journey.id}`,
    lastModified: new Date(journey.updatedAt || journey.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${SITE_URL}/people/${guide.slug}`,
    lastModified: new Date(guide.updatedAt || guide.createdAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/journeys`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/people`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/gear`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/reading-list`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...blogEntries,
    ...journeyEntries,
    ...guideEntries,
  ];
}
