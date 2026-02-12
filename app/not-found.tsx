import Link from "next/link";
import MountainDivider from "@/components/MountainDivider";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Decorative illustration */}
        <div className="mb-8 relative">
          <div className="text-[150px] font-serif text-[var(--border)] select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 flex items-center justify-center" style={{ animation: "breathe 4s ease-in-out infinite" }}>
              <svg
                className="w-12 h-12 text-[var(--accent)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Poetic message */}
        <h1 className="text-2xl md:text-3xl font-serif mb-4">
          Not all who wander are lost...
        </h1>
        <p className="text-[var(--muted)] mb-8 leading-relaxed">
          But this path leads nowhere the map can show. The page you seek has
          drifted beyond our reach, perhaps to places yet unexplored.
        </p>

        {/* Suggested links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="btn btn-primary"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4L3 20h18L12 4z" />
            </svg>
            Return to Camp
          </Link>
          <Link
            href="/journeys"
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Explore Journeys
          </Link>
        </div>

        {/* Additional links */}
        <div className="text-sm text-[var(--muted)]">
          <span>Or visit: </span>
          <Link href="/about" className="link-hover text-[var(--accent)]">
            About
          </Link>
          <span className="mx-2">&middot;</span>
          <Link href="/people" className="link-hover text-[var(--accent)]">
            People
          </Link>
          <span className="mx-2">&middot;</span>
          <Link href="/contact" className="link-hover text-[var(--accent)]">
            Contact
          </Link>
        </div>
      </div>

      {/* Mountain divider at bottom */}
      <MountainDivider variant="mountain" className="w-full mt-12 max-w-2xl opacity-50" />
    </div>
  );
}
