"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { getAllBlogs, deleteBlog, getVisitorStats, getTrafficSources, getTopPages, TrafficSource, TopPage } from "@/lib/api";
import { useStudioAuth } from "./StudioAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Stats {
  subscribers: number;
  unreadMessages: number;
  journeys: number;
  totalVisitors: number;
  todayVisitors: number;
}

export default function StudioDashboard() {
  const { logout } = useStudioAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<Stats>({ subscribers: 0, unreadMessages: 0, journeys: 0, totalVisitors: 0, todayVisitors: 0 });
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Load blogs
      const blogsData = await getAllBlogs();
      setBlogs(blogsData);

      // Load stats
      const [subscribersRes, messagesRes, journeysRes, visitorStats, sources, pages] = await Promise.all([
        fetch(`${API_URL}/newsletter`).catch(() => null),
        fetch(`${API_URL}/contact?status=unread`).catch(() => null),
        fetch(`${API_URL}/journeys`).catch(() => null),
        getVisitorStats(),
        getTrafficSources(),
        getTopPages(),
      ]);

      setTrafficSources(sources);
      setTopPages(pages);

      const newStats: Stats = { subscribers: 0, unreadMessages: 0, journeys: 0, totalVisitors: visitorStats.totalVisitors, todayVisitors: visitorStats.todayVisitors };

      if (subscribersRes?.ok) {
        const data = await subscribersRes.json();
        newStats.subscribers = Array.isArray(data) ? data.length : 0;
      }

      if (messagesRes?.ok) {
        const data = await messagesRes.json();
        newStats.unreadMessages = Array.isArray(data) ? data.length : 0;
      }

      if (journeysRes?.ok) {
        const data = await journeysRes.json();
        newStats.journeys = Array.isArray(data) ? data.length : 0;
      }

      setStats(newStats);
    } catch {
      setError("Unable to load data. Is the backend running?");
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
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif mb-2">Studio</h1>
              <p className="text-[var(--muted)]">
                Your creative workspace
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={logout}
                className="p-2 sm:px-3 sm:py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              <Link href="/studio/about" className="btn btn-secondary text-xs sm:text-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">About & Gear</span>
                <span className="sm:hidden">About</span>
              </Link>
              <Link href="/studio/write" className="btn btn-accent text-xs sm:text-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Story</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mt-8">
            <div className="card p-3 md:p-4 bg-gradient-to-br from-[var(--accent)]/5 to-transparent">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-xs text-[var(--muted)]">Total Visitors</p>
              </div>
              <p className="text-xl md:text-2xl font-serif text-[var(--accent)]">{stats.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="card p-3 md:p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-xs text-[var(--muted)]">Today</p>
              </div>
              <p className="text-xl md:text-2xl font-serif text-[var(--success)]">{stats.todayVisitors.toLocaleString()}</p>
            </div>
            <div className="card p-3 md:p-4">
              <p className="text-xl md:text-2xl font-serif text-[var(--accent)]">{publishedCount}</p>
              <p className="text-xs md:text-sm text-[var(--muted)]">Published</p>
            </div>
            <div className="card p-3 md:p-4">
              <p className="text-xl md:text-2xl font-serif text-[var(--muted)]">{draftCount}</p>
              <p className="text-xs md:text-sm text-[var(--muted)]">Drafts</p>
            </div>
            <Link href="/studio/journeys" className="card p-3 md:p-4 hover:border-[var(--accent)] transition-colors">
              <p className="text-xl md:text-2xl font-serif text-[var(--accent)]">{stats.journeys}</p>
              <p className="text-xs md:text-sm text-[var(--muted)]">Journeys</p>
            </Link>
            <Link href="/studio/subscribers" className="card p-3 md:p-4 hover:border-[var(--accent)] transition-colors">
              <p className="text-xl md:text-2xl font-serif text-[var(--accent)]">{stats.subscribers}</p>
              <p className="text-xs md:text-sm text-[var(--muted)]">Subscribers</p>
            </Link>
            <Link href="/studio/messages" className="card p-3 md:p-4 hover:border-[var(--accent)] transition-colors relative col-span-2 md:col-span-1">
              <p className="text-xl md:text-2xl font-serif text-[var(--accent)]">{stats.unreadMessages}</p>
              <p className="text-xs md:text-sm text-[var(--muted)]">New Messages</p>
              {stats.unreadMessages > 0 && (
                <span className="absolute top-2 md:top-3 right-2 md:right-3 w-2 h-2 bg-[var(--error)] rounded-full" />
              )}
            </Link>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          <Link
            href="/studio/journeys"
            className="card p-4 md:p-6 hover:border-[var(--accent)] transition-colors group"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--background-alt)] flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">Journeys</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">Photo galleries & travel stories</p>
              </div>
            </div>
          </Link>

          <Link
            href="/studio/messages"
            className="card p-4 md:p-6 hover:border-[var(--accent)] transition-colors group"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--background-alt)] flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">Messages</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">View & reply to messages</p>
              </div>
            </div>
          </Link>

          <Link
            href="/studio/subscribers"
            className="card p-4 md:p-6 hover:border-[var(--accent)] transition-colors group"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--background-alt)] flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">Subscribers</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">Manage newsletter</p>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="card p-4 md:p-6 hover:border-[var(--accent)] transition-colors group"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--background-alt)] flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">View Site</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">Open blog in new tab</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Analytics Section */}
        {(trafficSources.length > 0 || topPages.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Traffic Sources */}
            {trafficSources.length > 0 && (
              <div className="card p-4 md:p-6">
                <h3 className="text-lg font-serif mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Traffic Sources
                </h3>
                <div className="space-y-3">
                  {trafficSources.slice(0, 5).map((source, index) => {
                    const maxCount = trafficSources[0]?.count || 1;
                    const percentage = (source.count / maxCount) * 100;
                    return (
                      <div key={source.source || index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{source.source || 'unknown'}</span>
                          <span className="text-[var(--muted)]">{source.count}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-alt)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent)] rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Pages */}
            {topPages.length > 0 && (
              <div className="card p-4 md:p-6">
                <h3 className="text-lg font-serif mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Top Pages
                </h3>
                <div className="space-y-3">
                  {topPages.slice(0, 5).map((page, index) => {
                    const maxCount = topPages[0]?.count || 1;
                    const percentage = (page.count / maxCount) * 100;
                    return (
                      <div key={page.page || index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="truncate max-w-[200px]">{page.page === '/' ? 'Home' : page.page}</span>
                          <span className="text-[var(--muted)]">{page.count}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-alt)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--success)] rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Blog Posts */}
        <div className="mb-6">
          <h2 className="text-xl font-serif">Your Stories</h2>
        </div>

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
            <Link href="/studio/write" className="btn btn-accent">
              Write Your First Story
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="card p-4 md:p-6 group hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {blog.coverImage && (
                    <div className="relative w-full sm:w-32 h-40 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--background-alt)]">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h2 className="text-lg sm:text-xl font-serif truncate">{blog.title}</h2>
                          <span
                            className={`px-2 py-0.5 text-xs rounded flex-shrink-0 ${
                              blog.isPublished
                                ? "bg-[var(--success)]/10 text-[var(--success)]"
                                : "bg-[var(--background-alt)] text-[var(--muted)]"
                            }`}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted)] line-clamp-2 sm:line-clamp-1">
                          {blog.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs text-[var(--muted)]">
                          <span>
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>{blog.readingTime} min</span>
                          {blog.tags && blog.tags.length > 0 && (
                            <span className="hidden sm:inline">{blog.tags.slice(0, 2).join(", ")}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/studio/write?id=${blog.id}`}
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
