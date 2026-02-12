import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/types/blog";
import ShareButton from "./ShareButton";
import ReadingProgress from "./ReadingProgress";
import ImageGallery from "@/components/ImageGallery";
import Comments from "@/components/Comments";
import ReactionButton from "@/components/ReactionButton";
import BookmarkButton from "@/components/BookmarkButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/blogs/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getRelatedBlogs(currentSlug: string): Promise<Blog[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/blogs?published=true`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const blogs = data.data || [];
    return blogs.filter((b: Blog) => b.slug !== currentSlug).slice(0, 2);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author],
      images: blog.coverImage
        ? [
            {
              url: blog.coverImage,
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

function JsonLd({ blog }: { blog: Blog }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    author: {
      "@type": "Person",
      name: blog.author,
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "Person",
      name: blog.author,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.jpg`,
      },
    },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    image: blog.coverImage ? {
      "@type": "ImageObject",
      url: blog.coverImage,
    } : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${blog.slug}`,
    },
    wordCount: blog.content?.split(/\s+/).length || 0,
    keywords: blog.tags?.join(", "),
    articleSection: "Travel",
    inLanguage: "en-US",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writings",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${siteUrl}/blog/${blog.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(slug);

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd blog={blog} />
      <ReadingProgress />

      <article className="min-h-screen">
        {/* Hero Section */}
        {blog.coverImage ? (
          <header className="relative h-[60vh] md:h-[75vh] lg:h-[85vh] w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Back Button - Fixed */}
            <div className="absolute top-6 left-0 right-0 z-10">
              <div className="wide-width">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Link>
              </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-16 lg:pb-20">
              <div className="wide-width max-w-4xl">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs text-white/80 border border-white/30 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4 md:mb-6">
                  {blog.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-serif text-sm md:text-base">
                      {blog.author.charAt(0)}
                    </div>
                    <span>{blog.author}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <time>{formattedDate}</time>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span>{blog.readingTime} min contemplation</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </header>
        ) : (
          /* Header without cover image */
          <header className="pt-8 md:pt-16 pb-8 md:pb-12 bg-[var(--background-alt)]">
            <div className="wide-width">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6 md:mb-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </Link>
            </div>
            <div className="wide-width max-w-4xl">
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs md:text-sm text-[var(--accent)] bg-[var(--accent)]/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight mb-4 md:mb-6">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-sm md:text-base">
                    {blog.author.charAt(0)}
                  </div>
                  <span>{blog.author}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <time>{formattedDate}</time>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <span>{blog.readingTime} min contemplation</span>
              </div>
            </div>
          </header>
        )}

        {/* Excerpt - Intro Section */}
        <section className="py-10 md:py-16 border-b border-[var(--border)]">
          <div className="wide-width max-w-3xl">
            <p className="text-xl md:text-2xl lg:text-3xl font-serif text-[var(--foreground)] leading-relaxed italic">
              {blog.excerpt}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10 md:py-16">
          <div className="wide-width">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Sidebar - Share & Actions */}
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 flex flex-col items-center gap-4">
                  <ShareButton title={blog.title} />
                  <div className="w-px h-8 bg-[var(--border)]" />
                  <BookmarkButton
                    blogId={blog.id || blog._id || blog.slug}
                    blogSlug={blog.slug}
                    blogTitle={blog.title}
                    blogExcerpt={blog.excerpt}
                    blogCoverImage={blog.coverImage}
                  />
                </div>
              </aside>

              {/* Article Content */}
              <div className="lg:col-span-8 lg:col-start-2">
                {blog.content.includes("<") ? (
                  <div
                    className="prose prose-lg max-w-none
                      [&_p]:mb-7 [&_p]:leading-[1.9] [&_p]:text-[var(--foreground)] [&_p]:text-base md:[&_p]:text-lg
                      [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-serif [&_h2]:font-normal [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:text-[var(--foreground)]
                      [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-serif [&_h3]:font-normal [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[var(--foreground)]
                      [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-7 [&_ul]:space-y-3
                      [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-7 [&_ol]:space-y-3
                      [&_li]:text-[var(--foreground)] [&_li]:leading-[1.8] [&_li]:text-base md:[&_li]:text-lg
                      [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-6 md:[&_blockquote]:pl-8 [&_blockquote]:py-2 [&_blockquote]:my-10 [&_blockquote]:italic [&_blockquote]:text-xl md:[&_blockquote]:text-2xl [&_blockquote]:font-serif [&_blockquote]:text-[var(--muted)]
                      [&_strong]:font-semibold [&_em]:italic
                      [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[var(--accent)]/30 hover:[&_a]:decoration-[var(--accent)]
                      [&_u]:underline [&_s]:line-through
                      [&_hr]:my-12 [&_hr]:border-[var(--border)]
                      [&_img]:rounded-xl [&_img]:my-8"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                ) : (
                  <div className="prose prose-lg max-w-none">
                    {blog.content.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={index} className="text-2xl md:text-3xl font-serif mt-14 mb-5">
                            {paragraph.replace("## ", "")}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith("### ")) {
                        return (
                          <h3 key={index} className="text-xl md:text-2xl font-serif mt-10 mb-4">
                            {paragraph.replace("### ", "")}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith("> ")) {
                        return (
                          <blockquote
                            key={index}
                            className="border-l-4 border-[var(--accent)] pl-6 md:pl-8 my-10 italic text-xl md:text-2xl font-serif text-[var(--muted)]"
                          >
                            {paragraph.replace("> ", "")}
                          </blockquote>
                        );
                      }
                      return (
                        <p key={index} className="mb-7 leading-[1.9] text-base md:text-lg">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                )}

                {/* Mobile Share & Actions */}
                <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-[var(--border)] lg:hidden">
                  <ShareButton title={blog.title} />
                  <BookmarkButton
                    blogId={blog.id || blog._id || blog.slug}
                    blogSlug={blog.slug}
                    blogTitle={blog.title}
                    blogExcerpt={blog.excerpt}
                    blogCoverImage={blog.coverImage}
                  />
                </div>

                {/* Reactions */}
                <div className="flex justify-center mt-8">
                  <ReactionButton blogId={blog.id || blog._id || blog.slug} />
                </div>
              </div>

              {/* Right Margin - Empty for balance */}
              <div className="hidden lg:block lg:col-span-3" />
            </div>
          </div>
        </section>

        {/* Place Images Gallery - Pinterest Style with Lightbox */}
        {blog.placeImages && blog.placeImages.length > 0 && (
          <section className="py-12 md:py-20 bg-[var(--background-alt)]">
            <div className="wide-width">
              <div className="text-center mb-10 md:mb-14">
                <p className="text-xs md:text-sm tracking-[0.2em] text-[var(--muted)] uppercase mb-2">
                  Captured Moments
                </p>
                <h2 className="text-2xl md:text-4xl font-serif">Places Along the Way</h2>
              </div>

              <ImageGallery images={blog.placeImages} />
            </div>
          </section>
        )}

        {/* Comments Section */}
        <Comments blogId={blog.id || blog._id || blog.slug} />

        {/* Author Section */}
        <section className="py-10 md:py-12 border-t border-[var(--border)]">
          <div className="wide-width max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-2xl md:text-3xl flex-shrink-0">
                {blog.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs md:text-sm tracking-[0.15em] text-[var(--muted)] uppercase mb-1">
                  Written by
                </p>
                <h3 className="text-xl md:text-2xl font-serif mb-2">{blog.author}</h3>
                <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed max-w-md">
                  A wanderer at heart, capturing moments and sharing stories from the road less traveled.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-sm text-[var(--accent)] mt-3 hover:underline"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="py-12 md:py-20 bg-[var(--background-alt)]">
            <div className="wide-width">
              <div className="text-center mb-10 md:mb-14">
                <p className="text-xs md:text-sm tracking-[0.2em] text-[var(--muted)] uppercase mb-2">
                  Continue the Journey
                </p>
                <h2 className="text-2xl md:text-4xl font-serif">More Wanderings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id || relatedBlog.slug}
                    href={`/blog/${relatedBlog.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden bg-[var(--background)] mb-4">
                      {relatedBlog.coverImage ? (
                        <Image
                          src={relatedBlog.coverImage}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-serif text-[var(--muted)]">
                            {relatedBlog.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--muted)] mb-2">
                      <time>
                        {new Date(relatedBlog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                      <span>{relatedBlog.readingTime} min contemplation</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-serif group-hover:text-[var(--accent)] transition-colors">
                      {relatedBlog.title}
                    </h3>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10 md:mt-14">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] transition-all"
                >
                  View All Stories
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
