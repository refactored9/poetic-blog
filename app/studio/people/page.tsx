"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Guide } from "@/types/blog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function StudioPeoplePage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuides();
  }, []);

  async function loadGuides() {
    try {
      const res = await fetch(`${API_URL}/guides`);
      if (res.ok) {
        const data = await res.json();
        setGuides(data);
      }
    } catch (error) {
      console.error("Failed to load guides:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteGuide(id: string) {
    if (!confirm("Are you sure you want to delete this guide?")) return;

    try {
      const res = await fetch(`${API_URL}/guides/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGuides((prev) => prev.filter((g) => g.id !== id && g._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete guide:", error);
    }
  }

  async function togglePublish(guide: Guide) {
    try {
      const res = await fetch(`${API_URL}/guides/${guide.id || guide._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !guide.isPublished }),
      });
      if (res.ok) {
        setGuides((prev) =>
          prev.map((g) =>
            (g.id || g._id) === (guide.id || guide._id)
              ? { ...g, isPublished: !g.isPublished }
              : g
          )
        );
      }
    } catch (error) {
      console.error("Failed to update guide:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-20">
      <div className="wide-width">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/studio" className="text-[var(--muted)] hover:text-[var(--foreground)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl md:text-3xl font-serif">People / Guides</h1>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Manage your network of local guides
            </p>
          </div>
          <Link href="/studio/people/new" className="btn btn-accent">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Guide
          </Link>
        </header>

        {/* Guides List */}
        {guides.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--background-alt)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif mb-2">No guides yet</h2>
            <p className="text-[var(--muted)] mb-6">Start building your network of local guides</p>
            <Link href="/studio/people/new" className="btn btn-accent">
              Add Your First Guide
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <div
                key={guide.id || guide._id}
                className="card overflow-hidden"
              >
                {/* Cover/Profile Image */}
                <div className="relative h-32 bg-[var(--background-alt)]">
                  {guide.coverImage || guide.profileImage ? (
                    <Image
                      src={guide.coverImage || guide.profileImage || ""}
                      alt={guide.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-serif text-[var(--muted)]">
                        {guide.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {guide.isFeatured && (
                      <span className="px-2 py-0.5 bg-[var(--accent)] text-white text-xs rounded">
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        guide.isPublished
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {guide.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-serif text-lg mb-1">{guide.name}</h3>
                  {guide.tagline && (
                    <p className="text-sm text-[var(--muted)] line-clamp-1 mb-2">
                      {guide.tagline}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-[var(--muted)] mb-3">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {guide.location.city}, {guide.location.country}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                    <Link
                      href={`/studio/people/${guide.id || guide._id}`}
                      className="flex-1 btn btn-secondary text-sm justify-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => togglePublish(guide)}
                      className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:border-[var(--accent)]"
                    >
                      {guide.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => deleteGuide(guide.id || guide._id || "")}
                      className="p-2 text-[var(--error)] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
