"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Writings" },
    { href: "/journeys", label: "Journeys" },
    // { href: "/gear", label: "Gear" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="wide-width">
        <nav className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-base md:text-lg group-hover:bg-[var(--accent)] transition-colors">
              A
            </div>
            <div className="hidden sm:block">
              <span className="text-base md:text-lg font-serif tracking-wide text-[var(--foreground)]">
                The Solo Akash
              </span>
              <p className="text-[10px] md:text-xs text-[var(--muted)] -mt-0.5">
                wandering through words
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-0 md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-2.5 md:px-4 py-1.5 md:py-2 text-xs md:text-sm tracking-wide transition-colors
                  ${isActive(link.href)
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }
                `}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 md:left-4 md:right-4 h-0.5 bg-[var(--accent)]" />
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
