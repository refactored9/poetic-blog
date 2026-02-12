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

  // Extract all unique tags from blogs
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach((blog) => {
      blog.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [blogs]);

  // Filter blogs based on search and tag
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        !searchQuery ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

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
      {/* Search and Filter Bar */}
      <div className="wide-width mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search writings..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                  !selectedTag
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "bg-[var(--background-card)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
                }`}
              >
                All
              </button>
              {allTags.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                    selectedTag === tag
                      ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                      : "bg-[var(--background-card)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active filters indicator */}
        {isFiltering && (
          <div className="flex items-center gap-2 mt-3 text-sm text-[var(--muted)]">
            <span>
              Found {filteredBlogs.length} {filteredBlogs.length === 1 ? "result" : "results"}
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}
              className="text-[var(--accent)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Featured Story - Large Hero (only shown when not filtering) */}
      {featuredBlog && !isFiltering && showFeatured && (
        <section className="py-4 md:py-6">
          <div className="wide-width">
            <Link href={`/blog/${featuredBlog.slug}`} className="group block">
              <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-xl md:rounded-2xl overflow-hidden bg-[var(--background-alt)]">
                {featuredBlog.coverImage ? (
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="100vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--background-alt)] to-[var(--border)]">
                    <span className="text-6xl md:text-8xl font-serif text-[var(--muted)]">
                      {featuredBlog.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8" style={{ color: "white" }}>
                  <div className="max-w-3xl">
                    <div
                      className="flex items-center gap-2 md:gap-3 text-xs md:text-sm mb-1.5 md:mb-2"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {featuredBlog.tags && featuredBlog.tags[0] && (
                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-white/25 backdrop-blur-sm rounded-full text-[10px] md:text-xs">
                          {featuredBlog.tags[0]}
                        </span>
                      )}
                      <span>
                        {new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2
                      className="text-lg md:text-3xl lg:text-4xl font-serif mb-1 md:mb-2 leading-tight"
                      style={{ color: "white" }}
                    >
                      {featuredBlog.title}
                    </h2>
                    <p
                      className="text-xs md:text-base leading-relaxed line-clamp-2 md:line-clamp-3"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {featuredBlog.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      {recentBlogs.length > 0 ? (
        <section className="py-6 md:py-10">
          <div className="wide-width">
            {!isFiltering && (
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xs md:text-sm font-medium tracking-wide uppercase text-[var(--muted)]">
                  Recent Writings
                </h2>
                <span className="text-xs md:text-sm text-[var(--muted)]">{blogs.length} stories</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {recentBlogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden bg-[var(--background-alt)] mb-2 md:mb-3 transition-shadow duration-400 group-hover:shadow-[0_0_20px_rgba(201,149,107,0.15)]">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-serif text-[var(--muted)]">
                          {blog.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--muted)] mb-1.5 md:mb-2">
                    <span>
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {blog.tags && blog.tags[0] && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span>{blog.tags[0]}</span>
                      </>
                    )}
                    {blog.readingTime && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span>{blog.readingTime} min contemplation</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base md:text-lg font-serif leading-snug group-hover:text-[var(--accent)] transition-colors mb-1.5 md:mb-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs md:text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="wide-width py-16 text-center">
          <div className="inline-block p-4 rounded-full bg-[var(--background-alt)] mb-4">
            <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-serif mb-2">No writings found</h3>
          <p className="text-sm text-[var(--muted)]">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}
