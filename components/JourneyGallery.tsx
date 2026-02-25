"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { JourneyImage } from "@/types/blog";

interface JourneyGalleryProps {
  images: JourneyImage[];
  journeyTitle?: string;
  journeyLocation?: string;
}

export default function JourneyGallery({ images, journeyLocation }: JourneyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "";
  };

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      switch (e.key) {
        case "Escape": closeLightbox(); break;
        case "ArrowLeft": goToPrevious(); break;
        case "ArrowRight": goToNext(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  const lightboxContent = selectedImage ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLightbox();
      }}
    >
      {/* Close button */}
      <button
        onClick={closeLightbox}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          padding: 8,
          color: "rgba(255,255,255,0.8)",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image counter */}
      <div style={{ position: "absolute", top: 16, left: 16, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
        {selectedIndex! + 1} / {images.length}
      </div>

      {/* Previous button */}
      {selectedIndex !== null && selectedIndex > 0 && (
        <button
          onClick={goToPrevious}
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            padding: 12,
            color: "rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {selectedIndex !== null && selectedIndex < images.length - 1 && (
        <button
          onClick={goToNext}
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            padding: 12,
            color: "rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={selectedImage.url}
        alt={selectedImage.alt || selectedImage.caption || ""}
        style={{
          maxWidth: "90%",
          maxHeight: "80%",
          objectFit: "contain",
        }}
      />

      {/* Watermark */}
      <div style={{
        position: "absolute",
        bottom: 60,
        right: 16,
        background: "rgba(0,0,0,0.5)",
        borderRadius: 4,
        padding: "4px 8px",
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>TheSoloAkash.com</span>
      </div>

      {/* Caption */}
      {(selectedImage.caption || selectedImage.location || journeyLocation) && (
        <div style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          maxWidth: 500,
          padding: "0 16px",
        }}>
          {selectedImage.caption && (
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 500, margin: 0 }}>{selectedImage.caption}</p>
          )}
          {(selectedImage.location || journeyLocation) && (
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {selectedImage.location || journeyLocation}
            </p>
          )}
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group bg-[var(--background-alt)]"
          >
            <Image
              src={image.url}
              alt={image.alt || image.caption || "Journey image"}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox via Portal - renders directly to document.body */}
      {mounted && selectedImage && createPortal(lightboxContent, document.body)}
    </>
  );
}
