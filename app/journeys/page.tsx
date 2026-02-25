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
    description: "Visual stories from places I've wandered.",
    url: `${SITE_URL}/journeys`,
    numberOfItems: journeys.length,
    hasPart: journeys.map((journey) => ({
      "@type": "ImageGallery",
      name: journey.title,
      description: journey.description,
      numberOfItems: journey.images.length,
      contentLocation: { "@type": "Place", name: journey.location },
      dateCreated: journey.date,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Journeys", item: `${SITE_URL}/journeys` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }} />
    </>
  );
}

async function getJourneys(): Promise<Journey[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/journeys?published=true`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function JourneyCard({ journey, index }: { journey: Journey; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <article
      id={journey.id}
      className="journey-section pt-16 md:pt-24 border-t border-[var(--border)] first:border-t-0 first:pt-0"
    >
      {/* Journey header — title + info */}
      <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-10 md:gap-16 mb-12 md:mb-16`}>

        {/* Cover Image */}
        {journey.coverImage && (
          <div className="w-full md:w-[42%] flex-shrink-0">
            <JourneyCoverImage
              src={journey.coverImage}
              alt={journey.title}
              priority={index === 0}
              imageCount={journey.images.length}
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center py-2 md:py-6">
          {/* Index number */}
          <p className="section-label mb-5">
            Journey {String(index + 1).padStart(2, "0")}
          </p>

          {/* Title */}
          <h2 className="font-serif font-semibold text-3xl md:text-4xl tracking-wide leading-tight mb-5">
            {journey.title}
          </h2>

          {/* Location + Date */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)] mb-6">
            {journey.location && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {journey.location}
              </span>
            )}
            <span className="w-px h-3 bg-[var(--border)]" />
            <span>
              {new Date(journey.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </span>
          </div>

          {/* Description */}
          {journey.description && (
            <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              {journey.description}
            </p>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="section-label">{journey.images.length} photos</span>
            </div>
            <ShareButton
              url={`/journeys#${journey.id}`}
              title={journey.title}
              description={journey.description}
            />
          </div>
        </div>
      </div>

      {/* Hiking Map */}
      {journey.route?.enabled && (
        <div className="mb-12 md:mb-16">
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

        {/* Hero */}
        <header className="py-16 md:py-24">
          <div className="wide-width">
            <div className="max-w-2xl">
              <p className="section-label mb-5">Visual Stories</p>
              <h1 className="font-serif font-semibold text-4xl md:text-5xl tracking-wide leading-tight mb-6">
                Journeys
              </h1>
              <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed max-w-lg mb-8">
                Visual fragments from the places I&apos;ve wandered. Each photograph holds a story, each moment a memory frozen in time.
              </p>

              {journeys.length > 0 && (
                <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
                  <span className="font-medium text-[var(--foreground)]">{journeys.length}</span>
                  <span>journeys</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                  <span className="font-medium text-[var(--foreground)]">{totalImages}</span>
                  <span>photographs</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Journey Cards */}
        <main className="wide-width pb-24 md:pb-32">
          {journeys.length > 0 ? (
            <div>
              {journeys.map((journey, index) => (
                <JourneyCard key={journey.id} journey={journey} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-28 md:py-36">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--background-alt)] mb-6">
                <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-semibold tracking-wide mb-3">No journeys yet</h2>
              <p className="text-[var(--muted)] text-sm">
                The road awaits. New adventures coming soon.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-8 text-[0.68rem] tracking-[0.15em] uppercase font-medium text-[var(--foreground)] pb-px border-b border-[var(--foreground)] hover:opacity-50 transition-opacity duration-200"
              >
                Back to writings
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
