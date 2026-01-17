"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { JourneyImage } from "@/types/blog";

interface JourneyGalleryProps {
  images: JourneyImage[];
  journeyTitle?: string;
  journeyLocation?: string;
}

// Optimized image component with lazy loading
function LazyImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onClick?: () => void;
}) {
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
        rootMargin: "300px", // Start loading 300px before entering viewport
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
      className="absolute inset-0"
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[var(--background-alt)] via-[var(--border-light)] to-[var(--background-alt)] transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        {/* Placeholder icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--muted)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-alt)]">
          <div className="text-center text-[var(--muted)]">
            <svg className="w-6 h-6 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[10px]">Failed</p>
          </div>
        </div>
      )}

      {/* Image */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-all duration-700 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          } ${className}`}
          sizes={sizes}
          quality={60} // Lower quality for thumbnails
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}


export default function JourneyGallery({ images, journeyTitle, journeyLocation }: JourneyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
    document.body.style.overflow = "";
  };

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [selectedIndex, images.length]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  // Get aspect ratio class based on image index for visual variety
  const getAspectClass = (index: number) => {
    const patterns = [
      "aspect-[3/4]",
      "aspect-[4/3]",
      "aspect-square",
      "aspect-[2/3]",
      "aspect-[3/2]",
    ];
    return patterns[index % patterns.length];
  };

  return (
    <>
      {/* Artistic Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`group relative overflow-hidden rounded-lg md:rounded-xl cursor-pointer ${getAspectClass(index)} journey-image-card`}
          >
            <LazyImage
              src={image.url}
              alt={image.alt || image.caption || "Journey moment"}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={index < 4} // Only prioritize first 4 images
              onClick={() => openLightbox(index)}
            />

            {/* Elegant overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

            {/* Content on hover */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none">
              {image.caption && (
                <p className="text-white text-sm md:text-base font-medium line-clamp-2 drop-shadow-lg">
                  {image.caption}
                </p>
              )}
              {(image.location || journeyLocation) && (
                <p className="text-white/80 text-xs md:text-sm mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {image.location || journeyLocation}
                </p>
              )}
              {image.takenAt && (
                <p className="text-white/60 text-xs mt-1">
                  {new Date(image.takenAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Subtle corner accent */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-30 p-3 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation - Previous */}
          {selectedIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 text-white/80 hover:text-white transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Navigation - Next */}
          {selectedIndex < images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 text-white/80 hover:text-white transition-colors"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main image */}
          <div
            className="w-full h-full flex items-center justify-center p-4 md:p-12"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
          >
            <div
              className="relative transition-transform duration-150 ease-out"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              }}
            >
              {/* Loading state */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt || images[selectedIndex].caption || "Journey image"}
                className={`max-w-[90vw] max-h-[85vh] object-contain select-none transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                draggable={false}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Watermark overlay */}
              {imageLoaded && (
                <>
                  {/* Corner watermark */}
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded px-2 py-1 select-none pointer-events-none">
                    <p className="text-white/70 text-[10px] font-medium">TheSoloAkash.com</p>
                    <p className="text-white/40 text-[8px]">All rights reserved · <span className="pointer-events-auto"><Link href="/contact" className="underline" onClick={(e) => e.stopPropagation()}>Contact</Link></span></p>
                  </div>

                  {/* Center watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <p className="text-white/[0.03] text-3xl md:text-5xl font-serif tracking-widest -rotate-12">
                      TheSoloAkash.com
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent py-4 px-6">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-white/60 text-sm">
                {selectedIndex + 1} / {images.length}
                {journeyTitle && ` · ${journeyTitle}`}
              </p>
              {images[selectedIndex].caption && (
                <p className="text-white/90 text-sm mt-1 font-serif italic">{images[selectedIndex].caption}</p>
              )}
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-white text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              className="text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
