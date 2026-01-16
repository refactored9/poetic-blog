import Link from "next/link";
import Image from "next/image";
import Newsletter from "@/components/Newsletter";
import { Blog } from "@/types/blog";

async function getBlogs(): Promise<Blog[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/blogs?published=true`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const blogs = await getBlogs();
  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const recentBlogs = blogs.filter((b) => b.id !== featuredBlog?.id).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Welcome Header */}
      <section className="pt-8 pb-4 md:pt-16 md:pb-8">
        <div className="wide-width max-w-3xl">
          <p className="text-xs md:text-sm tracking-widest text-[var(--muted)] uppercase mb-1.5 md:mb-2">
            A Journal
          </p>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-[1.15] mb-2 md:mb-3">
            Where words wander<br />
            <span className="text-[var(--muted)]">and find their way home</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--muted)] font-serif italic">
            Musings on life, travel, and the poetry in ordinary moments.
          </p>
        </div>
      </section>

      {/* Featured Story - Large Hero */}
      {featuredBlog ? (
        <section className="py-6 md:py-12">
          <div className="wide-width">
            <Link href={`/blog/${featuredBlog.slug}`} className="group block">
              {/* Large Image */}
              <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden bg-[var(--background-alt)] mb-6 md:mb-8">
                {featuredBlog.coverImage ? (
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="100vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--background-alt)] to-[var(--border)]">
                    <span className="text-6xl md:text-8xl font-serif text-[var(--muted)]">
                      {featuredBlog.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-white/90 mb-2 md:mb-3">
                      {featuredBlog.tags && featuredBlog.tags[0] && (
                        <>
                          <span className="px-2 md:px-3 py-0.5 md:py-1 bg-white/25 backdrop-blur-sm rounded-full text-[10px] md:text-xs">
                            {featuredBlog.tags[0]}
                          </span>
                        </>
                      )}
                      <span>
                        {new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h1 className="text-lg md:text-4xl lg:text-5xl font-serif text-white mb-1 md:mb-3 leading-tight group-hover:text-white/95 transition-colors">
                      {featuredBlog.title}
                    </h1>
                    <p className="text-white/90 text-sm md:text-lg leading-relaxed line-clamp-2 hidden md:block">
                      {featuredBlog.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="wide-width text-center">
            <p className="text-[var(--muted)] font-serif italic mb-6">
              The pages await their words.
            </p>
            <Link
              href="/admin/write"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] text-sm hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
            >
              Write your first story
            </Link>
          </div>
        </section>
      )}

      {/* Recent Stories Grid */}
      {recentBlogs.length > 0 && (
        <section className="py-8 md:py-16">
          <div className="wide-width">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <h2 className="text-xs md:text-sm font-medium tracking-wide uppercase text-[var(--muted)]">
                Recent Writings
              </h2>
              <span className="text-xs md:text-sm text-[var(--muted)]">{blogs.length} stories</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden bg-[var(--background-alt)] mb-3 md:mb-4">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-serif text-[var(--muted)]">
                          {blog.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--muted)] mb-1.5 md:mb-2">
                    <span>
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {blog.tags && blog.tags[0] && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span>{blog.tags[0]}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base md:text-lg font-serif leading-snug group-hover:text-[var(--accent)] transition-colors mb-1.5 md:mb-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs md:text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-8 md:py-16 border-t border-[var(--border)]">
        <div className="wide-width">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
            <Link
              href="/about"
              className="group flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-lg md:rounded-xl border border-[var(--border)] hover:border-[var(--foreground)] transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--background-alt)] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-sm md:text-base group-hover:text-[var(--accent)] transition-colors">About</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">The story behind</p>
              </div>
            </Link>

            <Link
              href="/journeys"
              className="group flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-lg md:rounded-xl border border-[var(--border)] hover:border-[var(--foreground)] transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--background-alt)] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-sm md:text-base group-hover:text-[var(--accent)] transition-colors">Journeys</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">Photo stories</p>
              </div>
            </Link>

            <Link
              href="/gear"
              className="group flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-lg md:rounded-xl border border-[var(--border)] hover:border-[var(--foreground)] transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--background-alt)] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-sm md:text-base group-hover:text-[var(--accent)] transition-colors">Gear</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">My setup</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
