"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { PlaceImage } from "@/types/blog";
import { uploadImage } from "@/lib/api";

interface ImageUploaderProps {
  images: PlaceImage[];
  onImagesChange: (images: PlaceImage[]) => void;
}

export default function ImageUploader({
  images,
  onImagesChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages: PlaceImage[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url,
          alt: file.name.split(".")[0],
          caption: "",
        });
      }

      onImagesChange([...images, ...newImages]);
    } catch {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleCaptionChange(id: string, caption: string) {
    const updated = images.map((img) =>
      img.id === id ? { ...img, caption } : img
    );
    onImagesChange(updated);
  }

  function handleAltChange(id: string, alt: string) {
    const updated = images.map((img) =>
      img.id === id ? { ...img, alt } : img
    );
    onImagesChange(updated);
  }

  function handleRemove(id: string) {
    onImagesChange(images.filter((img) => img.id !== id));
  }

  return (
    <div>
      <label className="block text-sm text-[var(--muted)] mb-3">
        Place Images
      </label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="hidden"
        id="image-upload"
      />

      <label
        htmlFor="image-upload"
        className="block w-full py-8 border-2 border-dashed border-[var(--border)] text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
      >
        {uploading ? (
          <span className="text-[var(--muted)]">Uploading...</span>
        ) : (
          <span className="text-[var(--muted)]">
            Click to add place images
          </span>
        )}
      </label>

      {images.length > 0 && (
        <div className="mt-6 space-y-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="border border-[var(--border)] p-4"
            >
              <div className="relative aspect-[3/2] mb-4 bg-[var(--border)]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemove(image.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-[var(--foreground)] text-[var(--background)] text-sm hover:bg-red-600 transition-colors"
                >
                  x
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Alt text (for accessibility)"
                  value={image.alt}
                  onChange={(e) => handleAltChange(image.id, e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border)] focus:border-[var(--accent)] outline-none"
                />
                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={image.caption || ""}
                  onChange={(e) =>
                    handleCaptionChange(image.id, e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border)] focus:border-[var(--accent)] outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
