"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  onClick?: () => void;
  blurDataURL?: string;
  placeholderColor?: string;
}

// Generate a simple color-based blur placeholder
function generatePlaceholderColor(src: string): string {
  // Generate a color based on the image URL hash
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    const char = src.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Generate warm, muted colors that fit the aesthetic
  const hue = Math.abs(hash % 60) + 20; // Warm tones (20-80)
  const saturation = Math.abs((hash >> 8) % 15) + 10; // Low saturation (10-25%)
  const lightness = Math.abs((hash >> 16) % 20) + 60; // Light (60-80%)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Create a simple blur data URL
function createBlurDataURL(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  quality = 75,
  onClick,
  blurDataURL,
  placeholderColor,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate placeholder color/blur
  const bgColor = placeholderColor || generatePlaceholderColor(src);
  const blurPlaceholder = blurDataURL || createBlurDataURL(bgColor);

  // Intersection Observer for lazy loading
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
        rootMargin: "200px", // Start loading 200px before entering viewport
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
      className={`relative overflow-hidden ${fill ? "w-full h-full" : ""}`}
      onClick={onClick}
    >
      {/* Blur/Color placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ backgroundColor: bgColor }}
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-alt)]">
          <div className="text-center text-[var(--muted)]">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}

      {/* Actual image - only render when in view */}
      {isInView && !hasError && (
        <>
          {fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              className={`object-cover transition-all duration-700 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } ${className}`}
              sizes={sizes}
              quality={quality}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              loading={priority ? "eager" : "lazy"}
              placeholder={blurPlaceholder ? "blur" : "empty"}
              blurDataURL={blurPlaceholder}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={`transition-all duration-700 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } ${className}`}
              sizes={sizes}
              quality={quality}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              loading={priority ? "eager" : "lazy"}
              placeholder={blurPlaceholder ? "blur" : "empty"}
              blurDataURL={blurPlaceholder}
            />
          )}
        </>
      )}
    </div>
  );
}
