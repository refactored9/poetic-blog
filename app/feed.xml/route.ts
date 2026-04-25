import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  tags?: string[];
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/blogs?published=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function GET() {
  const blogs = await getBlogs();

  const now = new Date().toUTCString();

  const rssItems = blogs
    .map((blog) => {
      const pubDate = new Date(blog.publishedAt).toUTCString();
      const description = blog.excerpt || stripHtml(blog.content).slice(0, 300) + "...";
      const categories = blog.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n        ") || "";

      return `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(blog.author)}</author>
      ${categories}
      ${blog.coverImage ? `<enclosure url="${escapeXml(blog.coverImage)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>The Solo Akash</title>
    <link>${SITE_URL}</link>
    <description>A quiet corner for thoughts, places, and poetry. Stories told through words and wanderings.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/opengraph-image</url>
      <title>The Solo Akash</title>
      <link>${SITE_URL}</link>
    </image>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
