import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { About } from "@/types/blog";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me and my story.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";

function AboutJsonLd({ about }: { about: About | null }) {
  if (!about) return null;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: about.name,
    description: about.tagline,
    image: about.profileImage,
    url: `${SITE_URL}/about`,
    email: about.email,
    address: about.location ? {
      "@type": "PostalAddress",
      addressLocality: about.location,
    } : undefined,
    sameAs: about.socialLinks?.map((link) => link.url) || [],
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
        name: "About",
        item: `${SITE_URL}/about`,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Solo Akash",
    url: SITE_URL,
    description: "A quiet corner for thoughts, places, and poetry. Stories told through words and wanderings.",
    author: {
      "@type": "Person",
      name: about.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

async function getAbout(): Promise<About | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/about`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

function SocialIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = {
    twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    youtube: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };

  return icons[platform.toLowerCase()] || null;
}

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <AboutJsonLd about={about} />
      <div className="min-h-screen py-16 md:py-24">
      <div className="wide-width">
        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 lg:gap-28">

          {/* Left: Profile Image */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="relative aspect-[4/5] max-w-sm mx-auto lg:max-w-none overflow-hidden bg-[var(--background-alt)]">
                {about?.profileImage ? (
                  <Image
                    src={about.profileImage}
                    alt={about?.name || "Profile"}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl md:text-6xl font-serif text-[var(--muted)]">
                      {about?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
              </div>

              {/* Social links below image */}
              {about?.socialLinks && about.socialLinks.length > 0 && (
                <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mt-4 md:mt-6">
                  {about.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 md:w-9 md:h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
                      title={link.platform}
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-7">
            {/* Header */}
            <div className="mb-8 md:mb-12 text-center lg:text-left">
              <h1 className="font-serif font-semibold text-4xl md:text-5xl tracking-wide leading-tight mb-3 md:mb-4">
                {about?.name || "Hello"}
              </h1>
              <p className="text-base md:text-lg text-[var(--muted)] font-serif">
                {about?.tagline || "Writer & Wanderer"}
              </p>
            </div>

            {/* Location & Email */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 mb-10 md:mb-14 text-sm text-[var(--muted)]">
              {about?.location && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{about.location}</span>
                </div>
              )}
              {about?.email && (
                <a
                  href={`mailto:${about.email}`}
                  className="flex items-center gap-2 hover:text-[var(--foreground)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{about.email}</span>
                </a>
              )}
            </div>

            {/* Bio */}
            {about?.bio && (
              <div className="mb-8 md:mb-12">
                {about.bio.includes("<") ? (
                  <div
                    className="prose prose-sm md:prose-lg max-w-none
                      [&_p]:text-[var(--foreground)] [&_p]:leading-relaxed [&_p]:mb-4 md:[&_p]:mb-5
                      [&_strong]:font-semibold [&_em]:italic
                      [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2
                      [&_ul]:list-disc [&_ul]:ml-4 md:[&_ul]:ml-5 [&_ul]:mb-4 md:[&_ul]:mb-5
                      [&_ol]:list-decimal [&_ol]:ml-4 md:[&_ol]:ml-5 [&_ol]:mb-4 md:[&_ol]:mb-5
                      [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: about.bio }}
                  />
                ) : (
                  <div className="prose prose-sm md:prose-lg max-w-none">
                    {about.bio.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-[var(--foreground)] leading-relaxed mb-4 md:mb-5 text-sm md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Story */}
            {about?.story && (
              <div className="pt-6 md:pt-10 border-t border-[var(--border)]">
                <h2 className="section-label mb-4 md:mb-6">
                  My Story
                </h2>
                {about.story.includes("<") ? (
                  <div
                    className="prose prose-sm md:prose max-w-none
                      [&_p]:text-[var(--foreground)] [&_p]:leading-relaxed [&_p]:mb-4 md:[&_p]:mb-5
                      [&_h2]:text-lg md:[&_h2]:text-xl [&_h2]:font-serif [&_h2]:mt-6 md:[&_h2]:mt-10 [&_h2]:mb-3 md:[&_h2]:mb-4
                      [&_h3]:text-base md:[&_h3]:text-lg [&_h3]:font-serif [&_h3]:mt-5 md:[&_h3]:mt-8 [&_h3]:mb-2 md:[&_h3]:mb-3
                      [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-4 md:[&_blockquote]:pl-5 [&_blockquote]:my-4 md:[&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-[var(--muted)]
                      [&_strong]:font-semibold [&_em]:italic
                      [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2
                      [&_ul]:list-disc [&_ul]:ml-4 md:[&_ul]:ml-5 [&_ul]:mb-4 md:[&_ul]:mb-5
                      [&_ol]:list-decimal [&_ol]:ml-4 md:[&_ol]:ml-5 [&_ol]:mb-4 md:[&_ol]:mb-5
                      [&_li]:mb-1 md:[&_li]:mb-2"
                    dangerouslySetInnerHTML={{ __html: about.story }}
                  />
                ) : (
                  <div className="prose prose-sm md:prose max-w-none">
                    {about.story.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-[var(--foreground)] leading-relaxed mb-4 md:mb-5 text-sm md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Links */}
            <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-[var(--border)]">
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
                <Link
                  href="/"
                  className="text-[0.68rem] tracking-[0.15em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] pb-px border-b border-transparent hover:border-[var(--foreground)] transition-all duration-200"
                >
                  Writings
                </Link>
                <Link
                  href="/journeys"
                  className="text-[0.68rem] tracking-[0.15em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] pb-px border-b border-transparent hover:border-[var(--foreground)] transition-all duration-200"
                >
                  Journeys
                </Link>
                <Link
                  href="/gear"
                  className="text-[0.68rem] tracking-[0.15em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] pb-px border-b border-transparent hover:border-[var(--foreground)] transition-all duration-200"
                >
                  Gear
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
