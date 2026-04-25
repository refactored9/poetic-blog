import Link from "next/link";
import Image from "next/image";
import Newsletter from "@/components/Newsletter";
import { About, Blog, Journey } from "@/types/blog";

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

function byDateDesc<T>(list: T[], dateKey: keyof T): T[] {
  return [...list].sort((a, b) => {
    const aTime = new Date(String(a[dateKey] || 0)).getTime();
    const bTime = new Date(String(b[dateKey] || 0)).getTime();
    return bTime - aTime;
  });
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toPlainText(value?: string) {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxChars: number) {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars).trim()}...`;
}

export default async function HomePage() {
  const [blogsRaw, journeysRaw, about] = await Promise.all([
    getBlogs(),
    getJourneys(),
    getAbout(),
  ]);

  const blogs = byDateDesc(blogsRaw, "publishedAt");
  const journeys = byDateDesc(journeysRaw, "date");

  const featuredStory = blogs.find((blog) => blog.featured) || blogs[0];
  const storyRail = blogs.filter((blog) => blog.id !== featuredStory?.id).slice(0, 6);
  const leadStory = storyRail[0] || featuredStory;
  const sideStories = storyRail.slice(1, 4);
  const moreStories = storyRail.slice(4, 6);

  const featuredJourney = journeys[0];
  const journeyCards = journeys.slice(1, 5);

  const totalStories = blogs.length;
  const totalJourneys = journeys.length;
  const totalPhotos = journeys.reduce((sum, journey) => sum + journey.images.length, 0);

  const heroBio = truncateText(
    toPlainText(about?.bio) ||
      "I travel slowly across mountains, towns, and coastlines, collecting stories that stay long after the road ends.",
    280
  );

  const heroImage =
    about?.profileImage ||
    featuredStory?.coverImage ||
    featuredJourney?.coverImage ||
    journeyCards[0]?.coverImage ||
    "";

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(139,101,52,0.18), transparent 34%), radial-gradient(circle at 85% 10%, rgba(168,126,80,0.12), transparent 30%), linear-gradient(180deg, transparent 0%, rgba(234,227,219,0.35) 42%, transparent 100%)",
        }}
      />

      <section className="py-12 md:py-16 lg:py-20">
        <div className="wide-width">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-7">
              <p className="section-label mb-3 animate-fade-in-up">A Living Travel Journal</p>
              <h1 className="heading-hero max-w-3xl mb-5 animate-fade-in-up stagger-1">
                Stories that make people pause, feel, and explore.
              </h1>
              <p className="text-[var(--foreground-soft)] text-base md:text-lg leading-relaxed max-w-2xl mb-8 animate-fade-in-up stagger-2">
                {heroBio}
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-9 animate-fade-in-up stagger-3">
                <Link
                  href={featuredStory ? `/blog/${featuredStory.slug}` : "/connect"}
                  className="group inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 text-[0.62rem] tracking-[0.16em] uppercase font-medium hover:opacity-85 transition-opacity"
                >
                  Start Reading
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                <Link
                  href="/journeys"
                  className="inline-flex items-center gap-2 border border-[var(--border)] px-6 py-3 text-[0.62rem] tracking-[0.16em] uppercase font-medium hover:border-[var(--foreground)] transition-colors"
                >
                  Explore Journeys
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 animate-fade-in-up stagger-4">
                <StatCard label="Stories" value={totalStories} />
                <StatCard label="Journeys" value={totalJourneys} />
                <StatCard label="Photos" value={totalPhotos} />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full grid grid-rows-[1fr_auto] gap-4">
                <div className="relative min-h-[360px] md:min-h-[420px] border border-[var(--border)] bg-[var(--background-card)] overflow-hidden">
                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt={about?.name || featuredStory?.title || "Featured visual"}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[var(--background-section)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute left-5 right-5 bottom-5">
                    <p className="text-[0.58rem] tracking-[0.18em] uppercase text-white/70 mb-2">Creator</p>
                    <h2 className="font-serif text-2xl md:text-3xl text-white leading-tight">
                      {about?.name || "Akash"}
                    </h2>
                    <p className="text-white/70 text-sm mt-1">{about?.tagline || "Writer, Traveler, Dreamer"}</p>
                  </div>
                </div>

                <div className="card p-4 md:p-5">
                  <p className="text-[0.58rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">Latest Highlight</p>
                  {featuredStory ? (
                    <Link href={`/blog/${featuredStory.slug}`} className="group block">
                      <h3 className="heading-card text-[var(--foreground)] group-hover:opacity-70 transition-opacity line-clamp-2">
                        {featuredStory.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2">
                        {featuredStory.excerpt || "Open the latest feature from the journal."}
                      </p>
                      <p className="text-[0.58rem] tracking-[0.12em] uppercase text-[var(--accent)] mt-3">
                        {formatDate(featuredStory.publishedAt)}
                      </p>
                    </Link>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">New stories are coming soon.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredStory && (
        <section className="pb-10 md:pb-14 lg:pb-18">
          <div className="wide-width">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
              <article className="xl:col-span-8 border border-[var(--border)] bg-[var(--background-card)] overflow-hidden">
                <Link href={`/blog/${featuredStory.slug}`} className="grid grid-cols-1 md:grid-cols-2 group">
                  <div className="relative min-h-[280px] md:min-h-[420px] bg-[var(--background-section)]">
                    {featuredStory.coverImage ? (
                      <Image
                        src={featuredStory.coverImage}
                        alt={featuredStory.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-7xl text-[var(--muted-soft)]">{featuredStory.title.charAt(0)}</span>
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-[var(--background)] px-3 py-1 text-[0.55rem] tracking-[0.16em] uppercase">
                      Featured Story
                    </span>
                  </div>
                  <div className="p-6 md:p-8 lg:p-10">
                    <p className="section-label mb-4">Editor&apos;s Pick</p>
                    <h2 className="heading-section group-hover:opacity-70 transition-opacity leading-tight mb-4">
                      {featuredStory.title}
                    </h2>
                    <p className="text-[var(--muted)] leading-relaxed mb-6">
                      {featuredStory.excerpt || "A deeper reflection from the road, captured in words and frames."}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[0.62rem] tracking-[0.12em] uppercase text-[var(--muted)]">
                      <span>{formatDate(featuredStory.publishedAt)}</span>
                      {featuredStory.readingTime ? (
                        <>
                          <span className="w-px h-3 bg-[var(--border)]" />
                          <span>{featuredStory.readingTime} Min Read</span>
                        </>
                      ) : null}
                      {featuredStory.tags?.[0] ? (
                        <>
                          <span className="w-px h-3 bg-[var(--border)]" />
                          <span className="text-[var(--accent)]">{featuredStory.tags[0]}</span>
                        </>
                      ) : null}
                    </div>
                    <p className="mt-7 inline-flex items-center gap-2 text-[0.6rem] tracking-[0.16em] uppercase font-medium">
                      Read This Story
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </p>
                  </div>
                </Link>
              </article>

              <aside className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                <InfoBlock
                  title="Follow The Journey"
                  text="Get visual snippets and mini travel notes on Instagram."
                  ctaLabel="@thesoloakash"
                  ctaHref="https://instagram.com/thesoloakash"
                  external
                />
                <InfoBlock
                  title="Know The Person"
                  text="Read the deeper story behind the journeys and writing style."
                  ctaLabel="About Akash"
                  ctaHref="/about"
                />
                <InfoBlock
                  title="Work Together"
                  text="For collaborations, features, and brand storytelling partnerships."
                  ctaLabel="Contact"
                  ctaHref="/connect"
                />
              </aside>
            </div>
          </div>
        </section>
      )}

      <section id="stories" className="py-12 md:py-16 bg-[var(--background-alt)] border-y border-[var(--border)]">
        <div className="wide-width">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="section-label mb-2">Fresh Reads</p>
              <h2 className="heading-section">Latest Stories</h2>
            </div>
            <Link
              href="/"
              className="text-[0.6rem] tracking-[0.16em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Browse All
            </Link>
          </div>

          {leadStory ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
              <Link
                href={`/blog/${leadStory.slug}`}
                className="lg:col-span-7 border border-[var(--border)] bg-[var(--background-card)] overflow-hidden group"
              >
                <div className="relative aspect-[16/10] bg-[var(--background-section)]">
                  {leadStory.coverImage ? (
                    <Image
                      src={leadStory.coverImage}
                      alt={leadStory.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-6xl text-[var(--muted-soft)]">{leadStory.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 md:p-7">
                  <div className="flex flex-wrap items-center gap-2 text-[0.58rem] tracking-[0.12em] uppercase text-[var(--muted)] mb-3">
                    <span>{formatDate(leadStory.publishedAt)}</span>
                    {leadStory.tags?.[0] ? (
                      <>
                        <span className="w-px h-3 bg-[var(--border)]" />
                        <span className="text-[var(--accent)]">{leadStory.tags[0]}</span>
                      </>
                    ) : null}
                  </div>
                  <h3 className="heading-card leading-tight mb-3 group-hover:opacity-70 transition-opacity">
                    {leadStory.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] line-clamp-3 leading-relaxed">
                    {leadStory.excerpt || "Open the story and walk through the full narrative."}
                  </p>
                </div>
              </Link>

              <div className="lg:col-span-5 space-y-4">
                {sideStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/blog/${story.slug}`}
                    className="group grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-4 border border-[var(--border)] bg-[var(--background-card)] p-3"
                  >
                    <div className="relative h-full min-h-[85px] bg-[var(--background-section)] overflow-hidden">
                      {story.coverImage ? (
                        <Image
                          src={story.coverImage}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          sizes="140px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-3xl text-[var(--muted-soft)]">{story.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[0.55rem] tracking-[0.12em] uppercase text-[var(--muted)] mb-2">
                        {formatDate(story.publishedAt)}
                      </p>
                      <h3 className="font-serif text-base leading-snug group-hover:opacity-70 transition-opacity line-clamp-2">
                        {story.title}
                      </h3>
                    </div>
                  </Link>
                ))}

                {moreStories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {moreStories.map((story) => (
                      <Link
                        key={story.id}
                        href={`/blog/${story.slug}`}
                        className="card p-4 group"
                      >
                        <p className="text-[0.55rem] tracking-[0.12em] uppercase text-[var(--muted)] mb-2">
                          {story.tags?.[0] || "Journal"}
                        </p>
                        <h3 className="font-serif text-base leading-snug group-hover:opacity-70 transition-opacity line-clamp-3">
                          {story.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="card p-8 md:p-12 text-center">
              <h3 className="heading-card mb-2">New stories are on the way</h3>
              <p className="text-sm text-[var(--muted)]">Check back soon for fresh writing from the road.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="wide-width">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="section-label mb-2">Visual Travel Log</p>
              <h2 className="heading-section">Journeys In Focus</h2>
            </div>
            <Link
              href="/journeys"
              className="text-[0.6rem] tracking-[0.16em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Open Gallery
            </Link>
          </div>

          {featuredJourney ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
              <Link
                href={`/journeys#${featuredJourney.id}`}
                className="lg:col-span-7 relative min-h-[360px] md:min-h-[480px] border border-[var(--border)] overflow-hidden group"
              >
                {featuredJourney.coverImage ? (
                  <Image
                    src={featuredJourney.coverImage}
                    alt={featuredJourney.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--background-section)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute left-5 right-5 bottom-5">
                  <p className="text-[0.58rem] tracking-[0.16em] uppercase text-white/70 mb-2">
                    {featuredJourney.location || "Journey"}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-2">
                    {featuredJourney.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {featuredJourney.images.length} photos
                    {featuredJourney.date ? ` · ${formatDate(featuredJourney.date)}` : ""}
                  </p>
                </div>
              </Link>

              <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-5">
                {journeyCards.length > 0 ? (
                  journeyCards.map((journey) => (
                    <Link
                      key={journey.id}
                      href={`/journeys#${journey.id}`}
                      className="relative min-h-[170px] md:min-h-[220px] border border-[var(--border)] overflow-hidden group"
                    >
                      {journey.coverImage ? (
                        <Image
                          src={journey.coverImage}
                          alt={journey.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          sizes="(max-width: 1024px) 50vw, 24vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[var(--background-section)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute left-3 right-3 bottom-3">
                        <p className="text-[0.52rem] tracking-[0.12em] uppercase text-white/65 mb-1">
                          {journey.location || "Journey"}
                        </p>
                        <h3 className="font-serif text-sm md:text-base text-white leading-snug line-clamp-2">
                          {journey.title}
                        </h3>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 card p-8 text-center">
                    <p className="text-sm text-[var(--muted)]">More journeys will appear here soon.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-8 md:p-12 text-center">
              <h3 className="heading-card mb-2">Journey gallery is growing</h3>
              <p className="text-sm text-[var(--muted)]">Fresh travel visuals will be added shortly.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#1e1e1e] text-white">
        <div className="wide-width">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-white/60 mb-3">Stay Connected</p>
              <h2 className="font-serif text-2xl md:text-4xl leading-tight mb-3">
                Daily frames, travel snippets, and behind-the-scenes notes.
              </h2>
              <p className="text-white/65 max-w-2xl">
                Follow along for real-time updates from the road and weekly story drops from the journal.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
              <a
                href="https://instagram.com/thesoloakash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/40 px-5 py-3 text-[0.58rem] tracking-[0.15em] uppercase font-medium hover:bg-white hover:text-[#1e1e1e] transition-all"
              >
                <SocialIcon platform="instagram" />
                Instagram
              </a>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 bg-white text-[#1e1e1e] px-5 py-3 text-[0.58rem] tracking-[0.15em] uppercase font-medium hover:opacity-80 transition-opacity"
              >
                Collaborate
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4 md:p-5">
      <p className="text-[0.56rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">{label}</p>
      <p className="font-serif text-2xl md:text-3xl leading-none">{value}</p>
    </div>
  );
}

function InfoBlock({
  title,
  text,
  ctaLabel,
  ctaHref,
  external = false,
}: {
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
}) {
  const baseClass =
    "card p-5 h-full flex flex-col justify-between hover:border-[var(--foreground)] transition-colors";

  if (external) {
    return (
      <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={baseClass}>
        <div>
          <h3 className="font-serif text-lg leading-tight mb-2">{title}</h3>
          <p className="text-sm text-[var(--muted)]">{text}</p>
        </div>
        <p className="mt-6 text-[0.6rem] tracking-[0.15em] uppercase font-medium inline-flex items-center gap-2">
          {ctaLabel}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </p>
      </a>
    );
  }

  return (
    <Link href={ctaHref} className={baseClass}>
      <div>
        <h3 className="font-serif text-lg leading-tight mb-2">{title}</h3>
        <p className="text-sm text-[var(--muted)]">{text}</p>
      </div>
      <p className="mt-6 text-[0.6rem] tracking-[0.15em] uppercase font-medium inline-flex items-center gap-2">
        {ctaLabel}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </p>
    </Link>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p === "instagram") {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  return null;
}
