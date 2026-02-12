import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Guide } from "@/types/blog";

export const metadata: Metadata = {
  title: "People | Local Guides",
  description: "Meet our curated network of local guides who bring destinations to life with authentic experiences and deep local knowledge.",
};

async function getGuides(): Promise<Guide[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/guides?published=true`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/people/${guide.slug}`}
      className="group block"
    >
      {/* Profile Image */}
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[var(--background-alt)] mb-4">
        {guide.profileImage ? (
          <Image
            src={guide.profileImage}
            alt={guide.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-serif text-[var(--muted)]">
              {guide.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="font-serif text-lg group-hover:text-[var(--accent)] transition-colors">
          {guide.name}
        </h3>
        <p className="text-sm text-[var(--muted)] mt-1">
          {guide.location.city}, {guide.location.country}
        </p>
        {guide.specializations && guide.specializations.length > 0 && (
          <p className="text-xs text-[var(--muted-soft)] mt-2">
            {guide.specializations.slice(0, 2).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}

export default async function PeoplePage() {
  const guides = await getGuides();

  return (
    <div className="wide-width py-10 md:py-16">
      {/* Header */}
      <header className="max-w-2xl mb-12 md:mb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
          People
        </h1>
        <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed">
          Local guides who bring destinations to life with authentic experiences and deep knowledge.
        </p>
      </header>

      {/* Guides Grid */}
      {guides.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-14">
          {guides.map((guide) => (
            <GuideCard key={guide.id || guide._id} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-[var(--muted)] font-serif italic">
            Our network of local guides is coming soon.
          </p>
        </div>
      )}

      {/* Become a Guide */}
      {guides.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted)]">
            Want to become a guide?{" "}
            <Link href="/contact" className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
              Get in touch
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
