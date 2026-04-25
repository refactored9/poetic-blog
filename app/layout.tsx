import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentProtection from "@/components/ContentProtection";
import VisitorTracker from "@/components/VisitorTracker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import BackToTop from "@/components/BackToTop";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import StarField from "@/components/StarField";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com";
const DEFAULT_OG_IMAGE = "/opengraph-image";

export const metadata: Metadata = {
  title: {
    default: "The Solo Akash | A Poetic Journey",
    template: "%s | The Solo Akash",
  },
  description: "A quiet corner for thoughts, places, and poetry. Stories told through words and wanderings.",
  keywords: ["blog", "poetry", "travel", "places", "thoughts", "writing", "solo travel", "adventure", "photography"],
  authors: [{ name: "Akash" }],
  creator: "Akash",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "The Solo Akash",
    title: "The Solo Akash | A Poetic Journey",
    description: "A quiet corner for thoughts, places, and poetry.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "The Solo Akash",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Solo Akash | A Poetic Journey",
    description: "A quiet corner for thoughts, places, and poetry.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <StarField />
          <ToastProvider>
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--foreground)] focus:text-[var(--background)] focus:rounded-lg focus:outline-none"
            >
              Skip to content
            </a>
            <ContentProtection />
            <VisitorTracker />
            <Header />
            <main id="main-content" className="flex-1 animate-page-in" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <BackToTop />
            <KeyboardShortcuts />
            <ServiceWorkerRegistration />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
