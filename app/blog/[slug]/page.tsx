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
    const res = await fetch(`${apiUrl}/blogs/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getRelatedBlogs(currentSlug: string): Promise<Blog[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/blogs?published=true`, { next: { revalidate: 60 } });
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
  if (!blog) return { title: "Not Found" };
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
      images: blog.coverImage ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }] : [],
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
    author: { "@type": "Person", name: blog.author, url: `${siteUrl}/about` },
    publisher: { "@type": "Person", name: blog.author, logo: { "@type": "ImageObject", url: `${siteUrl}/og-image.jpg` } },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    image: blog.coverImage ? { "@type": "ImageObject", url: blog.coverImage } : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${blog.slug}` },
    wordCount: blog.content?.split(/\s+/).length || 0,
    keywords: blog.tags?.join(", "),
    articleSection: "Travel",
    inLanguage: "en-US",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Writings", item: siteUrl },
      { "@type": "ListItem", position: 3, name: blog.title, item: `${siteUrl}/blog/${blog.slug}` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(slug);

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <JsonLd blog={blog} />
      <ReadingProgress />

      <article className="min-h-screen">

        {/* ── HERO ── */}
        {blog.coverImage ? (
          <header className="relative h-[60vh] md:h-[75vh] lg:h-[85vh] w-full">
            <div className="absolute inset-0">
              <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Back link */}
            <div className="absolute top-6 left-0 right-0 z-10">
              <div className="wide-width">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Writings
                </Link>
              </div>
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-16 lg:pb-20">
              <div className="wide-width max-w-4xl">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-3 py-1 text-[0.6rem] tracking-[0.15em] uppercase text-white/80 border border-white/25">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="font-serif font-semibold text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-wide mb-5">
                  {blog.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white/20 flex items-center justify-center text-white font-serif text-xs font-medium">
                      {blog.author.charAt(0)}
                    </div>
                    <span className="text-[0.7rem] tracking-[0.1em] uppercase">{blog.author}</span>
                  </div>
                  <span className="w-px h-3 bg-white/30" />
                  <time className="text-[0.7rem] tracking-[0.08em]">{formattedDate}</time>
                  <span className="w-px h-3 bg-white/30" />
                  <span className="text-[0.7rem] tracking-[0.08em]">{blog.readingTime} min read</span>
                </div>
              </div>
            </div>
          </header>

        ) : (
          /* Header without cover image */
          <header className="py-16 md:py-20 border-b border-[var(--border)]">
            <div className="wide-width">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-10 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Writings
              </Link>
            </div>
            <div className="wide-width max-w-4xl">
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-3 py-1 text-[0.6rem] tracking-[0.15em] uppercase text-[var(--accent)] border border-[var(--border)]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="font-serif font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide mb-5">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-xs font-medium">
                    {blog.author.charAt(0)}
                  </div>
                  <span className="text-[0.7rem] tracking-[0.1em] uppercase">{blog.author}</span>
                </div>
                <span className="w-px h-3 bg-[var(--border)]" />
                <time className="text-[0.7rem] tracking-[0.08em]">{formattedDate}</time>
                <span className="w-px h-3 bg-[var(--border)]" />
                <span className="text-[0.7rem] tracking-[0.08em]">{blog.readingTime} min read</span>
              </div>
            </div>
          </header>
        )}

        {/* ── EXCERPT ── */}
        <section className="py-12 md:py-16 border-b border-[var(--border)]">
          <div className="wide-width max-w-3xl">
            <p className="font-serif text-lg md:text-xl text-[var(--muted)] leading-relaxed tracking-wide italic">
              {blog.excerpt}
            </p>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="py-14 md:py-20">
          <div className="wide-width">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Sidebar actions */}
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

              {/* Article body */}
              <div className="lg:col-span-8 lg:col-start-2">
                {blog.content.includes("<") ? (
                  <div
                    className="prose prose-lg max-w-none
                      [&_p]:mb-7 [&_p]:leading-[1.9] [&_p]:text-[var(--foreground)] [&_p]:text-base md:[&_p]:text-lg
                      [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:tracking-wide [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:text-[var(--foreground)]
                      [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:tracking-wide [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[var(--foreground)]
                      [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-7 [&_ul]:space-y-3
                      [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-7 [&_ol]:space-y-3
                      [&_li]:text-[var(--foreground)] [&_li]:leading-[1.8] [&_li]:text-base md:[&_li]:text-lg
                      [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--foreground)] [&_blockquote]:pl-6 md:[&_blockquote]:pl-8 [&_blockquote]:py-2 [&_blockquote]:my-10 [&_blockquote]:italic [&_blockquote]:text-lg md:[&_blockquote]:text-xl [&_blockquote]:font-serif [&_blockquote]:text-[var(--muted)]
                      [&_strong]:font-semibold [&_em]:italic
                      [&_a]:text-[var(--foreground)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[var(--border)] hover:[&_a]:decoration-[var(--foreground)]
                      [&_u]:underline [&_s]:line-through
                      [&_hr]:my-12 [&_hr]:border-[var(--border)]
                      [&_img]:my-8"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                ) : (
                  <div className="space-y-7">
                    {blog.content.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={index} className="font-serif font-semibold text-2xl md:text-3xl tracking-wide mt-14 mb-5">
                            {paragraph.replace("## ", "")}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith("### ")) {
                        return (
                          <h3 key={index} className="font-serif font-semibold text-xl md:text-2xl tracking-wide mt-10 mb-4">
                            {paragraph.replace("### ", "")}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith("> ")) {
                        return (
                          <blockquote key={index} className="border-l-2 border-[var(--foreground)] pl-6 md:pl-8 my-10 italic text-lg md:text-xl font-serif text-[var(--muted)]">
                            {paragraph.replace("> ", "")}
                          </blockquote>
                        );
                      }
                      return (
                        <p key={index} className="leading-[1.9] text-base md:text-lg text-[var(--foreground)]">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                )}

                {/* Mobile actions */}
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

                <div className="flex justify-center mt-8">
                  <ReactionButton blogId={blog.id || blog._id || blog.slug} />
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-3" />
            </div>
          </div>
        </section>

        {/* ── PLACE IMAGES GALLERY ── */}
        {blog.placeImages && blog.placeImages.length > 0 && (
          <section className="py-12 md:py-20 border-t border-[var(--border)] bg-[var(--background-alt)]">
            <div className="wide-width">
              <div className="mb-10 md:mb-14">
                <p className="section-label mb-3">Captured Moments</p>
                <h2 className="font-serif font-semibold text-2xl md:text-3xl tracking-wide">Places Along the Way</h2>
              </div>
              <ImageGallery images={blog.placeImages} />
            </div>
          </section>
        )}

        {/* ── COMMENTS ── */}
        <Comments blogId={blog.id || blog._id || blog.slug} />

        {/* ── AUTHOR ── */}
        <section className="py-14 md:py-20 border-t border-[var(--border)]">
          <div className="wide-width max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-2xl md:text-3xl font-medium flex-shrink-0">
                {blog.author.charAt(0)}
              </div>
              <div>
                <p className="section-label mb-2">Written by</p>
                <h3 className="font-serif font-semibold text-xl md:text-2xl tracking-wide mb-3">{blog.author}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed max-w-md">
                  A wanderer at heart, capturing moments and sharing stories from the road less traveled.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 mt-5 text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--foreground)] pb-px border-b border-[var(--foreground)] hover:opacity-50 transition-opacity duration-200"
                >
                  Learn more
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── RELATED POSTS ── */}
        {relatedBlogs.length > 0 && (
          <section className="py-14 md:py-20 border-t border-[var(--border)] bg-[var(--background-alt)]">
            <div className="wide-width">
              <div className="mb-10 md:mb-14">
                <p className="section-label mb-3">Continue the Journey</p>
                <h2 className="font-serif font-semibold text-2xl md:text-3xl tracking-wide">More Wanderings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl">
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog.id || relatedBlog.slug} href={`/blog/${relatedBlog.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--background)] mb-5">
                      {relatedBlog.coverImage ? (
                        <Image
                          src={relatedBlog.coverImage}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-section)]">
                          <span className="font-serif text-4xl font-semibold text-[var(--border)]">
                            {relatedBlog.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <time className="text-[0.6rem] tracking-[0.1em] text-[var(--muted)]">
                        {new Date(relatedBlog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </time>
                      <span className="w-px h-3 bg-[var(--border)]" />
                      <span className="text-[0.6rem] tracking-[0.1em] text-[var(--muted)]">{relatedBlog.readingTime} min read</span>
                    </div>
                    <h3 className="font-serif font-semibold text-lg md:text-xl tracking-wide leading-snug group-hover:opacity-60 transition-opacity duration-200">
                      {relatedBlog.title}
                    </h3>
                  </Link>
                ))}
              </div>

              <div className="mt-12 md:mt-16">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 text-[0.7rem] tracking-[0.2em] uppercase font-medium text-[var(--foreground)] pb-1 border-b border-[var(--foreground)] hover:opacity-50 transition-opacity duration-300"
                >
                  View All Stories
                  <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
