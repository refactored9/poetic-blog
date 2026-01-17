"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface JourneyCoverImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  imageCount: number;
}

export default function JourneyCoverImage({
  src,
  alt,
  priority = false,
  imageCount,
}: JourneyCoverImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl group"
    >
      {/* Skeleton placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[var(--background-alt)] via-[var(--border-light)] to-[var(--background-alt)] transition-opacity duration-700 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        {/* Placeholder content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-[var(--muted)]/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-[var(--muted)]/40 text-xs">Loading...</p>
        </div>
      </div>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-alt)]">
          <div className="text-center text-[var(--muted)]">
            <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          sizes="(max-width: 768px) 100vw, 40vw"
          quality={70}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? "eager" : "lazy"}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Photo count badge */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 photo-badge">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-white text-sm font-medium">{imageCount}</span>
      </div>
    </div>
  );
}
