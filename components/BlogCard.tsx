import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/blog";

interface BlogCardProps {
  blog: Blog;
  variant?: "default" | "featured" | "compact";
}

export default function BlogCard({ blog, variant = "default" }: BlogCardProps) {
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (variant === "featured") {
    return (
      <article className="group">
        <Link href={`/blog/${blog.slug}`} className="block">
          {blog.coverImage && (
            <div className="relative aspect-[2/1] mb-5 overflow-hidden rounded-lg image-hover">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <div className="flex items-center gap-3 mb-2">
            <time className="text-xs tracking-wide text-[var(--muted)]">
              {formattedDate}
            </time>
            {blog.tags && blog.tags[0] && (
              <>
                <span className="text-[var(--border)]">·</span>
                <span className="text-xs text-[var(--accent)]">{blog.tags[0]}</span>
              </>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mb-2 leading-tight">
            {blog.title}
          </h2>
          <p className="text-[var(--muted)] leading-relaxed line-clamp-2 mb-4">
            {blog.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 text-sm text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            Read story
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group py-4">
        <Link href={`/blog/${blog.slug}`} className="flex gap-4 items-start">
          {blog.coverImage && (
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded image-hover">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
              <time>{formattedDate}</time>
              <span className="text-[var(--border)]">|</span>
              <span>{blog.readingTime} min</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group py-10 border-b border-[var(--border)] last:border-b-0">
      <Link href={`/blog/${blog.slug}`} className="block">
        <div className="flex flex-col md:flex-row gap-6">
          {blog.coverImage && (
            <div className="relative w-full md:w-48 aspect-[16/9] md:aspect-square flex-shrink-0 overflow-hidden rounded image-hover">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <time className="text-xs tracking-widest text-[var(--muted)] uppercase">
                {formattedDate}
              </time>
              {blog.tags && blog.tags[0] && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  <span className="text-xs text-[var(--accent)]">{blog.tags[0]}</span>
                </>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mb-3 leading-tight">
              {blog.title}
            </h2>
            <p className="text-[var(--muted)] leading-relaxed line-clamp-2 mb-4">
              {blog.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
              <span>{blog.readingTime} min read</span>
              <span className="flex items-center gap-1 group-hover:text-[var(--accent)] transition-colors">
                Read more
                <svg
                  className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
