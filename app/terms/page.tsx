import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for The Solo Akash - guidelines for using our website and content.",
};

export default function TermsOfUsePage() {
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

          <h1 className="text-2xl md:text-4xl font-serif mb-2 md:mb-3">Terms of Use</h1>
          <p className="text-[var(--muted)] text-sm md:text-base">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-sm md:prose max-w-none [&_h2]:text-lg md:[&_h2]:text-xl [&_h2]:mt-6 md:[&_h2]:mt-8 [&_h2]:mb-3 md:[&_h2]:mb-4 [&_p]:text-sm md:[&_p]:text-base [&_li]:text-sm md:[&_li]:text-base">
          <p>
            Welcome to The Solo Akash. By accessing and using this website, you agree to be bound by these
            terms of use. Please read them carefully.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By visiting, reading, or otherwise using this website, you acknowledge that you have read,
            understood, and agree to be bound by these terms. If you do not agree to these terms,
            please do not use this website.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1.5 md:space-y-2 text-[var(--foreground-soft)]">
            <li>Written articles, blog posts, and poetry</li>
            <li>Photographs and images</li>
            <li>Design elements and graphics</li>
            <li>Website layout and code</li>
          </ul>
          <p>
            is the exclusive property of The Solo Akash and is protected by copyright and other intellectual
            property laws. You may not reproduce, distribute, modify, or create derivative works from any
            content without explicit written permission.
          </p>

          <h2>Permitted Use</h2>
          <p>
            You are welcome to:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1.5 md:space-y-2 text-[var(--foreground-soft)]">
            <li>Browse and read the content for personal, non-commercial purposes</li>
            <li>Share links to our content on social media with proper attribution</li>
            <li>Quote brief excerpts with clear attribution and a link back to the original</li>
          </ul>

          <h2>Prohibited Use</h2>
          <p>
            You may not:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1.5 md:space-y-2 text-[var(--foreground-soft)]">
            <li>Copy, reproduce, or download content for commercial purposes</li>
            <li>Remove or alter any copyright notices or watermarks</li>
            <li>Use automated tools to scrape or download content</li>
            <li>Frame or mirror the website without permission</li>
            <li>Attempt to bypass content protection measures</li>
            <li>Use the content in any way that could damage our reputation</li>
          </ul>

          <h2>Photography and Images</h2>
          <p>
            All photographs displayed on this website are original works and are protected by copyright.
            Downloading, saving, or using these images without written permission is strictly prohibited.
            For licensing inquiries or permission to use any images, please contact us directly.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The content on this website is provided for general informational and entertainment purposes.
            While we strive for accuracy, we make no warranties or representations about the completeness,
            accuracy, or reliability of any content. Your use of any information on this website is at
            your own risk.
          </p>

          <h2>External Links</h2>
          <p>
            This website may contain links to external websites. We are not responsible for the content,
            privacy practices, or terms of any third-party websites. Visiting external links is at your
            own discretion and risk.
          </p>

          <h2>Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time without prior notice. Continued use of
            the website after changes constitutes acceptance of the new terms. We encourage you to review
            this page periodically.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India,
            without regard to its conflict of law provisions.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these terms or wish to request permission for any use not
            covered here, please{" "}
            <Link href="/contact" className="text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors">
              reach out through our contact page
            </Link>.
          </p>
        </div>

        {/* Footer navigation */}
        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link
              href="/privacy"
              className="text-xs md:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Privacy Policy
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
