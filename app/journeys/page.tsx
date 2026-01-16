import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Journey, JourneyImage } from "@/types/blog";

export const metadata: Metadata = {
  title: "Journeys",
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

function ImageCard({ image, journey }: { image: JourneyImage; journey: Journey }) {
  const aspects = ["aspect-[3/4]", "aspect-[4/3]", "aspect-square"];
  const aspectClass = aspects[image.id.charCodeAt(0) % 3];

  return (
    <div className="group">
      <div className={`relative ${aspectClass} overflow-hidden rounded-lg md:rounded-xl bg-[var(--background-alt)]`}>
        <Image
          src={image.url}
          alt={image.alt || image.caption || "Journey image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Always visible on mobile, hover on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
            {image.caption && (
              <p className="text-white text-xs md:text-sm mb-0.5 md:mb-1 line-clamp-2">{image.caption}</p>
            )}
            <p className="text-white/70 text-[10px] md:text-xs">{journey.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneySection({ journey }: { journey: Journey }) {
  return (
    <div className="mb-10 md:mb-16 last:mb-0">
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[var(--muted)] mb-1 md:mb-2">
          <span>{journey.location}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
          <span>
            {new Date(journey.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">{journey.title}</h2>
        {journey.description && (
          <p className="text-[var(--muted)] max-w-2xl text-sm md:text-base">{journey.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {journey.images.map((image) => (
          <ImageCard key={image.id} image={image} journey={journey} />
        ))}
      </div>
    </div>
  );
}

export default async function JourneysPage() {
  const journeys = await getJourneys();

  const allImages = journeys.flatMap((journey) =>
    journey.images.map((image) => ({ image, journey }))
  );

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="wide-width">
        {/* Header */}
        <div className="max-w-2xl mb-8 md:mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6 md:mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>

          <h1 className="text-2xl md:text-4xl font-serif mb-2 md:mb-3">
            Journeys
          </h1>
          <p className="text-[var(--muted)] text-base md:text-lg">
            Visual stories from the places I've wandered. Each photograph, a fragment of a larger tale.
          </p>

          {journeys.length > 0 && (
            <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm text-[var(--muted)]">
              <span>{allImages.length} photos</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              <span>{journeys.length} journeys</span>
            </div>
          )}
        </div>

        {journeys.length > 0 ? (
          <div>
            {journeys.map((journey) => (
              <JourneySection key={journey.id} journey={journey} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] font-serif italic">
              No journeys yet. The road awaits.
            </p>
          </div>
        )}

        {/* Footer links */}
        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link
                href="/"
                className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Writings
              </Link>
              <Link
                href="/about"
                className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                About
              </Link>
              <Link
                href="/gear"
                className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Gear
              </Link>
              <Link
                href="/contact"
                className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
