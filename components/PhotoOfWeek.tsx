"use client";

import { useState } from "react";
import Image from "next/image";

interface PhotoOfWeekProps {
  imageUrl: string;
  title: string;
  location?: string;
  caption?: string;
  photographer?: string;
  date?: string;
}

export default function PhotoOfWeek({
  imageUrl,
  title,
  location,
  caption,
  photographer,
  date,
}: PhotoOfWeekProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <section className="py-12 md:py-20">
        <div className="wide-width">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs md:text-sm font-medium mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Photo of the Week
            </div>
            <h2 className="text-2xl md:text-4xl font-serif">{title}</h2>
            {location && (
              <p className="flex items-center justify-center gap-2 text-sm text-[var(--muted)] mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </p>
            )}
          </div>

          {/* Photo Container */}
          <div
            className="relative max-w-5xl mx-auto cursor-pointer group"
            onClick={() => setIsLightboxOpen(true)}
          >
            <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden bg-[var(--background-alt)]">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />

              {/* Shimmer placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton" />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption Card */}
            {(caption || photographer || date) && (
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md">
                <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg p-4 md:p-5 shadow-lg">
                  {caption && (
                    <p className="text-sm md:text-base font-serif italic text-[var(--foreground)] mb-2">
                      &ldquo;{caption}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    {photographer && <span>By {photographer}</span>}
                    {date && (
                      <span>
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Caption */}
          {(title || location) && (
            <div className="absolute bottom-4 left-4 right-4 text-center text-white">
              <h3 className="text-xl md:text-2xl font-serif mb-1">{title}</h3>
              {location && (
                <p className="text-sm text-white/70">{location}</p>
              )}
            </div>
          )}

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-4 text-xs text-white/50">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10">Esc</kbd> to close
          </div>
        </div>
      )}
    </>
  );
}
