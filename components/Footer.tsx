import Link from "next/link";
import MountainDivider from "./MountainDivider";
import WandererQuote from "./WandererQuote";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-section)]">
      {/* Mountain silhouette decoration */}
      <MountainDivider variant="mountain" flip className="-mb-1" />

      {/* Wanderer Quote */}
      <div className="border-b border-[var(--border)]/50">
        <WandererQuote interval={12000} />
      </div>

      <div className="wide-width py-8 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 mb-2 md:mb-0">
            <Link href="/" className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--accent)]">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-lg md:text-xl font-serif text-[var(--foreground)]">
                The Solo Akash
              </span>
            </Link>
            <p className="mt-2 md:mt-3 text-xs md:text-sm text-[var(--muted)] leading-relaxed max-w-xs">
              A sacred corner of the internet for contemplation, wanderings, and the poetry found in stillness.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[10px] md:text-xs tracking-widest text-[var(--muted)] uppercase mb-3 md:mb-4">
              Explore
            </h4>
            <nav className="flex flex-col gap-1.5 md:gap-2">
              <Link
                href="/"
                className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                Writings
              </Link>
              <Link
                href="/journeys"
                className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                Journeys
              </Link>
              <Link
                href="/about"
                className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                About
              </Link>
              <Link
                href="/gear"
                className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                Gear
              </Link>
              <Link
                href="/contact"
                className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] md:text-xs tracking-widest text-[var(--muted)] uppercase mb-3 md:mb-4">
              Legal
            </h4>
            <nav className="flex flex-col gap-1.5 md:gap-2">
              <Link
                href="/privacy"
                className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                Terms of Use
              </Link>
            </nav>
          </div>

          {/* Mantra */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[10px] md:text-xs tracking-widest text-[var(--muted)] uppercase mb-3 md:mb-4">
              Mantra
            </h4>
            <blockquote className="text-xs md:text-sm text-[var(--muted)] italic font-serif leading-relaxed">
              &ldquo;The quieter you become, the more you can hear.&rdquo;
            </blockquote>
            <p className="text-[10px] md:text-xs text-[var(--muted-soft)] mt-1.5 md:mt-2">
              &mdash; Ram Dass
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3">
            <p className="text-[10px] md:text-xs text-[var(--muted)]">
              &copy; {currentYear} The Solo Akash. All rights reserved.
            </p>
            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-[var(--muted-soft)]">
              <span>Crafted in silence</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
