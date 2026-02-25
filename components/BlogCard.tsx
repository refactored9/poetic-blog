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
          {/* Image */}
          {blog.coverImage && (
            <div className="relative aspect-[16/9] mb-8 overflow-hidden bg-[var(--background-alt)]">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              {/* Featured badge */}
              <div className="absolute top-5 left-5">
                <span className="bg-white text-black text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 font-medium">
                  Featured
                </span>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            {blog.tags?.[0] && (
              <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--accent)] font-medium">
                {blog.tags[0]}
              </span>
            )}
            <span className="w-px h-3 bg-[var(--border)]" />
            <time className="text-[0.6rem] tracking-[0.1em] text-[var(--muted)]">{formattedDate}</time>
          </div>

          {/* Title */}
          <h2 className="font-serif font-semibold text-2xl md:text-3xl tracking-wide leading-tight mb-4 group-hover:opacity-60 transition-opacity duration-200">
            {blog.title}
          </h2>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-[var(--muted)] leading-relaxed line-clamp-2 text-sm md:text-base mb-7">
              {blog.excerpt}
            </p>
          )}

          {/* Read CTA */}
          <div className="flex items-center gap-3">
            <span className="text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--foreground)]">
              Read Story
            </span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group py-5 border-b border-[var(--border)] last:border-b-0">
        <Link href={`/blog/${blog.slug}`} className="flex gap-5 items-start">
          {blog.coverImage && (
            <div className="relative flex-shrink-0 overflow-hidden bg-[var(--background-alt)]" style={{ width: 72, height: 72 }}>
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
                sizes="72px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-sm font-semibold tracking-wide leading-snug mb-2 group-hover:opacity-60 transition-opacity duration-200 line-clamp-2">
              {blog.title}
            </h3>
            <div className="flex items-center gap-2">
              <time className="text-[0.6rem] tracking-[0.08em] text-[var(--muted)]">{formattedDate}</time>
              {blog.readingTime && (
                <>
                  <span className="w-px h-2.5 bg-[var(--border)]" />
                  <span className="text-[0.6rem] tracking-[0.08em] text-[var(--muted)]">{blog.readingTime} min</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Default variant — horizontal editorial layout
  return (
    <article className="group py-10 md:py-12 border-b border-[var(--border)] last:border-b-0">
      <Link href={`/blog/${blog.slug}`} className="block">
        <div className="flex flex-col md:flex-row gap-7 md:gap-10">
          {/* Image */}
          {blog.coverImage && (
            <div className="relative w-full md:w-56 h-44 md:h-36 flex-shrink-0 overflow-hidden bg-[var(--background-alt)]">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 224px"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              {blog.tags?.[0] && (
                <span className="text-[0.6rem] tracking-[0.15em] uppercase text-[var(--accent)] font-medium">
                  {blog.tags[0]}
                </span>
              )}
              <span className="w-px h-3 bg-[var(--border)]" />
              <time className="text-[0.6rem] tracking-[0.1em] text-[var(--muted)]">{formattedDate}</time>
            </div>

            {/* Title */}
            <h2 className="font-serif font-semibold text-xl md:text-2xl tracking-wide leading-tight mb-3 group-hover:opacity-60 transition-opacity duration-200">
              {blog.title}
            </h2>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-2 mb-5">
                {blog.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center gap-5">
              {blog.readingTime && (
                <span className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--muted)]">
                  {blog.readingTime} min read
                </span>
              )}
              <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.15em] uppercase font-medium text-[var(--foreground)] group-hover:opacity-60 transition-opacity duration-200">
                Read
                <svg
                  className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
