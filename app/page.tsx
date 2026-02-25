import Link from "next/link";
import Image from "next/image";
import BlogSearch from "@/components/BlogSearch";
import { Blog, Journey } from "@/types/blog";

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

const POLAROID_TRANSFORMS = [
  { rotate: -3, y: 10 },
  { rotate: 2, y: -14 },
  { rotate: -1.5, y: 6 },
  { rotate: 1.5, y: -10 },
  { rotate: 2.5, y: 2 },
  { rotate: -2, y: -6 },
];

export default async function HomePage() {
  const [blogs, journeys] = await Promise.all([getBlogs(), getJourneys()]);

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const restBlogs = featuredBlog ? blogs.filter((b) => b.id !== featuredBlog.id) : blogs;

  const heroDate = featuredBlog
    ? new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      });

  // Collect images for visual sections
  const allImages = [
    ...journeys.filter(j => j.coverImage).map(j => ({
      url: j.coverImage!,
      caption: j.title,
      description: j.description || j.location || "",
      location: j.location || "",
      href: `/journeys#${j.id}`,
    })),
    ...journeys.flatMap(j =>
      j.images.slice(0, 3).map(img => ({
        url: img.url,
        caption: img.caption || j.title,
        description: img.location || j.location || j.description || "",
        location: img.location || j.location || "",
        href: `/journeys#${j.id}`,
      }))
    ),
  ];

  const polaroidImages = allImages.slice(0, 6);
  const gridImages = allImages.slice(0, 5);
  const instagramImages = allImages.slice(0, 10);

  return (
    <div className="min-h-screen">

      {/* ── HERO ── Split layout: image left, content right */}
      <section className="flex flex-col lg:flex-row min-h-[92vh] border-b border-[var(--border)]">

        {/* LEFT column — vertical date + image */}
        <div className="relative flex lg:w-[58%]">

          {/* Vertical date strip */}
          <div className="hidden lg:flex w-10 flex-shrink-0 items-center justify-center border-r border-[var(--border)]">
            <span
              className="text-[0.55rem] tracking-[0.25em] uppercase text-[var(--muted)] whitespace-nowrap select-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {heroDate}
            </span>
          </div>

          {/* Image */}
          <div className="flex-1 relative overflow-hidden bg-[var(--background-alt)] min-h-[60vw] lg:min-h-0">
            {featuredBlog?.coverImage ? (
              <Image
                src={featuredBlog.coverImage}
                alt={featuredBlog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-end p-12 bg-[var(--background-section)]">
                <span
                  className="font-serif font-light leading-none text-[var(--border)] select-none"
                  style={{ fontSize: "clamp(80px, 14vw, 200px)", letterSpacing: "0.04em" }}
                >
                  TSA
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT column — content */}
        <div className="lg:w-[42%] flex flex-col justify-center px-8 md:px-14 lg:px-16 xl:px-20 py-14 lg:py-20">

          {featuredBlog?.readingTime && (
            <p className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--muted)] mb-10">
              {featuredBlog.readingTime} min read
            </p>
          )}

          {featuredBlog ? (
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[1.08] tracking-wide mb-8">
              {featuredBlog.title}
            </h1>
          ) : (
            <h1 className="mb-8">
              <span className="font-serif font-light block text-3xl md:text-4xl lg:text-4xl xl:text-5xl leading-snug tracking-wide text-[var(--foreground)]">
                Where Words Wander
              </span>
              <span className="font-serif font-bold block text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-wide text-[var(--foreground)]">
                And Find Their Way
              </span>
            </h1>
          )}

          {featuredBlog?.excerpt ? (
            <p className="text-[var(--muted)] text-sm md:text-[0.9375rem] leading-relaxed max-w-sm mb-12">
              {featuredBlog.excerpt}
            </p>
          ) : (
            <p className="text-[var(--muted)] text-sm md:text-[0.9375rem] leading-relaxed max-w-sm mb-12">
              Musings on mountains, moon, and the poetry in silence between footsteps.
            </p>
          )}

          {featuredBlog ? (
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="group inline-flex items-center gap-3 text-[0.7rem] tracking-[0.2em] uppercase font-medium text-[var(--foreground)] pb-1 border-b border-[var(--foreground)] w-fit hover:opacity-50 transition-opacity duration-300"
            >
              Read Full Story
              <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-[0.7rem] tracking-[0.2em] uppercase font-medium text-[var(--foreground)] pb-1 border-b border-[var(--foreground)] w-fit hover:opacity-50 transition-opacity duration-300"
            >
              About the wanderer
              <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}

          {featuredBlog?.tags?.[0] && (
            <span className="mt-10 text-[0.6rem] tracking-[0.2em] uppercase text-[var(--muted-soft)]">
              {featuredBlog.tags[0]}
            </span>
          )}
        </div>
      </section>

      {/* ── STORIES ── */}
      {restBlogs.length > 0 && (
        <section id="stories-section" className="py-20 md:py-28">
          <div className="wide-width mb-12 md:mb-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="section-label mb-3">From the Journal</p>
                <h2 className="font-serif font-semibold text-3xl md:text-4xl tracking-wide">
                  Latest Stories
                </h2>
              </div>
              <span className="hidden sm:block text-[0.65rem] tracking-[0.15em] uppercase text-[var(--muted)]">
                {restBlogs.length} {restBlogs.length === 1 ? "story" : "stories"}
              </span>
            </div>
          </div>
          <BlogSearch blogs={restBlogs} showFeatured={false} />
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
              className="inline-flex items-center gap-3 text-[0.7rem] tracking-[0.2em] uppercase font-medium text-[var(--foreground)] pb-1 border-b border-[var(--foreground)] hover:opacity-50 transition-opacity duration-300"
            >
              Write your first story
            </Link>
          </div>
        </section>
      )}

      {/* ── TRAVEL MOMENTS — Polaroid Section ── */}
      {polaroidImages.length > 0 && (
        <section className="py-16 md:py-24 border-t border-[var(--border)] overflow-hidden">
          <div className="wide-width mb-10 md:mb-14">
            <div className="flex items-end justify-between">
              <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl tracking-wide leading-none">
                Travel Moments
              </h2>
              <Link
                href="/journeys"
                className="hidden sm:flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200 group"
              >
                View More Moments
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Horizontal polaroid scroll */}
          <div className="wide-width">
            <div
              className="flex gap-8 md:gap-10 overflow-x-auto pb-10 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {polaroidImages.map((img, i) => {
                const t = POLAROID_TRANSFORMS[i] || POLAROID_TRANSFORMS[0];
                return (
                  <Link
                    key={i}
                    href={img.href}
                    className="flex-shrink-0 bg-white p-3 pb-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      width: 240,
                      boxShadow: "0 6px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
                      transform: `rotate(${t.rotate}deg) translateY(${t.y}px)`,
                    }}
                  >
                    <div className="relative w-full overflow-hidden bg-[var(--background-alt)]" style={{ aspectRatio: "3/4" }}>
                      <Image
                        src={img.url}
                        fill
                        className="object-cover"
                        alt={img.caption}
                        sizes="240px"
                      />
                    </div>
                    <div className="pt-4 px-1">
                      <p className="text-sm font-medium text-[#161616] leading-snug tracking-wide">
                        {img.caption}
                      </p>
                      {img.description && (
                        <p className="text-xs text-[#535353] mt-1 line-clamp-2 leading-relaxed">
                          {img.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="wide-width mt-6 sm:hidden">
            <Link
              href="/journeys"
              className="flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              View More Moments
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ── VISUAL STORIES — Photo Grid ── */}
      {gridImages.length >= 3 && (
        <section className="py-16 md:py-20 border-t border-[var(--border)]">
          <div className="wide-width">
            <h2 className="font-serif font-extralight text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] tracking-wide leading-none mb-10 md:mb-14">
              Visual Stories
            </h2>

            <div className="grid grid-cols-12 gap-2 md:gap-3">
              {/* Row 1: two images */}
              <div className="col-span-7 aspect-[4/3] relative overflow-hidden group">
                <Image
                  src={gridImages[0].url}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  alt={gridImages[0].caption}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
              <div className="col-span-5 aspect-[4/3] relative overflow-hidden group">
                <Image
                  src={(gridImages[1] || gridImages[0]).url}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  alt={(gridImages[1] || gridImages[0]).caption}
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              {/* Row 2: three images */}
              {gridImages.slice(2, 5).map((img, i) => (
                <div key={i} className="col-span-4 aspect-[4/3] relative overflow-hidden group">
                  <Image
                    src={img.url}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    alt={img.caption}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href="/journeys"
                className="group flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                View All Visual Stories
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── INSTAGRAM FEED ── */}
      {instagramImages.length >= 5 && (
        <section className="py-16 md:py-24 border-t border-[var(--border)]">
          <div className="wide-width">
            {/* Header */}
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
                </svg>
                <h2 className="font-serif font-light text-3xl md:text-4xl tracking-wide">
                  @thesoloakash
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
                Follow my journey for daily travel inspiration, hidden gems, and behind-the-scenes moments
              </p>
            </div>

            {/* Photo grid — 5 cols × 2 rows */}
            <div className="grid grid-cols-5 gap-1 md:gap-1.5 mb-8 md:mb-10">
              {instagramImages.slice(0, 10).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square relative overflow-hidden bg-[var(--background-alt)] group"
                >
                  <Image
                    src={img.url}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                    alt={img.caption}
                    sizes="(max-width: 768px) 20vw, 220px"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[var(--foreground)]/0 group-hover:bg-[var(--foreground)]/20 transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Follow CTA */}
            <div className="text-center">
              <a
                href="https://instagram.com/thesoloakash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-[var(--foreground)] px-10 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
                </svg>
                Follow on Instagram
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
