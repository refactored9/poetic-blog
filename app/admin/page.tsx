"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { getAllBlogs, deleteBlog } from "@/lib/api";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data);
    } catch {
      setError("Unable to load blogs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch {
      alert("Failed to delete blog");
    }
  }

  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const draftCount = blogs.filter((b) => !b.isPublished).length;

  return (
    <div className="min-h-screen pt-12 pb-20">
      <div className="wide-width">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-serif mb-2">Studio</h1>
              <p className="text-[var(--muted)]">
                Your creative workspace
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/about" className="btn btn-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>About & Gear</span>
              </Link>
              <Link href="/admin/write" className="btn btn-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Story</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          {blogs.length > 0 && (
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-[var(--border)]">
              <div>
                <p className="text-3xl font-serif text-[var(--accent)]">{publishedCount}</p>
                <p className="text-sm text-[var(--muted)]">Published</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-[var(--muted)]">{draftCount}</p>
                <p className="text-sm text-[var(--muted)]">Drafts</p>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--muted)]">Loading your stories...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[var(--foreground)] font-medium mb-2">Connection Error</p>
            <p className="text-[var(--muted)]">{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--background-alt)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif mb-3">Begin Your Journey</h2>
            <p className="text-[var(--muted)] max-w-md mx-auto mb-8">
              Every great story starts with a single word. Create your first post and let your thoughts flow.
            </p>
            <Link href="/admin/write" className="btn btn-accent">
              Write Your First Story
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="card p-6 group hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  {blog.coverImage && (
                    <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--background-alt)]">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-serif truncate">{blog.title}</h2>
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              blog.isPublished
                                ? "bg-[var(--success)]/10 text-[var(--success)]"
                                : "bg-[var(--background-alt)] text-[var(--muted)]"
                            }`}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted)] line-clamp-1">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted)]">
                          <span>
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span>{blog.readingTime} min read</span>
                          {blog.tags && blog.tags.length > 0 && (
                            <span>{blog.tags.slice(0, 2).join(", ")}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/write?id=${blog.id}`}
                          className="p-2 rounded-lg hover:bg-[var(--background-alt)] transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        {blog.isPublished && (
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="p-2 rounded-lg hover:bg-[var(--background-alt)] transition-colors"
                            title="View"
                          >
                            <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
