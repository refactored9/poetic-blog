import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for The Solo Akash - how we handle your data and protect your privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6 md:mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>

          <h1 className="text-2xl md:text-4xl font-serif mb-2 md:mb-3">Privacy Policy</h1>
          <p className="text-[var(--muted)] text-sm md:text-base">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-sm md:prose max-w-none [&_h2]:text-lg md:[&_h2]:text-xl [&_h2]:mt-6 md:[&_h2]:mt-8 [&_h2]:mb-3 md:[&_h2]:mb-4 [&_p]:text-sm md:[&_p]:text-base [&_li]:text-sm md:[&_li]:text-base">
          <p>
            Welcome to The Solo Akash. Your privacy matters deeply to us. This policy explains how we collect,
            use, and protect your information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect minimal information to provide you with a better experience:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1.5 md:space-y-2 text-[var(--foreground-soft)]">
            <li>
              <strong>Usage Data:</strong> We may collect anonymous information about how you interact with our
              website, including pages visited, time spent, and general browsing patterns.
            </li>
            <li>
              <strong>Cookies:</strong> We use essential cookies to ensure the website functions properly.
              These do not track personal information.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            Any information collected is used solely to:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1.5 md:space-y-2 text-[var(--foreground-soft)]">
            <li>Improve the website experience and content</li>
            <li>Understand how visitors engage with our writings and journeys</li>
            <li>Maintain the security and functionality of the website</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            We may use third-party services for hosting and analytics. These services have their own privacy
            policies and may collect data according to their terms. We do not sell or share your personal
            information with third parties for marketing purposes.
          </p>

          <h2>Content Protection</h2>
          <p>
            To protect the creative works shared on this website, we have implemented measures to prevent
            unauthorized copying of text and images. All content remains the intellectual property of
            The Solo Akash unless otherwise stated.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1.5 md:space-y-2 text-[var(--foreground-soft)]">
            <li>Access any personal data we may have about you</li>
            <li>Request deletion of your data</li>
            <li>Opt out of any non-essential data collection</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be reflected on this page
            with an updated revision date.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy or how we handle your data, please{" "}
            <Link href="/contact" className="text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors">
              reach out through our contact page
            </Link>.
          </p>
        </div>

        {/* Footer navigation */}
        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link
              href="/terms"
              className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="/contact"
              className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/"
              className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Writings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
