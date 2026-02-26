import Link from "next/link";
import Image from "next/image";
import BlogSearch from "@/components/BlogSearch";
import { Blog, Journey, About } from "@/types/blog";

async function getBlogs(): Promise<Blog[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/blogs?published=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getJourneys(): Promise<Journey[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/journeys?published=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
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

export default async function HomePage() {
  const [blogs, journeys, about] = await Promise.all([
    getBlogs(),
    getJourneys(),
    getAbout(),
  ]);

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const recentBlogs = blogs.slice(0, 6);

  // Journey images
  const journeyImages = [
    ...journeys.filter(j => j.coverImage).map(j => ({
      url: j.coverImage!,
      caption: j.title,
      location: j.location || "",
      href: `/journeys#${j.id}`,
    })),
    ...journeys.flatMap(j =>
      j.images.slice(0, 2).map(img => ({
        url: img.url,
        caption: img.caption || j.title,
        location: img.location || j.location || "",
        href: `/journeys#${j.id}`,
      }))
    ),
  ].slice(0, 6);

  // Stats
  const totalBlogs = blogs.length;
  const totalJourneys = journeys.length;
  const totalPhotos = journeys.reduce((sum, j) => sum + j.images.length, 0);

  return (
    <div className="min-h-screen">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           SECTION 1: HERO — Profile introduction
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-10 md:py-20 lg:py-28">
        <div className="wide-width">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

            {/* Profile image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] max-w-[280px] sm:max-w-sm mx-auto lg:max-w-none overflow-hidden bg-[var(--background-alt)]">
                {about?.profileImage ? (
                  <Image
                    src={about.profileImage}
                    alt={about?.name || "Akash"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 380px, 480px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-section)]">
                    <span className="font-serif text-7xl font-light text-[var(--border)]">
                      {about?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <p className="section-label mb-4">Welcome</p>

              <h1 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide leading-[1.08] mb-3 md:mb-4">
                {about?.name || "Akash"}
              </h1>

              <p className="text-[var(--accent)] text-sm sm:text-base md:text-lg font-medium tracking-wide mb-6 md:mb-8">
                {about?.tagline || "Writer, Traveler, Dreamer"}
              </p>

              {about?.bio ? (
                <div className="text-[var(--muted)] text-sm md:text-[0.9375rem] leading-[1.85] max-w-xl mx-auto lg:mx-0 mb-8 md:mb-10">
                  {about.bio.includes("<") ? (
                    <div
                      className="[&_p]:mb-4 [&_strong]:text-[var(--foreground)] [&_strong]:font-medium"
                      dangerouslySetInnerHTML={{ __html: about.bio }}
                    />
                  ) : (
                    about.bio.split('\n').slice(0, 3).map((p, i) => (
                      <p key={i} className="mb-4">{p}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-[var(--muted)] text-sm md:text-[0.9375rem] leading-[1.85] max-w-xl mx-auto lg:mx-0 mb-8 md:mb-10">
                  A solo traveler exploring the mountains, culture, and quiet corners of India.
                  Writing stories about the places that change you, the people who inspire you,
                  and the moments that stay with you long after you leave.
                </p>
              )}

              {/* Quick stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 md:gap-10 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-[var(--border)]">
                <div className="text-center lg:text-left">
                  <span className="block font-serif font-semibold text-2xl sm:text-3xl md:text-4xl tracking-wide text-[var(--foreground)]">
                    {totalBlogs}
                  </span>
                  <span className="text-[0.55rem] tracking-[0.15em] uppercase text-[var(--muted)]">Stories</span>
                </div>
                <span className="w-px h-10 sm:h-12 bg-[var(--border)]" />
                <div className="text-center lg:text-left">
                  <span className="block font-serif font-semibold text-2xl sm:text-3xl md:text-4xl tracking-wide text-[var(--foreground)]">
                    {totalJourneys}
                  </span>
                  <span className="text-[0.55rem] tracking-[0.15em] uppercase text-[var(--muted)]">Journeys</span>
                </div>
                <span className="w-px h-10 sm:h-12 bg-[var(--border)]" />
                <div className="text-center lg:text-left">
                  <span className="block font-serif font-semibold text-2xl sm:text-3xl md:text-4xl tracking-wide text-[var(--foreground)]">
                    {totalPhotos}
                  </span>
                  <span className="text-[0.55rem] tracking-[0.15em] uppercase text-[var(--muted)]">Photos</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-6 py-3.5 text-[0.6rem] tracking-[0.2em] uppercase font-medium hover:opacity-85 transition-opacity duration-200"
                >
                  Read My Story
                  <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                {/* Social icons */}
                {about?.socialLinks && about.socialLinks.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    {about.socialLinks.slice(0, 4).map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-9 sm:h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all duration-200"
                        title={link.platform}
                      >
                        <SocialIcon platform={link.platform} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           SECTION 3: LATEST STORIES
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {recentBlogs.length > 0 && (
        <section id="stories-section" className="py-12 md:py-20 lg:py-24 bg-[var(--background-alt)]">
          <div className="wide-width">
            <div className="flex items-end justify-between mb-8 md:mb-14">
              <div>
                <p className="section-label mb-3">From the Journal</p>
                <h2 className="font-serif font-semibold text-xl sm:text-2xl md:text-3xl tracking-wide">
                  Latest Stories
                </h2>
              </div>
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-[0.6rem] tracking-[0.15em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200 group"
              >
                All Stories
                <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Blog grid — 3 columns with card containers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group block bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--muted-soft)] transition-colors duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--background)]">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-section)]">
                        <span className="font-serif text-5xl font-light text-[var(--border)]">
                          {blog.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Tag badge on image */}
                    {blog.tags?.[0] && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-[var(--background)] text-[var(--foreground)] text-[0.5rem] tracking-[0.18em] uppercase px-2.5 py-1 font-medium">
                          {blog.tags[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6">
                    {/* Date + reading time */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[0.55rem] tracking-[0.1em] text-[var(--muted)]">
                        {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric",
                        })}
                      </span>
                      {blog.readingTime && (
                        <>
                          <span className="w-px h-2.5 bg-[var(--border)]" />
                          <span className="text-[0.55rem] tracking-[0.1em] text-[var(--muted)]">
                            {blog.readingTime} min read
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-semibold text-lg md:text-xl tracking-wide leading-snug mb-3 group-hover:opacity-60 transition-opacity duration-200">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed mb-5">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Read more link */}
                    <span className="inline-flex items-center gap-2 text-[0.6rem] tracking-[0.15em] uppercase font-medium text-[var(--foreground)] group-hover:opacity-60 transition-opacity duration-200">
                      Read Story
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-6 sm:hidden">
              <Link
                href="/"
                className="flex items-center gap-2 text-[0.6rem] tracking-[0.15em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                View All Stories →
              </Link>
            </div>
          </div>
        </section>
      )}

      {blogs.length === 0 && (
        <section className="py-32">
          <div className="wide-width text-center">
            <p className="font-serif text-xl text-[var(--muted)] mb-8 tracking-wide">
              The pages await their words.
            </p>
            <Link
              href="/admin/write"
              className="inline-flex items-center gap-3 text-[0.65rem] tracking-[0.2em] uppercase font-medium text-[var(--foreground)] pb-1 border-b border-[var(--foreground)] hover:opacity-50 transition-opacity duration-300"
            >
              Write your first story
            </Link>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           SECTION 4: JOURNEYS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {journeys.length > 0 && (
        <section className="py-12 md:py-20 lg:py-24">
          <div className="wide-width">
            <div className="flex items-end justify-between mb-8 md:mb-14">
              <div>
                <p className="section-label mb-3">Visual Diary</p>
                <h2 className="font-serif font-semibold text-xl sm:text-2xl md:text-3xl tracking-wide">
                  From the Journeys
                </h2>
              </div>
              <Link
                href="/journeys"
                className="hidden sm:flex items-center gap-2 text-[0.6rem] tracking-[0.15em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200 group"
              >
                All Journeys
                <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* First journey — large featured card */}
            <Link
              href={`/journeys#${journeys[0].id}`}
              className="group block relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/8] overflow-hidden bg-[var(--background-alt)] mb-5 md:mb-8"
            >
              {journeys[0].coverImage ? (
                <Image
                  src={journeys[0].coverImage}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  alt={journeys[0].title}
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--background-section)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  {journeys[0].location && (
                    <span className="flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase text-white/70">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {journeys[0].location}
                    </span>
                  )}
                  {journeys[0].date && (
                    <>
                      <span className="w-px h-2.5 bg-white/30" />
                      <span className="text-[0.55rem] tracking-[0.1em] text-white/50">
                        {new Date(journeys[0].date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                    </>
                  )}
                  <span className="w-px h-2.5 bg-white/30" />
                  <span className="text-[0.55rem] tracking-[0.1em] text-white/50">
                    {journeys[0].images.length} photos
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide text-white leading-tight max-w-xl">
                  {journeys[0].title}
                </h3>
                {journeys[0].description && (
                  <p className="text-white/50 text-sm leading-relaxed mt-2 max-w-lg line-clamp-2 hidden md:block">
                    {journeys[0].description}
                  </p>
                )}
              </div>
            </Link>

            {/* Remaining journeys — grid of cards */}
            {journeys.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {journeys.slice(1, 4).map((journey) => (
                  <Link
                    key={journey.id}
                    href={`/journeys#${journey.id}`}
                    className="group block relative aspect-[3/4] sm:aspect-[4/3] overflow-hidden bg-[var(--background-alt)]"
                  >
                    {journey.coverImage ? (
                      <Image
                        src={journey.coverImage}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                        alt={journey.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--background-section)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {journey.location && (
                          <span className="flex items-center gap-1 text-[0.5rem] tracking-[0.12em] uppercase text-white/65">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {journey.location}
                          </span>
                        )}
                        <span className="text-[0.5rem] text-white/40">
                          {journey.images.length} photos
                        </span>
                      </div>
                      <h3 className="font-serif font-semibold text-base md:text-lg tracking-wide text-white leading-snug line-clamp-2">
                        {journey.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile CTA */}
            <div className="mt-6 sm:hidden">
              <Link
                href="/journeys"
                className="flex items-center gap-2 text-[0.6rem] tracking-[0.15em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                View All Journeys →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           SECTION 5: INSTAGRAM — Dark cinematic
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {journeyImages.length >= 4 && (
        <section className="bg-[#1e1e1e] py-14 md:py-24 lg:py-28">
          <div className="wide-width">
            {/* Header */}
            <div className="mb-8 md:mb-16">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-white/30 font-medium mb-3 md:mb-4">
                Instagram
              </p>
              <h2 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide text-white leading-tight mb-3 md:mb-4">
                Follow the Journey
              </h2>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
                </svg>
                <span className="text-sm tracking-wide text-white/50">
                  @thesoloakash
                </span>
              </div>
            </div>

            {/* 4-col tall photo grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 mb-10 md:mb-14">
              {journeyImages.slice(0, 4).map((img, i) => (
                <a
                  key={i}
                  href="https://instagram.com/thesoloakash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-[4/5] overflow-hidden group"
                >
                  <Image
                    src={img.url}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    alt={img.caption}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
                    </svg>
                  </div>
                  {/* Caption on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs tracking-wide line-clamp-1">{img.caption}</p>
                    {img.location && (
                      <p className="text-white/50 text-[0.6rem] tracking-wide mt-0.5">{img.location}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>

            {/* Follow CTA */}
            <div className="text-center">
              <a
                href="https://instagram.com/thesoloakash"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border border-white/25 px-8 sm:px-10 py-3.5 sm:py-3.5 text-[0.6rem] tracking-[0.2em] uppercase font-medium text-white hover:bg-white hover:text-[#1e1e1e] transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
                </svg>
                Follow on Instagram
                <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

/* ── Inline social icon helper ── */
function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p === "instagram") return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
  if (p === "twitter" || p === "x") return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (p === "youtube") return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
  if (p === "github") return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
  if (p === "linkedin") return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
  return null;
}
