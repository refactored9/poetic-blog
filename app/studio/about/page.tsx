"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { About, Gear, SocialLink } from "@/types/blog";
import { uploadImage } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const gearCategories = [
  { value: "camera", label: "Camera" },
  { value: "lens", label: "Lens" },
  { value: "audio", label: "Audio" },
  { value: "laptop", label: "Tech/Laptop" },
  { value: "accessories", label: "Accessories" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Other" },
];

export default function AboutAdminPage() {
  const [activeTab, setActiveTab] = useState<"about" | "gear">("about");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // About state
  const [about, setAbout] = useState<About | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Gear state
  const [gearItems, setGearItems] = useState<Gear[]>([]);
  const [editingGear, setEditingGear] = useState<Gear | null>(null);
  const [showGearForm, setShowGearForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [aboutRes, gearRes] = await Promise.all([
        fetch(`${API_URL}/about`),
        fetch(`${API_URL}/gear`),
      ]);

      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        setAbout(aboutData.data);
        setSocialLinks(aboutData.data?.socialLinks || []);
      }

      if (gearRes.ok) {
        const gearData = await gearRes.json();
        setGearItems(gearData.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "gear") {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      if (type === "profile") {
        setAbout((prev) => prev ? { ...prev, profileImage: url } : null);
      } else if (editingGear) {
        setEditingGear({ ...editingGear, image: url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  }

  async function saveAbout() {
    if (!about) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...about, socialLinks }),
      });

      if (res.ok) {
        alert("About saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving about:", error);
      alert("Failed to save about");
    } finally {
      setSaving(false);
    }
  }

  async function saveGear() {
    if (!editingGear) return;

    try {
      setSaving(true);
      const isNew = !editingGear.id;
      const url = isNew ? `${API_URL}/gear` : `${API_URL}/gear/${editingGear.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGear),
      });

      if (res.ok) {
        const data = await res.json();
        if (isNew) {
          setGearItems([...gearItems, data.data]);
        } else {
          setGearItems(gearItems.map((g) => (g.id === data.data.id ? data.data : g)));
        }
        setEditingGear(null);
        setShowGearForm(false);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving gear:", error);
      alert("Failed to save gear");
    } finally {
      setSaving(false);
    }
  }

  async function deleteGear(id: string) {
    if (!confirm("Delete this gear item?")) return;

    try {
      const res = await fetch(`${API_URL}/gear/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGearItems(gearItems.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error("Error deleting gear:", error);
    }
  }

  function addSocialLink() {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  }

  function updateSocialLink(index: number, field: keyof SocialLink, value: string) {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  }

  function removeSocialLink(index: number) {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  }

  function startNewGear() {
    setEditingGear({
      id: "",
      name: "",
      category: "other",
      description: "",
      image: "",
      amazonUrl: "",
      price: "",
      rating: 5,
      isFavorite: false,
      isPublished: true,
      order: gearItems.length,
    });
    setShowGearForm(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-20">
      <div className="wide-width">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/studio" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-serif">About & Gear</h1>
          </div>
          <p className="text-[var(--muted)]">Manage your profile and gear showcase</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${
              activeTab === "about"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            About Me
          </button>
          <button
            onClick={() => setActiveTab("gear")}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${
              activeTab === "gear"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Gear ({gearItems.length})
          </button>
        </div>

        {/* About Tab */}
        {activeTab === "about" && about && (
          <div className="space-y-8">
            {/* Profile Image */}
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4">Profile Image</h2>
              <div className="flex items-start gap-6">
                <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-[var(--background-alt)]">
                  {about.profileImage ? (
                    <Image src={about.profileImage} alt="Profile" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <label className="btn btn-secondary cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "profile")}
                      className="hidden"
                    />
                    Upload Image
                  </label>
                  <p className="text-xs text-[var(--muted)] mt-2">Recommended: Square image, at least 400x400px</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={about.name}
                    onChange={(e) => setAbout({ ...about, name: e.target.value })}
                    className="input w-full"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tagline</label>
                  <input
                    type="text"
                    value={about.tagline}
                    onChange={(e) => setAbout({ ...about, tagline: e.target.value })}
                    className="input w-full"
                    placeholder="Writer & Traveler"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={about.location || ""}
                    onChange={(e) => setAbout({ ...about, location: e.target.value })}
                    className="input w-full"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={about.email || ""}
                    onChange={(e) => setAbout({ ...about, email: e.target.value })}
                    className="input w-full"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4">Bio</h2>
              <p className="text-sm text-[var(--muted)] mb-4">
                A short bio about yourself
              </p>
              <RichTextEditor
                value={about.bio}
                onChange={(value) => setAbout({ ...about, bio: value })}
                placeholder="Write a short bio about yourself..."
              />
            </div>

            {/* Story */}
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4">My Story</h2>
              <p className="text-sm text-[var(--muted)] mb-4">
                A longer narrative about your journey (optional)
              </p>
              <RichTextEditor
                value={about.story || ""}
                onChange={(value) => setAbout({ ...about, story: value })}
                placeholder="Tell your story..."
              />
            </div>

            {/* Social Links */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Social Links</h2>
                <button onClick={addSocialLink} className="btn btn-secondary btn-sm">
                  Add Link
                </button>
              </div>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                      className="input w-40"
                    >
                      <option value="">Platform</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                      className="input flex-1"
                      placeholder="https://..."
                    />
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="p-2 text-[var(--error)] hover:bg-red-50 rounded"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button onClick={saveAbout} disabled={saving} className="btn btn-accent">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Gear Tab */}
        {activeTab === "gear" && (
          <div>
            {/* Add Gear Button */}
            <div className="flex justify-end mb-6">
              <button onClick={startNewGear} className="btn btn-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Gear
              </button>
            </div>

            {/* Gear Form Modal */}
            {showGearForm && editingGear && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-[var(--background)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-[var(--border)]">
                    <h2 className="text-xl font-serif">
                      {editingGear.id ? "Edit Gear" : "Add New Gear"}
                    </h2>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Image</label>
                      <div className="flex items-start gap-4">
                        {editingGear.image && (
                          <div className="relative w-24 h-24 rounded bg-white">
                            <Image
                              src={editingGear.image}
                              alt="Gear"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        )}
                        <label className="btn btn-secondary cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "gear")}
                            className="hidden"
                          />
                          Upload
                        </label>
                      </div>
                    </div>

                    {/* Name & Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          value={editingGear.name}
                          onChange={(e) => setEditingGear({ ...editingGear, name: e.target.value })}
                          className="input w-full"
                          placeholder="Product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                          value={editingGear.category}
                          onChange={(e) =>
                            setEditingGear({ ...editingGear, category: e.target.value as Gear["category"] })
                          }
                          className="input w-full"
                        >
                          {gearCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={editingGear.description || ""}
                        onChange={(e) => setEditingGear({ ...editingGear, description: e.target.value })}
                        className="input w-full min-h-[100px]"
                        placeholder="Brief description..."
                      />
                    </div>

                    {/* Amazon URL & Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Amazon URL</label>
                        <input
                          type="url"
                          value={editingGear.amazonUrl || ""}
                          onChange={(e) => setEditingGear({ ...editingGear, amazonUrl: e.target.value })}
                          className="input w-full"
                          placeholder="https://amazon.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <input
                          type="text"
                          value={editingGear.price || ""}
                          onChange={(e) => setEditingGear({ ...editingGear, price: e.target.value })}
                          className="input w-full"
                          placeholder="$299"
                        />
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingGear.isFavorite}
                          onChange={(e) => setEditingGear({ ...editingGear, isFavorite: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Mark as Favorite</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingGear.isPublished}
                          onChange={(e) => setEditingGear({ ...editingGear, isPublished: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Published</span>
                      </label>
                    </div>
                  </div>
                  <div className="p-6 border-t border-[var(--border)] flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setEditingGear(null);
                        setShowGearForm(false);
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button onClick={saveGear} disabled={saving} className="btn btn-accent">
                      {saving ? "Saving..." : "Save Gear"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gear List */}
            {gearItems.length === 0 ? (
              <div className="card p-12 text-center">
                <svg className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h2 className="text-xl font-serif mb-2">No gear yet</h2>
                <p className="text-[var(--muted)] mb-6">Add your favorite equipment to showcase</p>
                <button onClick={startNewGear} className="btn btn-accent">
                  Add Your First Gear
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gearItems.map((item) => (
                  <div key={item.id} className="card p-4 group">
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="relative w-20 h-20 rounded bg-white flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-[var(--muted)] uppercase">{item.category}</p>
                            <h3 className="font-medium truncate">{item.name}</h3>
                            {item.price && <p className="text-sm text-[var(--accent)]">{item.price}</p>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingGear(item);
                                setShowGearForm(true);
                              }}
                              className="p-1 hover:bg-[var(--background-alt)] rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteGear(item.id)}
                              className="p-1 hover:bg-red-50 rounded text-[var(--error)]"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {item.isFavorite && (
                            <span className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded">
                              Favorite
                            </span>
                          )}
                          {!item.isPublished && (
                            <span className="text-xs bg-[var(--background-alt)] text-[var(--muted)] px-2 py-0.5 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
