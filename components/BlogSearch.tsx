"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/blog";

interface BlogSearchProps {
  blogs: Blog[];
  showFeatured?: boolean;
}

export default function BlogSearch({ blogs, showFeatured = true }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach((blog) => blog.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        !searchQuery ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = !selectedTag || blog.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [blogs, searchQuery, selectedTag]);

  const featuredBlog = showFeatured
    ? filteredBlogs.find((b) => b.featured) || filteredBlogs[0]
    : null;
  const recentBlogs = featuredBlog
    ? filteredBlogs.filter((b) => b.id !== featuredBlog.id)
    : filteredBlogs;

  const isFiltering = searchQuery || selectedTag;

  return (
    <div>
      {/* ── Filter Bar ── */}
      <div className="wide-width mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Category tabs — horizontal scroll */}
          {allTags.length > 0 && (
            <div
              className="flex gap-2 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`flex-shrink-0 px-4 py-1.5 text-[0.6rem] font-medium tracking-[0.15em] uppercase border transition-all duration-200 ${
                  !selectedTag
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "bg-transparent border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                All
              </button>
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`flex-shrink-0 px-4 py-1.5 text-[0.6rem] font-medium tracking-[0.15em] uppercase border transition-all duration-200 ${
                    selectedTag === tag
                      ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                      : "bg-transparent border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Search — compact, right-aligned */}
          <div className="relative sm:w-52 flex-shrink-0">
            <svg
              className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-6 pr-7 py-2 bg-transparent border-b border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:border-[var(--foreground)] focus:outline-none transition-colors duration-200 tracking-wide"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {isFiltering && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
            <span className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--muted)]">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? "result" : "results"}
            </span>
            <button
              onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
              className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--foreground)] underline underline-offset-4 hover:no-underline transition-all"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Featured Story — Full Width Editorial Hero ── */}
      {featuredBlog && !isFiltering && showFeatured && (
        <section className="wide-width mb-10 md:mb-14">
          <Link href={`/blog/${featuredBlog.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[var(--border)]">
              {/* Image */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-[var(--background-alt)]">
                {featuredBlog.coverImage ? (
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-section)]">
                    <span className="font-serif text-8xl font-semibold text-[var(--border)] tracking-wide">
                      {featuredBlog.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-5 left-5">
                  <span className="bg-[var(--background)] text-[var(--foreground)] text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1.5 font-medium">
                    Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-[var(--background-card)]">
                <div className="flex items-center gap-3 mb-3 sm:mb-5">
                  {featuredBlog.tags?.[0] && (
                    <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--accent)] font-medium">
                      {featuredBlog.tags[0]}
                    </span>
                  )}
                  <span className="w-px h-3 bg-[var(--border)]" />
                  <span className="text-[0.6rem] tracking-[0.1em] text-[var(--muted)]">
                    {new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>

                <h2 className="font-serif font-semibold text-xl sm:text-2xl md:text-3xl tracking-wide leading-tight mb-3 sm:mb-4 group-hover:opacity-60 transition-opacity duration-200">
                  {featuredBlog.title}
                </h2>

                {featuredBlog.excerpt && (
                  <p className="text-[var(--muted)] leading-relaxed text-sm line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6">
                    {featuredBlog.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-[0.6rem] tracking-[0.15em] uppercase font-medium text-[var(--foreground)]">
                    Read Story
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-[var(--foreground)] transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  {featuredBlog.readingTime && (
                    <span className="ml-auto text-[0.55rem] tracking-[0.1em] uppercase text-[var(--muted)]">
                      {featuredBlog.readingTime} min read
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Stories Grid ── */}
      {recentBlogs.length > 0 ? (
        <section className="wide-width pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {recentBlogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block">
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden bg-[var(--background-alt)] mb-4">
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-section)]">
                      <span className="font-serif text-4xl font-semibold text-[var(--border)] tracking-wide">
                        {blog.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2.5 mb-3">
                  {blog.tags?.[0] && (
                    <span className="text-[0.55rem] tracking-[0.15em] uppercase text-[var(--accent)] font-medium">
                      {blog.tags[0]}
                    </span>
                  )}
                  <span className="w-px h-2.5 bg-[var(--border)]" />
                  <span className="text-[0.55rem] tracking-[0.08em] text-[var(--muted)]">
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-semibold text-lg tracking-wide leading-snug mb-2 group-hover:opacity-60 transition-opacity duration-200">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                {blog.excerpt && (
                  <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="wide-width py-20 text-center">
          <div className="border border-[var(--border)] p-12 inline-block">
            <svg className="w-6 h-6 text-[var(--muted)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="font-serif text-lg font-semibold tracking-wide mb-1.5">No stories found</h3>
            <p className="text-sm text-[var(--muted)] tracking-wide">Try adjusting your search or filter.</p>
          </div>
        </div>
      )}
    </div>
  );
}
