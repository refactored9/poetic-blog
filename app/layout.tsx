import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentProtection from "@/components/ContentProtection";
import VisitorTracker from "@/components/VisitorTracker";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Solo Akash | A Poetic Journey",
    template: "%s | The Solo Akash",
  },
  description: "A quiet corner for thoughts, places, and poetry. Stories told through words and wanderings.",
  keywords: ["blog", "poetry", "travel", "places", "thoughts", "writing"],
  authors: [{ name: "Akash" }],
  creator: "Akash",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com",
    siteName: "The Solo Akash",
    title: "The Solo Akash | A Poetic Journey",
    description: "A quiet corner for thoughts, places, and poetry.",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://thesoloakash.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ContentProtection />
        <VisitorTracker />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
