"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { uploadImage, uploadMultipleImages } from "@/lib/api";
import { GuideFormData, GuideHighlight, GuideGalleryImage } from "@/types/blog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const defaultFormData: GuideFormData = {
  name: "",
  tagline: "",
  bio: "",
  profileImage: "",
  coverImage: "",
  location: { city: "", state: "", country: "India" },
  areasOfOperation: [],
  experienceYears: 0,
  languages: [],
  specializations: [],
  contact: {},
  priceRange: { currency: "INR", unit: "per day" },
  galleryImages: [],
  highlights: [],
  isAvailable: true,
  availabilityNote: "",
  isPublished: false,
  isFeatured: false,
};

export default function GuideEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const guideId = isNew ? null : params.id;

  const [formData, setFormData] = useState<GuideFormData>(defaultFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temp inputs for array fields
  const [newArea, setNewArea] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newSpecialization, setNewSpecialization] = useState("");

  useEffect(() => {
    if (!isNew && guideId) {
      loadGuide();
    }
  }, [isNew, guideId]);

  async function loadGuide() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/guides/${guideId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          tagline: data.tagline || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
          coverImage: data.coverImage || "",
          location: data.location || { city: "", state: "", country: "India" },
          areasOfOperation: data.areasOfOperation || [],
          experienceYears: data.experienceYears || 0,
          languages: data.languages || [],
          specializations: data.specializations || [],
          contact: data.contact || {},
          priceRange: data.priceRange || { currency: "INR", unit: "per day" },
          galleryImages: data.galleryImages || [],
          highlights: data.highlights || [],
          isAvailable: data.isAvailable ?? true,
          availabilityNote: data.availabilityNote || "",
          isPublished: data.isPublished || false,
          isFeatured: data.isFeatured || false,
        });
      } else {
        setError("Guide not found");
      }
    } catch (err) {
      setError("Failed to load guide");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(publish = false) {
    if (!formData.name.trim()) {
      setError("Please enter a name");
      return;
    }
    if (!formData.bio.trim()) {
      setError("Please enter a bio");
      return;
    }
    if (!formData.location.city.trim()) {
      setError("Please enter a city");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
        isPublished: publish ? true : formData.isPublished,
      };

      const url = isNew ? `${API_URL}/guides` : `${API_URL}/guides/${guideId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/studio/people");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save guide");
      }
    } catch (err) {
      setError("Failed to save guide");
    } finally {
      setSaving(false);
    }
  }

  async function handleProfileImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, profileImage: url }));
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleCoverImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const urls = await uploadMultipleImages(Array.from(files));
      const newImages: GuideGalleryImage[] = urls.map((url) => ({
        url,
        caption: "",
        alt: "",
      }));
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...newImages],
      }));
    } catch (err) {
      setError("Failed to upload images");
    } finally {
      setUploading(false);
    }
  }

  function addHighlight() {
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), { title: "", description: "" }],
    }));
  }

  function updateHighlight(index: number, updates: Partial<GuideHighlight>) {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights?.map((h, i) => (i === index ? { ...h, ...updates } : h)),
    }));
  }

  function removeHighlight(index: number) {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index),
    }));
  }

  function addToArray(field: "areasOfOperation" | "languages" | "specializations", value: string) {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
  }

  function removeFromArray(field: "areasOfOperation" | "languages" | "specializations", index: number) {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index),
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
            <Link href="/studio/people" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif">
              {isNew ? "New Guide" : "Edit Guide"}
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
          {/* Images */}
          <div className="card p-4 md:p-6 space-y-4">
            <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
              Profile Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Image */}
              <div>
                <label className="block text-sm mb-1.5">Profile Photo</label>
                <div className="relative aspect-square w-32 rounded-xl overflow-hidden bg-[var(--background-alt)] border-2 border-dashed border-[var(--border)]">
                  {formData.profileImage ? (
                    <>
                      <Image src={formData.profileImage} alt="Profile" fill className="object-cover" />
                      <button
                        onClick={() => setFormData((prev) => ({ ...prev, profileImage: "" }))}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--background-alt)]">
                      <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-[var(--muted)] mt-1">Upload</span>
                      <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm mb-1.5">Cover Image</label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--background-alt)] border-2 border-dashed border-[var(--border)]">
                  {formData.coverImage ? (
                    <>
                      <Image src={formData.coverImage} alt="Cover" fill className="object-cover" />
                      <button
                        onClick={() => setFormData((prev) => ({ ...prev, coverImage: "" }))}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--background-alt)]">
                      <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-[var(--muted)] mt-1">Upload Cover</span>
                      <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="card p-4 md:p-6 space-y-4">
            <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g., Mountain Guide & Adventure Expert"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1.5">Bio *</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell the story of this guide..."
                rows={5}
                className="textarea-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1.5">City *</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value },
                    }))
                  }
                  placeholder="e.g., Manali"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">State</label>
                <input
                  type="text"
                  value={formData.location.state || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, state: e.target.value },
                    }))
                  }
                  placeholder="e.g., Himachal Pradesh"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Country</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, country: e.target.value },
                    }))
                  }
                  placeholder="India"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1.5">Years of Experience</label>
              <input
                type="number"
                value={formData.experienceYears || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))
                }
                placeholder="5"
                min="0"
                className="input-field w-32"
              />
            </div>
          </div>

          {/* Areas, Languages, Specializations */}
          <div className="card p-4 md:p-6 space-y-4">
            <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
              Expertise
            </h2>

            {/* Areas of Operation */}
            <div>
              <label className="block text-sm mb-1.5">Areas of Operation</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="e.g., Spiti Valley"
                  className="input-field flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("areasOfOperation", newArea);
                      setNewArea("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray("areasOfOperation", newArea);
                    setNewArea("");
                  }}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.areasOfOperation?.map((area, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--background-alt)] rounded-lg text-sm"
                  >
                    {area}
                    <button onClick={() => removeFromArray("areasOfOperation", index)} className="text-[var(--muted)] hover:text-[var(--error)]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm mb-1.5">Languages</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="e.g., Hindi"
                  className="input-field flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("languages", newLanguage);
                      setNewLanguage("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray("languages", newLanguage);
                    setNewLanguage("");
                  }}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages?.map((lang, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--background-alt)] rounded-lg text-sm"
                  >
                    {lang}
                    <button onClick={() => removeFromArray("languages", index)} className="text-[var(--muted)] hover:text-[var(--error)]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm mb-1.5">Specializations</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="e.g., Trekking"
                  className="input-field flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("specializations", newSpecialization);
                      setNewSpecialization("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray("specializations", newSpecialization);
                    setNewSpecialization("");
                  }}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specializations?.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--background-alt)] rounded-lg text-sm"
                  >
                    {spec}
                    <button onClick={() => removeFromArray("specializations", index)} className="text-[var(--muted)] hover:text-[var(--error)]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Pricing */}
          <div className="card p-4 md:p-6 space-y-4">
            <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
              Contact & Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.contact?.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                    }))
                  }
                  placeholder="guide@example.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={formData.contact?.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value },
                    }))
                  }
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.contact?.whatsapp || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, whatsapp: e.target.value },
                    }))
                  }
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Instagram</label>
                <input
                  type="text"
                  value={formData.contact?.instagram || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, instagram: e.target.value },
                    }))
                  }
                  placeholder="@username"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-1.5">Min Price</label>
                <input
                  type="number"
                  value={formData.priceRange?.min || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange!, min: parseInt(e.target.value) || undefined },
                    }))
                  }
                  placeholder="1000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Max Price</label>
                <input
                  type="number"
                  value={formData.priceRange?.max || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange!, max: parseInt(e.target.value) || undefined },
                    }))
                  }
                  placeholder="5000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Currency</label>
                <select
                  value={formData.priceRange?.currency || "INR"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange!, currency: e.target.value },
                    }))
                  }
                  className="input-field"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5">Per</label>
                <select
                  value={formData.priceRange?.unit || "per day"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange!, unit: e.target.value },
                    }))
                  }
                  className="input-field"
                >
                  <option value="per day">Per Day</option>
                  <option value="per trip">Per Trip</option>
                  <option value="per person">Per Person</option>
                </select>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="card p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
                Highlights / What I Offer
              </h2>
              <button onClick={addHighlight} className="text-sm text-[var(--accent)] hover:underline">
                + Add Highlight
              </button>
            </div>

            {formData.highlights && formData.highlights.length > 0 && (
              <div className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-[var(--background-alt)] rounded-lg">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={highlight.title}
                        onChange={(e) => updateHighlight(index, { title: e.target.value })}
                        placeholder="Title (e.g., Expert Navigation)"
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={highlight.description || ""}
                        onChange={(e) => updateHighlight(index, { description: e.target.value })}
                        placeholder="Description (optional)"
                        className="input-field"
                      />
                    </div>
                    <button onClick={() => removeHighlight(index)} className="text-[var(--error)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="card p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
                Gallery ({formData.galleryImages?.length || 0})
              </h2>
              <label className="btn btn-secondary text-sm cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? "Uploading..." : "Add Photos"}
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} className="hidden" />
              </label>
            </div>

            {formData.galleryImages && formData.galleryImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {formData.galleryImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-[var(--background-alt)]">
                    <Image src={image.url} alt={image.alt || ""} fill className="object-cover" />
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          galleryImages: prev.galleryImages?.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-red-500"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="card p-4 md:p-6 space-y-4">
            <h2 className="font-medium text-sm text-[var(--muted)] uppercase tracking-wide">
              Status
            </h2>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm">Available for bookings</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm">Featured guide</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm">Published</span>
              </label>
            </div>

            <div>
              <label className="block text-sm mb-1.5">Availability Note</label>
              <input
                type="text"
                value={formData.availabilityNote || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, availabilityNote: e.target.value }))}
                placeholder="e.g., Available weekends only"
                className="input-field"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
            <Link href="/studio/people" className="btn btn-secondary justify-center">
              Cancel
            </Link>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="btn btn-secondary justify-center disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="btn btn-accent justify-center disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
