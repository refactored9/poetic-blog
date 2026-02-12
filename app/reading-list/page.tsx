"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBookmarks, removeBookmark, clearBookmarks, exportBookmarks, BookmarkedBlog } from "@/components/BookmarkButton";

export default function ReadingListPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedBlog[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your entire reading list?")) {
      clearBookmarks();
      setBookmarks([]);
    }
  };

  const handleExport = () => {
    const data = exportBookmarks();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reading-list.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return (
      <div className="wide-width py-8 md:py-12">
        <div className="skeleton h-10 w-64 rounded mb-4" />
        <div className="skeleton h-5 w-96 rounded mb-12" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="wide-width py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-16">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif mb-2">Reading List</h1>
          <p className="text-[var(--muted)]">
            {bookmarks.length === 0
              ? "Save stories to read later"
              : `${bookmarks.length} ${bookmarks.length === 1 ? "story" : "stories"} saved`}
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="btn btn-secondary text-sm"
              title="Export as JSON"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button
              onClick={handleClearAll}
              className="btn btn-secondary text-sm text-[var(--error)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-[var(--background-alt)] rounded-2xl">
          <svg
            className="w-16 h-16 mx-auto mb-6 text-[var(--muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h2 className="text-xl font-serif mb-3">No saved stories yet</h2>
          <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
            When you find a story you want to read later, click the bookmark icon to save it here.
          </p>
          <Link href="/" className="btn btn-primary">
            Browse Stories
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group flex gap-4 p-4 bg-[var(--background-card)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors"
            >
              {/* Cover Image */}
              {bookmark.coverImage ? (
                <Link
                  href={`/blog/${bookmark.slug}`}
                  className="relative w-24 h-24 md:w-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={bookmark.coverImage}
                    alt={bookmark.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              ) : (
                <Link
                  href={`/blog/${bookmark.slug}`}
                  className="w-24 h-24 md:w-32 md:h-24 rounded-lg bg-[var(--background-alt)] flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-2xl font-serif text-[var(--muted)]">
                    {bookmark.title.charAt(0)}
                  </span>
                </Link>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${bookmark.slug}`}>
                  <h3 className="font-serif text-lg mb-1 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                    {bookmark.title}
                  </h3>
                </Link>
                {bookmark.excerpt && (
                  <p className="text-sm text-[var(--muted)] line-clamp-2 mb-2">
                    {bookmark.excerpt}
                  </p>
                )}
                <p className="text-xs text-[var(--muted-soft)]">
                  Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(bookmark.id)}
                className="self-start p-2 text-[var(--muted)] hover:text-[var(--error)] transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from reading list"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
