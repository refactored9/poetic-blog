"use client";

import Link from "next/link";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      await subscribeNewsletter(email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("idle");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-[var(--border)] overflow-hidden">
      {/* Giant faded watermark at bottom */}
      <div
        className="absolute bottom-0 left-0 font-serif font-light leading-none select-none pointer-events-none whitespace-nowrap"
        aria-hidden
        style={{
          fontSize: "clamp(60px, 14vw, 200px)",
          color: "rgba(22,22,22,0.035)",
          letterSpacing: "0.06em",
          lineHeight: 1,
        }}
      >
        THE SOLO AKASH
      </div>

      <div className="wide-width pt-16 pb-10 lg:pt-20 lg:pb-12 relative z-10">

        {/* ── TOP SECTION: Newsletter + Back to top + Columns ── */}
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 pb-14 mb-10 border-b border-[var(--border)]">

          {/* Newsletter */}
          <div className="lg:w-[300px] flex-shrink-0">
            <h3 className="font-serif font-light text-3xl md:text-4xl tracking-wide leading-tight mb-4">
              Join the Adventure
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-8 max-w-xs">
              Subscribe to receive exclusive travel stories, hidden gem discoveries, and inspiring reflections from the road.
            </p>

            {status === "success" ? (
              <p className="text-sm text-[var(--muted)] tracking-wide py-3 border-b border-[var(--border)]">
                You&apos;re on the list ✓
              </p>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div className="border-b border-[var(--foreground)] mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full py-3 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:outline-none tracking-wide"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:opacity-80 disabled:opacity-50 transition-opacity duration-200"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>

          {/* Columns + Back to top */}
          <div className="flex-1">
            {/* Back to top — top-right */}
            <div className="flex justify-end mb-10 lg:mb-12">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200 group"
              >
                Back to Top
                <svg className="w-3 h-3 transform group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>

            {/* Nav columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

              {/* EXPLORE */}
              <div>
                <h4 className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-6 font-medium">
                  Explore
                </h4>
                <nav className="flex flex-col gap-3.5">
                  {[
                    { href: "/", label: "Writings" },
                    { href: "/journeys", label: "Journeys" },
                    { href: "/people", label: "People" },
                    { href: "/about", label: "About" },
                    { href: "/gear", label: "Gear" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* TOPICS */}
              <div>
                <h4 className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-6 font-medium">
                  Topics
                </h4>
                <nav className="flex flex-col gap-3.5">
                  {[
                    "Mountains",
                    "Culture",
                    "Food & Chai",
                    "Solo Travel",
                    "Photography",
                    "Reflections",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="text-sm text-[var(--muted)]"
                    >
                      {topic}
                    </span>
                  ))}
                </nav>
              </div>

              {/* LEGAL */}
              <div>
                <h4 className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-6 font-medium">
                  Legal
                </h4>
                <nav className="flex flex-col gap-3.5">
                  <Link href="/privacy" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200">
                    Terms of Use
                  </Link>
                  <Link href="/contact" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200">
                    Contact
                  </Link>
                </nav>
              </div>

              {/* CONNECT */}
              <div>
                <h4 className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-6 font-medium">
                  Connect
                </h4>
                <div className="flex gap-3">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/thesoloakash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} strokeLinecap="round" />
                    </svg>
                  </a>
                  {/* Twitter/X */}
                  <a
                    href="https://twitter.com/thesoloakash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all duration-200"
                    aria-label="Twitter / X"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@thesoloakash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all duration-200"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--muted)]">
            &copy; {currentYear} The Solo Akash. All rights reserved.
          </p>
          <p className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--muted)]">
            Made with love for India
          </p>
        </div>
      </div>
    </footer>
  );
}
