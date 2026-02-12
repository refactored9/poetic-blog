import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import BlogSearch from "@/components/BlogSearch";
import MountainDivider from "@/components/MountainDivider";
import WandererQuote from "@/components/WandererQuote";
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

  return (
    <div className="min-h-screen">
      {/* Welcome Header */}
      <section className="pt-8 md:pt-12 pb-6 md:pb-10">
        <div className="wide-width max-w-3xl">
          <p className="text-xs md:text-sm tracking-widest text-[var(--accent)] uppercase mb-1 md:mb-1.5">
            A Wanderer&apos;s Journal
          </p>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif leading-[1.15] mb-1.5 md:mb-2">
            Where words wander<br />
            <span className="text-[var(--muted)]">and find their way home</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--muted)] font-serif italic">
            Musings on moon, mountains, and the poetry in the silence between footsteps.
          </p>
        </div>
      </section>

      {/* Blog Search and Grid */}
      {blogs.length > 0 ? (
        <BlogSearch blogs={blogs} showFeatured={true} />
      ) : (
        <section className="py-10">
          <div className="wide-width text-center">
            <p className="text-[var(--muted)] font-serif italic mb-4">
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

      {/* Mountain Divider */}
      <MountainDivider variant="mountain" className="my-4 md:my-6" />

      {/* Quick Links */}
      <section className="py-10 md:py-16">
        <div className="wide-width">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <Link
              href="/about"
              className="group flex items-center gap-3 p-5 md:p-7 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] card-glow transition-all duration-400"
            >
              <div>
                <h3 className="font-serif text-sm md:text-base group-hover:text-[var(--accent)] transition-colors">About</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">The story behind</p>
              </div>
            </Link>

            <Link
              href="/journeys"
              className="group flex items-center gap-3 p-5 md:p-7 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] card-glow transition-all duration-400"
            >
              <div>
                <h3 className="font-serif text-sm md:text-base group-hover:text-[var(--accent)] transition-colors">Journeys</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">Photo stories</p>
              </div>
            </Link>

            <Link
              href="/gear"
              className="group flex items-center gap-3 p-5 md:p-7 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] card-glow transition-all duration-400"
            >
              <div>
                <h3 className="font-serif text-sm md:text-base group-hover:text-[var(--accent)] transition-colors">Gear</h3>
                <p className="text-xs md:text-sm text-[var(--muted)]">My setup</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Wanderer Quote */}
      <WandererQuote className="border-t border-b border-[var(--border)]/50" />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
