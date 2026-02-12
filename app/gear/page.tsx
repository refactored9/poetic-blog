import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gear } from "@/types/blog";

export const metadata: Metadata = {
  title: "Gear",
  description: "The tools and equipment I use for creating content, traveling, and everyday work.",
};

async function getGear(): Promise<Gear[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${apiUrl}/gear?published=true`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

const categoryLabels: Record<string, string> = {
  camera: "Cameras",
  lens: "Lenses",
  audio: "Audio",
  laptop: "Tech",
  accessories: "Accessories",
  travel: "Travel",
  other: "Other",
};

function GearCard({ item }: { item: Gear }) {
  return (
    <div className="group">
      {item.image && (
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--background-alt)] mb-4">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-6 group-hover:scale-102 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {item.isFavorite && (
            <span className="absolute top-3 right-3 text-xs text-[var(--accent)]">
              Favorite
            </span>
          )}
        </div>
      )}
      <div>
        <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">
          {categoryLabels[item.category]}
        </p>
        <h3 className="font-serif text-lg mb-1 group-hover:text-[var(--accent)] transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-4">
          {item.price && (
            <span className="text-sm">{item.price}</span>
          )}
          {item.amazonUrl && (
            <a
              href={item.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              View →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function GearPage() {
  const gear = await getGear();

  const gearByCategory = gear.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Gear[]>);

  const categories = Object.keys(gearByCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="py-8 md:py-12">
        <div className="wide-width">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 md:mb-12 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 md:w-12 h-px bg-[var(--accent)]" />
              <span className="text-[var(--accent)] text-xs md:text-sm font-medium tracking-[0.2em] uppercase">
                My Setup
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 md:mb-6 leading-[1.1]">
              Gear
            </h1>

            <p className="text-[var(--muted)] text-base md:text-lg max-w-xl">
              The tools and equipment I use for creating content, traveling, and everyday work.
            </p>
          </div>
        </div>
      </header>

      <main className="wide-width pb-12 md:pb-16">

        {gear.length > 0 ? (
          <div>
            {categories.map((category, categoryIndex) => (
              <div key={category} className={`${categoryIndex > 0 ? "mt-20 pt-20 border-t border-[var(--border)]" : ""}`}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-medium tracking-wide uppercase text-[var(--muted)]">
                    {categoryLabels[category]}
                  </h2>
                  <span className="text-sm text-[var(--muted)]">
                    {gearByCategory[category].length} items
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {gearByCategory[category].map((item) => (
                    <GearCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center text-sm text-[var(--muted)] mt-16 pt-8 border-t border-[var(--border)]">
              Some links may be affiliate links.
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] font-serif italic">
              No gear listed yet.
            </p>
          </div>
        )}

        {/* Footer links */}
        <div className="mt-20 pt-10 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/about"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              About me
            </Link>
            <Link
              href="/journeys"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              View journeys
            </Link>
            <Link
              href="/"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Read writings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
