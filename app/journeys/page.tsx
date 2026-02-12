import { Metadata } from "next";
import Link from "next/link";
import { Journey } from "@/types/blog";
import JourneyGallery from "@/components/JourneyGallery";
import JourneyCoverImage from "@/components/JourneyCoverImage";
import ShareButton from "@/components/ShareButton";
import JourneyMap from "@/components/JourneyMap";

export const metadata: Metadata = {
  title: "Journeys | Visual Stories",
  description: "Visual stories from places I've wandered. A collection of moments captured along the way.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";

function JourneysJsonLd({ journeys }: { journeys: Journey[] }) {
  const totalImages = journeys.reduce((sum, j) => sum + j.images.length, 0);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Journeys - Visual Stories",
    description: "Visual stories from places I've wandered. A collection of moments captured along the way.",
    url: `${SITE_URL}/journeys`,
    numberOfItems: journeys.length,
    hasPart: journeys.map((journey) => ({
      "@type": "ImageGallery",
      name: journey.title,
      description: journey.description,
      numberOfItems: journey.images.length,
      contentLocation: {
        "@type": "Place",
        name: journey.location,
      },
      dateCreated: journey.date,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journeys",
        item: `${SITE_URL}/journeys`,
      },
    ],
  };

  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "The Solo Akash - Travel Photography",
    description: `A collection of ${totalImages} photographs from ${journeys.length} journeys.`,
    url: `${SITE_URL}/journeys`,
    numberOfItems: totalImages,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />
    </>
  );
}

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

          {/* Decorative line & Share */}
          <div className="mt-6 md:mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 md:w-16 h-px bg-[var(--accent)]" />
              <span className="text-[var(--accent)] text-xs md:text-sm font-medium tracking-widest uppercase">
                {journey.images.length} Moments
              </span>
            </div>
            <ShareButton
              url={`/journeys#${journey.id}`}
              title={journey.title}
              description={journey.description}
            />
          </div>
        </div>
      </div>

      {/* Hiking Map (if route exists) */}
      {journey.route?.enabled && (
        <div className="mb-8 md:mb-12">
          <JourneyMap route={journey.route} journeyTitle={journey.title} />
        </div>
      )}

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
    <>
      <JourneysJsonLd journeys={journeys} />
      <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative py-8 md:py-12 overflow-hidden">
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
              <div className="flex items-center gap-6 mt-8 md:mt-10 text-sm text-[var(--muted)]">
                <span>{totalImages} photographs</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <span>{journeys.length} journeys</span>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Journeys Content */}
      <main className="wide-width pb-12 md:pb-16">
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
    </div>
    </>
  );
}
