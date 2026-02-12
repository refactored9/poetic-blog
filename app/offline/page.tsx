"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[var(--accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-serif mb-4">
          You&apos;re offline
        </h1>
        <p className="text-[var(--muted)] mb-8 leading-relaxed">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry -
          any pages you&apos;ve visited before might still be available. Check your
          connection and try again.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
          <Link href="/reading-list" className="btn btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Reading List
          </Link>
        </div>

        {/* Tip */}
        <div className="bg-[var(--background-alt)] rounded-lg p-4 text-sm">
          <p className="text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Tip:</strong> Add stories to your reading
            list while online to access them offline later.
          </p>
        </div>
      </div>
    </div>
  );
}
