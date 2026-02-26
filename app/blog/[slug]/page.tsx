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
    return blogs.filter((b: Blog) => b.slug !== currentSlug).slice(0, 3);
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
    authors: [{ name: blog.author?.toLowerCase() !== "anonymous" ? blog.author : "Akash" }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.toLowerCase() !== "anonymous" ? blog.author : "Akash"],
      images: blog.coverImage
        ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }]
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
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    author: { "@type": "Person", name: blog.author?.toLowerCase() !== "anonymous" ? blog.author : "Akash", url: `${siteUrl}/about` },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    image: blog.coverImage ? { "@type": "ImageObject", url: blog.coverImage } : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${blog.slug}` },
    wordCount: blog.content?.split(/\s+/).length || 0,
    keywords: blog.tags?.join(", "),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
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

      <article>

        {/* ── BREADCRUMB ── */}
        <div className="wide-width pt-6 pb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
          >
            <svg
              className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Writings
          </Link>
        </div>

        {/* ── COVER IMAGE — clean, no overlay ── */}
        {blog.coverImage && (
          <div className="wide-width mb-0">
            <div className="relative aspect-[16/9] overflow-hidden bg-[var(--background-alt)]">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1160px"
              />
            </div>
          </div>
        )}

        {/* ── ARTICLE HEADER — on linen, below image ── */}
        <header className="wide-width pt-10 pb-10 md:pt-14 md:pb-14 border-b border-[var(--border)]">
          <div className="max-w-3xl mx-auto text-center">

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                {blog.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--accent)] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-serif font-semibold text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight mb-8">
              {blog.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[var(--muted)]">
              <span className="text-[0.65rem] tracking-[0.12em] uppercase">{blog.author && blog.author.toLowerCase() !== "anonymous" ? blog.author : "Akash"}</span>
              <span className="w-px h-3 bg-[var(--border)]" />
              <time className="text-[0.65rem] tracking-[0.1em]">{formattedDate}</time>
              <span className="w-px h-3 bg-[var(--border)]" />
              <span className="text-[0.65rem] tracking-[0.1em]">{blog.readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* ── EXCERPT / LEAD ── */}
        {blog.excerpt && (
          <div className="wide-width py-10 md:py-14 border-b border-[var(--border)]">
            <div className="max-w-2xl mx-auto">
              <p className="font-serif text-lg md:text-xl text-[var(--muted)] leading-relaxed tracking-wide italic text-center">
                {blog.excerpt}
              </p>
            </div>
          </div>
        )}

        {/* ── BODY ── */}
        <div className="wide-width py-14 md:py-20">
          <div className="max-w-2xl mx-auto">

            {/* Floating actions — left of content on desktop */}
            <div className="relative">
              <div className="hidden lg:flex flex-col items-center gap-4 absolute -left-16 top-0">
                <div className="sticky top-28 flex flex-col items-center gap-3">
                  <ShareButton title={blog.title} />
                  <div className="w-px h-6 bg-[var(--border)]" />
                  <BookmarkButton
                    blogId={blog.id || blog._id || blog.slug}
                    blogSlug={blog.slug}
                    blogTitle={blog.title}
                    blogExcerpt={blog.excerpt}
                    blogCoverImage={blog.coverImage}
                  />
                </div>
              </div>

              {/* Article content */}
              {blog.content.includes("<") ? (
                <div
                  className="
                    [&_p]:text-[var(--foreground)] [&_p]:text-base [&_p]:leading-[1.9] [&_p]:mb-6
                    [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:tracking-wide [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[var(--foreground)]
                    [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:tracking-wide [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[var(--foreground)]
                    [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-6 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-6 [&_ol]:space-y-2
                    [&_li]:text-[var(--foreground)] [&_li]:text-base [&_li]:leading-relaxed
                    [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--foreground)] [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-lg [&_blockquote]:font-serif [&_blockquote]:text-[var(--muted)]
                    [&_strong]:font-semibold
                    [&_em]:italic
                    [&_a]:text-[var(--foreground)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[var(--border)] hover:[&_a]:decoration-[var(--foreground)] [&_a]:transition-all
                    [&_hr]:my-10 [&_hr]:border-[var(--border)]
                    [&_img]:w-full [&_img]:my-8 [&_img]:object-cover
                    [&_p:first-of-type::first-letter]:font-serif [&_p:first-of-type::first-letter]:text-5xl [&_p:first-of-type::first-letter]:font-bold [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:leading-[0.85] [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:mt-1.5 [&_p:first-of-type::first-letter]:text-[var(--foreground)]
                  "
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <div className="space-y-6">
                  {blog.content.split("\n\n").map((paragraph, index) => {
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index} className="font-serif font-semibold text-2xl tracking-wide mt-12 mb-4 text-[var(--foreground)]">
                          {paragraph.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith("### ")) {
                      return (
                        <h3 key={index} className="font-serif font-semibold text-xl tracking-wide mt-8 mb-3 text-[var(--foreground)]">
                          {paragraph.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith("> ")) {
                      return (
                        <blockquote key={index} className="border-l-2 border-[var(--foreground)] pl-6 my-8 italic text-lg font-serif text-[var(--muted)]">
                          {paragraph.replace("> ", "")}
                        </blockquote>
                      );
                    }
                    return (
                      <p key={index} className="text-base leading-[1.9] text-[var(--foreground)]">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile share row */}
            <div className="flex items-center justify-center gap-5 mt-12 pt-10 border-t border-[var(--border)] lg:hidden">
              <ShareButton title={blog.title} />
              <div className="w-px h-5 bg-[var(--border)]" />
              <BookmarkButton
                blogId={blog.id || blog._id || blog.slug}
                blogSlug={blog.slug}
                blogTitle={blog.title}
                blogExcerpt={blog.excerpt}
                blogCoverImage={blog.coverImage}
              />
            </div>

            {/* Reactions */}
            <div className="flex justify-center mt-8 pt-8 border-t border-[var(--border)] lg:border-t-0 lg:pt-0 lg:mt-10">
              <ReactionButton blogId={blog.id || blog._id || blog.slug} />
            </div>
          </div>
        </div>

        {/* ── PLACE IMAGES ── */}
        {blog.placeImages && blog.placeImages.length > 0 && (
          <section className="border-t border-[var(--border)] bg-[var(--background-alt)] py-14 md:py-20">
            <div className="wide-width">
              <div className="mb-10">
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
        <section className="border-t border-[var(--border)] py-14 md:py-16">
          <div className="wide-width">
            <div className="max-w-2xl mx-auto flex items-start gap-6">
              {/* Square avatar */}
              <div className="flex-shrink-0 w-14 h-14 bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-xl font-semibold">
                {(blog.author?.toLowerCase() !== "anonymous" ? blog.author : "Akash").charAt(0)}
              </div>
              <div>
                <p className="section-label mb-2">Written by</p>
                <h3 className="font-serif font-semibold text-lg tracking-wide mb-2">{blog.author && blog.author.toLowerCase() !== "anonymous" ? blog.author : "Akash"}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                  A wanderer at heart, capturing moments and sharing stories from the road less traveled.
                </p>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--foreground)] pb-px border-b border-[var(--foreground)] hover:opacity-50 transition-opacity duration-200"
                >
                  About the author
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── RELATED POSTS ── */}
        {relatedBlogs.length > 0 && (
          <section className="border-t border-[var(--border)] bg-[var(--background-alt)] py-14 md:py-20">
            <div className="wide-width">
              <div className="flex items-end justify-between mb-10 md:mb-14">
                <div>
                  <p className="section-label mb-3">Continue the Journey</p>
                  <h2 className="font-serif font-semibold text-2xl md:text-3xl tracking-wide">More Wanderings</h2>
                </div>
                <Link
                  href="/"
                  className="group hidden sm:inline-flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
                >
                  All stories
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {relatedBlogs.map((related, i) => (
                  <Link key={related.id || related.slug} href={`/blog/${related.slug}`} className="group block">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background)] mb-5">
                      {related.coverImage ? (
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-section)]">
                          <span className="font-serif font-semibold text-5xl text-[var(--border)]">
                            {related.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Number */}
                      <div className="absolute top-4 left-4">
                        <span className="font-serif text-xs font-medium tracking-wider text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      {related.tags?.[0] && (
                        <span className="text-[0.6rem] tracking-[0.15em] uppercase text-[var(--accent)] font-medium">
                          {related.tags[0]}
                        </span>
                      )}
                      <span className="w-px h-3 bg-[var(--border)]" />
                      <time className="text-[0.6rem] tracking-[0.1em] text-[var(--muted)]">
                        {new Date(related.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-semibold text-lg tracking-wide leading-snug group-hover:opacity-60 transition-opacity duration-200">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>

              {/* Mobile "All stories" link */}
              <div className="mt-10 sm:hidden">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-[0.65rem] tracking-[0.18em] uppercase font-medium text-[var(--foreground)] pb-px border-b border-[var(--foreground)] hover:opacity-50 transition-opacity"
                >
                  View All Stories
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
