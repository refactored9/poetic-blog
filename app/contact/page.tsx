import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with The Solo Akash. I'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="content-width">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 md:mb-12 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>

          <h1 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6">Let&apos;s Connect</h1>
          <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed max-w-xl">
            Whether you have a thought to share, a question to ask, or simply wish to say hello &mdash;
            I&apos;d be delighted to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-xl">
          <ContactForm />
        </div>

        {/* Alternative contact */}
        <div className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-[var(--border)]">
          <p className="text-xs md:text-sm text-[var(--muted)] mb-3 md:mb-4">
            Prefer a different way to connect?
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link
              href="/"
              className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
            >
              Read my writings
            </Link>
            <Link
              href="/journeys"
              className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
            >
              View my journeys
            </Link>
            <Link
              href="/about"
              className="text-xs md:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
            >
              Learn about me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
