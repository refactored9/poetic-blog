import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[#f0eeec]">
      <div className="wide-width py-8 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 mb-2 md:mb-0">
            <Link href="/" className="inline-block">
              <span className="text-lg md:text-xl font-serif text-[var(--foreground)]">
                The Solo Akash
              </span>
            </Link>
            <p className="mt-2 md:mt-3 text-xs md:text-sm text-[var(--muted)] leading-relaxed max-w-xs">
              A quiet corner of the internet for thoughts, places, and the poetry of everyday wanderings.
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

          {/* Quote */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[10px] md:text-xs tracking-widest text-[var(--muted)] uppercase mb-3 md:mb-4">
              A Thought
            </h4>
            <blockquote className="text-xs md:text-sm text-[var(--muted)] italic font-serif leading-relaxed">
              &ldquo;Not all those who wander are lost.&rdquo;
            </blockquote>
            <p className="text-[10px] md:text-xs text-[var(--muted-soft)] mt-1.5 md:mt-2">
              &mdash; J.R.R. Tolkien
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
              <span>Crafted with quietude</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              <span>Made in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
