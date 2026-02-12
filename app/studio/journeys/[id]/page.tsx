"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { uploadMultipleImages } from "@/lib/api";
import { JourneyRoute } from "@/types/blog";
import RouteEditor from "@/components/RouteEditor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface JourneyImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
}

interface JourneyFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  coverImage: string;
  images: JourneyImage[];
  isPublished: boolean;
  route?: JourneyRoute;
}

export default function JourneyEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const journeyId = isNew ? null : params.id;

  const [formData, setFormData] = useState<JourneyFormData>({
    title: "",
    description: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    coverImage: "",
    images: [],
    isPublished: false,
    route: undefined,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && journeyId) {
      loadJourney();
    }
  }, [isNew, journeyId]);

  async function loadJourney() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/journeys/${journeyId}`);
      if (res.ok) {
        const data = await res.json();
        const journey = data.data || data;
        setFormData({
          title: journey.title || "",
          description: journey.description || "",
          location: journey.location || "",
          date: journey.date ? new Date(journey.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          coverImage: journey.coverImage || "",
          images: journey.images || [],
          isPublished: journey.isPublished || false,
          route: journey.route || undefined,
        });
      } else {
        setError("Journey not found");
      }
    } catch (err) {
      setError("Failed to load journey");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(publish = false) {
    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
        isPublished: publish ? true : formData.isPublished,
      };

      const url = isNew ? `${API_URL}/journeys` : `${API_URL}/journeys/${journeyId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/studio/journeys");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save journey");
      }
    } catch (err) {
      setError("Failed to save journey");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      const urls = await uploadMultipleImages(Array.from(files));

      const newImages: JourneyImage[] = urls.map((url, index) => ({
        id: `img-${Date.now()}-${index}`,
        url,
        caption: "",
        alt: "",
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
        coverImage: prev.coverImage || urls[0] || "",
      }));
    } catch (err) {
      setError("Failed to upload images");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(imageId: string) {
    setFormData((prev) => {
      const newImages = prev.images.filter((img) => img.id !== imageId);
      const removedImage = prev.images.find((img) => img.id === imageId);

      return {
        ...prev,
        images: newImages,
        coverImage: prev.coverImage === removedImage?.url ? (newImages[0]?.url || "") : prev.coverImage,
      };
    });
  }

  function setCoverImage(url: string) {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  }

  function updateImageCaption(imageId: string, caption: string) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.id === imageId ? { ...img, caption } : img
      ),
    }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-20">
      <div className="wide-width max-w-4xl">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <Link href="/studio/journeys" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif">
              {isNew ? "New Journey" : "Edit Journey"}
            </h1>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card p-4 md:p-6 space-y-4">
            <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm mb-1.5">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Summer in the Alps"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Swiss Alps, Switzerland"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="A brief description of this journey..."
                rows={3}
                className="textarea-field"
              />
            </div>
          </div>

          {/* Images */}
          <div className="card p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
                Photos ({formData.images.length})
              </h2>
              <label className="btn btn-secondary text-sm cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? "Uploading..." : "Add Photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {formData.images.length === 0 ? (
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
                <svg className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[var(--muted)] text-sm mb-2">No photos yet</p>
                <p className="text-[var(--muted-soft)] text-xs">Click "Add Photos" to upload images for this journey</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {formData.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--background-alt)]">
                      <Image
                        src={image.url}
                        alt={image.alt || image.caption || "Journey photo"}
                        fill
                        className="object-cover"
                      />

                      {/* Cover badge */}
                      {formData.coverImage === image.url && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--accent)] text-white text-xs rounded">
                          Cover
                        </div>
                      )}

                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {formData.coverImage !== image.url && (
                          <button
                            onClick={() => setCoverImage(image.url)}
                            className="p-2 bg-white rounded-full text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                            title="Set as cover"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 bg-white rounded-full text-[var(--error)] hover:bg-red-500 hover:text-white transition-colors"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Caption input */}
                    <input
                      type="text"
                      value={image.caption || ""}
                      onChange={(e) => updateImageCaption(image.id, e.target.value)}
                      placeholder="Add caption..."
                      className="mt-2 w-full px-2 py-1 text-xs border border-[var(--border)] rounded focus:border-[var(--accent)] outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Route Editor */}
          <RouteEditor
            route={formData.route}
            onChange={(route) => setFormData((prev) => ({ ...prev, route }))}
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.isPublished}
                onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <label htmlFor="published" className="text-sm text-[var(--muted)]">
                Published
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/studio/journeys" className="btn btn-secondary flex-1 sm:flex-initial justify-center">
                Cancel
              </Link>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="btn btn-secondary flex-1 sm:flex-initial justify-center disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="btn btn-accent flex-1 sm:flex-initial justify-center disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
