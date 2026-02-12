"use client";

import { useState, useEffect } from "react";

interface BookmarkButtonProps {
  blogId: string;
  blogSlug: string;
  blogTitle: string;
  blogExcerpt?: string;
  blogCoverImage?: string;
  variant?: "icon" | "button";
  className?: string;
  onToggle?: (isBookmarked: boolean) => void;
}

export interface BookmarkedBlog {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  bookmarkedAt: string;
}

const BOOKMARKS_KEY = "poetic-blog-bookmarks";

export function getBookmarks(): BookmarkedBlog[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(blogId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.id === blogId);
}

export function addBookmark(blog: Omit<BookmarkedBlog, "bookmarkedAt">): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.some((b) => b.id === blog.id)) {
    bookmarks.unshift({
      ...blog,
      bookmarkedAt: new Date().toISOString(),
    });
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(blogId: string): void {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter((b) => b.id !== blogId);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
}

export function clearBookmarks(): void {
  localStorage.removeItem(BOOKMARKS_KEY);
}

export function exportBookmarks(): string {
  const bookmarks = getBookmarks();
  return JSON.stringify(bookmarks, null, 2);
}

export default function BookmarkButton({
  blogId,
  blogSlug,
  blogTitle,
  blogExcerpt,
  blogCoverImage,
  variant = "icon",
  className = "",
  onToggle,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarked(isBookmarked(blogId));
  }, [blogId]);

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(blogId);
      setBookmarked(false);
      onToggle?.(false);
    } else {
      addBookmark({
        id: blogId,
        slug: blogSlug,
        title: blogTitle,
        excerpt: blogExcerpt,
        coverImage: blogCoverImage,
      });
      setBookmarked(true);
      onToggle?.(true);
    }
  };

  if (!mounted) {
    return variant === "icon" ? (
      <button className={`p-2 ${className}`} disabled>
        <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    ) : (
      <button className={`btn btn-secondary ${className}`} disabled>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        Save
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={toggleBookmark}
        className={`p-2 transition-colors ${className}`}
        title={bookmarked ? "Remove from reading list" : "Add to reading list"}
        aria-label={bookmarked ? "Remove from reading list" : "Add to reading list"}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            bookmarked ? "text-[var(--accent)] fill-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--accent)]"
          }`}
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleBookmark}
      className={`btn ${bookmarked ? "btn-accent" : "btn-secondary"} ${className}`}
    >
      <svg
        className="w-4 h-4"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
