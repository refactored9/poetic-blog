"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect, useCallback } from "react";

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="w-7 h-7" />;

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative w-7 h-7 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      <svg
        className={`w-4 h-4 absolute transition-all duration-200 ${
          resolvedTheme === "dark" ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg
        className={`w-4 h-4 absolute transition-all duration-200 ${
          resolvedTheme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: "/", label: "Writings" },
    { href: "/journeys", label: "Journeys" },
    { href: "/people", label: "People" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && mobileMenuOpen) setMobileMenuOpen(false);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSearch = () => {
    router.push("/");
    setTimeout(() => {
      const el = document.getElementById("stories-section");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-[var(--header-bg)] backdrop-blur-md"
      }`}>
        <div className="wide-width">
          <nav className="flex items-center justify-between h-[68px] md:h-[76px]">

            {/* Logo — Oswald ExtraLight/Light, large, mixed case like Kimi */}
            <Link href="/" className="group flex-shrink-0">
              <span className="font-serif font-extralight text-2xl md:text-[1.75rem] tracking-[0.04em] text-[var(--foreground)] group-hover:opacity-60 transition-opacity duration-200">
                The Solo Akash
              </span>
            </Link>

            {/* Desktop Nav — right side: links + search + theme */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[0.68rem] font-medium tracking-[0.18em] uppercase transition-colors duration-200 group ${
                    isActive(link.href)
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-[var(--foreground)] transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}

              {/* Social icons */}
              <a
                href="https://instagram.com/thesoloakash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
                </svg>
              </a>

              {/* Search icon */}
              <button
                onClick={handleSearch}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
                aria-label="Search"
              >
                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <ThemeToggle />
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] text-[var(--foreground)]"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-[var(--background)] z-[70] md:hidden transform transition-transform duration-300 ease-out border-l border-[var(--border)] ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex items-center justify-between px-6 h-[68px] border-b border-[var(--border)]">
          <span className="font-serif font-extralight text-base tracking-[0.04em] text-[var(--foreground)]">
            The Solo Akash
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-4 border-b border-[var(--border)] text-[0.68rem] font-medium tracking-[0.18em] uppercase transition-colors duration-150 ${
                isActive(link.href)
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="w-1 h-1 bg-[var(--foreground)] flex-shrink-0" />
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] tracking-[0.15em] uppercase text-[var(--muted)]">Appearance</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
