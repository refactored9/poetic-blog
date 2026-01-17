import { Metadata } from "next";
import Link from "next/link";
import { Journey } from "@/types/blog";
import JourneyGallery from "@/components/JourneyGallery";
import JourneyCoverImage from "@/components/JourneyCoverImage";

export const metadata: Metadata = {
  title: "Journeys | Visual Stories",
  description: "Visual stories from places I've wandered. A collection of moments captured along the way.",
};

async function getJourneys(): Promise<Journey[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/journeys?published=true`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch {
    return [];
  }
}

function JourneyCard({ journey, index }: { journey: Journey; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <article className="journey-section mb-20 md:mb-32 last:mb-0">
      {/* Journey Header */}
      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 mb-8 md:mb-12`}>
        {/* Cover Image */}
        {journey.coverImage && (
          <div className="md:w-1/3 lg:w-2/5">
            <JourneyCoverImage
              src={journey.coverImage}
              alt={journey.title}
              priority={index === 0}
              imageCount={journey.images.length}
            />
          </div>
        )}

        {/* Journey Info */}
        <div className={`flex-1 flex flex-col justify-center ${!journey.coverImage ? 'max-w-2xl' : ''}`}>
          {/* Date & Location */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-[var(--muted)] mb-3 md:mb-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {journey.location}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(journey.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif mb-3 md:mb-4 leading-tight">
            {journey.title}
          </h2>

          {/* Description */}
          {journey.description && (
            <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed max-w-xl">
              {journey.description}
            </p>
          )}

          {/* Decorative line */}
          <div className="mt-6 md:mt-8 flex items-center gap-3">
            <div className="w-12 md:w-16 h-px bg-[var(--accent)]" />
            <span className="text-[var(--accent)] text-xs md:text-sm font-medium tracking-widest uppercase">
              {journey.images.length} Moments
            </span>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <JourneyGallery
        images={journey.images}
        journeyTitle={journey.title}
        journeyLocation={journey.location}
      />
    </article>
  );
}

export default async function JourneysPage() {
  const journeys = await getJourneys();

  const totalImages = journeys.reduce((sum, journey) => sum + journey.images.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="wide-width relative">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 md:mb-12 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to writings
          </Link>

          {/* Main title */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 md:w-12 h-px bg-[var(--accent)]" />
              <span className="text-[var(--accent)] text-xs md:text-sm font-medium tracking-[0.2em] uppercase">
                Visual Stories
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 md:mb-6 leading-[1.1]">
              Journeys
            </h1>

            <p className="text-[var(--muted)] text-lg md:text-xl lg:text-2xl font-serif italic leading-relaxed">
              &ldquo;The world is a book, and those who do not travel read only one page.&rdquo;
            </p>

            <p className="text-[var(--muted)] text-base md:text-lg mt-4 md:mt-6 max-w-xl">
              Visual fragments from the places I&apos;ve wandered. Each photograph holds a story, each moment a memory frozen in time.
            </p>

            {/* Stats */}
            {journeys.length > 0 && (
              <div className="flex items-center gap-6 md:gap-8 mt-8 md:mt-10">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">{totalImages}</p>
                  <p className="text-xs md:text-sm text-[var(--muted)] mt-1 tracking-wide uppercase">Photographs</p>
                </div>
                <div className="w-px h-12 bg-[var(--border)]" />
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">{journeys.length}</p>
                  <p className="text-xs md:text-sm text-[var(--muted)] mt-1 tracking-wide uppercase">Journeys</p>
                </div>
              </div>
            )}
          </div>

          {/* Decorative element */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 opacity-10">
            <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="var(--foreground)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="60" stroke="var(--foreground)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="40" stroke="var(--foreground)" strokeWidth="0.5" />
              <path d="M100 20 L100 180 M20 100 L180 100" stroke="var(--foreground)" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
      </header>

      {/* Journeys Content */}
      <main className="wide-width pb-16 md:pb-24">
        {journeys.length > 0 ? (
          <div className="space-y-0">
            {journeys.map((journey, index) => (
              <JourneyCard key={journey.id} journey={journey} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 md:py-32">
            <div className="inline-block p-4 rounded-full bg-[var(--background-alt)] mb-6">
              <svg className="w-12 h-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-serif mb-2">No journeys yet</h2>
            <p className="text-[var(--muted)] font-serif italic">
              The road awaits. New adventures coming soon.
            </p>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="border-t border-[var(--border)] bg-[var(--background-alt)]">
        <div className="wide-width py-10 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Quote */}
            <div className="max-w-md">
              <p className="text-[var(--muted)] text-sm md:text-base font-serif italic">
                &ldquo;Not all those who wander are lost.&rdquo;
              </p>
              <p className="text-[var(--muted)]/60 text-xs mt-1">— J.R.R. Tolkien</p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link
                href="/"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Writings
              </Link>
              <Link
                href="/about"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                About
              </Link>
              <Link
                href="/gear"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Gear
              </Link>
              <Link
                href="/contact"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
