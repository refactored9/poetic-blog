import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Guide } from "@/types/blog";
import ShareButton from "@/components/ShareButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getGuide(slug: string): Promise<Guide | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/guides/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  return {
    title: `${guide.name} | Local Guide`,
    description: guide.tagline || guide.bio.slice(0, 160),
    openGraph: {
      title: guide.name,
      description: guide.tagline || guide.bio.slice(0, 160),
      images: guide.profileImage ? [guide.profileImage] : [],
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide || !guide.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      {/* Hero Section */}
      <header className="wide-width">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden bg-[var(--background-alt)]">
          {guide.coverImage ? (
            <Image
              src={guide.coverImage}
              alt={guide.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-dark)] opacity-10" />
          )}
        </div>

        {/* Profile Info */}
        <div className="py-8 md:py-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--background-alt)]">
                {guide.profileImage ? (
                  <Image
                    src={guide.profileImage}
                    alt={guide.name}
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-serif text-[var(--muted)]">
                      {guide.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-2">
                    {guide.name}
                  </h1>
                  {guide.tagline && (
                    <p className="text-lg md:text-xl text-[var(--muted)] font-serif italic">
                      {guide.tagline}
                    </p>
                  )}
                </div>
                <ShareButton
                  url={`/people/${guide.slug}`}
                  title={guide.name}
                  description={guide.tagline || guide.bio.slice(0, 100)}
                />
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-sm text-[var(--muted)]">
                {/* Location */}
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{guide.location.city}, {guide.location.country}</span>
                </div>

                {/* Experience */}
                {guide.experienceYears > 0 && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{guide.experienceYears}+ years experience</span>
                  </div>
                )}

                {/* Rating */}
                {guide.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{guide.rating.toFixed(1)} ({guide.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="wide-width pt-6 md:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <section>
              <h2 className="text-xl font-serif mb-4">About</h2>
              <div className="prose text-[var(--foreground-soft)] whitespace-pre-line">
                {guide.bio}
              </div>
            </section>

            {/* Areas of Operation */}
            {guide.areasOfOperation && guide.areasOfOperation.length > 0 && (
              <section>
                <h2 className="text-xl font-serif mb-4">Areas I Cover</h2>
                <div className="flex flex-wrap gap-2">
                  {guide.areasOfOperation.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1.5 bg-[var(--background-alt)] border border-[var(--border)] rounded-lg text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Highlights */}
            {guide.highlights && guide.highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-serif mb-4">What I Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guide.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[var(--background-card)] border border-[var(--border)] rounded-xl"
                    >
                      <h3 className="font-medium mb-1">{highlight.title}</h3>
                      {highlight.description && (
                        <p className="text-sm text-[var(--muted)]">{highlight.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {guide.galleryImages && guide.galleryImages.length > 0 && (
              <section>
                <h2 className="text-xl font-serif mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {guide.galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden bg-[var(--background-alt)]"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || image.caption || `Gallery image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="sticky top-24 space-y-6">
              <div className="p-6 bg-[var(--background-card)] border border-[var(--border)] rounded-xl">
                <h3 className="font-serif text-lg mb-4">Get in Touch</h3>

                {/* Price Range */}
                {guide.priceRange && (guide.priceRange.min || guide.priceRange.max) && (
                  <div className="mb-4 pb-4 border-b border-[var(--border)]">
                    <p className="text-sm text-[var(--muted)] mb-1">Starting from</p>
                    <p className="text-2xl font-serif">
                      {guide.priceRange.currency} {guide.priceRange.min?.toLocaleString()}
                      {guide.priceRange.max && ` - ${guide.priceRange.max.toLocaleString()}`}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{guide.priceRange.unit}</p>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-2">
                  {guide.contact?.whatsapp && (
                    <a
                      href={`https://wa.me/${guide.contact.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-lg text-sm hover:bg-[var(--accent)] transition-colors"
                    >
                      WhatsApp
                    </a>
                  )}

                  {guide.contact?.email && (
                    <a
                      href={`mailto:${guide.contact.email}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 border border-[var(--border)] rounded-lg text-sm hover:border-[var(--accent)] transition-colors"
                    >
                      Email
                    </a>
                  )}

                  {guide.contact?.phone && (
                    <a
                      href={`tel:${guide.contact.phone}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 border border-[var(--border)] rounded-lg text-sm hover:border-[var(--accent)] transition-colors"
                    >
                      Call
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {guide.contact?.instagram && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <a
                      href={`https://instagram.com/${guide.contact.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      @{guide.contact.instagram.replace('@', '')}
                    </a>
                  </div>
                )}

                {/* Availability Note */}
                {guide.availabilityNote && (
                  <p className="mt-4 text-xs text-[var(--muted)] italic">
                    {guide.availabilityNote}
                  </p>
                )}
              </div>

              {/* Languages & Specializations */}
              <div className="p-6 bg-[var(--background-card)] border border-[var(--border)] rounded-xl space-y-4">
                {guide.languages && guide.languages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-[var(--muted)] mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 text-sm bg-[var(--background-alt)] rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {guide.specializations && guide.specializations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-[var(--muted)] mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.specializations.map((spec) => (
                        <span key={spec} className="px-2 py-1 text-sm bg-[var(--background-alt)] rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Back Link */}
      <div className="wide-width pt-10">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all guides
        </Link>
      </div>
    </div>
  );
}
