"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Journey } from "@/types/blog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function StudioJourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourneys();
  }, []);

  async function loadJourneys() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/journeys`);
      if (res.ok) {
        const data = await res.json();
        setJourneys(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading journeys:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteJourney(id: string) {
    if (!confirm("Are you sure you want to delete this journey?")) return;

    try {
      const res = await fetch(`${API_URL}/journeys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJourneys(journeys.filter((j) => j.id !== id && j._id !== id));
      }
    } catch (error) {
      console.error("Error deleting journey:", error);
    }
  }

  async function togglePublish(journey: Journey) {
    try {
      const id = journey.id || journey._id;
      const res = await fetch(`${API_URL}/journeys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !journey.isPublished }),
      });
      if (res.ok) {
        setJourneys(
          journeys.map((j) =>
            (j.id === id || j._id === id) ? { ...j, isPublished: !j.isPublished } : j
          )
        );
      }
    } catch (error) {
      console.error("Error updating journey:", error);
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
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <Link href="/studio" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif">Journeys</h1>
          </div>
          <p className="text-[var(--muted)] text-sm md:text-base pl-8 md:pl-9">
            Manage your photo journeys and travel stories
          </p>
        </header>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="text-sm text-[var(--muted)]">
            {journeys.length} {journeys.length === 1 ? "journey" : "journeys"}
          </div>
          <Link href="/studio/journeys/new" className="btn btn-accent text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Journey
          </Link>
        </div>

        {/* Journeys Grid */}
        {journeys.length === 0 ? (
          <div className="card p-8 md:p-16 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--background-alt)] flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-serif mb-2 md:mb-3">No Journeys Yet</h2>
            <p className="text-[var(--muted)] max-w-md mx-auto mb-6 md:mb-8 text-sm md:text-base">
              Share your travel adventures with beautiful photo galleries. Each journey tells a story.
            </p>
            <Link href="/studio/journeys/new" className="btn btn-accent">
              Create Your First Journey
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {journeys.map((journey) => {
              const id = journey.id || journey._id;
              const coverImage = journey.coverImage || journey.images?.[0]?.url;

              return (
                <div key={id} className="card overflow-hidden group">
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] bg-[var(--background-alt)]">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={journey.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          journey.isPublished
                            ? "bg-[var(--success)]/90 text-white"
                            : "bg-black/50 text-white"
                        }`}
                      >
                        {journey.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Image Count */}
                    {journey.images && journey.images.length > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 rounded-full text-white text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                        </svg>
                        {journey.images.length}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-lg line-clamp-1">{journey.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-3">
                      {journey.location && (
                        <>
                          <span>{journey.location}</span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        </>
                      )}
                      <span>
                        {new Date(journey.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {journey.description && (
                      <p className="text-sm text-[var(--muted)] line-clamp-2 mb-4">
                        {journey.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                      <Link
                        href={`/studio/journeys/${id}`}
                        className="flex-1 btn btn-secondary text-xs justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => togglePublish(journey)}
                        className="flex-1 btn btn-secondary text-xs justify-center"
                      >
                        {journey.isPublished ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            Unpublish
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Publish
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => id && deleteJourney(id)}
                        className="p-2 text-[var(--error)] hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
